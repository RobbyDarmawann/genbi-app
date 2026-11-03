<?php

namespace App\Actions\Kegiatan;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Kehadiran;
use App\Models\PoinTransaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ReviewAttendanceAction
{
    /**
     * Setujui kehadiran menunggu tinjau: ubah status valid dan kredit poin.
     */
    public function approve(Kehadiran $kehadiran, User $actor, ?string $ipAddress = null): Kehadiran
    {
        return DB::transaction(function () use ($kehadiran, $actor, $ipAddress): Kehadiran {
            /** @var Kehadiran $lockedKehadiran */
            $lockedKehadiran = Kehadiran::query()
                ->with(['pendaftaran.kegiatan', 'pendaftaran.mahasiswa'])
                ->lockForUpdate()
                ->findOrFail($kehadiran->id);

            $kegiatan = $lockedKehadiran->pendaftaran->kegiatan;

            if ($kegiatan->status === StatusKegiatan::Terkunci) {
                throw ValidationException::withMessages([
                    'kehadiran' => 'Kehadiran tidak dapat ditinjau karena kegiatan telah terkunci.',
                ]);
            }

            if ($lockedKehadiran->status !== StatusKehadiran::MenungguTinjau) {
                throw ValidationException::withMessages([
                    'kehadiran' => 'Hanya kehadiran berstatus menunggu tinjau yang dapat disetujui.',
                ]);
            }

            $existingPoin = $lockedKehadiran->poinTransaksi()->exists();
            if ($existingPoin) {
                throw ValidationException::withMessages([
                    'kehadiran' => 'Poin untuk kehadiran ini sudah pernah dibuat. Hindari duplikasi.',
                ]);
            }

            $lockedKehadiran->update([
                'status' => StatusKehadiran::Valid,
                'alasan_penolakan' => null,
            ]);

            $bobotPoin = (int) ($kegiatan->bobot()
                ->where('peran', $lockedKehadiran->pendaftaran->peran)
                ->value('poin') ?? 0);

            if ($bobotPoin > 0) {
                PoinTransaksi::query()->create([
                    'mahasiswa_id' => $lockedKehadiran->pendaftaran->mahasiswa_id,
                    'kegiatan_id' => $kegiatan->id,
                    'kehadiran_id' => $lockedKehadiran->id,
                    'tipe' => TipePoin::Kredit,
                    'jumlah' => $bobotPoin,
                    'keterangan' => sprintf(
                        'Poin kehadiran disetujui untuk kegiatan "%s" sebagai %s',
                        $kegiatan->judul,
                        $lockedKehadiran->pendaftaran->peran->label()
                    ),
                    'dibuat_oleh' => $actor->id,
                ]);
            }

            AuditLog::catat(
                aksi: 'kehadiran.approved',
                userId: $actor->id,
                subjectType: Kehadiran::class,
                subjectId: $lockedKehadiran->id,
                metadata: [
                    'kegiatan_id' => $kegiatan->id,
                    'judul_kegiatan' => $kegiatan->judul,
                    'mahasiswa_id' => $lockedKehadiran->pendaftaran->mahasiswa_id,
                    'nim' => $lockedKehadiran->pendaftaran->mahasiswa->nim,
                    'poin_terkredit' => $bobotPoin,
                ],
                ipAddress: $ipAddress,
            );

            return $lockedKehadiran->refresh();
        });
    }

    /**
     * Tolak kehadiran menunggu tinjau: ubah status ditolak tanpa poin.
     */
    public function reject(Kehadiran $kehadiran, string $alasan, User $actor, ?string $ipAddress = null): Kehadiran
    {
        return DB::transaction(function () use ($kehadiran, $alasan, $actor, $ipAddress): Kehadiran {
            /** @var Kehadiran $lockedKehadiran */
            $lockedKehadiran = Kehadiran::query()
                ->with(['pendaftaran.kegiatan', 'pendaftaran.mahasiswa'])
                ->lockForUpdate()
                ->findOrFail($kehadiran->id);

            $kegiatan = $lockedKehadiran->pendaftaran->kegiatan;

            if ($kegiatan->status === StatusKegiatan::Terkunci) {
                throw ValidationException::withMessages([
                    'kehadiran' => 'Kehadiran tidak dapat ditinjau karena kegiatan telah terkunci.',
                ]);
            }

            if ($lockedKehadiran->status !== StatusKehadiran::MenungguTinjau) {
                throw ValidationException::withMessages([
                    'kehadiran' => 'Hanya kehadiran berstatus menunggu tinjau yang dapat ditolak.',
                ]);
            }

            $lockedKehadiran->update([
                'status' => StatusKehadiran::Ditolak,
                'alasan_penolakan' => $alasan,
            ]);

            AuditLog::catat(
                aksi: 'kehadiran.rejected',
                userId: $actor->id,
                subjectType: Kehadiran::class,
                subjectId: $lockedKehadiran->id,
                metadata: [
                    'kegiatan_id' => $kegiatan->id,
                    'judul_kegiatan' => $kegiatan->judul,
                    'mahasiswa_id' => $lockedKehadiran->pendaftaran->mahasiswa_id,
                    'nim' => $lockedKehadiran->pendaftaran->mahasiswa->nim,
                    'alasan' => $alasan,
                ],
                ipAddress: $ipAddress,
            );

            return $lockedKehadiran->refresh();
        });
    }
}

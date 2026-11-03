<?php

namespace App\Actions\Koreksi;

use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Enums\SumberKehadiran;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Kehadiran;
use App\Models\Koreksi;
use App\Models\PoinTransaksi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DecideCorrection
{
    public function handle(Koreksi $koreksi, bool $approve, ?string $note, User $actor, ?string $ipAddress = null): Koreksi
    {
        return DB::transaction(function () use ($koreksi, $approve, $note, $actor, $ipAddress): Koreksi {
            /** @var Koreksi $locked */
            $locked = Koreksi::query()
                ->with(['pendaftaran.kegiatan', 'pendaftaran.mahasiswa'])
                ->lockForUpdate()
                ->findOrFail($koreksi->id);

            if ($locked->status !== StatusKoreksi::Menunggu) {
                throw ValidationException::withMessages([
                    'status' => 'Koreksi ini sudah diproses sebelumnya.',
                ]);
            }

            if (! $approve && blank($note)) {
                throw ValidationException::withMessages([
                    'catatan_proses' => 'Catatan wajib diisi saat menolak koreksi.',
                ]);
            }

            if ($approve && in_array($locked->jenis->value, ['belum_absen', 'poin_belum_masuk'], true)) {
                $registration = $locked->pendaftaran;
                if ($registration === null) {
                    throw ValidationException::withMessages([
                        'koreksi' => 'Data pendaftaran tidak tersedia untuk koreksi ini.',
                    ]);
                }

                $registration = $registration->newQuery()->whereKey($registration->id)->lockForUpdate()->firstOrFail();
                $activity = $registration->kegiatan()->lockForUpdate()->firstOrFail();

                $attendance = Kehadiran::query()
                    ->where('pendaftaran_id', $registration->id)
                    ->lockForUpdate()
                    ->first();

                $existingPoints = PoinTransaksi::query()
                    ->where('mahasiswa_id', $registration->mahasiswa_id)
                    ->where('kegiatan_id', $activity->id)
                    ->whereIn('tipe', [TipePoin::Kredit, TipePoin::Koreksi])
                    ->when($attendance !== null, fn ($query) => $query->where('kehadiran_id', $attendance->id))
                    ->lockForUpdate()
                    ->exists();

                if ($existingPoints) {
                    throw ValidationException::withMessages([
                        'koreksi' => 'Poin untuk kegiatan ini sudah pernah tercatat. Hindari duplikasi.',
                    ]);
                }

                if ($attendance === null) {
                    $attendance = Kehadiran::query()->create([
                        'pendaftaran_id' => $registration->id,
                        'waktu_checkin' => now(),
                        'sumber' => SumberKehadiran::Koreksi,
                        'status' => StatusKehadiran::Valid,
                    ]);
                } else {
                    $attendance->update([
                        'sumber' => SumberKehadiran::Koreksi,
                        'status' => StatusKehadiran::Valid,
                        'alasan_penolakan' => null,
                    ]);
                }

                $pointsValue = (int) ($activity->bobot()
                    ->where('peran', $registration->peran)
                    ->value('poin') ?? 0);

                PoinTransaksi::query()->create([
                    'mahasiswa_id' => $registration->mahasiswa_id,
                    'kegiatan_id' => $activity->id,
                    'kehadiran_id' => $attendance->id,
                    'tipe' => TipePoin::Koreksi,
                    'jumlah' => $pointsValue,
                    'keterangan' => sprintf('Poin melalui persetujuan koreksi #%d', $locked->id),
                    'dibuat_oleh' => $actor->id,
                ]);
            }

            $locked->update([
                'status' => $approve ? StatusKoreksi::Disetujui : StatusKoreksi::Ditolak,
                'catatan_proses' => $note,
                'diproses_oleh' => $actor->id,
                'diproses_at' => now(),
            ]);

            AuditLog::catat(
                aksi: 'koreksi.'.($approve ? 'disetujui' : 'ditolak'),
                userId: $actor->id,
                subjectType: Koreksi::class,
                subjectId: $locked->id,
                metadata: [
                    'kegiatan_id' => $locked->kegiatan_id,
                    'mahasiswa_id' => $locked->mahasiswa_id,
                    'jenis' => $locked->jenis->value,
                ],
                ipAddress: $ipAddress,
            );

            return $locked->refresh();
        });
    }
}

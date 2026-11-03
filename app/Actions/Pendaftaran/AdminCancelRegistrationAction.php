<?php

namespace App\Actions\Pendaftaran;

use App\Enums\StatusKegiatan;
use App\Enums\StatusPendaftaran;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class AdminCancelRegistrationAction
{
    public function handle(Kegiatan $kegiatan, Pendaftaran $pendaftaran, string $alasan, User $actor, ?string $ipAddress = null): Pendaftaran
    {
        return DB::transaction(function () use ($kegiatan, $pendaftaran, $alasan, $actor, $ipAddress): Pendaftaran {
            /** @var Kegiatan $lockedActivity */
            $lockedActivity = Kegiatan::query()->lockForUpdate()->findOrFail($kegiatan->id);

            /** @var Pendaftaran $lockedRegistration */
            $lockedRegistration = Pendaftaran::query()
                ->where('kegiatan_id', $lockedActivity->id)
                ->whereKey($pendaftaran->id)
                ->lockForUpdate()
                ->firstOrFail();

            if ($lockedActivity->status === StatusKegiatan::Terkunci) {
                throw ValidationException::withMessages([
                    'alasan' => 'Pendaftaran tidak dapat dibatalkan karena kegiatan telah terkunci.',
                ]);
            }

            if ($lockedRegistration->status !== StatusPendaftaran::Terdaftar) {
                throw ValidationException::withMessages([
                    'alasan' => 'Pendaftaran peserta ini sudah berstatus batal.',
                ]);
            }

            if ($lockedRegistration->kehadiran()->exists()) {
                throw ValidationException::withMessages([
                    'alasan' => 'Pendaftaran tidak dapat dibatalkan karena peserta sudah memiliki catatan kehadiran.',
                ]);
            }

            $oldRole = $lockedRegistration->peran->value;

            $lockedRegistration->update([
                'status' => StatusPendaftaran::Batal,
            ]);

            AuditLog::catat(
                aksi: 'pendaftaran.cancelled_by_admin',
                userId: $actor->id,
                subjectType: Pendaftaran::class,
                subjectId: $lockedRegistration->id,
                metadata: [
                    'kegiatan_id' => $lockedActivity->id,
                    'judul_kegiatan' => $lockedActivity->judul,
                    'mahasiswa_id' => $lockedRegistration->mahasiswa_id,
                    'peran_sebelumnya' => $oldRole,
                    'alasan' => $alasan,
                ],
                ipAddress: $ipAddress,
            );

            return $lockedRegistration->refresh();
        });
    }
}

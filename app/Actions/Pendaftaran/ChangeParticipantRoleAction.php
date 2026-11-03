<?php

namespace App\Actions\Pendaftaran;

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class ChangeParticipantRoleAction
{
    public function handle(Kegiatan $kegiatan, Pendaftaran $pendaftaran, PeranKegiatan $newRole, User $actor, ?string $ipAddress = null): Pendaftaran
    {
        return DB::transaction(function () use ($kegiatan, $pendaftaran, $newRole, $actor, $ipAddress): Pendaftaran {
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
                    'peran' => 'Peran peserta tidak dapat diubah karena kegiatan telah terkunci.',
                ]);
            }

            if ($lockedActivity->status === StatusKegiatan::Dibatalkan) {
                throw ValidationException::withMessages([
                    'peran' => 'Peran peserta tidak dapat diubah pada kegiatan yang telah dibatalkan.',
                ]);
            }

            if ($lockedRegistration->status !== StatusPendaftaran::Terdaftar) {
                throw ValidationException::withMessages([
                    'peran' => 'Peran hanya dapat diubah untuk pendaftaran yang berstatus terdaftar.',
                ]);
            }

            $hasValidAttendance = $lockedRegistration->kehadiran()
                ->where('kehadiran.status', StatusKehadiran::Valid)
                ->exists();

            if ($hasValidAttendance) {
                throw ValidationException::withMessages([
                    'peran' => 'Peran tidak dapat diubah karena kehadiran peserta sudah divalidasi dan poin telah tercatat. Gunakan mekanisme koreksi dan audit untuk penyesuaian poin.',
                ]);
            }

            $oldRole = $lockedRegistration->peran;

            if ($oldRole === $newRole) {
                return $lockedRegistration;
            }

            $lockedRegistration->update([
                'peran' => $newRole,
            ]);

            AuditLog::catat(
                aksi: 'pendaftaran.role_changed',
                userId: $actor->id,
                subjectType: Pendaftaran::class,
                subjectId: $lockedRegistration->id,
                metadata: [
                    'kegiatan_id' => $lockedActivity->id,
                    'judul_kegiatan' => $lockedActivity->judul,
                    'mahasiswa_id' => $lockedRegistration->mahasiswa_id,
                    'dari' => $oldRole->value,
                    'ke' => $newRole->value,
                ],
                ipAddress: $ipAddress,
            );

            return $lockedRegistration->refresh();
        });
    }
}

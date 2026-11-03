<?php

namespace App\Actions\Mahasiswa;

use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ToggleMahasiswaAktifAction
{
    public function handle(Mahasiswa $mahasiswa, bool $aktif, User $actor, ?string $ipAddress = null): Mahasiswa
    {
        return DB::transaction(function () use ($mahasiswa, $aktif, $actor, $ipAddress): Mahasiswa {
            /** @var User $user */
            $user = $mahasiswa->user()->firstOrFail();

            $user->is_active = $aktif;
            $user->save();

            $mahasiswa->aktif = $aktif;
            $mahasiswa->save();

            AuditLog::catat(
                aksi: $aktif ? 'mahasiswa.activated' : 'mahasiswa.deactivated',
                userId: $actor->id,
                subjectType: Mahasiswa::class,
                subjectId: $mahasiswa->id,
                metadata: [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'nim' => $mahasiswa->nim,
                    'aktif' => $aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $mahasiswa;
        });
    }
}

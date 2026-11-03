<?php

namespace App\Actions\Mahasiswa;

use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class ResetMahasiswaPasswordAction
{
    public function handle(Mahasiswa $mahasiswa, string $password, User $actor, ?string $ipAddress = null): void
    {
        DB::transaction(function () use ($mahasiswa, $password, $actor, $ipAddress): void {
            /** @var User $user */
            $user = $mahasiswa->user()->firstOrFail();

            $user->forceFill([
                'password' => Hash::make($password),
            ])->save();

            AuditLog::catat(
                aksi: 'mahasiswa.password_reset',
                userId: $actor->id,
                subjectType: Mahasiswa::class,
                subjectId: $mahasiswa->id,
                metadata: [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'nim' => $mahasiswa->nim,
                ],
                ipAddress: $ipAddress,
            );
        });
    }
}

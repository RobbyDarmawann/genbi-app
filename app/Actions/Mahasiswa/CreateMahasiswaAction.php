<?php

namespace App\Actions\Mahasiswa;

use App\Enums\StatusPenerima;
use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateMahasiswaAction
{
    /**
     * @param array{
     *     name: string,
     *     username: string,
     *     password: string,
     *     nim: string,
     *     komsat_id: int|string,
     *     divisi_id: int|string,
     *     angkatan: string,
     *     status_penerima: StatusPenerima|string,
     *     aktif?: bool|int|string
     * } $data
     */
    public function handle(array $data, User $actor, ?string $ipAddress = null): Mahasiswa
    {
        return DB::transaction(function () use ($data, $actor, $ipAddress): Mahasiswa {
            $aktif = array_key_exists('aktif', $data) ? (bool) $data['aktif'] : true;
            $statusPenerima = $data['status_penerima'] instanceof StatusPenerima
                ? $data['status_penerima']
                : StatusPenerima::from((string) $data['status_penerima']);

            $user = User::create([
                'name' => trim($data['name']),
                'username' => trim($data['username']),
                'password' => Hash::make($data['password']),
                'is_active' => $aktif,
            ]);

            $user->assignRole('mahasiswa');

            $mahasiswa = Mahasiswa::create([
                'user_id' => $user->id,
                'komsat_id' => (int) $data['komsat_id'],
                'divisi_id' => (int) $data['divisi_id'],
                'nim' => trim($data['nim']),
                'angkatan' => trim($data['angkatan']),
                'status_penerima' => $statusPenerima,
                'aktif' => $aktif,
            ]);

            AuditLog::catat(
                aksi: 'mahasiswa.created',
                userId: $actor->id,
                subjectType: Mahasiswa::class,
                subjectId: $mahasiswa->id,
                metadata: [
                    'user_id' => $user->id,
                    'username' => $user->username,
                    'nim' => $mahasiswa->nim,
                    'komsat_id' => $mahasiswa->komsat_id,
                    'divisi_id' => $mahasiswa->divisi_id,
                    'angkatan' => $mahasiswa->angkatan,
                    'status_penerima' => $mahasiswa->status_penerima->value,
                    'aktif' => $mahasiswa->aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $mahasiswa;
        });
    }
}

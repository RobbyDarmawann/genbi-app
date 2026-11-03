<?php

namespace App\Actions\Mahasiswa;

use App\Enums\StatusPenerima;
use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateMahasiswaAction
{
    /**
     * @param array{
     *     name: string,
     *     username: string,
     *     nim: string,
     *     komsat_id: int|string,
     *     divisi_id: int|string,
     *     angkatan: string,
     *     status_penerima: StatusPenerima|string,
     *     aktif?: bool|int|string
     * } $data
     */
    public function handle(array $data, Mahasiswa $mahasiswa, User $actor, ?string $ipAddress = null): Mahasiswa
    {
        return DB::transaction(function () use ($data, $mahasiswa, $actor, $ipAddress): Mahasiswa {
            $previousAktif = $mahasiswa->aktif;
            $aktif = array_key_exists('aktif', $data) ? (bool) $data['aktif'] : $mahasiswa->aktif;
            $statusPenerima = $data['status_penerima'] instanceof StatusPenerima
                ? $data['status_penerima']
                : StatusPenerima::from((string) $data['status_penerima']);

            /** @var User $user */
            $user = $mahasiswa->user()->firstOrFail();
            $user->fill([
                'name' => trim($data['name']),
                'username' => trim($data['username']),
                'is_active' => $aktif,
            ]);
            $user->save();

            $mahasiswa->fill([
                'komsat_id' => (int) $data['komsat_id'],
                'divisi_id' => (int) $data['divisi_id'],
                'nim' => trim($data['nim']),
                'angkatan' => trim($data['angkatan']),
                'status_penerima' => $statusPenerima,
                'aktif' => $aktif,
            ]);
            $mahasiswa->save();

            AuditLog::catat(
                aksi: 'mahasiswa.updated',
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

            if ($previousAktif !== $aktif) {
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
            }

            return $mahasiswa;
        });
    }
}

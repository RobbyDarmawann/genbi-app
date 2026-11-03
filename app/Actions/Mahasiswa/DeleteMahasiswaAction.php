<?php

namespace App\Actions\Mahasiswa;

use App\Models\AuditLog;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteMahasiswaAction
{
    public function handle(Mahasiswa $mahasiswa, User $actor, ?string $ipAddress = null): void
    {
        $terikat = $mahasiswa->pendaftaran()->count()
            + $mahasiswa->poinTransaksi()->count()
            + $mahasiswa->koreksi()->count()
            + $mahasiswa->kepengurusan()->count();

        if ($terikat > 0) {
            throw ValidationException::withMessages([
                'delete' => 'Anggota masih memiliki riwayat kegiatan, poin, koreksi, atau kepengurusan sehingga tidak dapat dihapus. Nonaktifkan akun sebagai gantinya.',
            ]);
        }

        DB::transaction(function () use ($mahasiswa, $actor, $ipAddress): void {
            /** @var User|null $user */
            $user = $mahasiswa->user()->first();
            $mahasiswaId = $mahasiswa->id;
            $nim = $mahasiswa->nim;
            $username = $user?->username;

            $mahasiswa->delete();
            $user?->delete();

            AuditLog::catat(
                aksi: 'mahasiswa.deleted',
                userId: $actor->id,
                subjectType: Mahasiswa::class,
                subjectId: $mahasiswaId,
                metadata: [
                    'nim' => $nim,
                    'username' => $username,
                ],
                ipAddress: $ipAddress,
            );
        });
    }
}

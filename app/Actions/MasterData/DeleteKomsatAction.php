<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Komsat;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteKomsatAction
{
    public function handle(Komsat $komsat, User $actor, ?string $ipAddress = null): void
    {
        $terikat = $komsat->mahasiswa()->exists()
            || $komsat->divisi()->exists()
            || $komsat->kegiatan()->exists()
            || $komsat->kepengurusan()->exists();

        if ($terikat) {
            throw ValidationException::withMessages([
                'delete' => 'Komsat yang sudah terikat data mahasiswa, divisi, kegiatan, atau kepengurusan tidak dapat dihapus. Gunakan status nonaktif.',
            ]);
        }

        DB::transaction(function () use ($komsat, $actor, $ipAddress): void {
            $snapshot = [
                'kode' => $komsat->kode,
                'nama' => $komsat->nama,
            ];
            $id = $komsat->id;

            $komsat->delete();

            AuditLog::catat(
                aksi: 'komsat.deleted',
                userId: $actor->id,
                subjectType: Komsat::class,
                subjectId: $id,
                metadata: $snapshot,
                ipAddress: $ipAddress,
            );
        });
    }
}

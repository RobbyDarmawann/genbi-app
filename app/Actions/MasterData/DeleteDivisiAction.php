<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteDivisiAction
{
    public function handle(Divisi $divisi, User $actor, ?string $ipAddress = null): void
    {
        $terikat = $divisi->mahasiswa()->exists() || $divisi->kegiatan()->exists();

        if ($terikat) {
            throw ValidationException::withMessages([
                'delete' => 'Divisi yang sudah terikat data mahasiswa atau kegiatan tidak dapat dihapus. Gunakan status nonaktif.',
            ]);
        }

        DB::transaction(function () use ($divisi, $actor, $ipAddress): void {
            $snapshot = [
                'komsat_id' => $divisi->komsat_id,
                'nama' => $divisi->nama,
            ];
            $id = $divisi->id;

            $divisi->delete();

            AuditLog::catat(
                aksi: 'divisi.deleted',
                userId: $actor->id,
                subjectType: Divisi::class,
                subjectId: $id,
                metadata: $snapshot,
                ipAddress: $ipAddress,
            );
        });
    }
}

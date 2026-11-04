<?php

namespace App\Actions\Kepengurusan;

use App\Models\AuditLog;
use App\Models\Kepengurusan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DeleteKepengurusanAction
{
    public function handle(Kepengurusan $kepengurusan, User $actor, ?string $ipAddress = null): void
    {
        DB::transaction(function () use ($kepengurusan, $actor, $ipAddress): void {
            $snapshot = [
                'periode_id' => $kepengurusan->periode_id,
                'komsat_id' => $kepengurusan->komsat_id,
                'jabatan' => $kepengurusan->jabatan,
                'nama_tampil' => $kepengurusan->nama_tampil,
            ];
            $id = $kepengurusan->id;
            $fotoPath = $kepengurusan->foto_path;

            $kepengurusan->delete();

            AuditLog::catat(
                aksi: 'kepengurusan.deleted',
                userId: $actor->id,
                subjectType: Kepengurusan::class,
                subjectId: $id,
                metadata: $snapshot,
                ipAddress: $ipAddress,
            );

            if ($fotoPath !== null) {
                Storage::disk('public')->delete($fotoPath);
            }
        });
    }
}

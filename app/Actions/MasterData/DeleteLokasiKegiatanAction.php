<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\LokasiKegiatan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeleteLokasiKegiatanAction
{
    public function handle(LokasiKegiatan $lokasi, User $actor, ?string $ipAddress = null): void
    {
        if ($lokasi->kegiatan()->exists()) {
            throw ValidationException::withMessages([
                'delete' => 'Lokasi yang pernah dirujuk kegiatan tidak dapat dihapus. Gunakan status nonaktif.',
            ]);
        }

        DB::transaction(function () use ($lokasi, $actor, $ipAddress): void {
            $snapshot = ['nama' => $lokasi->nama];
            $id = $lokasi->id;

            $lokasi->delete();

            AuditLog::catat(
                aksi: 'lokasi_kegiatan.deleted',
                userId: $actor->id,
                subjectType: LokasiKegiatan::class,
                subjectId: $id,
                metadata: $snapshot,
                ipAddress: $ipAddress,
            );
        });
    }
}

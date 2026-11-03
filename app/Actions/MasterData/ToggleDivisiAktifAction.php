<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ToggleDivisiAktifAction
{
    public function handle(Divisi $divisi, bool $aktif, User $actor, ?string $ipAddress = null): Divisi
    {
        return DB::transaction(function () use ($divisi, $aktif, $actor, $ipAddress): Divisi {
            $divisi->update(['aktif' => $aktif]);

            AuditLog::catat(
                aksi: $aktif ? 'divisi.activated' : 'divisi.deactivated',
                userId: $actor->id,
                subjectType: Divisi::class,
                subjectId: $divisi->id,
                metadata: [
                    'komsat_id' => $divisi->komsat_id,
                    'nama' => $divisi->nama,
                    'aktif' => $divisi->aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $divisi->refresh();
        });
    }
}

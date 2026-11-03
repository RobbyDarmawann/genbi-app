<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Komsat;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ToggleKomsatAktifAction
{
    public function handle(Komsat $komsat, bool $aktif, User $actor, ?string $ipAddress = null): Komsat
    {
        return DB::transaction(function () use ($komsat, $aktif, $actor, $ipAddress): Komsat {
            $komsat->update(['aktif' => $aktif]);

            AuditLog::catat(
                aksi: $aktif ? 'komsat.activated' : 'komsat.deactivated',
                userId: $actor->id,
                subjectType: Komsat::class,
                subjectId: $komsat->id,
                metadata: [
                    'kode' => $komsat->kode,
                    'nama' => $komsat->nama,
                    'aktif' => $komsat->aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $komsat->refresh();
        });
    }
}

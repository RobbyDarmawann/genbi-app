<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class TogglePeriodeAktifAction
{
    public function handle(Periode $periode, bool $aktif, User $actor, ?string $ipAddress = null): Periode
    {
        return DB::transaction(function () use ($periode, $aktif, $actor, $ipAddress): Periode {
            if ($aktif) {
                Periode::query()->where('id', '!=', $periode->id)->update(['aktif' => false]);
            }

            $periode->update(['aktif' => $aktif]);

            AuditLog::catat(
                aksi: $aktif ? 'periode.activated' : 'periode.deactivated',
                userId: $actor->id,
                subjectType: Periode::class,
                subjectId: $periode->id,
                metadata: [
                    'nama' => $periode->nama,
                    'aktif' => $periode->aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $periode->refresh();
        });
    }
}

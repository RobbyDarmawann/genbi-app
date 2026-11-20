<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\LokasiKegiatan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ToggleLokasiKegiatanAktifAction
{
    public function handle(LokasiKegiatan $lokasi, bool $aktif, User $actor, ?string $ipAddress = null): LokasiKegiatan
    {
        return DB::transaction(function () use ($lokasi, $aktif, $actor, $ipAddress): LokasiKegiatan {
            $lokasi->update(['aktif' => $aktif]);

            AuditLog::catat(
                aksi: $aktif ? 'lokasi_kegiatan.activated' : 'lokasi_kegiatan.deactivated',
                userId: $actor->id,
                subjectType: LokasiKegiatan::class,
                subjectId: $lokasi->id,
                metadata: ['nama' => $lokasi->nama, 'aktif' => $lokasi->aktif],
                ipAddress: $ipAddress,
            );

            return $lokasi->refresh();
        });
    }
}

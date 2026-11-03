<?php

namespace App\Actions\Kegiatan;

use App\Enums\StatusKegiatan;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateStatusKegiatanAction
{
    public function handle(Kegiatan $kegiatan, StatusKegiatan $targetStatus, User $actor, ?string $alasan = null, ?string $ipAddress = null): Kegiatan
    {
        return DB::transaction(function () use ($kegiatan, $targetStatus, $actor, $alasan, $ipAddress): Kegiatan {
            $oldStatus = $kegiatan->status;

            $kegiatan->update([
                'status' => $targetStatus,
            ]);

            $actionName = match ($targetStatus) {
                StatusKegiatan::Terbit => 'kegiatan.published',
                StatusKegiatan::Selesai => 'kegiatan.completed',
                StatusKegiatan::Dibatalkan => 'kegiatan.cancelled',
                StatusKegiatan::Terkunci => 'kegiatan.locked',
                default => 'kegiatan.status_changed',
            };

            AuditLog::catat(
                aksi: $actionName,
                userId: $actor->id,
                subjectType: Kegiatan::class,
                subjectId: $kegiatan->id,
                metadata: [
                    'judul' => $kegiatan->judul,
                    'dari' => $oldStatus->value,
                    'ke' => $targetStatus->value,
                    'alasan' => $alasan,
                ],
                ipAddress: $ipAddress,
            );

            return $kegiatan->refresh();
        });
    }
}

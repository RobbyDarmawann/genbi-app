<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaveDivisiAction
{
    /** @param array{komsat_id: int, nama: string, aktif?: bool} $data */
    public function handle(array $data, ?Divisi $divisi, User $actor, ?string $ipAddress = null): Divisi
    {
        return DB::transaction(function () use ($data, $divisi, $actor, $ipAddress): Divisi {
            $isCreate = $divisi === null;
            $model = $divisi ?? new Divisi;
            $aktif = array_key_exists('aktif', $data)
                ? (bool) $data['aktif']
                : ($divisi !== null ? $divisi->aktif : true);

            $model->fill([
                'komsat_id' => (int) $data['komsat_id'],
                'nama' => trim($data['nama']),
                'aktif' => $aktif,
            ]);
            $model->save();

            AuditLog::catat(
                aksi: $isCreate ? 'divisi.created' : 'divisi.updated',
                userId: $actor->id,
                subjectType: Divisi::class,
                subjectId: $model->id,
                metadata: ['komsat_id' => $model->komsat_id, 'nama' => $model->nama, 'aktif' => $model->aktif],
                ipAddress: $ipAddress,
            );

            return $model;
        });
    }
}

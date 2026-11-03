<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Komsat;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaveKomsatAction
{
    /** @param array{kode: string, nama: string, aktif?: bool} $data */
    public function handle(array $data, ?Komsat $komsat, User $actor, ?string $ipAddress = null): Komsat
    {
        return DB::transaction(function () use ($data, $komsat, $actor, $ipAddress): Komsat {
            $isCreate = $komsat === null;
            $model = $komsat ?? new Komsat;
            $aktif = array_key_exists('aktif', $data)
                ? (bool) $data['aktif']
                : ($komsat !== null ? $komsat->aktif : true);

            $model->fill([
                'kode' => strtoupper(trim($data['kode'])),
                'nama' => trim($data['nama']),
                'aktif' => $aktif,
            ]);
            $model->save();

            AuditLog::catat(
                aksi: $isCreate ? 'komsat.created' : 'komsat.updated',
                userId: $actor->id,
                subjectType: Komsat::class,
                subjectId: $model->id,
                metadata: ['kode' => $model->kode, 'nama' => $model->nama, 'aktif' => $model->aktif],
                ipAddress: $ipAddress,
            );

            return $model;
        });
    }
}

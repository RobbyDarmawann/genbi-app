<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SavePeriodeAction
{
    /**
     * @param  array{nama: string, tanggal_mulai: string, tanggal_selesai: string, aktif?: bool}  $data
     */
    public function handle(array $data, ?Periode $periode, User $actor, ?string $ipAddress = null): Periode
    {
        return DB::transaction(function () use ($data, $periode, $actor, $ipAddress): Periode {
            $isCreate = $periode === null;
            $model = $periode ?? new Periode;
            $aktif = array_key_exists('aktif', $data)
                ? (bool) $data['aktif']
                : ($periode !== null ? $periode->aktif : false);

            if ($aktif) {
                Periode::query()->when($periode, fn ($q) => $q->where('id', '!=', $periode->id))->update(['aktif' => false]);
            }

            $model->fill([
                'nama' => trim($data['nama']),
                'tanggal_mulai' => $data['tanggal_mulai'],
                'tanggal_selesai' => $data['tanggal_selesai'],
                'aktif' => $aktif,
            ]);
            $model->save();

            AuditLog::catat(
                aksi: $isCreate ? 'periode.created' : 'periode.updated',
                userId: $actor->id,
                subjectType: Periode::class,
                subjectId: $model->id,
                metadata: [
                    'nama' => $model->nama,
                    'tanggal_mulai' => $model->tanggal_mulai->toDateString(),
                    'tanggal_selesai' => $model->tanggal_selesai->toDateString(),
                    'aktif' => $model->aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $model;
        });
    }
}

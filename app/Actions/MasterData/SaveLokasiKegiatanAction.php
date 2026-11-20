<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\LokasiKegiatan;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class SaveLokasiKegiatanAction
{
    /** @param array{nama: string, latitude: float|int|string, longitude: float|int|string, radius_m: int|string, keterangan?: string|null, aktif?: bool} $data */
    public function handle(array $data, ?LokasiKegiatan $lokasi, User $actor, ?string $ipAddress = null): LokasiKegiatan
    {
        return DB::transaction(function () use ($data, $lokasi, $actor, $ipAddress): LokasiKegiatan {
            $isCreate = $lokasi === null;
            $model = $lokasi ?? new LokasiKegiatan;
            $aktif = array_key_exists('aktif', $data)
                ? (bool) $data['aktif']
                : ($lokasi !== null ? $lokasi->aktif : true);
            $keterangan = isset($data['keterangan']) ? trim($data['keterangan']) : null;

            $model->fill([
                'nama' => trim($data['nama']),
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'radius_m' => (int) $data['radius_m'],
                'keterangan' => $keterangan === '' ? null : $keterangan,
                'aktif' => $aktif,
            ]);
            $model->save();

            AuditLog::catat(
                aksi: $isCreate ? 'lokasi_kegiatan.created' : 'lokasi_kegiatan.updated',
                userId: $actor->id,
                subjectType: LokasiKegiatan::class,
                subjectId: $model->id,
                metadata: [
                    'nama' => $model->nama,
                    'latitude' => $model->latitude,
                    'longitude' => $model->longitude,
                    'radius_m' => $model->radius_m,
                    'aktif' => $model->aktif,
                ],
                ipAddress: $ipAddress,
            );

            return $model;
        });
    }
}

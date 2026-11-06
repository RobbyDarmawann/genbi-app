<?php

namespace App\Actions\Kegiatan;

use App\Enums\StatusKegiatan;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CreateKegiatanAction
{
    /** @param array<string, mixed> $data */
    public function handle(array $data, User $actor, ?string $ipAddress = null): Kegiatan
    {
        return DB::transaction(function () use ($data, $actor, $ipAddress): Kegiatan {
            $statusValue = is_string($data['status'] ?? null) ? $data['status'] : StatusKegiatan::Draft->value;
            $status = StatusKegiatan::from($statusValue);

            $kegiatan = Kegiatan::create([
                'judul' => $data['judul'],
                'deskripsi' => $data['deskripsi'] ?? null,
                'komsat_id' => $data['komsat_id'] ?? null,
                'lokasi_nama' => $data['lokasi_nama'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'radius_m' => (int) $data['radius_m'],
                'tanggal' => $data['tanggal'],
                'tanggal_selesai' => $data['tanggal_selesai'] ?? null,
                'jam_mulai' => $data['jam_mulai'],
                'jam_selesai' => $data['jam_selesai'],
                'absensi_buka_at' => $data['absensi_buka_at'],
                'absensi_tutup_at' => $data['absensi_tutup_at'],
                'pendaftaran_dibuka_at' => $data['pendaftaran_dibuka_at'] ?? null,
                'batas_daftar_at' => $data['batas_daftar_at'] ?? null,
                'kuota' => isset($data['kuota']) && $data['kuota'] !== '' ? (int) $data['kuota'] : null,
                'status' => $status,
                'dibuat_oleh' => $actor->id,
            ]);
            $this->syncRelated($kegiatan, $data);
            AuditLog::catat('kegiatan.created', $actor->id, Kegiatan::class, $kegiatan->id, [
                'judul' => $kegiatan->judul,
                'status' => $kegiatan->status->value,
            ], $ipAddress);

            if ($status === StatusKegiatan::Terbit) {
                AuditLog::catat('kegiatan.published', $actor->id, Kegiatan::class, $kegiatan->id, [
                    'judul' => $kegiatan->judul,
                    'dari' => StatusKegiatan::Draft->value,
                    'ke' => StatusKegiatan::Terbit->value,
                ], $ipAddress);
            }

            return $kegiatan;
        });
    }

    /** @param array<string, mixed> $data */
    private function syncRelated(Kegiatan $kegiatan, array $data): void
    {
        $kegiatan->divisiTarget()->sync($data['divisi_ids'] ?? []);
        $kegiatan->sesiAbsensi()->createMany(array_map(
            fn (array $sesi): array => [
                'tanggal' => $sesi['tanggal'],
                'jam_buka' => $sesi['jam_buka'],
                'jam_tutup' => $sesi['jam_tutup'],
            ],
            $data['sesi_absensi'] ?? [],
        ));
        foreach (($data['bobot'] ?? []) as $peran => $poin) {
            if ($poin !== null && $poin !== '') {
                KegiatanBobot::updateOrCreate(
                    ['kegiatan_id' => $kegiatan->id, 'peran' => $peran],
                    ['poin' => (int) $poin],
                );
            }
        }
    }
}

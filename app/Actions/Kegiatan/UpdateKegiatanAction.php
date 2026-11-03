<?php

namespace App\Actions\Kegiatan;

use App\Enums\StatusKegiatan;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class UpdateKegiatanAction
{
    /** @param array<string, mixed> $data */
    public function handle(Kegiatan $kegiatan, array $data, User $actor, ?string $ipAddress = null): Kegiatan
    {
        return DB::transaction(function () use ($kegiatan, $data, $actor, $ipAddress): Kegiatan {
            $oldStatus = $kegiatan->status;
            $oldLat = (float) $kegiatan->latitude;
            $oldLng = (float) $kegiatan->longitude;
            $oldRadius = (int) $kegiatan->radius_m;

            /** @var array<string, int> $oldBobot */
            $oldBobot = $kegiatan->bobot()
                ->get()
                ->mapWithKeys(fn (KegiatanBobot $row): array => [$row->peran->value => (int) $row->poin])
                ->all();

            /** @var array<int> $divisiIds */
            $divisiIds = is_array($data['divisi_ids'] ?? null) ? array_map('intval', $data['divisi_ids']) : [];
            /** @var array<string, mixed> $bobotInput */
            $bobotInput = is_array($data['bobot'] ?? null) ? $data['bobot'] : [];
            $statusValue = is_string($data['status'] ?? null) ? $data['status'] : $kegiatan->status->value;
            $newStatus = StatusKegiatan::from($statusValue);

            $kegiatan->update([
                'judul' => $data['judul'],
                'deskripsi' => $data['deskripsi'] ?? null,
                'komsat_id' => $data['komsat_id'] ?? null,
                'lokasi_nama' => $data['lokasi_nama'],
                'latitude' => $data['latitude'],
                'longitude' => $data['longitude'],
                'radius_m' => (int) $data['radius_m'],
                'tanggal' => $data['tanggal'],
                'jam_mulai' => $data['jam_mulai'],
                'jam_selesai' => $data['jam_selesai'],
                'absensi_buka_at' => $data['absensi_buka_at'],
                'absensi_tutup_at' => $data['absensi_tutup_at'],
                'pendaftaran_dibuka_at' => $data['pendaftaran_dibuka_at'] ?? null,
                'batas_daftar_at' => $data['batas_daftar_at'] ?? null,
                'kuota' => isset($data['kuota']) && $data['kuota'] !== '' ? (int) $data['kuota'] : null,
                'status' => $newStatus,
            ]);

            $kegiatan->divisiTarget()->sync($divisiIds);

            $newBobot = [];
            foreach (['peserta', 'panitia', 'pemateri'] as $peran) {
                $poin = $bobotInput[$peran] ?? null;
                if ($poin === null || $poin === '') {
                    $kegiatan->bobot()->where('peran', $peran)->delete();
                } else {
                    $intPoin = (int) $poin;
                    $newBobot[$peran] = $intPoin;
                    KegiatanBobot::updateOrCreate(
                        ['kegiatan_id' => $kegiatan->id, 'peran' => $peran],
                        ['poin' => $intPoin],
                    );
                }
            }

            ksort($oldBobot);
            ksort($newBobot);

            $newLat = (float) $kegiatan->latitude;
            $newLng = (float) $kegiatan->longitude;
            $newRadius = (int) $kegiatan->radius_m;

            $locationChanged = abs($oldLat - $newLat) > 0.0000001
                || abs($oldLng - $newLng) > 0.0000001
                || $oldRadius !== $newRadius;
            $bobotChanged = $oldBobot !== $newBobot;
            $sensitiveChanged = $locationChanged || $bobotChanged;

            AuditLog::catat(
                aksi: $sensitiveChanged ? 'kegiatan.updated_sensitive' : 'kegiatan.updated',
                userId: $actor->id,
                subjectType: Kegiatan::class,
                subjectId: $kegiatan->id,
                metadata: [
                    'judul' => $kegiatan->judul,
                    'sensitif_berubah' => $sensitiveChanged,
                    'lokasi_berubah' => $locationChanged,
                    'bobot_berubah' => $bobotChanged,
                    'sebelum' => [
                        'latitude' => $oldLat,
                        'longitude' => $oldLng,
                        'radius_m' => $oldRadius,
                        'bobot' => $oldBobot,
                    ],
                    'sesudah' => [
                        'latitude' => $newLat,
                        'longitude' => $newLng,
                        'radius_m' => $newRadius,
                        'bobot' => $newBobot,
                    ],
                ],
                ipAddress: $ipAddress,
            );

            if ($oldStatus !== $newStatus) {
                $statusAction = match ($newStatus) {
                    StatusKegiatan::Terbit => 'kegiatan.published',
                    StatusKegiatan::Dibatalkan => 'kegiatan.cancelled',
                    StatusKegiatan::Terkunci => 'kegiatan.locked',
                    default => 'kegiatan.status_changed',
                };

                AuditLog::catat(
                    aksi: $statusAction,
                    userId: $actor->id,
                    subjectType: Kegiatan::class,
                    subjectId: $kegiatan->id,
                    metadata: [
                        'judul' => $kegiatan->judul,
                        'dari' => $oldStatus->value,
                        'ke' => $newStatus->value,
                    ],
                    ipAddress: $ipAddress,
                );
            }

            return $kegiatan->refresh();
        });
    }
}

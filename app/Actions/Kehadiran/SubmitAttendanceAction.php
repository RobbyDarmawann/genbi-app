<?php

namespace App\Actions\Kehadiran;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Enums\SumberKehadiran;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\PoinTransaksi;
use App\Models\User;
use App\Support\Haversine;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class SubmitAttendanceAction
{
    private const MAX_ACCURACY_M_FOR_AUTO_VALID = 100.0;

    public function handle(
        Kegiatan $kegiatan,
        Mahasiswa $mahasiswa,
        float $latitude,
        float $longitude,
        float $accuracy,
        UploadedFile $foto,
        User $actor,
        ?string $ipAddress = null
    ): Kehadiran {
        return DB::transaction(function () use ($kegiatan, $mahasiswa, $latitude, $longitude, $accuracy, $foto, $actor, $ipAddress): Kehadiran {
            $lockedActivity = Kegiatan::query()->lockForUpdate()->findOrFail($kegiatan->id);
            $now = Carbon::now(config('app.timezone'));

            if (! $actor->is_active || ! $mahasiswa->aktif) {
                throw ValidationException::withMessages([
                    'absensi' => 'Akun mahasiswa tidak aktif dan tidak dapat melakukan absensi.',
                ]);
            }

            $pendaftaran = Pendaftaran::query()
                ->where('kegiatan_id', $lockedActivity->id)
                ->where('mahasiswa_id', $mahasiswa->id)
                ->lockForUpdate()
                ->first();

            if ($pendaftaran === null || $pendaftaran->status !== StatusPendaftaran::Terdaftar) {
                throw ValidationException::withMessages([
                    'absensi' => 'Anda tidak terdaftar sebagai peserta aktif pada kegiatan ini.',
                ]);
            }

            $statusEfektif = $lockedActivity->statusEfektif();
            if (in_array($statusEfektif, [StatusKegiatan::Draft, StatusKegiatan::Dibatalkan, StatusKegiatan::Terkunci], true)) {
                throw ValidationException::withMessages([
                    'absensi' => 'Kegiatan belum dibuka atau sudah ditutup.',
                ]);
            }

            if ($now->lt($lockedActivity->absensi_buka_at)) {
                throw ValidationException::withMessages([
                    'absensi' => 'Jendela absensi belum dibuka.',
                ]);
            }

            if ($now->gt($lockedActivity->absensi_tutup_at)) {
                throw ValidationException::withMessages([
                    'absensi' => 'Jendela absensi sudah ditutup.',
                ]);
            }

            $existingKehadiran = Kehadiran::query()
                ->with('poinTransaksi')
                ->where('pendaftaran_id', $pendaftaran->id)
                ->lockForUpdate()
                ->first();

            if ($existingKehadiran !== null) {
                AuditLog::catat(
                    aksi: 'kehadiran.duplicate_attempt',
                    userId: $actor->id,
                    subjectType: Kehadiran::class,
                    subjectId: $existingKehadiran->id,
                    metadata: [
                        'kegiatan_id' => $lockedActivity->id,
                        'mahasiswa_id' => $mahasiswa->id,
                    ],
                    ipAddress: $ipAddress,
                );

                return $existingKehadiran;
            }

            $distanceM = Haversine::distance(
                (float) $lockedActivity->latitude,
                (float) $lockedActivity->longitude,
                $latitude,
                $longitude
            );

            $fotoFilename = Str::uuid()->toString().'.jpg';
            Storage::disk('absensi')->putFileAs('', $foto, $fotoFilename);

            $isWithinRadius = $distanceM <= $lockedActivity->radius_m;
            $isAccuracyGood = $accuracy <= self::MAX_ACCURACY_M_FOR_AUTO_VALID;

            if ($isWithinRadius) {
                if ($isAccuracyGood) {
                    $status = StatusKehadiran::Valid;
                    $alasan = null;
                } else {
                    $status = StatusKehadiran::MenungguTinjau;
                    $alasan = 'Akurasi GPS melebihi batas otomatis (>100 m). Menunggu peninjauan Internal Manajemen.';
                }
            } else {
                $status = StatusKehadiran::Ditolak;
                $alasan = sprintf(
                    'Lokasi di luar radius kegiatan. Jarak: %.2f meter (Batas: %d meter).',
                    $distanceM,
                    $lockedActivity->radius_m
                );
            }

            $kehadiran = Kehadiran::query()->create([
                'pendaftaran_id' => $pendaftaran->id,
                'waktu_checkin' => $now,
                'latitude' => (string) $latitude,
                'longitude' => (string) $longitude,
                'akurasi_m' => (string) $accuracy,
                'jarak_m' => (string) round($distanceM, 2),
                'foto_path' => $fotoFilename,
                'sumber' => SumberKehadiran::Mandiri,
                'status' => $status,
                'alasan_penolakan' => $alasan,
                'metadata' => [
                    'user_agent' => request()->userAgent(),
                    'kegiatan_radius_m' => $lockedActivity->radius_m,
                ],
            ]);

            $bobotPoin = 0;

            if ($status === StatusKehadiran::Valid) {
                $bobotPoin = (int) ($lockedActivity->bobot()
                    ->where('peran', $pendaftaran->peran)
                    ->value('poin') ?? 0);

                if ($bobotPoin > 0) {
                    PoinTransaksi::query()->create([
                        'mahasiswa_id' => $mahasiswa->id,
                        'kegiatan_id' => $lockedActivity->id,
                        'kehadiran_id' => $kehadiran->id,
                        'tipe' => TipePoin::Kredit,
                        'jumlah' => $bobotPoin,
                        'keterangan' => sprintf(
                            'Poin kehadiran valid kegiatan "%s" sebagai %s',
                            $lockedActivity->judul,
                            $pendaftaran->peran->label()
                        ),
                        'dibuat_oleh' => $actor->id,
                    ]);
                }
            }

            AuditLog::catat(
                aksi: 'kehadiran.submitted',
                userId: $actor->id,
                subjectType: Kehadiran::class,
                subjectId: $kehadiran->id,
                metadata: [
                    'kegiatan_id' => $lockedActivity->id,
                    'judul_kegiatan' => $lockedActivity->judul,
                    'mahasiswa_id' => $mahasiswa->id,
                    'nim' => $mahasiswa->nim,
                    'status' => $status->value,
                    'jarak_m' => round($distanceM, 2),
                    'akurasi_m' => round($accuracy, 2),
                    'poin_terkredit' => $bobotPoin,
                ],
                ipAddress: $ipAddress,
            );

            return $kehadiran->load('poinTransaksi');
        });
    }
}

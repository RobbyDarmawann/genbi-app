<?php

namespace App\Actions\Koreksi;

use App\Enums\JenisKoreksi;
use App\Enums\StatusKoreksi;
use App\Models\AuditLog;
use App\Models\Koreksi;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CreateCorrection
{
    public function handle(Pendaftaran $pendaftaran, JenisKoreksi $jenis, string $alasan, ?UploadedFile $bukti, User $actor, ?string $ipAddress = null): Koreksi
    {
        // Ownership check
        if ($pendaftaran->mahasiswa_id !== $actor->mahasiswa?->id) {
            abort(404);
        }

        // Upload bukti sebelum transaction agar bisa dibersihkan bila transaction gagal
        $path = null;
        try {
            if ($bukti !== null) {
                $stored = $bukti->store('', 'absensi');
                $path = is_string($stored) ? $stored : null;
            }

            return DB::transaction(function () use ($pendaftaran, $jenis, $alasan, $path, $actor, $ipAddress): Koreksi {
                // Lock pendaftaran untuk mencegah concurrent duplicate
                $registration = Pendaftaran::query()->whereKey($pendaftaran->id)->lockForUpdate()->firstOrFail();

                // Cegah duplikat pending untuk pendaftaran+jenis yang sama
                $existing = Koreksi::query()
                    ->where('pendaftaran_id', $registration->id)
                    ->where('jenis', $jenis)
                    ->where('status', StatusKoreksi::Menunggu)
                    ->lockForUpdate()
                    ->exists();

                if ($existing) {
                    throw ValidationException::withMessages(['jenis' => 'Koreksi dengan jenis ini masih menunggu proses.']);
                }

                $correction = Koreksi::query()->create([
                    'mahasiswa_id' => $registration->mahasiswa_id,
                    'kegiatan_id' => $registration->kegiatan_id,
                    'pendaftaran_id' => $registration->id,
                    'jenis' => $jenis,
                    'alasan' => $alasan,
                    'bukti_path' => $path,
                    'status' => StatusKoreksi::Menunggu,
                ]);

                AuditLog::catat('koreksi.dibuat', $actor->id, Koreksi::class, $correction->id, ['kegiatan_id' => $registration->kegiatan_id, 'jenis' => $jenis->value], $ipAddress);

                return $correction;
            });
        } catch (\Throwable $e) {
            // Cleanup uploaded file jika transaction gagal
            if ($path !== null) {
                Storage::disk('absensi')->delete($path);
            }
            throw $e;
        }
    }
}

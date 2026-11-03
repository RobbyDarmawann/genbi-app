<?php

namespace App\Actions\Pendaftaran;

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusPendaftaran;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class RegisterForActivityAction
{
    public function handle(Kegiatan $kegiatan, Mahasiswa $mahasiswa, User $actor, ?string $ipAddress = null): Pendaftaran
    {
        return DB::transaction(function () use ($kegiatan, $mahasiswa, $actor, $ipAddress): Pendaftaran {
            /** @var Kegiatan $lockedActivity */
            $lockedActivity = Kegiatan::query()->lockForUpdate()->findOrFail($kegiatan->id);
            $now = Carbon::now(config('app.timezone'));

            if (! $actor->is_active || ! $mahasiswa->aktif) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Akun mahasiswa tidak aktif dan tidak dapat mendaftar kegiatan.',
                ]);
            }

            if (! in_array($lockedActivity->status, [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung], true)) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Pendaftaran kegiatan ini tidak tersedia karena status kegiatan sudah ditutup atau belum diterbitkan.',
                ]);
            }

            if (! $lockedActivity->divisiTarget()->where('divisi.id', $mahasiswa->divisi_id)->exists()) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Kegiatan ini ditujukan untuk divisi terpilih.',
                ]);
            }

            if ($lockedActivity->pendaftaran_dibuka_at !== null && $now->lt($lockedActivity->pendaftaran_dibuka_at)) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Pendaftaran kegiatan belum dibuka.',
                ]);
            }

            if ($lockedActivity->batas_daftar_at !== null && $now->gt($lockedActivity->batas_daftar_at)) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Batas waktu pendaftaran kegiatan telah berakhir.',
                ]);
            }

            $registration = Pendaftaran::query()
                ->where('kegiatan_id', $lockedActivity->id)
                ->where('mahasiswa_id', $mahasiswa->id)
                ->lockForUpdate()
                ->first();

            if ($registration?->status === StatusPendaftaran::Terdaftar) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Anda sudah terdaftar pada kegiatan ini.',
                ]);
            }

            $activeCount = Pendaftaran::query()
                ->where('kegiatan_id', $lockedActivity->id)
                ->where('status', StatusPendaftaran::Terdaftar)
                ->lockForUpdate()
                ->count();

            if ($lockedActivity->kuota !== null && $activeCount >= $lockedActivity->kuota) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Kuota peserta untuk kegiatan ini telah penuh.',
                ]);
            }

            $isReactivated = $registration !== null;

            if ($registration === null) {
                $registration = Pendaftaran::query()->create([
                    'kegiatan_id' => $lockedActivity->id,
                    'mahasiswa_id' => $mahasiswa->id,
                    'peran' => PeranKegiatan::Peserta,
                    'status' => StatusPendaftaran::Terdaftar,
                ]);
            } else {
                $registration->update([
                    'peran' => PeranKegiatan::Peserta,
                    'status' => StatusPendaftaran::Terdaftar,
                ]);
            }

            AuditLog::catat(
                aksi: $isReactivated ? 'pendaftaran.re_registered' : 'pendaftaran.created',
                userId: $actor->id,
                subjectType: Pendaftaran::class,
                subjectId: $registration->id,
                metadata: [
                    'kegiatan_id' => $lockedActivity->id,
                    'judul_kegiatan' => $lockedActivity->judul,
                    'mahasiswa_id' => $mahasiswa->id,
                    'nim' => $mahasiswa->nim,
                    'peran' => $registration->peran->value,
                    'reaktivasi' => $isReactivated,
                ],
                ipAddress: $ipAddress,
            );

            return $registration->refresh();
        });
    }
}

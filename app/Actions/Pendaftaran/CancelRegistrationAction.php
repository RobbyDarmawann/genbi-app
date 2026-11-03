<?php

namespace App\Actions\Pendaftaran;

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

class CancelRegistrationAction
{
    public function handle(Kegiatan $kegiatan, Mahasiswa $mahasiswa, User $actor, ?string $ipAddress = null): Pendaftaran
    {
        return DB::transaction(function () use ($kegiatan, $mahasiswa, $actor, $ipAddress): Pendaftaran {
            /** @var Kegiatan $lockedActivity */
            $lockedActivity = Kegiatan::query()->lockForUpdate()->findOrFail($kegiatan->id);
            $now = Carbon::now(config('app.timezone'));

            $registration = Pendaftaran::query()
                ->where('kegiatan_id', $lockedActivity->id)
                ->where('mahasiswa_id', $mahasiswa->id)
                ->lockForUpdate()
                ->first();

            if ($registration === null || $registration->status !== StatusPendaftaran::Terdaftar) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Anda tidak memiliki pendaftaran aktif pada kegiatan ini.',
                ]);
            }

            if ($registration->kehadiran()->exists()) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Pendaftaran tidak dapat dibatalkan karena Anda sudah memiliki catatan kehadiran.',
                ]);
            }

            if (! in_array($lockedActivity->status, [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung], true)) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Pendaftaran tidak dapat dibatalkan karena kegiatan sudah selesai, terkunci, atau dibatalkan.',
                ]);
            }

            if ($lockedActivity->batas_daftar_at !== null && $now->gt($lockedActivity->batas_daftar_at)) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Batas waktu pembatalan pendaftaran telah berakhir.',
                ]);
            }

            if ($now->gt($lockedActivity->absensi_tutup_at)) {
                throw ValidationException::withMessages([
                    'pendaftaran' => 'Pendaftaran tidak dapat dibatalkan karena jendela kegiatan telah berakhir.',
                ]);
            }

            $registration->update([
                'status' => StatusPendaftaran::Batal,
            ]);

            AuditLog::catat(
                aksi: 'pendaftaran.cancelled_by_student',
                userId: $actor->id,
                subjectType: Pendaftaran::class,
                subjectId: $registration->id,
                metadata: [
                    'kegiatan_id' => $lockedActivity->id,
                    'judul_kegiatan' => $lockedActivity->judul,
                    'mahasiswa_id' => $mahasiswa->id,
                    'nim' => $mahasiswa->nim,
                ],
                ipAddress: $ipAddress,
            );

            return $registration->refresh();
        });
    }
}

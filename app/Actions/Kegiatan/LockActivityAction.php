<?php

namespace App\Actions\Kegiatan;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Models\AuditLog;
use App\Models\Kegiatan;
use App\Models\User;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class LockActivityAction
{
    public function complete(Kegiatan $kegiatan, User $actor, ?string $ipAddress = null): Kegiatan
    {
        return DB::transaction(function () use ($kegiatan, $actor, $ipAddress): Kegiatan {
            $locked = Kegiatan::query()->lockForUpdate()->findOrFail($kegiatan->id);
            $end = Carbon::parse($locked->tanggal->toDateString().' '.$locked->jam_selesai, config('app.timezone'));

            if (now(config('app.timezone'))->lessThanOrEqualTo($end)) {
                throw ValidationException::withMessages([
                    'status' => 'Kegiatan hanya dapat ditandai selesai setelah jam kegiatan berakhir.',
                ]);
            }

            if (! $locked->status->canTransitionTo(StatusKegiatan::Selesai)) {
                throw ValidationException::withMessages(['status' => 'Status kegiatan tidak dapat diubah menjadi selesai.']);
            }

            $locked->update(['status' => StatusKegiatan::Selesai]);
            AuditLog::catat('kegiatan.completed', $actor->id, Kegiatan::class, $locked->id, ['judul' => $locked->judul], $ipAddress);

            return $locked->refresh();
        });
    }

    public function lock(Kegiatan $kegiatan, User $actor, ?string $ipAddress = null): Kegiatan
    {
        return DB::transaction(function () use ($kegiatan, $actor, $ipAddress): Kegiatan {
            $locked = Kegiatan::query()->lockForUpdate()->findOrFail($kegiatan->id);

            if (! $locked->status->canTransitionTo(StatusKegiatan::Terkunci)) {
                throw ValidationException::withMessages(['status' => 'Hanya kegiatan selesai yang dapat dikunci.']);
            }

            $pendingAttendance = $locked->kehadiran()->where('kehadiran.status', StatusKehadiran::MenungguTinjau)->count();
            $pendingCorrections = $locked->koreksi()->where('status', StatusKoreksi::Menunggu)->count();

            if ($pendingAttendance > 0 || $pendingCorrections > 0) {
                throw ValidationException::withMessages([
                    'status' => sprintf('Kegiatan belum dapat dikunci: %d kehadiran dan %d koreksi masih menunggu tinjauan.', $pendingAttendance, $pendingCorrections),
                ]);
            }

            $locked->update(['status' => StatusKegiatan::Terkunci]);
            AuditLog::catat('kegiatan.locked', $actor->id, Kegiatan::class, $locked->id, ['judul' => $locked->judul], $ipAddress);

            return $locked->refresh();
        });
    }
}

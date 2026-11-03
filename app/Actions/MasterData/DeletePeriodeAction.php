<?php

namespace App\Actions\MasterData;

use App\Models\AuditLog;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class DeletePeriodeAction
{
    public function handle(Periode $periode, User $actor, ?string $ipAddress = null): void
    {
        if ($periode->kepengurusan()->exists()) {
            throw ValidationException::withMessages([
                'delete' => 'Periode yang sudah digunakan pada data kepengurusan tidak dapat dihapus. Gunakan fitur nonaktifkan.',
            ]);
        }

        DB::transaction(function () use ($periode, $actor, $ipAddress): void {
            $snapshot = [
                'nama' => $periode->nama,
                'tanggal_mulai' => $periode->tanggal_mulai->toDateString(),
                'tanggal_selesai' => $periode->tanggal_selesai->toDateString(),
            ];
            $id = $periode->id;

            $periode->delete();

            AuditLog::catat(
                aksi: 'periode.deleted',
                userId: $actor->id,
                subjectType: Periode::class,
                subjectId: $id,
                metadata: $snapshot,
                ipAddress: $ipAddress,
            );
        });
    }
}

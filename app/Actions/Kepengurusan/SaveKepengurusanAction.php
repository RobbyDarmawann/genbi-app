<?php

namespace App\Actions\Kepengurusan;

use App\Models\AuditLog;
use App\Models\Kepengurusan;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SaveKepengurusanAction
{
    /**
     * @param  array{periode_id: int, komsat_id: int|null, mahasiswa_id: int|null, nama_tampil: string, jabatan: string, urutan: int, kontak: string|null}  $data
     */
    public function handle(array $data, ?Kepengurusan $kepengurusan, User $actor, ?string $ipAddress = null): Kepengurusan
    {
        return DB::transaction(function () use ($data, $kepengurusan, $actor, $ipAddress): Kepengurusan {
            $duplicate = Kepengurusan::query()
                ->where('periode_id', $data['periode_id'])
                ->when(
                    $data['komsat_id'] !== null,
                    fn ($q) => $q->where('komsat_id', $data['komsat_id']),
                    fn ($q) => $q->whereNull('komsat_id'),
                )
                ->where('nama_tampil', $data['nama_tampil'])
                ->where('jabatan', $data['jabatan'])
                ->when($kepengurusan !== null, fn ($q) => $q->where('id', '!=', $kepengurusan->id))
                ->lockForUpdate()
                ->exists();

            if ($duplicate) {
                throw ValidationException::withMessages([
                    'nama_tampil' => 'Pengurus dengan nama dan jabatan yang sama pada lingkup periode ini sudah terdaftar.',
                ]);
            }

            $isCreate = $kepengurusan === null;
            $model = $kepengurusan ?? new Kepengurusan;
            $model->fill($data);
            $model->save();

            AuditLog::catat(
                aksi: $isCreate ? 'kepengurusan.created' : 'kepengurusan.updated',
                userId: $actor->id,
                subjectType: Kepengurusan::class,
                subjectId: $model->id,
                metadata: [
                    'periode_id' => $model->periode_id,
                    'komsat_id' => $model->komsat_id,
                    'jabatan' => $model->jabatan,
                    'urutan' => $model->urutan,
                ],
                ipAddress: $ipAddress,
            );

            return $model;
        });
    }
}

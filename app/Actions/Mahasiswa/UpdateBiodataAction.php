<?php

namespace App\Actions\Mahasiswa;

use App\Models\Mahasiswa;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class UpdateBiodataAction
{
    /**
     * @param  array{jenis_kelamin?: string|null, agama?: string|null, golongan_darah?: string|null, tanggal_lahir?: string|null, domisili?: string|null, no_hp?: string|null, foto?: UploadedFile|null, hapus_foto?: bool}  $data
     */
    public function handle(Mahasiswa $mahasiswa, array $data): Mahasiswa
    {
        return DB::transaction(function () use ($mahasiswa, $data): Mahasiswa {
            $oldFotoPath = $mahasiswa->foto_path;
            $newFotoPath = null;

            if (($data['hapus_foto'] ?? false) === true) {
                $data['foto_path'] = null;
            }

            if (($data['foto'] ?? null) instanceof UploadedFile) {
                $newFotoPath = $data['foto']->store('mahasiswa', 'public');
                $data['foto_path'] = $newFotoPath;
            }

            unset($data['foto'], $data['hapus_foto']);
            $mahasiswa->fill($data);
            $mahasiswa->save();

            if ($oldFotoPath !== null && ($newFotoPath !== null || $mahasiswa->foto_path === null)) {
                Storage::disk('public')->delete($oldFotoPath);
            }

            return $mahasiswa;
        });
    }
}

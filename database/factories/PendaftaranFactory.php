<?php

namespace Database\Factories;

use App\Enums\PeranKegiatan;
use App\Enums\StatusPendaftaran;
use App\Models\Kegiatan;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Pendaftaran>
 */
class PendaftaranFactory extends Factory
{
    protected $model = Pendaftaran::class;

    public function definition(): array
    {
        return [
            'kegiatan_id' => Kegiatan::factory(),
            'mahasiswa_id' => Mahasiswa::factory(),
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Enums\JenisKoreksi;
use App\Enums\StatusKoreksi;
use App\Models\Kegiatan;
use App\Models\Koreksi;
use App\Models\Mahasiswa;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Koreksi>
 */
class KoreksiFactory extends Factory
{
    protected $model = Koreksi::class;

    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'kegiatan_id' => Kegiatan::factory(),
            'pendaftaran_id' => null,
            'jenis' => JenisKoreksi::BelumAbsen,
            'alasan' => fake()->sentence(),
            'bukti_path' => null,
            'status' => StatusKoreksi::Menunggu,
            'diproses_oleh' => null,
            'catatan_proses' => null,
            'diproses_at' => null,
        ];
    }
}

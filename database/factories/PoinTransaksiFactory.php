<?php

namespace Database\Factories;

use App\Enums\TipePoin;
use App\Models\Kegiatan;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PoinTransaksi>
 */
class PoinTransaksiFactory extends Factory
{
    protected $model = PoinTransaksi::class;

    public function definition(): array
    {
        return [
            'mahasiswa_id' => Mahasiswa::factory(),
            'kegiatan_id' => Kegiatan::factory(),
            'kehadiran_id' => null,
            'tipe' => TipePoin::Kredit,
            'jumlah' => fake()->randomElement([10, 15, 20]),
            'keterangan' => 'Kredit poin kehadiran kegiatan',
            'dibuat_oleh' => User::factory(),
        ];
    }
}

<?php

namespace Database\Factories;

use App\Models\Kepengurusan;
use App\Models\Periode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kepengurusan>
 */
class KepengurusanFactory extends Factory
{
    protected $model = Kepengurusan::class;

    public function definition(): array
    {
        return [
            'periode_id' => Periode::factory(),
            'komsat_id' => null,
            'mahasiswa_id' => null,
            'nama_tampil' => fake()->name(),
            'jabatan' => fake()->jobTitle(),
            'urutan' => fake()->numberBetween(1, 20),
            'kontak' => fake()->phoneNumber(),
        ];
    }
}

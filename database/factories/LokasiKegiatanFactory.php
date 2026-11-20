<?php

namespace Database\Factories;

use App\Models\LokasiKegiatan;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<LokasiKegiatan>
 */
class LokasiKegiatanFactory extends Factory
{
    protected $model = LokasiKegiatan::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'nama' => fake()->unique()->words(3, true),
            'latitude' => fake()->randomFloat(7, 0.50, 0.60),
            'longitude' => fake()->randomFloat(7, 123.00, 123.10),
            'radius_m' => 100,
            'keterangan' => null,
            'aktif' => true,
        ];
    }

    public function nonaktif(): static
    {
        return $this->state(fn () => ['aktif' => false]);
    }
}

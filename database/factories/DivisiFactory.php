<?php

namespace Database\Factories;

use App\Models\Divisi;
use App\Models\Komsat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Divisi>
 */
class DivisiFactory extends Factory
{
    protected $model = Divisi::class;

    public function definition(): array
    {
        return [
            'komsat_id' => Komsat::factory(),
            'nama' => fake()->words(2, true),
            'aktif' => true,
        ];
    }
}

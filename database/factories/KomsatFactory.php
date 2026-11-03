<?php

namespace Database\Factories;

use App\Models\Komsat;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Komsat>
 */
class KomsatFactory extends Factory
{
    protected $model = Komsat::class;

    public function definition(): array
    {
        return [
            'kode' => fake()->unique()->randomElement(['UNG', 'IAIN', 'UG', 'UMGO', 'UBM']),
            'nama' => fake()->company(),
            'aktif' => true,
        ];
    }
}

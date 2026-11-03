<?php

namespace Database\Factories;

use App\Enums\StatusPenerima;
use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Mahasiswa>
 */
class MahasiswaFactory extends Factory
{
    protected $model = Mahasiswa::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'komsat_id' => function () {
                $komsat = Komsat::first();

                return $komsat ? $komsat->id : Komsat::factory()->create()->id;
            },
            'divisi_id' => function (array $attributes) {
                $divisi = Divisi::where('komsat_id', $attributes['komsat_id'])->first();

                return $divisi ? $divisi->id : Divisi::factory()->create(['komsat_id' => $attributes['komsat_id']])->id;
            },
            'nim' => fake()->unique()->numerify('##########'),
            'angkatan' => (string) fake()->numberBetween(2022, 2026),
            'status_penerima' => fake()->randomElement(StatusPenerima::cases()),
            'aktif' => true,
        ];
    }
}

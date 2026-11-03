<?php

namespace Database\Factories;

use App\Enums\PeranKegiatan;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<KegiatanBobot>
 */
class KegiatanBobotFactory extends Factory
{
    protected $model = KegiatanBobot::class;

    public function definition(): array
    {
        return [
            'kegiatan_id' => Kegiatan::factory(),
            'peran' => fake()->randomElement(PeranKegiatan::cases()),
            'poin' => fake()->randomElement([10, 15, 20]),
        ];
    }
}

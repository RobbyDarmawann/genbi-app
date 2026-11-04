<?php

namespace Database\Factories;

use App\Models\Periode;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Periode>
 */
class PeriodeFactory extends Factory
{
    protected $model = Periode::class;

    public function definition(): array
    {
        static $counter = 0;
        $counter++;

        $year = 2023 + $counter;

        return [
            'nama' => $year.'-'.($year + 1),
            'tanggal_mulai' => $year.'-01-01',
            'tanggal_selesai' => ($year + 1).'-12-31',
            'aktif' => false,
        ];
    }
}

<?php

namespace Database\Seeders;

use App\Models\Periode;
use Illuminate\Database\Seeder;

class PeriodeSeeder extends Seeder
{
    /**
     * Menyiapkan satu periode contoh aktif.
     */
    public function run(): void
    {
        Periode::updateOrCreate(
            ['nama' => '2025–2026'],
            [
                'tanggal_mulai' => '2025-01-01',
                'tanggal_selesai' => '2026-12-31',
                'aktif' => true,
            ]
        );
    }
}

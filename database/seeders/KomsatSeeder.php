<?php

namespace Database\Seeders;

use App\Models\Komsat;
use Illuminate\Database\Seeder;

class KomsatSeeder extends Seeder
{
    /**
     * Tepat 5 Komsat final dan sah di wilayah Bank Indonesia Gorontalo.
     */
    public function run(): void
    {
        $komsatList = [
            [
                'kode' => 'UNG',
                'nama' => 'Universitas Negeri Gorontalo',
            ],
            [
                'kode' => 'IAIN',
                'nama' => 'IAIN Sultan Amai Gorontalo',
            ],
            [
                'kode' => 'UG',
                'nama' => 'Universitas Gorontalo',
            ],
            [
                'kode' => 'UMGO',
                'nama' => 'Universitas Muhammadiyah Gorontalo',
            ],
            [
                'kode' => 'UBM',
                'nama' => 'Universitas Bina Mandiri Gorontalo',
            ],
        ];

        foreach ($komsatList as $item) {
            Komsat::updateOrCreate(
                ['kode' => $item['kode']],
                [
                    'nama' => $item['nama'],
                    'aktif' => true,
                ]
            );
        }
    }
}

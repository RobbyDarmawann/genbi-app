<?php

namespace Database\Seeders;

use App\Models\Divisi;
use App\Models\Komsat;
use Illuminate\Database\Seeder;

class DivisiSeeder extends Seeder
{
    /**
     * Contoh divisi UNG yang terverifikasi sebagai data awal/contoh.
     * Daftar divisi resmi untuk Komsat lain dikelola langsung oleh
     * Internal Manajemen pada modul master data dan tidak dikarang di seeder.
     */
    public function run(): void
    {
        $ung = Komsat::where('kode', 'UNG')->first();

        if (! $ung) {
            return;
        }

        $divisiUng = [
            'Pendidikan',
            'Kewirausahaan',
            'Potensi Diri',
            'Kesehatan Masyarakat',
            'Lingkungan Hidup',
            'Kominfo',
        ];

        foreach ($divisiUng as $nama) {
            Divisi::updateOrCreate(
                [
                    'komsat_id' => $ung->id,
                    'nama' => $nama,
                ],
                [
                    'aktif' => true,
                ]
            );
        }
    }
}

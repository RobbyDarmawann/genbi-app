<?php

namespace Database\Seeders;

use App\Models\LokasiKegiatan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LokasiKegiatanSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $lokasiList = [
            // 8 Lokasi Master Wajib (Gorontalo)
            [
                'nama' => 'Kampus 1 UNG',
                'latitude' => 0.5550,
                'longitude' => 123.0624,
                'radius_m' => 300,
                'keterangan' => 'Kampus utama UNG, kawasan Jl. Jend. Sudirman',
                'aktif' => true,
            ],
            [
                'nama' => 'Kampus 4 UNG',
                'latitude' => 0.552704,
                'longitude' => 123.137023,
                'radius_m' => 300,
                'keterangan' => 'Kampus 4 UNG, kawasan Bone Bolango',
                'aktif' => true,
            ],
            [
                'nama' => 'Lapangan Taruna Remaja',
                'latitude' => 0.528666,
                'longitude' => 123.059269,
                'radius_m' => 300,
                'keterangan' => 'Kawasan ruang terbuka publik Taruna Remaja Kota Gorontalo',
                'aktif' => true,
            ],
            [
                'nama' => 'Aula KPw BI Gorontalo',
                'latitude' => 0.5402,
                'longitude' => 123.0601,
                'radius_m' => 100,
                'keterangan' => 'Kantor Perwakilan Bank Indonesia Provinsi Gorontalo, Jl. Nani Wartabone',
                'aktif' => true,
            ],
            [
                'nama' => 'Gelanggang Olahraga',
                'latitude' => 0.5517812,
                'longitude' => 123.0563066,
                'radius_m' => 100,
                'keterangan' => 'Kawasan Gelanggang Olahraga Nani Wartabone Kota Gorontalo',
                'aktif' => true,
            ],
            [
                'nama' => 'PKM UNG',
                'latitude' => 0.5541,
                'longitude' => 123.0612,
                'radius_m' => 100,
                'keterangan' => 'Gedung Pusat Kegiatan Mahasiswa UNG, Kampus 1',
                'aktif' => true,
            ],
            [
                'nama' => 'IAIN Sultan Amai Gorontalo',
                'latitude' => 0.5562,
                'longitude' => 123.0645,
                'radius_m' => 200,
                'keterangan' => 'Kampus IAIN Sultan Amai Gorontalo, kawasan Jl. Gelatik',
                'aktif' => true,
            ],
            [
                'nama' => 'Pantai Kurenai',
                'latitude' => 0.518,
                'longitude' => 123.085,
                'radius_m' => 150,
                'keterangan' => 'Kawasan wisata Pantai Kurenai, Kabupaten Bone Bolango',
                'aktif' => true,
            ],
            // 3 Tambahan Kampus Komsat (UG, UMGO, UBM) dari referensi kegiatan DataTrenSeeder
            [
                'nama' => 'Universitas Gorontalo',
                'latitude' => 0.5621,
                'longitude' => 123.0702,
                'radius_m' => 150,
                'keterangan' => 'Kampus Universitas Gorontalo, kawasan Jl. Ahmad A. Wahab Limboto',
                'aktif' => true,
            ],
            [
                'nama' => 'Universitas Muhammadiyah Gorontalo',
                'latitude' => 0.5489,
                'longitude' => 123.0498,
                'radius_m' => 150,
                'keterangan' => 'Kampus Universitas Muhammadiyah Gorontalo, kawasan Pentadio',
                'aktif' => true,
            ],
            [
                'nama' => 'Universitas Bina Mandiri Gorontalo',
                'latitude' => 0.5447,
                'longitude' => 123.0663,
                'radius_m' => 150,
                'keterangan' => 'Kampus Universitas Bina Mandiri Gorontalo, kawasan Jl. Prof. Dr. Aloei Saboe',
                'aktif' => true,
            ],
        ];

        foreach ($lokasiList as $lokasi) {
            LokasiKegiatan::updateOrCreate(
                ['nama' => $lokasi['nama']],
                [
                    'latitude' => $lokasi['latitude'],
                    'longitude' => $lokasi['longitude'],
                    'radius_m' => $lokasi['radius_m'],
                    'keterangan' => $lokasi['keterangan'],
                    'aktif' => $lokasi['aktif'],
                ]
            );
        }
    }
}

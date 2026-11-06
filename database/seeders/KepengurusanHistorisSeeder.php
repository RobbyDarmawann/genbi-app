<?php

namespace Database\Seeders;

use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Periode;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class KepengurusanHistorisSeeder extends Seeder
{
    private ?Komsat $komsatUNG = null;

    private ?Komsat $komsatIAIN = null;

    private ?Komsat $komsatUG = null;

    private int $demoContactIndex = 1;

    /**
     * Seed susunan pengurus historis GenBI Gorontalo untuk 6 periode (2018–2025), total 126 pengurus.
     * Seeder opsional yang berdiri sendiri: TIDAK dipanggil DatabaseSeeder/DemoSeeder.
     */
    public function run(): void
    {
        $this->komsatUNG = Komsat::where('kode', 'UNG')->first();
        $this->komsatIAIN = Komsat::where('kode', 'IAIN')->first();
        $this->komsatUG = Komsat::where('kode', 'UG')->first();
        $this->demoContactIndex = 1;

        $this->seedPeriode20182020();
        $this->seedPeriode20202021();
        $this->seedPeriode20212022();
        $this->seedPeriode20222023();
        $this->seedPeriode20232024();
        $this->seedPeriode20242025();

        $this->command?->info('✓ KepengurusanHistorisSeeder selesai: 6 periode historis dengan 126 pengurus.');
    }

    /**
     * Periode 2018/2020 — total 23 orang.
     * Wilayah (14), Komsat IAIN (3), Komsat UNG (3), Komsat UG (3).
     */
    private function seedPeriode20182020(): void
    {
        $periode = Periode::updateOrCreate(
            ['nama' => 'Periode 2018/2020'],
            [
                'tanggal_mulai' => Carbon::parse('2018-08-01'),
                'tanggal_selesai' => Carbon::parse('2020-07-31'),
                'aktif' => false,
            ]
        );

        $entries = [
            // Wilayah (14)
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'One Yusril Fikar', 'urutan' => 1],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Rahmi Mabruri', 'urutan' => 2],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Arief Setyowidodo', 'urutan' => 3],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Siti Murtafi\'ah Mooduto', 'urutan' => 4],
            ['komsat' => null, 'jabatan' => 'Ketua Umum', 'nama' => 'Vebriansyah Mohi', 'urutan' => 5],
            ['komsat' => null, 'jabatan' => 'Wakil Ketua', 'nama' => 'Adelia Arkhani', 'urutan' => 6],
            ['komsat' => null, 'jabatan' => 'Sekretaris Umum', 'nama' => 'Nur Atika Devannie', 'urutan' => 7],
            ['komsat' => null, 'jabatan' => 'Bendahara Umum', 'nama' => 'Nurnadia Z. Husain', 'urutan' => 8],
            ['komsat' => null, 'jabatan' => 'KaDiv Organisasi dan Keanggotaan', 'nama' => 'Maghfira Safitri', 'urutan' => 9],
            ['komsat' => null, 'jabatan' => 'KaDiv Kerjasama dan Kemitraan', 'nama' => 'Agatha Elda', 'urutan' => 10],
            ['komsat' => null, 'jabatan' => 'KaDiv Kewirausahaan', 'nama' => 'Gilvia Potale', 'urutan' => 11],
            ['komsat' => null, 'jabatan' => 'KaDiv Pendidikan', 'nama' => 'Lisa Manggopa', 'urutan' => 12],
            ['komsat' => null, 'jabatan' => 'KaDiv Kesehatan', 'nama' => 'Bela Otoluwa', 'urutan' => 13],
            ['komsat' => null, 'jabatan' => 'KaDiv Lingkungan Hidup', 'nama' => 'Baharudin Sunge', 'urutan' => 14],

            // Komsat IAIN (3)
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Maulidin R. Pratama', 'urutan' => 1],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Fadila Rahman (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Nur Haliza (Demo)', 'urutan' => 3],

            // Komsat UNG (3, semua Demo)
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Andika Pratama (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Rizky Ramadhan (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Putri Ayu (Demo)', 'urutan' => 3],

            // Komsat UG (3, semua Demo)
            ['komsat' => $this->komsatUG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Fajar Nugroho (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Maya Kusuma (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Rian Saputra (Demo)', 'urutan' => 3],
        ];

        $this->savePengurusEntries($periode->id, $entries);
    }

    /**
     * Periode 2020/2021 — total 39 orang (susunan terlengkap, semua nama asli).
     * Wilayah (12), Komsat UNG (9), Komsat IAIN (9), Komsat UG (9).
     */
    private function seedPeriode20202021(): void
    {
        $periode = Periode::updateOrCreate(
            ['nama' => 'Periode 2020/2021'],
            [
                'tanggal_mulai' => Carbon::parse('2020-08-01'),
                'tanggal_selesai' => Carbon::parse('2021-07-31'),
                'aktif' => false,
            ]
        );

        $entries = [
            // Wilayah (12)
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Arief Setyowidodo', 'urutan' => 1],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Abdullah Ulil Albab', 'urutan' => 2],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Siti Murtafi\'ah Mooduto', 'urutan' => 3],
            ['komsat' => null, 'jabatan' => 'Ketua Umum', 'nama' => 'Moh. Zulkifli Katili', 'urutan' => 4],
            ['komsat' => null, 'jabatan' => 'Sekretaris Umum', 'nama' => 'Revandi Pakaya', 'urutan' => 5],
            ['komsat' => null, 'jabatan' => 'Bendahara Umum', 'nama' => 'Siti M.V. Mohammad', 'urutan' => 6],
            ['komsat' => null, 'jabatan' => 'KaDep Organisasi dan Keanggotaan', 'nama' => 'Sianly Kindangen', 'urutan' => 7],
            ['komsat' => null, 'jabatan' => 'KaDep Kerjasama dan Kemitraan', 'nama' => 'Ali Luqman Adam', 'urutan' => 8],
            ['komsat' => null, 'jabatan' => 'KaDep Kewirausahaan', 'nama' => 'Arya Daud', 'urutan' => 9],
            ['komsat' => null, 'jabatan' => 'KaDep Agama dan Pendidikan', 'nama' => 'Yusril Katili', 'urutan' => 10],
            ['komsat' => null, 'jabatan' => 'KaDep Lingkungan Hidup', 'nama' => 'Mukhlisa Tuli', 'urutan' => 11],
            ['komsat' => null, 'jabatan' => 'KaDep Kesehatan Masyarakat', 'nama' => 'Moh. Rizal Baginda', 'urutan' => 12],

            // Komsat UNG (9)
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Naswa Adilia Alamri', 'urutan' => 1],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Fitriyanti B Tahir', 'urutan' => 2],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Anatasya Lahay', 'urutan' => 3],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'KaDiv Potensi Diri', 'nama' => 'Nadiya Yunus', 'urutan' => 4],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'KaDiv Komunikasi dan Informasi', 'nama' => 'Ahmad Haikal Bahar', 'urutan' => 5],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'KaDiv Kewirausahaan', 'nama' => 'Tika Pausther', 'urutan' => 6],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'KaDiv Pendidikan', 'nama' => 'Nabil A Panja', 'urutan' => 7],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'KaDiv Lingkungan Hidup', 'nama' => 'Maharani', 'urutan' => 8],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'KaDiv Kesehatan Masyarakat', 'nama' => 'Fritania Bonde', 'urutan' => 9],

            // Komsat IAIN (9)
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Tasya Dwias Amanda', 'urutan' => 1],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Rehanun', 'urutan' => 2],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Minarti Mansombo', 'urutan' => 3],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'KaDiv Potensi Diri', 'nama' => 'Muslihah', 'urutan' => 4],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'KaDiv Komunikasi dan Informasi', 'nama' => 'Hamsil Hamdi', 'urutan' => 5],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'KaDiv Kewirausahaan', 'nama' => 'Della A. Darise', 'urutan' => 6],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'KaDiv Pendidikan', 'nama' => 'Yuliananda J.A.K.', 'urutan' => 7],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'KaDiv Lingkungan Hidup', 'nama' => 'Muthia Nur Kholifah', 'urutan' => 8],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'KaDiv Kesehatan Masyarakat', 'nama' => 'Nabila Solaeman', 'urutan' => 9],

            // Komsat UG (9)
            ['komsat' => $this->komsatUG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Rolly Ramdi Basri', 'urutan' => 1],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Yeni Dyana Sari', 'urutan' => 2],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Sri W. A. K. Bangi', 'urutan' => 3],
            ['komsat' => $this->komsatUG, 'jabatan' => 'KaDiv Kesenian', 'nama' => 'Moh. Safar Ahmad', 'urutan' => 4],
            ['komsat' => $this->komsatUG, 'jabatan' => 'KaDiv Keagamaan', 'nama' => 'Rahmat Uno', 'urutan' => 5],
            ['komsat' => $this->komsatUG, 'jabatan' => 'KaDiv Kewirausahaan', 'nama' => 'Nur Fazrin Lamato', 'urutan' => 6],
            ['komsat' => $this->komsatUG, 'jabatan' => 'KaDiv Pendidikan', 'nama' => 'Claraswati Katili', 'urutan' => 7],
            ['komsat' => $this->komsatUG, 'jabatan' => 'KaDiv Lingkungan Hidup', 'nama' => 'Ayu Lestari Kunuti', 'urutan' => 8],
            ['komsat' => $this->komsatUG, 'jabatan' => 'KaDiv Kesehatan Masyarakat', 'nama' => 'Novia S Hasan', 'urutan' => 9],
        ];

        $this->savePengurusEntries($periode->id, $entries);
    }

    /**
     * Periode 2021/2022 — total 23 orang.
     * Wilayah (14), Komsat UNG (3), Komsat IAIN (3), Komsat UG (3).
     */
    private function seedPeriode20212022(): void
    {
        $periode = Periode::updateOrCreate(
            ['nama' => 'Periode 2021/2022'],
            [
                'tanggal_mulai' => Carbon::parse('2021-08-01'),
                'tanggal_selesai' => Carbon::parse('2022-07-31'),
                'aktif' => false,
            ]
        );

        $entries = [
            // Wilayah (14)
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Abdullah Ulil Albab', 'urutan' => 1],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Hilmy Munis', 'urutan' => 2],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Siti Murtafi\'ah Mooduto', 'urutan' => 3],
            ['komsat' => null, 'jabatan' => 'Ketua Umum', 'nama' => 'Komang Darma Widia', 'urutan' => 4],
            ['komsat' => null, 'jabatan' => 'Sekretaris Umum', 'nama' => 'Muhammad Al-Haddad', 'urutan' => 5],
            ['komsat' => null, 'jabatan' => 'Bendahara Umum', 'nama' => 'Fitriyanti B Tahir', 'urutan' => 6],
            ['komsat' => null, 'jabatan' => 'Koordinator Media Sosial', 'nama' => 'Hamsil Hamdi', 'urutan' => 7],
            ['komsat' => null, 'jabatan' => 'Kadiv Organisasi dan Keanggotaan', 'nama' => 'Tasya Dwias Amanda', 'urutan' => 8],
            ['komsat' => null, 'jabatan' => 'Kadiv Kerjasama dan Kemitraan', 'nama' => 'Adinda Pratiwi Musa', 'urutan' => 9],
            ['komsat' => null, 'jabatan' => 'Kadiv Pendidikan', 'nama' => 'La Imudi', 'urutan' => 10],
            ['komsat' => null, 'jabatan' => 'Kadiv Lingkungan Hidup', 'nama' => 'Nur Amalia Katili', 'urutan' => 11],
            ['komsat' => null, 'jabatan' => 'Kadiv Kesekretariatan', 'nama' => 'David Ansari Lubis', 'urutan' => 12],
            ['komsat' => null, 'jabatan' => 'Kadiv Kewirausahaan', 'nama' => 'Rangga Wijaya (Demo)', 'urutan' => 13],
            ['komsat' => null, 'jabatan' => 'Kadiv Masyarakat', 'nama' => 'Cahyadi Mutiara', 'urutan' => 14],

            // Komsat UNG (3)
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Alviansyah S. Malawe', 'urutan' => 1],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Bagas Prasetyo (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Laras Setiawan (Demo)', 'urutan' => 3],

            // Komsat IAIN (3)
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Minarti Mansombo', 'urutan' => 1],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Hana Pertiwi (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Yusuf Maulana (Demo)', 'urutan' => 3],

            // Komsat UG (3)
            ['komsat' => $this->komsatUG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Arafik Pakaya', 'urutan' => 1],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Dimas Anggara (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Sari Wulandari (Demo)', 'urutan' => 3],
        ];

        $this->savePengurusEntries($periode->id, $entries);
    }

    /**
     * Periode 2022/2023 — total 15 orang.
     * Wilayah (6), Komsat UNG (3), Komsat IAIN (3), Komsat UG (3).
     */
    private function seedPeriode20222023(): void
    {
        $periode = Periode::updateOrCreate(
            ['nama' => 'Periode 2022/2023'],
            [
                'tanggal_mulai' => Carbon::parse('2022-08-01'),
                'tanggal_selesai' => Carbon::parse('2023-07-31'),
                'aktif' => false,
            ]
        );

        $entries = [
            // Wilayah (6)
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Hilmy Munis', 'urutan' => 1],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Anisa Kurniarahman', 'urutan' => 2],
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Siti Murtafi\'ah Mooduto', 'urutan' => 3],
            ['komsat' => null, 'jabatan' => 'Ketua Umum', 'nama' => 'Muh Zamharir Malongi', 'urutan' => 4],
            ['komsat' => null, 'jabatan' => 'Sekretaris Umum', 'nama' => 'Ilham Saputra (Demo)', 'urutan' => 5],
            ['komsat' => null, 'jabatan' => 'Bendahara Umum', 'nama' => 'Rina Amelia (Demo)', 'urutan' => 6],

            // Komsat UNG (3)
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Moh. Abror Maaruf', 'urutan' => 1],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Galih Permana (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Nadia Safitri (Demo)', 'urutan' => 3],

            // Komsat IAIN (3)
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Indrianto J. Hasan', 'urutan' => 1],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Fikri Ramadhan (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Aisyah Putri (Demo)', 'urutan' => 3],

            // Komsat UG (3)
            ['komsat' => $this->komsatUG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Ulfadiyanti Udju', 'urutan' => 1],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Bima Aditya (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Citra Lestari (Demo)', 'urutan' => 3],
        ];

        $this->savePengurusEntries($periode->id, $entries);
    }

    /**
     * Periode 2023/2024 — total 13 orang, SEMUA (Demo).
     * Wilayah (4), Komsat UNG (3), Komsat IAIN (3), Komsat UG (3).
     */
    private function seedPeriode20232024(): void
    {
        $periode = Periode::updateOrCreate(
            ['nama' => 'Periode 2023/2024'],
            [
                'tanggal_mulai' => Carbon::parse('2023-08-01'),
                'tanggal_selesai' => Carbon::parse('2024-07-31'),
                'aktif' => false,
            ]
        );

        $entries = [
            // Wilayah (4)
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Hendra Gunawan (Demo)', 'urutan' => 1],
            ['komsat' => null, 'jabatan' => 'Ketua Umum', 'nama' => 'Raka Pradana (Demo)', 'urutan' => 2],
            ['komsat' => null, 'jabatan' => 'Sekretaris Umum', 'nama' => 'Sinta Maharani (Demo)', 'urutan' => 3],
            ['komsat' => null, 'jabatan' => 'Bendahara Umum', 'nama' => 'Dewi Anggraini (Demo)', 'urutan' => 4],

            // Komsat UNG (3)
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Yoga Pratama (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Intan Permata (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Agus Salim (Demo)', 'urutan' => 3],

            // Komsat IAIN (3)
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Salman Alfarisi (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Fatimah Zahra (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Umar Bakri (Demo)', 'urutan' => 3],

            // Komsat UG (3)
            ['komsat' => $this->komsatUG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Kevin Hartanto (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Mega Utami (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Rudi Hartono (Demo)', 'urutan' => 3],
        ];

        $this->savePengurusEntries($periode->id, $entries);
    }

    /**
     * Periode 2024/2025 — total 13 orang, SEMUA (Demo).
     * Wilayah (4), Komsat UNG (3), Komsat IAIN (3), Komsat UG (3).
     */
    private function seedPeriode20242025(): void
    {
        $periode = Periode::updateOrCreate(
            ['nama' => 'Periode 2024/2025'],
            [
                'tanggal_mulai' => Carbon::parse('2024-08-01'),
                'tanggal_selesai' => Carbon::parse('2025-07-31'),
                'aktif' => false,
            ]
        );

        $entries = [
            // Wilayah (4)
            ['komsat' => null, 'jabatan' => 'Pembina', 'nama' => 'Bambang Sutrisno (Demo)', 'urutan' => 1],
            ['komsat' => null, 'jabatan' => 'Ketua Umum', 'nama' => 'Aldi Firmansyah (Demo)', 'urutan' => 2],
            ['komsat' => null, 'jabatan' => 'Sekretaris Umum', 'nama' => 'Ratu Balqis (Demo)', 'urutan' => 3],
            ['komsat' => null, 'jabatan' => 'Bendahara Umum', 'nama' => 'Novi Rahmawati (Demo)', 'urutan' => 4],

            // Komsat UNG (3)
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Farhan Akbar (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Gita Savitri (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUNG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Hadi Purnomo (Demo)', 'urutan' => 3],

            // Komsat IAIN (3)
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Ikhsan Ramadhan (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Jihan Aulia (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatIAIN, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Khalid Basalamah (Demo)', 'urutan' => 3],

            // Komsat UG (3)
            ['komsat' => $this->komsatUG, 'jabatan' => 'Ketua Komisariat', 'nama' => 'Lukman Hakim (Demo)', 'urutan' => 1],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Sekretaris Komisariat', 'nama' => 'Mira Handayani (Demo)', 'urutan' => 2],
            ['komsat' => $this->komsatUG, 'jabatan' => 'Bendahara Komisariat', 'nama' => 'Nanda Rizky (Demo)', 'urutan' => 3],
        ];

        $this->savePengurusEntries($periode->id, $entries);
    }

    /**
     * @param  array<int, array{komsat: ?Komsat, jabatan: string, nama: string, urutan: int}>  $entries
     */
    private function savePengurusEntries(int $periodeId, array $entries): void
    {
        foreach ($entries as $item) {
            $isDemo = str_contains($item['nama'], '(Demo)');

            $komsatId = $item['komsat']?->id;
            $komsatKode = $item['komsat']?->kode;

            $kontakData = [
                'kontak' => null,
                'no_hp' => null,
                'instagram' => null,
                'email' => null,
            ];

            if ($isDemo) {
                $cleanSlug = Str::slug(str_replace('(Demo)', '', $item['nama']), '.');
                $cleanIg = Str::slug(str_replace('(Demo)', '', $item['nama']), '_');
                $phoneSuffix = str_pad((string) $this->demoContactIndex, 6, '0', STR_PAD_LEFT);

                $kontakData = [
                    'kontak' => $komsatKode ? "Komsat {$komsatKode}" : 'Sekretariat GenBI Gorontalo',
                    'no_hp' => '081234'.$phoneSuffix,
                    'instagram' => $cleanIg.'_demo',
                    'email' => $cleanSlug.'.demo@genbigto.id',
                ];

                $this->demoContactIndex++;
            }

            Kepengurusan::updateOrCreate(
                [
                    'periode_id' => $periodeId,
                    'komsat_id' => $komsatId,
                    'jabatan' => $item['jabatan'],
                    'nama_tampil' => $item['nama'],
                ],
                [
                    'mahasiswa_id' => null,
                    'urutan' => $item['urutan'],
                    'kontak' => $kontakData['kontak'],
                    'no_hp' => $kontakData['no_hp'],
                    'instagram' => $kontakData['instagram'],
                    'email' => $kontakData['email'],
                    'foto_path' => null,
                ]
            );
        }
    }
}

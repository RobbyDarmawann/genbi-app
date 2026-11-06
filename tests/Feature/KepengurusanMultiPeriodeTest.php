<?php

use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Periode;
use Database\Seeders\DivisiSeeder;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RoleSeeder;

beforeEach(function () {
    $this->seed([
        RoleSeeder::class,
        KomsatSeeder::class,
        DivisiSeeder::class,
        PeriodeSeeder::class,
    ]);
});

test('props publik memuat daftar periode berdata terurut terbaru ke terlama dan default periode aktif', function () {
    $periodeAktif = Periode::factory()->create([
        'aktif' => true,
        'nama' => '2026/2027',
        'tanggal_mulai' => '2026-09-01',
        'tanggal_selesai' => '2027-08-31',
    ]);

    $periodeLama1 = Periode::factory()->create([
        'aktif' => false,
        'nama' => '2025/2026',
        'tanggal_mulai' => '2025-09-01',
        'tanggal_selesai' => '2026-08-31',
    ]);

    $periodeLama2 = Periode::factory()->create([
        'aktif' => false,
        'nama' => '2024/2025',
        'tanggal_mulai' => '2024-09-01',
        'tanggal_selesai' => '2025-08-31',
    ]);

    $periodeKosong = Periode::factory()->create([
        'aktif' => false,
        'nama' => '2023/2024',
        'tanggal_mulai' => '2023-09-01',
        'tanggal_selesai' => '2024-08-31',
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeAktif->id,
        'nama_tampil' => 'Pengurus Aktif',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeLama1->id,
        'nama_tampil' => 'Pengurus Lama 1',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeLama2->id,
        'nama_tampil' => 'Pengurus Lama 2',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    $response = $this->get(route('public.kepengurusan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('public/kepengurusan')
        ->has('periode_terpilih', fn ($terpilih) => $terpilih
            ->where('id', $periodeAktif->id)
            ->where('nama', '2026/2027')
            ->where('aktif', true))
        ->has('daftar_periode', 3)
        ->has('daftar_periode.0', fn ($item) => $item
            ->where('id', $periodeAktif->id)
            ->where('nama', '2026/2027')
            ->where('aktif', true)
            ->where('jumlah_pengurus', 1)
            ->etc())
        ->has('daftar_periode.1', fn ($item) => $item
            ->where('id', $periodeLama1->id)
            ->where('nama', '2025/2026')
            ->where('aktif', false)
            ->etc())
        ->has('daftar_periode.2', fn ($item) => $item
            ->where('id', $periodeLama2->id)
            ->etc())
        ->missing('daftar_periode.3'));
});

test('memilih periode lama menampilkan pengurus periode itu bukan yang aktif', function () {
    $periodeAktif = Periode::factory()->create([
        'aktif' => true,
        'nama' => '2026/2027',
        'tanggal_mulai' => '2026-09-01',
    ]);

    $periodeLama = Periode::factory()->create([
        'aktif' => false,
        'nama' => '2025/2026',
        'tanggal_mulai' => '2025-09-01',
    ]);

    $komsatUNG = Komsat::where('kode', 'UNG')->first();

    Kepengurusan::factory()->create([
        'periode_id' => $periodeAktif->id,
        'komsat_id' => null,
        'nama_tampil' => 'Ketua Aktif',
        'jabatan' => 'Ketua Umum',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeLama->id,
        'komsat_id' => null,
        'nama_tampil' => 'Ketua Lama Wilayah',
        'jabatan' => 'Ketua Umum',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeLama->id,
        'komsat_id' => $komsatUNG->id,
        'nama_tampil' => 'Ketua Lama UNG',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 1,
    ]);

    $response = $this->get(route('public.kepengurusan', ['periode' => $periodeLama->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->where('periode_terpilih.id', $periodeLama->id)
        ->where('periode_terpilih.nama', '2025/2026')
        ->where('periode_terpilih.aktif', false)
        ->has('direktori.wilayah', 1)
        ->where('direktori.wilayah.0.nama_tampil', 'Ketua Lama Wilayah')
        ->has('direktori.komsat.UNG', 1)
        ->where('direktori.komsat.UNG.0.nama_tampil', 'Ketua Lama UNG'));
});

test('memilih lingkup menyaring kelompok dengan benar', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsatUNG = Komsat::where('kode', 'UNG')->first();
    $komsatIAIN = Komsat::where('kode', 'IAIN')->first();

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus Wilayah',
        'jabatan' => 'Ketua Umum',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsatUNG->id,
        'nama_tampil' => 'Pengurus UNG',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsatIAIN->id,
        'nama_tampil' => 'Pengurus IAIN',
        'jabatan' => 'Bendahara',
        'urutan' => 1,
    ]);

    $responseWilayah = $this->get(route('public.kepengurusan', ['lingkup' => 'wilayah']));
    $responseWilayah->assertOk();
    $responseWilayah->assertInertia(fn ($page) => $page
        ->has('direktori.wilayah', 1)
        ->where('direktori.wilayah.0.nama_tampil', 'Pengurus Wilayah')
        ->where('direktori.komsat', []));

    $responseUNG = $this->get(route('public.kepengurusan', ['lingkup' => 'UNG']));
    $responseUNG->assertOk();
    $responseUNG->assertInertia(fn ($page) => $page
        ->has('direktori.wilayah', 0)
        ->has('direktori.komsat.UNG', 1)
        ->where('direktori.komsat.UNG.0.nama_tampil', 'Pengurus UNG')
        ->missing('direktori.komsat.IAIN'));

    $responseSemua = $this->get(route('public.kepengurusan', ['lingkup' => 'semua']));
    $responseSemua->assertOk();
    $responseSemua->assertInertia(fn ($page) => $page
        ->has('direktori.wilayah', 1)
        ->has('direktori.komsat.UNG', 1)
        ->has('direktori.komsat.IAIN', 1));
});

test('param periode tidak valid jatuh ke default periode aktif dengan aman', function () {
    $periodeAktif = Periode::factory()->create(['aktif' => true, 'nama' => '2026/2027']);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeAktif->id,
        'nama_tampil' => 'Pengurus Aktif',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    $responseInvalidId = $this->get(route('public.kepengurusan', ['periode' => 99999]));
    $responseInvalidId->assertOk();
    $responseInvalidId->assertInertia(fn ($page) => $page
        ->where('periode_terpilih.id', $periodeAktif->id)
        ->has('direktori.wilayah', 1));

    $responseInvalidString = $this->get(route('public.kepengurusan', ['periode' => 'invalid']));
    $responseInvalidString->assertOk();
    $responseInvalidString->assertInertia(fn ($page) => $page
        ->where('periode_terpilih.id', $periodeAktif->id));
});

test('param lingkup tidak valid menampilkan semua lingkup tanpa error', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsatUNG = Komsat::where('kode', 'UNG')->first();

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus Wilayah',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsatUNG->id,
        'nama_tampil' => 'Pengurus UNG',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 1,
    ]);

    $response = $this->get(route('public.kepengurusan', ['lingkup' => 'INVALID_KOMSAT']));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('direktori.wilayah', 1)
        ->has('direktori.komsat.UNG', 1));
});

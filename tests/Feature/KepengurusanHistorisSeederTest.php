<?php

use App\Models\Kegiatan;
use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\PoinTransaksi;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoSeeder;
use Database\Seeders\DivisiSeeder;
use Database\Seeders\KepengurusanHistorisSeeder;
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

test('kepengurusan historis seeder membuat 6 periode tidak aktif dengan jumlah pengurus persis sesuai spesifikasi', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $periode20182020 = Periode::where('nama', 'Periode 2018/2020')->first();
    $periode20202021 = Periode::where('nama', 'Periode 2020/2021')->first();
    $periode20212022 = Periode::where('nama', 'Periode 2021/2022')->first();
    $periode20222023 = Periode::where('nama', 'Periode 2022/2023')->first();
    $periode20232024 = Periode::where('nama', 'Periode 2023/2024')->first();
    $periode20242025 = Periode::where('nama', 'Periode 2024/2025')->first();

    expect($periode20182020)->not->toBeNull();
    expect($periode20202021)->not->toBeNull();
    expect($periode20212022)->not->toBeNull();
    expect($periode20222023)->not->toBeNull();
    expect($periode20232024)->not->toBeNull();
    expect($periode20242025)->not->toBeNull();

    expect($periode20182020->aktif)->toBe(false);
    expect($periode20202021->aktif)->toBe(false);
    expect($periode20212022->aktif)->toBe(false);
    expect($periode20222023->aktif)->toBe(false);
    expect($periode20232024->aktif)->toBe(false);
    expect($periode20242025->aktif)->toBe(false);

    expect(Kepengurusan::where('periode_id', $periode20182020->id)->count())->toBe(23);
    expect(Kepengurusan::where('periode_id', $periode20202021->id)->count())->toBe(39);
    expect(Kepengurusan::where('periode_id', $periode20212022->id)->count())->toBe(23);
    expect(Kepengurusan::where('periode_id', $periode20222023->id)->count())->toBe(15);
    expect(Kepengurusan::where('periode_id', $periode20232024->id)->count())->toBe(13);
    expect(Kepengurusan::where('periode_id', $periode20242025->id)->count())->toBe(13);

    $totalHistoris = Kepengurusan::whereIn('periode_id', [
        $periode20182020->id,
        $periode20202021->id,
        $periode20212022->id,
        $periode20222023->id,
        $periode20232024->id,
        $periode20242025->id,
    ])->count();

    expect($totalHistoris)->toBe(126);
});

test('kepengurusan historis seeder idempoten saat dijalankan dua kali', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $countPeriodeBefore = Periode::where('nama', 'like', 'Periode 20%')->count();
    $countKepengurusanBefore = Kepengurusan::count();

    $this->seed(KepengurusanHistorisSeeder::class);

    expect(Periode::where('nama', 'like', 'Periode 20%')->count())->toBe($countPeriodeBefore);
    expect(Kepengurusan::count())->toBe($countKepengurusanBefore);

    $periode20202021 = Periode::where('nama', 'Periode 2020/2021')->first();
    expect(Kepengurusan::where('periode_id', $periode20202021->id)->count())->toBe(39);
});

test('kepengurusan historis tidak mengubah data kanonis demo', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $periodeAktifBefore = Periode::where('aktif', true)->first();
    $countKepengurusanAktifBefore = Kepengurusan::where('periode_id', $periodeAktifBefore->id)->count();
    $countKegiatanBefore = Kegiatan::count();
    $countPendaftaranBefore = Pendaftaran::count();
    $totalPoinBefore = (int) PoinTransaksi::sum('jumlah');

    $this->seed(KepengurusanHistorisSeeder::class);

    $periodeAktifAfter = Periode::where('aktif', true)->first();
    expect($periodeAktifAfter->id)->toBe($periodeAktifBefore->id);
    expect($periodeAktifAfter->nama)->toBe($periodeAktifBefore->nama);

    expect(Kepengurusan::where('periode_id', $periodeAktifAfter->id)->count())->toBe($countKepengurusanAktifBefore);
    expect(Kegiatan::count())->toBe($countKegiatanBefore);
    expect(Pendaftaran::count())->toBe($countPendaftaranBefore);
    expect((int) PoinTransaksi::sum('jumlah'))->toBe($totalPoinBefore);
    expect($totalPoinBefore)->toBe(110);
});

test('nama asli tidak membawa kontak pada periode historis', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $periode20202021 = Periode::where('nama', 'Periode 2020/2021')->first();

    $pengurusAsli = Kepengurusan::where('periode_id', $periode20202021->id)
        ->where('nama_tampil', 'not like', '%(Demo)%')
        ->get();

    expect($pengurusAsli)->not->toBeEmpty();

    foreach ($pengurusAsli as $pengurus) {
        expect($pengurus->no_hp)->toBeNull();
        expect($pengurus->instagram)->toBeNull();
        expect($pengurus->email)->toBeNull();
        expect($pengurus->kontak)->toBeNull();
    }
});

test('nama demo membawa kontak contoh pada periode historis', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $periode20182020 = Periode::where('nama', 'Periode 2018/2020')->first();

    $pengurusDemo = Kepengurusan::where('periode_id', $periode20182020->id)
        ->where('nama_tampil', 'like', '%(Demo)%')
        ->get();

    expect($pengurusDemo)->not->toBeEmpty();

    foreach ($pengurusDemo as $pengurus) {
        expect($pengurus->no_hp)->not->toBeNull();
        expect($pengurus->instagram)->not->toBeNull();
        expect($pengurus->email)->not->toBeNull();
        expect($pengurus->kontak)->not->toBeNull();
    }
});

test('periode 2020/2021 memiliki struktur lengkap dengan ketua komisariat UNG Naswa Adilia Alamri', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $periode20202021 = Periode::where('nama', 'Periode 2020/2021')->first();
    $komsatUNG = Komsat::where('kode', 'UNG')->first();

    $ketuaUNG = Kepengurusan::where('periode_id', $periode20202021->id)
        ->where('komsat_id', $komsatUNG->id)
        ->where('jabatan', 'Ketua Komisariat')
        ->first();

    expect($ketuaUNG)->not->toBeNull();
    expect($ketuaUNG->nama_tampil)->toBe('Naswa Adilia Alamri');
});

test('periode 2018/2020 memiliki Vebriansyah Mohi sebagai Ketua Umum', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $periode20182020 = Periode::where('nama', 'Periode 2018/2020')->first();

    $ketuaUmum = Kepengurusan::where('periode_id', $periode20182020->id)
        ->whereNull('komsat_id')
        ->where('jabatan', 'Ketua Umum')
        ->first();

    expect($ketuaUmum)->not->toBeNull();
    expect($ketuaUmum->nama_tampil)->toBe('Vebriansyah Mohi');
    expect($ketuaUmum->no_hp)->toBeNull();
    expect($ketuaUmum->email)->toBeNull();
});

test('mahasiswa_id null pada semua pengurus historis', function () {
    $this->seed(DatabaseSeeder::class);
    $this->seed(DemoSeeder::class);

    $this->seed(KepengurusanHistorisSeeder::class);

    $periodeHistoris = Periode::whereIn('nama', [
        'Periode 2018/2020',
        'Periode 2020/2021',
        'Periode 2021/2022',
        'Periode 2022/2023',
        'Periode 2023/2024',
        'Periode 2024/2025',
    ])->pluck('id');

    $pengurusHistoris = Kepengurusan::whereIn('periode_id', $periodeHistoris)->get();

    expect($pengurusHistoris)->not->toBeEmpty();

    foreach ($pengurusHistoris as $pengurus) {
        expect($pengurus->mahasiswa_id)->toBeNull();
    }
});

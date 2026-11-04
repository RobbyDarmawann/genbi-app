<?php

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Kepengurusan;
use App\Models\Mahasiswa;
use App\Models\Periode;
use App\Models\PoinTransaksi;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoSeeder;
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
        DatabaseSeeder::class,
    ]);
});

test('demo seeder idempoten tidak menduplikasi data kunci saat dijalankan dua kali', function () {
    $this->seed(DemoSeeder::class);

    $countMahasiswaFirst = Mahasiswa::count();
    $countKegiatanFirst = Kegiatan::count();
    $countKepengurusanFirst = Kepengurusan::count();

    $this->seed(DemoSeeder::class);

    expect(Mahasiswa::count())->toBe($countMahasiswaFirst);
    expect(Kegiatan::count())->toBe($countKegiatanFirst);
    expect(Kepengurusan::count())->toBe($countKepengurusanFirst);
});

test('total poin demo berasal dari transaksi ledger', function () {
    $this->seed(DemoSeeder::class);

    $mahasiswaWithPoin = Mahasiswa::whereHas('poinTransaksi')->get();

    expect($mahasiswaWithPoin)->not->toBeEmpty();

    foreach ($mahasiswaWithPoin as $mahasiswa) {
        $totalLedger = PoinTransaksi::where('mahasiswa_id', $mahasiswa->id)->sum('jumlah');
        $totalMethod = $mahasiswa->totalPoin();

        expect($totalMethod)->toBe($totalLedger);
    }
});

test('kegiatan terkunci tidak memiliki kehadiran menunggu tinjau', function () {
    $this->seed(DemoSeeder::class);

    $kegiatanTerkunci = Kegiatan::where('status', StatusKegiatan::Terkunci)->get();

    expect($kegiatanTerkunci)->not->toBeEmpty();

    foreach ($kegiatanTerkunci as $kegiatan) {
        $kehadiranMenunggu = Kehadiran::whereHas('pendaftaran', function ($q) use ($kegiatan) {
            $q->where('kegiatan_id', $kegiatan->id);
        })->where('status', StatusKehadiran::MenungguTinjau)->count();

        expect($kehadiranMenunggu)->toBe(0);
    }
});

test('kegiatan terkunci tidak memiliki koreksi menunggu', function () {
    $this->seed(DemoSeeder::class);

    $kegiatanTerkunci = Kegiatan::where('status', StatusKegiatan::Terkunci)->get();

    expect($kegiatanTerkunci)->not->toBeEmpty();

    foreach ($kegiatanTerkunci as $kegiatan) {
        $koreksiMenunggu = $kegiatan->koreksi()->where('status', StatusKoreksi::Menunggu)->count();

        expect($koreksiMenunggu)->toBe(0);
    }
});

test('leaderboard dapat dihitung dari data demo', function () {
    $this->seed(DemoSeeder::class);

    $leaderboard = Mahasiswa::query()
        ->where('aktif', true)
        ->withTotalPoin()
        ->orderByDesc('total_poin')
        ->take(10)
        ->get();

    expect($leaderboard)->not->toBeEmpty();

    foreach ($leaderboard as $mahasiswa) {
        expect($mahasiswa->total_poin)->toBeGreaterThanOrEqual(0);
    }
});

test('minimal 15 mahasiswa demo dibuat', function () {
    $this->seed(DemoSeeder::class);

    $mahasiswaDemo = Mahasiswa::whereHas('user', function ($q) {
        $q->where('username', 'like', 'mhs%');
    })->count();

    expect($mahasiswaDemo)->toBeGreaterThanOrEqual(15);
});

test('minimal 8 kegiatan demo dibuat dengan berbagai status', function () {
    $this->seed(DemoSeeder::class);

    $kegiatanDemo = Kegiatan::where('judul', 'like', '%(Demo UAS)%')->count();

    expect($kegiatanDemo)->toBeGreaterThanOrEqual(8);

    $hasTerkunci = Kegiatan::where('judul', 'like', '%(Demo UAS)%')
        ->where('status', StatusKegiatan::Terkunci)
        ->exists();
    $hasTerbit = Kegiatan::where('judul', 'like', '%(Demo UAS)%')
        ->where('status', StatusKegiatan::Terbit)
        ->exists();
    $hasDraft = Kegiatan::where('judul', 'like', '%(Demo UAS)%')
        ->where('status', StatusKegiatan::Draft)
        ->exists();

    expect($hasTerkunci)->toBeTrue();
    expect($hasTerbit)->toBeTrue();
    expect($hasDraft)->toBeTrue();
});

test('periode demo aktif dibuat', function () {
    $this->seed(DemoSeeder::class);

    $periodeAktif = Periode::where('aktif', true)->first();

    expect($periodeAktif)->not->toBeNull();
    expect($periodeAktif->nama)->toBe('Periode Demo UAS 2026');
});

test('kepengurusan wilayah dan komsat dibuat', function () {
    $this->seed(DemoSeeder::class);

    $kepengurusanWilayah = Kepengurusan::whereNull('komsat_id')->count();
    $kepengurusanKomsat = Kepengurusan::whereNotNull('komsat_id')->count();

    expect($kepengurusanWilayah)->toBeGreaterThan(0);
    expect($kepengurusanKomsat)->toBeGreaterThan(0);
});

<?php

use App\Actions\Statistik\GetEvaluationReportAction;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\PoinTransaksi;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\DemoSeeder;
use Database\Seeders\DivisiSeeder;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RoleSeeder;
use Database\Seeders\TrenDemoSeeder;

beforeEach(function () {
    $this->seed([
        RoleSeeder::class,
        KomsatSeeder::class,
        DivisiSeeder::class,
        PeriodeSeeder::class,
        DatabaseSeeder::class,
        DemoSeeder::class,
    ]);
});

test('tren demo seeder menghasilkan deret bulanan n minimal 4 untuk kelima komsat dan tren naik untuk UNG', function () {
    $this->seed(TrenDemoSeeder::class);

    $report = app(GetEvaluationReportAction::class)->handle([]);

    expect($report['proyeksi_tren'])->toHaveCount(5);

    $komsatMap = collect($report['proyeksi_tren'])->keyBy('komsat');

    foreach (['UNG', 'IAIN', 'UG', 'UMGO', 'UBM'] as $kode) {
        $item = $komsatMap->get($kode);
        expect($item)->not->toBeNull();
        expect($item['bulan_data'])->toBeGreaterThanOrEqual(4);
        expect($item['proyeksi_partisipasi'])->toBeInt();
        expect($item['pesan'])->toBeNull();
    }

    expect($komsatMap->get('UNG')['tren'])->toBe('Naik');
});

test('tren demo seeder idempoten saat dijalankan dua kali tanpa menggandakan kegiatan dan pendaftaran', function () {
    $this->seed(TrenDemoSeeder::class);

    $countKegiatanFirst = Kegiatan::count();
    $countKegiatanTrenFirst = Kegiatan::where('judul', 'like', '%(Demo Tren)%')->count();
    $countPendaftaranFirst = Pendaftaran::count();

    $this->seed(TrenDemoSeeder::class);

    expect($countKegiatanTrenFirst)->toBe(4);
    expect(Kegiatan::count())->toBe($countKegiatanFirst);
    expect(Kegiatan::where('judul', 'like', '%(Demo Tren)%')->count())->toBe(4);
    expect(Pendaftaran::count())->toBe($countPendaftaranFirst);
});

test('tren demo seeder tidak mengubah total poin mahasiswa dan tidak menambah kehadiran', function () {
    $poinPerMahasiswaBefore = Mahasiswa::orderBy('id')
        ->get()
        ->mapWithKeys(fn (Mahasiswa $m) => [$m->id => $m->totalPoin()])
        ->all();
    $totalLedgerBefore = (int) PoinTransaksi::sum('jumlah');
    $countTransaksiBefore = PoinTransaksi::count();
    $countKehadiranBefore = Kehadiran::count();

    $this->seed(TrenDemoSeeder::class);

    expect((int) PoinTransaksi::sum('jumlah'))->toBe($totalLedgerBefore);
    expect(PoinTransaksi::count())->toBe($countTransaksiBefore);
    expect(Kehadiran::count())->toBe($countKehadiranBefore);

    $poinPerMahasiswaAfter = Mahasiswa::orderBy('id')
        ->get()
        ->mapWithKeys(fn (Mahasiswa $m) => [$m->id => $m->totalPoin()])
        ->all();

    expect($poinPerMahasiswaAfter)->toBe($poinPerMahasiswaBefore);
});

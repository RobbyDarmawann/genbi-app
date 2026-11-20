<?php

use App\Actions\Statistik\GetEvaluationReportAction;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\User;
use Database\Seeders\DataTrenSeeder;
use Illuminate\Support\Carbon;

test('DataTrenSeeder membuat 60 anggota, 24 kegiatan, dan target pendaftaran bulanan eksak serta idempoten', function () {
    Carbon::setTestNow(Carbon::create(2026, 11, 19, 10, 0, 0, 'Asia/Makassar'));

    $this->seed(DataTrenSeeder::class);

    // 1. Periode 2026
    $periode = Periode::where('nama', 'Periode 2026')->first();
    expect($periode)->not->toBeNull()
        ->and($periode->aktif)->toBeFalse();

    // 2. 60 anggota sesuai distribusi Komsat: UNG 16, IAIN 12, UG 11, UMGO 11, UBM 10
    $anggotaUsers = User::where('username', 'like', 'anggota%')->pluck('id');
    expect($anggotaUsers)->toHaveCount(60);

    $distribusiKomsat = Mahasiswa::whereIn('user_id', $anggotaUsers)
        ->join('komsat', 'komsat.id', '=', 'mahasiswa.komsat_id')
        ->selectRaw('komsat.kode, COUNT(*) as total')
        ->groupBy('komsat.kode')
        ->pluck('total', 'kode')
        ->all();

    expect($distribusiKomsat)->toEqual([
        'UNG' => 16,
        'IAIN' => 12,
        'UG' => 11,
        'UMGO' => 11,
        'UBM' => 10,
    ]);

    // 3. 24 Kegiatan dan target bulanan Terdaftar eksak
    expect(Kegiatan::count())->toBe(24);
    expect(Pendaftaran::where('status', StatusPendaftaran::Terdaftar)->count())->toBe(420);

    $perBulan = Pendaftaran::query()
        ->join('kegiatan', 'kegiatan.id', '=', 'pendaftaran.kegiatan_id')
        ->where('pendaftaran.status', StatusPendaftaran::Terdaftar)
        ->get(['kegiatan.tanggal'])
        ->groupBy(fn ($row) => Carbon::parse($row->tanggal)->format('Y-m'))
        ->map(fn ($rows) => $rows->count())
        ->sortKeys()
        ->all();

    expect($perBulan)->toBe([
        '2026-01' => 21,
        '2026-02' => 26,
        '2026-03' => 24,
        '2026-04' => 31,
        '2026-05' => 29,
        '2026-06' => 38,
        '2026-07' => 44,
        '2026-08' => 41,
        '2026-09' => 49,
        '2026-10' => 55,
        '2026-11' => 52,
        '2026-12' => 10,
    ]);

    // 4. Campuran kehadiran (Jan - Nov = 410 pendaftaran; Des = 10 pendaftaran tanpa kehadiran)
    $validCount = Kehadiran::where('status', StatusKehadiran::Valid)->count();
    $menungguCount = Kehadiran::where('status', StatusKehadiran::MenungguTinjau)->count();
    $ditolakCount = Kehadiran::where('status', StatusKehadiran::Ditolak)->count();
    $totalKehadiran = Kehadiran::count();
    $tanpaCatatan = 410 - $totalKehadiran;

    expect($validCount)->toBeGreaterThanOrEqual(370)
        ->and($menungguCount)->toBeGreaterThanOrEqual(5)
        ->and($ditolakCount)->toBeGreaterThanOrEqual(4)
        ->and($tanpaCatatan)->toBeGreaterThanOrEqual(4)
        ->and($tanpaCatatan)->toBeLessThanOrEqual(15);

    // 5. Rekap evaluasi Jan-Nov 2026 menghasilkan tren Naik dan proyeksi 58
    $reportJanNov = app(GetEvaluationReportAction::class)->handle([
        'mulai' => '2026-01-01',
        'akhir' => '2026-11-30',
    ]);

    $partisipasiPerBulan = array_map(
        static fn (array $row): int => (int) $row['partisipasi'],
        $reportJanNov['tren']
    );

    expect($reportJanNov['tren'])->toHaveCount(11)
        ->and($partisipasiPerBulan)->toBe([21, 26, 24, 31, 29, 38, 44, 41, 49, 55, 52]);

    // Pada tren_chart, elemen ke-12 adalah titik proyeksi (58)
    $lastChartItem = end($reportJanNov['tren_chart']);
    expect($lastChartItem['proyeksi'])->toBe(58);

    // Rekap Jan-Des: Karena bulan berjalan adalah Nov 2026, kegiatan Des tidak memperpanjang deret tren
    $reportJanDes = app(GetEvaluationReportAction::class)->handle([
        'mulai' => '2026-01-01',
        'akhir' => '2026-12-31',
    ]);
    expect($reportJanDes['tren'])->toHaveCount(11);
    $lastChartItemDes = end($reportJanDes['tren_chart']);
    expect($lastChartItemDes['proyeksi'])->toBe(58);

    // 6. Idempotensi saat dijalankan ulang
    $this->seed(DataTrenSeeder::class);

    expect(User::where('username', 'like', 'anggota%')->count())->toBe(60)
        ->and(Kegiatan::count())->toBe(24)
        ->and(Pendaftaran::where('status', StatusPendaftaran::Terdaftar)->count())->toBe(420)
        ->and(Kehadiran::count())->toBe($totalKehadiran);

    Carbon::setTestNow();
});

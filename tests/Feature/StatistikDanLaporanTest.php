<?php

use App\Actions\Statistik\GetEvaluationReportAction;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Enums\TipePoin;
use App\Exports\LaporanGenbiExport;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\PoinTransaksi;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Maatwebsite\Excel\Facades\Excel;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);

    $this->admin = User::factory()->create(['username' => 'admin_im', 'is_active' => true]);
    $this->admin->assignRole('internal_manajemen');

    $this->ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
    $this->iain = Komsat::query()->where('kode', 'IAIN')->firstOrFail();

    $this->divisiUng = Divisi::factory()->create(['komsat_id' => $this->ung->id, 'aktif' => true]);
    $this->divisiIain = Divisi::factory()->create(['komsat_id' => $this->iain->id, 'aktif' => true]);

    $this->userUng = User::factory()->create([
        'name' => 'Andi Pratama',
        'username' => 'mhs_ung',
        'is_active' => true,
    ]);
    $this->userUng->assignRole('mahasiswa');
    $this->mhsUng = Mahasiswa::factory()->create([
        'user_id' => $this->userUng->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '531422099',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    $this->userIain = User::factory()->create([
        'name' => 'Budi Santoso',
        'username' => 'mhs_iain',
        'is_active' => true,
    ]);
    $this->userIain->assignRole('mahasiswa');
    $this->mhsIain = Mahasiswa::factory()->create([
        'user_id' => $this->userIain->id,
        'komsat_id' => $this->iain->id,
        'divisi_id' => $this->divisiIain->id,
        'nim' => '991422088',
        'status_penerima' => StatusPenerima::NonPenerima,
        'aktif' => true,
    ]);

    $userAlumni = User::factory()->create(['name' => 'Citra Alumni', 'username' => 'mhs_alumni', 'is_active' => false]);
    $userAlumni->assignRole('mahasiswa');
    $this->mhsAlumni = Mahasiswa::factory()->create([
        'user_id' => $userAlumni->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '111222333',
        'status_penerima' => StatusPenerima::Alumni,
        'aktif' => false,
    ]);

    $this->kegiatanUng = Kegiatan::factory()->create([
        'judul' => 'Sosialisasi QRIS UNG',
        'komsat_id' => $this->ung->id,
        'status' => StatusKegiatan::Terbit,
        'tanggal' => today(),
    ]);

    $this->kegiatanIain = Kegiatan::factory()->create([
        'judul' => 'Edukasi Cinta Bangga Rupiah IAIN',
        'komsat_id' => $this->iain->id,
        'status' => StatusKegiatan::Terkunci,
        'tanggal' => today()->subDays(5),
    ]);

    // Kegiatan draft dan dibatalkan tidak boleh masuk perhitungan statistik publik
    Kegiatan::factory()->create(['status' => StatusKegiatan::Draft, 'komsat_id' => $this->ung->id]);
    Kegiatan::factory()->create(['status' => StatusKegiatan::Dibatalkan, 'komsat_id' => $this->iain->id]);

    $pendaftaranUng = Pendaftaran::factory()->create([
        'kegiatan_id' => $this->kegiatanUng->id,
        'mahasiswa_id' => $this->mhsUng->id,
        'peran' => PeranKegiatan::Panitia,
        'status' => StatusPendaftaran::Terdaftar,
    ]);
    $kehadiranUng = Kehadiran::factory()->create([
        'pendaftaran_id' => $pendaftaranUng->id,
        'status' => StatusKehadiran::Valid,
        'foto_path' => 'absensi/secret-ung.jpg',
        'latitude' => 0.5561234,
        'longitude' => 123.0589876,
    ]);
    PoinTransaksi::factory()->create([
        'mahasiswa_id' => $this->mhsUng->id,
        'kegiatan_id' => $this->kegiatanUng->id,
        'kehadiran_id' => $kehadiranUng->id,
        'tipe' => TipePoin::Kredit,
        'jumlah' => 25,
        'dibuat_oleh' => $this->admin->id,
    ]);

    $pendaftaranIain = Pendaftaran::factory()->create([
        'kegiatan_id' => $this->kegiatanIain->id,
        'mahasiswa_id' => $this->mhsIain->id,
        'peran' => PeranKegiatan::Peserta,
        'status' => StatusPendaftaran::Terdaftar,
    ]);
    $kehadiranIain = Kehadiran::factory()->create([
        'pendaftaran_id' => $pendaftaranIain->id,
        'status' => StatusKehadiran::Valid,
        'foto_path' => 'absensi/secret-iain.jpg',
    ]);
    PoinTransaksi::factory()->create([
        'mahasiswa_id' => $this->mhsIain->id,
        'kegiatan_id' => $this->kegiatanIain->id,
        'kehadiran_id' => $kehadiranIain->id,
        'tipe' => TipePoin::Kredit,
        'jumlah' => 10,
        'dibuat_oleh' => $this->admin->id,
    ]);
});

test('guest melihat statistik agregat dan leaderboard tanpa data sensitif', function () {
    $response = $this->get(route('public.statistik'));

    $response->assertOk()->assertInertia(fn (Assert $page) => $page
        ->component('public/statistik')
        ->where('ringkasan.penerima_aktif', 1)
        ->where('ringkasan.non_penerima_aktif', 1)
        ->where('ringkasan.alumni', 1)
        ->where('ringkasan.total_kegiatan', 2)
        ->where('ringkasan.komsat_aktif', 5)
        ->has('leaderboard', 2)
        ->where('leaderboard.0.nama', 'Andi Pratama')
        ->where('leaderboard.0.komsat', 'UNG')
        ->where('leaderboard.0.total_poin', 25)
        ->where('leaderboard.1.nama', 'Budi Santoso')
        ->where('leaderboard.1.total_poin', 10)
        ->where('tertinggi.0.nama', 'Andi Pratama')
        ->where('terendah.0.nama', 'Budi Santoso')
    );

    $content = $response->getContent();
    expect($content)
        ->not->toContain('531422099')
        ->not->toContain('991422088')
        ->not->toContain('secret-ung.jpg')
        ->not->toContain('0.5561234');
});

test('pencarian leaderboard publik menyaring nama mahasiswa secara benar', function () {
    $this->get(route('public.statistik', ['q' => 'Budi']))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->has('leaderboard', 1)
            ->where('leaderboard.0.nama', 'Budi Santoso')
        );
});

test('filter komsat mengubah angka evaluasi secara benar dan total rekap sama dengan ledger', function () {
    $totalLedgerAll = (int) PoinTransaksi::whereIn('kegiatan_id', [$this->kegiatanUng->id, $this->kegiatanIain->id])->sum('jumlah');

    $this->actingAs($this->admin)
        ->get(route('admin.rekap.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/rekap')
            ->where('ringkasan.total_pendaftaran', 2)
            ->where('ringkasan.kehadiran_valid', 2)
            ->where('ringkasan.tingkat_kehadiran', 100)
        );

    $reportAll = app(GetEvaluationReportAction::class)->handle(['status' => 'terbit']);
    $reportFilteredUng = app(GetEvaluationReportAction::class)->handle(['komsat_id' => (string) $this->ung->id]);

    expect($reportFilteredUng['ringkasan']['total_kegiatan'])->toBe(2) // termasuk 1 draft UNG karena status=all
        ->and($reportFilteredUng['ringkasan']['total_pendaftaran'])->toBe(1)
        ->and($reportFilteredUng['ringkasan']['kehadiran_valid'])->toBe(1);

    $fullReport = app(GetEvaluationReportAction::class)->handle([]);
    $sumRekapPoin = array_sum(array_column($fullReport['rekap_komsat'], 'poin'));

    expect($sumRekapPoin)->toBe($totalLedgerAll)
        ->and($sumRekapPoin)->toBe(35);
});

test('mahasiswa tidak dapat mengakses halaman evaluasi maupun export', function () {
    $this->actingAs($this->userUng)
        ->get(route('admin.rekap.index'))
        ->assertForbidden();

    $this->actingAs($this->userUng)
        ->get(route('admin.rekap.export'))
        ->assertForbidden();
});

test('internal manajemen dapat mengekspor laporan excel dengan 5 sheet dan mencatat audit log', function () {
    Excel::fake();

    $this->actingAs($this->admin)
        ->get(route('admin.rekap.export', [
            'mulai' => today()->subDays(7)->toDateString(),
            'akhir' => today()->toDateString(),
        ]))
        ->assertOk();

    $expectedFilename = 'laporan-genbi-'.today()->subDays(7)->format('Ymd').'-'.today()->format('Ymd').'.xlsx';

    Excel::assertDownloaded($expectedFilename, function (LaporanGenbiExport $export): bool {
        $sheets = $export->sheets();
        $titles = array_map(fn ($sheet) => $sheet->title(), $sheets);

        return $titles === [
            'Ringkasan',
            'Rekap Komsat',
            'Kegiatan',
            'Kehadiran',
            'Transaksi Poin',
        ];
    });

    expect(AuditLog::query()->where('aksi', 'rekap.export')->where('user_id', $this->admin->id)->exists())->toBeTrue();
});

test('regresi linear memproyeksikan tren naik dengan benar', function () {
    expect(app(GetEvaluationReportAction::class)->linearProjection([10, 12, 14, 16]))
        ->toMatchArray(['n' => 4, 'projection' => 18, 'trend' => 'Naik'])
        ->and(app(GetEvaluationReportAction::class)->linearProjection([20, 16, 12, 8]))
        ->toMatchArray(['projection' => 4, 'trend' => 'Turun']);
});

test('regresi linear mempertahankan tren datar', function () {
    expect(app(GetEvaluationReportAction::class)->linearProjection([7, 7, 7, 7]))
        ->toMatchArray(['projection' => 7, 'trend' => 'Stabil']);
});

test('regresi linear menolak deret kurang dari empat titik', function () {
    expect(app(GetEvaluationReportAction::class)->linearProjection([7, 7, 7]))
        ->toMatchArray([
            'n' => 3,
            'projection' => null,
            'message' => 'Data belum cukup untuk proyeksi (minimal 4 bulan).',
        ]);
});

test('regresi linear meng-clamp proyeksi negatif menjadi nol', function () {
    expect(app(GetEvaluationReportAction::class)->linearProjection([10, 5, 0, -5]))
        ->toMatchArray(['projection' => 0, 'trend' => 'Turun']);
});

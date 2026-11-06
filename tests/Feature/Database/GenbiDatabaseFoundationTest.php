<?php

use App\Enums\PeranKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPenerima;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\PoinTransaksi;
use App\Models\User;
use Database\Seeders\DivisiSeeder;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\PeriodeSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Database\QueryException;
use Spatie\Permission\Models\Role;

test('seeder menyiapkan tepat 5 komsat baku', function () {
    $this->seed(KomsatSeeder::class);

    $kodeKomsat = Komsat::pluck('kode')->sort()->values()->all();

    expect($kodeKomsat)->toBe(['IAIN', 'UBM', 'UG', 'UMGO', 'UNG']);
});

test('seeder menyiapkan dua role final', function () {
    $this->seed(RoleSeeder::class);

    $roles = Role::pluck('name')->sort()->values()->all();

    expect($roles)->toBe(['internal_manajemen', 'mahasiswa']);
});

test('seeder divisi menyiapkan contoh divisi UNG', function () {
    $this->seed([KomsatSeeder::class, DivisiSeeder::class]);

    $ung = Komsat::where('kode', 'UNG')->firstOrFail();
    $divisiNames = $ung->divisi()->pluck('nama')->sort()->values()->all();

    expect($divisiNames)->toBe([
        'Kesehatan Masyarakat',
        'Kewirausahaan',
        'Kominfo',
        'Lingkungan Hidup',
        'Pendidikan',
        'Potensi Diri',
    ]);
});

test('seeder periode menyiapkan satu periode aktif', function () {
    $this->seed(PeriodeSeeder::class);

    $activeCount = Periode::where('aktif', true)->count();
    expect($activeCount)->toBe(1);
});

test('periode menegakkan aturan hanya satu periode aktif pada satu waktu', function () {
    $periode1 = Periode::create([
        'nama' => '2024-2025',
        'tanggal_mulai' => '2024-01-01',
        'tanggal_selesai' => '2025-12-31',
        'aktif' => true,
    ]);

    expect($periode1->fresh()->aktif)->toBeTrue();

    $periode2 = Periode::create([
        'nama' => '2025-2026',
        'tanggal_mulai' => '2025-01-01',
        'tanggal_selesai' => '2026-12-31',
        'aktif' => true,
    ]);

    expect($periode2->fresh()->aktif)->toBeTrue();
    expect($periode1->fresh()->aktif)->toBeFalse();
    expect(Periode::where('aktif', true)->count())->toBe(1);
});

test('mahasiswa menolak divisi yang bukan milik komsatnya', function () {
    $komsat1 = Komsat::create(['kode' => 'UNG', 'nama' => 'Universitas Negeri Gorontalo']);
    $komsat2 = Komsat::create(['kode' => 'UG', 'nama' => 'Universitas Gorontalo']);

    $divisiKomsat2 = Divisi::create([
        'komsat_id' => $komsat2->id,
        'nama' => 'Divisi Khusus UG',
    ]);

    $user = User::factory()->create();

    expect(function () use ($user, $komsat1, $divisiKomsat2) {
        Mahasiswa::create([
            'user_id' => $user->id,
            'komsat_id' => $komsat1->id,
            'divisi_id' => $divisiKomsat2->id,
            'nim' => '1234567890',
            'angkatan' => '2024',
            'status_penerima' => StatusPenerima::Penerima,
            'aktif' => true,
        ]);
    })->toThrow(InvalidArgumentException::class, 'Divisi yang dipilih tidak terdaftar di bawah Komsat mahasiswa tersebut.');
});

test('pendaftaran mencegah duplikasi mahasiswa pada satu kegiatan', function () {
    $kegiatan = Kegiatan::factory()->create();
    $mahasiswa = Mahasiswa::factory()->create();

    Pendaftaran::create([
        'kegiatan_id' => $kegiatan->id,
        'mahasiswa_id' => $mahasiswa->id,
        'peran' => PeranKegiatan::Peserta,
    ]);

    expect(function () use ($kegiatan, $mahasiswa) {
        Pendaftaran::create([
            'kegiatan_id' => $kegiatan->id,
            'mahasiswa_id' => $mahasiswa->id,
            'peran' => PeranKegiatan::Panitia,
        ]);
    })->toThrow(QueryException::class);
});

test('kehadiran memiliki kunci idempotensi unik per pendaftaran', function () {
    $pendaftaran = Pendaftaran::factory()->create();

    Kehadiran::create([
        'pendaftaran_id' => $pendaftaran->id,
        'tanggal' => $pendaftaran->kegiatan->tanggal,
        'waktu_checkin' => now(),
        'status' => StatusKehadiran::Valid,
    ]);

    expect(function () use ($pendaftaran) {
        Kehadiran::create([
            'pendaftaran_id' => $pendaftaran->id,
            'tanggal' => $pendaftaran->kegiatan->tanggal,
            'waktu_checkin' => now(),
            'status' => StatusKehadiran::Valid,
        ]);
    })->toThrow(QueryException::class);
});

test('total poin mahasiswa selalu dihitung dari sum transaksi poin tanpa kolom saldo manual', function () {
    $mahasiswa = Mahasiswa::factory()->create();

    expect($mahasiswa->totalPoin())->toBe(0);

    PoinTransaksi::create([
        'mahasiswa_id' => $mahasiswa->id,
        'tipe' => TipePoin::Kredit,
        'jumlah' => 15,
        'keterangan' => 'Kehadiran kegiatan A',
    ]);

    PoinTransaksi::create([
        'mahasiswa_id' => $mahasiswa->id,
        'tipe' => TipePoin::Kredit,
        'jumlah' => 20,
        'keterangan' => 'Kehadiran kegiatan B',
    ]);

    PoinTransaksi::create([
        'mahasiswa_id' => $mahasiswa->id,
        'tipe' => TipePoin::Koreksi,
        'jumlah' => -5,
        'keterangan' => 'Koreksi penyesuaian',
    ]);

    expect($mahasiswa->totalPoin())->toBe(30);
});

test('audit log dapat mencatat aksi administratif tanpa data sensitif', function () {
    $user = User::factory()->create();

    $log = AuditLog::catat(
        aksi: 'kegiatan.kunci',
        userId: $user->id,
        subjectType: Kegiatan::class,
        subjectId: 10,
        metadata: ['status_baru' => 'terkunci']
    );

    expect($log)->toBeInstanceOf(AuditLog::class);
    expect($log->aksi)->toBe('kegiatan.kunci');
    expect($log->metadata['status_baru'])->toBe('terkunci');
});

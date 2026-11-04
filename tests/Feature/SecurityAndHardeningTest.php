<?php

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKoreksi;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Exports\ArraySheet;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\Koreksi;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('absensi');
    RateLimiter::clear('absensi-submit');

    $this->seed([RoleSeeder::class, KomsatSeeder::class]);

    $this->internal = User::factory()->create(['username' => 'admin_sec']);
    $this->internal->assignRole('internal_manajemen');

    $this->ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
    $this->divisiUng = Divisi::factory()->create([
        'komsat_id' => $this->ung->id,
        'nama' => 'Pendidikan',
        'aktif' => true,
    ]);

    $this->mahasiswaUser = User::factory()->create(['username' => 'mhs_sec', 'is_active' => true]);
    $this->mahasiswaUser->assignRole('mahasiswa');
    $this->mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->mahasiswaUser->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '531424999',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    $this->kegiatan = Kegiatan::factory()->create([
        'judul' => 'Kegiatan Security Audit',
        'status' => StatusKegiatan::Berlangsung,
        'latitude' => '0.5561740',
        'longitude' => '123.0585480',
        'radius_m' => 100,
        'pendaftaran_dibuka_at' => now()->subDays(2),
        'batas_daftar_at' => now()->addHours(2),
        'absensi_buka_at' => now()->subMinutes(30),
        'absensi_tutup_at' => now()->addMinutes(90),
        'dibuat_oleh' => $this->internal->id,
    ]);
    $this->kegiatan->divisiTarget()->sync([$this->divisiUng->id]);

    $this->pendaftaran = Pendaftaran::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'mahasiswa_id' => $this->mahasiswa->id,
        'peran' => PeranKegiatan::Peserta,
        'status' => StatusPendaftaran::Terdaftar,
    ]);
});

test('rate limit absensi submit membatasi maksimal 10 request per menit', function () {
    $foto = UploadedFile::fake()->image('selfie.jpg', 640, 480);

    for ($i = 0; $i < 10; $i++) {
        $response = $this->actingAs($this->mahasiswaUser)->post(
            route('mahasiswa.absensi.submit', $this->kegiatan),
            [
                'latitude' => 0.5561740,
                'longitude' => 123.0585480,
                'akurasi_m' => 10.0,
                'foto' => $foto,
            ]
        );
        expect($response->status())->not->toBe(429);
    }

    // Request ke-11 harus dibatasi (HTTP 429 Too Many Requests)
    $response11 = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => 0.5561740,
            'longitude' => 123.0585480,
            'akurasi_m' => 10.0,
            'foto' => $foto,
        ]
    );

    $response11->assertStatus(429);
});

test('sanitasi formula injection pada ArraySheet menetralkan karakter berbahaya', function () {
    $rows = [
        ['=SUM(1+1)', '+12345', '-500', '@calc', "\tcmd", "\reval", 'Nama Biasa'],
    ];

    $headings = ['=KOLOM1', '+KOLOM2', 'Normal'];

    $sheet = new ArraySheet('Test', $headings, $rows);

    $sanitizedHeadings = $sheet->headings();
    $sanitizedRows = $sheet->array();

    expect($sanitizedHeadings[0])->toBe("'=KOLOM1")
        ->and($sanitizedHeadings[1])->toBe("'+KOLOM2")
        ->and($sanitizedHeadings[2])->toBe('Normal');

    expect($sanitizedRows[0][0])->toBe("'=SUM(1+1)")
        ->and($sanitizedRows[0][1])->toBe("'+12345")
        ->and($sanitizedRows[0][2])->toBe("'-500")
        ->and($sanitizedRows[0][3])->toBe("'@calc")
        ->and($sanitizedRows[0][4])->toBe("'\tcmd")
        ->and($sanitizedRows[0][5])->toBe("'\reval")
        ->and($sanitizedRows[0][6])->toBe('Nama Biasa');
});

test('field istimewa diabaikan saat mahasiswa memperbarui profil', function () {
    $this->actingAs($this->mahasiswaUser)->patch(route('profile.update'), [
        'name' => 'Nama Baru',
        'email' => 'namabaru@example.com',
        'role' => 'internal_manajemen',
        'is_active' => false,
        'poin' => 9999,
    ])->assertRedirect();

    $this->mahasiswaUser->refresh();
    expect($this->mahasiswaUser->name)->toBe('Nama Baru')
        ->and($this->mahasiswaUser->hasRole('mahasiswa'))->toBeTrue()
        ->and($this->mahasiswaUser->hasRole('internal_manajemen'))->toBeFalse()
        ->and($this->mahasiswaUser->is_active)->toBeTrue();
});

test('props Inertia halaman publik dan dashboard tidak membocorkan data sensitif', function () {
    // 1. Beranda publik
    $this->get(route('home'))
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->component('welcome');
        });

    // 2. Statistik publik
    $this->get(route('public.statistik'))
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->component('public/statistik');
        });

    // 3. User props tidak membocorkan password_hash
    $this->actingAs($this->mahasiswaUser)->get(route('dashboard'))
        ->assertRedirect();
});

test('filter dinamis pada rekap evaluasi menolak input ilegal melalui allow-list validasi', function () {
    $this->actingAs($this->internal)
        ->get(route('admin.rekap.index', [
            'komsat_id' => '99999999',
            'divisi_id' => '-1',
            'status' => 'STATUS_ILEGAL',
            'tanggal_mulai' => 'invalid-date',
            'tanggal_akhir' => 'invalid-date',
        ]))
        ->assertSessionHasErrors(['status']);
});

test('mass assignment field istimewa pada pendaftaran mandiri dan pengajuan koreksi diabaikan', function () {
    // Buat kegiatan baru untuk pendaftaran mandiri
    $kegiatanBaru = Kegiatan::factory()->create([
        'judul' => 'Kegiatan Pendaftaran Mass Assignment',
        'status' => StatusKegiatan::Terbit,
        'pendaftaran_dibuka_at' => now()->subDay(),
        'batas_daftar_at' => now()->addDay(),
        'absensi_buka_at' => now()->addDays(2),
        'absensi_tutup_at' => now()->addDays(2)->addHours(2),
        'dibuat_oleh' => $this->internal->id,
    ]);
    $kegiatanBaru->divisiTarget()->sync([$this->divisiUng->id]);

    // Peran istimewa ditolak; mahasiswa tidak dapat menentukan perannya sendiri.
    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.kegiatan.daftar', $kegiatanBaru), [
            'peran' => 'pemateri',
            'status' => 'dibatalkan',
            'mahasiswa_id' => 99999,
        ])
        ->assertSessionHasErrors('peran');

    expect(Pendaftaran::query()
        ->where('kegiatan_id', $kegiatanBaru->id)
        ->where('mahasiswa_id', $this->mahasiswa->id)
        ->exists())->toBeFalse();

    // Data valid tetap menghasilkan peran/status default dari server.
    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.kegiatan.daftar', $kegiatanBaru), [])
        ->assertRedirect();

    $pendaftaranBaru = Pendaftaran::query()
        ->where('kegiatan_id', $kegiatanBaru->id)
        ->where('mahasiswa_id', $this->mahasiswa->id)
        ->firstOrFail();

    expect($pendaftaranBaru->peran)->toBe(PeranKegiatan::Peserta)
        ->and($pendaftaranBaru->status)->toBe(StatusPendaftaran::Terdaftar);

    // Coba suntikkan status=disetujui dan diproses_oleh saat buat koreksi
    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.koreksi.store'), [
            'kegiatan_id' => $this->kegiatan->id,
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => 'belum_absen',
            'alasan' => 'Kendala jaringan saat di lokasi kegiatan berlangsung.',
            'status' => 'disetujui',
            'diproses_oleh' => $this->internal->id,
            'catatan_proses' => 'Disetujui sendiri',
        ])
        ->assertRedirect();

    $koreksi = Koreksi::query()
        ->where('mahasiswa_id', $this->mahasiswa->id)
        ->where('kegiatan_id', $this->kegiatan->id)
        ->firstOrFail();

    expect($koreksi->status)->toBe(StatusKoreksi::Menunggu)
        ->and($koreksi->diproses_oleh)->toBeNull()
        ->and($koreksi->catatan_proses)->toBeNull();
});

test('validasi upload foto absensi menolak file berbahaya atau melebihi ukuran maksimal', function () {
    $fileExe = UploadedFile::fake()->create('exploit.php', 100, 'application/x-php');

    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.absensi.submit', $this->kegiatan), [
            'latitude' => 0.5561740,
            'longitude' => 123.0585480,
            'akurasi_m' => 10.0,
            'foto' => $fileExe,
        ])
        ->assertSessionHasErrors('foto');

    $fileTerlaluBesar = UploadedFile::fake()->image('huge.jpg')->size(6000);

    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.absensi.submit', $this->kegiatan), [
            'latitude' => 0.5561740,
            'longitude' => 123.0585480,
            'akurasi_m' => 10.0,
            'foto' => $fileTerlaluBesar,
        ])
        ->assertSessionHasErrors('foto');
});

test('shared Inertia auth.user tidak mengekspos atribut rahasia', function () {
    $this->actingAs($this->mahasiswaUser)
        ->get(route('mahasiswa.dashboard'))
        ->assertOk()
        ->assertInertia(function (Assert $page) {
            $page->has('auth.user')
                ->missing('auth.user.password')
                ->missing('auth.user.remember_token')
                ->missing('auth.user.two_factor_secret')
                ->missing('auth.user.two_factor_recovery_codes');
        });
});

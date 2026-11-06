<?php

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Enums\TipePoin;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\PoinTransaksi;
use App\Models\SesiAbsensi;
use App\Models\User;
use App\Support\Haversine;
use Carbon\CarbonImmutable;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
    Storage::fake('absensi');

    $this->seed([RoleSeeder::class, KomsatSeeder::class]);

    $this->internal = User::factory()->create(['username' => 'admin_im']);
    $this->internal->assignRole('internal_manajemen');

    $this->ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
    $this->iain = Komsat::query()->where('kode', 'IAIN')->firstOrFail();

    $this->divisiUng = Divisi::factory()->create([
        'komsat_id' => $this->ung->id,
        'nama' => 'Pendidikan',
        'aktif' => true,
    ]);
    $this->divisiIain = Divisi::factory()->create([
        'komsat_id' => $this->iain->id,
        'nama' => 'Kesehatan',
        'aktif' => true,
    ]);

    $this->mahasiswaUser = User::factory()->create([
        'username' => 'mhs_absen',
        'is_active' => true,
    ]);
    $this->mahasiswaUser->assignRole('mahasiswa');
    $this->mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->mahasiswaUser->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '531424101',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    $this->otherUser = User::factory()->create([
        'username' => 'mhs_lain',
        'is_active' => true,
    ]);
    $this->otherUser->assignRole('mahasiswa');
    $this->otherMahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->otherUser->id,
        'komsat_id' => $this->iain->id,
        'divisi_id' => $this->divisiIain->id,
        'nim' => '531424102',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);

    // Titik pusat kegiatan: Kampus UNG (0.5561740, 123.0585480), radius 100 meter
    $this->centerLat = 0.5561740;
    $this->centerLng = 123.0585480;

    $this->kegiatan = Kegiatan::factory()->create([
        'judul' => 'Edukasi Cinta Bangga Paham Rupiah',
        'status' => StatusKegiatan::Berlangsung,
        'latitude' => (string) $this->centerLat,
        'longitude' => (string) $this->centerLng,
        'radius_m' => 100,
        'tanggal' => now()->toDateString(),
        'pendaftaran_dibuka_at' => now()->subDays(2),
        'batas_daftar_at' => now()->addHours(2),
        'absensi_buka_at' => now()->subMinutes(30),
        'absensi_tutup_at' => now()->addMinutes(90),
        'dibuat_oleh' => $this->internal->id,
    ]);
    $this->kegiatan->divisiTarget()->sync([$this->divisiUng->id]);

    KegiatanBobot::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Peserta,
        'poin' => 10,
    ]);
    KegiatanBobot::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Panitia,
        'poin' => 20,
    ]);
    KegiatanBobot::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Pemateri,
        'poin' => 30,
    ]);

    $this->pendaftaran = Pendaftaran::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'mahasiswa_id' => $this->mahasiswa->id,
        'peran' => PeranKegiatan::Peserta,
        'status' => StatusPendaftaran::Terdaftar,
    ]);
});

test('titik koordinat yang sama menghasilkan jarak 0, status valid, dan kredit poin pada transaksi yang sama', function () {
    expect(Haversine::distance($this->centerLat, $this->centerLng, $this->centerLat, $this->centerLng))->toBe(0.0);

    $foto = UploadedFile::fake()->image('selfie.jpg', 640, 480);

    $response = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 15.5,
            'foto' => $foto,
        ]
    );

    $response->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $kehadiran = Kehadiran::query()->where('pendaftaran_id', $this->pendaftaran->id)->first();
    expect($kehadiran)->not->toBeNull()
        ->and($kehadiran->status)->toBe(StatusKehadiran::Valid)
        ->and((float) $kehadiran->jarak_m)->toBe(0.0)
        ->and((float) $kehadiran->akurasi_m)->toBe(15.5)
        ->and($kehadiran->foto_path)->not->toBeNull();

    Storage::disk('absensi')->assertExists($kehadiran->foto_path);

    $poin = PoinTransaksi::query()->where('kehadiran_id', $kehadiran->id)->first();
    expect($poin)->not->toBeNull()
        ->and($poin->mahasiswa_id)->toBe($this->mahasiswa->id)
        ->and($poin->kegiatan_id)->toBe($this->kegiatan->id)
        ->and($poin->tipe)->toBe(TipePoin::Kredit)
        ->and($poin->jumlah)->toBe(10);

    expect(AuditLog::query()->where('aksi', 'kehadiran.submitted')->where('subject_id', $kehadiran->id)->exists())->toBeTrue();
});

test('titik koordinat di luar radius ditolak tanpa memberi poin namun menyimpan kehadiran ditolak dan foto', function () {
    // Geser ~0.003 derajat lintang (~333 meter > radius 100 meter)
    $farLat = $this->centerLat + 0.003;
    $farLng = $this->centerLng;

    expect(Haversine::distance($this->centerLat, $this->centerLng, $farLat, $farLng))->toBeGreaterThan(100.0);

    $response = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $farLat,
            'longitude' => $farLng,
            'akurasi_m' => 12.0,
            'foto' => UploadedFile::fake()->image('selfie-luar.jpg', 640, 480),
        ]
    );

    $response->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $kehadiran = Kehadiran::query()->where('pendaftaran_id', $this->pendaftaran->id)->first();
    expect($kehadiran)->not->toBeNull()
        ->and($kehadiran->status)->toBe(StatusKehadiran::Ditolak)
        ->and((float) $kehadiran->jarak_m)->toBeGreaterThan(100.0)
        ->and($kehadiran->alasan_penolakan)->toContain('Lokasi di luar radius kegiatan');

    Storage::disk('absensi')->assertExists($kehadiran->foto_path);
    expect(PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->count())->toBe(0);
});

test('akurasi GPS di atas 100 meter di dalam radius berstatus menunggu_tinjau tanpa memberi poin', function () {
    $response = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 145.0,
            'foto' => UploadedFile::fake()->image('selfie-akurasi-rendah.jpg', 640, 480),
        ]
    );

    $response->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $kehadiran = Kehadiran::query()->where('pendaftaran_id', $this->pendaftaran->id)->first();
    expect($kehadiran)->not->toBeNull()
        ->and($kehadiran->status)->toBe(StatusKehadiran::MenungguTinjau)
        ->and((float) $kehadiran->akurasi_m)->toBe(145.0);

    expect(PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->count())->toBe(0);
});

test('absensi di luar jendela waktu ditolak dan tidak membuat kehadiran maupun poin', function () {
    $this->kegiatan->update([
        'absensi_buka_at' => now()->addHour(),
        'absensi_tutup_at' => now()->addHours(3),
    ]);
    $this->kegiatan->sesiAbsensi()->update([
        'jam_buka' => now()->addHour()->format('H:i:s'),
        'jam_tutup' => now()->addHours(3)->format('H:i:s'),
    ]);

    $response = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie.jpg', 640, 480),
        ]
    );

    $response->assertSessionHasErrors('absensi');
    expect(Kehadiran::query()->count())->toBe(0)
        ->and(PoinTransaksi::query()->count())->toBe(0);

    // Skenario jendela sudah tutup
    $this->kegiatan->update([
        'absensi_buka_at' => now()->subHours(4),
        'absensi_tutup_at' => now()->subHour(),
    ]);
    $this->kegiatan->sesiAbsensi()->update([
        'jam_buka' => now()->subHours(4)->format('H:i:s'),
        'jam_tutup' => now()->subHour()->format('H:i:s'),
    ]);

    $responseAfterClose = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie2.jpg', 640, 480),
        ]
    );

    $responseAfterClose->assertSessionHasErrors('absensi');
    expect(Kehadiran::query()->count())->toBe(0)
        ->and(PoinTransaksi::query()->count())->toBe(0);
});

test('mahasiswa non-pendaftar atau non-target tidak dapat membuka halaman absensi maupun mengirim absensi', function () {
    $this->actingAs($this->otherUser)
        ->get(route('mahasiswa.absensi.form', $this->kegiatan))
        ->assertForbidden();

    $response = $this->actingAs($this->otherUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie.jpg', 640, 480),
        ]
    );

    $response->assertSessionHasErrors('absensi');
    expect(Kehadiran::query()->count())->toBe(0);
});

test('submit dua kali bersifat idempoten dan hanya menghasilkan satu kehadiran serta satu transaksi poin', function () {
    $payload = [
        'latitude' => $this->centerLat,
        'longitude' => $this->centerLng,
        'akurasi_m' => 10.0,
        'foto' => UploadedFile::fake()->image('selfie-1.jpg', 640, 480),
    ];

    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.absensi.submit', $this->kegiatan), $payload)
        ->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $this->actingAs($this->mahasiswaUser)
        ->post(route('mahasiswa.absensi.submit', $this->kegiatan), [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 15.0,
            'foto' => UploadedFile::fake()->image('selfie-2.jpg', 640, 480),
        ])
        ->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    expect(Kehadiran::query()->where('pendaftaran_id', $this->pendaftaran->id)->count())->toBe(1)
        ->and(PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->count())->toBe(1)
        ->and((int) PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->sum('jumlah'))->toBe(10)
        ->and(AuditLog::query()->where('aksi', 'kehadiran.duplicate_attempt')->exists())->toBeTrue();
});

test('kegiatan multi-hari memberikan satu kredit untuk setiap hari absensi', function () {
    $tanggalMulai = CarbonImmutable::parse($this->kegiatan->tanggal->toDateString(), config('app.timezone'));
    $tanggalKedua = $tanggalMulai->addDay();

    $this->kegiatan->update([
        'tanggal' => $tanggalMulai->toDateString(),
        'tanggal_selesai' => $tanggalKedua->toDateString(),
    ]);
    SesiAbsensi::query()->create([
        'kegiatan_id' => $this->kegiatan->id,
        'tanggal' => $tanggalKedua->toDateString(),
        'jam_buka' => '00:01:00',
        'jam_tutup' => '23:59:00',
    ]);

    $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie-hari-1.jpg', 640, 480),
        ],
    )->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $this->travelTo($tanggalKedua->setTime(10, 0));
    $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie-hari-2.jpg', 640, 480),
        ],
    )->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $this->travelBack();

    expect(Kehadiran::query()->where('pendaftaran_id', $this->pendaftaran->id)->count())->toBe(2)
        ->and(PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->count())->toBe(2)
        ->and((int) PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->sum('jumlah'))->toBe(20);
});

test('bobot poin yang diberikan mengikuti peran pada pendaftaran mahasiswa', function () {
    $this->pendaftaran->update(['peran' => PeranKegiatan::Panitia]);

    $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 8.0,
            'foto' => UploadedFile::fake()->image('selfie-panitia.jpg', 640, 480),
        ]
    )->assertRedirect(route('mahasiswa.absensi.form', $this->kegiatan));

    $poin = PoinTransaksi::query()->where('mahasiswa_id', $this->mahasiswa->id)->first();
    expect($poin)->not->toBeNull()
        ->and($poin->jumlah)->toBe(20);
});

test('foto bukti absensi pada disk private hanya dapat diakses oleh pemilik dan Internal Manajemen', function () {
    $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie-private.jpg', 640, 480),
        ]
    );

    $kehadiran = Kehadiran::query()->where('pendaftaran_id', $this->pendaftaran->id)->firstOrFail();

    // Mahasiswa lain ditolak (403)
    $this->actingAs($this->otherUser)
        ->get(route('kehadiran.foto', $kehadiran))
        ->assertForbidden();

    // Pemilik dapat mengakses (200)
    $this->actingAs($this->mahasiswaUser)
        ->get(route('kehadiran.foto', $kehadiran))
        ->assertOk()
        ->assertHeader('X-Content-Type-Options', 'nosniff');

    // Internal Manajemen dapat mengakses (200)
    $this->actingAs($this->internal)
        ->get(route('kehadiran.foto', $kehadiran))
        ->assertOk();
});

test('kegiatan yang terkunci tidak menerima absensi baru', function () {
    $this->kegiatan->update(['status' => StatusKegiatan::Terkunci]);

    $response = $this->actingAs($this->mahasiswaUser)->post(
        route('mahasiswa.absensi.submit', $this->kegiatan),
        [
            'latitude' => $this->centerLat,
            'longitude' => $this->centerLng,
            'akurasi_m' => 10.0,
            'foto' => UploadedFile::fake()->image('selfie-terkunci.jpg', 640, 480),
        ]
    );

    $response->assertSessionHasErrors('absensi');
    expect(Kehadiran::query()->count())->toBe(0)
        ->and(PoinTransaksi::query()->count())->toBe(0);
});

test('halaman absensi menampilkan komponen Inertia checkin untuk pendaftar aktif', function () {
    $this->actingAs($this->mahasiswaUser)
        ->get(route('mahasiswa.absensi.form', $this->kegiatan))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mahasiswa/kehadiran/checkin')
            ->where('kegiatan.id', $this->kegiatan->id)
            ->where('pendaftaran.id', $this->pendaftaran->id)
        );
});

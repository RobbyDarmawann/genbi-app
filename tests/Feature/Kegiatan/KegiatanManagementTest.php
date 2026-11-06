<?php

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;

uses(RefreshDatabase::class);

beforeEach(function () {
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
        'nama' => 'Kewirausahaan',
        'aktif' => true,
    ]);

    $this->mahasiswaUser = User::factory()->create(['username' => 'mhs_ung']);
    $this->mahasiswaUser->assignRole('mahasiswa');
    $this->mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->mahasiswaUser->id,
        'komsat_id' => $this->ung->id,
        'divisi_id' => $this->divisiUng->id,
        'nim' => '531424099',
        'angkatan' => '2024',
        'status_penerima' => StatusPenerima::Penerima,
        'aktif' => true,
    ]);
});

describe('Authorization', function () {
    test('guest is redirected to login on admin and student routes but can view public schedule', function () {
        $kegiatan = Kegiatan::factory()->create([
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->get(route('admin.kegiatan.index'))->assertRedirect(route('login'));
        $this->get(route('admin.kegiatan.create'))->assertRedirect(route('login'));
        $this->post(route('admin.kegiatan.store'), [])->assertRedirect(route('login'));
        $this->get(route('admin.kegiatan.show', $kegiatan))->assertRedirect(route('login'));
        $this->get(route('admin.kegiatan.edit', $kegiatan))->assertRedirect(route('login'));
        $this->put(route('admin.kegiatan.update', $kegiatan), [])->assertRedirect(route('login'));
        $this->patch(route('admin.kegiatan.update-status', $kegiatan), [])->assertRedirect(route('login'));

        $this->get(route('mahasiswa.kegiatan.index'))->assertRedirect(route('login'));
        $this->get(route('mahasiswa.kegiatan.show', $kegiatan))->assertRedirect(route('login'));

        $this->get(route('public.jadwal'))->assertOk();
        $this->get(route('public.jadwal.show', $kegiatan))->assertOk();
    });

    test('mahasiswa receives 403 on admin routes but can access student catalogue and public schedule', function () {
        $kegiatan = Kegiatan::factory()->create([
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->actingAs($this->mahasiswaUser)->get(route('admin.kegiatan.index'))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->get(route('admin.kegiatan.create'))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->post(route('admin.kegiatan.store'), [])->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->get(route('admin.kegiatan.show', $kegiatan))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->get(route('admin.kegiatan.edit', $kegiatan))->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->put(route('admin.kegiatan.update', $kegiatan), [])->assertForbidden();
        $this->actingAs($this->mahasiswaUser)->patch(route('admin.kegiatan.update-status', $kegiatan), [])->assertForbidden();

        $this->actingAs($this->mahasiswaUser)->get(route('mahasiswa.kegiatan.index'))->assertOk();
        $this->actingAs($this->mahasiswaUser)->get(route('mahasiswa.kegiatan.show', $kegiatan))->assertOk();
        $this->actingAs($this->mahasiswaUser)->get(route('public.jadwal'))->assertOk();
        $this->actingAs($this->mahasiswaUser)->get(route('public.jadwal.show', $kegiatan))->assertOk();
    });
});

describe('Creation and Validation', function () {
    test('internal manajemen can create draft kegiatan with valid attributes and atomic sync', function () {
        $payload = [
            'judul' => 'Sosialisasi QRIS Marisa',
            'deskripsi' => 'Pengenalan transaksi nontunai di pasar sentral.',
            'komsat_id' => $this->ung->id,
            'lokasi_nama' => 'Pasar Marisa',
            'latitude' => 0.4501234,
            'longitude' => 121.9304567,
            'radius_m' => 120,
            'tanggal' => '2026-04-10',
            'jam_mulai' => '08:00',
            'jam_selesai' => '12:00',
            'sesi_absensi' => [[
                'tanggal' => '2026-04-10',
                'jam_buka' => '07:30',
                'jam_tutup' => '12:30',
            ]],
            'pendaftaran_dibuka_at' => '2026-04-01T08:00',
            'batas_daftar_at' => '2026-04-09T23:59',
            'kuota' => 50,
            'status' => 'draft',
            'divisi_ids' => [$this->divisiUng->id],
            'bobot' => [
                'peserta' => 10,
                'panitia' => 15,
                'pemateri' => 20,
            ],
        ];

        $response = $this->actingAs($this->internal)->post(route('admin.kegiatan.store'), $payload);

        $kegiatan = Kegiatan::query()->where('judul', 'Sosialisasi QRIS Marisa')->firstOrFail();
        $response->assertRedirect(route('admin.kegiatan.show', $kegiatan));

        expect($kegiatan->status)->toBe(StatusKegiatan::Draft)
            ->and((float) $kegiatan->latitude)->toEqualWithDelta(0.4501234, 0.0001)
            ->and((float) $kegiatan->longitude)->toEqualWithDelta(121.9304567, 0.0001)
            ->and($kegiatan->radius_m)->toBe(120)
            ->and($kegiatan->kuota)->toBe(50)
            ->and($kegiatan->divisiTarget()->pluck('divisi.id')->all())->toBe([$this->divisiUng->id]);

        expect($kegiatan->bobot()->where('peran', PeranKegiatan::Peserta)->value('poin'))->toBe(10)
            ->and($kegiatan->bobot()->where('peran', PeranKegiatan::Panitia)->value('poin'))->toBe(15)
            ->and($kegiatan->bobot()->where('peran', PeranKegiatan::Pemateri)->value('poin'))->toBe(20);

        $this->assertDatabaseHas('audit_logs', [
            'aksi' => 'kegiatan.created',
            'subject_id' => $kegiatan->id,
            'user_id' => $this->internal->id,
        ]);
    });

    test('creating terbit kegiatan requires at least one target division and participant weight', function () {
        $payload = [
            'judul' => 'Workshop Literasi Kebanksentralan',
            'lokasi_nama' => 'Aula UNG',
            'latitude' => 0.5435,
            'longitude' => 123.0567,
            'radius_m' => 100,
            'tanggal' => '2026-05-01',
            'jam_mulai' => '09:00',
            'jam_selesai' => '13:00',
            'absensi_buka_at' => '2026-05-01T08:30',
            'absensi_tutup_at' => '2026-05-01T13:30',
            'status' => 'terbit',
            'divisi_ids' => [],
            'bobot' => [
                'peserta' => '',
            ],
        ];

        $response = $this->actingAs($this->internal)->post(route('admin.kegiatan.store'), $payload);
        $response->assertSessionHasErrors(['divisi_ids', 'bobot.peserta']);
    });

    test('validates radius coordinates times and registration deadlines', function () {
        $invalidPayload = [
            'judul' => 'Kegiatan Uji Validasi Batas',
            'lokasi_nama' => 'Lokasi Fiktif',
            'latitude' => 95.0,
            'longitude' => 190.0,
            'radius_m' => 5,
            'tanggal' => '2026-06-01',
            'jam_mulai' => '10:00',
            'jam_selesai' => '09:00',
            'absensi_buka_at' => '2026-06-01T11:00',
            'absensi_tutup_at' => '2026-06-01T10:30',
            'pendaftaran_dibuka_at' => '2026-06-01T12:00',
            'batas_daftar_at' => '2026-06-01T11:00',
            'kuota' => -10,
            'status' => 'draft',
        ];

        $response = $this->actingAs($this->internal)->post(route('admin.kegiatan.store'), $invalidPayload);
        $response->assertSessionHasErrors([
            'latitude',
            'longitude',
            'radius_m',
            'jam_selesai',
            'absensi_tutup_at',
            'kuota',
        ]);
    });
});

describe('Status Workflow and Locking', function () {
    test('follows status transition workflow draft to terbit and time-based running to finished to locked', function () {
        $kegiatan = Kegiatan::factory()->create([
            'status' => StatusKegiatan::Draft,
            'dibuat_oleh' => $this->internal->id,
            'tanggal' => '2026-07-01',
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'absensi_buka_at' => '2026-07-01 07:30:00',
            'absensi_tutup_at' => '2026-07-01 12:30:00',
        ]);
        $kegiatan->divisiTarget()->sync([$this->divisiUng->id]);
        KegiatanBobot::create([
            'kegiatan_id' => $kegiatan->id,
            'peran' => PeranKegiatan::Peserta,
            'poin' => 15,
        ]);

        // draft -> terbit
        $this->actingAs($this->internal)
            ->patch(route('admin.kegiatan.update-status', $kegiatan), ['status' => 'terbit'])
            ->assertRedirect();
        expect($kegiatan->fresh()->status)->toBe(StatusKegiatan::Terbit);
        $this->assertDatabaseHas('audit_logs', [
            'aksi' => 'kegiatan.published',
            'subject_id' => $kegiatan->id,
            'user_id' => $this->internal->id,
        ]);

        // Status efektif otomatis dari waktu, tanpa aksi user
        $this->travelTo('2026-07-01 07:00:00');
        expect($kegiatan->fresh()->statusEfektif())->toBe(StatusKegiatan::Terbit);
        $this->travelTo('2026-07-01 10:00:00');
        expect($kegiatan->fresh()->statusEfektif())->toBe(StatusKegiatan::Berlangsung);
        expect($kegiatan->fresh()->status)->toBe(StatusKegiatan::Terbit);

        // Status manual berlangsung/selesai tidak lagi diizinkan
        $this->actingAs($this->internal)
            ->patch(route('admin.kegiatan.update-status', $kegiatan), ['status' => 'terkunci'])
            ->assertSessionHasErrors(['status']);

        // Setelah jam selesai -> efektif Selesai -> terkunci
        $this->travelTo('2026-07-01 13:00:00');
        expect($kegiatan->fresh()->statusEfektif())->toBe(StatusKegiatan::Selesai);
        $this->actingAs($this->internal)
            ->patch(route('admin.kegiatan.update-status', $kegiatan), ['status' => 'terkunci'])
            ->assertRedirect();
        expect($kegiatan->fresh()->status)->toBe(StatusKegiatan::Terkunci);
        expect($kegiatan->fresh()->statusEfektif())->toBe(StatusKegiatan::Terkunci);
        $this->assertDatabaseHas('audit_logs', [
            'aksi' => 'kegiatan.locked',
            'subject_id' => $kegiatan->id,
            'user_id' => $this->internal->id,
        ]);

        // Once locked, cannot transition anymore
        $this->actingAs($this->internal)
            ->patch(route('admin.kegiatan.update-status', $kegiatan), ['status' => 'selesai'])
            ->assertSessionHasErrors(['status']);

        // Once locked, cannot edit attributes
        $this->actingAs($this->internal)
            ->put(route('admin.kegiatan.update', $kegiatan), [
                'judul' => 'Judul Baru Yang Ditolak',
                'lokasi_nama' => $kegiatan->lokasi_nama,
                'latitude' => $kegiatan->latitude,
                'longitude' => $kegiatan->longitude,
                'radius_m' => $kegiatan->radius_m,
                'tanggal' => $kegiatan->tanggal->toDateString(),
                'jam_mulai' => '08:00',
                'jam_selesai' => '12:00',
                'absensi_buka_at' => $kegiatan->absensi_buka_at->format('Y-m-d\TH:i'),
                'absensi_tutup_at' => $kegiatan->absensi_tutup_at->format('Y-m-d\TH:i'),
                'status' => 'terkunci',
                'divisi_ids' => [$this->divisiUng->id],
            ])
            ->assertSessionHasErrors(['status']);
    });

    test('cancellation is allowed before locked and recorded in audit log', function () {
        $kegiatan = Kegiatan::factory()->create([
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->actingAs($this->internal)
            ->patch(route('admin.kegiatan.update-status', $kegiatan), [
                'status' => 'dibatalkan',
                'alasan' => 'Cuaca ekstrem dan instruksi panitia.',
            ])
            ->assertRedirect();

        expect($kegiatan->fresh()->status)->toBe(StatusKegiatan::Dibatalkan);

        $this->assertDatabaseHas('audit_logs', [
            'aksi' => 'kegiatan.cancelled',
            'subject_id' => $kegiatan->id,
            'user_id' => $this->internal->id,
        ]);
    });

    test('records sensitive audit log when coordinates radius or bobot change before valid attendance', function () {
        $kegiatan = Kegiatan::factory()->create([
            'status' => StatusKegiatan::Draft,
            'dibuat_oleh' => $this->internal->id,
            'latitude' => 0.5400000,
            'longitude' => 123.0600000,
            'radius_m' => 100,
            'tanggal' => '2026-08-01',
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'absensi_buka_at' => '2026-08-01 07:30:00',
            'absensi_tutup_at' => '2026-08-01 12:30:00',
        ]);
        $kegiatan->divisiTarget()->sync([$this->divisiUng->id]);
        KegiatanBobot::create([
            'kegiatan_id' => $kegiatan->id,
            'peran' => PeranKegiatan::Peserta,
            'poin' => 10,
        ]);

        $this->actingAs($this->internal)
            ->put(route('admin.kegiatan.update', $kegiatan), [
                'judul' => $kegiatan->judul,
                'lokasi_nama' => $kegiatan->lokasi_nama,
                'latitude' => 0.5500000,
                'longitude' => 123.0700000,
                'radius_m' => 150,
                'tanggal' => '2026-08-01',
                'jam_mulai' => '08:00',
                'jam_selesai' => '12:00',
                'sesi_absensi' => [[
                    'tanggal' => '2026-08-01',
                    'jam_buka' => '07:30',
                    'jam_tutup' => '12:30',
                ]],
                'status' => 'draft',
                'divisi_ids' => [$this->divisiUng->id],
                'bobot' => ['peserta' => 25],
            ])
            ->assertRedirect(route('admin.kegiatan.show', $kegiatan));

        $this->assertDatabaseHas('audit_logs', [
            'aksi' => 'kegiatan.updated_sensitive',
            'subject_id' => $kegiatan->id,
            'user_id' => $this->internal->id,
        ]);
    });

    test('prevents modifying sensitive parameters coordinates radius bobot when valid attendance exists', function () {
        $kegiatan = Kegiatan::factory()->create([
            'status' => StatusKegiatan::Berlangsung,
            'dibuat_oleh' => $this->internal->id,
            'latitude' => 0.5400000,
            'longitude' => 123.0600000,
            'radius_m' => 100,
            'tanggal' => '2026-08-01',
            'jam_mulai' => '08:00:00',
            'jam_selesai' => '12:00:00',
            'absensi_buka_at' => '2026-08-01 07:30:00',
            'absensi_tutup_at' => '2026-08-01 12:30:00',
        ]);
        $kegiatan->divisiTarget()->sync([$this->divisiUng->id]);
        KegiatanBobot::create([
            'kegiatan_id' => $kegiatan->id,
            'peran' => PeranKegiatan::Peserta,
            'poin' => 20,
        ]);

        $pendaftaran = Pendaftaran::factory()->create([
            'kegiatan_id' => $kegiatan->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'peran' => PeranKegiatan::Peserta,
            'status' => StatusPendaftaran::Terdaftar,
        ]);

        Kehadiran::factory()->create([
            'pendaftaran_id' => $pendaftaran->id,
            'status' => StatusKehadiran::Valid,
        ]);

        expect($kegiatan->memilikiKehadiranValid())->toBeTrue();

        $this->actingAs($this->internal)->get(route('admin.kegiatan.index'))->assertOk();
        $this->actingAs($this->internal)->get(route('admin.kegiatan.show', $kegiatan))->assertOk();

        $updatePayload = [
            'judul' => 'Judul Boleh Berubah',
            'lokasi_nama' => $kegiatan->lokasi_nama,
            'latitude' => 0.5500000,
            'longitude' => 123.0700000,
            'radius_m' => 200,
            'tanggal' => '2026-08-01',
            'jam_mulai' => '08:00',
            'jam_selesai' => '12:00',
            'sesi_absensi' => [[
                'tanggal' => '2026-08-01',
                'jam_buka' => '07:30',
                'jam_tutup' => '12:30',
            ]],
            'status' => 'berlangsung',
            'divisi_ids' => [$this->divisiUng->id],
            'bobot' => [
                'peserta' => 50,
            ],
        ];

        $response = $this->actingAs($this->internal)
            ->put(route('admin.kegiatan.update', $kegiatan), $updatePayload);

        $response->assertSessionHasErrors(['latitude', 'longitude', 'radius_m', 'bobot.peserta']);
    });
});

describe('Student Catalog and Public Schedule', function () {
    test('tab bisa didaftar hanya menampilkan kegiatan target yang masih memenuhi syarat', function () {
        $tanggalMulai = now()->addDay()->toDateString();
        $tanggalSelesai = now()->addDays(2)->toDateString();

        $tersedia = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Multi Hari Tersedia',
            'status' => StatusKegiatan::Terbit,
            'tanggal' => $tanggalMulai,
            'tanggal_selesai' => $tanggalSelesai,
            'pendaftaran_dibuka_at' => now()->subHour(),
            'batas_daftar_at' => now()->addDay(),
            'dibuat_oleh' => $this->internal->id,
        ]);
        $tersedia->divisiTarget()->sync([$this->divisiUng->id]);

        $batalTanpaKehadiran = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Pendaftaran Batal',
            'status' => StatusKegiatan::Terbit,
            'tanggal' => $tanggalMulai,
            'pendaftaran_dibuka_at' => now()->subHour(),
            'batas_daftar_at' => now()->addDay(),
            'dibuat_oleh' => $this->internal->id,
        ]);
        $batalTanpaKehadiran->divisiTarget()->sync([$this->divisiUng->id]);
        Pendaftaran::factory()->create([
            'kegiatan_id' => $batalTanpaKehadiran->id,
            'mahasiswa_id' => $this->mahasiswa->id,
            'status' => StatusPendaftaran::Batal,
        ]);

        $response = $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.kegiatan.index', [
                'tab' => 'bisa_daftar',
                'q' => 'Kegiatan',
            ]));

        $response->assertOk()->assertInertia(fn (Assert $page) => $page
            ->component('mahasiswa/kegiatan/index')
            ->where('filters.tab', 'bisa_daftar')
            ->has('kegiatan.data', 2)
            ->where('kegiatan.data.0.judul', 'Kegiatan Multi Hari Tersedia')
            ->where('kegiatan.data.1.judul', 'Kegiatan Pendaftaran Batal')
        );
    });

    test('student catalog filters kegiatan targeted to student division vs general schedule', function () {
        $kegiatanTargetUng = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Khusus UNG',
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => $this->internal->id,
        ]);
        $kegiatanTargetUng->divisiTarget()->sync([$this->divisiUng->id]);

        $kegiatanTargetIain = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Khusus IAIN',
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => $this->internal->id,
        ]);
        $kegiatanTargetIain->divisiTarget()->sync([$this->divisiIain->id]);

        $kegiatanDraft = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Draft Tersembunyi',
            'status' => StatusKegiatan::Draft,
            'dibuat_oleh' => $this->internal->id,
        ]);
        $kegiatanDraft->divisiTarget()->sync([$this->divisiUng->id]);

        // Default tab "untuk_saya"
        $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.kegiatan.index', ['tab' => 'untuk_saya']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('mahasiswa/kegiatan/index')
                ->has('kegiatan.data', 1)
                ->where('kegiatan.data.0.judul', 'Kegiatan Khusus UNG')
            );

        // Tab "semua"
        $this->actingAs($this->mahasiswaUser)
            ->get(route('mahasiswa.kegiatan.index', ['tab' => 'semua', 'untuk_saya' => 0]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('mahasiswa/kegiatan/index')
                ->has('kegiatan.data', 2)
            );
    });

    test('public schedule excludes draft and cancelled and does not expose sensitive coordinates or radius', function () {
        $kegiatanTerbit = Kegiatan::factory()->create([
            'judul' => 'GenBI Mengajar 2026',
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => $this->internal->id,
            'latitude' => 0.54321,
            'longitude' => 123.09876,
            'radius_m' => 150,
        ]);

        $kegiatanDraft = Kegiatan::factory()->create([
            'judul' => 'Rencana Internal Belum Terbit',
            'status' => StatusKegiatan::Draft,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $kegiatanBatal = Kegiatan::factory()->create([
            'judul' => 'Kegiatan Dibatalkan',
            'status' => StatusKegiatan::Dibatalkan,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->get(route('public.jadwal'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/jadwal')
                ->has('kegiatan.data', 1)
                ->where('kegiatan.data.0.judul', 'GenBI Mengajar 2026')
                ->missing('kegiatan.data.0.latitude')
                ->missing('kegiatan.data.0.longitude')
                ->missing('kegiatan.data.0.radius_m')
            );

        $this->get(route('public.jadwal.show', $kegiatanTerbit))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('public/jadwal-show')
                ->where('kegiatan.judul', 'GenBI Mengajar 2026')
                ->missing('kegiatan.latitude')
                ->missing('kegiatan.longitude')
                ->missing('kegiatan.radius_m')
            );

        $this->get(route('public.jadwal.show', $kegiatanDraft))->assertNotFound();
        $this->get(route('public.jadwal.show', $kegiatanBatal))->assertNotFound();
    });
});

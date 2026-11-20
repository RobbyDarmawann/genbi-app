<?php

use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\LokasiKegiatan;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);
    $this->internal = User::factory()->create();
    $this->internal->assignRole('internal_manajemen');
    $this->mahasiswa = User::factory()->create();
    $this->mahasiswa->assignRole('mahasiswa');
});

describe('Authorization', function () {
    test('guest is redirected to login on all master lokasi routes', function () {
        $lokasi = LokasiKegiatan::factory()->create();

        $this->get(route('admin.lokasi.index'))->assertRedirect(route('login'));
        $this->post(route('admin.lokasi.store'), [])->assertRedirect(route('login'));
        $this->put(route('admin.lokasi.update', $lokasi), [])->assertRedirect(route('login'));
        $this->patch(route('admin.lokasi.toggle-aktif', $lokasi), [])->assertRedirect(route('login'));
        $this->delete(route('admin.lokasi.destroy', $lokasi))->assertRedirect(route('login'));
    });

    test('mahasiswa receives 403 forbidden on all master lokasi routes', function () {
        $lokasi = LokasiKegiatan::factory()->create();

        $this->actingAs($this->mahasiswa)->get(route('admin.lokasi.index'))->assertForbidden();
        $this->actingAs($this->mahasiswa)->post(route('admin.lokasi.store'), [])->assertForbidden();
        $this->actingAs($this->mahasiswa)->put(route('admin.lokasi.update', $lokasi), [])->assertForbidden();
        $this->actingAs($this->mahasiswa)->patch(route('admin.lokasi.toggle-aktif', $lokasi), ['aktif' => false])->assertForbidden();
        $this->actingAs($this->mahasiswa)->delete(route('admin.lokasi.destroy', $lokasi))->assertForbidden();
    });

    test('internal manajemen can view master lokasi index page', function () {
        LokasiKegiatan::factory()->count(3)->create();

        $this->actingAs($this->internal)
            ->get(route('admin.lokasi.index'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/lokasi/index')
                ->has('lokasi.data', 3)
            );
    });
});

describe('Master Lokasi CRUD', function () {
    test('internal manajemen can create, search, and update master lokasi with audit logs', function () {
        $payload = [
            'nama' => 'Kantor Perwakilan BI Gorontalo',
            'latitude' => 0.5412345,
            'longitude' => 123.0598765,
            'radius_m' => 150,
            'keterangan' => 'Aula lantai 3 KPw BI',
            'aktif' => true,
        ];

        $this->actingAs($this->internal)
            ->post(route('admin.lokasi.store'), $payload)
            ->assertRedirect();

        $lokasi = LokasiKegiatan::query()->where('nama', 'Kantor Perwakilan BI Gorontalo')->firstOrFail();
        expect((float) $lokasi->latitude)->toEqualWithDelta(0.5412345, 0.00001)
            ->and((float) $lokasi->longitude)->toEqualWithDelta(123.0598765, 0.00001)
            ->and($lokasi->radius_m)->toBe(150)
            ->and($lokasi->aktif)->toBeTrue()
            ->and(AuditLog::query()->where('aksi', 'lokasi_kegiatan.created')->where('subject_id', $lokasi->id)->exists())->toBeTrue();

        $this->actingAs($this->internal)
            ->get(route('admin.lokasi.index', ['q' => 'Perwakilan']))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/lokasi/index')
                ->has('lokasi.data', 1)
                ->where('lokasi.data.0.nama', 'Kantor Perwakilan BI Gorontalo')
            );

        $updatePayload = [
            'nama' => 'KPw BI Gorontalo - Gedung Baru',
            'latitude' => 0.5419999,
            'longitude' => 123.0591111,
            'radius_m' => 200,
            'keterangan' => 'Gedung serbaguna baru',
            'aktif' => true,
        ];

        $this->actingAs($this->internal)
            ->put(route('admin.lokasi.update', $lokasi), $updatePayload)
            ->assertRedirect();

        $lokasi->refresh();
        expect($lokasi->nama)->toBe('KPw BI Gorontalo - Gedung Baru')
            ->and((float) $lokasi->latitude)->toEqualWithDelta(0.5419999, 0.00001)
            ->and((float) $lokasi->longitude)->toEqualWithDelta(123.0591111, 0.00001)
            ->and($lokasi->radius_m)->toBe(200)
            ->and(AuditLog::query()->where('aksi', 'lokasi_kegiatan.updated')->where('subject_id', $lokasi->id)->exists())->toBeTrue();
    });

    test('can toggle status aktif master lokasi', function () {
        $lokasi = LokasiKegiatan::factory()->create(['aktif' => true]);

        $this->actingAs($this->internal)
            ->patch(route('admin.lokasi.toggle-aktif', $lokasi), ['aktif' => false])
            ->assertRedirect();

        expect($lokasi->fresh()->aktif)->toBeFalse()
            ->and(AuditLog::query()->where('aksi', 'lokasi_kegiatan.deactivated')->where('subject_id', $lokasi->id)->exists())->toBeTrue();

        $this->actingAs($this->internal)
            ->patch(route('admin.lokasi.toggle-aktif', $lokasi), ['aktif' => true])
            ->assertRedirect();

        expect($lokasi->fresh()->aktif)->toBeTrue()
            ->and(AuditLog::query()->where('aksi', 'lokasi_kegiatan.activated')->where('subject_id', $lokasi->id)->exists())->toBeTrue();
    });

    test('validates coordinate boundaries and radius', function () {
        $response = $this->actingAs($this->internal)->post(route('admin.lokasi.store'), [
            'nama' => 'Lokasi Salah',
            'latitude' => 100, // max 90
            'longitude' => 200, // max 180
            'radius_m' => 5, // min 10
        ]);

        $response->assertSessionHasErrors(['latitude', 'longitude', 'radius_m']);
        $this->assertDatabaseMissing('lokasi_kegiatan', ['nama' => 'Lokasi Salah']);
    });

    test('can delete unbound master lokasi', function () {
        $lokasi = LokasiKegiatan::factory()->create();

        $this->actingAs($this->internal)
            ->delete(route('admin.lokasi.destroy', $lokasi))
            ->assertRedirect();

        $this->assertDatabaseMissing('lokasi_kegiatan', ['id' => $lokasi->id]);
        expect(AuditLog::query()->where('aksi', 'lokasi_kegiatan.deleted')->where('subject_id', $lokasi->id)->exists())->toBeTrue();
    });

    test('rejects deleting master lokasi referenced by kegiatan', function () {
        $lokasi = LokasiKegiatan::factory()->create();
        $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();

        Kegiatan::factory()->create([
            'komsat_id' => $ung->id,
            'lokasi_id' => $lokasi->id,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $response = $this->actingAs($this->internal)->delete(route('admin.lokasi.destroy', $lokasi));

        $response->assertSessionHasErrors('delete');
        $this->assertDatabaseHas('lokasi_kegiatan', ['id' => $lokasi->id]);
    });
});

describe('Kegiatan Location Snapshot Integration', function () {
    test('saving kegiatan with lokasi_id copies coordinates and radius from master lokasi', function () {
        $lokasiMaster = LokasiKegiatan::factory()->create([
            'nama' => 'Auditorium UNG',
            'latitude' => 0.5567891,
            'longitude' => 123.0612345,
            'radius_m' => 250,
            'aktif' => true,
        ]);

        $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
        $divisi = Divisi::factory()->create(['komsat_id' => $ung->id, 'aktif' => true]);

        // Kirim request create kegiatan hanya dengan lokasi_id tanpa mengisi latitude/longitude/radius_m secara manual
        $payload = [
            'judul' => 'Pelatihan Public Speaking GenBI',
            'deskripsi' => 'Pelatihan kepemimpinan dan komunikasi.',
            'komsat_id' => $ung->id,
            'lokasi_id' => $lokasiMaster->id,
            'tanggal' => '2026-05-15',
            'jam_mulai' => '09:00',
            'jam_selesai' => '15:00',
            'sesi_absensi' => [[
                'tanggal' => '2026-05-15',
                'jam_buka' => '08:30',
                'jam_tutup' => '15:30',
            ]],
            'status' => 'draft',
            'divisi_ids' => [$divisi->id],
            'bobot' => [
                'peserta' => 10,
                'panitia' => 15,
                'pemateri' => 25,
            ],
        ];

        $response = $this->actingAs($this->internal)->post(route('admin.kegiatan.store'), $payload);
        $kegiatan = Kegiatan::query()->where('judul', 'Pelatihan Public Speaking GenBI')->firstOrFail();

        $response->assertRedirect(route('admin.kegiatan.show', $kegiatan));

        expect($kegiatan->lokasi_id)->toBe($lokasiMaster->id)
            ->and($kegiatan->lokasi_nama)->toBe('Auditorium UNG')
            ->and((float) $kegiatan->latitude)->toEqualWithDelta(0.5567891, 0.00001)
            ->and((float) $kegiatan->longitude)->toEqualWithDelta(123.0612345, 0.00001)
            ->and($kegiatan->radius_m)->toBe(250);
    });

    test('editing master lokasi afterwards does not alter already saved kegiatan coordinates and radius (snapshot principle)', function () {
        $lokasiMaster = LokasiKegiatan::factory()->create([
            'nama' => 'Gedung Serbaguna UNG',
            'latitude' => 0.5511111,
            'longitude' => 123.0622222,
            'radius_m' => 100,
            'aktif' => true,
        ]);

        $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
        $divisi = Divisi::factory()->create(['komsat_id' => $ung->id, 'aktif' => true]);

        // Simpan kegiatan terkait lokasiMaster
        $payload = [
            'judul' => 'Seminar Kewirausahaan GenBI',
            'deskripsi' => 'Pengembangan UMKM Gorontalo.',
            'komsat_id' => $ung->id,
            'lokasi_id' => $lokasiMaster->id,
            'tanggal' => '2026-06-20',
            'jam_mulai' => '08:00',
            'jam_selesai' => '12:00',
            'sesi_absensi' => [[
                'tanggal' => '2026-06-20',
                'jam_buka' => '07:30',
                'jam_tutup' => '12:30',
            ]],
            'status' => 'draft',
            'divisi_ids' => [$divisi->id],
            'bobot' => [
                'peserta' => 10,
                'panitia' => 15,
                'pemateri' => 20,
            ],
        ];

        $this->actingAs($this->internal)->post(route('admin.kegiatan.store'), $payload);
        $kegiatan = Kegiatan::query()->where('judul', 'Seminar Kewirausahaan GenBI')->firstOrFail();

        // Verifikasi snapshot awal
        expect($kegiatan->lokasi_nama)->toBe('Gedung Serbaguna UNG')
            ->and((float) $kegiatan->latitude)->toEqualWithDelta(0.5511111, 0.00001)
            ->and((float) $kegiatan->longitude)->toEqualWithDelta(123.0622222, 0.00001)
            ->and($kegiatan->radius_m)->toBe(100);

        // Ubah master data lokasi secara drastis
        $this->actingAs($this->internal)->put(route('admin.lokasi.update', $lokasiMaster), [
            'nama' => 'Nama Baru Lokasi Yang Telah Berubah',
            'latitude' => 0.9999999,
            'longitude' => 120.9999999,
            'radius_m' => 500,
            'aktif' => true,
        ])->assertRedirect();

        // Pastikan master lokasi sudah berubah
        $lokasiMaster->refresh();
        expect($lokasiMaster->nama)->toBe('Nama Baru Lokasi Yang Telah Berubah')
            ->and((float) $lokasiMaster->latitude)->toEqualWithDelta(0.9999999, 0.00001)
            ->and((float) $lokasiMaster->longitude)->toEqualWithDelta(120.9999999, 0.00001)
            ->and($lokasiMaster->radius_m)->toBe(500);

        // Ambil kembali kegiatan dari database, pastikan nilainya TIDAK BERUBAH (snapshot aman)
        $kegiatan->refresh();
        expect($kegiatan->lokasi_id)->toBe($lokasiMaster->id)
            ->and($kegiatan->lokasi_nama)->toBe('Gedung Serbaguna UNG')
            ->and((float) $kegiatan->latitude)->toEqualWithDelta(0.5511111, 0.00001)
            ->and((float) $kegiatan->longitude)->toEqualWithDelta(123.0622222, 0.00001)
            ->and($kegiatan->radius_m)->toBe(100);
    });

    test('activity form receives active master lokasi in lokasiOptions prop', function () {
        LokasiKegiatan::factory()->create([
            'nama' => 'Kampus 1 UNG',
            'latitude' => 0.5550,
            'longitude' => 123.0624,
            'radius_m' => 300,
            'aktif' => true,
        ]);

        LokasiKegiatan::factory()->create([
            'nama' => 'Lokasi Nonaktif',
            'aktif' => false,
        ]);

        $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
        $kegiatan = Kegiatan::factory()->create([
            'komsat_id' => $ung->id,
            'dibuat_oleh' => $this->internal->id,
        ]);

        $this->actingAs($this->internal)
            ->get(route('admin.kegiatan.create'))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/kegiatan/create')
                ->has('lokasiOptions', 1)
                ->where('lokasiOptions.0.nama', 'Kampus 1 UNG')
            );

        $this->actingAs($this->internal)
            ->get(route('admin.kegiatan.edit', $kegiatan))
            ->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('admin/kegiatan/edit')
                ->has('lokasiOptions', 1)
                ->where('lokasiOptions.0.nama', 'Kampus 1 UNG')
            );
    });
});

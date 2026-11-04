<?php

use App\Enums\StatusKegiatan;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Periode;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
});

test('direktori default menggunakan periode aktif dan menyembunyikan data sensitif', function () {
    $periodeAktif = Periode::factory()->create(['aktif' => true, 'nama' => '2026/2027']);
    $periodeLama = Periode::factory()->create(['aktif' => false, 'nama' => '2025/2026']);
    $komsat = Komsat::factory()->create(['kode' => 'UNG', 'aktif' => true]);
    $divisi = Divisi::factory()->create(['komsat_id' => $komsat->id]);
    $studentUser = User::factory()->create(['name' => 'Siti Rahmawati', 'username' => 'siti.secret']);
    $mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $studentUser->id,
        'komsat_id' => $komsat->id,
        'divisi_id' => $divisi->id,
        'nim' => '531423099',
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeAktif->id,
        'komsat_id' => null,
        'mahasiswa_id' => $mahasiswa->id,
        'nama_tampil' => 'Pengurus Aktif Wilayah',
        'jabatan' => 'Ketua Wilayah',
        'urutan' => 1,
        'kontak' => 'https://instagram.com/genbigorontalo',
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeLama->id,
        'komsat_id' => $komsat->id,
        'nama_tampil' => 'Pengurus Lama Komsat',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 1,
    ]);

    $response = $this->get(route('public.kepengurusan'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('public/kepengurusan')
        ->has('periode', fn ($aktif) => $aktif
            ->where('id', $periodeAktif->id)
            ->where('nama', '2026/2027')
            ->where('aktif', true))
        ->has('direktori.wilayah', 1)
        ->has('direktori.wilayah.0', fn ($item) => $item
            ->where('nama_tampil', 'Pengurus Aktif Wilayah')
            ->where('jabatan', 'Ketua Wilayah')
            ->missing('nim')
            ->missing('username')
            ->missing('mahasiswa_id')
            ->etc())
        ->where('direktori.komsat', []));
});

test('filter komsat dan wilayah hanya menampilkan lingkup yang benar', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsatUNG = Komsat::factory()->create(['kode' => 'UNG', 'aktif' => true]);
    $komsatIAIN = Komsat::factory()->create(['kode' => 'IAIN', 'aktif' => true]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus Wilayah',
        'jabatan' => 'Ketua Umum',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsatUNG->id,
        'nama_tampil' => 'Pengurus UNG',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 1,
    ]);

    Kepengurusan::factory()->create([
        'periode_id' => $periode->id,
        'komsat_id' => $komsatIAIN->id,
        'nama_tampil' => 'Pengurus IAIN',
        'jabatan' => 'Bendahara',
        'urutan' => 1,
    ]);

    $responseUng = $this->get(route('public.kepengurusan', ['komsat_id' => $komsatUNG->id]));
    $responseUng->assertOk();
    $responseUng->assertInertia(fn ($page) => $page
        ->has('direktori.wilayah', 0)
        ->has('direktori.komsat.UNG', 1)
        ->where('direktori.komsat.UNG.0.nama_tampil', 'Pengurus UNG')
        ->missing('direktori.komsat.IAIN'));

    $responseWilayah = $this->get(route('public.kepengurusan', ['komsat_id' => 'wilayah']));
    $responseWilayah->assertOk();
    $responseWilayah->assertInertia(fn ($page) => $page
        ->has('direktori.wilayah', 1)
        ->where('direktori.wilayah.0.nama_tampil', 'Pengurus Wilayah')
        ->where('direktori.komsat', []));
});

test('periode lama tidak diberi label aktif', function () {
    Periode::factory()->create(['aktif' => true, 'nama' => '2026/2027']);
    $periodeLama = Periode::factory()->create(['aktif' => false, 'nama' => '2025/2026']);

    Kepengurusan::factory()->create([
        'periode_id' => $periodeLama->id,
        'komsat_id' => null,
        'nama_tampil' => 'Pengurus Lama',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ]);

    $response = $this->get(route('public.kepengurusan', ['periode_id' => $periodeLama->id]));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->has('periode', fn ($dipilih) => $dipilih
            ->where('id', $periodeLama->id)
            ->where('nama', '2025/2026')
            ->where('aktif', false))
        ->has('direktori.wilayah', 1));
});

test('guest dan mahasiswa tidak dapat mengelola direktori kepengurusan', function () {
    $periode = Periode::factory()->create(['aktif' => true]);
    $item = Kepengurusan::factory()->create(['periode_id' => $periode->id]);

    $this->get(route('admin.kepengurusan.index'))->assertRedirect(route('login'));
    $this->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'nama_tampil' => 'Tes',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ])->assertRedirect(route('login'));

    $student = User::factory()->create();
    $student->assignRole('mahasiswa');

    $this->actingAs($student)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'nama_tampil' => 'Tes',
        'jabatan' => 'Ketua',
        'urutan' => 1,
    ])->assertForbidden();

    $this->actingAs($student)->put(route('admin.kepengurusan.update', $item), [
        'periode_id' => $periode->id,
        'nama_tampil' => 'Tes Ubah',
        'jabatan' => 'Ketua',
        'urutan' => 2,
    ])->assertForbidden();

    $this->actingAs($student)->delete(route('admin.kepengurusan.destroy', $item))->assertForbidden();
});

test('internal manajemen dapat mengelola kepengurusan dengan validasi duplikat dan audit log', function () {
    $admin = User::factory()->create();
    $admin->assignRole('internal_manajemen');
    $periode = Periode::factory()->create(['aktif' => true]);
    $komsat = Komsat::factory()->create(['kode' => 'UMGO', 'aktif' => true]);
    $divisi = Divisi::factory()->create(['komsat_id' => $komsat->id]);
    $mhsUser = User::factory()->create(['name' => 'Ahmad Fauzan']);
    $mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $mhsUser->id,
        'komsat_id' => $komsat->id,
        'divisi_id' => $divisi->id,
    ]);

    // Auto-fill nama_tampil dari mahasiswa bila dikosongkan
    $this->actingAs($admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => 'wilayah',
        'mahasiswa_id' => $mahasiswa->id,
        'nama_tampil' => '',
        'jabatan' => 'Ketua Wilayah',
        'urutan' => 1,
        'kontak' => 'mailto:pengurus@genbi.id',
    ])->assertRedirect();

    $created = Kepengurusan::firstOrFail();
    expect($created->nama_tampil)->toBe('Ahmad Fauzan')
        ->and($created->komsat_id)->toBeNull();

    $this->assertDatabaseHas('audit_logs', [
        'aksi' => 'kepengurusan.created',
        'user_id' => $admin->id,
        'subject_id' => $created->id,
    ]);

    // Cegah duplikasi persis periode + lingkup + nama + jabatan
    $this->actingAs($admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => null,
        'nama_tampil' => 'Ahmad Fauzan',
        'jabatan' => 'Ketua Wilayah',
        'urutan' => 2,
    ])->assertSessionHasErrors('nama_tampil');

    // Cegah urutan negatif
    $this->actingAs($admin)->post(route('admin.kepengurusan.store'), [
        'periode_id' => $periode->id,
        'komsat_id' => $komsat->id,
        'nama_tampil' => 'Pengurus Baru',
        'jabatan' => 'Sekretaris',
        'urutan' => -1,
    ])->assertSessionHasErrors('urutan');

    // Update urutan dan nama tampil kustom
    $this->actingAs($admin)->put(route('admin.kepengurusan.update', $created), [
        'periode_id' => $periode->id,
        'komsat_id' => $komsat->id,
        'mahasiswa_id' => $mahasiswa->id,
        'nama_tampil' => 'Ahmad Fauzan, S.Kom.',
        'jabatan' => 'Ketua Komsat',
        'urutan' => 0,
        'kontak' => '',
    ])->assertRedirect();

    expect($created->fresh()->nama_tampil)->toBe('Ahmad Fauzan, S.Kom.')
        ->and($created->fresh()->komsat_id)->toBe($komsat->id);

    $this->assertDatabaseHas('audit_logs', [
        'aksi' => 'kepengurusan.updated',
        'user_id' => $admin->id,
        'subject_id' => $created->id,
    ]);

    // Delete mencatat audit log
    $this->actingAs($admin)->delete(route('admin.kepengurusan.destroy', $created))->assertRedirect();
    $this->assertDatabaseMissing('kepengurusan', ['id' => $created->id]);
    $this->assertDatabaseHas('audit_logs', [
        'aksi' => 'kepengurusan.deleted',
        'user_id' => $admin->id,
        'subject_id' => $created->id,
    ]);
});

test('beranda menampilkan kegiatan publik dari database, empty state, dan tetap terbuka bagi user login', function () {
    // Saat kosong: empty state data kegiatan_terbaru kosong
    $emptyResponse = $this->get(route('home'));
    $emptyResponse->assertOk();
    $emptyResponse->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('kegiatan_terbaru', 0)
        ->where('ringkasan.total_kegiatan', 0));

    // Buat kegiatan terbit dan draft
    $komsat = Komsat::factory()->create(['kode' => 'UNG', 'nama' => 'Universitas Negeri Gorontalo', 'aktif' => true]);
    $creator = User::factory()->create();
    Kegiatan::factory()->create([
        'judul' => 'Temu Wilayah GenBI 2026',
        'status' => StatusKegiatan::Terbit,
        'komsat_id' => $komsat->id,
        'dibuat_oleh' => $creator->id,
    ]);
    Kegiatan::factory()->create([
        'judul' => 'Rapat Internal Draft',
        'status' => StatusKegiatan::Draft,
        'dibuat_oleh' => $creator->id,
    ]);

    $response = $this->get(route('home'));
    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('kegiatan_terbaru', 1)
        ->where('kegiatan_terbaru.0.judul', 'Temu Wilayah GenBI 2026')
        ->missing('kegiatan_terbaru.0.latitude')
        ->missing('kegiatan_terbaru.0.longitude')
        ->missing('kegiatan_terbaru.0.radius_m')
        ->where('ringkasan.total_kegiatan', 1)
        ->has('komsat', 1));

    // User login (Internal Manajemen & Mahasiswa) tetap bisa membuka halaman publik tanpa redirect
    $admin = User::factory()->create();
    $admin->assignRole('internal_manajemen');
    $this->actingAs($admin)->get(route('home'))->assertOk();
    $this->actingAs($admin)->get(route('public.kepengurusan'))->assertOk();
});

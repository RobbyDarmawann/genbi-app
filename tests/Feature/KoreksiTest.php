<?php

use App\Enums\JenisKoreksi;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Enums\StatusPendaftaran;
use App\Enums\TipePoin;
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
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);
    Storage::fake('absensi');

    $this->admin = User::factory()->create(['username' => 'admin_im']);
    $this->admin->assignRole('internal_manajemen');

    $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();
    $divisi = Divisi::factory()->create(['komsat_id' => $ung->id, 'aktif' => true]);

    $this->user = User::factory()->create(['username' => 'mhs_satu', 'is_active' => true]);
    $this->user->assignRole('mahasiswa');
    $this->mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->user->id,
        'komsat_id' => $ung->id,
        'divisi_id' => $divisi->id,
        'aktif' => true,
    ]);

    $this->kegiatan = Kegiatan::factory()->create([
        'status' => StatusKegiatan::Terbit,
        'tanggal' => today()->addDays(1),
        'latitude' => -0.5454,
        'longitude' => 123.0566,
        'radius_m' => 100,
    ]);
    $this->kegiatan->bobot()->create(['peran' => PeranKegiatan::Peserta, 'poin' => 10]);

    $this->pendaftaran = Pendaftaran::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
        'peran' => PeranKegiatan::Peserta,
        'status' => StatusPendaftaran::Terdaftar,
    ]);
});

test('mahasiswa dapat membuat koreksi untuk pendaftarannya', function () {
    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Saya sudah hadir tetapi tidak dapat melakukan absensi karena GPS error.',
        ])
        ->assertSessionHasNoErrors()
        ->assertRedirect();

    expect(Koreksi::count())->toBe(1);
    $koreksi = Koreksi::first();
    expect($koreksi->mahasiswa_id)->toBe($this->mahasiswa->id)
        ->and($koreksi->kegiatan_id)->toBe($this->kegiatan->id)
        ->and($koreksi->pendaftaran_id)->toBe($this->pendaftaran->id)
        ->and($koreksi->jenis)->toBe(JenisKoreksi::BelumAbsen)
        ->and($koreksi->status)->toBe(StatusKoreksi::Menunggu);
});

test('mahasiswa tidak dapat membuat koreksi untuk pendaftaran mahasiswa lain', function () {
    $otherMahasiswa = Mahasiswa::factory()->create();
    $otherPendaftaran = Pendaftaran::factory()->create([
        'mahasiswa_id' => $otherMahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
    ]);

    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $otherPendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Coba akses data orang lain.',
        ])
        ->assertNotFound();

    expect(Koreksi::count())->toBe(0);
});

test('mahasiswa tidak dapat membuat koreksi duplikat yang masih menunggu', function () {
    Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'jenis' => JenisKoreksi::BelumAbsen,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Duplikat koreksi yang sudah pending.',
        ])
        ->assertSessionHasErrors('jenis');

    expect(Koreksi::count())->toBe(1);
});

test('mahasiswa dapat membuat koreksi jenis lain meskipun ada pending', function () {
    Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'jenis' => JenisKoreksi::BelumAbsen,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::DataSalah->value,
            'alasan' => 'Peran saya seharusnya panitia, bukan peserta.',
        ])
        ->assertSessionHasNoErrors();

    expect(Koreksi::count())->toBe(2);
});

test('bukti koreksi disimpan di disk private', function () {
    $file = UploadedFile::fake()->image('bukti.jpg', 800, 600);

    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Bukti screenshot kehadiran.',
            'bukti' => $file,
        ])
        ->assertSessionHasNoErrors();

    $koreksi = Koreksi::first();
    expect($koreksi->bukti_path)->not->toBeNull();
    Storage::disk('absensi')->assertExists($koreksi->bukti_path);
});

test('bukti koreksi tidak dapat diakses mahasiswa lain', function () {
    $file = UploadedFile::fake()->image('bukti.jpg');
    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Test private access.',
            'bukti' => $file,
        ]);

    $koreksi = Koreksi::first();
    $otherMahasiswa = Mahasiswa::factory()->create();
    $otherMahasiswa->user->assignRole('mahasiswa');

    $this->actingAs($otherMahasiswa->user)
        ->get(route('koreksi.bukti', $koreksi))
        ->assertForbidden();
});

test('bukti koreksi dapat diakses pemilik dan IM', function () {
    $file = UploadedFile::fake()->image('bukti.jpg');
    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Test private access.',
            'bukti' => $file,
        ]);

    $koreksi = Koreksi::first();

    $this->actingAs($this->user)
        ->get(route('koreksi.bukti', $koreksi))
        ->assertOk();

    $this->actingAs($this->admin)
        ->get(route('koreksi.bukti', $koreksi))
        ->assertOk();
});

test('IM dapat menolak koreksi dengan catatan', function () {
    $koreksi = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->admin)
        ->post(route('admin.koreksi.decide', $koreksi), [
            'keputusan' => 'tolak',
            'catatan_proses' => 'Data tidak sesuai dengan log server.',
        ])
        ->assertSessionHasNoErrors();

    $koreksi->refresh();
    expect($koreksi->status)->toBe(StatusKoreksi::Ditolak)
        ->and($koreksi->catatan_proses)->toBe('Data tidak sesuai dengan log server.')
        ->and($koreksi->diproses_oleh)->toBe($this->admin->id);

    expect($this->mahasiswa->poinTransaksi()->count())->toBe(0);
});

test('IM tidak dapat menolak tanpa catatan', function () {
    $koreksi = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->admin)
        ->post(route('admin.koreksi.decide', $koreksi), [
            'keputusan' => 'tolak',
            'catatan_proses' => '',
        ])
        ->assertSessionHasErrors('catatan_proses');
});

test('IM dapat menyetujui koreksi dan memberikan poin', function () {
    $koreksi = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'jenis' => JenisKoreksi::BelumAbsen,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->admin)
        ->post(route('admin.koreksi.decide', $koreksi), [
            'keputusan' => 'setujui',
            'catatan_proses' => 'Terverifikasi dari log kegiatan.',
        ])
        ->assertSessionHasNoErrors();

    $koreksi->refresh();
    expect($koreksi->status)->toBe(StatusKoreksi::Disetujui);

    $kehadiran = $this->pendaftaran->kehadiran()->first();
    expect($kehadiran)->not->toBeNull()
        ->and($kehadiran->status)->toBe(StatusKehadiran::Valid);

    $poin = $this->mahasiswa->poinTransaksi()->first();
    expect($poin)->not->toBeNull()
        ->and($poin->tipe)->toBe(TipePoin::Koreksi)
        ->and($poin->jumlah)->toBe(10)
        ->and($poin->kehadiran_id)->toBe($kehadiran->id);
});

test('persetujuan koreksi kedua ditolak bila poin sudah ada', function () {
    $koreksi = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'jenis' => JenisKoreksi::PoinBelumMasuk,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->admin)
        ->post(route('admin.koreksi.decide', $koreksi), [
            'keputusan' => 'setujui',
            'catatan_proses' => 'Persetujuan pertama.',
        ]);

    expect($this->mahasiswa->poinTransaksi()->count())->toBe(1);

    $koreksi2 = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'jenis' => JenisKoreksi::BelumAbsen,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->admin)
        ->post(route('admin.koreksi.decide', $koreksi2), [
            'keputusan' => 'setujui',
            'catatan_proses' => 'Coba duplikasi poin.',
        ])
        ->assertSessionHasErrors('koreksi');

    expect($this->mahasiswa->poinTransaksi()->count())->toBe(1);
});

test('koreksi dapat diproses setelah kegiatan terkunci', function () {
    $this->kegiatan->update(['status' => StatusKegiatan::Terkunci]);

    $koreksi = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'kegiatan_id' => $this->kegiatan->id,
        'pendaftaran_id' => $this->pendaftaran->id,
        'jenis' => JenisKoreksi::BelumAbsen,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->admin)
        ->post(route('admin.koreksi.decide', $koreksi), [
            'keputusan' => 'setujui',
            'catatan_proses' => 'Koreksi pasca-kunci.',
        ])
        ->assertSessionHasNoErrors();

    expect($koreksi->fresh()->status)->toBe(StatusKoreksi::Disetujui);
    expect($this->mahasiswa->poinTransaksi()->where('tipe', TipePoin::Koreksi)->count())->toBe(1);
});

test('mahasiswa nonaktif tidak dapat membuat koreksi', function () {
    $this->mahasiswa->update(['aktif' => false]);

    $this->actingAs($this->user)
        ->post(route('mahasiswa.koreksi.store'), [
            'pendaftaran_id' => $this->pendaftaran->id,
            'jenis' => JenisKoreksi::BelumAbsen->value,
            'alasan' => 'Coba buat koreksi sebagai mahasiswa nonaktif.',
        ])
        ->assertForbidden();

    expect(Koreksi::count())->toBe(0);
});

test('mahasiswa tidak dapat memproses koreksi', function () {
    $koreksi = Koreksi::factory()->create([
        'mahasiswa_id' => $this->mahasiswa->id,
        'status' => StatusKoreksi::Menunggu,
    ]);

    $this->actingAs($this->user)
        ->post(route('admin.koreksi.decide', $koreksi), [
            'keputusan' => 'setujui',
        ])
        ->assertForbidden();
});

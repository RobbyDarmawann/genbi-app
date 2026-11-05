<?php

use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

uses(RefreshDatabase::class);

beforeEach(function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);

    $this->komsat = Komsat::query()->where('kode', 'UNG')->firstOrFail();
    $this->divisi = Divisi::factory()->create(['komsat_id' => $this->komsat->id, 'aktif' => true]);

    $this->mahasiswaUser = User::factory()->create(['username' => 'mhs_test', 'is_active' => true]);
    $this->mahasiswaUser->assignRole('mahasiswa');
    $this->mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->mahasiswaUser->id,
        'komsat_id' => $this->komsat->id,
        'divisi_id' => $this->divisi->id,
        'nim' => '531422001',
        'aktif' => true,
    ]);

    $this->otherUser = User::factory()->create(['username' => 'mhs_other', 'is_active' => true]);
    $this->otherUser->assignRole('mahasiswa');
    $this->otherMahasiswa = Mahasiswa::factory()->create([
        'user_id' => $this->otherUser->id,
        'komsat_id' => $this->komsat->id,
        'divisi_id' => $this->divisi->id,
        'nim' => '531422002',
        'aktif' => true,
    ]);
});

test('mahasiswa can view biodata edit page', function () {
    $response = $this->actingAs($this->mahasiswaUser)->get(route('mahasiswa.biodata.edit'));

    $response->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('mahasiswa/biodata/edit')
            ->has('mahasiswa', fn ($mahasiswa) => $mahasiswa
                ->where('username', 'mhs_test')
                ->where('nim', '531422001')
                ->etc()));
});

test('mahasiswa can update their own biodata', function () {
    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'jenis_kelamin' => 'Laki-laki',
            'agama' => 'Islam',
            'golongan_darah' => 'A',
            'tanggal_lahir' => '2000-05-15',
            'domisili' => 'Gorontalo',
            'no_hp' => '081234567890',
        ]);

    $response->assertRedirect();

    $this->mahasiswa->refresh();
    expect($this->mahasiswa->jenis_kelamin)->toBe('Laki-laki')
        ->and($this->mahasiswa->agama)->toBe('Islam')
        ->and($this->mahasiswa->golongan_darah)->toBe('A')
        ->and($this->mahasiswa->tanggal_lahir?->format('Y-m-d'))->toBe('2000-05-15')
        ->and($this->mahasiswa->domisili)->toBe('Gorontalo')
        ->and($this->mahasiswa->no_hp)->toBe('081234567890');
});

test('locked fields cannot be changed via biodata update', function () {
    $oldUsername = $this->mahasiswaUser->username;
    $oldNim = $this->mahasiswa->nim;
    $oldEmail = $this->mahasiswaUser->email;
    $oldKomsatId = $this->mahasiswa->komsat_id;
    $oldDivisiId = $this->mahasiswa->divisi_id;
    $oldAngkatan = $this->mahasiswa->angkatan;
    $oldStatusPenerima = $this->mahasiswa->status_penerima;
    $oldAktif = $this->mahasiswa->aktif;

    $newKomsat = Komsat::query()->where('kode', 'IAIN')->firstOrFail();
    $newDivisi = Divisi::factory()->create(['komsat_id' => $newKomsat->id, 'aktif' => true]);

    $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'jenis_kelamin' => 'Perempuan',
            'domisili' => 'Jakarta',
            'username' => 'hacked_username',
            'nim' => '999999999',
            'email' => 'hacker@example.com',
            'komsat_id' => $newKomsat->id,
            'divisi_id' => $newDivisi->id,
            'angkatan' => '9999',
            'status_penerima' => 'Alumni',
            'aktif' => false,
        ]);

    $this->mahasiswaUser->refresh();
    $this->mahasiswa->refresh();

    expect($this->mahasiswaUser->username)->toBe($oldUsername)
        ->and($this->mahasiswa->nim)->toBe($oldNim)
        ->and($this->mahasiswaUser->email)->toBe($oldEmail)
        ->and($this->mahasiswa->komsat_id)->toBe($oldKomsatId)
        ->and($this->mahasiswa->divisi_id)->toBe($oldDivisiId)
        ->and($this->mahasiswa->angkatan)->toBe($oldAngkatan)
        ->and($this->mahasiswa->status_penerima->value)->toBe($oldStatusPenerima->value)
        ->and($this->mahasiswa->aktif)->toBe($oldAktif)
        ->and($this->mahasiswa->jenis_kelamin)->toBe('Perempuan')
        ->and($this->mahasiswa->domisili)->toBe('Jakarta');
});

test('mahasiswa cannot access biodata of another mahasiswa', function () {
    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'mahasiswa_id' => $this->otherMahasiswa->id,
            'domisili' => 'Hacked Location',
        ]);

    $this->otherMahasiswa->refresh();
    expect($this->otherMahasiswa->domisili)->not->toBe('Hacked Location');
});

test('non-image file upload is rejected', function () {
    Storage::fake('public');

    $textFile = UploadedFile::fake()->create('document.txt', 100);

    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'foto' => $textFile,
            'domisili' => 'Test',
        ]);

    $response->assertSessionHasErrors('foto');
    expect($this->mahasiswa->fresh()->foto_path)->toBeNull();
});

test('valid image upload succeeds and replaces old photo', function () {
    Storage::fake('public');

    $oldPhoto = UploadedFile::fake()->image('old.jpg');
    $this->mahasiswa->update(['foto_path' => $oldPhoto->store('mahasiswa', 'public')]);
    $oldPath = $this->mahasiswa->foto_path;
    Storage::disk('public')->assertExists($oldPath);

    $newPhoto = UploadedFile::fake()->image('new.jpg');
    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'foto' => $newPhoto,
        ]);

    $response->assertRedirect();

    $this->mahasiswa->refresh();
    expect($this->mahasiswa->foto_path)->not->toBeNull()
        ->and($this->mahasiswa->foto_path)->not->toBe($oldPath);

    Storage::disk('public')->assertExists($this->mahasiswa->foto_path);
    Storage::disk('public')->assertMissing($oldPath);
});

test('no_hp validation rejects invalid phone numbers', function () {
    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'no_hp' => '12345', // Too short
        ]);

    $response->assertSessionHasErrors('no_hp');

    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'no_hp' => '1234567890123456', // Too long (16 digits)
        ]);

    $response->assertSessionHasErrors('no_hp');
});

test('tanggal_lahir validation rejects future dates', function () {
    $response = $this->actingAs($this->mahasiswaUser)
        ->patch(route('mahasiswa.biodata.update'), [
            'tanggal_lahir' => now()->addYear()->format('Y-m-d'),
        ]);

    $response->assertSessionHasErrors('tanggal_lahir');
});

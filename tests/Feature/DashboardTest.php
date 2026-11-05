<?php

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Koreksi;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
});

test('guests are redirected to the login page', function () {
    $response = $this->get(route('dashboard'));
    $response->assertRedirect(route('login'));
});

test('internal manajemen redirected to admin dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('internal_manajemen');

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('admin.dashboard'));
});

test('mahasiswa redirected to mahasiswa dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('mahasiswa');

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertRedirect(route('mahasiswa.dashboard'));
});

test('user without role cannot access the dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('dashboard'));

    $response->assertForbidden();
    $this->assertAuthenticatedAs($user);
});

test('internal management dashboard displays current operational counts and summaries', function () {
    $now = Carbon::parse('2026-11-05 14:25:15', config('app.timezone'));
    Carbon::setTestNow($now);

    $admin = User::factory()->create();
    $admin->assignRole('internal_manajemen');
    Periode::factory()->create([
        'tanggal_mulai' => '2026-11-01',
        'tanggal_selesai' => '2026-11-30',
        'aktif' => true,
    ]);
    $komsat = Komsat::factory()->create();
    $divisi = Divisi::factory()->create(['komsat_id' => $komsat->id]);
    $studentUser = User::factory()->create(['name' => 'Mahasiswa Dashboard']);
    $studentUser->assignRole('mahasiswa');
    $student = Mahasiswa::factory()->create([
        'user_id' => $studentUser->id,
        'komsat_id' => $komsat->id,
        'divisi_id' => $divisi->id,
        'aktif' => true,
    ]);
    Mahasiswa::factory()->create(['aktif' => false]);

    $activity = Kegiatan::factory()->create([
        'judul' => 'Kegiatan Dashboard',
        'tanggal' => '2026-11-10',
        'status' => StatusKegiatan::Terbit,
    ]);
    Kegiatan::factory()->create([
        'tanggal' => '2026-12-10',
        'status' => StatusKegiatan::Terbit,
    ]);
    $registration = Pendaftaran::factory()->create([
        'kegiatan_id' => $activity->id,
        'mahasiswa_id' => $student->id,
    ]);
    $attendance = Kehadiran::factory()->create([
        'pendaftaran_id' => $registration->id,
        'status' => StatusKehadiran::MenungguTinjau,
        'waktu_checkin' => $now->copy()->subDay(),
    ]);
    Koreksi::factory()->create([
        'mahasiswa_id' => $student->id,
        'kegiatan_id' => $activity->id,
        'status' => StatusKoreksi::Menunggu,
    ]);
    $validRegistration = Pendaftaran::factory()->create([
        'kegiatan_id' => $activity->id,
        'mahasiswa_id' => Mahasiswa::factory()->create(['aktif' => true])->id,
    ]);
    Kehadiran::factory()->create([
        'pendaftaran_id' => $validRegistration->id,
        'status' => StatusKehadiran::Valid,
        'waktu_checkin' => $now->copy()->subDays(2),
    ]);

    $response = $this->actingAs($admin)->get(route('admin.dashboard'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('admin/dashboard')
            ->where('ringkasan.kegiatan_aktif', 1)
            ->where('ringkasan.anggota_aktif', 2)
            ->where('ringkasan.kehadiran_bulan_ini', 1)
            ->where('ringkasan.koreksi_menunggu', 1)
            ->where('koreksi_menunggu.0.mahasiswa_nama', 'Mahasiswa Dashboard')
            ->where('kehadiran_menunggu.0.id', $attendance->id)
            ->where('kegiatan_terdekat.0.id', $activity->id)
        );

    expect($response->getContent())
        ->not->toContain('Statistik akan tersedia pada fase implementasi berikutnya');

    Carbon::setTestNow();
});

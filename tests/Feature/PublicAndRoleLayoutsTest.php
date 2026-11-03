<?php

use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\User;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
});

test('guest can access public routes', function (string $routeName) {
    $response = $this->get(route($routeName));

    $response->assertOk();
})->with([
    'home',
    'public.jadwal',
    'public.statistik',
    'public.kepengurusan',
]);

test('guest is redirected to login from admin routes', function (string $routeName) {
    $response = $this->get(route($routeName));

    $response->assertRedirect(route('login'));
})->with([
    'admin.dashboard',
    'admin.kegiatan.index',
    'admin.mahasiswa.index',
    'admin.komsat.index',
    'admin.kehadiran.index',
    'admin.koreksi.index',
    'admin.rekap.index',
    'admin.kepengurusan.index',
]);

test('internal management can access admin placeholder routes', function (string $routeName) {
    $user = User::factory()->create();
    $user->assignRole('internal_manajemen');

    $response = $this->actingAs($user)->get(route($routeName));

    $response->assertOk();
})->with([
    'admin.kegiatan.index',
    'admin.mahasiswa.index',
    'admin.komsat.index',
    'admin.kehadiran.index',
    'admin.koreksi.index',
    'admin.rekap.index',
    'admin.kepengurusan.index',
]);

test('active student can access student placeholder routes', function (string $routeName) {
    $komsat = Komsat::factory()->create();
    $divisi = Divisi::factory()->create(['komsat_id' => $komsat->id]);
    $student = User::factory()->create();
    $student->assignRole('mahasiswa');
    Mahasiswa::factory()->create([
        'user_id' => $student->id,
        'komsat_id' => $komsat->id,
        'divisi_id' => $divisi->id,
        'aktif' => true,
    ]);

    $response = $this->actingAs($student)->get(route($routeName));

    $response->assertOk();
})->with([
    'mahasiswa.kegiatan.index',
    'mahasiswa.kehadiran.index',
    'mahasiswa.poin.riwayat',
    'mahasiswa.koreksi.index',
    'mahasiswa.kepengurusan.index',
]);

test('student cannot access admin placeholder routes', function () {
    $student = User::factory()->create();
    $student->assignRole('mahasiswa');

    $response = $this->actingAs($student)->get(route('admin.kegiatan.index'));

    $response->assertForbidden();
});

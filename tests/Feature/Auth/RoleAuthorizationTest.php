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

test('mahasiswa cannot access internal management dashboard', function () {
    $student = User::factory()->create();
    $student->assignRole('mahasiswa');

    $response = $this->actingAs($student)->get(route('admin.dashboard'));

    $response->assertForbidden();
});

test('guest is redirected to login from protected dashboards', function () {
    $response = $this->get(route('admin.dashboard'));

    $response->assertRedirect(route('login'));
});

test('internal management can access its dashboard', function () {
    $user = User::factory()->create();
    $user->assignRole('internal_manajemen');

    $response = $this->actingAs($user)->get(route('admin.dashboard'));

    $response->assertOk();
});

test('student dashboard requires an active student profile', function () {
    $student = User::factory()->create();
    $student->assignRole('mahasiswa');

    $response = $this->actingAs($student)->get(route('mahasiswa.dashboard'));

    $response->assertForbidden();
});

test('active student can access student dashboard', function () {
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

    $response = $this->actingAs($student)->get(route('mahasiswa.dashboard'));

    $response->assertOk();
});

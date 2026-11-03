<?php

use App\Models\User;
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

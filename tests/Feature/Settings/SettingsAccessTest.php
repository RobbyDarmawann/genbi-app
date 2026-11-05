<?php

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
});

test('security page accessible by mahasiswa without verification', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);
    $user->assignRole('mahasiswa');

    $response = $this->actingAs($user)->get(route('security.edit'));

    $response->assertOk();
});

test('security page accessible by internal manajemen without verification', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);
    $user->assignRole('internal_manajemen');

    $response = $this->actingAs($user)->get(route('security.edit'));

    $response->assertOk();
});

test('appearance page accessible by mahasiswa without verification', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);
    $user->assignRole('mahasiswa');

    $response = $this->actingAs($user)->get(route('appearance.edit'));

    $response->assertOk();
});

test('appearance page accessible by internal manajemen without verification', function () {
    $user = User::factory()->create([
        'email_verified_at' => null,
    ]);
    $user->assignRole('internal_manajemen');

    $response = $this->actingAs($user)->get(route('appearance.edit'));

    $response->assertOk();
});

test('password can be updated by mahasiswa', function () {
    $user = User::factory()->create();
    $user->assignRole('mahasiswa');

    $response = $this
        ->actingAs($user)
        ->from(route('security.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect();

    expect(Hash::check('new-password', $user->refresh()->password))->toBeTrue();
});

test('password can be updated by internal manajemen', function () {
    $user = User::factory()->create();
    $user->assignRole('internal_manajemen');

    $response = $this
        ->actingAs($user)
        ->from(route('security.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'password',
            'password' => 'new-password-admin',
            'password_confirmation' => 'new-password-admin',
        ]);

    $response->assertSessionHasNoErrors()->assertRedirect();

    expect(Hash::check('new-password-admin', $user->refresh()->password))->toBeTrue();
});

test('wrong current password is rejected', function () {
    $user = User::factory()->create();
    $user->assignRole('mahasiswa');

    $response = $this
        ->actingAs($user)
        ->from(route('security.edit'))
        ->put(route('user-password.update'), [
            'current_password' => 'wrong-password',
            'password' => 'new-password',
            'password_confirmation' => 'new-password',
        ]);

    $response->assertSessionHasErrors('current_password');
});

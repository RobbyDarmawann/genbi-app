<?php

use App\Models\User;
use Illuminate\Support\Facades\RateLimiter;
use Spatie\Permission\Models\Role;

beforeEach(function () {
    Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
    Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
});

test('login screen can be rendered', function () {
    $response = $this->get(route('login'));

    $response->assertOk();
});

test('users can authenticate using username', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'is_active' => true,
    ]);
    $user->assignRole('internal_manajemen');

    $response = $this->post(route('login.store'), [
        'username' => 'testuser',
        'password' => 'password',
    ]);

    $response->assertSessionHasNoErrors();
    $this->assertAuthenticated();
    $response->assertRedirect();
});

test('users cannot authenticate with email as username', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'email' => 'test@example.com',
        'is_active' => true,
    ]);

    $this->post(route('login.store'), [
        'username' => 'test@example.com',
        'password' => 'password',
    ]);

    $this->assertGuest();
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'is_active' => true,
    ]);

    $this->post(route('login.store'), [
        'username' => 'testuser',
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('invalid login displays the Indonesian translated authentication message', function () {
    User::factory()->create([
        'username' => 'testuser',
        'is_active' => true,
    ]);

    $response = $this->post(route('login.store'), [
        'username' => 'testuser',
        'password' => 'wrong-password',
    ]);

    $response->assertSessionHasErrors(['username' => 'Username atau password salah. Silakan coba lagi.']);
    expect(session('errors')->get('username')[0])->not->toBe('auth.failed');
});

test('inactive users cannot authenticate', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
        'is_active' => false,
    ]);

    $response = $this->post(route('login.store'), [
        'username' => 'testuser',
        'password' => 'password',
    ]);

    $this->assertGuest();
    $response->assertSessionHasErrors(['username']);
});

test('users can logout', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('logout'));

    $response->assertRedirect(route('home'));

    $this->assertGuest();
});

test('users are rate limited', function () {
    $user = User::factory()->create([
        'username' => 'testuser',
    ]);

    RateLimiter::increment(md5('login'.implode('|', ['testuser', '127.0.0.1'])), amount: 5);

    $response = $this->post(route('login.store'), [
        'username' => 'testuser',
        'password' => 'wrong-password',
    ]);

    $response->assertTooManyRequests();
});

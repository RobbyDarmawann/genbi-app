<?php

use App\Enums\TipePoin;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;
use Spatie\Permission\Models\Role;

beforeEach(function (): void {
    Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
});

test('mahasiswa dashboard leaderboard ranks all active students by ledger points', function (): void {
    $komsat = Komsat::factory()->create(['kode' => 'UNG']);
    $students = collect([
        ['name' => 'Mahasiswa Nol', 'points' => 0],
        ['name' => 'Mahasiswa Tiga', 'points' => 30],
        ['name' => 'Mahasiswa Satu', 'points' => 10],
        ['name' => 'Mahasiswa Dua', 'points' => 20],
    ])->map(function (array $student) use ($komsat): array {
        $user = User::factory()->create(['name' => $student['name']]);
        $user->assignRole('mahasiswa');
        $mahasiswa = Mahasiswa::factory()->create([
            'user_id' => $user->id,
            'komsat_id' => $komsat->id,
            'aktif' => true,
        ]);

        if ($student['points'] > 0) {
            PoinTransaksi::factory()->create([
                'mahasiswa_id' => $mahasiswa->id,
                'jumlah' => $student['points'],
                'tipe' => TipePoin::Koreksi,
            ]);
        }

        return ['user' => $user, 'mahasiswa' => $mahasiswa, 'points' => $student['points']];
    });

    $current = $students->firstWhere('points', 10);
    $response = $this->actingAs($current['user'])->get(route('mahasiswa.dashboard'));

    $response->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('mahasiswa/dashboard')
            ->where('ringkasan.peringkat_saya', 3)
            ->has('leaderboard', 4)
            ->where('leaderboard.0.nama', 'Mahasiswa Tiga')
            ->where('leaderboard.0.total_poin', 30)
            ->where('leaderboard.1.nama', 'Mahasiswa Dua')
            ->where('leaderboard.1.total_poin', 20)
            ->where('leaderboard.2.nama', 'Mahasiswa Satu')
            ->where('leaderboard.2.total_poin', 10)
            ->where('leaderboard.2.is_current_user', true)
            ->where('leaderboard.3.nama', 'Mahasiswa Nol')
            ->where('leaderboard.3.total_poin', 0)
        );
});

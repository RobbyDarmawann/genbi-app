<?php

use App\Enums\TipePoin;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use App\Models\User;
use Database\Seeders\KomsatSeeder;
use Database\Seeders\RoleSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

uses(TestCase::class, RefreshDatabase::class);

test('total poin mahasiswa adalah penjumlahan murni seluruh transaksi kredit dan koreksi', function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);

    $user = User::factory()->create(['is_active' => true]);
    $user->assignRole('mahasiswa');
    $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();

    $mahasiswa = Mahasiswa::factory()->create([
        'user_id' => $user->id,
        'komsat_id' => $ung->id,
        'aktif' => true,
    ]);

    // Belum ada transaksi -> 0
    expect((int) PoinTransaksi::query()->where('mahasiswa_id', $mahasiswa->id)->sum('jumlah'))->toBe(0);

    // Transaksi kredit 10
    PoinTransaksi::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'tipe' => TipePoin::Kredit,
        'jumlah' => 10,
    ]);

    // Transaksi kredit 20
    PoinTransaksi::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'tipe' => TipePoin::Kredit,
        'jumlah' => 20,
    ]);

    // Transaksi koreksi 15
    PoinTransaksi::factory()->create([
        'mahasiswa_id' => $mahasiswa->id,
        'tipe' => TipePoin::Koreksi,
        'jumlah' => 15,
    ]);

    $total = (int) PoinTransaksi::query()->where('mahasiswa_id', $mahasiswa->id)->sum('jumlah');
    expect($total)->toBe(45);
});

test('perhitungan leaderboard mengurutkan mahasiswa dengan poin tertinggi di peringkat pertama', function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);
    $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();

    $users = User::factory()->count(3)->create(['is_active' => true]);
    $mhsList = [];

    foreach ($users as $idx => $u) {
        $u->assignRole('mahasiswa');
        $mhs = Mahasiswa::factory()->create([
            'user_id' => $u->id,
            'komsat_id' => $ung->id,
            'aktif' => true,
        ]);
        $mhsList[] = $mhs;
    }

    // Mhs 0: 10 poin
    PoinTransaksi::factory()->create(['mahasiswa_id' => $mhsList[0]->id, 'jumlah' => 10]);

    // Mhs 1: 50 poin
    PoinTransaksi::factory()->create(['mahasiswa_id' => $mhsList[1]->id, 'jumlah' => 50]);

    // Mhs 2: 30 poin
    PoinTransaksi::factory()->create(['mahasiswa_id' => $mhsList[2]->id, 'jumlah' => 30]);

    $leaderboard = Mahasiswa::query()
        ->select('mahasiswa.id')
        ->selectSub(
            PoinTransaksi::query()
                ->selectRaw('COALESCE(SUM(jumlah), 0)')
                ->whereColumn('poin_transaksi.mahasiswa_id', 'mahasiswa.id'),
            'total_poin'
        )
        ->orderByDesc('total_poin')
        ->pluck('total_poin', 'id')
        ->all();

    $scores = array_values($leaderboard);
    expect($scores)->toBe([50, 30, 10]);
});

test('transaksi mahasiswa lain tidak mempengaruhi kalkulasi poin mahasiswa saat ini', function () {
    $this->seed([RoleSeeder::class, KomsatSeeder::class]);
    $ung = Komsat::query()->where('kode', 'UNG')->firstOrFail();

    $u1 = User::factory()->create(['is_active' => true]);
    $u1->assignRole('mahasiswa');
    $m1 = Mahasiswa::factory()->create(['user_id' => $u1->id, 'komsat_id' => $ung->id]);

    $u2 = User::factory()->create(['is_active' => true]);
    $u2->assignRole('mahasiswa');
    $m2 = Mahasiswa::factory()->create(['user_id' => $u2->id, 'komsat_id' => $ung->id]);

    PoinTransaksi::factory()->create(['mahasiswa_id' => $m1->id, 'jumlah' => 20]);
    PoinTransaksi::factory()->create(['mahasiswa_id' => $m2->id, 'jumlah' => 100]);

    $totalM1 = (int) PoinTransaksi::query()->where('mahasiswa_id', $m1->id)->sum('jumlah');
    expect($totalM1)->toBe(20);
});

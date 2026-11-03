<?php

namespace Database\Seeders;

use App\Enums\StatusPenerima;
use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            KomsatSeeder::class,
            DivisiSeeder::class,
            PeriodeSeeder::class,
        ]);

        // Demo User Development Only
        // PERINGATAN: Akun dan password di bawah ini HANYA untuk kebutuhan demo dan testing development lokal!
        // DILARANG digunakan di production environment!

        // 1. Akun Internal Manajemen
        $internalUser = User::firstOrCreate(
            ['username' => 'internal'],
            [
                'name' => 'Internal Manajemen Demo',
                'email' => 'internal@genbigto.test',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $internalUser->assignRole('internal_manajemen');

        // 2. Akun Mahasiswa (UNG / Divisi Pendidikan)
        $komsatUng = Komsat::where('kode', 'UNG')->first();
        $divisiPendidikan = Divisi::where('komsat_id', $komsatUng?->id)
            ->where('nama', 'Pendidikan')
            ->first();

        $mahasiswaUser = User::firstOrCreate(
            ['username' => 'mahasiswa1'],
            [
                'name' => 'Mahasiswa Contoh UNG',
                'email' => 'mahasiswa1@genbigto.test',
                'password' => Hash::make('password'),
                'is_active' => true,
            ]
        );
        $mahasiswaUser->assignRole('mahasiswa');

        if ($komsatUng && $divisiPendidikan) {
            Mahasiswa::firstOrCreate(
                ['user_id' => $mahasiswaUser->id],
                [
                    'komsat_id' => $komsatUng->id,
                    'divisi_id' => $divisiPendidikan->id,
                    'nim' => '1234567890',
                    'angkatan' => '2024',
                    'status_penerima' => StatusPenerima::Penerima,
                    'aktif' => true,
                ]
            );
        }
    }
}

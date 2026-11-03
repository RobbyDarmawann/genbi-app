<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Menyiapkan dua role final sistem GenBI Gorontalo.
     * Guest bukan role database.
     */
    public function run(): void
    {
        Role::firstOrCreate(['name' => 'internal_manajemen', 'guard_name' => 'web']);
        Role::firstOrCreate(['name' => 'mahasiswa', 'guard_name' => 'web']);
    }
}

<?php

namespace App\Policies;

use App\Models\LokasiKegiatan;
use App\Models\User;

class LokasiKegiatanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function view(User $user, LokasiKegiatan $lokasi): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function update(User $user, LokasiKegiatan $lokasi): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function delete(User $user, LokasiKegiatan $lokasi): bool
    {
        return $user->hasRole('internal_manajemen');
    }
}

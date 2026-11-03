<?php

namespace App\Policies;

use App\Models\Mahasiswa;
use App\Models\User;

class MahasiswaPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function view(User $user, Mahasiswa $mahasiswa): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function update(User $user, Mahasiswa $mahasiswa): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function delete(User $user, Mahasiswa $mahasiswa): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function resetPassword(User $user, Mahasiswa $mahasiswa): bool
    {
        return $user->hasRole('internal_manajemen');
    }
}

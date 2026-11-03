<?php

namespace App\Policies;

use App\Models\Komsat;
use App\Models\User;

class KomsatPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function view(User $user, Komsat $komsat): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function update(User $user, Komsat $komsat): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function delete(User $user, Komsat $komsat): bool
    {
        return $user->hasRole('internal_manajemen');
    }
}

<?php

namespace App\Policies;

use App\Models\Periode;
use App\Models\User;

class PeriodePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function view(User $user, Periode $periode): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function update(User $user, Periode $periode): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function delete(User $user, Periode $periode): bool
    {
        return $user->hasRole('internal_manajemen');
    }
}

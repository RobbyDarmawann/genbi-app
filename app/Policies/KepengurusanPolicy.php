<?php

namespace App\Policies;

use App\Models\Kepengurusan;
use App\Models\User;

class KepengurusanPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Kepengurusan $kepengurusan): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Kepengurusan $kepengurusan): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Kepengurusan $kepengurusan): bool
    {
        return $user->hasRole('internal_manajemen');
    }
}

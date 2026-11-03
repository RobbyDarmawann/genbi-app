<?php

namespace App\Policies;

use App\Enums\StatusKoreksi;
use App\Models\Koreksi;
use App\Models\User;

class KoreksiPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen') || $user->mahasiswa !== null;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Koreksi $koreksi): bool
    {
        if ($user->hasRole('internal_manajemen')) {
            return true;
        }

        return $user->mahasiswa?->id === $koreksi->mahasiswa_id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->mahasiswa !== null && $user->mahasiswa->aktif;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Koreksi $koreksi): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Koreksi $koreksi): bool
    {
        return false;
    }

    /**
     * Memproses (setujui/tolak) koreksi.
     */
    public function process(User $user, Koreksi $koreksi): bool
    {
        if (! $user->hasRole('internal_manajemen')) {
            return false;
        }

        return $koreksi->status === StatusKoreksi::Menunggu;
    }

    /**
     * Melihat bukti koreksi.
     */
    public function viewBukti(User $user, Koreksi $koreksi): bool
    {
        if ($user->hasRole('internal_manajemen')) {
            return true;
        }

        return $user->mahasiswa?->id === $koreksi->mahasiswa_id;
    }
}

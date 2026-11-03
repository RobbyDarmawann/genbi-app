<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use App\Models\User;

class PendaftaranPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function register(User $user, Kegiatan $kegiatan): bool
    {
        if (! $user->hasRole('mahasiswa') || ! $user->is_active) {
            return false;
        }

        $mahasiswa = $user->mahasiswa;

        return $mahasiswa !== null && $mahasiswa->aktif;
    }

    public function cancelOnKegiatan(User $user, Kegiatan $kegiatan): bool
    {
        if (! $user->hasRole('mahasiswa') || ! $user->is_active) {
            return false;
        }

        $mahasiswa = $user->mahasiswa;

        return $mahasiswa !== null && $mahasiswa->aktif;
    }

    public function cancel(User $user, Pendaftaran $pendaftaran): bool
    {
        if (! $user->hasRole('mahasiswa') || ! $user->is_active) {
            return false;
        }

        $mahasiswa = $user->mahasiswa;

        return $mahasiswa !== null
            && $mahasiswa->aktif
            && $pendaftaran->mahasiswa_id === $mahasiswa->id;
    }

    public function changeRole(User $user, Pendaftaran $pendaftaran): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function adminCancel(User $user, Pendaftaran $pendaftaran): bool
    {
        return $user->hasRole('internal_manajemen');
    }
}

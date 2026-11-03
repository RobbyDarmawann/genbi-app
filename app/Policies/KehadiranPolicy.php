<?php

namespace App\Policies;

use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\User;

class KehadiranPolicy
{
    public function submit(User $user, Kegiatan $kegiatan): bool
    {
        if (! $user->hasRole('mahasiswa') || ! $user->is_active) {
            return false;
        }

        $mahasiswa = $user->mahasiswa;

        return $mahasiswa !== null && $mahasiswa->aktif;
    }

    public function viewFoto(User $user, Kehadiran $kehadiran): bool
    {
        if ($user->hasRole('internal_manajemen')) {
            return true;
        }

        if (! $user->hasRole('mahasiswa') || ! $user->is_active) {
            return false;
        }

        $mahasiswa = $user->mahasiswa;

        if ($mahasiswa === null || ! $mahasiswa->aktif) {
            return false;
        }

        return $kehadiran->pendaftaran->mahasiswa_id === $mahasiswa->id;
    }
}

<?php

namespace App\Policies;

use App\Enums\StatusKegiatan;
use App\Models\Kegiatan;
use App\Models\User;

class KegiatanPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function view(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function create(User $user): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function update(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function delete(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function changeStatus(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('internal_manajemen');
    }

    public function viewAsMahasiswa(User $user, Kegiatan $kegiatan): bool
    {
        return $user->hasRole('mahasiswa') && in_array($kegiatan->status, [
            StatusKegiatan::Terbit,
            StatusKegiatan::Berlangsung,
            StatusKegiatan::Selesai,
            StatusKegiatan::Terkunci,
        ], true);
    }
}

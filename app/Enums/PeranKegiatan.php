<?php

namespace App\Enums;

enum PeranKegiatan: string
{
    case Peserta = 'peserta';
    case Panitia = 'panitia';
    case Pemateri = 'pemateri';

    public function label(): string
    {
        return match ($this) {
            self::Peserta => 'Peserta',
            self::Panitia => 'Panitia',
            self::Pemateri => 'Pemateri',
        };
    }
}

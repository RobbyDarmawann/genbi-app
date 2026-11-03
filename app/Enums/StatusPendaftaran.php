<?php

namespace App\Enums;

enum StatusPendaftaran: string
{
    case Terdaftar = 'terdaftar';
    case Batal = 'batal';

    public function label(): string
    {
        return match ($this) {
            self::Terdaftar => 'Terdaftar',
            self::Batal => 'Batal',
        };
    }
}

<?php

namespace App\Enums;

enum StatusKehadiran: string
{
    case Valid = 'valid';
    case Ditolak = 'ditolak';
    case MenungguTinjau = 'menunggu_tinjau';

    public function label(): string
    {
        return match ($this) {
            self::Valid => 'Valid',
            self::Ditolak => 'Ditolak',
            self::MenungguTinjau => 'Menunggu Tinjau',
        };
    }
}

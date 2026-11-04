<?php

namespace App\Enums;

enum TipePoin: string
{
    case Kredit = 'kredit';
    case Koreksi = 'koreksi';

    public function label(): string
    {
        return match ($this) {
            self::Kredit => 'Kredit Kehadiran',
            self::Koreksi => 'Koreksi Poin',
        };
    }
}

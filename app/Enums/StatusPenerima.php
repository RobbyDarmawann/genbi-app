<?php

namespace App\Enums;

enum StatusPenerima: string
{
    case Penerima = 'penerima';
    case NonPenerima = 'non_penerima';
    case Alumni = 'alumni';

    public function label(): string
    {
        return match ($this) {
            self::Penerima => 'Penerima Beasiswa',
            self::NonPenerima => 'Non-Penerima',
            self::Alumni => 'Alumni',
        };
    }
}

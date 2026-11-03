<?php

namespace App\Enums;

enum StatusKegiatan: string
{
    case Draft = 'draft';
    case Terbit = 'terbit';
    case Berlangsung = 'berlangsung';
    case Selesai = 'selesai';
    case Terkunci = 'terkunci';
    case Dibatalkan = 'dibatalkan';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draf',
            self::Terbit => 'Terbit',
            self::Berlangsung => 'Berlangsung',
            self::Selesai => 'Selesai',
            self::Terkunci => 'Terkunci',
            self::Dibatalkan => 'Dibatalkan',
        };
    }

    /**
     * Mengecek apakah transisi ke status target diperbolehkan.
     * Berlangsung dan Selesai tidak lagi transisi manual, dihitung otomatis dari waktu.
     */
    public function canTransitionTo(self $target): bool
    {
        if ($this === $target) {
            return true;
        }

        return match ($this) {
            self::Draft => in_array($target, [self::Terbit, self::Dibatalkan], true),
            self::Terbit => in_array($target, [self::Dibatalkan], true),
            self::Berlangsung => in_array($target, [self::Dibatalkan], true),
            self::Selesai => in_array($target, [self::Terkunci, self::Dibatalkan], true),
            self::Dibatalkan => in_array($target, [self::Draft], true),
            self::Terkunci => false,
        };
    }
}

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
}

<?php

namespace App\Enums;

enum StatusKehadiran: string
{
    case Valid = 'valid';
    case Ditolak = 'ditolak';
    case MenungguTinjau = 'menunggu_tinjau';
}

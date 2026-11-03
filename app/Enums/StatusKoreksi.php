<?php

namespace App\Enums;

enum StatusKoreksi: string
{
    case Menunggu = 'menunggu';
    case Disetujui = 'disetujui';
    case Ditolak = 'ditolak';
}

<?php

namespace App\Enums;

enum JenisKoreksi: string
{
    case BelumAbsen = 'belum_absen';
    case PoinBelumMasuk = 'poin_belum_masuk';
    case DataSalah = 'data_salah';
    case Lainnya = 'lainnya';
}

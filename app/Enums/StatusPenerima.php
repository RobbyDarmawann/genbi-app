<?php

namespace App\Enums;

enum StatusPenerima: string
{
    case Penerima = 'penerima';
    case NonPenerima = 'non_penerima';
    case Alumni = 'alumni';
}

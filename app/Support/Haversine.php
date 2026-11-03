<?php

namespace App\Support;

class Haversine
{
    /**
     * Hitung jarak dalam meter antara dua koordinat menggunakan rumus Haversine.
     *
     * @param  float  $lat1  Latitude titik pertama (derajat)
     * @param  float  $lon1  Longitude titik pertama (derajat)
     * @param  float  $lat2  Latitude titik kedua (derajat)
     * @param  float  $lon2  Longitude titik kedua (derajat)
     * @return float Jarak dalam meter
     */
    public static function distance(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadiusM = 6371000;

        $dLat = deg2rad($lat2 - $lat1);
        $dLon = deg2rad($lon2 - $lon1);

        $lat1Rad = deg2rad($lat1);
        $lat2Rad = deg2rad($lat2);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos($lat1Rad) * cos($lat2Rad) *
            sin($dLon / 2) * sin($dLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadiusM * $c;
    }
}

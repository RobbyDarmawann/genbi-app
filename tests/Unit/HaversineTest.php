<?php

use App\Support\Haversine;

test('jarak antara dua titik yang identik adalah nol', function () {
    $distance = Haversine::distance(0.5561740, 123.0585480, 0.5561740, 123.0585480);
    expect($distance)->toBe(0.0);
});

test('jarak antara dua titik di Gorontalo dihitung dengan akurat', function () {
    // Kampus UNG ke titik ~100m ke utara
    $lat1 = 0.5561740;
    $lon1 = 123.0585480;
    $lat2 = 0.5570740; // ~100m ke utara
    $lon2 = 123.0585480;

    $distance = Haversine::distance($lat1, $lon1, $lat2, $lon2);

    expect($distance)->toBeGreaterThan(90.0)
        ->and($distance)->toBeLessThan(110.0);
});

test('jarak dihitung simetris untuk kedua arah', function () {
    $lat1 = 0.5561740;
    $lon1 = 123.0585480;
    $lat2 = 0.5570740;
    $lon2 = 123.0595480;

    $distanceAB = Haversine::distance($lat1, $lon1, $lat2, $lon2);
    $distanceBA = Haversine::distance($lat2, $lon2, $lat1, $lon1);

    expect($distanceAB)->toBe($distanceBA);
});

test('jarak negatif longitude dihitung dengan benar', function () {
    // Test with coordinates crossing the prime meridian
    $distance = Haversine::distance(0.0, -1.0, 0.0, 1.0);

    expect($distance)->toBeGreaterThan(0.0);
});

test('jarak pada ekuator lebih panjang per derajat longitude dibanding lintang tinggi', function () {
    // Jarak 1 derajat longitude di ekuator
    $distanceEquator = Haversine::distance(0.0, 0.0, 0.0, 1.0);

    // Jarak 1 derajat longitude di lintang 60 derajat
    $distanceHigh = Haversine::distance(60.0, 0.0, 60.0, 1.0);

    expect($distanceEquator)->toBeGreaterThan($distanceHigh);
});

test('radius bumi dalam formula menghasilkan meter bukan kilometer', function () {
    // Jarak 1 derajat latitude seharusnya ~111 km = ~111000 meter
    $distance = Haversine::distance(0.0, 0.0, 1.0, 0.0);

    expect($distance)->toBeGreaterThan(110000.0)
        ->and($distance)->toBeLessThan(112000.0);
});

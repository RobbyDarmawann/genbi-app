<?php

use App\Models\LokasiKegiatan;
use Database\Seeders\LokasiKegiatanSeeder;

test('LokasiKegiatanSeeder menghasilkan lokasi yang diharapkan dan idempoten', function () {
    $this->seed(LokasiKegiatanSeeder::class);

    $mandatoryLocations = [
        'Kampus 1 UNG' => ['lat' => 0.5550, 'lng' => 123.0624, 'radius' => 300],
        'Kampus 4 UNG' => ['lat' => 0.552704, 'lng' => 123.137023, 'radius' => 300],
        'Lapangan Taruna Remaja' => ['lat' => 0.528666, 'lng' => 123.059269, 'radius' => 300],
        'Aula KPw BI Gorontalo' => ['lat' => 0.5402, 'lng' => 123.0601, 'radius' => 100],
        'Gelanggang Olahraga' => ['lat' => 0.5517812, 'lng' => 123.0563066, 'radius' => 100],
        'PKM UNG' => ['lat' => 0.5541, 'lng' => 123.0612, 'radius' => 100],
        'IAIN Sultan Amai Gorontalo' => ['lat' => 0.5562, 'lng' => 123.0645, 'radius' => 200],
        'Pantai Kurenai' => ['lat' => 0.518, 'lng' => 123.085, 'radius' => 150],
    ];

    $additionalCampuses = [
        'Universitas Gorontalo' => ['lat' => 0.5621, 'lng' => 123.0702, 'radius' => 150],
        'Universitas Muhammadiyah Gorontalo' => ['lat' => 0.5489, 'lng' => 123.0498, 'radius' => 150],
        'Universitas Bina Mandiri Gorontalo' => ['lat' => 0.5447, 'lng' => 123.0663, 'radius' => 150],
    ];

    expect(LokasiKegiatan::count())->toBe(count($mandatoryLocations) + count($additionalCampuses));

    foreach ($mandatoryLocations as $nama => $spec) {
        $lokasi = LokasiKegiatan::where('nama', $nama)->first();
        expect($lokasi)->not->toBeNull()
            ->and((float) $lokasi->latitude)->toEqualWithDelta($spec['lat'], 0.0001)
            ->and((float) $lokasi->longitude)->toEqualWithDelta($spec['lng'], 0.0001)
            ->and($lokasi->radius_m)->toBe($spec['radius'])
            ->and($lokasi->aktif)->toBeTrue()
            ->and($lokasi->keterangan)->not->toBeEmpty();
    }

    foreach ($additionalCampuses as $nama => $spec) {
        $lokasi = LokasiKegiatan::where('nama', $nama)->first();
        expect($lokasi)->not->toBeNull()
            ->and((float) $lokasi->latitude)->toEqualWithDelta($spec['lat'], 0.0001)
            ->and((float) $lokasi->longitude)->toEqualWithDelta($spec['lng'], 0.0001)
            ->and($lokasi->radius_m)->toBe($spec['radius'])
            ->and($lokasi->aktif)->toBeTrue()
            ->and($lokasi->keterangan)->not->toBeEmpty();
    }

    // Uji idempotensi saat dijalankan ulang
    $this->seed(LokasiKegiatanSeeder::class);
    expect(LokasiKegiatan::count())->toBe(count($mandatoryLocations) + count($additionalCampuses));
});

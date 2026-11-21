<?php

use App\Models\Kegiatan;
use App\Models\SesiAbsensi;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

function buatSesiAbsensi(string $jamBuka, string $jamTutup): SesiAbsensi
{
    return SesiAbsensi::query()->create([
        'kegiatan_id' => Kegiatan::factory()->create()->id,
        'tanggal' => '2026-06-15',
        'jam_buka' => $jamBuka,
        'jam_tutup' => $jamTutup,
    ]);
}

test('jam tutup setelah tengah malam jatuh pada tanggal berikutnya', function () {
    $sesi = buatSesiAbsensi('22:30:00', '00:30:00');

    expect($sesi->bukaAt()->toDateTimeString())->toBe('2026-06-15 22:30:00')
        ->and($sesi->tutupAt()->toDateTimeString())->toBe('2026-06-16 00:30:00');
});

test('jam tutup yang sama dengan jam buka berarti tepat 24 jam', function () {
    $sesi = buatSesiAbsensi('08:00:00', '08:00:00');

    expect($sesi->tutupAt()->toDateTimeString())->toBe('2026-06-16 08:00:00');
});

test('sesi normal tetap menutup pada tanggal yang sama', function () {
    $sesi = buatSesiAbsensi('07:30:00', '12:30:00');

    expect($sesi->bukaAt()->toDateTimeString())->toBe('2026-06-15 07:30:00')
        ->and($sesi->tutupAt()->toDateTimeString())->toBe('2026-06-15 12:30:00');
});

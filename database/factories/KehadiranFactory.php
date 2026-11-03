<?php

namespace Database\Factories;

use App\Enums\StatusKehadiran;
use App\Enums\SumberKehadiran;
use App\Models\Kehadiran;
use App\Models\Pendaftaran;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kehadiran>
 */
class KehadiranFactory extends Factory
{
    protected $model = Kehadiran::class;

    public function definition(): array
    {
        return [
            'pendaftaran_id' => Pendaftaran::factory(),
            'waktu_checkin' => now(),
            'latitude' => 0.5400000,
            'longitude' => 123.0600000,
            'akurasi_m' => 15.0,
            'jarak_m' => 20.0,
            'foto_path' => 'absensi/sample-selfie.jpg',
            'sumber' => SumberKehadiran::Mandiri,
            'status' => StatusKehadiran::Valid,
            'alasan_penolakan' => null,
            'metadata' => ['device' => 'Mobile Safari'],
        ];
    }
}

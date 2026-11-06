<?php

namespace Database\Factories;

use App\Enums\StatusKegiatan;
use App\Models\Kegiatan;
use App\Models\SesiAbsensi;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Kegiatan>
 */
class KegiatanFactory extends Factory
{
    protected $model = Kegiatan::class;

    public function definition(): array
    {
        $tanggal = fake()->dateTimeBetween('-1 month', '+1 month');
        $jamMulai = '08:00:00';
        $jamSelesai = '12:00:00';

        return [
            'judul' => fake()->sentence(4),
            'deskripsi' => fake()->paragraph(),
            'komsat_id' => null,
            'lokasi_nama' => fake()->company(),
            'latitude' => 0.5400000,
            'longitude' => 123.0600000,
            'radius_m' => 100,
            'tanggal' => $tanggal->format('Y-m-d'),
            'jam_mulai' => $jamMulai,
            'jam_selesai' => $jamSelesai,
            'absensi_buka_at' => (clone $tanggal)->setTime(7, 30),
            'absensi_tutup_at' => (clone $tanggal)->setTime(12, 30),
            'pendaftaran_dibuka_at' => (clone $tanggal)->modify('-7 days'),
            'batas_daftar_at' => (clone $tanggal)->modify('-1 day'),
            'kuota' => 100,
            'status' => StatusKegiatan::Terbit,
            'dibuat_oleh' => User::factory(),
        ];
    }

    public function configure(): static
    {
        return $this->afterCreating(function (Kegiatan $kegiatan) {
            SesiAbsensi::query()->create([
                'kegiatan_id' => $kegiatan->id,
                'tanggal' => $kegiatan->tanggal->toDateString(),
                'jam_buka' => Carbon::parse($kegiatan->absensi_buka_at)->format('H:i:s'),
                'jam_tutup' => Carbon::parse($kegiatan->absensi_tutup_at)->format('H:i:s'),
            ]);
        });
    }
}

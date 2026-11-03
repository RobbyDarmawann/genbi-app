<?php

namespace Database\Factories;

use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<AuditLog>
 */
class AuditLogFactory extends Factory
{
    protected $model = AuditLog::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'aksi' => fake()->randomElement(['kegiatan.kunci', 'poin.kredit', 'peran.ubah']),
            'subject_type' => 'App\Models\Kegiatan',
            'subject_id' => 1,
            'metadata' => ['keterangan' => 'Log aksi administratif'],
            'ip_address' => fake()->ipv4(),
        ];
    }
}

<?php

namespace App\Models;

use App\Enums\StatusKehadiran;
use App\Enums\SumberKehadiran;
use Database\Factories\KehadiranFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $pendaftaran_id
 * @property Carbon $waktu_checkin
 * @property string|null $latitude
 * @property string|null $longitude
 * @property string|null $akurasi_m
 * @property string|null $jarak_m
 * @property string|null $foto_path
 * @property SumberKehadiran $sumber
 * @property StatusKehadiran $status
 * @property string|null $alasan_penolakan
 * @property array<string, mixed>|null $metadata
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'pendaftaran_id',
    'waktu_checkin',
    'latitude',
    'longitude',
    'akurasi_m',
    'jarak_m',
    'foto_path',
    'sumber',
    'status',
    'alasan_penolakan',
    'metadata',
])]
class Kehadiran extends Model
{
    /** @use HasFactory<KehadiranFactory> */
    use HasFactory;

    protected $table = 'kehadiran';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'waktu_checkin' => 'datetime',
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'akurasi_m' => 'decimal:2',
            'jarak_m' => 'decimal:2',
            'sumber' => SumberKehadiran::class,
            'status' => StatusKehadiran::class,
            'metadata' => 'array',
        ];
    }

    /**
     * @return BelongsTo<Pendaftaran, $this>
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    /**
     * @return HasOne<PoinTransaksi, $this>
     */
    public function poinTransaksi(): HasOne
    {
        return $this->hasOne(PoinTransaksi::class);
    }

    /**
     * Scope kehadiran valid.
     *
     * @param  Builder<Kehadiran>  $query
     * @return Builder<Kehadiran>
     */
    public function scopeValid(Builder $query): Builder
    {
        return $query->where('status', StatusKehadiran::Valid);
    }
}

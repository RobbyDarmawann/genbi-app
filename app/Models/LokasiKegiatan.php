<?php

namespace App\Models;

use Database\Factories\LokasiKegiatanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $nama
 * @property string $latitude
 * @property string $longitude
 * @property int $radius_m
 * @property string|null $keterangan
 * @property bool $aktif
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['nama', 'latitude', 'longitude', 'radius_m', 'keterangan', 'aktif'])]
class LokasiKegiatan extends Model
{
    /** @use HasFactory<LokasiKegiatanFactory> */
    use HasFactory;

    protected $table = 'lokasi_kegiatan';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'radius_m' => 'integer',
            'aktif' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Kegiatan, $this>
     */
    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class, 'lokasi_id');
    }

    /**
     * @param  Builder<LokasiKegiatan>  $query
     * @return Builder<LokasiKegiatan>
     */
    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }
}

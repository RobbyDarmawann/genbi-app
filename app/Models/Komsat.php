<?php

namespace App\Models;

use Database\Factories\KomsatFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $kode
 * @property string $nama
 * @property bool $aktif
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['kode', 'nama', 'aktif'])]
class Komsat extends Model
{
    /** @use HasFactory<KomsatFactory> */
    use HasFactory;

    protected $table = 'komsat';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'aktif' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Divisi, $this>
     */
    public function divisi(): HasMany
    {
        return $this->hasMany(Divisi::class);
    }

    /**
     * @return HasMany<Mahasiswa, $this>
     */
    public function mahasiswa(): HasMany
    {
        return $this->hasMany(Mahasiswa::class);
    }

    /**
     * @return HasMany<Kegiatan, $this>
     */
    public function kegiatan(): HasMany
    {
        return $this->hasMany(Kegiatan::class);
    }

    /**
     * @return HasMany<Kepengurusan, $this>
     */
    public function kepengurusan(): HasMany
    {
        return $this->hasMany(Kepengurusan::class);
    }

    /**
     * Scope untuk komsat aktif.
     *
     * @param  Builder<Komsat>  $query
     * @return Builder<Komsat>
     */
    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }
}

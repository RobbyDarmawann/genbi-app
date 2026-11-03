<?php

namespace App\Models;

use Database\Factories\DivisiFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $komsat_id
 * @property string $nama
 * @property bool $aktif
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['komsat_id', 'nama', 'aktif'])]
class Divisi extends Model
{
    /** @use HasFactory<DivisiFactory> */
    use HasFactory;

    protected $table = 'divisi';

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
     * @return BelongsTo<Komsat, $this>
     */
    public function komsat(): BelongsTo
    {
        return $this->belongsTo(Komsat::class);
    }

    /**
     * @return HasMany<Mahasiswa, $this>
     */
    public function mahasiswa(): HasMany
    {
        return $this->hasMany(Mahasiswa::class);
    }

    /**
     * @return BelongsToMany<Kegiatan, $this>
     */
    public function kegiatan(): BelongsToMany
    {
        return $this->belongsToMany(Kegiatan::class, 'kegiatan_divisi_target');
    }

    /**
     * Scope divisi aktif.
     *
     * @param  Builder<Divisi>  $query
     * @return Builder<Divisi>
     */
    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }

    /**
     * Scope divisi berdasarkan komsat.
     *
     * @param  Builder<Divisi>  $query
     * @return Builder<Divisi>
     */
    public function scopeUntukKomsat(Builder $query, int $komsatId): Builder
    {
        return $query->where('komsat_id', $komsatId);
    }
}

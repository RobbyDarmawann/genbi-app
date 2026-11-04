<?php

namespace App\Models;

use Database\Factories\KepengurusanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $periode_id
 * @property int|null $komsat_id
 * @property int|null $mahasiswa_id
 * @property string $nama_tampil
 * @property string $jabatan
 * @property int $urutan
 * @property string|null $kontak
 * @property string|null $foto_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['periode_id', 'komsat_id', 'mahasiswa_id', 'nama_tampil', 'jabatan', 'urutan', 'kontak', 'foto_path'])]
class Kepengurusan extends Model
{
    /** @use HasFactory<KepengurusanFactory> */
    use HasFactory;

    protected $table = 'kepengurusan';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'urutan' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Periode, $this>
     */
    public function periode(): BelongsTo
    {
        return $this->belongsTo(Periode::class);
    }

    /**
     * @return BelongsTo<Komsat, $this>
     */
    public function komsat(): BelongsTo
    {
        return $this->belongsTo(Komsat::class);
    }

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    /**
     * Scope pengurus tingkat wilayah (komsat_id null).
     *
     * @param  Builder<Kepengurusan>  $query
     * @return Builder<Kepengurusan>
     */
    public function scopeWilayah(Builder $query): Builder
    {
        return $query->whereNull('komsat_id');
    }

    /**
     * Scope pengurus komsat tertentu.
     *
     * @param  Builder<Kepengurusan>  $query
     * @return Builder<Kepengurusan>
     */
    public function scopeUntukKomsat(Builder $query, int $komsatId): Builder
    {
        return $query->where('komsat_id', $komsatId);
    }
}

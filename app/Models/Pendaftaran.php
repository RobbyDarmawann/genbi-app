<?php

namespace App\Models;

use App\Enums\PeranKegiatan;
use App\Enums\StatusPendaftaran;
use Database\Factories\PendaftaranFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $kegiatan_id
 * @property int $mahasiswa_id
 * @property PeranKegiatan $peran
 * @property StatusPendaftaran $status
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['kegiatan_id', 'mahasiswa_id', 'peran', 'status'])]
class Pendaftaran extends Model
{
    /** @use HasFactory<PendaftaranFactory> */
    use HasFactory;

    protected $table = 'pendaftaran';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'peran' => PeranKegiatan::class,
            'status' => StatusPendaftaran::class,
        ];
    }

    /**
     * @return BelongsTo<Kegiatan, $this>
     */
    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class);
    }

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    /**
     * @return HasOne<Kehadiran, $this>
     */
    public function kehadiran(): HasOne
    {
        return $this->hasOne(Kehadiran::class);
    }

    /**
     * @return HasMany<Koreksi, $this>
     */
    public function koreksi(): HasMany
    {
        return $this->hasMany(Koreksi::class);
    }

    /**
     * Scope pendaftaran aktif (terdaftar).
     *
     * @param  Builder<Pendaftaran>  $query
     * @return Builder<Pendaftaran>
     */
    public function scopeTerdaftar(Builder $query): Builder
    {
        return $query->where('status', StatusPendaftaran::Terdaftar);
    }
}

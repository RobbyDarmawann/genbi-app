<?php

namespace App\Models;

use App\Enums\JenisKoreksi;
use App\Enums\StatusKoreksi;
use Database\Factories\KoreksiFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $mahasiswa_id
 * @property int $kegiatan_id
 * @property int|null $pendaftaran_id
 * @property JenisKoreksi $jenis
 * @property string $alasan
 * @property string|null $bukti_path
 * @property StatusKoreksi $status
 * @property int|null $diproses_oleh
 * @property string|null $catatan_proses
 * @property Carbon|null $diproses_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'mahasiswa_id',
    'kegiatan_id',
    'pendaftaran_id',
    'jenis',
    'alasan',
    'bukti_path',
    'status',
    'diproses_oleh',
    'catatan_proses',
    'diproses_at',
])]
class Koreksi extends Model
{
    /** @use HasFactory<KoreksiFactory> */
    use HasFactory;

    protected $table = 'koreksi';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'jenis' => JenisKoreksi::class,
            'status' => StatusKoreksi::class,
            'diproses_at' => 'datetime',
        ];
    }

    /**
     * @return BelongsTo<Mahasiswa, $this>
     */
    public function mahasiswa(): BelongsTo
    {
        return $this->belongsTo(Mahasiswa::class);
    }

    /**
     * @return BelongsTo<Kegiatan, $this>
     */
    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class);
    }

    /**
     * @return BelongsTo<Pendaftaran, $this>
     */
    public function pendaftaran(): BelongsTo
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function pemroses(): BelongsTo
    {
        return $this->belongsTo(User::class, 'diproses_oleh');
    }

    /**
     * Scope koreksi yang masih menunggu diproses.
     *
     * @param  Builder<Koreksi>  $query
     * @return Builder<Koreksi>
     */
    public function scopeMenunggu(Builder $query): Builder
    {
        return $query->where('status', StatusKoreksi::Menunggu);
    }
}

<?php

namespace App\Models;

use App\Enums\TipePoin;
use Database\Factories\PoinTransaksiFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $mahasiswa_id
 * @property int|null $kegiatan_id
 * @property int|null $kehadiran_id
 * @property TipePoin $tipe
 * @property int $jumlah
 * @property string $keterangan
 * @property int|null $dibuat_oleh
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'mahasiswa_id',
    'kegiatan_id',
    'kehadiran_id',
    'tipe',
    'jumlah',
    'keterangan',
    'dibuat_oleh',
])]
class PoinTransaksi extends Model
{
    /** @use HasFactory<PoinTransaksiFactory> */
    use HasFactory;

    protected $table = 'poin_transaksi';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tipe' => TipePoin::class,
            'jumlah' => 'integer',
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
     * @return BelongsTo<Kehadiran, $this>
     */
    public function kehadiran(): BelongsTo
    {
        return $this->belongsTo(Kehadiran::class);
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * Scope transaksi bertipe kredit.
     *
     * @param  Builder<PoinTransaksi>  $query
     * @return Builder<PoinTransaksi>
     */
    public function scopeKredit(Builder $query): Builder
    {
        return $query->where('tipe', TipePoin::Kredit);
    }

    /**
     * Scope transaksi bertipe koreksi.
     *
     * @param  Builder<PoinTransaksi>  $query
     * @return Builder<PoinTransaksi>
     */
    public function scopeKoreksi(Builder $query): Builder
    {
        return $query->where('tipe', TipePoin::Koreksi);
    }
}

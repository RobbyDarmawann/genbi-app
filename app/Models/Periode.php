<?php

namespace App\Models;

use Database\Factories\PeriodeFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @property int $id
 * @property string $nama
 * @property Carbon $tanggal_mulai
 * @property Carbon $tanggal_selesai
 * @property bool $aktif
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['nama', 'tanggal_mulai', 'tanggal_selesai', 'aktif'])]
class Periode extends Model
{
    /** @use HasFactory<PeriodeFactory> */
    use HasFactory;

    protected $table = 'periode';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'aktif' => 'boolean',
        ];
    }

    /**
     * @return HasMany<Kepengurusan, $this>
     */
    public function kepengurusan(): HasMany
    {
        return $this->hasMany(Kepengurusan::class);
    }

    /**
     * Scope untuk periode aktif.
     *
     * @param  Builder<Periode>  $query
     * @return Builder<Periode>
     */
    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }

    /**
     * Mengaktifkan periode ini dan menonaktifkan seluruh periode lain (aturan 1 periode aktif).
     */
    public function aktifkan(): void
    {
        DB::transaction(function () {
            static::query()->where('id', '!=', $this->id)->update(['aktif' => false]);
            $this->update(['aktif' => true]);
        });
    }

    protected static function booted(): void
    {
        static::saving(function (self $periode) {
            if ($periode->aktif) {
                static::query()->where('id', '!=', $periode->id ?? 0)->update(['aktif' => false]);
            }
        });
    }
}

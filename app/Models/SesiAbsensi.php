<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $kegiatan_id
 * @property Carbon $tanggal
 * @property string $jam_buka
 * @property string $jam_tutup
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'kegiatan_id',
    'tanggal',
    'jam_buka',
    'jam_tutup',
])]
class SesiAbsensi extends Model
{
    /** @use HasFactory<Factory> */
    use HasFactory;

    protected $table = 'sesi_absensi';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'tanggal' => 'date',
        ];
    }

    /**
     * @return BelongsTo<Kegiatan, $this>
     */
    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class);
    }

    public function bukaAt(): Carbon
    {
        return Carbon::parse($this->tanggal->toDateString().' '.$this->jam_buka, config('app.timezone'));
    }

    public function tutupAt(): Carbon
    {
        return Carbon::parse($this->tanggal->toDateString().' '.$this->jam_tutup, config('app.timezone'));
    }
}

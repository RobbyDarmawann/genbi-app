<?php

namespace App\Models;

use App\Enums\PeranKegiatan;
use Database\Factories\KegiatanBobotFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $kegiatan_id
 * @property PeranKegiatan $peran
 * @property int $poin
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['kegiatan_id', 'peran', 'poin'])]
class KegiatanBobot extends Model
{
    /** @use HasFactory<KegiatanBobotFactory> */
    use HasFactory;

    protected $table = 'kegiatan_bobot';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'peran' => PeranKegiatan::class,
            'poin' => 'integer',
        ];
    }

    /**
     * @return BelongsTo<Kegiatan, $this>
     */
    public function kegiatan(): BelongsTo
    {
        return $this->belongsTo(Kegiatan::class);
    }
}

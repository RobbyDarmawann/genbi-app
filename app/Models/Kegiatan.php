<?php

namespace App\Models;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use Database\Factories\KegiatanFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $judul
 * @property string|null $deskripsi
 * @property int|null $komsat_id
 * @property string $lokasi_nama
 * @property string $latitude
 * @property string $longitude
 * @property int $radius_m
 * @property Carbon $tanggal
 * @property string $jam_mulai
 * @property string $jam_selesai
 * @property Carbon $absensi_buka_at
 * @property Carbon $absensi_tutup_at
 * @property Carbon|null $pendaftaran_dibuka_at
 * @property Carbon|null $batas_daftar_at
 * @property int|null $kuota
 * @property StatusKegiatan $status
 * @property int $dibuat_oleh
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable([
    'judul',
    'deskripsi',
    'komsat_id',
    'lokasi_nama',
    'latitude',
    'longitude',
    'radius_m',
    'tanggal',
    'jam_mulai',
    'jam_selesai',
    'absensi_buka_at',
    'absensi_tutup_at',
    'pendaftaran_dibuka_at',
    'batas_daftar_at',
    'kuota',
    'status',
    'dibuat_oleh',
])]
class Kegiatan extends Model
{
    /** @use HasFactory<KegiatanFactory> */
    use HasFactory;

    protected $table = 'kegiatan';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'latitude' => 'decimal:7',
            'longitude' => 'decimal:7',
            'radius_m' => 'integer',
            'tanggal' => 'date',
            'absensi_buka_at' => 'datetime',
            'absensi_tutup_at' => 'datetime',
            'pendaftaran_dibuka_at' => 'datetime',
            'batas_daftar_at' => 'datetime',
            'kuota' => 'integer',
            'status' => StatusKegiatan::class,
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
     * @return BelongsTo<User, $this>
     */
    public function pembuat(): BelongsTo
    {
        return $this->belongsTo(User::class, 'dibuat_oleh');
    }

    /**
     * @return BelongsToMany<Divisi, $this>
     */
    public function divisiTarget(): BelongsToMany
    {
        return $this->belongsToMany(Divisi::class, 'kegiatan_divisi_target')->withTimestamps();
    }

    /**
     * @return HasMany<KegiatanBobot, $this>
     */
    public function bobot(): HasMany
    {
        return $this->hasMany(KegiatanBobot::class);
    }

    /**
     * @return HasMany<Pendaftaran, $this>
     */
    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }

    /**
     * @return HasManyThrough<Kehadiran, Pendaftaran, $this>
     */
    public function kehadiran(): HasManyThrough
    {
        return $this->hasManyThrough(Kehadiran::class, Pendaftaran::class);
    }

    public function memilikiKehadiranValid(): bool
    {
        return $this->kehadiran()->where('kehadiran.status', StatusKehadiran::Valid)->exists();
    }

    /**
     * @return HasMany<Koreksi, $this>
     */
    public function koreksi(): HasMany
    {
        return $this->hasMany(Koreksi::class);
    }

    /**
     * Penghambat penguncian: kehadiran menunggu tinjau dan koreksi menunggu.
     *
     * @return array{kehadiran_menunggu: int, koreksi_menunggu: int}
     */
    public function penghambatKunci(): array
    {
        return [
            'kehadiran_menunggu' => $this->kehadiran()->where('kehadiran.status', StatusKehadiran::MenungguTinjau)->count(),
            'koreksi_menunggu' => $this->koreksi()->where('status', StatusKoreksi::Menunggu)->count(),
        ];
    }

    /**
     * Scope kegiatan yang sudah terbit / tampil ke anggota.
     *
     * @param  Builder<Kegiatan>  $query
     * @return Builder<Kegiatan>
     */
    public function scopeTerbit(Builder $query): Builder
    {
        return $query->whereIn('status', [
            StatusKegiatan::Terbit,
            StatusKegiatan::Berlangsung,
            StatusKegiatan::Selesai,
            StatusKegiatan::Terkunci,
        ]);
    }

    /**
     * Scope kegiatan tingkat wilayah.
     *
     * @param  Builder<Kegiatan>  $query
     * @return Builder<Kegiatan>
     */
    public function scopeWilayah(Builder $query): Builder
    {
        return $query->whereNull('komsat_id');
    }
}

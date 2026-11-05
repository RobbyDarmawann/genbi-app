<?php

namespace App\Models;

use App\Enums\StatusPenerima;
use Database\Factories\MahasiswaFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int $komsat_id
 * @property int $divisi_id
 * @property string $nim
 * @property string $angkatan
 * @property StatusPenerima $status_penerima
 * @property bool $aktif
 * @property string|null $jenis_kelamin
 * @property string|null $agama
 * @property string|null $golongan_darah
 * @property Carbon|null $tanggal_lahir
 * @property string|null $domisili
 * @property string|null $no_hp
 * @property string|null $foto_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string|null $nama
 */
#[Fillable(['user_id', 'komsat_id', 'divisi_id', 'nim', 'angkatan', 'status_penerima', 'aktif', 'jenis_kelamin', 'agama', 'golongan_darah', 'tanggal_lahir', 'domisili', 'no_hp', 'foto_path'])]
class Mahasiswa extends Model
{
    /** @use HasFactory<MahasiswaFactory> */
    use HasFactory;

    protected $table = 'mahasiswa';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status_penerima' => StatusPenerima::class,
            'aktif' => 'boolean',
            'tanggal_lahir' => 'date',
        ];
    }

    /**
     * Nama mahasiswa diambil dari user terkait.
     */
    public function getNamaAttribute(): ?string
    {
        return $this->user?->name;
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Komsat, $this>
     */
    public function komsat(): BelongsTo
    {
        return $this->belongsTo(Komsat::class);
    }

    /**
     * @return BelongsTo<Divisi, $this>
     */
    public function divisi(): BelongsTo
    {
        return $this->belongsTo(Divisi::class);
    }

    /**
     * @return HasMany<Pendaftaran, $this>
     */
    public function pendaftaran(): HasMany
    {
        return $this->hasMany(Pendaftaran::class);
    }

    /**
     * @return HasMany<PoinTransaksi, $this>
     */
    public function poinTransaksi(): HasMany
    {
        return $this->hasMany(PoinTransaksi::class);
    }

    /**
     * @return HasMany<Koreksi, $this>
     */
    public function koreksi(): HasMany
    {
        return $this->hasMany(Koreksi::class);
    }

    /**
     * @return HasMany<Kepengurusan, $this>
     */
    public function kepengurusan(): HasMany
    {
        return $this->hasMany(Kepengurusan::class);
    }

    /**
     * Total poin dihitung dari akumulasi ledger poin_transaksi.
     */
    public function totalPoin(): int
    {
        return (int) $this->poinTransaksi()->sum('jumlah');
    }

    /**
     * Scope untuk menambahkan total poin sebagai atribut agregat.
     *
     * @param  Builder<Mahasiswa>  $query
     * @return Builder<Mahasiswa>
     */
    public function scopeWithTotalPoin(Builder $query): Builder
    {
        return $query->withSum('poinTransaksi as total_poin', 'jumlah');
    }

    /**
     * Memeriksa apakah divisi yang dipilih konsisten dengan komsat mahasiswa.
     */
    public function isDivisiValidForKomsat(): bool
    {
        if ($this->relationLoaded('divisi') && $this->divisi !== null && $this->divisi->id === $this->divisi_id) {
            return $this->divisi->komsat_id === $this->komsat_id;
        }

        return Divisi::query()
            ->where('id', $this->divisi_id)
            ->where('komsat_id', $this->komsat_id)
            ->exists();
    }

    protected static function booted(): void
    {
        static::saving(function (self $mahasiswa) {
            if ($mahasiswa->komsat_id && $mahasiswa->divisi_id && ! $mahasiswa->isDivisiValidForKomsat()) {
                throw new \InvalidArgumentException('Divisi yang dipilih tidak terdaftar di bawah Komsat mahasiswa tersebut.');
            }
        });
    }

    /**
     * Scope mahasiswa aktif.
     *
     * @param  Builder<Mahasiswa>  $query
     * @return Builder<Mahasiswa>
     */
    public function scopeAktif(Builder $query): Builder
    {
        return $query->where('aktif', true);
    }
}

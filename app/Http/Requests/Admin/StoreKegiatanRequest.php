<?php

namespace App\Http\Requests\Admin;

use App\Enums\StatusKegiatan;
use App\Models\Kegiatan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class StoreKegiatanRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Kegiatan::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merges = [];

        if ($this->has('judul') && is_string($this->input('judul'))) {
            $merges['judul'] = trim($this->input('judul'));
        }

        if ($this->has('lokasi_nama') && is_string($this->input('lokasi_nama'))) {
            $merges['lokasi_nama'] = trim($this->input('lokasi_nama'));
        }

        if (in_array($this->input('komsat_id'), ['', 'wilayah', '0', 0], true)) {
            $merges['komsat_id'] = null;
        }

        foreach (['jam_mulai', 'jam_selesai'] as $timeField) {
            $val = $this->input($timeField);
            if (is_string($val) && strlen($val) >= 5 && preg_match('/^\d{2}:\d{2}:\d{2}$/', $val) === 1) {
                $merges[$timeField] = substr($val, 0, 5);
            }
        }

        foreach (['deskripsi', 'pendaftaran_dibuka_at', 'batas_daftar_at', 'kuota', 'tanggal_selesai'] as $nullableField) {
            if ($this->input($nullableField) === '') {
                $merges[$nullableField] = null;
            }
        }

        $bobot = $this->input('bobot');
        if (is_array($bobot)) {
            foreach (['peserta', 'panitia', 'pemateri'] as $peran) {
                if (array_key_exists($peran, $bobot) && $bobot[$peran] === '') {
                    $bobot[$peran] = null;
                }
            }
            $merges['bobot'] = $bobot;
        }

        if (! $this->has('divisi_ids')) {
            $merges['divisi_ids'] = [];
        }

        $sesiAbsensi = $this->input('sesi_absensi');
        if (is_array($sesiAbsensi) && ! empty($sesiAbsensi)) {
            $sortedSesi = $sesiAbsensi;
            usort($sortedSesi, fn ($a, $b) => strcmp((string) ($a['tanggal'] ?? ''), (string) ($b['tanggal'] ?? '')));
            $first = $sortedSesi[0];
            $last = $sortedSesi[count($sortedSesi) - 1];

            if (! empty($first['tanggal']) && ! empty($first['jam_buka'])) {
                $merges['absensi_buka_at'] = "{$first['tanggal']} {$first['jam_buka']}";
            }
            if (! empty($last['tanggal']) && ! empty($last['jam_tutup'])) {
                $merges['absensi_tutup_at'] = "{$last['tanggal']} {$last['jam_tutup']}";
            }
        }

        if (! empty($merges)) {
            $this->merge($merges);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $statusInput = $this->string('status')->toString();
        $requiresPublishReadiness = ! in_array($statusInput, [
            StatusKegiatan::Draft->value,
            StatusKegiatan::Dibatalkan->value,
        ], true);

        return [
            'judul' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string', 'max:10000'],
            'komsat_id' => ['nullable', 'integer', Rule::exists('komsat', 'id')],
            'lokasi_nama' => ['required', 'string', 'max:255'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'radius_m' => ['required', 'integer', 'between:10,1000'],
            'tanggal' => ['required', 'date_format:Y-m-d'],
            'tanggal_selesai' => ['nullable', 'date_format:Y-m-d', 'after_or_equal:tanggal'],
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i'],
            'absensi_buka_at' => ['required', 'date'],
            'absensi_tutup_at' => ['required', 'date', 'after:absensi_buka_at'],
            'pendaftaran_dibuka_at' => ['nullable', 'date', 'before_or_equal:absensi_tutup_at'],
            'batas_daftar_at' => ['nullable', 'date', 'before_or_equal:absensi_tutup_at'],
            'kuota' => ['nullable', 'integer', 'min:1'],
            'status' => [
                'required',
                Rule::in([StatusKegiatan::Draft->value, StatusKegiatan::Terbit->value]),
            ],
            'sesi_absensi' => ['required', 'array', 'min:1'],
            'sesi_absensi.*.tanggal' => ['required', 'date_format:Y-m-d'],
            'sesi_absensi.*.jam_buka' => ['required', 'date_format:H:i'],
            'sesi_absensi.*.jam_tutup' => ['required', 'date_format:H:i', 'after:sesi_absensi.*.jam_buka'],
            'divisi_ids' => $requiresPublishReadiness ? ['required', 'array', 'min:1'] : ['nullable', 'array'],
            'divisi_ids.*' => ['integer', 'distinct', Rule::exists('divisi', 'id')->where('aktif', true)],
            'bobot' => ['nullable', 'array'],
            'bobot.peserta' => $requiresPublishReadiness
                ? ['required', 'integer', 'min:0', 'max:1000']
                : ['nullable', 'integer', 'min:0', 'max:1000'],
            'bobot.panitia' => ['nullable', 'integer', 'min:0', 'max:1000'],
            'bobot.pemateri' => ['nullable', 'integer', 'min:0', 'max:1000'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($validator->errors()->hasAny([
                    'tanggal',
                    'tanggal_selesai',
                    'jam_mulai',
                    'jam_selesai',
                ])) {
                    return;
                }

                $tanggal = $this->string('tanggal')->toString();
                $tanggalSelesai = $this->string('tanggal_selesai')->toString();
                $jamMulai = $this->string('jam_mulai')->toString();
                $jamSelesai = $this->string('jam_selesai')->toString();

                $mulaiKegiatan = Carbon::parse("{$tanggal} {$jamMulai}");
                $tanggalSelesaiEfektif = $tanggalSelesai ?: $tanggal;
                $selesaiKegiatan = Carbon::parse("{$tanggalSelesaiEfektif} {$jamSelesai}");

                $isSingleDay = ! $tanggalSelesai || $tanggalSelesai === $tanggal;

                if (
                    $isSingleDay
                    && $jamSelesai <= $jamMulai
                ) {
                    $validator->errors()->add(
                        'jam_selesai',
                        'Jam selesai harus setelah jam mulai untuk kegiatan satu hari.'
                    );
                }

                $sesiAbsensi = $this->input('sesi_absensi');
                if (! $validator->errors()->hasAny(['tanggal', 'tanggal_selesai']) && is_array($sesiAbsensi)) {
                    $tanggalMulai = Carbon::parse($tanggal);
                    $tanggalAkhir = Carbon::parse($tanggalSelesaiEfektif);
                    $expectedDates = [];
                    for ($date = $tanggalMulai->copy(); $date->lte($tanggalAkhir); $date->addDay()) {
                        $expectedDates[] = $date->toDateString();
                    }

                    $sesiDates = array_map(fn ($sesi) => is_array($sesi) ? ($sesi['tanggal'] ?? null) : null, $sesiAbsensi);
                    $sesiDates = array_filter($sesiDates);

                    sort($expectedDates);
                    sort($sesiDates);

                    if ($expectedDates !== $sesiDates) {
                        $validator->errors()->add(
                            'sesi_absensi',
                            'Sesi absensi harus mencakup tepat semua hari dari tanggal mulai hingga tanggal selesai kegiatan, tanpa kurang atau lebih.'
                        );
                    }
                }

                if ($this->filled('pendaftaran_dibuka_at') && $this->filled('batas_daftar_at')) {
                    $bukaDaftar = Carbon::parse($this->string('pendaftaran_dibuka_at')->toString());
                    $batasDaftar = Carbon::parse($this->string('batas_daftar_at')->toString());

                    if ($batasDaftar->lt($bukaDaftar)) {
                        $validator->errors()->add(
                            'batas_daftar_at',
                            'Batas akhir pendaftaran harus setelah waktu pendaftaran dibuka.'
                        );
                    }
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'judul.required' => 'Judul kegiatan wajib diisi.',
            'lokasi_nama.required' => 'Nama lokasi pelaksanaan wajib diisi.',
            'latitude.between' => 'Latitude harus berada pada rentang -90 hingga 90.',
            'longitude.between' => 'Longitude harus berada pada rentang -180 hingga 180.',
            'radius_m.between' => 'Radius geofence harus berada antara 10 sampai 1.000 meter.',
            'tanggal_selesai.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai kegiatan.',
            'jam_selesai.after' => 'Jam selesai kegiatan harus setelah jam mulai.',
            'sesi_absensi.required' => 'Jadwal sesi absensi per hari wajib diisi.',
            'sesi_absensi.array' => 'Jadwal sesi absensi per hari harus berupa daftar.',
            'sesi_absensi.min' => 'Minimal satu sesi absensi per hari wajib diisi.',
            'sesi_absensi.*.tanggal.required' => 'Tanggal sesi absensi wajib diisi.',
            'sesi_absensi.*.jam_buka.required' => 'Jam buka absensi wajib diisi.',
            'sesi_absensi.*.jam_tutup.required' => 'Jam tutup absensi wajib diisi.',
            'sesi_absensi.*.jam_tutup.after' => 'Jam tutup absensi harus setelah jam buka absensi.',
            'absensi_tutup_at.after' => 'Waktu tutup absensi harus setelah waktu buka absensi.',
            'batas_daftar_at.before_or_equal' => 'Batas pendaftaran tidak boleh melewati waktu tutup absensi.',
            'pendaftaran_dibuka_at.before_or_equal' => 'Waktu buka pendaftaran tidak boleh melewati waktu tutup absensi.',
            'kuota.min' => 'Kuota peserta harus bernilai positif (minimal 1).',
            'status.in' => 'Kegiatan baru hanya dapat disimpan sebagai Draf atau Terbit.',
            'divisi_ids.required' => 'Minimal satu divisi target wajib dipilih sebelum kegiatan diterbitkan.',
            'divisi_ids.min' => 'Minimal satu divisi target wajib dipilih sebelum kegiatan diterbitkan.',
            'divisi_ids.*.exists' => 'Salah satu divisi target tidak valid atau sudah nonaktif.',
            'bobot.peserta.required' => 'Bobot poin untuk peran Peserta wajib diatur sebelum kegiatan diterbitkan.',
            'bobot.peserta.min' => 'Bobot poin peserta minimal 0.',
            'bobot.panitia.min' => 'Bobot poin panitia minimal 0.',
            'bobot.pemateri.min' => 'Bobot poin pemateri minimal 0.',
        ];
    }
}

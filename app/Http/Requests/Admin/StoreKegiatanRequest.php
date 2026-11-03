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

        foreach (['deskripsi', 'pendaftaran_dibuka_at', 'batas_daftar_at', 'kuota'] as $nullableField) {
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
            'jam_mulai' => ['required', 'date_format:H:i'],
            'jam_selesai' => ['required', 'date_format:H:i', 'after:jam_mulai'],
            'absensi_buka_at' => ['required', 'date'],
            'absensi_tutup_at' => ['required', 'date', 'after:absensi_buka_at'],
            'pendaftaran_dibuka_at' => ['nullable', 'date', 'before_or_equal:absensi_tutup_at'],
            'batas_daftar_at' => ['nullable', 'date', 'before_or_equal:absensi_tutup_at'],
            'kuota' => ['nullable', 'integer', 'min:1'],
            'status' => [
                'required',
                Rule::in([StatusKegiatan::Draft->value, StatusKegiatan::Terbit->value]),
            ],
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
                if ($validator->errors()->isNotEmpty()) {
                    return;
                }

                $tanggal = $this->string('tanggal')->toString();
                $jamMulai = $this->string('jam_mulai')->toString();
                $jamSelesai = $this->string('jam_selesai')->toString();

                $mulaiKegiatan = Carbon::parse("{$tanggal} {$jamMulai}");
                $selesaiKegiatan = Carbon::parse("{$tanggal} {$jamSelesai}");
                $absensiBuka = Carbon::parse($this->string('absensi_buka_at')->toString());
                $absensiTutup = Carbon::parse($this->string('absensi_tutup_at')->toString());

                if ($absensiBuka->lt($mulaiKegiatan->copy()->subHours(12)) || $absensiBuka->gt($selesaiKegiatan)) {
                    $validator->errors()->add(
                        'absensi_buka_at',
                        'Waktu buka absensi harus berada dalam rentang logis pelaksanaan kegiatan (maksimal 12 jam sebelum jam mulai hingga jam selesai).'
                    );
                }

                if ($absensiTutup->gt($selesaiKegiatan->copy()->addHours(12))) {
                    $validator->errors()->add(
                        'absensi_tutup_at',
                        'Waktu tutup absensi tidak boleh melewati 12 jam setelah kegiatan selesai.'
                    );
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
            'jam_selesai.after' => 'Jam selesai kegiatan harus setelah jam mulai.',
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

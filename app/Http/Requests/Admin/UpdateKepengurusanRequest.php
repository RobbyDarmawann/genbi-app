<?php

namespace App\Http\Requests\Admin;

use App\Models\Kepengurusan;
use App\Models\Mahasiswa;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateKepengurusanRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Kepengurusan|null $kepengurusan */
        $kepengurusan = $this->route('kepengurusan');

        return $kepengurusan !== null && ($this->user()?->can('update', $kepengurusan) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $merges = [];

        if ($this->has('nama_tampil') && is_string($this->input('nama_tampil'))) {
            $merges['nama_tampil'] = trim($this->input('nama_tampil'));
        }

        if ($this->has('jabatan') && is_string($this->input('jabatan'))) {
            $merges['jabatan'] = trim($this->input('jabatan'));
        }

        if (in_array($this->input('komsat_id'), ['', 'wilayah', '0', 0, null], true)) {
            $merges['komsat_id'] = null;
        }

        if ($this->input('mahasiswa_id') === '' || $this->input('mahasiswa_id') === 0 || $this->input('mahasiswa_id') === '0') {
            $merges['mahasiswa_id'] = null;
        }

        $rawMahasiswaId = $merges['mahasiswa_id'] ?? $this->input('mahasiswa_id');
        if (is_numeric($rawMahasiswaId) && (int) $rawMahasiswaId > 0 && empty($merges['nama_tampil'])) {
            $m = Mahasiswa::with('user:id,name')->whereKey((int) $rawMahasiswaId)->first();
            if ($m?->user?->name) {
                $merges['nama_tampil'] = $m->user->name;
            }
        }

        if ($this->input('kontak') === '') {
            $merges['kontak'] = null;
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
        return [
            'periode_id' => ['required', 'integer', Rule::exists('periode', 'id')],
            'komsat_id' => ['nullable', 'integer', Rule::exists('komsat', 'id')->where('aktif', true)],
            'mahasiswa_id' => ['nullable', 'integer', Rule::exists('mahasiswa', 'id')],
            'nama_tampil' => ['required', 'string', 'max:255'],
            'jabatan' => ['required', 'string', 'max:255'],
            'urutan' => ['required', 'integer', 'min:0', 'max:1000'],
            'kontak' => ['nullable', 'string', 'max:255'],
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

                /** @var Kepengurusan|null $kepengurusan */
                $kepengurusan = $this->route('kepengurusan');
                $periodeId = $this->input('periode_id');
                $komsatId = $this->input('komsat_id');
                $namaTampil = $this->input('nama_tampil');
                $jabatan = $this->input('jabatan');

                $exists = Kepengurusan::where('periode_id', $periodeId)
                    ->when($komsatId !== null, fn ($q) => $q->where('komsat_id', $komsatId), fn ($q) => $q->whereNull('komsat_id'))
                    ->where('nama_tampil', $namaTampil)
                    ->where('jabatan', $jabatan)
                    ->when($kepengurusan !== null, fn ($q) => $q->where('id', '!=', $kepengurusan->id))
                    ->exists();

                if ($exists) {
                    $validator->errors()->add(
                        'nama_tampil',
                        'Pengurus dengan nama dan jabatan yang sama pada lingkup periode ini sudah terdaftar.'
                    );
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
            'periode_id.required' => 'Periode wajib dipilih.',
            'periode_id.exists' => 'Periode yang dipilih tidak valid.',
            'komsat_id.exists' => 'Komsat yang dipilih tidak valid atau sudah nonaktif.',
            'mahasiswa_id.exists' => 'Mahasiswa yang dipilih tidak ditemukan.',
            'nama_tampil.required' => 'Nama tampil wajib diisi.',
            'nama_tampil.max' => 'Nama tampil maksimal 255 karakter.',
            'jabatan.required' => 'Jabatan wajib diisi.',
            'jabatan.max' => 'Jabatan maksimal 255 karakter.',
            'urutan.required' => 'Urutan tampil wajib diisi.',
            'urutan.min' => 'Urutan tampil tidak boleh bernilai negatif.',
            'urutan.max' => 'Urutan tampil maksimal 1000.',
            'kontak.max' => 'Kontak maksimal 255 karakter.',
        ];
    }
}

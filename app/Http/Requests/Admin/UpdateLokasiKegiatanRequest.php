<?php

namespace App\Http\Requests\Admin;

use App\Models\LokasiKegiatan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateLokasiKegiatanRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var LokasiKegiatan|null $lokasi */
        $lokasi = $this->route('lokasi');

        return $lokasi !== null && ($this->user()?->can('update', $lokasi) ?? false);
    }

    protected function prepareForValidation(): void
    {
        if (is_string($this->input('nama'))) {
            $this->merge(['nama' => trim($this->input('nama'))]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var LokasiKegiatan $lokasi */
        $lokasi = $this->route('lokasi');

        return [
            'nama' => ['required', 'string', 'max:255', Rule::unique('lokasi_kegiatan', 'nama')->ignore($lokasi->id)],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'radius_m' => ['required', 'integer', 'between:10,1000'],
            'keterangan' => ['nullable', 'string', 'max:1000'],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama lokasi wajib diisi.',
            'nama.unique' => 'Nama lokasi sudah digunakan.',
            'latitude.required' => 'Titik lokasi pada peta wajib dipilih.',
            'latitude.between' => 'Latitude harus berada pada rentang -90 hingga 90.',
            'longitude.required' => 'Titik lokasi pada peta wajib dipilih.',
            'longitude.between' => 'Longitude harus berada pada rentang -180 hingga 180.',
            'radius_m.between' => 'Radius geofence harus berada antara 10 sampai 1.000 meter.',
        ];
    }
}

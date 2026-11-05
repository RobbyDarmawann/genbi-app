<?php

namespace App\Http\Requests\Mahasiswa;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBiodataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->mahasiswa !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'jenis_kelamin' => ['nullable', Rule::in(['Laki-laki', 'Perempuan'])],
            'agama' => ['nullable', Rule::in(['Islam', 'Kristen Protestan', 'Kristen Katolik', 'Hindu', 'Buddha', 'Konghucu', 'Lainnya'])],
            'golongan_darah' => ['nullable', Rule::in(['A', 'B', 'AB', 'O'])],
            'tanggal_lahir' => ['nullable', 'date', 'before:today'],
            'domisili' => ['nullable', 'string', 'max:255'],
            'no_hp' => ['nullable', 'digits_between:9,15'],
            'foto' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
            'hapus_foto' => ['nullable', 'boolean'],
        ];
    }
}

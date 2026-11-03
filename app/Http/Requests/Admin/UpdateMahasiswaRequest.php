<?php

namespace App\Http\Requests\Admin;

use App\Enums\StatusPenerima;
use App\Models\Mahasiswa;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Mahasiswa|null $mahasiswa */
        $mahasiswa = $this->route('mahasiswa');

        return $mahasiswa !== null && ($this->user()?->can('update', $mahasiswa) ?? false);
    }

    protected function prepareForValidation(): void
    {
        $merges = [];

        foreach (['name', 'username', 'nim', 'angkatan'] as $field) {
            if ($this->has($field) && is_string($this->input($field))) {
                $merges[$field] = trim($this->input($field));
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
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $this->route('mahasiswa');
        $komsatId = $this->input('komsat_id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-Z0-9._-]+$/',
                Rule::unique('users', 'username')->ignore($mahasiswa->user_id),
            ],
            'nim' => [
                'required',
                'string',
                'max:30',
                Rule::unique('mahasiswa', 'nim')->ignore($mahasiswa->id),
            ],
            'komsat_id' => ['required', 'integer', Rule::exists('komsat', 'id')],
            'divisi_id' => [
                'required',
                'integer',
                Rule::exists('divisi', 'id')->where(function ($query) use ($komsatId, $mahasiswa): void {
                    $query->where('komsat_id', $komsatId);

                    if ((int) $this->input('divisi_id') !== $mahasiswa->divisi_id) {
                        $query->where('aktif', true);
                    }
                }),
            ],
            'angkatan' => ['required', 'string', 'size:4', 'regex:/^[0-9]{4}$/'],
            'status_penerima' => ['required', Rule::enum(StatusPenerima::class)],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'username.unique' => 'Username sudah digunakan oleh akun lain.',
            'username.regex' => 'Username hanya boleh memuat huruf, angka, titik, strip, dan garis bawah.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'komsat_id.required' => 'Komisariat wajib dipilih.',
            'komsat_id.exists' => 'Komisariat yang dipilih tidak valid.',
            'divisi_id.required' => 'Divisi wajib dipilih.',
            'divisi_id.exists' => 'Divisi tidak terdaftar di bawah komisariat terpilih.',
            'angkatan.size' => 'Tahun angkatan harus berupa 4 digit angka tahun.',
            'angkatan.regex' => 'Tahun angkatan harus berupa 4 digit angka tahun.',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Enums\StatusPenerima;
use App\Models\Mahasiswa;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class StoreMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Mahasiswa::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        $merges = [];

        if ($this->has('name') && is_string($this->input('name'))) {
            $merges['name'] = trim($this->input('name'));
        }

        if ($this->has('username') && is_string($this->input('username'))) {
            $merges['username'] = trim($this->input('username'));
        }

        if ($this->has('nim') && is_string($this->input('nim'))) {
            $merges['nim'] = trim($this->input('nim'));
        }

        if ($this->has('angkatan') && is_string($this->input('angkatan'))) {
            $merges['angkatan'] = trim($this->input('angkatan'));
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
        $komsatId = $this->input('komsat_id');

        return [
            'name' => ['required', 'string', 'max:255'],
            'username' => [
                'required',
                'string',
                'min:3',
                'max:50',
                'regex:/^[a-zA-Z0-9._-]+$/',
                Rule::unique('users', 'username'),
            ],
            'password' => [
                'required',
                'string',
                Password::default(),
                'confirmed',
            ],
            'nim' => [
                'required',
                'string',
                'max:30',
                Rule::unique('mahasiswa', 'nim'),
            ],
            'komsat_id' => [
                'required',
                'integer',
                Rule::exists('komsat', 'id'),
            ],
            'divisi_id' => [
                'required',
                'integer',
                Rule::exists('divisi', 'id')
                    ->where('komsat_id', $komsatId)
                    ->where('aktif', true),
            ],
            'angkatan' => [
                'required',
                'string',
                'size:4',
                'regex:/^[0-9]{4}$/',
            ],
            'status_penerima' => [
                'required',
                Rule::enum(StatusPenerima::class),
            ],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama lengkap mahasiswa wajib diisi.',
            'username.required' => 'Username login wajib diisi.',
            'username.unique' => 'Username sudah digunakan oleh akun lain.',
            'username.regex' => 'Username hanya boleh memuat huruf, angka, titik, strip, dan garis bawah.',
            'password.required' => 'Password awal wajib diisi.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
            'nim.required' => 'NIM wajib diisi.',
            'nim.unique' => 'NIM sudah terdaftar.',
            'komsat_id.required' => 'Komisariat wajib dipilih.',
            'komsat_id.exists' => 'Komisariat yang dipilih tidak valid.',
            'divisi_id.required' => 'Divisi wajib dipilih.',
            'divisi_id.exists' => 'Divisi tidak terdaftar di bawah komisariat terpilih.',
            'angkatan.required' => 'Tahun angkatan wajib diisi.',
            'angkatan.size' => 'Tahun angkatan harus berupa 4 digit angka tahun (contoh: 2024).',
            'angkatan.regex' => 'Tahun angkatan harus berupa 4 digit angka tahun (contoh: 2024).',
            'status_penerima.required' => 'Status penerima beasiswa wajib dipilih.',
        ];
    }
}

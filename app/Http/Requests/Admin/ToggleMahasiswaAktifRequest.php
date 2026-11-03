<?php

namespace App\Http\Requests\Admin;

use App\Models\Mahasiswa;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ToggleMahasiswaAktifRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Mahasiswa|null $mahasiswa */
        $mahasiswa = $this->route('mahasiswa');

        return $mahasiswa !== null && ($this->user()?->can('update', $mahasiswa) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'aktif' => ['required', 'boolean'],
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Models\Komsat;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKomsatRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Komsat|null $komsat */
        $komsat = $this->route('komsat');

        return $komsat !== null && ($this->user()?->can('update', $komsat) ?? false);
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('kode') && is_string($this->input('kode'))) {
            $this->merge([
                'kode' => strtoupper(trim($this->input('kode'))),
            ]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Komsat $komsat */
        $komsat = $this->route('komsat');

        return [
            'kode' => ['required', 'string', 'max:10', 'alpha_num:ascii', Rule::unique('komsat', 'kode')->ignore($komsat->id)],
            'nama' => ['required', 'string', 'max:255'],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'kode.required' => 'Kode komisariat wajib diisi.',
            'kode.max' => 'Kode komisariat maksimal 10 karakter.',
            'kode.alpha_num' => 'Kode komisariat hanya boleh berisi huruf dan angka.',
            'kode.unique' => 'Kode komisariat sudah digunakan.',
            'nama.required' => 'Nama perguruan tinggi wajib diisi.',
        ];
    }
}

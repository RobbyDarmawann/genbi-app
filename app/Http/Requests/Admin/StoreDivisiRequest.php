<?php

namespace App\Http\Requests\Admin;

use App\Models\Divisi;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDivisiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Divisi::class) ?? false;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('nama') && is_string($this->input('nama'))) {
            $this->merge([
                'nama' => trim($this->input('nama')),
            ]);
        }
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'komsat_id' => ['required', 'integer', Rule::exists('komsat', 'id')],
            'nama' => [
                'required',
                'string',
                'max:255',
                Rule::unique('divisi', 'nama')->where('komsat_id', $this->input('komsat_id')),
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
            'komsat_id.required' => 'Komisariat wajib dipilih.',
            'komsat_id.exists' => 'Komisariat yang dipilih tidak valid.',
            'nama.required' => 'Nama divisi wajib diisi.',
            'nama.unique' => 'Nama divisi sudah ada pada komisariat ini.',
        ];
    }
}

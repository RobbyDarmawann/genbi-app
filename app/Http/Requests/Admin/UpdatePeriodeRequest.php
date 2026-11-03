<?php

namespace App\Http\Requests\Admin;

use App\Models\Periode;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePeriodeRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Periode|null $periode */
        $periode = $this->route('periode');

        return $periode !== null && ($this->user()?->can('update', $periode) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Periode $periode */
        $periode = $this->route('periode');

        return [
            'nama' => ['required', 'string', 'max:255', Rule::unique('periode', 'nama')->ignore($periode->id)],
            'tanggal_mulai' => ['required', 'date'],
            'tanggal_selesai' => ['required', 'date', 'after_or_equal:tanggal_mulai'],
            'aktif' => ['sometimes', 'boolean'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nama.required' => 'Nama periode wajib diisi.',
            'nama.unique' => 'Nama periode sudah terdaftar.',
            'tanggal_mulai.required' => 'Tanggal mulai wajib diisi.',
            'tanggal_mulai.date' => 'Format tanggal mulai tidak valid.',
            'tanggal_selesai.required' => 'Tanggal selesai wajib diisi.',
            'tanggal_selesai.date' => 'Format tanggal selesai tidak valid.',
            'tanggal_selesai.after_or_equal' => 'Tanggal selesai tidak boleh sebelum tanggal mulai.',
        ];
    }
}

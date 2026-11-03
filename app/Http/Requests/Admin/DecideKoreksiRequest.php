<?php

namespace App\Http\Requests\Admin;

use App\Models\Koreksi;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DecideKoreksiRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Koreksi $koreksi */
        $koreksi = $this->route('koreksi');

        return $this->user()?->can('process', $koreksi) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'keputusan' => ['required', 'in:setujui,tolak'],
            'catatan_proses' => ['nullable', 'string', 'max:3000', 'required_if:keputusan,tolak'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'catatan_proses.required_if' => 'Catatan wajib diisi saat menolak koreksi.',
        ];
    }
}

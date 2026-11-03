<?php

namespace App\Http\Requests\Admin;

use App\Models\Pendaftaran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BatalkanPendaftaranRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Pendaftaran $pendaftaran */
        $pendaftaran = $this->route('pendaftaran');

        return $this->user()?->can('adminCancel', $pendaftaran) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'alasan' => ['required', 'string', 'min:5', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'alasan.required' => 'Alasan pembatalan wajib diisi.',
            'alasan.min' => 'Alasan pembatalan minimal 5 karakter.',
        ];
    }
}

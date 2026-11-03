<?php

namespace App\Http\Requests\Admin;

use App\Enums\PeranKegiatan;
use App\Models\Pendaftaran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UbahPeranPendaftarRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Pendaftaran $pendaftaran */
        $pendaftaran = $this->route('pendaftaran');

        return $this->user()?->can('changeRole', $pendaftaran) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'peran' => ['required', Rule::enum(PeranKegiatan::class)],
        ];
    }
}

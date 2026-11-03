<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class ToggleMasterDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        $resource = $this->route('periode') ?? $this->route('komsat') ?? $this->route('divisi');

        return $resource !== null && ($this->user()?->can('update', $resource) ?? false);
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

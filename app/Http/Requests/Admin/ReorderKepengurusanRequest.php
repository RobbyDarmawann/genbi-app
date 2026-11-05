<?php

namespace App\Http\Requests\Admin;

use App\Models\Kepengurusan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ReorderKepengurusanRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Kepengurusan|null $kepengurusan */
        $kepengurusan = $this->route('kepengurusan');

        return $kepengurusan !== null && ($this->user()?->can('update', $kepengurusan) ?? false);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'direction' => ['required', 'string', Rule::in(['up', 'down'])],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'direction.required' => 'Arah pemindahan urutan wajib dipilih.',
            'direction.in' => 'Arah pemindahan urutan harus berupa naik (up) atau turun (down).',
        ];
    }
}

<?php

namespace App\Http\Requests\Admin;

use App\Enums\StatusKegiatan;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\In;

class FilterRekapRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->hasRole('internal_manajemen') ?? false;
    }

    /**
     * @return array<string, array<int, string|In>>
     */
    public function rules(): array
    {
        return [
            'periode_id' => ['nullable', 'string'],
            'mulai' => ['nullable', 'date'],
            'akhir' => ['nullable', 'date', 'after_or_equal:mulai'],
            'komsat_id' => ['nullable', 'string'],
            'divisi_id' => ['nullable', 'string'],
            'status' => ['nullable', 'string', Rule::in(['all', ...array_column(StatusKegiatan::cases(), 'value')])],
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated();

        return [
            'periode_id' => $validated['periode_id'] ?? 'all',
            'mulai' => $validated['mulai'] ?? null,
            'akhir' => $validated['akhir'] ?? null,
            'komsat_id' => $validated['komsat_id'] ?? 'all',
            'divisi_id' => $validated['divisi_id'] ?? 'all',
            'status' => $validated['status'] ?? 'all',
        ];
    }
}

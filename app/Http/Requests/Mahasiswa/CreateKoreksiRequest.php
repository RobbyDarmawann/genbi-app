<?php

namespace App\Http\Requests\Mahasiswa;

use App\Enums\JenisKoreksi;
use App\Models\Koreksi;
use App\Models\Pendaftaran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class CreateKoreksiRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('create', Koreksi::class) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'pendaftaran_id' => ['required', 'integer', 'exists:pendaftaran,id'],
            'jenis' => ['required', new Enum(JenisKoreksi::class)],
            'alasan' => ['required', 'string', 'min:10', 'max:3000'],
            'bukti' => ['nullable', 'file', 'mimes:jpg,jpeg,png,pdf', 'max:5120'],
        ];
    }

    protected function passedValidation(): void
    {
        /** @var Pendaftaran $pendaftaran */
        $pendaftaran = Pendaftaran::query()->findOrFail($this->integer('pendaftaran_id'));
        abort_unless($pendaftaran->mahasiswa_id === $this->user()?->mahasiswa?->id, 404);
    }
}

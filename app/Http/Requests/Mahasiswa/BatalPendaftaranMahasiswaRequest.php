<?php

namespace App\Http\Requests\Mahasiswa;

use App\Models\Kegiatan;
use App\Models\Pendaftaran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class BatalPendaftaranMahasiswaRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Kegiatan $kegiatan */
        $kegiatan = $this->route('kegiatan');

        return $this->user()?->can('cancelOnKegiatan', [Pendaftaran::class, $kegiatan]) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [];
    }
}

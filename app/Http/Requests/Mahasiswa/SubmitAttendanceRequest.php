<?php

namespace App\Http\Requests\Mahasiswa;

use App\Models\Kegiatan;
use App\Models\Kehadiran;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SubmitAttendanceRequest extends FormRequest
{
    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'akurasi_m' => ['required', 'numeric', 'min:0', 'max:50000'],
            'foto' => ['required', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
            'status' => ['prohibited'],
            'jarak_m' => ['prohibited'],
            'waktu_checkin' => ['prohibited'],
            'mahasiswa_id' => ['prohibited'],
            'pendaftaran_id' => ['prohibited'],
            'peran' => ['prohibited'],
            'poin' => ['prohibited'],
            'sumber' => ['prohibited'],
        ];
    }

    public function authorize(): bool
    {
        /** @var Kegiatan $kegiatan */
        $kegiatan = $this->route('kegiatan');

        return $this->user()?->can('submit', [Kehadiran::class, $kegiatan]) ?? false;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'latitude.required' => 'Koordinat lokasi wajib diisi.',
            'longitude.required' => 'Koordinat lokasi wajib diisi.',
            'latitude.between' => 'Koordinat latitude tidak valid.',
            'longitude.between' => 'Koordinat longitude tidak valid.',
            'akurasi_m.required' => 'Akurasi GPS wajib diisi.',
            'akurasi_m.numeric' => 'Akurasi GPS harus berupa angka.',
            'foto.required' => 'Foto selfie wajib diunggah.',
            'foto.file' => 'Foto harus berupa file.',
            'foto.image' => 'Foto harus berupa gambar.',
            'foto.mimes' => 'Foto harus berformat JPG, JPEG, PNG, atau WebP.',
            'foto.max' => 'Ukuran foto maksimal 2 MB.',
        ];
    }
}

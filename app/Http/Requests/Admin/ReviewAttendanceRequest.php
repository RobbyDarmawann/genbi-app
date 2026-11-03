<?php

namespace App\Http\Requests\Admin;

use App\Models\Kehadiran;
use Illuminate\Foundation\Http\FormRequest;

class ReviewAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Kehadiran $kehadiran */
        $kehadiran = $this->route('kehadiran');

        return $this->user()?->can('review', $kehadiran) ?? false;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', 'string', 'in:valid,ditolak'],
            'alasan' => ['nullable', 'string', 'required_if:status,ditolak', 'max:500'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Keputusan peninjauan wajib dipilih.',
            'status.in' => 'Keputusan peninjauan harus disetujui (valid) atau ditolak.',
            'alasan.required_if' => 'Alasan penolakan wajib diisi bila kehadiran ditolak.',
            'alasan.max' => 'Alasan penolakan maksimal 500 karakter.',
        ];
    }
}

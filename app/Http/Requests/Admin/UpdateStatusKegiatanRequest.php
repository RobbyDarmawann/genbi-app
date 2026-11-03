<?php

namespace App\Http\Requests\Admin;

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Models\Kegiatan;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

class UpdateStatusKegiatanRequest extends FormRequest
{
    public function authorize(): bool
    {
        /** @var Kegiatan $kegiatan */
        $kegiatan = $this->route('kegiatan');

        return $this->user()?->can('changeStatus', $kegiatan) ?? false;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(StatusKegiatan::class)],
            'alasan' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                /** @var Kegiatan $kegiatan */
                $kegiatan = $this->route('kegiatan');

                if ($kegiatan->status === StatusKegiatan::Terkunci) {
                    $validator->errors()->add(
                        'status',
                        'Kegiatan telah terkunci dan statusnya tidak dapat diubah lagi.'
                    );

                    return;
                }

                $targetStatus = StatusKegiatan::from($this->string('status')->toString());

                if (! $kegiatan->status->canTransitionTo($targetStatus)) {
                    $validator->errors()->add(
                        'status',
                        sprintf(
                            'Perubahan status dari %s ke %s tidak diizinkan oleh alur kerja kegiatan.',
                            $kegiatan->status->label(),
                            $targetStatus->label(),
                        )
                    );

                    return;
                }

                if ($targetStatus === StatusKegiatan::Terbit) {
                    if ($kegiatan->divisiTarget()->count() < 1) {
                        $validator->errors()->add(
                            'status',
                            'Kegiatan tidak dapat diterbitkan karena belum memiliki divisi target.'
                        );
                    }

                    $hasPesertaBobot = $kegiatan->bobot()
                        ->where('peran', PeranKegiatan::Peserta)
                        ->exists();

                    if (! $hasPesertaBobot) {
                        $validator->errors()->add(
                            'status',
                            'Kegiatan tidak dapat diterbitkan karena bobot poin peserta belum diatur.'
                        );
                    }
                }

                if ($targetStatus === StatusKegiatan::Terkunci) {
                    $penghambat = $kegiatan->penghambatKunci();
                    if ($penghambat['kehadiran_menunggu'] > 0 || $penghambat['koreksi_menunggu'] > 0) {
                        $validator->errors()->add(
                            'status',
                            sprintf(
                                'Kegiatan belum dapat dikunci: %d kehadiran menunggu tinjau dan %d koreksi menunggu.',
                                $penghambat['kehadiran_menunggu'],
                                $penghambat['koreksi_menunggu'],
                            )
                        );
                    }
                }
            },
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'status.required' => 'Status baru kegiatan wajib dipilih.',
        ];
    }
}

<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Actions\Kehadiran\SubmitAttendanceAction;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\SubmitAttendanceRequest;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class AbsensiController extends Controller
{
    public function create(Request $request, Kegiatan $kegiatan): Response
    {
        Gate::authorize('submit', [Kehadiran::class, $kegiatan]);

        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $pendaftaran = $kegiatan->pendaftaran()
            ->with(['kehadiran.poinTransaksi', 'mahasiswa'])
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        abort_unless(
            $pendaftaran !== null && $pendaftaran->status === StatusPendaftaran::Terdaftar,
            403,
            'Halaman absensi hanya dapat dibuka untuk pendaftaran aktif Anda.'
        );

        $kegiatan->load(['komsat:id,kode,nama', 'bobot', 'sesiAbsensi']);
        $matchedBobot = $kegiatan->bobot->firstWhere('peran', $pendaftaran->peran);
        $bobotPoin = $matchedBobot !== null ? (int) $matchedBobot->poin : 0;

        $today = now(config('app.timezone'))->toDateString();
        $sesiHariIni = $kegiatan->sesiAbsensi->firstWhere('tanggal', $today);

        $existingKehadiran = $pendaftaran->kehadiran
            ->first(fn ($k) => $k->tanggal->toDateString() === $today);
        $existingPoin = $existingKehadiran?->poinTransaksi;

        $sesiHariIniData = $sesiHariIni === null ? null : [
            'id' => $sesiHariIni->id,
            'tanggal' => $sesiHariIni->tanggal->toDateString(),
            'jam_buka' => substr($sesiHariIni->jam_buka, 0, 5),
            'jam_tutup' => substr($sesiHariIni->jam_tutup, 0, 5),
            'buka_at' => $sesiHariIni->bukaAt()->toIso8601String(),
            'tutup_at' => $sesiHariIni->tutupAt()->toIso8601String(),
        ];

        return Inertia::render('mahasiswa/kehadiran/checkin', [
            'kegiatan' => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'tanggal' => $kegiatan->tanggal->toDateString(),
                'tanggal_selesai' => $kegiatan->tanggal_selesai?->toDateString(),
                'jam_mulai' => substr($kegiatan->jam_mulai, 0, 5),
                'jam_selesai' => substr($kegiatan->jam_selesai, 0, 5),
                'lokasi_nama' => $kegiatan->lokasi_nama,
                'absensi_buka_at' => $kegiatan->absensi_buka_at->toIso8601String(),
                'absensi_tutup_at' => $kegiatan->absensi_tutup_at->toIso8601String(),
                'status' => $kegiatan->statusEfektif()->value,
                'status_label' => $kegiatan->statusEfektifLabel(),
                'radius_m' => $kegiatan->radius_m,
                'bobot_poin' => $bobotPoin,
                'sesi_hari_ini' => $sesiHariIniData,
            ],
            'pendaftaran' => [
                'id' => $pendaftaran->id,
                'status' => $pendaftaran->status->value,
                'status_label' => $pendaftaran->status->label(),
                'peran_label' => $pendaftaran->peran->label(),
                'kehadiran' => $existingKehadiran === null ? null : [
                    'id' => $existingKehadiran->id,
                    'status' => $existingKehadiran->status->value,
                    'status_label' => $existingKehadiran->status->label(),
                    'alasan' => $existingKehadiran->alasan_penolakan,
                    'jarak_m' => (float) $existingKehadiran->jarak_m,
                    'akurasi_m' => (float) $existingKehadiran->akurasi_m,
                    'waktu_checkin' => $existingKehadiran->waktu_checkin->toIso8601String(),
                    'poin' => $existingKehadiran->status === StatusKehadiran::Valid
                        ? ($existingPoin !== null ? (int) $existingPoin->jumlah : $bobotPoin)
                        : 0,
                ],
            ],
        ]);
    }

    public function store(SubmitAttendanceRequest $request, Kegiatan $kegiatan, SubmitAttendanceAction $action): RedirectResponse
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $kehadiran = $action->handle(
            kegiatan: $kegiatan,
            mahasiswa: $mahasiswa,
            latitude: (float) $request->validated('latitude'),
            longitude: (float) $request->validated('longitude'),
            accuracy: (float) $request->validated('akurasi_m'),
            foto: $request->file('foto'),
            actor: $user,
            ipAddress: $request->ip(),
        );

        $poinTransaksi = $kehadiran->poinTransaksi;
        $poin = $kehadiran->status === StatusKehadiran::Valid && $poinTransaksi !== null
            ? (int) $poinTransaksi->jumlah
            : 0;

        if ($kehadiran->status === StatusKehadiran::Valid) {
            Inertia::flash('toast', [
                'type' => 'success',
                'message' => "Absensi berhasil. Poin +{$poin} telah ditambahkan.",
            ]);
        } elseif ($kehadiran->status === StatusKehadiran::MenungguTinjau) {
            Inertia::flash('toast', [
                'type' => 'warning',
                'message' => 'Absensi tercatat dan menunggu peninjauan Internal Manajemen.',
            ]);
        } else {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => $kehadiran->alasan_penolakan ?? 'Absensi ditolak karena lokasi di luar radius kegiatan.',
            ]);
        }

        return to_route('mahasiswa.absensi.form', $kegiatan);
    }
}

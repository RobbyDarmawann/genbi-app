<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Actions\Koreksi\CreateCorrection;
use App\Enums\JenisKoreksi;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\CreateKoreksiRequest;
use App\Models\Koreksi;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KoreksiController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Koreksi::class);

        /** @var User $user */
        $user = $request->user();
        $mahasiswa = $user->mahasiswa;

        $koreksi = Koreksi::query()
            ->with(['kegiatan', 'pendaftaran'])
            ->where('mahasiswa_id', $mahasiswa?->id)
            ->latest()
            ->paginate(15)
            ->withQueryString();

        $pendaftaran = Pendaftaran::query()
            ->with('kegiatan')
            ->where('mahasiswa_id', $mahasiswa?->id)
            ->latest()
            ->get();

        return Inertia::render('mahasiswa/koreksi/index', [
            'koreksi' => $koreksi,
            'pendaftaran' => $pendaftaran,
            'jenis_options' => array_map(fn (JenisKoreksi $j) => ['value' => $j->value, 'label' => match ($j) {
                JenisKoreksi::BelumAbsen => 'Belum Absen',
                JenisKoreksi::PoinBelumMasuk => 'Poin Belum Masuk',
                JenisKoreksi::DataSalah => 'Data Salah',
                JenisKoreksi::Lainnya => 'Lainnya',
            }], JenisKoreksi::cases()),
        ]);
    }

    public function store(CreateKoreksiRequest $request, CreateCorrection $action): RedirectResponse
    {
        /** @var Pendaftaran $pendaftaran */
        $pendaftaran = Pendaftaran::query()->findOrFail($request->integer('pendaftaran_id'));

        $action->handle(
            $pendaftaran,
            JenisKoreksi::from($request->string('jenis')->toString()),
            $request->string('alasan')->toString(),
            $request->file('bukti'),
            $request->user(),
            $request->ip()
        );

        return back()->with('success', 'Pengajuan koreksi berhasil dikirim.');
    }
}

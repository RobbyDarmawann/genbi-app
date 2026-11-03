<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Koreksi\DecideCorrection;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\DecideKoreksiRequest;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\Koreksi;
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

        $query = Koreksi::query()
            ->with(['mahasiswa.user', 'mahasiswa.komsat', 'mahasiswa.divisi', 'kegiatan', 'pemroses']);

        if ($request->filled('status')) {
            $query->where('status', $request->string('status')->toString());
        }

        if ($request->filled('komsat_id')) {
            $query->whereHas('mahasiswa', fn ($q) => $q->where('komsat_id', $request->integer('komsat_id')));
        }

        if ($request->filled('kegiatan_id')) {
            $query->where('kegiatan_id', $request->integer('kegiatan_id'));
        }

        if ($request->filled('q')) {
            $term = $request->string('q')->trim()->toString();
            $query->where(function ($query) use ($term): void {
                $query->whereHas('mahasiswa.user', fn ($q) => $q->where('name', 'like', "%{$term}%"))
                    ->orWhereHas('mahasiswa', fn ($q) => $q->where('nim', 'like', "%{$term}%"));
            });
        }

        $koreksi = $query->latest()->paginate(20)->withQueryString();

        $komsat = Komsat::query()->where('aktif', true)->orderBy('kode')->get(['id', 'kode', 'nama']);
        $kegiatan = Kegiatan::query()->latest('tanggal')->limit(30)->get(['id', 'judul', 'tanggal']);

        return Inertia::render('admin/koreksi/index', [
            'koreksi' => $koreksi,
            'komsat' => $komsat,
            'kegiatan' => $kegiatan,
            'filters' => $request->only('status', 'komsat_id', 'kegiatan_id', 'q'),
        ]);
    }

    public function show(Koreksi $koreksi): Response
    {
        Gate::authorize('view', $koreksi);

        $koreksi->load([
            'mahasiswa.user',
            'mahasiswa.komsat',
            'mahasiswa.divisi',
            'kegiatan.komsat',
            'pendaftaran.kehadiran',
            'pemroses',
        ]);

        $riwayatPoin = $koreksi->mahasiswa->poinTransaksi()
            ->where('kegiatan_id', $koreksi->kegiatan_id)
            ->with('kehadiran')
            ->get();

        return Inertia::render('admin/koreksi/show', [
            'koreksi' => $koreksi,
            'riwayat_poin' => $riwayatPoin,
        ]);
    }

    public function decide(DecideKoreksiRequest $request, Koreksi $koreksi, DecideCorrection $action): RedirectResponse
    {
        $approve = $request->string('keputusan')->toString() === 'setujui';

        $action->handle(
            $koreksi,
            $approve,
            $request->string('catatan_proses')->toString(),
            $request->user(),
            $request->ip()
        );

        return back()->with('success', $approve ? 'Koreksi berhasil disetujui.' : 'Koreksi ditolak.');
    }
}

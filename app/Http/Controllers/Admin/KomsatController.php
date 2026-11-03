<?php

namespace App\Http\Controllers\Admin;

use App\Actions\MasterData\DeleteKomsatAction;
use App\Actions\MasterData\SaveKomsatAction;
use App\Actions\MasterData\ToggleKomsatAktifAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKomsatRequest;
use App\Http\Requests\Admin\ToggleMasterDataRequest;
use App\Http\Requests\Admin\UpdateKomsatRequest;
use App\Models\Komsat;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KomsatController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Komsat::class);

        $search = $request->string('q')->trim()->toString();

        $komsat = Komsat::query()
            ->select(['id', 'kode', 'nama', 'aktif', 'created_at'])
            ->withCount(['divisi', 'mahasiswa', 'kegiatan', 'kepengurusan'])
            ->when($search !== '', fn ($query) => $query->where(
                fn ($sub) => $sub->where('kode', 'like', "%{$search}%")
                    ->orWhere('nama', 'like', "%{$search}%")
            ))
            ->orderBy('kode')
            ->orderBy('id')
            ->paginate(10)
            ->withQueryString()
            ->through(function (Komsat $item): array {
                $divisiCount = (int) ($item->divisi_count ?? 0);
                $mahasiswaCount = (int) ($item->mahasiswa_count ?? 0);
                $kegiatanCount = (int) ($item->kegiatan_count ?? 0);
                $kepengurusanCount = (int) ($item->kepengurusan_count ?? 0);

                return [
                    'id' => $item->id,
                    'kode' => $item->kode,
                    'nama' => $item->nama,
                    'aktif' => $item->aktif,
                    'divisi_count' => $divisiCount,
                    'mahasiswa_count' => $mahasiswaCount,
                    'kegiatan_count' => $kegiatanCount,
                    'kepengurusan_count' => $kepengurusanCount,
                    'terikat' => ($divisiCount + $mahasiswaCount + $kegiatanCount + $kepengurusanCount) > 0,
                ];
            });

        return Inertia::render('admin/komsat/index', [
            'komsat' => $komsat,
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function store(StoreKomsatRequest $request, SaveKomsatAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{kode: string, nama: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, null, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Komisariat berhasil ditambahkan.']);

        return back(fallback: route('admin.komsat.index'));
    }

    public function update(UpdateKomsatRequest $request, Komsat $komsat, SaveKomsatAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{kode: string, nama: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, $komsat, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Komisariat berhasil diperbarui.']);

        return back(fallback: route('admin.komsat.index'));
    }

    public function toggleAktif(ToggleMasterDataRequest $request, Komsat $komsat, ToggleKomsatAktifAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{aktif: bool} $validated */
        $validated = $request->validated();
        $aktif = (bool) $validated['aktif'];

        $action->handle($komsat, $aktif, $actor, $request->ip());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $aktif ? 'Komisariat diaktifkan.' : 'Komisariat dinonaktifkan.',
        ]);

        return back(fallback: route('admin.komsat.index'));
    }

    public function destroy(Request $request, Komsat $komsat, DeleteKomsatAction $action): RedirectResponse
    {
        Gate::authorize('delete', $komsat);

        /** @var User $actor */
        $actor = $request->user();

        $action->handle($komsat, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Komisariat berhasil dihapus.']);

        return back(fallback: route('admin.komsat.index'));
    }
}

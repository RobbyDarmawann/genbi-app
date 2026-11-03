<?php

namespace App\Http\Controllers\Admin;

use App\Actions\MasterData\DeleteDivisiAction;
use App\Actions\MasterData\SaveDivisiAction;
use App\Actions\MasterData\ToggleDivisiAktifAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreDivisiRequest;
use App\Http\Requests\Admin\ToggleMasterDataRequest;
use App\Http\Requests\Admin\UpdateDivisiRequest;
use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class DivisiController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Divisi::class);

        $search = $request->string('q')->trim()->toString();
        $komsatId = $request->integer('komsat_id') ?: null;

        $divisi = Divisi::query()
            ->select(['id', 'komsat_id', 'nama', 'aktif', 'created_at'])
            ->with(['komsat:id,kode,nama'])
            ->withCount(['mahasiswa', 'kegiatan'])
            ->when($komsatId !== null, fn ($query) => $query->where('komsat_id', $komsatId))
            ->when($search !== '', fn ($query) => $query->where('nama', 'like', "%{$search}%"))
            ->orderBy('komsat_id')
            ->orderBy('nama')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString()
            ->through(function (Divisi $item): array {
                $mahasiswaCount = (int) ($item->mahasiswa_count ?? 0);
                $kegiatanCount = (int) ($item->kegiatan_count ?? 0);

                return [
                    'id' => $item->id,
                    'komsat_id' => $item->komsat_id,
                    'komsat' => $item->komsat ? [
                        'id' => $item->komsat->id,
                        'kode' => $item->komsat->kode,
                        'nama' => $item->komsat->nama,
                    ] : null,
                    'nama' => $item->nama,
                    'aktif' => $item->aktif,
                    'mahasiswa_count' => $mahasiswaCount,
                    'kegiatan_count' => $kegiatanCount,
                    'terikat' => ($mahasiswaCount + $kegiatanCount) > 0,
                ];
            });

        $komsatOptions = Komsat::query()
            ->select(['id', 'kode', 'nama', 'aktif'])
            ->orderBy('kode')
            ->get();

        return Inertia::render('admin/divisi/index', [
            'divisi' => $divisi,
            'komsatOptions' => $komsatOptions,
            'filters' => [
                'q' => $search,
                'komsat_id' => $komsatId !== null ? (string) $komsatId : '',
            ],
        ]);
    }

    public function store(StoreDivisiRequest $request, SaveDivisiAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{komsat_id: int, nama: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, null, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Divisi berhasil ditambahkan.']);

        return back(fallback: route('admin.divisi.index'));
    }

    public function update(UpdateDivisiRequest $request, Divisi $divisi, SaveDivisiAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{komsat_id: int, nama: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, $divisi, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Divisi berhasil diperbarui.']);

        return back(fallback: route('admin.divisi.index'));
    }

    public function toggleAktif(ToggleMasterDataRequest $request, Divisi $divisi, ToggleDivisiAktifAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{aktif: bool} $validated */
        $validated = $request->validated();
        $aktif = (bool) $validated['aktif'];

        $action->handle($divisi, $aktif, $actor, $request->ip());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $aktif ? 'Divisi diaktifkan.' : 'Divisi dinonaktifkan.',
        ]);

        return back(fallback: route('admin.divisi.index'));
    }

    public function destroy(Request $request, Divisi $divisi, DeleteDivisiAction $action): RedirectResponse
    {
        Gate::authorize('delete', $divisi);

        /** @var User $actor */
        $actor = $request->user();

        $action->handle($divisi, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Divisi berhasil dihapus.']);

        return back(fallback: route('admin.divisi.index'));
    }
}

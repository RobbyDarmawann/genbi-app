<?php

namespace App\Http\Controllers\Admin;

use App\Actions\MasterData\DeleteLokasiKegiatanAction;
use App\Actions\MasterData\SaveLokasiKegiatanAction;
use App\Actions\MasterData\ToggleLokasiKegiatanAktifAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreLokasiKegiatanRequest;
use App\Http\Requests\Admin\ToggleMasterDataRequest;
use App\Http\Requests\Admin\UpdateLokasiKegiatanRequest;
use App\Models\LokasiKegiatan;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class LokasiKegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', LokasiKegiatan::class);

        $search = $request->string('q')->trim()->toString();

        $lokasi = LokasiKegiatan::query()
            ->select(['id', 'nama', 'latitude', 'longitude', 'radius_m', 'keterangan', 'aktif', 'created_at'])
            ->withCount(['kegiatan'])
            ->when($search !== '', fn ($query) => $query->where(
                fn ($sub) => $sub->where('nama', 'like', "%{$search}%")
                    ->orWhere('keterangan', 'like', "%{$search}%")
            ))
            ->orderBy('nama')
            ->orderBy('id')
            ->paginate(15)
            ->withQueryString()
            ->through(function (LokasiKegiatan $item): array {
                $kegiatanCount = (int) ($item->kegiatan_count ?? 0);

                return [
                    'id' => $item->id,
                    'nama' => $item->nama,
                    'latitude' => (float) $item->latitude,
                    'longitude' => (float) $item->longitude,
                    'radius_m' => (int) $item->radius_m,
                    'keterangan' => $item->keterangan,
                    'aktif' => $item->aktif,
                    'kegiatan_count' => $kegiatanCount,
                    'terikat' => $kegiatanCount > 0,
                ];
            });

        return Inertia::render('admin/lokasi/index', [
            'lokasi' => $lokasi,
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function store(StoreLokasiKegiatanRequest $request, SaveLokasiKegiatanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{nama: string, latitude: float|int|string, longitude: float|int|string, radius_m: int|string, keterangan?: string|null, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, null, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lokasi kegiatan berhasil ditambahkan.']);

        return back(fallback: route('admin.lokasi.index'));
    }

    public function update(UpdateLokasiKegiatanRequest $request, LokasiKegiatan $lokasi, SaveLokasiKegiatanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{nama: string, latitude: float|int|string, longitude: float|int|string, radius_m: int|string, keterangan?: string|null, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, $lokasi, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lokasi kegiatan berhasil diperbarui.']);

        return back(fallback: route('admin.lokasi.index'));
    }

    public function toggleAktif(ToggleMasterDataRequest $request, LokasiKegiatan $lokasi, ToggleLokasiKegiatanAktifAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{aktif: bool} $validated */
        $validated = $request->validated();
        $aktif = (bool) $validated['aktif'];

        $action->handle($lokasi, $aktif, $actor, $request->ip());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $aktif ? 'Lokasi kegiatan diaktifkan.' : 'Lokasi kegiatan dinonaktifkan.',
        ]);

        return back(fallback: route('admin.lokasi.index'));
    }

    public function destroy(Request $request, LokasiKegiatan $lokasi, DeleteLokasiKegiatanAction $action): RedirectResponse
    {
        Gate::authorize('delete', $lokasi);

        /** @var User $actor */
        $actor = $request->user();

        $action->handle($lokasi, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Lokasi kegiatan berhasil dihapus.']);

        return back(fallback: route('admin.lokasi.index'));
    }
}

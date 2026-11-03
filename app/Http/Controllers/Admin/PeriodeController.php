<?php

namespace App\Http\Controllers\Admin;

use App\Actions\MasterData\DeletePeriodeAction;
use App\Actions\MasterData\SavePeriodeAction;
use App\Actions\MasterData\TogglePeriodeAktifAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePeriodeRequest;
use App\Http\Requests\Admin\ToggleMasterDataRequest;
use App\Http\Requests\Admin\UpdatePeriodeRequest;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PeriodeController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Periode::class);

        $search = $request->string('q')->trim()->toString();

        $periode = Periode::query()
            ->select(['id', 'nama', 'tanggal_mulai', 'tanggal_selesai', 'aktif', 'created_at'])
            ->withCount('kepengurusan')
            ->when($search !== '', fn ($query) => $query->where('nama', 'like', "%{$search}%"))
            ->orderByDesc('aktif')
            ->orderByDesc('tanggal_mulai')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Periode $item): array => [
                'id' => $item->id,
                'nama' => $item->nama,
                'tanggal_mulai' => $item->tanggal_mulai->toDateString(),
                'tanggal_selesai' => $item->tanggal_selesai->toDateString(),
                'aktif' => $item->aktif,
                'kepengurusan_count' => (int) ($item->kepengurusan_count ?? 0),
                'terikat' => (int) ($item->kepengurusan_count ?? 0) > 0,
            ]);

        return Inertia::render('admin/periode/index', [
            'periode' => $periode,
            'filters' => [
                'q' => $search,
            ],
        ]);
    }

    public function store(StorePeriodeRequest $request, SavePeriodeAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{nama: string, tanggal_mulai: string, tanggal_selesai: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, null, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Periode berhasil ditambahkan.']);

        return back(fallback: route('admin.periode.index'));
    }

    public function update(UpdatePeriodeRequest $request, Periode $periode, SavePeriodeAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{nama: string, tanggal_mulai: string, tanggal_selesai: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, $periode, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Periode berhasil diperbarui.']);

        return back(fallback: route('admin.periode.index'));
    }

    public function toggleAktif(ToggleMasterDataRequest $request, Periode $periode, TogglePeriodeAktifAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{aktif: bool} $validated */
        $validated = $request->validated();
        $aktif = (bool) $validated['aktif'];

        $action->handle($periode, $aktif, $actor, $request->ip());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $aktif ? 'Periode diaktifkan.' : 'Periode dinonaktifkan.',
        ]);

        return back(fallback: route('admin.periode.index'));
    }

    public function destroy(Request $request, Periode $periode, DeletePeriodeAction $action): RedirectResponse
    {
        Gate::authorize('delete', $periode);

        /** @var User $actor */
        $actor = $request->user();

        $action->handle($periode, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Periode berhasil dihapus.']);

        return back(fallback: route('admin.periode.index'));
    }
}

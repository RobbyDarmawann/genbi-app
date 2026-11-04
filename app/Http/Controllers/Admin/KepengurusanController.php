<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Kepengurusan\DeleteKepengurusanAction;
use App\Actions\Kepengurusan\SaveKepengurusanAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKepengurusanRequest;
use App\Http\Requests\Admin\UpdateKepengurusanRequest;
use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Periode;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KepengurusanController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Kepengurusan::class);

        $periodeAktif = Periode::query()->aktif()->first();
        $periodeId = $request->filled('periode_id') && $request->input('periode_id') !== 'all'
            ? (int) $request->input('periode_id')
            : $periodeAktif?->id;

        $komsatFilter = $request->input('komsat_id');
        $search = $request->string('q')->trim()->toString();

        $query = Kepengurusan::query()
            ->with([
                'periode:id,nama,aktif',
                'komsat:id,kode,nama',
                'mahasiswa.user:id,name',
            ])
            ->when($periodeId, fn ($q) => $q->where('periode_id', $periodeId))
            ->when($komsatFilter === 'wilayah', fn ($q) => $q->whereNull('komsat_id'))
            ->when($komsatFilter !== null && $komsatFilter !== '' && $komsatFilter !== 'all' && $komsatFilter !== 'wilayah', function ($q) use ($komsatFilter) {
                $q->where('komsat_id', (int) $komsatFilter);
            })
            ->when($search !== '', function ($q) use ($search) {
                $q->where(function ($sub) use ($search) {
                    $sub->where('nama_tampil', 'like', "%{$search}%")
                        ->orWhere('jabatan', 'like', "%{$search}%");
                });
            })
            ->orderBy('urutan')
            ->orderBy('id');

        $kepengurusan = $query->paginate(20)->withQueryString()->through(fn (Kepengurusan $item): array => [
            'id' => $item->id,
            'periode_id' => $item->periode_id,
            'periode_nama' => $item->periode->nama ?? '-',
            'periode_aktif' => (bool) ($item->periode->aktif ?? false),
            'komsat_id' => $item->komsat_id,
            'komsat_kode' => $item->komsat->kode ?? null,
            'komsat_nama' => $item->komsat->nama ?? null,
            'lingkup_label' => $item->komsat !== null ? "Komsat {$item->komsat->kode}" : 'Tingkat Wilayah',
            'mahasiswa_id' => $item->mahasiswa_id,
            'mahasiswa_nama' => $item->mahasiswa->user->name ?? null,
            'nama_tampil' => $item->nama_tampil,
            'jabatan' => $item->jabatan,
            'urutan' => $item->urutan,
            'kontak' => $item->kontak,
        ]);

        $options = [
            'periode' => Periode::query()
                ->orderByDesc('aktif')
                ->orderByDesc('tanggal_mulai')
                ->get(['id', 'nama', 'aktif'])
                ->map(fn (Periode $p): array => [
                    'id' => $p->id,
                    'nama' => $p->nama,
                    'aktif' => $p->aktif,
                ])
                ->all(),
            'komsat' => Komsat::query()
                ->where('aktif', true)
                ->orderBy('id')
                ->get(['id', 'kode', 'nama'])
                ->all(),
            'mahasiswa' => Mahasiswa::query()
                ->where('aktif', true)
                ->with(['user:id,name', 'komsat:id,kode'])
                ->orderBy('id')
                ->get()
                ->map(fn (Mahasiswa $m): array => [
                    'id' => $m->id,
                    'nama' => $m->user->name ?? 'Mahasiswa',
                    'nim' => $m->nim,
                    'komsat' => $m->komsat->kode ?? '-',
                ])
                ->all(),
        ];

        return Inertia::render('admin/kepengurusan/index', [
            'kepengurusan' => $kepengurusan,
            'filters' => [
                'periode_id' => $periodeId !== null ? (string) $periodeId : '',
                'komsat_id' => (string) ($komsatFilter ?? ''),
                'q' => $search,
            ],
            'options' => $options,
            'periode_terpilih' => $periodeId ? Periode::find($periodeId)?->only(['id', 'nama', 'aktif']) : null,
        ]);
    }

    public function store(StoreKepengurusanRequest $request, SaveKepengurusanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{periode_id: int, komsat_id: int|null, mahasiswa_id: int|null, nama_tampil: string, jabatan: string, urutan: int, kontak: string|null} $validated */
        $validated = $request->validated();

        $action->handle($validated, null, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengurus berhasil ditambahkan ke direktori.']);

        return back(fallback: route('admin.kepengurusan.index'));
    }

    public function update(UpdateKepengurusanRequest $request, Kepengurusan $kepengurusan, SaveKepengurusanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{periode_id: int, komsat_id: int|null, mahasiswa_id: int|null, nama_tampil: string, jabatan: string, urutan: int, kontak: string|null} $validated */
        $validated = $request->validated();

        $action->handle($validated, $kepengurusan, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pengurus berhasil diperbarui.']);

        return back(fallback: route('admin.kepengurusan.index'));
    }

    public function destroy(Request $request, Kepengurusan $kepengurusan, DeleteKepengurusanAction $action): RedirectResponse
    {
        Gate::authorize('delete', $kepengurusan);

        /** @var User $actor */
        $actor = $request->user();

        $action->handle($kepengurusan, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengurus berhasil dihapus dari direktori.']);

        return back(fallback: route('admin.kepengurusan.index'));
    }
}

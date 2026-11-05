<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Kepengurusan\DeleteKepengurusanAction;
use App\Actions\Kepengurusan\ReorderKepengurusanAction;
use App\Actions\Kepengurusan\SaveKepengurusanAction;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReorderKepengurusanRequest;
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

        $allKepengurusan = $query->get();

        $grouped = [
            'wilayah' => $allKepengurusan->where('komsat_id', null)->values()->map(fn (Kepengurusan $item): array => [
                'id' => $item->id,
                'periode_id' => $item->periode_id,
                'komsat_id' => null,
                'lingkup_label' => 'Tingkat Wilayah',
                'mahasiswa_id' => $item->mahasiswa_id,
                'mahasiswa_nama' => $item->mahasiswa->user->name ?? null,
                'nama_tampil' => $item->nama_tampil,
                'jabatan' => $item->jabatan,
                'urutan' => $item->urutan,
                'no_hp' => $item->no_hp,
                'instagram' => $item->instagram,
                'email' => $item->email,
                'kontak' => $item->kontak,
                'foto_url' => $item->foto_path ? asset('storage/'.$item->foto_path) : null,
            ])->all(),
        ];

        $komsatAktif = Komsat::query()->where('aktif', true)->orderBy('id')->get();
        foreach ($komsatAktif as $komsat) {
            $items = $allKepengurusan->where('komsat_id', $komsat->id)->values();
            $grouped['komsat_'.$komsat->id] = [
                'komsat_id' => $komsat->id,
                'komsat_kode' => $komsat->kode,
                'komsat_nama' => $komsat->nama,
                'items' => $items->map(fn (Kepengurusan $item): array => [
                    'id' => $item->id,
                    'periode_id' => $item->periode_id,
                    'komsat_id' => $item->komsat_id,
                    'lingkup_label' => "Komsat {$item->komsat->kode}",
                    'mahasiswa_id' => $item->mahasiswa_id,
                    'mahasiswa_nama' => $item->mahasiswa->user->name ?? null,
                    'nama_tampil' => $item->nama_tampil,
                    'jabatan' => $item->jabatan,
                    'urutan' => $item->urutan,
                    'no_hp' => $item->no_hp,
                    'instagram' => $item->instagram,
                    'email' => $item->email,
                    'kontak' => $item->kontak,
                    'foto_url' => $item->foto_path ? asset('storage/'.$item->foto_path) : null,
                ])->all(),
            ];
        }

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
            'kepengurusan_grouped' => $grouped,
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

        $action->handle($validated, null, $actor, $request->ip(), $request->file('foto'));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pengurus berhasil ditambahkan ke direktori.']);

        return back(fallback: route('admin.kepengurusan.index'));
    }

    public function update(UpdateKepengurusanRequest $request, Kepengurusan $kepengurusan, SaveKepengurusanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{periode_id: int, komsat_id: int|null, mahasiswa_id: int|null, nama_tampil: string, jabatan: string, urutan: int, kontak: string|null} $validated */
        $validated = $request->validated();

        $action->handle($validated, $kepengurusan, $actor, $request->ip(), $request->file('foto'));

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data pengurus berhasil diperbarui.']);

        return back(fallback: route('admin.kepengurusan.index'));
    }

    public function reorder(ReorderKepengurusanRequest $request, Kepengurusan $kepengurusan, ReorderKepengurusanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var string $direction */
        $direction = $request->validated('direction');

        $action->handle($kepengurusan, $direction, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Urutan pengurus berhasil diperbarui.']);

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

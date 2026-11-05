<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Mahasiswa\CreateMahasiswaAction;
use App\Actions\Mahasiswa\DeleteMahasiswaAction;
use App\Actions\Mahasiswa\ResetMahasiswaPasswordAction;
use App\Actions\Mahasiswa\ToggleMahasiswaAktifAction;
use App\Actions\Mahasiswa\UpdateMahasiswaAction;
use App\Enums\StatusPenerima;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ResetMahasiswaPasswordRequest;
use App\Http\Requests\Admin\StoreMahasiswaRequest;
use App\Http\Requests\Admin\ToggleMahasiswaAktifRequest;
use App\Http\Requests\Admin\UpdateMahasiswaRequest;
use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MahasiswaController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Mahasiswa::class);

        $search = $request->string('q')->trim()->toString();
        $komsatId = $request->integer('komsat_id') ?: null;
        $divisiId = $request->integer('divisi_id') ?: null;
        $statusPenerima = StatusPenerima::tryFrom($request->string('status_penerima')->toString());
        $aktifParam = $request->string('aktif')->toString();
        $aktifFilter = in_array($aktifParam, ['1', '0'], true) ? $aktifParam === '1' : null;

        $mahasiswa = Mahasiswa::query()
            ->with(['user:id,name,username,email,is_active', 'komsat:id,kode,nama', 'divisi:id,komsat_id,nama,aktif'])
            ->withSum('poinTransaksi as total_poin', 'jumlah')
            ->withCount(['pendaftaran', 'poinTransaksi', 'koreksi', 'kepengurusan'])
            ->when($search !== '', function ($query) use ($search): void {
                $query->where(function ($sub) use ($search): void {
                    $sub->where('nim', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($userQuery) use ($search): void {
                            $userQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('username', 'like', "%{$search}%");
                        });
                });
            })
            ->when($komsatId !== null, fn ($query) => $query->where('komsat_id', $komsatId))
            ->when($divisiId !== null, fn ($query) => $query->where('divisi_id', $divisiId))
            ->when($statusPenerima !== null, fn ($query) => $query->where('status_penerima', $statusPenerima))
            ->when($aktifFilter !== null, fn ($query) => $query->where('aktif', $aktifFilter))
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Mahasiswa $item): array => $this->transformRow($item));

        return Inertia::render('admin/mahasiswa/index', [
            'mahasiswa' => $mahasiswa,
            ...$this->filterOptions(),
            'filters' => [
                'q' => $search,
                'komsat_id' => $komsatId !== null ? (string) $komsatId : '',
                'divisi_id' => $divisiId !== null ? (string) $divisiId : '',
                'status_penerima' => $statusPenerima !== null ? $statusPenerima->value : '',
                'aktif' => in_array($aktifParam, ['1', '0'], true) ? $aktifParam : '',
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Mahasiswa::class);

        return Inertia::render('admin/mahasiswa/create', $this->formOptions());
    }

    public function store(StoreMahasiswaRequest $request, CreateMahasiswaAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{name: string, username: string, password: string, nim: string, komsat_id: int, divisi_id: int, angkatan: string, status_penerima: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Akun anggota mahasiswa berhasil dibuat.']);

        return to_route('admin.mahasiswa.index');
    }

    public function show(Mahasiswa $mahasiswa): Response
    {
        Gate::authorize('view', $mahasiswa);

        $mahasiswa->load(['user:id,name,username,email,is_active,created_at', 'komsat:id,kode,nama', 'divisi:id,komsat_id,nama,aktif'])
            ->loadSum('poinTransaksi as total_poin', 'jumlah')
            ->loadCount(['pendaftaran', 'poinTransaksi', 'koreksi', 'kepengurusan']);

        $riwayatPoin = $mahasiswa->poinTransaksi()
            ->with('kegiatan:id,judul')
            ->orderByDesc('id')
            ->limit(10)
            ->get()
            ->map(fn (PoinTransaksi $trx): array => [
                'id' => $trx->id,
                'tipe' => $trx->tipe->value,
                'jumlah' => $trx->jumlah,
                'keterangan' => $trx->keterangan,
                'kegiatan_nama' => $trx->kegiatan !== null ? $trx->kegiatan->judul : null,
                'created_at' => $trx->created_at?->toIso8601String(),
            ]);

        return Inertia::render('admin/mahasiswa/show', [
            'mahasiswa' => $this->transformRow($mahasiswa),
            'riwayatPoin' => $riwayatPoin,
        ]);
    }

    public function edit(Mahasiswa $mahasiswa): Response
    {
        Gate::authorize('update', $mahasiswa);

        $mahasiswa->load(['user:id,name,username,email,is_active', 'komsat:id,kode,nama', 'divisi:id,komsat_id,nama,aktif'])
            ->loadSum('poinTransaksi as total_poin', 'jumlah')
            ->loadCount(['pendaftaran', 'poinTransaksi', 'koreksi', 'kepengurusan']);

        return Inertia::render('admin/mahasiswa/edit', [
            'mahasiswa' => $this->transformRow($mahasiswa),
            ...$this->formOptions($mahasiswa),
        ]);
    }

    public function update(UpdateMahasiswaRequest $request, Mahasiswa $mahasiswa, UpdateMahasiswaAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{name: string, username: string, nim: string, komsat_id: int, divisi_id: int, angkatan: string, status_penerima: string, aktif?: bool} $validated */
        $validated = $request->validated();

        $action->handle($validated, $mahasiswa, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data anggota berhasil diperbarui.']);

        return back(fallback: route('admin.mahasiswa.edit', $mahasiswa));
    }

    public function resetPassword(ResetMahasiswaPasswordRequest $request, Mahasiswa $mahasiswa, ResetMahasiswaPasswordAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{password: string} $validated */
        $validated = $request->validated();

        $action->handle($mahasiswa, $validated['password'], $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Password anggota berhasil direset.']);

        return back(fallback: route('admin.mahasiswa.edit', $mahasiswa));
    }

    public function toggleAktif(ToggleMahasiswaAktifRequest $request, Mahasiswa $mahasiswa, ToggleMahasiswaAktifAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var array{aktif: bool} $validated */
        $validated = $request->validated();
        $aktif = (bool) $validated['aktif'];

        $action->handle($mahasiswa, $aktif, $actor, $request->ip());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $aktif ? 'Akun anggota diaktifkan.' : 'Akun anggota dinonaktifkan.',
        ]);

        return back(fallback: route('admin.mahasiswa.index'));
    }

    public function destroy(Request $request, Mahasiswa $mahasiswa, DeleteMahasiswaAction $action): RedirectResponse
    {
        Gate::authorize('delete', $mahasiswa);

        /** @var User $actor */
        $actor = $request->user();

        $action->handle($mahasiswa, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Data anggota berhasil dihapus.']);

        return to_route('admin.mahasiswa.index');
    }

    /**
     * @return array<string, mixed>
     */
    private function transformRow(Mahasiswa $item): array
    {
        $pendaftaranCount = (int) ($item->pendaftaran_count ?? 0);
        $poinCount = (int) ($item->poin_transaksi_count ?? 0);
        $koreksiCount = (int) ($item->koreksi_count ?? 0);
        $kepengurusanCount = (int) ($item->kepengurusan_count ?? 0);
        $riwayatTotal = $pendaftaranCount + $poinCount + $koreksiCount + $kepengurusanCount;

        return [
            'id' => $item->id,
            'user_id' => $item->user_id,
            'name' => $item->user !== null ? $item->user->name : '',
            'username' => $item->user !== null ? $item->user->username : '',
            'email' => $item->user?->email,
            'nim' => $item->nim,
            'angkatan' => $item->angkatan,
            'status_penerima' => $item->status_penerima->value,
            'status_penerima_label' => $item->status_penerima->label(),
            'aktif' => $item->aktif,
            'jenis_kelamin' => $item->jenis_kelamin,
            'agama' => $item->agama,
            'golongan_darah' => $item->golongan_darah,
            'tanggal_lahir' => $item->tanggal_lahir?->format('Y-m-d'),
            'domisili' => $item->domisili,
            'no_hp' => $item->no_hp,
            'foto_url' => $item->foto_path ? asset('storage/'.$item->foto_path) : null,
            'total_poin' => (int) ($item->getAttribute('total_poin') ?? 0),
            'komsat_id' => $item->komsat_id,
            'divisi_id' => $item->divisi_id,
            'komsat' => $item->komsat ? [
                'id' => $item->komsat->id,
                'kode' => $item->komsat->kode,
                'nama' => $item->komsat->nama,
            ] : null,
            'divisi' => $item->divisi ? [
                'id' => $item->divisi->id,
                'komsat_id' => $item->divisi->komsat_id,
                'nama' => $item->divisi->nama,
                'aktif' => $item->divisi->aktif,
            ] : null,
            'counts' => [
                'pendaftaran' => $pendaftaranCount,
                'poin_transaksi' => $poinCount,
                'koreksi' => $koreksiCount,
                'kepengurusan' => $kepengurusanCount,
            ],
            'terikat' => $riwayatTotal > 0,
            'created_at' => $item->created_at?->toIso8601String(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formOptions(?Mahasiswa $current = null): array
    {
        $komsatOptions = Komsat::query()
            ->select(['id', 'kode', 'nama', 'aktif'])
            ->where(function ($query) use ($current): void {
                $query->where('aktif', true);

                if ($current !== null) {
                    $query->orWhere('id', $current->komsat_id);
                }
            })
            ->orderBy('kode')
            ->get();

        $divisiOptions = Divisi::query()
            ->select(['id', 'komsat_id', 'nama', 'aktif'])
            ->where(function ($query) use ($current): void {
                $query->where('aktif', true);

                if ($current !== null) {
                    $query->orWhere('id', $current->divisi_id);
                }
            })
            ->orderBy('nama')
            ->get();

        return [
            'komsatOptions' => $komsatOptions,
            'divisiOptions' => $divisiOptions,
            'statusPenerimaOptions' => $this->statusPenerimaOptions(),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function filterOptions(): array
    {
        return [
            'komsatOptions' => Komsat::query()
                ->select(['id', 'kode', 'nama', 'aktif'])
                ->orderBy('kode')
                ->get(),
            'divisiOptions' => Divisi::query()
                ->select(['id', 'komsat_id', 'nama', 'aktif'])
                ->orderBy('nama')
                ->get(),
            'statusPenerimaOptions' => $this->statusPenerimaOptions(),
        ];
    }

    /**
     * @return array<int, array{value: string, label: string}>
     */
    private function statusPenerimaOptions(): array
    {
        return array_map(
            fn (StatusPenerima $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ],
            StatusPenerima::cases(),
        );
    }
}

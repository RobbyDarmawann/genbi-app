<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Kegiatan\CreateKegiatanAction;
use App\Actions\Kegiatan\UpdateKegiatanAction;
use App\Actions\Kegiatan\UpdateStatusKegiatanAction;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusPendaftaran;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreKegiatanRequest;
use App\Http\Requests\Admin\UpdateKegiatanRequest;
use App\Http\Requests\Admin\UpdateStatusKegiatanRequest;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Kegiatan::class);
        $search = $request->string('q')->trim()->toString();
        $status = StatusKegiatan::tryFrom($request->string('status')->toString());
        $komsatId = $request->integer('komsat_id') ?: null;
        $tanggal = $request->string('tanggal')->toString();

        $kegiatan = Kegiatan::query()
            ->with(['komsat:id,kode,nama', 'divisiTarget:id,komsat_id,nama', 'bobot'])
            ->withCount([
                'pendaftaran' => fn ($query) => $query->where('status', StatusPendaftaran::Terdaftar),
                'kehadiran as jumlah_hadir' => fn ($query) => $query->where('kehadiran.status', 'valid'),
            ])
            ->when($search !== '', fn ($query) => $query->where('judul', 'like', "%{$search}%"))
            ->when($status !== null, fn ($query) => $query->statusEfektif($status))
            ->when($komsatId !== null, fn ($query) => $query->where('komsat_id', $komsatId))
            ->when($tanggal !== '', fn ($query) => $query->whereDate('tanggal', $tanggal))
            ->orderByDesc('tanggal')
            ->paginate(15)
            ->withQueryString()
            ->through(function (Kegiatan $k): array {
                $statusEfektif = $k->statusEfektif();

                return [
                    'id' => $k->id,
                    'judul' => $k->judul,
                    'tanggal' => $k->tanggal->toDateString(),
                    'jam_mulai' => substr($k->jam_mulai, 0, 5),
                    'lokasi_nama' => $k->lokasi_nama,
                    'status' => $statusEfektif->value,
                    'status_label' => $statusEfektif->label(),
                    'komsat' => $k->komsat !== null ? [
                        'kode' => $k->komsat->kode,
                        'nama' => $k->komsat->nama,
                    ] : null,
                    'pendaftaran_count' => (int) ($k->getAttribute('pendaftaran_count') ?? 0),
                    'jumlah_hadir' => (int) ($k->getAttribute('jumlah_hadir') ?? 0),
                ];
            });

        return Inertia::render('admin/kegiatan/index', [
            'kegiatan' => $kegiatan,
            'komsatOptions' => Komsat::query()->where('aktif', true)->orderBy('nama')->get(['id', 'kode', 'nama']),
            'statusOptions' => array_map(fn (StatusKegiatan $item): array => [
                'value' => $item->value, 'label' => $item->label(),
            ], StatusKegiatan::cases()),
            'filters' => [
                'q' => $search,
                'status' => $status !== null ? $status->value : '',
                'komsat_id' => $komsatId ? (string) $komsatId : '',
                'tanggal' => $tanggal,
            ],
        ]);
    }

    public function create(): Response
    {
        Gate::authorize('create', Kegiatan::class);

        return Inertia::render('admin/kegiatan/create', $this->formOptions());
    }

    public function store(StoreKegiatanRequest $request, CreateKegiatanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $kegiatan = $action->handle($request->validated(), $actor, $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kegiatan berhasil dibuat.']);

        return to_route('admin.kegiatan.show', $kegiatan);
    }

    public function show(Kegiatan $kegiatan): Response
    {
        Gate::authorize('view', $kegiatan);
        $kegiatan->load(['komsat:id,kode,nama', 'divisiTarget.komsat:id,kode,nama', 'bobot', 'pembuat:id,name'])
            ->loadCount([
                'pendaftaran' => fn ($query) => $query->where('status', StatusPendaftaran::Terdaftar),
                'kehadiran as jumlah_hadir' => fn ($query) => $query->where('kehadiran.status', 'valid'),
            ]);

        return Inertia::render('admin/kegiatan/show', [
            'kegiatan' => $this->serialize($kegiatan),
            'map' => ['latitude' => (float) $kegiatan->latitude, 'longitude' => (float) $kegiatan->longitude, 'radius_m' => $kegiatan->radius_m],
        ]);
    }

    public function edit(Kegiatan $kegiatan): Response
    {
        Gate::authorize('update', $kegiatan);
        $kegiatan->load(['divisiTarget:id,komsat_id,nama,aktif', 'bobot']);

        return Inertia::render('admin/kegiatan/edit', [
            ...$this->formOptions($kegiatan),
            'kegiatan' => $this->serialize($kegiatan),
            'peringatanKehadiran' => $kegiatan->memilikiKehadiranValid(),
        ]);
    }

    public function update(UpdateKegiatanRequest $request, Kegiatan $kegiatan, UpdateKegiatanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $action->handle($kegiatan, $request->validated(), $actor, $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kegiatan berhasil diperbarui.']);

        return to_route('admin.kegiatan.show', $kegiatan);
    }

    public function updateStatus(UpdateStatusKegiatanRequest $request, Kegiatan $kegiatan, UpdateStatusKegiatanAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $action->handle($kegiatan, StatusKegiatan::from($request->validated('status')), $actor, $request->validated('alasan'), $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Status kegiatan berhasil diperbarui.']);

        return back();
    }

    /** @return array<string, mixed> */
    private function formOptions(?Kegiatan $kegiatan = null): array
    {
        return [
            'komsatOptions' => Komsat::query()->where('aktif', true)->orderBy('nama')->get(['id', 'kode', 'nama']),
            'divisiGroups' => Komsat::query()->where('aktif', true)->with(['divisi' => fn ($query) => $query->where('aktif', true)->orderBy('nama')])->orderBy('nama')->get(['id', 'kode', 'nama'])->map(fn (Komsat $komsat): array => [
                'id' => $komsat->id, 'kode' => $komsat->kode, 'nama' => $komsat->nama,
                'divisi' => $komsat->divisi->map(fn (Divisi $divisi): array => ['id' => $divisi->id, 'nama' => $divisi->nama]),
            ]),
            'statusOptions' => array_map(fn (StatusKegiatan $item): array => ['value' => $item->value, 'label' => $item->label()], StatusKegiatan::cases()),
            'peranOptions' => array_map(fn (PeranKegiatan $item): array => ['value' => $item->value, 'label' => $item->label()], PeranKegiatan::cases()),
            'defaultBobot' => $kegiatan?->bobot->mapWithKeys(fn ($bobot): array => [$bobot->peran->value => $bobot->poin]) ?? [],
        ];
    }

    /** @return array<string, mixed> */
    private function serialize(Kegiatan $kegiatan): array
    {
        $jumlahTerdaftar = (int) ($kegiatan->getAttribute('pendaftaran_count') ?? 0);
        $statusEfektif = $kegiatan->statusEfektif();

        return [
            ...$kegiatan->toArray(),
            'status' => $statusEfektif->value,
            'status_label' => $statusEfektif->label(),
            'sisa_kuota' => $kegiatan->kuota !== null ? max(0, $kegiatan->kuota - $jumlahTerdaftar) : null,
            'tanggal' => $kegiatan->tanggal->toDateString(),
            'absensi_buka_at' => $kegiatan->absensi_buka_at->format('Y-m-d\TH:i'),
            'absensi_tutup_at' => $kegiatan->absensi_tutup_at->format('Y-m-d\TH:i'),
            'pendaftaran_dibuka_at' => $kegiatan->pendaftaran_dibuka_at?->format('Y-m-d\TH:i'),
            'batas_daftar_at' => $kegiatan->batas_daftar_at?->format('Y-m-d\TH:i'),
            'divisi_ids' => $kegiatan->divisiTarget->pluck('id')->all(),
            'divisi_target' => $kegiatan->divisiTarget->map(fn ($divisi): array => [
                'id' => $divisi->id,
                'nama' => $divisi->nama,
                'komsat_id' => $divisi->komsat_id,
                'komsat_kode' => $divisi->komsat?->kode,
            ])->all(),
            'bobot' => $kegiatan->bobot->mapWithKeys(fn ($bobot): array => [$bobot->peran->value => $bobot->poin]),
            'bobot_list' => $kegiatan->bobot->map(fn ($bobot): array => [
                'peran' => $bobot->peran->value,
                'label' => $bobot->peran->label(),
                'poin' => $bobot->poin,
            ])->all(),
        ];
    }
}

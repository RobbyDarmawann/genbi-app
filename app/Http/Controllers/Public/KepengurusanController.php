<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Periode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class KepengurusanController extends Controller
{
    public function __invoke(Request $request): Response
    {
        return Inertia::render('public/kepengurusan', $this->buildPayload($request));
    }

    public function mahasiswa(Request $request): Response
    {
        return Inertia::render('mahasiswa/kepengurusan', $this->buildPayload($request));
    }

    /**
     * @return array<string, mixed>
     */
    private function buildPayload(Request $request): array
    {
        $periodeAktif = Periode::query()->aktif()->first();
        $periodeId = $request->filled('periode_id') ? (int) $request->input('periode_id') : $periodeAktif?->id;
        $komsatFilter = $request->input('komsat_id');

        $periode = $periodeId ? Periode::find($periodeId) : null;
        $kepengurusan = $periode === null
            ? collect()
            : Kepengurusan::query()
                ->with(['periode:id,nama,aktif', 'komsat:id,kode,nama'])
                ->where('periode_id', $periode->id)
                ->when($komsatFilter === 'wilayah', fn ($q) => $q->whereNull('komsat_id'))
                ->when($komsatFilter !== null && $komsatFilter !== '' && $komsatFilter !== 'all' && $komsatFilter !== 'wilayah', function ($q) use ($komsatFilter) {
                    $q->where('komsat_id', (int) $komsatFilter);
                })
                ->orderBy('urutan')
                ->orderBy('id')
                ->get()
                ->map(fn (Kepengurusan $item): array => [
                    'id' => $item->id,
                    'lingkup' => $item->komsat_id === null ? 'wilayah' : 'komsat',
                    'lingkup_label' => $item->komsat !== null ? "Komsat {$item->komsat->kode}" : 'Tingkat Wilayah',
                    'komsat_kode' => $item->komsat->kode ?? null,
                    'komsat_nama' => $item->komsat->nama ?? null,
                    'nama_tampil' => $item->nama_tampil,
                    'jabatan' => $item->jabatan,
                    'urutan' => $item->urutan,
                    'kontak' => $item->kontak,
                ]);

        return [
            'periode' => $periode?->only(['id', 'nama', 'aktif']),
            'direktori' => [
                'wilayah' => $kepengurusan->where('lingkup', 'wilayah')->values()->all(),
                'komsat' => $kepengurusan->where('lingkup', 'komsat')->groupBy('komsat_kode')->all(),
            ],
            'filters' => ['periode_id' => $periodeId !== null ? (string) $periodeId : '', 'komsat_id' => (string) ($komsatFilter ?? '')],
            'options' => [
                'periode' => Periode::query()->orderByDesc('aktif')->orderByDesc('tanggal_mulai')->get(['id', 'nama', 'aktif'])->all(),
                'komsat' => Komsat::query()->where('aktif', true)->orderBy('id')->get(['id', 'kode', 'nama'])->all(),
            ],
        ];
    }
}

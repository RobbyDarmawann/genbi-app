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

        $periodeBerdata = Periode::query()
            ->where(function ($q) use ($periodeAktif) {
                $q->whereHas('kepengurusan');
                if ($periodeAktif) {
                    $q->orWhere('id', $periodeAktif->id);
                }
            })
            ->orderByDesc('tanggal_mulai')
            ->get(['id', 'nama', 'aktif']);

        $periodeParam = $request->input('periode') ?? $request->input('periode_id');
        $periodeIdRequest = ($periodeParam !== null && is_numeric($periodeParam)) ? (int) $periodeParam : null;

        $defaultPeriodeId = $periodeAktif !== null ? $periodeAktif->id : $periodeBerdata->first()?->id;
        $periodeId = $periodeIdRequest && $periodeBerdata->contains('id', $periodeIdRequest)
            ? $periodeIdRequest
            : $defaultPeriodeId;

        $validKomsatKodes = Komsat::query()->where('aktif', true)->pluck('kode')->all();
        $lingkupInput = $request->string('lingkup')->trim()->toString();
        $lingkupFilter = in_array($lingkupInput, ['wilayah', ...$validKomsatKodes], true) ? $lingkupInput : 'semua';

        $periode = $periodeId ? Periode::find($periodeId) : null;

        $kepengurusan = $periode === null
            ? collect()
            : Kepengurusan::query()
                ->with(['periode:id,nama,aktif', 'komsat:id,kode,nama'])
                ->where('periode_id', $periode->id)
                ->when($lingkupFilter === 'wilayah', fn ($q) => $q->whereNull('komsat_id'))
                ->when(
                    $lingkupFilter !== 'semua' && $lingkupFilter !== 'wilayah',
                    function ($q) use ($lingkupFilter) {
                        $komsat = Komsat::query()->where('kode', $lingkupFilter)->first();
                        if ($komsat) {
                            $q->where('komsat_id', $komsat->id);
                        }
                    }
                )
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
                    'no_hp' => $item->no_hp,
                    'instagram' => $item->instagram,
                    'email' => $item->email,
                    'kontak' => $item->kontak,
                    'foto_url' => $item->foto_path ? asset('storage/'.$item->foto_path) : null,
                ]);

        $komsatTersedia = $periode === null
            ? []
            : Komsat::query()
                ->whereHas('kepengurusan', fn ($q) => $q->where('periode_id', $periode->id))
                ->orderBy('kode')
                ->get(['kode', 'nama'])
                ->map(fn (Komsat $k) => [
                    'kode' => $k->kode,
                    'nama' => $k->nama,
                ])
                ->all();

        $daftarPeriode = $periodeBerdata->map(function (Periode $p) {
            $jumlah = Kepengurusan::query()->where('periode_id', $p->id)->count();

            return [
                'id' => $p->id,
                'nama' => $p->nama,
                'label' => $p->nama,
                'label_tahun' => $p->nama,
                'aktif' => (bool) $p->aktif,
                'jumlah_pengurus' => $jumlah,
            ];
        })->values()->all();

        return [
            'periode_terpilih' => $periode?->only(['id', 'nama', 'aktif']),
            'periode' => $periode?->only(['id', 'nama', 'aktif']),
            'daftar_periode' => $daftarPeriode,
            'direktori' => [
                'wilayah' => $kepengurusan->where('lingkup', 'wilayah')->values()->all(),
                'komsat' => $kepengurusan->where('lingkup', 'komsat')->groupBy('komsat_kode')->all(),
            ],
            'komsat_tersedia' => $komsatTersedia,
            'filters' => [
                'periode' => $periodeId !== null ? (string) $periodeId : '',
                'periode_id' => $periodeId !== null ? (string) $periodeId : '',
                'lingkup' => $lingkupFilter,
            ],
        ];
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Enums\StatusPenerima;
use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StatistikController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('q')->trim()->toString();

        // Ringkasan agregat publik tanpa mengekspos data pribadi (NIM, foto, koordinat, kontak)
        $ringkasan = [
            'penerima_aktif' => Mahasiswa::where('aktif', true)
                ->where('status_penerima', StatusPenerima::Penerima)
                ->count(),
            'non_penerima_aktif' => Mahasiswa::where('aktif', true)
                ->where('status_penerima', StatusPenerima::NonPenerima)
                ->count(),
            'alumni' => Mahasiswa::where('status_penerima', StatusPenerima::Alumni)->count(),
            'total_kegiatan' => Kegiatan::query()->terbit()->count(),
            'komsat_aktif' => Komsat::where('aktif', true)->count(),
        ];

        $poinSubquery = PoinTransaksi::query()
            ->selectRaw('mahasiswa_id, SUM(jumlah) as total_poin')
            ->groupBy('mahasiswa_id')
            ->havingRaw('SUM(jumlah) > 0');

        // Ambil seluruh mahasiswa aktif yang memiliki poin > 0 untuk perhitungan peringkat global, 3 tertinggi, dan 3 nilai terendah
        $activeWithPoints = Mahasiswa::query()
            ->select(['mahasiswa.id', 'mahasiswa.user_id', 'mahasiswa.komsat_id', 'poin_agg.total_poin'])
            ->where('mahasiswa.aktif', true)
            ->joinSub($poinSubquery, 'poin_agg', 'poin_agg.mahasiswa_id', '=', 'mahasiswa.id')
            ->with(['user:id,name', 'komsat:id,kode'])
            ->orderByDesc('poin_agg.total_poin')
            ->orderBy('mahasiswa.id')
            ->get()
            ->values()
            ->map(fn (Mahasiswa $m, int $index): array => [
                'peringkat' => $index + 1,
                'nama' => $m->user->name ?? 'Mahasiswa',
                'komsat' => $m->komsat->kode ?? '-',
                'total_poin' => (int) ($m->getAttribute('total_poin') ?? 0),
            ]);

        $leaderboard = $activeWithPoints
            ->when($search !== '', fn ($collection) => $collection->filter(
                fn (array $row): bool => mb_stripos($row['nama'], $search) !== false
            ))
            ->take(10)
            ->values()
            ->all();

        $tertinggi = $activeWithPoints->take(3)->values()->all();

        $terendah = $activeWithPoints
            ->sortBy([
                ['total_poin', 'asc'],
                ['peringkat', 'desc'],
            ])
            ->take(3)
            ->values()
            ->all();

        return Inertia::render('public/statistik', [
            'ringkasan' => $ringkasan,
            'leaderboard' => $leaderboard,
            'tertinggi' => $tertinggi,
            'terendah' => $terendah,
            'filters' => ['q' => $search],
        ]);
    }
}

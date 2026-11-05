<?php

namespace App\Http\Controllers\Public;

use App\Enums\StatusPenerima;
use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            ->select(['mahasiswa.id', 'mahasiswa.user_id', 'mahasiswa.komsat_id', 'mahasiswa.jenis_kelamin', 'mahasiswa.foto_path', 'poin_agg.total_poin'])
            ->where('mahasiswa.aktif', true)
            ->joinSub($poinSubquery, 'poin_agg', 'poin_agg.mahasiswa_id', '=', 'mahasiswa.id')
            ->with(['user:id,name', 'komsat:id,kode'])
            ->orderByDesc('poin_agg.total_poin')
            ->orderBy('mahasiswa.id')
            ->get()
            ->values();

        // Map untuk leaderboard umum (tanpa foto/karakter)
        $mapped = $activeWithPoints->map(fn (Mahasiswa $m, int $index): array => [
            'peringkat' => $index + 1,
            'nama' => $m->user->name ?? 'Mahasiswa',
            'komsat' => $m->komsat->kode ?? '-',
            'total_poin' => (int) ($m->getAttribute('total_poin') ?? 0),
        ]);

        $leaderboard = $mapped
            ->when(
                $search !== '',
                fn ($collection) => $collection->filter(
                    fn (array $row): bool => mb_stripos($row['nama'], $search) !== false
                ),
                fn ($collection) => $collection->slice(3)
            )
            ->take(10)
            ->values()
            ->all();

        // 3 tertinggi dengan foto_url, jenis_kelamin, dan karakter deterministik
        $tertinggi = $activeWithPoints->take(3)->map(function (Mahasiswa $m, int $index): array {
            $fotoUrl = $m->foto_path ? Storage::disk('public')->url($m->foto_path) : null;
            $jenisKelamin = $m->jenis_kelamin;
            $karakter = null;

            if ($fotoUrl === null && $jenisKelamin !== null) {
                if ($jenisKelamin === 'Laki-laki') {
                    $varian = ['karakter-laki-1.svg', 'karakter-laki-2.svg', 'karakter-laki-3.svg'];
                    $karakter = $varian[$m->id % 3];
                } elseif ($jenisKelamin === 'Perempuan') {
                    $varian = ['karakter-perempuan-4.svg', 'karakter-perempuan-5.svg', 'karakter-perempuan-6.svg'];
                    $karakter = $varian[$m->id % 3];
                }
            }

            return [
                'peringkat' => $index + 1,
                'nama' => $m->user->name ?? 'Mahasiswa',
                'komsat' => $m->komsat->kode ?? '-',
                'total_poin' => (int) ($m->getAttribute('total_poin') ?? 0),
                'foto_url' => $fotoUrl,
                'jenis_kelamin' => $jenisKelamin,
                'karakter' => $karakter,
            ];
        })->values()->all();

        $terendah = $mapped
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

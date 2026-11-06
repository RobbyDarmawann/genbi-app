<?php

namespace App\Http\Controllers\Public;

use App\Enums\StatusPenerima;
use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Periode;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(): Response
    {
        $kegiatanTerbaru = Kegiatan::query()
            ->terbit()
            ->with(['komsat:id,kode,nama', 'sesiAbsensi'])
            ->orderBy('tanggal')
            ->orderBy('jam_mulai')
            ->take(3)
            ->get()
            ->map(function (Kegiatan $item): array {
                $statusEfektif = $item->statusEfektif();

                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'tanggal' => $item->tanggal->toDateString(),
                    'tanggal_selesai' => $item->tanggalSelesaiEfektif()->toDateString(),
                    'jam_mulai' => substr($item->jam_mulai, 0, 5),
                    'jam_selesai' => substr($item->jam_selesai, 0, 5),
                    'lokasi_nama' => $item->lokasi_nama,
                    'penyelenggara' => $item->komsat !== null ? $item->komsat->nama : 'Wilayah GenBI Gorontalo',
                    'status' => $statusEfektif->value,
                    'status_label' => $statusEfektif->label(),
                ];
            });

        $ringkasan = [
            'penerima_aktif' => Mahasiswa::where('aktif', true)
                ->where('status_penerima', StatusPenerima::Penerima)
                ->count(),
            'total_kegiatan' => Kegiatan::query()->terbit()->count(),
            'komsat_aktif' => Komsat::where('aktif', true)->count(),
        ];

        $komsat = Komsat::query()
            ->where('aktif', true)
            ->orderBy('id')
            ->get(['id', 'kode', 'nama'])
            ->all();

        $periodeAktif = Periode::query()->aktif()->first(['id', 'nama', 'aktif']);

        return Inertia::render('welcome', [
            'kegiatan_terbaru' => $kegiatanTerbaru,
            'ringkasan' => $ringkasan,
            'komsat' => $komsat,
            'periode_aktif' => $periodeAktif,
        ]);
    }
}

<?php

namespace App\Http\Controllers\Public;

use App\Enums\StatusKegiatan;
use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class JadwalController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('q')->trim()->toString();

        $kegiatan = Kegiatan::query()
            ->terbit()
            ->with('komsat:id,kode,nama')
            ->when($search !== '', fn ($query) => $query->where('judul', 'like', "%{$search}%"))
            ->urutJadwal()
            ->paginate(9)
            ->withQueryString()
            ->through(function (Kegiatan $item): array {
                $statusEfektif = $item->statusEfektif();

                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'tanggal' => $item->tanggal->toDateString(),
                    'jam_mulai' => substr($item->jam_mulai, 0, 5),
                    'jam_selesai' => substr($item->jam_selesai, 0, 5),
                    'lokasi_nama' => $item->lokasi_nama,
                    'penyelenggara' => $item->komsat !== null ? $item->komsat->nama : 'Wilayah GenBI Gorontalo',
                    'status' => $statusEfektif->value,
                    'status_label' => $statusEfektif->label(),
                ];
            });

        return Inertia::render('public/jadwal', [
            'kegiatan' => $kegiatan,
            'filters' => ['q' => $search],
        ]);
    }

    public function show(Kegiatan $kegiatan): Response
    {
        $statusEfektif = $kegiatan->statusEfektif();
        abort_unless(in_array($statusEfektif, [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung, StatusKegiatan::Selesai, StatusKegiatan::Terkunci], true), 404);
        $kegiatan->load('komsat:id,kode,nama');

        return Inertia::render('public/jadwal-show', [
            'kegiatan' => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'deskripsi' => $kegiatan->deskripsi,
                'tanggal' => $kegiatan->tanggal->toDateString(),
                'jam_mulai' => substr($kegiatan->jam_mulai, 0, 5),
                'jam_selesai' => substr($kegiatan->jam_selesai, 0, 5),
                'lokasi_nama' => $kegiatan->lokasi_nama,
                'penyelenggara' => $kegiatan->komsat !== null ? $kegiatan->komsat->nama : 'Wilayah GenBI Gorontalo',
                'status' => $statusEfektif->value,
                'status_label' => $statusEfektif->label(),
            ],
        ]);
    }
}

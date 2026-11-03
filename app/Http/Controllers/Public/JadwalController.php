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
            ->whereIn('status', [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung, StatusKegiatan::Selesai, StatusKegiatan::Terkunci])
            ->with('komsat:id,kode,nama')
            ->when($search !== '', fn ($query) => $query->where('judul', 'like', "%{$search}%"))
            ->orderBy('tanggal')
            ->orderBy('jam_mulai')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Kegiatan $item): array => [
                'id' => $item->id,
                'judul' => $item->judul,
                'deskripsi' => $item->deskripsi,
                'tanggal' => $item->tanggal->toDateString(),
                'jam_mulai' => substr($item->jam_mulai, 0, 5),
                'jam_selesai' => substr($item->jam_selesai, 0, 5),
                'lokasi_nama' => $item->lokasi_nama,
                'penyelenggara' => $item->komsat !== null ? $item->komsat->nama : 'Wilayah GenBI Gorontalo',
                'status' => $item->status->value,
                'status_label' => $item->status->label(),
            ]);

        return Inertia::render('public/jadwal', [
            'kegiatan' => $kegiatan,
            'filters' => ['q' => $search],
        ]);
    }

    public function show(Kegiatan $kegiatan): Response
    {
        abort_unless(in_array($kegiatan->status, [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung, StatusKegiatan::Selesai, StatusKegiatan::Terkunci], true), 404);
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
                'status' => $kegiatan->status->value,
                'status_label' => $kegiatan->status->label(),
            ],
        ]);
    }
}

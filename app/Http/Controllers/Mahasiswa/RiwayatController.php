<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Enums\TipePoin;
use App\Http\Controllers\Controller;
use App\Models\Mahasiswa;
use App\Models\PoinTransaksi;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RiwayatController extends Controller
{
    public function kehadiran(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $kehadiran = $mahasiswa->pendaftaran()
            ->with(['kegiatan:id,judul,tanggal', 'kehadiran.poinTransaksi:id,kehadiran_id,jumlah'])
            ->whereHas('kehadiran')
            ->latest('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn ($p) => [
                'kegiatan_id' => $p->kegiatan->id,
                'kegiatan_judul' => $p->kegiatan->judul,
                'kegiatan_tanggal' => $p->kegiatan->tanggal->toDateString(),
                'peran_label' => $p->peran->label(),
                'kehadiran' => $p->kehadiran ? [
                    'id' => $p->kehadiran->id,
                    'waktu_checkin' => $p->kehadiran->waktu_checkin->toIso8601String(),
                    'status' => $p->kehadiran->status->value,
                    'status_label' => $p->kehadiran->status->label(),
                    'jarak_m' => $p->kehadiran->jarak_m,
                    'akurasi_m' => $p->kehadiran->akurasi_m,
                    'alasan_penolakan' => $p->kehadiran->alasan_penolakan,
                    'has_foto' => $p->kehadiran->foto_path !== null,
                ] : null,
                'poin' => $p->kehadiran && $p->kehadiran->status->value === 'valid'
                    ? (int) ($p->kehadiran->poinTransaksi->jumlah ?? 0)
                    : null,
            ]);

        return Inertia::render('mahasiswa/kehadiran/index', [
            'kehadiran' => $kehadiran,
        ]);
    }

    public function poin(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $transaksi = $mahasiswa->poinTransaksi()
            ->with('kegiatan:id,judul')
            ->latest('id')
            ->paginate(20)
            ->withQueryString()
            ->through(fn (PoinTransaksi $t): array => [
                'id' => $t->id,
                'kegiatan_judul' => $t->kegiatan?->judul,
                'tipe' => $t->tipe->value,
                'tipe_label' => $t->tipe === TipePoin::Kredit ? 'Kredit' : 'Koreksi',
                'jumlah' => $t->jumlah,
                'keterangan' => $t->keterangan,
                'tanggal' => $t->created_at?->toIso8601String(),
            ]);

        return Inertia::render('mahasiswa/poin/riwayat', [
            'transaksi' => $transaksi,
            'total_poin' => $mahasiswa->totalPoin(),
        ]);
    }
}

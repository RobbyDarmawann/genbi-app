<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Enums\StatusPendaftaran;
use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Mahasiswa;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $totalPoin = $mahasiswa->totalPoin();
        $jumlahKegiatanDiikuti = $mahasiswa->pendaftaran()
            ->where('status', StatusPendaftaran::Terdaftar)
            ->count();
        $jumlahKehadiranValid = $mahasiswa->pendaftaran()
            ->whereHas('kehadiran', fn ($q) => $q->where('status', StatusKehadiran::Valid))
            ->count();
        $jumlahKoreksiMenunggu = $mahasiswa->koreksi()
            ->where('status', StatusKoreksi::Menunggu)
            ->count();

        // Kegiatan saya yang akan datang (terdaftar aktif)
        $kegiatanMendatang = $mahasiswa->pendaftaran()
            ->where('status', StatusPendaftaran::Terdaftar)
            ->whereHas('kegiatan', fn ($q) => $q->whereIn('status', [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung]))
            ->with(['kegiatan.komsat:id,kode,nama', 'kehadiran'])
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(fn ($p) => [
                'id' => $p->kegiatan->id,
                'judul' => $p->kegiatan->judul,
                'tanggal' => $p->kegiatan->tanggal->toDateString(),
                'jam_mulai' => $p->kegiatan->jam_mulai,
                'jam_selesai' => $p->kegiatan->jam_selesai,
                'lokasi_nama' => $p->kegiatan->lokasi_nama,
                'status_kegiatan' => $p->kegiatan->status->value,
                'status_kegiatan_label' => $p->kegiatan->status->label(),
                'peran_label' => $p->peran->label(),
                'kehadiran' => $p->kehadiran ? [
                    'id' => $p->kehadiran->id,
                    'status' => $p->kehadiran->status->value,
                    'status_label' => $p->kehadiran->status->label(),
                ] : null,
            ]);

        // Leaderboard: hanya nama, komsat, dan total poin (tanpa mengekspos NIM atau data pribadi)
        $allRanked = Mahasiswa::query()
            ->where('aktif', true)
            ->with(['user:id,name', 'komsat:id,kode'])
            ->withSum('poinTransaksi as total_poin', 'jumlah')
            ->orderByDesc('total_poin')
            ->orderBy('id')
            ->get();

        $userRank = null;
        foreach ($allRanked as $index => $m) {
            if ($m->id === $mahasiswa->id) {
                $userRank = $index + 1;
                break;
            }
        }

        $topLeaderboard = $allRanked->take(10)->map(fn ($m, $index) => [
            'peringkat' => $index + 1,
            'nama' => $m->user->name ?? 'Anggota GenBI',
            'komsat_kode' => $m->komsat->kode,
            'total_poin' => (int) ($m->total_poin ?? 0),
            'is_current_user' => $m->id === $mahasiswa->id,
        ])->all();

        return Inertia::render('mahasiswa/dashboard', [
            'ringkasan' => [
                'total_poin' => $totalPoin,
                'jumlah_kegiatan' => $jumlahKegiatanDiikuti,
                'jumlah_hadir_valid' => $jumlahKehadiranValid,
                'jumlah_koreksi_menunggu' => $jumlahKoreksiMenunggu,
                'peringkat_saya' => $userRank ?? '-',
            ],
            'kegiatan_mendatang' => $kegiatanMendatang,
            'leaderboard' => $topLeaderboard,
        ]);
    }
}

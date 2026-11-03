<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Kegiatan\LockActivityAction;
use App\Actions\Kegiatan\ReviewAttendanceAction;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Enums\StatusPendaftaran;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ReviewAttendanceRequest;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Koreksi;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MonitoringKegiatanController extends Controller
{
    /**
     * Tampilkan daftar monitoring kehadiran seluruh kegiatan.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Kegiatan::class);

        $kegiatan = Kegiatan::query()
            ->with(['komsat:id,kode,nama'])
            ->withCount([
                'pendaftaran as jumlah_terdaftar' => fn ($q) => $q->where('status', StatusPendaftaran::Terdaftar),
                'kehadiran as jumlah_valid' => fn ($q) => $q->where('kehadiran.status', StatusKehadiran::Valid),
                'kehadiran as jumlah_menunggu' => fn ($q) => $q->where('kehadiran.status', StatusKehadiran::MenungguTinjau),
            ])
            ->when($request->string('q')->trim()->toString(), fn ($q, $term) => $q->where('judul', 'like', "%{$term}%"))
            ->when(StatusKegiatan::tryFrom($request->string('status')->trim()->toString()), fn ($q, StatusKegiatan $s) => $q->statusEfektif($s))
            ->orderByDesc('tanggal')
            ->orderByDesc('id')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Kegiatan $k): array => [
                'id' => $k->id,
                'judul' => $k->judul,
                'status' => $k->statusEfektif()->value,
                'status_label' => $k->statusEfektifLabel(),
                'tanggal' => $k->tanggal->toDateString(),
                'lokasi_nama' => $k->lokasi_nama,
                'komsat_kode' => $k->komsat?->kode,
                'jumlah_terdaftar' => (int) ($k->getAttribute('jumlah_terdaftar') ?? 0),
                'jumlah_valid' => (int) ($k->getAttribute('jumlah_valid') ?? 0),
                'jumlah_menunggu' => (int) ($k->getAttribute('jumlah_menunggu') ?? 0),
            ]);

        return Inertia::render('admin/kehadiran/index', [
            'kegiatan' => $kegiatan,
            'filters' => [
                'q' => $request->string('q')->toString(),
                'status' => $request->string('status')->toString(),
            ],
        ]);
    }

    /**
     * Tampilkan monitoring kehadiran spesifik per kegiatan (dengan polling).
     */
    public function show(Request $request, Kegiatan $kegiatan): Response
    {
        Gate::authorize('view', $kegiatan);

        $kegiatan->load(['divisiTarget:id,nama,komsat_id']);
        $jumlahTerdaftar = $kegiatan->pendaftaran()->where('status', StatusPendaftaran::Terdaftar)->count();
        $jumlahValid = $kegiatan->kehadiran()->where('kehadiran.status', StatusKehadiran::Valid)->count();
        $jumlahMenunggu = $kegiatan->kehadiran()->where('kehadiran.status', StatusKehadiran::MenungguTinjau)->count();
        $jumlahDitolak = $kegiatan->kehadiran()->where('kehadiran.status', StatusKehadiran::Ditolak)->count();

        $peserta = Pendaftaran::query()
            ->where('kegiatan_id', $kegiatan->id)
            ->where('status', StatusPendaftaran::Terdaftar)
            ->with([
                'mahasiswa.user:id,name',
                'mahasiswa.komsat:id,kode',
                'mahasiswa.divisi:id,nama',
                'kehadiran.poinTransaksi:id,kehadiran_id,jumlah',
            ])
            ->get()
            ->map(fn (Pendaftaran $p): array => [
                'id' => $p->id,
                'nama' => $p->mahasiswa->user->name ?? 'Tidak tersedia',
                'nim' => $p->mahasiswa->nim,
                'komsat_kode' => $p->mahasiswa->komsat->kode,
                'divisi_nama' => $p->mahasiswa->divisi->nama,
                'peran_label' => $p->peran->label(),
                'kehadiran' => $p->kehadiran ? [
                    'id' => $p->kehadiran->id,
                    'status' => $p->kehadiran->status->value,
                    'status_label' => $p->kehadiran->status->label(),
                    'waktu_checkin' => $p->kehadiran->waktu_checkin->toIso8601String(),
                    'jarak_m' => $p->kehadiran->jarak_m,
                    'akurasi_m' => $p->kehadiran->akurasi_m,
                    'alasan_penolakan' => $p->kehadiran->alasan_penolakan,
                    'has_foto' => $p->kehadiran->foto_path !== null,
                    'poin_terkredit' => $p->kehadiran->poinTransaksi->jumlah ?? null,
                ] : null,
            ]);

        // Daftar detail item penghambat kunci
        $kehadiranMenungguList = $kegiatan->kehadiran()
            ->where('kehadiran.status', StatusKehadiran::MenungguTinjau)
            ->with(['pendaftaran.mahasiswa.user:id,name'])
            ->get()
            ->map(fn (Kehadiran $kh): array => [
                'id' => $kh->id,
                'nama' => $kh->pendaftaran->mahasiswa->user->name ?? 'Mahasiswa',
                'nim' => $kh->pendaftaran->mahasiswa->nim,
                'tipe' => 'Kehadiran menunggu tinjau',
            ])
            ->all();

        $koreksiMenungguList = $kegiatan->koreksi()
            ->where('status', StatusKoreksi::Menunggu)
            ->with(['mahasiswa.user:id,name'])
            ->get()
            ->map(fn (Koreksi $kor): array => [
                'id' => $kor->id,
                'nama' => $kor->mahasiswa->user->name ?? 'Mahasiswa',
                'nim' => $kor->mahasiswa->nim,
                'tipe' => 'Koreksi kehadiran menunggu proses',
            ])
            ->all();

        $statusEfektif = $kegiatan->statusEfektif();
        $dapatDikunci = $statusEfektif === StatusKegiatan::Selesai
            && count($kehadiranMenungguList) === 0
            && count($koreksiMenungguList) === 0;

        return Inertia::render('admin/kegiatan/monitoring', [
            'kegiatan' => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'status' => $statusEfektif->value,
                'status_label' => $statusEfektif->label(),
                'tanggal' => $kegiatan->tanggal->toDateString(),
                'jam_selesai' => $kegiatan->jam_selesai,
                'kuota' => $kegiatan->kuota,
                'dapat_dikunci' => $dapatDikunci,
            ],
            'ringkasan' => [
                'divisi_target' => $kegiatan->divisiTarget->map(fn ($d): array => ['nama' => $d->nama, 'komsat_id' => $d->komsat_id])->all(),
                'kuota' => $kegiatan->kuota,
                'jumlah_terdaftar' => $jumlahTerdaftar,
                'jumlah_valid' => $jumlahValid,
                'jumlah_menunggu' => $jumlahMenunggu,
                'jumlah_ditolak' => $jumlahDitolak,
                'belum_hadir' => max(0, $jumlahTerdaftar - $jumlahValid - $jumlahMenunggu - $jumlahDitolak),
            ],
            'peserta' => $peserta,
            'penghambat_kunci' => [
                'kehadiran_menunggu' => count($kehadiranMenungguList),
                'koreksi_menunggu' => count($koreksiMenungguList),
                'daftar_penghambat' => array_merge($kehadiranMenungguList, $koreksiMenungguList),
            ],
        ]);
    }

    /**
     * Tinjau kehadiran menunggu tinjau (setujui / tolak).
     */
    public function reviewAttendance(
        ReviewAttendanceRequest $request,
        Kegiatan $kegiatan,
        Kehadiran $kehadiran,
        ReviewAttendanceAction $action
    ): RedirectResponse {
        Gate::authorize('review', $kehadiran);

        // Pastikan kehadiran benar-benar milik kegiatan terkait
        abort_unless($kehadiran->pendaftaran->kegiatan_id === $kegiatan->id, 404);

        /** @var User $actor */
        $actor = $request->user();

        if ($request->validated('status') === 'valid') {
            $action->approve($kehadiran, $actor, $request->ip());
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Kehadiran disetujui dan poin dikreditkan.']);
        } else {
            $action->reject($kehadiran, (string) $request->validated('alasan'), $actor, $request->ip());
            Inertia::flash('toast', ['type' => 'success', 'message' => 'Kehadiran ditolak.']);
        }

        return back();
    }

    /**
     * Kunci kegiatan (terkunci) setelah selesai dan bebas penghambat.
     */
    public function lock(Request $request, Kegiatan $kegiatan, LockActivityAction $action): RedirectResponse
    {
        Gate::authorize('update', $kegiatan);

        /** @var User $actor */
        $actor = $request->user();
        $action->lock($kegiatan, $actor, $request->ip());

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Kegiatan berhasil dikunci. Data absensi dan peserta dibekukan.']);

        return back();
    }
}

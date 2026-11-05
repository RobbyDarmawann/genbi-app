<?php

namespace App\Http\Controllers\Mahasiswa;

use App\Actions\Pendaftaran\CancelRegistrationAction;
use App\Actions\Pendaftaran\RegisterForActivityAction;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Http\Controllers\Controller;
use App\Http\Requests\Mahasiswa\BatalPendaftaranMahasiswaRequest;
use App\Http\Requests\Mahasiswa\DaftarKegiatanRequest;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class KegiatanController extends Controller
{
    public function index(Request $request): Response
    {
        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $search = $request->string('q')->trim()->toString();
        $tabInput = $request->string('tab')->toString();
        $hasExplicitUntukSaya = $request->has('untuk_saya');
        $forMeOnly = $hasExplicitUntukSaya
            ? $request->boolean('untuk_saya')
            : ($tabInput !== 'semua');
        $activeTab = $forMeOnly ? 'untuk_saya' : 'semua';

        $query = Kegiatan::query()
            ->terbit()
            ->with([
                'komsat:id,kode,nama',
                'divisiTarget.komsat:id,kode,nama',
                'bobot',
                'pendaftaran' => fn ($q) => $q->where('mahasiswa_id', $mahasiswa->id)->with('kehadiran'),
            ])
            ->withCount([
                'pendaftaran as jumlah_pendaftar' => fn ($q) => $q->where('status', StatusPendaftaran::Terdaftar),
            ])
            ->when($search !== '', fn ($q) => $q->where('judul', 'like', "%{$search}%"));

        if ($forMeOnly) {
            $query->whereHas('divisiTarget', fn ($q) => $q->where('divisi.id', $mahasiswa->divisi_id));
        }

        $pageName = $forMeOnly ? 'halaman_untuk_saya' : 'halaman_semua';
        $kegiatan = $query
            ->urutJadwal()
            ->paginate(9, ['*'], $pageName)
            ->withQueryString()
            ->through(function (Kegiatan $item) use ($mahasiswa): array {
                $statusEfektif = $item->statusEfektif();
                $targeted = $item->divisiTarget->contains('id', $mahasiswa->divisi_id);
                /** @var Pendaftaran|null $pendaftaran */
                $pendaftaran = $item->pendaftaran->first();
                $jumlahPendaftar = (int) ($item->getAttribute('jumlah_pendaftar') ?? 0);
                $bobotMap = $item->bobot->mapWithKeys(
                    fn (KegiatanBobot $b): array => [$b->peran->value => $b->poin]
                )->all();
                $peranAktif = ($pendaftaran !== null && $pendaftaran->status === StatusPendaftaran::Terdaftar)
                    ? $pendaftaran->peran
                    : PeranKegiatan::Peserta;
                [$statusTampil, $statusLabel] = $this->resolveStudentRegistrationStatus($pendaftaran);

                return [
                    'id' => $item->id,
                    'judul' => $item->judul,
                    'deskripsi' => $item->deskripsi,
                    'tanggal' => $item->tanggal->toDateString(),
                    'jam_mulai' => substr($item->jam_mulai, 0, 5),
                    'jam_selesai' => substr($item->jam_selesai, 0, 5),
                    'lokasi_nama' => $item->lokasi_nama,
                    'komsat' => $item->komsat !== null ? [
                        'id' => $item->komsat->id,
                        'kode' => $item->komsat->kode,
                        'nama' => $item->komsat->nama,
                    ] : null,
                    'status' => $statusEfektif->value,
                    'status_label' => $statusEfektif->label(),
                    'kuota' => $item->kuota,
                    'jumlah_pendaftar' => $jumlahPendaftar,
                    'sisa_kuota' => $item->kuota !== null ? max(0, $item->kuota - $jumlahPendaftar) : null,
                    'ditargetkan_untuk_saya' => $targeted,
                    'is_target_divisi' => $targeted,
                    'status_pendaftaran' => $pendaftaran?->status->value,
                    'status_pendaftaran_tampil' => $statusTampil,
                    'status_pendaftaran_label' => $statusLabel,
                    'peran_saya' => $pendaftaran?->peran->value,
                    'peran_saya_label' => $peranAktif->label(),
                    'poin_peran_saya' => $bobotMap[$peranAktif->value] ?? ($bobotMap['peserta'] ?? 0),
                    'bobot_poin' => $bobotMap,
                ];
            });

        return Inertia::render('mahasiswa/kegiatan/index', [
            'kegiatan' => $kegiatan,
            'mahasiswaInfo' => [
                'nama' => $user->name,
                'komsat_kode' => $mahasiswa->komsat?->kode,
                'komsat_nama' => $mahasiswa->komsat?->nama,
                'divisi_id' => $mahasiswa->divisi_id,
                'divisi_nama' => $mahasiswa->divisi?->nama,
            ],
            'filters' => [
                'q' => $search,
                'tab' => $activeTab,
                'untuk_saya' => $forMeOnly,
            ],
        ]);
    }

    public function show(Request $request, Kegiatan $kegiatan): Response
    {
        Gate::authorize('viewAsMahasiswa', $kegiatan);

        /** @var User $user */
        $user = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $user->mahasiswa;

        $kegiatan->load([
            'komsat:id,kode,nama',
            'divisiTarget.komsat:id,kode,nama',
            'bobot',
        ])->loadCount([
            'pendaftaran as jumlah_pendaftar' => fn ($q) => $q->where('status', StatusPendaftaran::Terdaftar),
        ]);

        $targeted = $kegiatan->divisiTarget->contains('id', $mahasiswa->divisi_id);
        $pendaftaran = $kegiatan->pendaftaran()
            ->with('kehadiran.poinTransaksi')
            ->where('mahasiswa_id', $mahasiswa->id)
            ->first();

        $jumlahPendaftar = (int) ($kegiatan->getAttribute('jumlah_pendaftar') ?? 0);
        $bobotMap = $kegiatan->bobot->mapWithKeys(
            fn (KegiatanBobot $b): array => [$b->peran->value => $b->poin]
        )->all();
        $peranEfektif = ($pendaftaran !== null && $pendaftaran->status === StatusPendaftaran::Terdaftar)
            ? $pendaftaran->peran
            : PeranKegiatan::Peserta;

        [$statusTampil, $statusLabel] = $this->resolveStudentRegistrationStatus($pendaftaran);
        $now = Carbon::now(config('app.timezone'));
        $statusEfektif = $kegiatan->statusEfektif();
        $statusKegiatanBuka = ! in_array($statusEfektif, [StatusKegiatan::Draft, StatusKegiatan::Dibatalkan, StatusKegiatan::Terkunci], true);
        $belumDibuka = $kegiatan->pendaftaran_dibuka_at !== null && $now->lt($kegiatan->pendaftaran_dibuka_at);
        $lewatBatasDaftar = $kegiatan->batas_daftar_at !== null && $now->gt($kegiatan->batas_daftar_at);
        $kuotaPenuh = $kegiatan->kuota !== null && $jumlahPendaftar >= $kegiatan->kuota;
        $sudahTerdaftarAktif = $pendaftaran !== null && $pendaftaran->status === StatusPendaftaran::Terdaftar;
        $memilikiKehadiran = $pendaftaran?->kehadiran !== null;

        $dapatMendaftar = $targeted
            && ! $sudahTerdaftarAktif
            && ! $memilikiKehadiran
            && $statusKegiatanBuka
            && ! $belumDibuka
            && ! $lewatBatasDaftar
            && ! $kuotaPenuh;

        $dapatMembatalkan = $sudahTerdaftarAktif
            && ! $memilikiKehadiran
            && $statusKegiatanBuka
            && ! $lewatBatasDaftar
            && $now->lte($kegiatan->absensi_tutup_at);

        $dapatAbsen = $sudahTerdaftarAktif
            && ! $memilikiKehadiran
            && $statusKegiatanBuka
            && $now->gte($kegiatan->absensi_buka_at)
            && $now->lte($kegiatan->absensi_tutup_at);

        $alasanTidakDapatMendaftar = null;
        if (! $targeted) {
            $alasanTidakDapatMendaftar = 'Kegiatan ini ditujukan untuk divisi terpilih.';
        } elseif (! $sudahTerdaftarAktif) {
            if (! $statusKegiatanBuka) {
                $alasanTidakDapatMendaftar = 'Pendaftaran kegiatan sudah ditutup.';
            } elseif ($belumDibuka) {
                $alasanTidakDapatMendaftar = 'Waktu pendaftaran kegiatan belum dibuka.';
            } elseif ($lewatBatasDaftar) {
                $alasanTidakDapatMendaftar = 'Batas waktu pendaftaran kegiatan telah berakhir.';
            } elseif ($kuotaPenuh) {
                $alasanTidakDapatMendaftar = 'Kuota peserta untuk kegiatan ini telah penuh.';
            }
        }

        return Inertia::render('mahasiswa/kegiatan/show', [
            'kegiatan' => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'deskripsi' => $kegiatan->deskripsi,
                'tanggal' => $kegiatan->tanggal->toDateString(),
                'jam_mulai' => substr($kegiatan->jam_mulai, 0, 5),
                'jam_selesai' => substr($kegiatan->jam_selesai, 0, 5),
                'lokasi_nama' => $kegiatan->lokasi_nama,
                'komsat' => $kegiatan->komsat !== null ? [
                    'id' => $kegiatan->komsat->id,
                    'kode' => $kegiatan->komsat->kode,
                    'nama' => $kegiatan->komsat->nama,
                ] : null,
                'status' => $statusEfektif->value,
                'status_label' => $statusEfektif->label(),
                'kuota' => $kegiatan->kuota,
                'jumlah_pendaftar' => $jumlahPendaftar,
                'sisa_kuota' => $kegiatan->kuota !== null ? max(0, $kegiatan->kuota - $jumlahPendaftar) : null,
                'batas_daftar_at' => $kegiatan->batas_daftar_at?->toIso8601String(),
                'pendaftaran_dibuka_at' => $kegiatan->pendaftaran_dibuka_at?->toIso8601String(),
                'absensi_buka_at' => $kegiatan->absensi_buka_at->toIso8601String(),
                'absensi_tutup_at' => $kegiatan->absensi_tutup_at->toIso8601String(),
                'divisi_target' => $kegiatan->divisiTarget->map(fn (Divisi $d): array => [
                    'id' => $d->id,
                    'nama' => $d->nama,
                    'komsat_id' => $d->komsat_id,
                    'komsat_kode' => $d->komsat?->kode,
                    'komsat_nama' => $d->komsat?->nama,
                ])->values()->all(),
                'bobot_poin' => $bobotMap,
                'bobot_list' => array_map(fn (PeranKegiatan $peran): array => [
                    'peran' => $peran->value,
                    'label' => $peran->label(),
                    'poin' => $bobotMap[$peran->value] ?? null,
                ], PeranKegiatan::cases()),
            ],
            'ditargetkan_untuk_saya' => $targeted,
            'is_target_divisi' => $targeted,
            'status_pendaftaran_tampil' => $statusTampil,
            'status_pendaftaran_label' => $statusLabel,
            'dapat_mendaftar' => $dapatMendaftar,
            'dapat_membatalkan' => $dapatMembatalkan,
            'dapat_absen' => $dapatAbsen,
            'alasan_tidak_dapat_mendaftar' => $alasanTidakDapatMendaftar,
            'pendaftaran' => $pendaftaran !== null ? [
                'id' => $pendaftaran->id,
                'peran' => $pendaftaran->peran->value,
                'peran_label' => $pendaftaran->peran->label(),
                'status' => $pendaftaran->status->value,
                'status_tampil' => $statusTampil,
                'status_label' => $statusLabel,
                'poin' => $bobotMap[$pendaftaran->peran->value] ?? 0,
                'sudah_hadir' => $pendaftaran->kehadiran?->status === StatusKehadiran::Valid,
                'memiliki_kehadiran' => $pendaftaran->kehadiran !== null,
                'kehadiran' => $pendaftaran->kehadiran !== null ? [
                    'status' => $pendaftaran->kehadiran->status->value,
                    'status_label' => $pendaftaran->kehadiran->status->label(),
                    'alasan' => $pendaftaran->kehadiran->alasan_penolakan,
                    'poin_terkredit' => $pendaftaran->kehadiran->poinTransaksi !== null
                        ? $pendaftaran->kehadiran->poinTransaksi->jumlah
                        : 0,
                ] : null,
                'created_at' => $pendaftaran->created_at?->toIso8601String(),
            ] : null,
            'peran_efektif' => [
                'peran' => $peranEfektif->value,
                'label' => $peranEfektif->label(),
                'poin' => $bobotMap[$peranEfektif->value] ?? 0,
            ],
        ]);
    }

    public function daftar(DaftarKegiatanRequest $request, Kegiatan $kegiatan, RegisterForActivityAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $actor->mahasiswa;

        $action->handle($kegiatan, $mahasiswa, $actor, $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Berhasil mendaftar kegiatan sebagai peserta.']);

        return to_route('mahasiswa.kegiatan.show', $kegiatan);
    }

    public function batal(BatalPendaftaranMahasiswaRequest $request, Kegiatan $kegiatan, CancelRegistrationAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        /** @var Mahasiswa $mahasiswa */
        $mahasiswa = $actor->mahasiswa;

        $action->handle($kegiatan, $mahasiswa, $actor, $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pendaftaran kegiatan berhasil dibatalkan.']);

        return to_route('mahasiswa.kegiatan.show', $kegiatan);
    }

    /**
     * @return array{0: string, 1: string}
     */
    private function resolveStudentRegistrationStatus(?Pendaftaran $pendaftaran): array
    {
        if ($pendaftaran === null) {
            return ['belum_terdaftar', 'Belum Terdaftar'];
        }

        if ($pendaftaran->status === StatusPendaftaran::Batal) {
            return ['batal', 'Batal'];
        }

        if ($pendaftaran->kehadiran?->status === StatusKehadiran::Valid) {
            return ['sudah_hadir', 'Sudah Hadir'];
        }

        return ['terdaftar', 'Terdaftar'];
    }
}

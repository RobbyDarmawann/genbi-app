<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Pendaftaran\AdminCancelRegistrationAction;
use App\Actions\Pendaftaran\ChangeParticipantRoleAction;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\BatalkanPendaftaranRequest;
use App\Http\Requests\Admin\UbahPeranPendaftarRequest;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Pendaftaran;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PesertaKegiatanController extends Controller
{
    public function index(Request $request, Kegiatan $kegiatan): Response
    {
        Gate::authorize('view', $kegiatan);

        $search = $request->string('q')->trim()->toString();
        $statusFilter = StatusPendaftaran::tryFrom($request->string('status')->toString());
        $peranFilter = PeranKegiatan::tryFrom($request->string('peran')->toString());

        $kegiatan->load('bobot')->loadCount([
            'pendaftaran as jumlah_terdaftar' => fn ($query) => $query->where('status', StatusPendaftaran::Terdaftar),
            'kehadiran as jumlah_hadir' => fn ($query) => $query->where('kehadiran.status', StatusKehadiran::Valid),
        ]);

        $bobotMap = $kegiatan->bobot->mapWithKeys(
            fn (KegiatanBobot $b): array => [$b->peran->value => $b->poin]
        )->all();

        $jumlahTerdaftar = (int) ($kegiatan->getAttribute('jumlah_terdaftar') ?? 0);
        $jumlahHadir = (int) ($kegiatan->getAttribute('jumlah_hadir') ?? 0);
        $isKegiatanTerkunciAtauBatal = in_array($kegiatan->status, [StatusKegiatan::Terkunci, StatusKegiatan::Dibatalkan], true);

        $peserta = $kegiatan->pendaftaran()
            ->with([
                'mahasiswa.user:id,name,username',
                'mahasiswa.komsat:id,kode,nama',
                'mahasiswa.divisi:id,nama',
                'kehadiran',
            ])
            ->when($search !== '', function ($query) use ($search): void {
                $query->whereHas('mahasiswa', function ($mhsQuery) use ($search): void {
                    $mhsQuery->where('nim', 'like', "%{$search}%")
                        ->orWhereHas('user', fn ($uQuery) => $uQuery->where('name', 'like', "%{$search}%"));
                });
            })
            ->when($statusFilter !== null, fn ($query) => $query->where('status', $statusFilter))
            ->when($peranFilter !== null, fn ($query) => $query->where('peran', $peranFilter))
            ->orderByRaw("CASE WHEN status = 'terdaftar' THEN 0 ELSE 1 END")
            ->orderByDesc('id')
            ->paginate(20)
            ->withQueryString()
            ->through(function (Pendaftaran $pendaftaran) use ($bobotMap, $kegiatan, $isKegiatanTerkunciAtauBatal): array {
                $kehadiran = $pendaftaran->kehadiran;
                $hadirValid = $kehadiran?->status === StatusKehadiran::Valid;
                $terdaftarAktif = $pendaftaran->status === StatusPendaftaran::Terdaftar;

                return [
                    'id' => $pendaftaran->id,
                    'nama' => $pendaftaran->mahasiswa->user->name,
                    'nim' => $pendaftaran->mahasiswa->nim,
                    'komsat_kode' => $pendaftaran->mahasiswa->komsat->kode,
                    'komsat_nama' => $pendaftaran->mahasiswa->komsat->nama,
                    'divisi_nama' => $pendaftaran->mahasiswa->divisi->nama,
                    'peran' => $pendaftaran->peran->value,
                    'peran_label' => $pendaftaran->peran->label(),
                    'poin_potensial' => $bobotMap[$pendaftaran->peran->value] ?? 0,
                    'status' => $pendaftaran->status->value,
                    'status_label' => $pendaftaran->status->label(),
                    'waktu_daftar' => ($pendaftaran->updated_at ?? $pendaftaran->created_at)?->toIso8601String(),
                    'status_kehadiran' => $kehadiran?->status->value,
                    'status_kehadiran_label' => $kehadiran !== null ? $kehadiran->status->label() : 'Belum Hadir',
                    'dapat_ubah_peran' => $terdaftarAktif && ! $isKegiatanTerkunciAtauBatal && ! $hadirValid,
                    'dapat_batalkan' => $terdaftarAktif && $kegiatan->status !== StatusKegiatan::Terkunci && $kehadiran === null,
                ];
            });

        return Inertia::render('admin/kegiatan/peserta', [
            'kegiatan' => [
                'id' => $kegiatan->id,
                'judul' => $kegiatan->judul,
                'status' => $kegiatan->status->value,
                'status_label' => $kegiatan->status->label(),
                'kuota' => $kegiatan->kuota,
                'jumlah_terdaftar' => $jumlahTerdaftar,
                'jumlah_hadir' => $jumlahHadir,
                'sisa_kuota' => $kegiatan->kuota !== null ? max(0, $kegiatan->kuota - $jumlahTerdaftar) : null,
            ],
            'peserta' => $peserta,
            'peranOptions' => array_map(fn (PeranKegiatan $peran): array => [
                'value' => $peran->value,
                'label' => $peran->label(),
                'poin' => $bobotMap[$peran->value] ?? 0,
            ], PeranKegiatan::cases()),
            'statusOptions' => array_map(fn (StatusPendaftaran $status): array => [
                'value' => $status->value,
                'label' => $status->label(),
            ], StatusPendaftaran::cases()),
            'filters' => [
                'q' => $search,
                'status' => $statusFilter?->value ?? '',
                'peran' => $peranFilter?->value ?? '',
            ],
        ]);
    }

    public function changeRole(UbahPeranPendaftarRequest $request, Kegiatan $kegiatan, Pendaftaran $pendaftaran, ChangeParticipantRoleAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $action->handle($kegiatan, $pendaftaran, PeranKegiatan::from($request->validated('peran')), $actor, $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Peran peserta berhasil diperbarui.']);

        return back();
    }

    public function cancel(BatalkanPendaftaranRequest $request, Kegiatan $kegiatan, Pendaftaran $pendaftaran, AdminCancelRegistrationAction $action): RedirectResponse
    {
        /** @var User $actor */
        $actor = $request->user();
        $action->handle($kegiatan, $pendaftaran, $request->validated('alasan'), $actor, $request->ip());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Pendaftaran peserta berhasil dibatalkan.']);

        return back();
    }
}


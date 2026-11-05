<?php

namespace App\Http\Controllers\Admin;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Http\Controllers\Controller;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Koreksi;
use App\Models\Mahasiswa;
use App\Models\Periode;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        $now = Carbon::now(config('app.timezone'));
        $activePeriod = Periode::query()
            ->where('aktif', true)
            ->latest('id')
            ->first();

        $activeActivities = $activePeriod === null
            ? 0
            : Kegiatan::query()
                ->whereBetween('tanggal', [
                    $activePeriod->tanggal_mulai->toDateString(),
                    $activePeriod->tanggal_selesai->toDateString(),
                ])
                ->count();

        $pendingCorrections = Koreksi::query()
            ->menunggu()
            ->with([
                'mahasiswa.user:id,name',
                'kegiatan:id,judul',
            ])
            ->latest('created_at')
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(fn (Koreksi $correction): array => [
                'id' => $correction->id,
                'mahasiswa_nama' => $correction->mahasiswa->user->name ?? 'Mahasiswa',
                'kegiatan_id' => $correction->kegiatan_id,
                'kegiatan_judul' => $correction->kegiatan->judul ?? 'Kegiatan',
            ])
            ->all();

        $pendingAttendances = Kehadiran::query()
            ->where('status', StatusKehadiran::MenungguTinjau)
            ->with([
                'pendaftaran.kegiatan:id,judul',
                'pendaftaran.mahasiswa.user:id,name',
            ])
            ->latest('waktu_checkin')
            ->latest('id')
            ->limit(5)
            ->get()
            ->map(fn (Kehadiran $attendance): array => [
                'id' => $attendance->id,
                'mahasiswa_nama' => $attendance->pendaftaran->mahasiswa->user->name ?? 'Mahasiswa',
                'kegiatan_id' => $attendance->pendaftaran->kegiatan->id,
                'kegiatan_judul' => $attendance->pendaftaran->kegiatan->judul,
            ])
            ->all();

        $upcomingActivities = Kegiatan::query()
            ->whereIn('status', [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung])
            ->whereDate('tanggal', '>=', $now->toDateString())
            ->orderBy('tanggal')
            ->orderBy('jam_mulai')
            ->limit(10)
            ->get(['id', 'judul', 'tanggal', 'jam_mulai', 'status'])
            ->filter(fn (Kegiatan $activity): bool => in_array(
                $activity->statusEfektif(),
                [StatusKegiatan::Terbit, StatusKegiatan::Berlangsung],
                true
            ))
            ->take(3)
            ->map(fn (Kegiatan $activity): array => [
                'id' => $activity->id,
                'judul' => $activity->judul,
                'tanggal' => $activity->tanggal->format('d/m/Y'),
                'jam_mulai' => Carbon::parse($activity->jam_mulai)->format('H:i'),
                'status_label' => $activity->statusEfektifLabel(),
            ])
            ->values()
            ->all();

        return Inertia::render('admin/dashboard', [
            'ringkasan' => [
                'kegiatan_aktif' => $activeActivities,
                'anggota_aktif' => Mahasiswa::query()->where('aktif', true)->count(),
                'kehadiran_bulan_ini' => Kehadiran::query()
                    ->where('status', StatusKehadiran::Valid)
                    ->whereBetween('waktu_checkin', [
                        $now->copy()->startOfMonth(),
                        $now->copy()->endOfMonth(),
                    ])
                    ->count(),
                'koreksi_menunggu' => Koreksi::query()->menunggu()->count(),
            ],
            'koreksi_menunggu' => $pendingCorrections,
            'kehadiran_menunggu' => $pendingAttendances,
            'kegiatan_terdekat' => $upcomingActivities,
        ]);
    }
}

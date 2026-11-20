<?php

namespace App\Actions\Statistik;

use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Models\Kegiatan;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\PoinTransaksi;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Carbon;

class GetEvaluationReportAction
{
    /**
     * @param  array<string, mixed>  $filters
     * @return array<string, mixed>
     */
    public function handle(array $filters): array
    {
        $periodeId = ! empty($filters['periode_id']) && $filters['periode_id'] !== 'all' ? (int) $filters['periode_id'] : null;
        $komsatId = ! empty($filters['komsat_id']) && $filters['komsat_id'] !== 'all' ? (int) $filters['komsat_id'] : null;
        $divisiId = ! empty($filters['divisi_id']) && $filters['divisi_id'] !== 'all' ? (int) $filters['divisi_id'] : null;
        $status = ! empty($filters['status']) && $filters['status'] !== 'all' ? StatusKegiatan::tryFrom((string) $filters['status']) : null;
        $mulai = $filters['mulai'] ?? null;
        $akhir = $filters['akhir'] ?? null;

        if ($periodeId !== null && ($mulai === null || $akhir === null)) {
            $periode = Periode::find($periodeId);
            if ($periode !== null) {
                $mulai = $mulai ?? $periode->tanggal_mulai->toDateString();
                $akhir = $akhir ?? $periode->tanggal_selesai->toDateString();
            }
        }

        $baseQuery = Kegiatan::query();
        if ($mulai) {
            $baseQuery->whereDate('tanggal', '>=', $mulai);
        }
        if ($akhir) {
            $baseQuery->whereDate('tanggal', '<=', $akhir);
        }
        if ($divisiId) {
            $baseQuery->whereHas('divisiTarget', fn ($q) => $q->where('divisi.id', $divisiId));
        }
        if ($status) {
            $baseQuery->statusEfektif($status);
        }

        $query = clone $baseQuery;
        if ($komsatId) {
            $query->where('komsat_id', $komsatId);
        }

        $ids = (clone $query)->pluck('id')->all();
        $registered = Pendaftaran::whereIn('kegiatan_id', $ids)->where('status', StatusPendaftaran::Terdaftar)->count();
        $valid = Pendaftaran::whereIn('kegiatan_id', $ids)->whereHas('kehadiran', fn ($q) => $q->where('status', StatusKehadiran::Valid))->count();

        $rekap = [];
        foreach (Komsat::orderBy('id')->get() as $komsat) {
            $komsatKegiatanCount = (clone $query)->where('komsat_id', $komsat->id)->count();
            $countRegistered = Pendaftaran::whereIn('kegiatan_id', $ids)
                ->where('status', StatusPendaftaran::Terdaftar)
                ->whereHas('mahasiswa', fn ($q) => $q->where('komsat_id', $komsat->id))
                ->count();
            $countValid = Pendaftaran::whereIn('kegiatan_id', $ids)
                ->whereHas('mahasiswa', fn ($q) => $q->where('komsat_id', $komsat->id))
                ->whereHas('kehadiran', fn ($q) => $q->where('status', StatusKehadiran::Valid))
                ->count();
            $points = (int) PoinTransaksi::whereIn('kegiatan_id', $ids)
                ->whereHas('mahasiswa', fn ($q) => $q->where('komsat_id', $komsat->id))
                ->sum('jumlah');
            $active = Mahasiswa::where('komsat_id', $komsat->id)->where('aktif', true)->count();
            $rekap[] = [
                'komsat' => $komsat->kode,
                'kegiatan' => $komsatKegiatanCount,
                'pendaftaran' => $countRegistered,
                'hadir_valid' => $countValid,
                'poin' => $points,
                'rata_rata_poin' => $active ? round($points / $active, 1) : 0.0,
            ];
        }

        $trendKeys = $this->trendAxis($baseQuery, $mulai, $akhir);
        $trendIndex = array_flip($trendKeys);
        $kegiatanPerBulan = array_fill(0, count($trendKeys), 0);
        $partisipasiPerBulan = array_fill(0, count($trendKeys), 0);

        $trendActivities = (clone $query)->withCount(['pendaftaran' => fn ($q) => $q->where('status', StatusPendaftaran::Terdaftar)])->orderBy('tanggal')->get();
        foreach ($trendActivities as $activity) {
            $index = $trendIndex[Carbon::parse($activity->tanggal)->format('Y-m')] ?? null;
            if ($index !== null) {
                $kegiatanPerBulan[$index]++;
                $partisipasiPerBulan[$index] += (int) $activity->pendaftaran_count;
            }
        }

        $trend = [];
        foreach ($trendKeys as $index => $key) {
            $trend[] = [
                'bulan' => Carbon::createFromFormat('Y-m-d', $key.'-01')->translatedFormat('M Y'),
                'kegiatan' => $kegiatanPerBulan[$index],
                'partisipasi' => $partisipasiPerBulan[$index],
            ];
        }

        $aggregateProjection = $this->linearProjection($partisipasiPerBulan);
        $trendChart = $trend;
        if ($aggregateProjection['projection'] !== null && $trendKeys !== []) {
            $lastIndex = count($trendKeys) - 1;
            $trendChart[$lastIndex]['proyeksi'] = $partisipasiPerBulan[$lastIndex];
            $trendChart[] = [
                'bulan' => Carbon::createFromFormat('Y-m-d', $trendKeys[$lastIndex].'-01')->addMonth()->translatedFormat('M Y'),
                'kegiatan' => 0,
                'partisipasi' => 0,
                'proyeksi' => $aggregateProjection['projection'],
            ];
        }
        $monthlyByKomsat = [];
        foreach (Pendaftaran::query()
            ->whereIn('kegiatan_id', $ids)
            ->where('status', StatusPendaftaran::Terdaftar)
            ->with(['kegiatan:id,tanggal', 'mahasiswa:id,komsat_id'])
            ->get() as $registration) {
            $index = $trendIndex[Carbon::parse($registration->kegiatan->tanggal)->format('Y-m')] ?? null;
            if ($index !== null && $registration->mahasiswa !== null) {
                $monthlyByKomsat[$registration->mahasiswa->komsat_id][$index] = ($monthlyByKomsat[$registration->mahasiswa->komsat_id][$index] ?? 0) + 1;
            }
        }

        $proyeksiPerKomsat = [];
        foreach (Komsat::orderBy('id')->get() as $komsat) {
            $monthlyParticipation = array_fill(0, count($trendKeys), 0);
            foreach ($monthlyByKomsat[$komsat->id] ?? [] as $index => $total) {
                $monthlyParticipation[$index] = $total;
            }

            if (array_sum($monthlyParticipation) === 0) {
                $projection = [
                    'n' => count($monthlyParticipation),
                    'trend' => 'Stabil',
                    'projection' => null,
                    'message' => 'Belum ada data pada rentang ini.',
                ];
            } else {
                $projection = $this->linearProjection($monthlyParticipation);
            }

            $proyeksiPerKomsat[] = [
                'komsat' => $komsat->kode,
                'bulan_data' => $projection['n'],
                'tren' => $projection['trend'],
                'proyeksi_partisipasi' => $projection['projection'],
                'pesan' => $projection['message'],
            ];
        }

        $activities = (clone $query)->with(['komsat:id,kode'])->withCount([
            'pendaftaran' => fn ($q) => $q->where('status', StatusPendaftaran::Terdaftar),
            'pendaftaran as hadir_valid_count' => fn ($q) => $q->where('status', StatusPendaftaran::Terdaftar)->whereHas('kehadiran', fn ($kh) => $kh->where('status', StatusKehadiran::Valid)),
        ])->orderByDesc('pendaftaran_count')->get()->map(function (Kegiatan $activity): array {
            $count = (int) $activity->pendaftaran_count;
            $validCount = (int) ($activity->getAttribute('hadir_valid_count') ?? 0);

            return ['judul' => $activity->judul, 'komsat' => $activity->komsat->kode ?? 'Wilayah', 'pendaftaran' => $count, 'hadir_valid' => $validCount, 'persentase_hadir' => $count ? round($validCount * 100 / $count, 1) : 0.0];
        })->all();

        $kehadiranData = Kehadiran::query()
            ->whereHas('pendaftaran', fn ($q) => $q->whereIn('kegiatan_id', $ids))
            ->with(['pendaftaran.kegiatan:id,judul', 'pendaftaran.mahasiswa.user:id,name', 'pendaftaran.mahasiswa.komsat:id,kode'])
            ->orderBy('waktu_checkin')
            ->get()
            ->map(fn (Kehadiran $k): array => [
                'kegiatan' => $k->pendaftaran->kegiatan->judul ?? '-',
                'mahasiswa' => $k->pendaftaran->mahasiswa->user->name ?? 'Mahasiswa',
                'komsat' => $k->pendaftaran->mahasiswa->komsat->kode ?? '-',
                'peran' => $k->pendaftaran->peran->label(),
                'status' => $k->status->label(),
                'waktu_checkin' => $k->waktu_checkin->format('d/m/Y H:i'),
                'jarak_m' => $k->jarak_m !== null ? round((float) $k->jarak_m, 1) : '-',
                'akurasi_m' => $k->akurasi_m !== null ? round((float) $k->akurasi_m, 1) : '-',
            ])
            ->all();

        $transaksiPoinData = PoinTransaksi::query()
            ->whereIn('kegiatan_id', $ids)
            ->with(['mahasiswa.user:id,name', 'mahasiswa.komsat:id,kode', 'kegiatan:id,judul'])
            ->orderByDesc('created_at')
            ->get()
            ->map(fn (PoinTransaksi $pt): array => [
                'tanggal' => $pt->created_at->format('d/m/Y'),
                'mahasiswa' => $pt->mahasiswa->user->name ?? 'Mahasiswa',
                'komsat' => $pt->mahasiswa->komsat->kode ?? '-',
                'kegiatan' => $pt->kegiatan->judul ?? '-',
                'tipe' => $pt->tipe->label(),
                'jumlah' => $pt->jumlah,
                'keterangan' => $pt->keterangan,
            ])
            ->all();

        return [
            'filters' => ['periode_id' => (string) ($filters['periode_id'] ?? ''), 'mulai' => (string) ($mulai ?? ''), 'akhir' => (string) ($akhir ?? ''), 'komsat_id' => (string) ($filters['komsat_id'] ?? ''), 'divisi_id' => (string) ($filters['divisi_id'] ?? ''), 'status' => (string) ($filters['status'] ?? '')],
            'ringkasan' => ['total_kegiatan' => count($ids), 'total_pendaftaran' => $registered, 'kehadiran_valid' => $valid, 'tingkat_kehadiran' => $registered ? round($valid * 100 / $registered, 1) : 0.0],
            'rekap_komsat' => $rekap,
            'tren' => $trend,
            'tren_chart' => $trendChart,
            'proyeksi_tren' => $proyeksiPerKomsat,
            'partisipasi' => $activities,
            'kehadiran' => $kehadiranData,
            'transaksi_poin' => $transaksiPoinData,
        ];
    }

    /**
     * Sumbu bulan ditentukan rentang tanggal tanpa filter Komsat dan dibatasi sampai bulan berjalan.
     *
     * @param  Builder<Kegiatan>  $baseQuery
     * @return list<string>
     */
    private function trendAxis(Builder $baseQuery, ?string $mulai, ?string $akhir): array
    {
        $currentMonth = Carbon::now(config('app.timezone'))->startOfMonth();
        $currentMonthEnd = $currentMonth->copy()->endOfMonth()->toDateString();

        $eligibleQuery = (clone $baseQuery)->whereDate('tanggal', '<=', $currentMonthEnd);
        $first = $mulai ?: (clone $eligibleQuery)->min('tanggal');
        $last = $akhir ?: (clone $eligibleQuery)->max('tanggal');
        if ($first === null || $last === null) {
            return [];
        }

        $start = Carbon::parse($first)->startOfMonth();
        $end = Carbon::parse($last)->startOfMonth();
        if ($end->gt($currentMonth)) {
            $end = $currentMonth;
        }

        $keys = [];
        for ($month = $start->copy(); $month->lte($end); $month->addMonth()) {
            $keys[] = $month->format('Y-m');
        }

        return $keys;
    }

    /**
     * @param  array<int, int|float>  $values
     * @return array{n: int, slope: float|null, trend: string, projection: int|null, message: string|null}
     */
    public function linearProjection(array $values): array
    {
        $n = count($values);
        if ($n < 4) {
            return [
                'n' => $n,
                'slope' => null,
                'trend' => 'Stabil',
                'projection' => null,
                'message' => 'Data belum cukup untuk proyeksi (minimal 4 bulan).',
            ];
        }

        $xMean = ($n + 1) / 2;
        $yMean = array_sum($values) / $n;
        $numerator = 0.0;
        $denominator = 0.0;
        foreach ($values as $index => $value) {
            $x = $index + 1;
            $numerator += ($x - $xMean) * ($value - $yMean);
            $denominator += ($x - $xMean) ** 2;
        }
        $slope = $denominator === 0.0 ? 0.0 : $numerator / $denominator;
        $intercept = $yMean - ($slope * $xMean);
        $projection = max(0, (int) round($intercept + ($slope * ($n + 1))));

        return [
            'n' => $n,
            'slope' => $slope,
            'trend' => $slope > 0.5 ? 'Naik' : ($slope < -0.5 ? 'Turun' : 'Stabil'),
            'projection' => $projection,
            'message' => null,
        ];
    }
}

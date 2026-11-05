<?php

namespace App\Http\Controllers\Admin;

use App\Actions\Statistik\GetEvaluationReportAction;
use App\Exports\LaporanGenbiExport;
use App\Http\Requests\Admin\FilterRekapRequest;
use App\Models\AuditLog;
use App\Models\Divisi;
use App\Models\Komsat;
use App\Models\Periode;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class RekapController
{
    public function index(FilterRekapRequest $request, GetEvaluationReportAction $action): Response
    {
        $filters = $request->validated();
        $report = $action->handle($filters);

        return Inertia::render('admin/rekap', [
            'filters' => $report['filters'],
            'options' => [
                'periode' => Periode::orderByDesc('aktif')->orderByDesc('tanggal_mulai')->get(['id', 'nama'])->all(),
                'komsat' => Komsat::where('aktif', true)->orderBy('id')->get(['id', 'kode', 'nama'])->all(),
                'divisi' => Divisi::where('aktif', true)->orderBy('komsat_id')->orderBy('nama')->get(['id', 'nama', 'komsat_id'])->all(),
                'status' => [
                    ['value' => 'draft', 'label' => 'Draft'],
                    ['value' => 'terbit', 'label' => 'Terbit'],
                    ['value' => 'berlangsung', 'label' => 'Berlangsung'],
                    ['value' => 'selesai', 'label' => 'Selesai'],
                    ['value' => 'terkunci', 'label' => 'Terkunci'],
                    ['value' => 'dibatalkan', 'label' => 'Dibatalkan'],
                ],
            ],
            'ringkasan' => $report['ringkasan'],
            'rekap_komsat' => $report['rekap_komsat'],
            'tren' => $report['tren'],
            'tren_chart' => $report['tren_chart'],
            'proyeksi_tren' => $report['proyeksi_tren'],
            'partisipasi' => $report['partisipasi'],
        ]);
    }

    public function export(FilterRekapRequest $request, GetEvaluationReportAction $action): BinaryFileResponse|RedirectResponse
    {
        $filters = $request->validated();
        $report = $action->handle($filters);

        $range = $report['filters']['mulai'] && $report['filters']['akhir']
            ? str_replace('-', '', $report['filters']['mulai']).'-'.str_replace('-', '', $report['filters']['akhir'])
            : 'semua-data';

        $filename = "laporan-genbi-{$range}.xlsx";
        $periodName = 'Semua periode';
        if (! empty($filters['periode_id']) && $filters['periode_id'] !== 'all') {
            $periodName = Periode::query()->whereKey($filters['periode_id'])->value('nama') ?? $periodName;
        }

        AuditLog::catat(
            'rekap.export',
            auth()->id() !== null ? (int) auth()->id() : null,
            null,
            null,
            ['filters' => $filters, 'total_kegiatan' => $report['ringkasan']['total_kegiatan']],
            request()->ip()
        );

        return Excel::download(new LaporanGenbiExport($report, $periodName), $filename);
    }
}

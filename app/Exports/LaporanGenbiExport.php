<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class LaporanGenbiExport implements Export, WithMultipleSheets
{
    /** @param array<string, mixed> $report */
    public function __construct(
        private readonly array $report,
        private readonly string $periodName = 'Semua periode',
    ) {}

    /** @return array<int, ArraySheet> */
    public function sheets(): array
    {
        $summary = $this->report['ringkasan'];

        return [
            new ArraySheet('Ringkasan', ['Metrik', 'Nilai'], [
                ['Total kegiatan', $summary['total_kegiatan']],
                ['Total pendaftaran', $summary['total_pendaftaran']],
                ['Kehadiran valid', $summary['kehadiran_valid']],
                ['Tingkat kehadiran (%)', $summary['tingkat_kehadiran']],
            ], ['B' => '#,##0', 'B7' => '0.0"%"'], $this->periodName),
            new ArraySheet('Rekap Komsat', ['Komsat', 'Kegiatan', 'Pendaftaran', 'Hadir Valid', 'Total Poin', 'Rata-rata Poin'], $this->report['rekap_komsat'], ['B' => '#,##0', 'C' => '#,##0', 'D' => '#,##0', 'E' => '#,##0', 'F' => '#,##0.0'], $this->periodName),
            new ArraySheet('Kegiatan', ['Judul', 'Komsat', 'Pendaftaran', 'Hadir Valid', 'Persentase Hadir'], $this->report['partisipasi'], ['C' => '#,##0', 'D' => '#,##0', 'E' => '0.0"%"'], $this->periodName),
            new ArraySheet('Kehadiran', ['Kegiatan', 'Mahasiswa', 'Komsat', 'Peran', 'Status', 'Waktu Check-in', 'Jarak (m)', 'Akurasi (m)'], $this->report['kehadiran'], ['G' => '#,##0.0', 'H' => '#,##0.0'], $this->periodName),
            new ArraySheet('Transaksi Poin', ['Tanggal', 'Mahasiswa', 'Komsat', 'Kegiatan', 'Tipe', 'Jumlah', 'Keterangan'], $this->report['transaksi_poin'], ['F' => '#,##0'], $this->periodName),
        ];
    }
}

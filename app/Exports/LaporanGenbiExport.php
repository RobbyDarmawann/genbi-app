<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\Export;
use Maatwebsite\Excel\Concerns\WithMultipleSheets;

class LaporanGenbiExport implements Export, WithMultipleSheets
{
    /** @param array<string, mixed> $report */
    public function __construct(private readonly array $report) {}

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
            ]),
            new ArraySheet('Rekap Komsat', ['Komsat', 'Kegiatan', 'Pendaftaran', 'Hadir Valid', 'Total Poin', 'Rata-rata Poin'], $this->report['rekap_komsat']),
            new ArraySheet('Kegiatan', ['Judul', 'Komsat', 'Pendaftaran', 'Hadir Valid', 'Persentase Hadir'], $this->report['partisipasi']),
            new ArraySheet('Kehadiran', ['Kegiatan', 'Mahasiswa', 'Komsat', 'Peran', 'Status', 'Waktu Check-in', 'Jarak (m)', 'Akurasi (m)'], $this->report['kehadiran']),
            new ArraySheet('Transaksi Poin', ['Tanggal', 'Mahasiswa', 'Komsat', 'Kegiatan', 'Tipe', 'Jumlah', 'Keterangan'], $this->report['transaksi_poin']),
        ];
    }
}

<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithCustomStartCell;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Events\AfterSheet;

class ArraySheet implements FromArray, ShouldAutoSize, WithCustomStartCell, WithEvents, WithHeadings, WithStrictNullComparison, WithTitle
{
    /**
     * @param  array<int, string>  $headings
     * @param  array<int, array<int|string, mixed>>  $rows
     * @param  array<string, string>  $formatMap
     */
    private readonly string $title;

    private readonly string $periodName;

    /** @var array<int, string> */
    private readonly array $headings;

    /** @var array<int, array<int|string, mixed>> */
    private readonly array $rows;

    /** @var array<string, string> */
    private readonly array $formatMap;

    /**
     * @param  array<int, string>  $headings
     * @param  array<int, array<int|string, mixed>>  $rows
     * @param  array<string, string>  $formatMap
     */
    public function __construct(
        string $title,
        array $headings,
        array $rows,
        array $formatMap = [],
        string $periodName = 'Semua periode',
    ) {
        $this->title = $title;
        $this->periodName = $periodName;
        $this->headings = $headings;
        $this->rows = $rows;
        $this->formatMap = $formatMap;
    }

    /** @return array<int, array<int, mixed>> */
    public function array(): array
    {
        return array_map(fn (array $row): array => array_map(self::sanitize(...), array_values($row)), $this->rows);
    }

    /** @return array<int, mixed> */
    public function headings(): array
    {
        return array_map(self::sanitize(...), $this->headings);
    }

    public function title(): string
    {
        return $this->title;
    }

    public function startCell(): string
    {
        return 'A3';
    }

    /** @return array<string, callable> */
    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event): void {
                $sheet = $event->sheet->getDelegate();
                $lastColumn = $sheet->getHighestColumn();
                $lastRow = $sheet->getHighestRow();
                $headerRange = "A3:{$lastColumn}3";
                $tableRange = "A3:{$lastColumn}{$lastRow}";

                $sheet->mergeCells("A1:{$lastColumn}1");
                $sheet->mergeCells("A2:{$lastColumn}2");
                $sheet->setCellValue('A1', "Sistem Informasi GenBI Gorontalo — {$this->title}");
                $sheet->setCellValue('A2', "Periode: {$this->periodName} | Diekspor: ".now()->format('d/m/Y H:i').' WITA');
                $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
                $sheet->getStyle('A2')->getFont()->setItalic(true);
                $sheet->getStyle($headerRange)->applyFromArray([
                    'fill' => ['fillType' => 'solid', 'startColor' => ['rgb' => '0035A0']],
                    'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF']],
                    'alignment' => ['horizontal' => 'center', 'vertical' => 'center'],
                ]);
                $sheet->getStyle($tableRange)->applyFromArray([
                    'borders' => [
                        'allBorders' => [
                            'borderStyle' => 'thin',
                            'color' => ['rgb' => 'D1D5DB'],
                        ],
                    ],
                ]);
                foreach ($this->formatMap as $column => $format) {
                    $range = preg_match('/\d/', $column) === 1
                        ? $column
                        : "{$column}4:{$column}{$lastRow}";
                    $sheet->getStyle($range)
                        ->getNumberFormat()
                        ->setFormatCode($format);
                }
                $sheet->freezePane('A4');
            },
        ];
    }

    private static function sanitize(mixed $value): mixed
    {
        return is_string($value) && preg_match('/^[=+\-@\t\r]/', $value) ? "'{$value}" : $value;
    }
}

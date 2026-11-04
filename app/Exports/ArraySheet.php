<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStrictNullComparison;
use Maatwebsite\Excel\Concerns\WithTitle;

class ArraySheet implements FromArray, ShouldAutoSize, WithHeadings, WithStrictNullComparison, WithTitle
{
    /**
     * @param  array<int, string>  $headings
     * @param  array<int, array<int|string, mixed>>  $rows
     */
    public function __construct(
        private readonly string $title,
        private readonly array $headings,
        private readonly array $rows,
    ) {}

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

    private static function sanitize(mixed $value): mixed
    {
        return is_string($value) && preg_match('/^[=+\-@\t\r]/', $value) ? "'{$value}" : $value;
    }
}

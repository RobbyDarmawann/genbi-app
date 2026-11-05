import { Head, router } from '@inertiajs/react';
import { Download } from 'lucide-react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { FormEvent } from 'react';
import { ResponsiveTable } from '@/components/responsive-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatAngka } from '@/lib/format';
import admin from '@/routes/admin';

type KomsatRow = {
    komsat: string;
    kegiatan: number;
    pendaftaran: number;
    hadir_valid: number;
    poin: number;
    rata_rata_poin: number;
};
type ActivityRow = {
    judul: string;
    komsat: string;
    pendaftaran: number;
    hadir_valid: number;
    persentase_hadir: number;
};
type Props = {
    filters: {
        periode_id: string;
        mulai: string;
        akhir: string;
        komsat_id: string;
        divisi_id: string;
        status: string;
    };
    options: {
        periode: { id: number; nama: string }[];
        komsat: { id: number; kode: string; nama: string }[];
        divisi: { id: number; nama: string; komsat_id: number }[];
        status: { value: string; label: string }[];
    };
    ringkasan: {
        total_kegiatan: number;
        total_pendaftaran: number;
        kehadiran_valid: number;
        tingkat_kehadiran: number;
    };
    rekap_komsat: KomsatRow[];
    tren: { bulan: string; kegiatan: number; partisipasi: number }[];
    tren_chart: {
        bulan: string;
        kegiatan: number;
        partisipasi: number;
        proyeksi?: number;
    }[];
    proyeksi_tren: {
        komsat: string;
        bulan_data: number;
        tren: 'Naik' | 'Turun' | 'Stabil';
        proyeksi_partisipasi: number | null;
        pesan: string | null;
    }[];
    partisipasi: ActivityRow[];
};

export default function Rekap({
    filters,
    options,
    ringkasan,
    rekap_komsat,
    tren,
    tren_chart,
    proyeksi_tren,
    partisipasi,
}: Props) {
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const params = Object.fromEntries(
            [...form.entries()].map(([key, value]) => [
                key,
                typeof value === 'string' ? value : '',
            ]),
        );
        router.get(admin.rekap.index().url, params, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };
    const columns = [
        {
            key: 'komsat',
            header: 'Komsat',
            cell: (row: KomsatRow) => row.komsat,
        },
        {
            key: 'kegiatan',
            header: 'Kegiatan',
            align: 'right' as const,
            cell: (row: KomsatRow) => formatAngka(row.kegiatan),
        },
        {
            key: 'pendaftaran',
            header: 'Pendaftaran',
            align: 'right' as const,
            cell: (row: KomsatRow) => formatAngka(row.pendaftaran),
        },
        {
            key: 'hadir',
            header: 'Hadir valid',
            align: 'right' as const,
            cell: (row: KomsatRow) => formatAngka(row.hadir_valid),
        },
        {
            key: 'poin',
            header: 'Total poin',
            align: 'right' as const,
            cell: (row: KomsatRow) => formatAngka(row.poin),
        },
        {
            key: 'rata',
            header: 'Rata-rata / anggota',
            align: 'right' as const,
            cell: (row: KomsatRow) => formatAngka(row.rata_rata_poin),
        },
    ];
    const activityColumns = [
        {
            key: 'judul',
            header: 'Kegiatan',
            cell: (row: ActivityRow) => row.judul,
        },
        {
            key: 'komsat',
            header: 'Komsat',
            cell: (row: ActivityRow) => row.komsat,
        },
        {
            key: 'pendaftaran',
            header: 'Terdaftar',
            align: 'right' as const,
            cell: (row: ActivityRow) => formatAngka(row.pendaftaran),
        },
        {
            key: 'hadir',
            header: 'Hadir',
            align: 'right' as const,
            cell: (row: ActivityRow) => formatAngka(row.hadir_valid),
        },
        {
            key: 'tingkat',
            header: 'Tingkat hadir',
            align: 'right' as const,
            cell: (row: ActivityRow) => `${row.persentase_hadir}%`,
        },
    ];
    const renderSummary = (row: KomsatRow) => (
        <div className="grid grid-cols-2 gap-2 text-sm">
            <span className="col-span-2 font-semibold">{row.komsat}</span>
            <span>Kegiatan: {row.kegiatan}</span>
            <span>Pendaftaran: {row.pendaftaran}</span>
            <span>Hadir: {row.hadir_valid}</span>
            <span>Poin: {row.poin}</span>
        </div>
    );
    const renderActivity = (row: ActivityRow) => (
        <div className="space-y-1">
            <p className="font-medium">{row.judul}</p>
            <p className="text-sm text-muted-foreground">
                {row.komsat} · {row.hadir_valid}/{row.pendaftaran} hadir (
                {row.persentase_hadir}%)
            </p>
        </div>
    );

    return (
        <>
            <Head title="Laporan dan evaluasi" />
            <div className="mx-auto w-full max-w-7xl space-y-6">
                <header>
                    <p className="text-sm font-medium text-primary">
                        Internal Manajemen
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Laporan dan evaluasi
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Evaluasi kegiatan, partisipasi, dan poin berdasarkan
                        data transaksi.
                    </p>
                </header>
                <form
                    onSubmit={submit}
                    className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-2 xl:grid-cols-6"
                >
                    <div className="space-y-1">
                        <Label htmlFor="periode_id">Periode</Label>
                        <Select
                            name="periode_id"
                            defaultValue={filters.periode_id || 'all'}
                        >
                            <SelectTrigger
                                id="periode_id"
                                className="h-11 md:h-9"
                            >
                                <SelectValue placeholder="Semua periode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua periode
                                </SelectItem>
                                {options.periode.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="mulai">Tanggal mulai</Label>
                        <Input
                            id="mulai"
                            name="mulai"
                            type="date"
                            defaultValue={filters.mulai}
                            className="h-11 text-base md:h-9 md:text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="akhir">Tanggal akhir</Label>
                        <Input
                            id="akhir"
                            name="akhir"
                            type="date"
                            defaultValue={filters.akhir}
                            className="h-11 text-base md:h-9 md:text-sm"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="komsat_id">Komsat</Label>
                        <Select
                            name="komsat_id"
                            defaultValue={filters.komsat_id || 'all'}
                        >
                            <SelectTrigger
                                id="komsat_id"
                                className="h-11 md:h-9"
                            >
                                <SelectValue placeholder="Semua Komsat" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Komsat
                                </SelectItem>
                                {options.komsat.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.kode}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="divisi_id">Divisi</Label>
                        <Select
                            name="divisi_id"
                            defaultValue={filters.divisi_id || 'all'}
                        >
                            <SelectTrigger
                                id="divisi_id"
                                className="h-11 md:h-9"
                            >
                                <SelectValue placeholder="Semua divisi" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua divisi
                                </SelectItem>
                                {options.divisi.map((item) => (
                                    <SelectItem
                                        key={item.id}
                                        value={String(item.id)}
                                    >
                                        {item.nama}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="status">Status kegiatan</Label>
                        <Select
                            name="status"
                            defaultValue={filters.status || 'all'}
                        >
                            <SelectTrigger id="status" className="h-11 md:h-9">
                                <SelectValue placeholder="Semua status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua status
                                </SelectItem>
                                {options.status.map((item) => (
                                    <SelectItem
                                        key={item.value}
                                        value={item.value}
                                    >
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        type="submit"
                        className="h-11 md:col-span-2 md:h-9 xl:col-span-6"
                    >
                        Terapkan filter
                    </Button>
                </form>
                <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    {[
                        ['Total kegiatan', ringkasan.total_kegiatan],
                        ['Pendaftaran', ringkasan.total_pendaftaran],
                        ['Kehadiran valid', ringkasan.kehadiran_valid],
                        [
                            'Tingkat kehadiran',
                            `${ringkasan.tingkat_kehadiran}%`,
                        ],
                    ].map(([label, value]) => (
                        <Card key={String(label)}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold tabular-nums">
                                    {typeof value === 'number'
                                        ? formatAngka(value)
                                        : value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
                <section className="space-y-3">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Tren kegiatan dan partisipasi
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Jumlah kegiatan dan pendaftaran per bulan dalam
                            rentang filter.
                        </p>
                    </div>
                    <Card>
                        <CardContent className="h-72 pt-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={tren_chart}
                                    margin={{ left: -16, right: 8 }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="bulan"
                                        tick={{ fontSize: 12 }}
                                    />
                                    <YAxis
                                        allowDecimals={false}
                                        tick={{ fontSize: 12 }}
                                    />
                                    <Tooltip
                                        formatter={(value, name) => [
                                            formatAngka(Number(value)),
                                            name === 'kegiatan'
                                                ? 'Kegiatan'
                                                : name === 'partisipasi'
                                                  ? 'Pendaftaran'
                                                  : 'Proyeksi',
                                        ]}
                                    />
                                    <Legend />
                                    <Bar
                                        dataKey="kegiatan"
                                        name="Kegiatan"
                                        fill="var(--primary)"
                                        radius={[3, 3, 0, 0]}
                                        isAnimationActive={false}
                                    />
                                    <Bar
                                        dataKey="partisipasi"
                                        name="Pendaftaran"
                                        fill="var(--chart-2)"
                                        radius={[3, 3, 0, 0]}
                                        isAnimationActive={false}
                                    />
                                    <Line
                                        dataKey="proyeksi"
                                        name="Proyeksi"
                                        stroke="var(--primary)"
                                        strokeDasharray="5 5"
                                        strokeWidth={2}
                                        dot
                                        connectNulls
                                        isAnimationActive={false}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                    <details className="rounded-lg border bg-card">
                        <summary className="cursor-pointer px-4 py-3 text-sm font-medium hover:bg-muted/50">
                            Lihat data tren dalam tabel
                        </summary>
                        <div className="overflow-x-auto border-t">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">
                                            Bulan
                                        </th>
                                        <th className="px-4 py-2 text-right font-medium">
                                            Kegiatan
                                        </th>
                                        <th className="px-4 py-2 text-right font-medium">
                                            Pendaftaran
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tren.map((row, i) => (
                                        <tr
                                            key={i}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-2">
                                                {row.bulan}
                                            </td>
                                            <td className="px-4 py-2 text-right tabular-nums">
                                                {formatAngka(row.kegiatan)}
                                            </td>
                                            <td className="px-4 py-2 text-right tabular-nums">
                                                {formatAngka(row.partisipasi)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </details>
                    <Card>
                        <CardHeader>
                            <CardTitle>Proyeksi Tren per Komsat</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/50">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">
                                            Komsat
                                        </th>
                                        <th className="px-4 py-2 text-right font-medium">
                                            Bulan data (n)
                                        </th>
                                        <th className="px-4 py-2 text-left font-medium">
                                            Tren
                                        </th>
                                        <th className="px-4 py-2 text-right font-medium">
                                            Proyeksi partisipasi bulan
                                            berikutnya
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {proyeksi_tren.map((row) => (
                                        <tr
                                            key={row.komsat}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-2 font-medium">
                                                {row.komsat}
                                            </td>
                                            <td className="px-4 py-2 text-right tabular-nums">
                                                {row.bulan_data}
                                            </td>
                                            <td className="px-4 py-2">
                                                {row.tren}
                                            </td>
                                            <td className="px-4 py-2 text-right tabular-nums">
                                                {row.proyeksi_partisipasi ===
                                                null
                                                    ? row.pesan
                                                    : formatAngka(
                                                          row.proyeksi_partisipasi,
                                                      )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <p className="mt-4 text-sm text-muted-foreground">
                                Proyeksi dihitung dengan regresi linear dari
                                data partisipasi bulanan periode aktif. Angka
                                proyeksi adalah estimasi arah tren, bukan
                                kepastian.
                            </p>
                        </CardContent>
                    </Card>
                </section>
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">Rekap per Komsat</h2>
                    <ResponsiveTable<KomsatRow>
                        columns={columns}
                        data={rekap_komsat}
                        keyExtractor={(row) => row.komsat}
                        renderMobileCard={renderSummary}
                        emptyState={
                            <p className="rounded-lg border p-6 text-center text-muted-foreground">
                                Tidak ada rekap untuk filter ini.
                            </p>
                        }
                    />
                </section>
                <section className="space-y-3">
                    <h2 className="text-xl font-semibold">
                        Partisipasi kegiatan
                    </h2>
                    <ResponsiveTable<ActivityRow>
                        columns={activityColumns}
                        data={partisipasi}
                        keyExtractor={(row) => row.judul}
                        renderMobileCard={renderActivity}
                        emptyState={
                            <p className="rounded-lg border p-6 text-center text-muted-foreground">
                                Belum ada data partisipasi.
                            </p>
                        }
                    />
                </section>
                <div>
                    <Button variant="outline" asChild className="h-11 md:h-9">
                        <a
                            href={
                                admin.rekap.export({
                                    query: Object.fromEntries(
                                        Object.entries(filters).filter(
                                            ([, value]) => value !== '',
                                        ),
                                    ),
                                }).url
                            }
                            download
                        >
                            <Download />
                            Ekspor Excel (sesuai filter)
                        </a>
                    </Button>
                </div>
            </div>
        </>
    );
}

Rekap.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

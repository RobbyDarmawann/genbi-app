import { Head, Link, router } from '@inertiajs/react';
import { Activity, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { StatusBadge, type SemanticStatus } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { formatAngka, formatTanggalWita } from '@/lib/format';
import admin from '@/routes/admin';

type KegiatanMonitoringRow = {
    id: number;
    judul: string;
    status: string;
    status_label: string;
    tanggal: string;
    lokasi_nama: string;
    komsat_kode: string | null;
    jumlah_terdaftar: number;
    jumlah_valid: number;
    jumlah_menunggu: number;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    kegiatan: {
        data: KegiatanMonitoringRow[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    filters: {
        q: string;
        status: string;
    };
};

function activitySemantic(status: string): SemanticStatus {
    switch (status) {
        case 'terbit':
        case 'berlangsung':
            return 'terbuka';
        case 'selesai':
            return 'selesai';
        case 'terkunci':
            return 'dikunci';
        case 'dibatalkan':
            return 'dibatalkan';
        default:
            return 'draft';
    }
}

export default function AdminKehadiranIndex({ kegiatan, filters }: Props) {
    const [q, setQ] = useState(filters.q ?? '');

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get(
            admin.kehadiran.index().url,
            { q: q.trim() || undefined },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    const columns: ResponsiveColumn<KegiatanMonitoringRow>[] = [
        {
            key: 'judul',
            header: 'Kegiatan',
            cell: (row) => (
                <div className="min-w-0 space-y-1">
                    <Link
                        href={admin.kegiatan.monitoring(row.id)}
                        className="font-medium hover:underline"
                    >
                        {row.judul}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        {formatTanggalWita(row.tanggal)} • {row.lokasi_nama}
                        {row.komsat_kode ? ` • ${row.komsat_kode}` : ''}
                    </p>
                </div>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row) => (
                <StatusBadge
                    status={activitySemantic(row.status)}
                    label={row.status_label}
                />
            ),
        },
        {
            key: 'terdaftar',
            header: 'Terdaftar',
            align: 'right',
            cell: (row) => formatAngka(row.jumlah_terdaftar),
        },
        {
            key: 'valid',
            header: 'Hadir Valid',
            align: 'right',
            cell: (row) => formatAngka(row.jumlah_valid),
        },
        {
            key: 'menunggu',
            header: 'Menunggu Tinjau',
            align: 'right',
            cell: (row) =>
                row.jumlah_menunggu > 0 ? (
                    <Badge variant="destructive" className="tabular-nums">
                        {formatAngka(row.jumlah_menunggu)} perlu tinjau
                    </Badge>
                ) : (
                    <span className="text-muted-foreground">0</span>
                ),
        },
        {
            key: 'aksi',
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button asChild size="sm" variant="outline">
                    <Link href={admin.kegiatan.monitoring(row.id)}>
                        Buka Monitoring
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Monitoring Kehadiran" />
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <header>
                    <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                        Monitoring &amp; Peninjauan Kehadiran
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Pilih kegiatan untuk memantau check-in peserta secara
                        berkala, meninjau presensi meragukan, dan mengunci
                        kegiatan.
                    </p>
                </header>

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row sm:items-end"
                >
                    <div className="flex-1 space-y-1.5">
                        <Label htmlFor="q" className="sr-only">
                            Cari judul kegiatan
                        </Label>
                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                id="q"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Cari judul kegiatan..."
                                className="h-11 pl-9 md:h-9"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="h-11 md:h-9">
                        Cari
                    </Button>
                </form>

                <ResponsiveTable
                    caption="Daftar kegiatan untuk monitoring kehadiran"
                    columns={columns}
                    data={kegiatan.data}
                    keyExtractor={(row) => row.id}
                    emptyState={
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Activity className="size-10 text-muted-foreground" />
                                <p className="mt-3 text-sm font-medium">
                                    Tidak ada kegiatan ditemukan
                                </p>
                            </CardContent>
                        </Card>
                    }
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-2">
                                <StatusBadge
                                    status={activitySemantic(row.status)}
                                    label={row.status_label}
                                />
                                {row.jumlah_menunggu > 0 && (
                                    <Badge variant="destructive">
                                        {row.jumlah_menunggu} menunggu tinjau
                                    </Badge>
                                )}
                            </div>
                            <div>
                                <p className="font-medium">{row.judul}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatTanggalWita(row.tanggal)} •{' '}
                                    {row.lokasi_nama}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-2 text-xs tabular-nums">
                                <div>
                                    Terdaftar:{' '}
                                    <strong>{row.jumlah_terdaftar}</strong>
                                </div>
                                <div>
                                    Hadir Valid:{' '}
                                    <strong>{row.jumlah_valid}</strong>
                                </div>
                            </div>
                            <Button asChild className="h-11 w-full">
                                <Link href={admin.kegiatan.monitoring(row.id)}>
                                    Buka Monitoring
                                </Link>
                            </Button>
                        </div>
                    )}
                />
            </div>
        </>
    );
}

AdminKehadiranIndex.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

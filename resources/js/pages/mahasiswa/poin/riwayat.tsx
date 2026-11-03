import { Head, Link } from '@inertiajs/react';
import { Award, Trophy } from 'lucide-react';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatAngka, formatWaktuWita } from '@/lib/format';
import mahasiswa from '@/routes/mahasiswa';

type TransaksiPoinItem = {
    id: number;
    kegiatan_judul: string | null;
    tipe: string;
    tipe_label: string;
    jumlah: number;
    keterangan: string;
    tanggal: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    transaksi: {
        data: TransaksiPoinItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
    total_poin: number;
};

function formatDeltaPoin(jumlah: number): string {
    return jumlah >= 0 ? `+${formatAngka(jumlah)}` : formatAngka(jumlah);
}

export default function RiwayatPoinPage({ transaksi, total_poin }: Props) {
    const columns: ResponsiveColumn<TransaksiPoinItem>[] = [
        {
            key: 'tanggal',
            header: 'Tanggal (WITA)',
            cell: (row) => (
                <span className="text-xs tabular-nums">
                    {row.tanggal ? formatWaktuWita(row.tanggal) : '-'}
                </span>
            ),
        },
        {
            key: 'kegiatan',
            header: 'Kegiatan',
            cell: (row) => (
                <span className="font-medium">
                    {row.kegiatan_judul ?? 'Penyesuaian Umum'}
                </span>
            ),
        },
        {
            key: 'tipe',
            header: 'Tipe Transaksi',
            cell: (row) => (
                <Badge
                    variant={row.tipe === 'kredit' ? 'default' : 'secondary'}
                >
                    {row.tipe_label}
                </Badge>
            ),
        },
        {
            key: 'keterangan',
            header: 'Keterangan',
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.keterangan}
                </span>
            ),
        },
        {
            key: 'jumlah',
            header: 'Perubahan Poin',
            align: 'right',
            cell: (row) => (
                <span
                    className={`font-semibold tabular-nums ${
                        row.jumlah >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                >
                    {formatDeltaPoin(row.jumlah)}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head title="Poin Saya" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Poin Saya &amp; Buku Besar (Ledger)
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Seluruh poin dihitung transparan dari jumlah mutasi
                            ledger tanpa saldo manual.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="h-11 md:h-9">
                        <Link href={mahasiswa.kehadiran.index()}>
                            Riwayat Kehadiran
                        </Link>
                    </Button>
                </header>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Poin Saat Ini
                        </CardTitle>
                        <Trophy className="size-5 text-primary" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold tabular-nums">
                            {formatAngka(total_poin)}{' '}
                            <span className="text-base font-normal text-muted-foreground">
                                poin
                            </span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Akumulasi resmi dari seluruh transaksi kredit
                            kehadiran valid dan koreksi yang disetujui.
                        </p>
                    </CardContent>
                </Card>

                <ResponsiveTable
                    caption="Daftar mutasi ledger poin mahasiswa"
                    columns={columns}
                    data={transaksi.data}
                    keyExtractor={(row) => row.id}
                    emptyState={
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Award className="size-10 text-muted-foreground" />
                                <p className="mt-3 text-sm font-medium">
                                    Belum ada transaksi poin
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Poin akan otomatis tercatat setelah
                                    kehadiran Anda pada kegiatan berstatus
                                    valid.
                                </p>
                            </CardContent>
                        </Card>
                    }
                    renderMobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <Badge
                                    variant={
                                        row.tipe === 'kredit'
                                            ? 'default'
                                            : 'secondary'
                                    }
                                >
                                    {row.tipe_label}
                                </Badge>
                                <span
                                    className={`text-base font-bold tabular-nums ${
                                        row.jumlah >= 0
                                            ? 'text-success'
                                            : 'text-destructive'
                                    }`}
                                >
                                    {formatDeltaPoin(row.jumlah)} poin
                                </span>
                            </div>
                            <p className="font-medium">
                                {row.kegiatan_judul ?? 'Penyesuaian Umum'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {row.keterangan}
                            </p>
                            {row.tanggal && (
                                <p className="text-xs text-muted-foreground tabular-nums">
                                    {formatWaktuWita(row.tanggal)}
                                </p>
                            )}
                        </div>
                    )}
                />

                {transaksi.last_page > 1 && (
                    <nav
                        aria-label="Navigasi halaman riwayat poin"
                        className="flex items-center justify-between pt-2"
                    >
                        <p className="text-xs text-muted-foreground tabular-nums">
                            Halaman {transaksi.current_page} dari{' '}
                            {transaksi.last_page}
                        </p>
                        <div className="flex gap-2">
                            {transaksi.links[0]?.url && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-11 md:h-9"
                                >
                                    <Link href={transaksi.links[0].url}>
                                        Sebelumnya
                                    </Link>
                                </Button>
                            )}
                            {transaksi.links[transaksi.links.length - 1]
                                ?.url && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-11 md:h-9"
                                >
                                    <Link
                                        href={
                                            transaksi.links[
                                                transaksi.links.length - 1
                                            ].url!
                                        }
                                    >
                                        Berikutnya
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </nav>
                )}
            </div>
        </>
    );
}

RiwayatPoinPage.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

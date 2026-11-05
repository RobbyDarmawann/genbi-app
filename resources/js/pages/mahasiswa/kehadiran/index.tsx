import { Head, Link } from '@inertiajs/react';
import { Camera, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { StatusBadge, type SemanticStatus } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { formatAngka, formatTanggalWita, formatWaktuWita } from '@/lib/format';
import kehadiranRoutes from '@/routes/kehadiran';
import mahasiswa from '@/routes/mahasiswa';

type RiwayatItem = {
    kegiatan_id: number;
    kegiatan_judul: string;
    kegiatan_tanggal: string;
    peran_label: string;
    kehadiran: {
        id: number;
        waktu_checkin: string;
        status: string;
        status_label: string;
        jarak_m: string | null;
        akurasi_m: string | null;
        alasan_penolakan: string | null;
        has_foto: boolean;
    } | null;
    poin: number | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    kehadiran: {
        data: RiwayatItem[];
        links: PaginationLink[];
        current_page: number;
        last_page: number;
    };
};

function attendanceSemantic(status: string): SemanticStatus {
    switch (status) {
        case 'valid':
            return 'valid';
        case 'menunggu_tinjau':
            return 'diajukan';
        case 'ditolak':
            return 'ditolak';
        default:
            return 'draft';
    }
}

export default function RiwayatKehadiranIndex({ kehadiran }: Props) {
    const [selectedFoto, setSelectedFoto] = useState<{
        id: number;
        judul: string;
    } | null>(null);

    const columns: ResponsiveColumn<RiwayatItem>[] = [
        {
            key: 'kegiatan',
            header: 'Kegiatan',
            cell: (row) => (
                <div className="min-w-0 space-y-1">
                    <Link
                        href={mahasiswa.kegiatan.show(row.kegiatan_id)}
                        className="font-medium hover:underline"
                    >
                        {row.kegiatan_judul}
                    </Link>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>{formatTanggalWita(row.kegiatan_tanggal)}</span>
                        <span>•</span>
                        <span>Peran: {row.peran_label}</span>
                    </div>
                </div>
            ),
        },
        {
            key: 'waktu',
            header: 'Waktu Check-in',
            cell: (row) =>
                row.kehadiran ? (
                    <span className="text-xs tabular-nums">
                        {formatWaktuWita(row.kehadiran.waktu_checkin)}
                    </span>
                ) : (
                    '-'
                ),
        },
        {
            key: 'status',
            header: 'Status & Catatan',
            cell: (row) =>
                row.kehadiran ? (
                    <div className="space-y-1">
                        <StatusBadge
                            status={attendanceSemantic(row.kehadiran.status)}
                            label={row.kehadiran.status_label}
                        />
                        {row.kehadiran.alasan_penolakan && (
                            <p className="max-w-xs text-xs text-destructive">
                                {row.kehadiran.alasan_penolakan}
                            </p>
                        )}
                    </div>
                ) : (
                    '-'
                ),
        },
        {
            key: 'jarak',
            header: 'Jarak / Akurasi',
            align: 'right',
            cell: (row) =>
                row.kehadiran?.jarak_m !== null &&
                row.kehadiran?.jarak_m !== undefined ? (
                    <div className="text-xs tabular-nums">
                        <div>{row.kehadiran.jarak_m} m</div>
                        {row.kehadiran.akurasi_m && (
                            <div className="text-muted-foreground">
                                ±{row.kehadiran.akurasi_m} m
                            </div>
                        )}
                    </div>
                ) : (
                    '-'
                ),
        },
        {
            key: 'poin',
            header: 'Poin Diterima',
            align: 'right',
            cell: (row) =>
                row.poin !== null ? (
                    <span className="font-semibold text-success tabular-nums">
                        +{formatAngka(row.poin)}
                    </span>
                ) : (
                    <span className="text-xs text-muted-foreground">0</span>
                ),
        },
        {
            key: 'foto',
            header: 'Bukti Foto',
            align: 'right',
            cell: (row) =>
                row.kehadiran?.has_foto ? (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            setSelectedFoto({
                                id: row.kehadiran!.id,
                                judul: row.kegiatan_judul,
                            })
                        }
                    >
                        <Camera className="size-4" />
                        Lihat Foto
                    </Button>
                ) : (
                    <span className="text-xs text-muted-foreground">
                        Tidak ada
                    </span>
                ),
        },
    ];

    return (
        <>
            <Head title="Riwayat Kehadiran" />
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Riwayat Kehadiran
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Daftar seluruh rekaman check-in kehadiran, jarak
                            geofence, poin, dan foto bukti pribadi Anda.
                        </p>
                    </div>
                    <Button asChild variant="outline" className="h-11 md:h-9">
                        <Link href={mahasiswa.poin.riwayat()}>
                            Lihat Riwayat Poin
                        </Link>
                    </Button>
                </header>

                <ResponsiveTable
                    caption="Daftar riwayat kehadiran mahasiswa"
                    columns={columns}
                    data={kehadiran.data}
                    keyExtractor={(row) => row.kehadiran?.id ?? row.kegiatan_id}
                    emptyState={
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <ClipboardList className="size-10 text-muted-foreground" />
                                <p className="mt-3 text-sm font-medium">
                                    Belum ada riwayat kehadiran
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Rekaman check-in akan muncul setelah Anda
                                    mengikuti dan melakukan absensi pada
                                    kegiatan.
                                </p>
                                <Button asChild className="mt-4 h-11 md:h-9">
                                    <Link href={mahasiswa.kegiatan.index()}>
                                        Cari Kegiatan
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    }
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                {row.kehadiran && (
                                    <StatusBadge
                                        status={attendanceSemantic(
                                            row.kehadiran.status,
                                        )}
                                        label={row.kehadiran.status_label}
                                    />
                                )}
                                <Badge variant="outline">
                                    {row.peran_label}
                                </Badge>
                            </div>
                            <div>
                                <Link
                                    href={mahasiswa.kegiatan.show(
                                        row.kegiatan_id,
                                    )}
                                    className="font-medium hover:underline"
                                >
                                    {row.kegiatan_judul}
                                </Link>
                                {row.kehadiran && (
                                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                                        Check-in:{' '}
                                        {formatWaktuWita(
                                            row.kehadiran.waktu_checkin,
                                        )}
                                    </p>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-2.5 text-xs">
                                <div>
                                    <span className="text-muted-foreground">
                                        Jarak Lokasi
                                    </span>
                                    <p className="font-medium tabular-nums">
                                        {row.kehadiran?.jarak_m
                                            ? `${row.kehadiran.jarak_m} m`
                                            : '-'}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">
                                        Poin Diterima
                                    </span>
                                    <p className="font-semibold text-success tabular-nums">
                                        {row.poin !== null
                                            ? `+${formatAngka(row.poin)} poin`
                                            : '0 poin'}
                                    </p>
                                </div>
                            </div>
                            {row.kehadiran?.alasan_penolakan && (
                                <p className="text-xs text-destructive">
                                    Catatan: {row.kehadiran.alasan_penolakan}
                                </p>
                            )}
                            {row.kehadiran?.has_foto && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 w-full"
                                    onClick={() =>
                                        setSelectedFoto({
                                            id: row.kehadiran!.id,
                                            judul: row.kegiatan_judul,
                                        })
                                    }
                                >
                                    <Camera className="size-4" />
                                    Lihat Bukti Foto Saya
                                </Button>
                            )}
                        </div>
                    )}
                />

                {kehadiran.last_page > 1 && (
                    <nav
                        aria-label="Navigasi halaman riwayat kehadiran"
                        className="flex items-center justify-between pt-2"
                    >
                        <p className="text-xs text-muted-foreground tabular-nums">
                            Halaman {kehadiran.current_page} dari{' '}
                            {kehadiran.last_page}
                        </p>
                        <div className="flex gap-2">
                            {kehadiran.links[0]?.url && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-11 md:h-9"
                                >
                                    <Link href={kehadiran.links[0].url}>
                                        Sebelumnya
                                    </Link>
                                </Button>
                            )}
                            {kehadiran.links[kehadiran.links.length - 1]
                                ?.url && (
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="h-11 md:h-9"
                                >
                                    <Link
                                        href={
                                            kehadiran.links[
                                                kehadiran.links.length - 1
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

            <Dialog
                open={selectedFoto !== null}
                onOpenChange={(open) => !open && setSelectedFoto(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Bukti Foto Kehadiran</DialogTitle>
                        <DialogDescription>
                            {selectedFoto?.judul}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedFoto && (
                        <div className="overflow-hidden rounded-lg border bg-muted">
                            <img
                                src={kehadiranRoutes.foto.url(selectedFoto.id)}
                                alt={`Foto bukti check-in kegiatan ${selectedFoto.judul}`}
                                className="aspect-[4/3] w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

RiwayatKehadiranIndex.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

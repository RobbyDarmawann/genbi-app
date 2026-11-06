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

type KehadiranRecord = {
    id: number;
    tanggal: string;
    waktu_checkin: string;
    status: string;
    status_label: string;
    jarak_m: string | null;
    akurasi_m: string | null;
    alasan_penolakan: string | null;
    has_foto: boolean;
    poin: number | null;
};

type RiwayatItem = {
    kegiatan_id: number;
    kegiatan_judul: string;
    kegiatan_tanggal: string;
    peran_label: string;
    kehadiran: KehadiranRecord[];
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
                row.kehadiran.length > 0 ? (
                    <div className="space-y-2 text-xs tabular-nums">
                        {row.kehadiran.map((record) => (
                            <div key={record.id}>
                                <div>{formatTanggalWita(record.tanggal)}</div>
                                <div>
                                    {formatWaktuWita(record.waktu_checkin)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    '-'
                ),
        },
        {
            key: 'status',
            header: 'Status & Catatan',
            cell: (row) =>
                row.kehadiran.length > 0 ? (
                    <div className="space-y-2">
                        {row.kehadiran.map((record) => (
                            <div key={record.id} className="space-y-1">
                                <StatusBadge
                                    status={attendanceSemantic(record.status)}
                                    label={record.status_label}
                                />
                                {record.alasan_penolakan && (
                                    <p className="max-w-xs text-xs text-destructive">
                                        {record.alasan_penolakan}
                                    </p>
                                )}
                            </div>
                        ))}
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
                row.kehadiran.length > 0 ? (
                    <div className="space-y-2 text-xs tabular-nums">
                        {row.kehadiran.map((record) => (
                            <div key={record.id}>
                                <div>
                                    {record.jarak_m !== null
                                        ? `${record.jarak_m} m`
                                        : '-'}
                                </div>
                                {record.akurasi_m && (
                                    <div className="text-muted-foreground">
                                        ±{record.akurasi_m} m
                                    </div>
                                )}
                            </div>
                        ))}
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
                row.kehadiran.length > 0 ? (
                    <div className="space-y-2">
                        {row.kehadiran.map((record) => (
                            <div key={record.id}>
                                {record.poin !== null ? (
                                    <span className="font-semibold text-success tabular-nums">
                                        +{formatAngka(record.poin)}
                                    </span>
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        0
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    '-'
                ),
        },
        {
            key: 'foto',
            header: 'Bukti Foto',
            align: 'right',
            cell: (row) =>
                row.kehadiran.length > 0 ? (
                    <div className="space-y-2">
                        {row.kehadiran.map((record) =>
                            record.has_foto ? (
                                <Button
                                    key={record.id}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                        setSelectedFoto({
                                            id: record.id,
                                            judul: row.kegiatan_judul,
                                        })
                                    }
                                >
                                    <Camera className="size-4" />
                                    Lihat Foto
                                </Button>
                            ) : (
                                <span
                                    key={record.id}
                                    className="block text-xs text-muted-foreground"
                                >
                                    Tidak ada
                                </span>
                            ),
                        )}
                    </div>
                ) : (
                    '-'
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
                    keyExtractor={(row) => row.kegiatan_id}
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
                                {row.kehadiran.length > 0 && (
                                    <span className="text-xs font-medium text-muted-foreground">
                                        {row.kehadiran.length} rekaman kehadiran
                                    </span>
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
                            </div>
                            <div className="space-y-2">
                                {row.kehadiran.map((record) => (
                                    <div
                                        key={record.id}
                                        className="space-y-2 rounded-md bg-muted/50 p-2.5 text-xs"
                                    >
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <StatusBadge
                                                status={attendanceSemantic(
                                                    record.status,
                                                )}
                                                label={record.status_label}
                                            />
                                            <span className="tabular-nums">
                                                {formatTanggalWita(
                                                    record.tanggal,
                                                )}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Check-in
                                                </span>
                                                <p className="font-medium tabular-nums">
                                                    {formatWaktuWita(
                                                        record.waktu_checkin,
                                                    )}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Jarak / Akurasi
                                                </span>
                                                <p className="font-medium tabular-nums">
                                                    {record.jarak_m ?? '-'} m
                                                    {record.akurasi_m &&
                                                        ` / ±${record.akurasi_m} m`}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-muted-foreground">
                                                    Poin Diterima
                                                </span>
                                                <p className="font-semibold text-success tabular-nums">
                                                    {record.poin !== null
                                                        ? `+${formatAngka(record.poin)} poin`
                                                        : '0 poin'}
                                                </p>
                                            </div>
                                        </div>
                                        {record.alasan_penolakan && (
                                            <p className="text-destructive">
                                                Catatan:{' '}
                                                {record.alasan_penolakan}
                                            </p>
                                        )}
                                        {record.has_foto && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="h-11 w-full"
                                                onClick={() =>
                                                    setSelectedFoto({
                                                        id: record.id,
                                                        judul: row.kegiatan_judul,
                                                    })
                                                }
                                            >
                                                <Camera className="size-4" />
                                                Lihat Bukti Foto Saya
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
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

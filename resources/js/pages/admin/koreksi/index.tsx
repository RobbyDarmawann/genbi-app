import { Head, Link, router } from '@inertiajs/react';
import { Eye, Filter, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { formatWaktuWita } from '@/lib/format';
import admin from '@/routes/admin';

type MahasiswaData = {
    nim: string;
    user: { name: string };
    komsat?: { kode: string };
    divisi?: { nama: string };
};

type KoreksiItem = {
    id: number;
    jenis: string;
    alasan: string;
    status: string;
    created_at: string;
    mahasiswa: MahasiswaData;
    kegiatan: { id: number; judul: string };
};

type Props = {
    koreksi: {
        data: KoreksiItem[];
        current_page: number;
        last_page: number;
    };
    komsat: { id: number; kode: string; nama: string }[];
    kegiatan: { id: number; judul: string }[];
    filters: {
        status?: string;
        komsat_id?: string;
        kegiatan_id?: string;
        q?: string;
    };
};

export default function AdminKoreksiIndex({
    koreksi,
    komsat,
    kegiatan,
    filters,
}: Props) {
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'all');
    const [komsatFilter, setKomsatFilter] = useState(
        filters.komsat_id ?? 'all',
    );
    const [kegiatanFilter, setKegiatanFilter] = useState(
        filters.kegiatan_id ?? 'all',
    );

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        const q = form.get('q');
        router.get(
            admin.koreksi.index().url,
            {
                q: typeof q === 'string' ? q : '',
                status: statusFilter === 'all' ? '' : statusFilter,
                komsat_id: komsatFilter === 'all' ? '' : komsatFilter,
                kegiatan_id: kegiatanFilter === 'all' ? '' : kegiatanFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    const columns: ResponsiveColumn<KoreksiItem>[] = [
        {
            key: 'mahasiswa',
            header: 'Mahasiswa',
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.mahasiswa.user.name}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                        {row.mahasiswa.nim} •{' '}
                        {row.mahasiswa.komsat?.kode ?? '-'}
                    </p>
                </div>
            ),
        },
        {
            key: 'kegiatan',
            header: 'Kegiatan',
            cell: (row) => (
                <span className="font-medium">{row.kegiatan.judul}</span>
            ),
        },
        {
            key: 'jenis',
            header: 'Jenis',
            cell: (row) => (
                <span className="text-sm capitalize">
                    {row.jenis.replaceAll('_', ' ')}
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row) => (
                <Badge
                    variant={
                        row.status === 'ditolak'
                            ? 'destructive'
                            : row.status === 'disetujui'
                              ? 'default'
                              : 'secondary'
                    }
                >
                    {row.status === 'menunggu'
                        ? 'Menunggu'
                        : row.status === 'disetujui'
                          ? 'Disetujui'
                          : 'Ditolak'}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            header: 'Tanggal Diajukan',
            cell: (row) => (
                <span className="text-xs tabular-nums">
                    {formatWaktuWita(row.created_at)}
                </span>
            ),
        },
        {
            key: 'aksi',
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <Button asChild size="sm" variant="outline" className="h-8">
                    <Link href={admin.koreksi.show({ koreksi: row.id })}>
                        <Eye className="size-3.5" />
                        Detail
                    </Link>
                </Button>
            ),
        },
    ];

    return (
        <>
            <Head title="Inbox Koreksi" />
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Inbox Koreksi
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Tinjau dan proses permohonan koreksi kehadiran dan poin
                        dari mahasiswa.
                    </p>
                </div>

                <form
                    onSubmit={handleSearch}
                    className="grid gap-3 rounded-lg border bg-card p-4 md:grid-cols-4"
                >
                    <div className="relative md:col-span-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari nama atau NIM..."
                            className="h-11 pl-9 md:h-9"
                        />
                    </div>

                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="h-11 md:h-9">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua Status</SelectItem>
                            <SelectItem value="menunggu">Menunggu</SelectItem>
                            <SelectItem value="disetujui">Disetujui</SelectItem>
                            <SelectItem value="ditolak">Ditolak</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={komsatFilter}
                        onValueChange={setKomsatFilter}
                    >
                        <SelectTrigger className="h-11 md:h-9">
                            <SelectValue placeholder="Komisariat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                Semua Komisariat
                            </SelectItem>
                            {komsat.map((k) => (
                                <SelectItem key={k.id} value={String(k.id)}>
                                    {k.kode}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="flex gap-2">
                        <Select
                            value={kegiatanFilter}
                            onValueChange={setKegiatanFilter}
                        >
                            <SelectTrigger className="h-11 flex-1 md:h-9">
                                <SelectValue placeholder="Kegiatan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    Semua Kegiatan
                                </SelectItem>
                                {kegiatan.map((act) => (
                                    <SelectItem
                                        key={act.id}
                                        value={String(act.id)}
                                    >
                                        {act.judul}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button type="submit" className="h-11 md:h-9">
                            <Filter className="size-4" />
                            Filter
                        </Button>
                    </div>
                </form>

                <ResponsiveTable
                    caption="Daftar pengajuan koreksi masuk"
                    columns={columns}
                    data={koreksi.data}
                    keyExtractor={(row) => row.id}
                    emptyState={
                        <Card>
                            <CardContent className="flex flex-col items-center py-12 text-center">
                                <p className="text-sm font-medium">
                                    Tidak ada pengajuan koreksi
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Semua pengajuan yang sesuai filter telah
                                    ditampilkan.
                                </p>
                            </CardContent>
                        </Card>
                    }
                    renderMobileCard={(row) => (
                        <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-medium">
                                        {row.mahasiswa.user.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {row.mahasiswa.nim} •{' '}
                                        {row.mahasiswa.komsat?.kode ?? '-'}
                                    </p>
                                </div>
                                <Badge
                                    variant={
                                        row.status === 'ditolak'
                                            ? 'destructive'
                                            : row.status === 'disetujui'
                                              ? 'default'
                                              : 'secondary'
                                    }
                                >
                                    {row.status === 'menunggu'
                                        ? 'Menunggu'
                                        : row.status === 'disetujui'
                                          ? 'Disetujui'
                                          : 'Ditolak'}
                                </Badge>
                            </div>
                            <p className="text-sm font-medium">
                                {row.kegiatan.judul}
                            </p>
                            <p className="text-xs text-muted-foreground capitalize">
                                {row.jenis.replaceAll('_', ' ')}
                            </p>
                            <div className="flex items-center justify-between pt-2">
                                <span className="text-xs text-muted-foreground tabular-nums">
                                    {formatWaktuWita(row.created_at)}
                                </span>
                                <Button
                                    asChild
                                    size="sm"
                                    variant="outline"
                                    className="h-8"
                                >
                                    <Link
                                        href={admin.koreksi.show({
                                            koreksi: row.id,
                                        })}
                                    >
                                        Detail
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>
        </>
    );
}

AdminKoreksiIndex.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

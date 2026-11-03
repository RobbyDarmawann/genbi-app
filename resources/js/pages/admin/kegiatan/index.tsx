import { Head, Link, router } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search } from 'lucide-react';
import { FormEvent, useState } from 'react';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import {
    kegiatanStatusLabel,
    kegiatanStatusToSemantic,
} from '@/components/kegiatan/types';
import { ResponsiveTable } from '@/components/responsive-table';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import admin from '@/routes/admin';

type Activity = {
    id: number;
    judul: string;
    tanggal: string;
    jam_mulai: string;
    lokasi_nama: string;
    status: string;
    komsat: { kode: string; nama: string } | null;
    pendaftaran_count: number;
    jumlah_hadir: number;
};
type Props = {
    kegiatan: { data: Activity[]; links: unknown[]; meta: unknown };
    komsatOptions: { id: number; kode: string; nama: string }[];
    statusOptions: { value: string; label: string }[];
    filters: { q: string; status: string; komsat_id: string; tanggal: string };
};

export default function Index({
    kegiatan,
    komsatOptions,
    statusOptions,
    filters,
}: Props) {
    const [statusFilter, setStatusFilter] = useState<string>(
        filters.status || 'all',
    );
    const [komsatFilter, setKomsatFilter] = useState<string>(
        filters.komsat_id || 'all',
    );

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const rawQ = form.get('q');
        const rawTanggal = form.get('tanggal');
        router.get(
            AdminKegiatanController.index().url,
            {
                q: typeof rawQ === 'string' ? rawQ : '',
                status: statusFilter === 'all' ? '' : statusFilter,
                komsat_id: komsatFilter === 'all' ? '' : komsatFilter,
                tanggal: typeof rawTanggal === 'string' ? rawTanggal : '',
            },
            { preserveState: true, replace: true },
        );
    };
    return (
        <>
            <Head title="Kegiatan" />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <header>
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Kegiatan
                        </h1>
                    </header>
                    <Button asChild className="h-11 md:h-9">
                        <Link href={AdminKegiatanController.create()}>
                            <Plus className="size-4" />
                            Buat kegiatan
                        </Link>
                    </Button>
                </div>
                <form
                    onSubmit={handleSearch}
                    className="grid gap-4 rounded-lg border bg-card p-4 md:grid-cols-2 lg:grid-cols-5"
                >
                    <div className="relative">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari judul kegiatan"
                            className="h-11 pl-9 md:h-9"
                        />
                    </div>
                    <Select
                        value={statusFilter}
                        onValueChange={setStatusFilter}
                    >
                        <SelectTrigger className="h-11 md:h-9">
                            <SelectValue placeholder="Semua status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua status</SelectItem>
                            {statusOptions.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={komsatFilter}
                        onValueChange={setKomsatFilter}
                    >
                        <SelectTrigger className="h-11 md:h-9">
                            <SelectValue placeholder="Semua komsat" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Semua komsat</SelectItem>
                            {komsatOptions.map((item) => (
                                <SelectItem
                                    key={item.id}
                                    value={String(item.id)}
                                >
                                    {item.kode}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Input
                        name="tanggal"
                        type="date"
                        defaultValue={filters.tanggal}
                        className="h-11 md:h-9"
                    />
                    <Button
                        type="submit"
                        className="h-11 md:col-span-2 md:h-9 lg:col-span-1"
                    >
                        Cari
                    </Button>
                </form>
                <ResponsiveTable<Activity>
                    columns={[
                        {
                            key: 'judul',
                            header: 'Kegiatan',
                            cell: (row) => (
                                <Link
                                    href={admin.kegiatan.show(row.id)}
                                    className="font-medium hover:underline"
                                >
                                    {row.judul}
                                </Link>
                            ),
                        },
                        {
                            key: 'tanggal',
                            header: 'Tanggal',
                            cell: (row) =>
                                new Date(row.tanggal).toLocaleDateString(
                                    'id-ID',
                                    {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    },
                                ),
                        },
                        {
                            key: 'lokasi',
                            header: 'Lokasi',
                            cell: (row) => row.lokasi_nama,
                        },
                        {
                            key: 'komsat',
                            header: 'Penyelenggara',
                            cell: (row) => row.komsat?.kode ?? 'Wilayah',
                        },
                        {
                            key: 'pendaftar',
                            header: 'Pendaftar',
                            align: 'right',
                            cell: (row) => row.pendaftaran_count,
                        },
                        {
                            key: 'hadir',
                            header: 'Hadir',
                            align: 'right',
                            cell: (row) => row.jumlah_hadir,
                        },
                        {
                            key: 'status',
                            header: 'Status',
                            cell: (row) => (
                                <StatusBadge
                                    status={kegiatanStatusToSemantic(
                                        row.status,
                                    )}
                                    label={kegiatanStatusLabel(row.status)}
                                />
                            ),
                        },
                        {
                            key: 'aksi',
                            header: 'Aksi',
                            align: 'right',
                            cell: (row) => <RowActions row={row} />,
                        },
                    ]}
                    data={kegiatan.data}
                    keyExtractor={(row) => row.id}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div>
                                <Link
                                    href={admin.kegiatan.show(row.id)}
                                    className="font-semibold hover:underline"
                                >
                                    {row.judul}
                                </Link>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {new Date(row.tanggal).toLocaleDateString(
                                        'id-ID',
                                        {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long',
                                            year: 'numeric',
                                        },
                                    )}{' '}
                                    • {row.jam_mulai.slice(0, 5)}
                                </p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <StatusBadge
                                    status={kegiatanStatusToSemantic(
                                        row.status,
                                    )}
                                    label={kegiatanStatusLabel(row.status)}
                                />
                                <span className="text-sm text-muted-foreground">
                                    {row.komsat?.kode ?? 'Wilayah'}
                                </span>
                                <span className="ml-auto text-sm tabular-nums">
                                    {row.jumlah_hadir}/{row.pendaftaran_count}{' '}
                                    hadir
                                </span>
                            </div>
                            <RowActions row={row} />
                        </div>
                    )}
                />
            </div>
        </>
    );
}
Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

function RowActions({ row }: { row: Activity }) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild className="h-11 md:h-8">
                <Link href={admin.kegiatan.show(row.id)}>
                    <Eye className="size-3.5" />
                    <span>Detail</span>
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="h-11 md:h-8">
                <Link href={admin.kegiatan.edit(row.id)}>
                    <Pencil className="size-3.5" />
                    <span>Edit</span>
                </Link>
            </Button>
        </div>
    );
}

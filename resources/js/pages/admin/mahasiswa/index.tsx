import { Form, Head, Link } from '@inertiajs/react';
import {
    Eye,
    Pencil,
    Plus,
    Power,
    RotateCcw,
    Search,
    Users,
} from 'lucide-react';
import { useState } from 'react';
import MahasiswaController from '@/actions/App/Http/Controllers/Admin/MahasiswaController';
import Heading from '@/components/heading';
import { DeleteMahasiswaDialog } from '@/components/mahasiswa/delete-mahasiswa-dialog';
import {
    decodePaginationLabel,
    formatPoin,
    type DivisiOption,
    type KomsatOption,
    type MahasiswaRow,
    type PaginationLink,
    type StatusPenerimaOption,
} from '@/components/mahasiswa/types';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import admin, { dashboard } from '@/routes/admin';

type Filters = {
    q: string;
    komsat_id: string;
    divisi_id: string;
    status_penerima: string;
    aktif: string;
};

type Props = {
    mahasiswa: { data: MahasiswaRow[]; links: PaginationLink[] };
    komsatOptions: KomsatOption[];
    divisiOptions: DivisiOption[];
    statusPenerimaOptions: StatusPenerimaOption[];
    filters: Filters;
};

export default function MahasiswaIndex({
    mahasiswa,
    komsatOptions,
    divisiOptions,
    statusPenerimaOptions,
    filters,
}: Props) {
    const [komsatFilter, setKomsatFilter] = useState<string>(
        filters.komsat_id || 'all',
    );
    const [divisiFilter, setDivisiFilter] = useState<string>(
        filters.divisi_id || 'all',
    );
    const [penerimaFilter, setPenerimaFilter] = useState<string>(
        filters.status_penerima || 'all',
    );
    const [aktifFilter, setAktifFilter] = useState<string>(
        filters.aktif !== '' ? filters.aktif : 'all',
    );

    const hasActiveFilter = Boolean(
        filters.q ||
        filters.komsat_id ||
        filters.divisi_id ||
        filters.status_penerima ||
        filters.aktif !== '',
    );

    const filteredDivisiOptions =
        komsatFilter === 'all'
            ? divisiOptions
            : divisiOptions.filter((d) => String(d.komsat_id) === komsatFilter);

    const handleKomsatFilterChange = (value: string) => {
        setKomsatFilter(value);
        if (
            value !== 'all' &&
            divisiFilter !== 'all' &&
            !divisiOptions.some(
                (d) =>
                    String(d.id) === divisiFilter &&
                    String(d.komsat_id) === value,
            )
        ) {
            setDivisiFilter('all');
        }
    };

    const columns: ResponsiveColumn<MahasiswaRow>[] = [
        {
            key: 'anggota',
            header: 'Anggota',
            cell: (row) => (
                <div className="min-w-0">
                    <Link
                        href={admin.mahasiswa.show(row.id)}
                        className="font-medium hover:underline"
                    >
                        {row.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                        @{row.username}
                    </p>
                </div>
            ),
        },
        {
            key: 'nim',
            header: 'NIM / Angkatan',
            cell: (row) => (
                <div className="tabular-nums">
                    <p className="font-medium">{row.nim}</p>
                    <p className="text-xs text-muted-foreground">
                        Angkatan {row.angkatan}
                    </p>
                </div>
            ),
        },
        {
            key: 'unit',
            header: 'Komsat & Divisi',
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.komsat?.kode ?? '—'}</p>
                    <p className="text-xs text-muted-foreground">
                        {row.divisi?.nama ?? '—'}
                    </p>
                </div>
            ),
        },
        {
            key: 'penerima',
            header: 'Status Penerima',
            cell: (row) => (
                <Badge variant="secondary">{row.status_penerima_label}</Badge>
            ),
        },
        {
            key: 'poin',
            header: 'Total Poin',
            align: 'right',
            cell: (row) => (
                <span className="font-semibold tabular-nums">
                    {formatPoin(row.total_poin)} poin
                </span>
            ),
        },
        {
            key: 'status',
            header: 'Akun',
            cell: (row) => (
                <StatusBadge status={row.aktif ? 'aktif' : 'nonaktif'} />
            ),
        },
        {
            key: 'aksi',
            header: 'Aksi',
            align: 'right',
            cell: (row) => <RowActions row={row} />,
        },
    ];

    return (
        <>
            <Head title="Anggota Mahasiswa" />
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        title="Anggota Mahasiswa"
                        description="Kelola akun login, unit komisariat/divisi, dan status keanggotaan mahasiswa."
                    />
                    <Button asChild className="h-11 md:h-9">
                        <Link href={admin.mahasiswa.create()}>
                            <Plus className="size-4" />
                            <span>Tambah Anggota</span>
                        </Link>
                    </Button>
                </header>

                <Form
                    {...MahasiswaController.index.form()}
                    options={{ preserveState: true, preserveScroll: true }}
                    className="space-y-3 rounded-lg border bg-card p-3 md:p-4"
                >
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                        <div className="relative sm:col-span-2 lg:col-span-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                name="q"
                                defaultValue={filters.q}
                                placeholder="Nama, username, atau NIM..."
                                aria-label="Cari anggota"
                                className="h-11 pl-9 md:h-9"
                            />
                        </div>

                        <div>
                            <input
                                type="hidden"
                                name="komsat_id"
                                value={
                                    komsatFilter === 'all' ? '' : komsatFilter
                                }
                            />
                            <Select
                                value={komsatFilter}
                                onValueChange={handleKomsatFilterChange}
                            >
                                <SelectTrigger
                                    aria-label="Filter komisariat"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue placeholder="Semua komisariat" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua komisariat
                                    </SelectItem>
                                    {komsatOptions.map((option) => (
                                        <SelectItem
                                            key={option.id}
                                            value={String(option.id)}
                                        >
                                            {option.kode} — {option.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <input
                                type="hidden"
                                name="divisi_id"
                                value={
                                    divisiFilter === 'all' ? '' : divisiFilter
                                }
                            />
                            <Select
                                value={divisiFilter}
                                onValueChange={setDivisiFilter}
                            >
                                <SelectTrigger
                                    aria-label="Filter divisi"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue placeholder="Semua divisi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua divisi
                                    </SelectItem>
                                    {filteredDivisiOptions.map((option) => {
                                        const komsatKode = komsatOptions.find(
                                            (k) => k.id === option.komsat_id,
                                        )?.kode;
                                        return (
                                            <SelectItem
                                                key={option.id}
                                                value={String(option.id)}
                                            >
                                                {komsatFilter === 'all' &&
                                                komsatKode
                                                    ? `${komsatKode} — ${option.nama}`
                                                    : option.nama}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <input
                                type="hidden"
                                name="status_penerima"
                                value={
                                    penerimaFilter === 'all'
                                        ? ''
                                        : penerimaFilter
                                }
                            />
                            <Select
                                value={penerimaFilter}
                                onValueChange={setPenerimaFilter}
                            >
                                <SelectTrigger
                                    aria-label="Filter status penerima"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue placeholder="Semua status penerima" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua status penerima
                                    </SelectItem>
                                    {statusPenerimaOptions.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <input
                                type="hidden"
                                name="aktif"
                                value={aktifFilter === 'all' ? '' : aktifFilter}
                            />
                            <Select
                                value={aktifFilter}
                                onValueChange={setAktifFilter}
                            >
                                <SelectTrigger
                                    aria-label="Filter status akun"
                                    className="h-11 w-full md:h-9"
                                >
                                    <SelectValue placeholder="Semua status akun" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua status akun
                                    </SelectItem>
                                    <SelectItem value="1">Aktif</SelectItem>
                                    <SelectItem value="0">Nonaktif</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-end gap-2">
                        {hasActiveFilter && (
                            <Button
                                type="button"
                                variant="ghost"
                                asChild
                                className="h-11 md:h-9"
                            >
                                <Link href={admin.mahasiswa.index()}>
                                    <RotateCcw className="size-3.5" />
                                    <span>Reset Filter</span>
                                </Link>
                            </Button>
                        )}
                        <Button
                            type="submit"
                            variant="secondary"
                            className="h-11 md:h-9"
                        >
                            Terapkan Filter
                        </Button>
                    </div>
                </Form>

                <ResponsiveTable
                    caption="Daftar anggota mahasiswa"
                    columns={columns}
                    data={mahasiswa.data}
                    keyExtractor={(row) => row.id}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                    <Link
                                        href={admin.mahasiswa.show(row.id)}
                                        className="font-semibold hover:underline"
                                    >
                                        {row.name}
                                    </Link>
                                    <p className="text-xs text-muted-foreground">
                                        @{row.username} · NIM {row.nim}
                                    </p>
                                </div>
                                <StatusBadge
                                    status={row.aktif ? 'aktif' : 'nonaktif'}
                                />
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                                <span className="text-muted-foreground">
                                    {row.komsat?.kode} — {row.divisi?.nama} (
                                    {row.angkatan})
                                </span>
                                <span className="font-semibold tabular-nums">
                                    {formatPoin(row.total_poin)} poin
                                </span>
                            </div>
                            <div>
                                <Badge variant="secondary">
                                    {row.status_penerima_label}
                                </Badge>
                            </div>
                            <RowActions row={row} />
                        </div>
                    )}
                    emptyState={
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <Users className="mx-auto size-8 text-muted-foreground" />
                            <p className="mt-3 font-medium">
                                {hasActiveFilter
                                    ? 'Tidak ada anggota yang sesuai filter'
                                    : 'Belum ada data anggota mahasiswa'}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {hasActiveFilter
                                    ? 'Ubah kata kunci pencarian atau atur ulang filter yang diterapkan.'
                                    : 'Tambahkan akun anggota mahasiswa baru untuk memberikan akses ke sistem.'}
                            </p>
                            <div className="mt-4 flex justify-center">
                                {hasActiveFilter ? (
                                    <Button variant="outline" asChild>
                                        <Link href={admin.mahasiswa.index()}>
                                            Reset Filter
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button asChild>
                                        <Link href={admin.mahasiswa.create()}>
                                            <Plus className="size-4" />
                                            <span>Tambah Anggota</span>
                                        </Link>
                                    </Button>
                                )}
                            </div>
                        </div>
                    }
                />

                <Pagination links={mahasiswa.links} />
            </div>
        </>
    );
}

MahasiswaIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Anggota', href: admin.mahasiswa.index() },
    ],
};

function RowActions({ row }: { row: MahasiswaRow }) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <Button variant="outline" size="sm" asChild className="h-11 md:h-8">
                <Link href={admin.mahasiswa.show(row.id)}>
                    <Eye className="size-3.5" />
                    <span>Detail</span>
                </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="h-11 md:h-8">
                <Link href={admin.mahasiswa.edit(row.id)}>
                    <Pencil className="size-3.5" />
                    <span>Ubah</span>
                </Link>
            </Button>
            <Form
                {...MahasiswaController.toggleAktif.form(row.id)}
                options={{ preserveScroll: true }}
            >
                {({ processing }) => (
                    <>
                        <input
                            type="hidden"
                            name="aktif"
                            value={row.aktif ? '0' : '1'}
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            type="submit"
                            disabled={processing}
                            className="h-11 md:h-8"
                        >
                            <Power className="size-3.5" />
                            <span>
                                {row.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                            </span>
                        </Button>
                    </>
                )}
            </Form>
            <DeleteMahasiswaDialog row={row} />
        </div>
    );
}

function Pagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 3) {
        return null;
    }

    return (
        <nav
            className="flex flex-wrap justify-center gap-1"
            aria-label="Navigasi halaman"
        >
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={index}
                        href={link.url}
                        preserveScroll
                        className={`min-h-10 min-w-10 rounded-md px-3 py-2 text-center text-sm ${link.active ? 'bg-primary text-primary-foreground' : 'border hover:bg-muted'}`}
                    >
                        {decodePaginationLabel(link.label)}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="min-h-10 min-w-10 px-3 py-2 text-center text-sm text-muted-foreground"
                    >
                        {decodePaginationLabel(link.label)}
                    </span>
                ),
            )}
        </nav>
    );
}

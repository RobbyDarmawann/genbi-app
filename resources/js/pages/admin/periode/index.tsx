import { Form, Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    Pencil,
    Plus,
    Power,
    Search,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import PeriodeController from '@/actions/App/Http/Controllers/Admin/PeriodeController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatTanggalWita } from '@/lib/format';
import admin, { dashboard } from '@/routes/admin';

type Periode = {
    id: number;
    nama: string;
    tanggal_mulai: string;
    tanggal_selesai: string;
    aktif: boolean;
    kepengurusan_count: number;
    terikat: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    periode: {
        data: Periode[];
        links: PaginationLink[];
    };
    filters: {
        q: string;
    };
};

function decodeLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&');
}

export default function PeriodeIndex({ periode, filters }: PageProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Periode | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (row: Periode) => {
        setEditing(row);
        setDialogOpen(true);
    };

    const columns: ResponsiveColumn<Periode>[] = [
        {
            key: 'nama',
            header: 'Nama periode',
            cell: (row) => <span className="font-medium">{row.nama}</span>,
        },
        {
            key: 'mulai',
            header: 'Tanggal mulai',
            cell: (row) => formatTanggalWita(`${row.tanggal_mulai}T00:00:00`),
        },
        {
            key: 'selesai',
            header: 'Tanggal selesai',
            cell: (row) => formatTanggalWita(`${row.tanggal_selesai}T00:00:00`),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (row) => (
                <StatusBadge status={row.aktif ? 'aktif' : 'nonaktif'} />
            ),
        },
        {
            key: 'aksi',
            header: 'Aksi',
            align: 'right',
            cell: (row) => <Actions row={row} onEdit={() => openEdit(row)} />,
        },
    ];

    return (
        <>
            <Head title="Master Data Periode" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        title="Periode Kepengurusan"
                        description="Kelola periode aktif kepengurusan GenBI Gorontalo."
                    />
                    <Button className="h-11 md:h-9" onClick={openCreate}>
                        <Plus className="size-4" />
                        <span>Tambah Periode</span>
                    </Button>
                </header>

                <nav
                    className="flex gap-2 overflow-x-auto border-b pb-2 text-sm font-medium"
                    aria-label="Master Data"
                >
                    <Link
                        className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
                        href={admin.periode.index()}
                    >
                        Periode
                    </Link>
                    <Link
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        href={admin.komsat.index()}
                    >
                        Komisariat
                    </Link>
                    <Link
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        href={admin.divisi.index()}
                    >
                        Divisi
                    </Link>
                </nav>

                <Form
                    {...PeriodeController.index.form()}
                    options={{ preserveState: true, preserveScroll: true }}
                    className="flex flex-col gap-2 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="h-11 pl-9 md:h-9"
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari nama periode..."
                            aria-label="Cari periode"
                        />
                    </div>
                    <Button
                        variant="secondary"
                        className="h-11 md:h-9"
                        type="submit"
                    >
                        Cari
                    </Button>
                </Form>

                <ResponsiveTable
                    caption="Daftar periode kepengurusan"
                    columns={columns}
                    data={periode.data}
                    keyExtractor={(row) => row.id}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="font-semibold">
                                        {row.nama}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {formatTanggalWita(
                                            `${row.tanggal_mulai}T00:00:00`,
                                        )}{' '}
                                        –{' '}
                                        {formatTanggalWita(
                                            `${row.tanggal_selesai}T00:00:00`,
                                        )}
                                    </p>
                                </div>
                                <StatusBadge
                                    status={row.aktif ? 'aktif' : 'nonaktif'}
                                />
                            </div>
                            <Actions row={row} onEdit={() => openEdit(row)} />
                        </div>
                    )}
                    emptyState={
                        <div className="rounded-lg border border-dashed p-8 text-center">
                            <CalendarDays className="mx-auto size-8 text-muted-foreground" />
                            <p className="mt-3 font-medium">
                                Belum ada data periode
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tambahkan periode untuk mulai mengelola
                                kepengurusan.
                            </p>
                        </div>
                    }
                />

                <Pagination links={periode.links} />

                <PeriodeDialog
                    key={editing ? `edit-${editing.id}` : 'create'}
                    record={editing}
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) {
                            setEditing(null);
                        }
                    }}
                />
            </div>
        </>
    );
}

PeriodeIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Master Data', href: admin.komsat.index() },
        { title: 'Periode', href: admin.periode.index() },
    ],
};

function Actions({ row, onEdit }: { row: Periode; onEdit: () => void }) {
    return (
        <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
                variant="outline"
                size="sm"
                className="h-11 md:h-8"
                onClick={onEdit}
            >
                <Pencil className="size-3.5" />
                <span>Ubah</span>
            </Button>
            <Form
                {...PeriodeController.toggleAktif.form(row.id)}
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
            <DeleteAction row={row} />
        </div>
    );
}

function PeriodeDialog({
    record,
    open,
    onOpenChange,
}: {
    record: Periode | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [aktif, setAktif] = useState<boolean>(record?.aktif ?? false);
    const endpoint = record
        ? PeriodeController.update.form(record.id)
        : PeriodeController.store.form();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90dvh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {record ? 'Ubah Periode' : 'Tambah Periode'}
                    </DialogTitle>
                    <DialogDescription>
                        Isi informasi periode kepengurusan. Mengaktifkan satu
                        periode akan menonaktifkan periode aktif lainnya.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...endpoint}
                    options={{ preserveScroll: true }}
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4"
                >
                    {({ errors, processing }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama periode</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    defaultValue={record?.nama}
                                    placeholder="Contoh: Periode 2026/2027"
                                    required
                                    className="h-11 md:h-9"
                                />
                                <InputError message={errors.nama} />
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label htmlFor="tanggal_mulai">
                                        Tanggal mulai
                                    </Label>
                                    <Input
                                        id="tanggal_mulai"
                                        name="tanggal_mulai"
                                        type="date"
                                        defaultValue={record?.tanggal_mulai}
                                        required
                                        className="h-11 md:h-9"
                                    />
                                    <InputError
                                        message={errors.tanggal_mulai}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="tanggal_selesai">
                                        Tanggal selesai
                                    </Label>
                                    <Input
                                        id="tanggal_selesai"
                                        name="tanggal_selesai"
                                        type="date"
                                        defaultValue={record?.tanggal_selesai}
                                        required
                                        className="h-11 md:h-9"
                                    />
                                    <InputError
                                        message={errors.tanggal_selesai}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-2 pt-1">
                                <input
                                    type="hidden"
                                    name="aktif"
                                    value={aktif ? '1' : '0'}
                                />
                                <Checkbox
                                    id="aktif"
                                    checked={aktif}
                                    onCheckedChange={(checked) =>
                                        setAktif(checked === true)
                                    }
                                />
                                <Label
                                    htmlFor="aktif"
                                    className="text-sm font-normal"
                                >
                                    Jadikan periode aktif saat ini
                                </Label>
                            </div>
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-11 md:h-9"
                                    >
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 md:h-9"
                                >
                                    {record
                                        ? 'Simpan Perubahan'
                                        : 'Simpan Periode'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteAction({ row }: { row: Periode }) {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="destructive"
                    size="sm"
                    disabled={row.terikat}
                    title={
                        row.terikat
                            ? 'Periode terikat kepengurusan tidak dapat dihapus'
                            : 'Hapus periode'
                    }
                    className="h-11 md:h-8"
                >
                    <Trash2 className="size-3.5" />
                    <span>Hapus</span>
                </Button>
            </DialogTrigger>
            <DialogContent role="alertdialog">
                <DialogHeader>
                    <DialogTitle>Hapus periode?</DialogTitle>
                    <DialogDescription>
                        Periode “{row.nama}” akan dihapus secara permanen dari
                        sistem.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...PeriodeController.destroy.form(row.id)}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ errors, processing }) => (
                        <>
                            <InputError
                                message={
                                    (errors as Record<string, string>).delete
                                }
                            />
                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="h-11 md:h-9"
                                    >
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button
                                    variant="destructive"
                                    type="submit"
                                    disabled={processing}
                                    className="h-11 md:h-9"
                                >
                                    Hapus Periode
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
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
                        className={`min-h-10 min-w-10 rounded-md px-3 py-2 text-center text-sm ${
                            link.active
                                ? 'bg-primary text-primary-foreground'
                                : 'border hover:bg-muted'
                        }`}
                    >
                        {decodeLabel(link.label)}
                    </Link>
                ) : (
                    <span
                        key={index}
                        className="min-h-10 min-w-10 px-3 py-2 text-center text-sm text-muted-foreground"
                    >
                        {decodeLabel(link.label)}
                    </span>
                ),
            )}
        </nav>
    );
}

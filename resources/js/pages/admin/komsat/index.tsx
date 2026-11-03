import { Form, Head, Link } from '@inertiajs/react';
import { Building2, Pencil, Plus, Power, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import KomsatController from '@/actions/App/Http/Controllers/Admin/KomsatController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
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
import admin, { dashboard } from '@/routes/admin';

type Komsat = {
    id: number;
    kode: string;
    nama: string;
    aktif: boolean;
    divisi_count: number;
    mahasiswa_count: number;
    kegiatan_count: number;
    kepengurusan_count: number;
    terikat: boolean;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    komsat: {
        data: Komsat[];
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

export default function KomsatIndex({ komsat, filters }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Komsat | null>(null);

    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };

    const openEdit = (row: Komsat) => {
        setEditing(row);
        setDialogOpen(true);
    };

    const columns: ResponsiveColumn<Komsat>[] = [
        {
            key: 'kode',
            header: 'Kode',
            cell: (row) => <span className="font-semibold">{row.kode}</span>,
        },
        {
            key: 'nama',
            header: 'Nama komisariat',
            cell: (row) => row.nama,
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
            <Head title="Master Data Komisariat" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        title="Komisariat"
                        description="Kelola data komisariat GenBI Gorontalo."
                    />
                    <Button className="h-11 md:h-9" onClick={openCreate}>
                        <Plus className="size-4" />
                        <span>Tambah Komisariat</span>
                    </Button>
                </header>

                <nav
                    className="flex gap-2 overflow-x-auto border-b pb-2 text-sm font-medium"
                    aria-label="Master Data"
                >
                    <Link
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        href={admin.periode.index()}
                    >
                        Periode
                    </Link>
                    <Link
                        className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
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
                    {...KomsatController.index.form()}
                    options={{ preserveState: true, preserveScroll: true }}
                    className="flex flex-col gap-2 sm:flex-row"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="h-11 pl-9 md:h-9"
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari kode atau nama komisariat..."
                            aria-label="Cari komisariat"
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
                    caption="Daftar komisariat"
                    columns={columns}
                    data={komsat.data}
                    keyExtractor={(row) => row.id}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="text-sm font-semibold text-primary">
                                        {row.kode}
                                    </p>
                                    <h2 className="font-semibold">
                                        {row.nama}
                                    </h2>
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
                            <Building2 className="mx-auto size-8 text-muted-foreground" />
                            <p className="mt-3 font-medium">
                                Belum ada komisariat
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tambahkan data komisariat untuk mengelola
                                divisi.
                            </p>
                        </div>
                    }
                />

                <Pagination links={komsat.links} />

                <KomsatDialog
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

KomsatIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Master Data', href: admin.komsat.index() },
        { title: 'Komisariat', href: admin.komsat.index() },
    ],
};

function Actions({ row, onEdit }: { row: Komsat; onEdit: () => void }) {
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
                {...KomsatController.toggleAktif.form(row.id)}
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

function KomsatDialog({
    record,
    open,
    onOpenChange,
}: {
    record: Komsat | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const endpoint = record
        ? KomsatController.update.form(record.id)
        : KomsatController.store.form();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {record ? 'Ubah Komisariat' : 'Tambah Komisariat'}
                    </DialogTitle>
                    <DialogDescription>
                        Kode komisariat unik dan akan dinormalisasi menjadi
                        huruf kapital.
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
                                <Label htmlFor="kode">Kode komisariat</Label>
                                <Input
                                    id="kode"
                                    name="kode"
                                    defaultValue={record?.kode}
                                    placeholder="Contoh: UNG"
                                    required
                                    maxLength={10}
                                    className="h-11 uppercase md:h-9"
                                />
                                <InputError message={errors.kode} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">
                                    Nama perguruan tinggi
                                </Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    defaultValue={record?.nama}
                                    placeholder="Contoh: Universitas Negeri Gorontalo"
                                    required
                                    className="h-11 md:h-9"
                                />
                                <InputError message={errors.nama} />
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
                                        : 'Simpan Komisariat'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteAction({ row }: { row: Komsat }) {
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
                            ? 'Komisariat terikat data tidak dapat dihapus'
                            : 'Hapus komisariat'
                    }
                    className="h-11 md:h-8"
                >
                    <Trash2 className="size-3.5" />
                    <span>Hapus</span>
                </Button>
            </DialogTrigger>
            <DialogContent role="alertdialog">
                <DialogHeader>
                    <DialogTitle>Hapus komisariat?</DialogTitle>
                    <DialogDescription>
                        Data {row.kode} — {row.nama} akan dihapus secara
                        permanen.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...KomsatController.destroy.form(row.id)}
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
                                    Hapus Komisariat
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

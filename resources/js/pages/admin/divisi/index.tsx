import { Form, Head, Link } from '@inertiajs/react';
import { FolderTree, Pencil, Plus, Power, Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import DivisiController from '@/actions/App/Http/Controllers/Admin/DivisiController';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import admin, { dashboard } from '@/routes/admin';

type Divisi = {
    id: number;
    komsat_id: number;
    nama: string;
    aktif: boolean;
    terikat: boolean;
    komsat: { id: number; kode: string; nama: string } | null;
};
type KomsatOption = { id: number; kode: string; nama: string; aktif: boolean };
type PaginationLink = { url: string | null; label: string; active: boolean };
type Props = {
    divisi: { data: Divisi[]; links: PaginationLink[] };
    komsatOptions: KomsatOption[];
    filters: { q: string; komsat_id: string };
};

function decodeLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&');
}

export default function DivisiIndex({ divisi, komsatOptions, filters }: Props) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<Divisi | null>(null);
    const [filterKomsat, setFilterKomsat] = useState<string>(
        filters.komsat_id || 'all',
    );
    const openCreate = () => {
        setEditing(null);
        setDialogOpen(true);
    };
    const openEdit = (row: Divisi) => {
        setEditing(row);
        setDialogOpen(true);
    };
    const columns: ResponsiveColumn<Divisi>[] = [
        {
            key: 'nama',
            header: 'Nama divisi',
            cell: (row) => <span className="font-medium">{row.nama}</span>,
        },
        {
            key: 'komsat',
            header: 'Komisariat',
            cell: (row) =>
                row.komsat ? (
                    <span>
                        <strong>{row.komsat.kode}</strong>{' '}
                        <span className="text-muted-foreground">
                            — {row.komsat.nama}
                        </span>
                    </span>
                ) : (
                    '—'
                ),
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
            <Head title="Master Data Divisi" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <Heading
                        title="Divisi"
                        description="Kelola divisi pada setiap komisariat."
                    />
                    <Button className="h-11 md:h-9" onClick={openCreate}>
                        <Plus className="size-4" />
                        <span>Tambah Divisi</span>
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
                        className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        href={admin.komsat.index()}
                    >
                        Komisariat
                    </Link>
                    <Link
                        className="rounded-md bg-primary px-3 py-2 text-primary-foreground"
                        href={admin.divisi.index()}
                    >
                        Divisi
                    </Link>
                </nav>
                <Form
                    {...DivisiController.index.form()}
                    options={{ preserveState: true, preserveScroll: true }}
                    className="grid gap-2 sm:grid-cols-[1fr_260px_auto]"
                >
                    <div className="relative">
                        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            className="h-11 pl-9 md:h-9"
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari nama divisi..."
                            aria-label="Cari divisi"
                        />
                    </div>
                    <div>
                        <input
                            type="hidden"
                            name="komsat_id"
                            value={filterKomsat === 'all' ? '' : filterKomsat}
                        />
                        <Select
                            value={filterKomsat}
                            onValueChange={setFilterKomsat}
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
                    <Button
                        variant="secondary"
                        className="h-11 md:h-9"
                        type="submit"
                    >
                        Terapkan
                    </Button>
                </Form>
                <ResponsiveTable
                    caption="Daftar divisi"
                    columns={columns}
                    data={divisi.data}
                    keyExtractor={(row) => row.id}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h2 className="font-semibold">
                                        {row.nama}
                                    </h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {row.komsat?.kode} — {row.komsat?.nama}
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
                            <FolderTree className="mx-auto size-8 text-muted-foreground" />
                            <p className="mt-3 font-medium">
                                Belum ada data divisi
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tambahkan divisi pada komisariat yang tersedia.
                            </p>
                        </div>
                    }
                />
                <Pagination links={divisi.links} />
                <DivisiDialog
                    key={editing ? `edit-${editing.id}` : 'create'}
                    record={editing}
                    options={komsatOptions}
                    open={dialogOpen}
                    onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (!open) setEditing(null);
                    }}
                />
            </div>
        </>
    );
}

DivisiIndex.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Master Data', href: admin.komsat.index() },
        { title: 'Divisi', href: admin.divisi.index() },
    ],
};

function Actions({ row, onEdit }: { row: Divisi; onEdit: () => void }) {
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
                {...DivisiController.toggleAktif.form(row.id)}
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

function DivisiDialog({
    record,
    options,
    open,
    onOpenChange,
}: {
    record: Divisi | null;
    options: KomsatOption[];
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [komsatId, setKomsatId] = useState<string>(
        record ? String(record.komsat_id) : '',
    );
    const endpoint = record
        ? DivisiController.update.form(record.id)
        : DivisiController.store.form();
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {record ? 'Ubah Divisi' : 'Tambah Divisi'}
                    </DialogTitle>
                    <DialogDescription>
                        Nama divisi harus unik dalam satu komisariat.
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
                                <Label htmlFor="komsat_id">Komisariat</Label>
                                <input
                                    type="hidden"
                                    name="komsat_id"
                                    value={komsatId}
                                />
                                <Select
                                    value={komsatId || undefined}
                                    onValueChange={setKomsatId}
                                >
                                    <SelectTrigger
                                        id="komsat_id"
                                        className="h-11 w-full md:h-9"
                                    >
                                        <SelectValue placeholder="Pilih komisariat" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={String(option.id)}
                                            >
                                                {option.kode} — {option.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.komsat_id} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="nama">Nama divisi</Label>
                                <Input
                                    id="nama"
                                    name="nama"
                                    defaultValue={record?.nama}
                                    placeholder="Contoh: Pendidikan"
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
                                        : 'Simpan Divisi'}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function DeleteAction({ row }: { row: Divisi }) {
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
                            ? 'Divisi terikat data tidak dapat dihapus'
                            : 'Hapus divisi'
                    }
                    className="h-11 md:h-8"
                >
                    <Trash2 className="size-3.5" />
                    <span>Hapus</span>
                </Button>
            </DialogTrigger>
            <DialogContent role="alertdialog">
                <DialogHeader>
                    <DialogTitle>Hapus divisi?</DialogTitle>
                    <DialogDescription>
                        Divisi “{row.nama}” akan dihapus permanen.
                    </DialogDescription>
                </DialogHeader>
                <Form
                    {...DivisiController.destroy.form(row.id)}
                    options={{ preserveScroll: true }}
                    onSuccess={() => setOpen(false)}
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
                                    Hapus Divisi
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
    if (links.length <= 3) return null;
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

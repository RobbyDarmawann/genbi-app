import { Form, Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { FormEvent, useState } from 'react';
import KepengurusanController from '@/actions/App/Http/Controllers/Admin/KepengurusanController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import admin from '@/routes/admin';

type KepengurusanItem = {
    id: number;
    periode_id: number;
    periode_nama: string;
    periode_aktif: boolean;
    komsat_id: number | null;
    komsat_kode: string | null;
    komsat_nama: string | null;
    lingkup_label: string;
    mahasiswa_id: number | null;
    mahasiswa_nama: string | null;
    nama_tampil: string;
    jabatan: string;
    urutan: number;
    kontak: string | null;
};

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PageProps = {
    kepengurusan: {
        data: KepengurusanItem[];
        links: PaginationLink[];
    };
    filters: {
        periode_id: string;
        komsat_id: string;
        q: string;
    };
    options: {
        periode: { id: number; nama: string; aktif: boolean }[];
        komsat: { id: number; kode: string; nama: string }[];
        mahasiswa: { id: number; nama: string; nim: string; komsat: string }[];
    };
    periode_terpilih: { id: number; nama: string; aktif: boolean } | null;
};

function decodeLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&');
}

export default function KepengurusanIndex({
    kepengurusan,
    filters,
    options,
    periode_terpilih,
}: PageProps) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editing, setEditing] = useState<KepengurusanItem | null>(null);
    const [lingkupType, setLingkupType] = useState<'wilayah' | 'komsat'>(
        'wilayah',
    );
    const [selectedMahasiswaId, setSelectedMahasiswaId] = useState<string>('');
    const [namaTampil, setNamaTampil] = useState<string>('');
    const [selectedKomsatId, setSelectedKomsatId] = useState<string>('');

    const openCreate = () => {
        setEditing(null);
        setLingkupType('wilayah');
        setSelectedMahasiswaId('');
        setNamaTampil('');
        setSelectedKomsatId('');
        setDialogOpen(true);
    };

    const openEdit = (row: KepengurusanItem) => {
        setEditing(row);
        setLingkupType(row.komsat_id ? 'komsat' : 'wilayah');
        setSelectedMahasiswaId(
            row.mahasiswa_id ? String(row.mahasiswa_id) : '',
        );
        setNamaTampil(row.nama_tampil);
        setSelectedKomsatId(row.komsat_id ? String(row.komsat_id) : '');
        setDialogOpen(true);
    };

    const handleMahasiswaChange = (val: string) => {
        setSelectedMahasiswaId(val);
        if (val && val !== 'none') {
            const found = options.mahasiswa.find((m) => String(m.id) === val);
            if (found && !editing) {
                setNamaTampil(found.nama);
            }
        }
    };

    const handleDelete = (row: KepengurusanItem) => {
        if (
            confirm(
                `Apakah Anda yakin ingin menghapus "${row.nama_tampil}" (${row.jabatan}) dari direktori?`,
            )
        ) {
            router.delete(KepengurusanController.destroy(row.id), {
                preserveScroll: true,
            });
        }
    };

    const handleFilterSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData(e.currentTarget);
        router.get(
            admin.kepengurusan.index().url,
            {
                periode_id: (form.get('periode_id') as string) || '',
                komsat_id: (form.get('komsat_id') as string) || '',
                q: (form.get('q') as string) || '',
            },
            { preserveState: true, replace: true },
        );
    };

    const columns: ResponsiveColumn<KepengurusanItem>[] = [
        {
            key: 'urutan',
            header: 'No.',
            cell: (row) => (
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {row.urutan}
                </span>
            ),
        },
        {
            key: 'nama',
            header: 'Nama & Jabatan',
            cell: (row) => (
                <div>
                    <p className="font-semibold text-foreground">
                        {row.nama_tampil}
                    </p>
                    <p className="text-sm font-medium text-primary">
                        {row.jabatan}
                    </p>
                    {row.mahasiswa_nama && (
                        <p className="text-xs text-muted-foreground">
                            Akun: {row.mahasiswa_nama}
                        </p>
                    )}
                </div>
            ),
        },
        {
            key: 'lingkup',
            header: 'Lingkup',
            cell: (row) => (
                <div className="space-y-1">
                    <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {row.lingkup_label}
                    </span>
                    <p className="text-xs text-muted-foreground">
                        {row.periode_nama} {row.periode_aktif && '· Aktif'}
                    </p>
                </div>
            ),
        },
        {
            key: 'kontak',
            header: 'Kontak',
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.kontak || '-'}
                </span>
            ),
        },
        {
            key: 'aksi',
            header: 'Aksi',
            align: 'right',
            cell: (row) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        onClick={() => openEdit(row)}
                        title="Edit data pengurus"
                    >
                        <Pencil className="size-4" />
                        <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8 text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(row)}
                        title="Hapus dari direktori"
                    >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Hapus</span>
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Direktori Kepengurusan" />

            <div className="mx-auto w-full max-w-7xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <Heading
                            title="Direktori Kepengurusan"
                            description="Kelola susunan pengurus GenBI Gorontalo tingkat Wilayah dan Komisariat."
                        />
                        {periode_terpilih && (
                            <p className="mt-1 text-sm text-muted-foreground">
                                Periode aktif saat ini:{' '}
                                <span className="font-semibold text-foreground">
                                    {periode_terpilih.nama}
                                </span>{' '}
                                {periode_terpilih.aktif && (
                                    <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                                        Periode Aktif
                                    </span>
                                )}
                            </p>
                        )}
                    </div>
                    <Button
                        className="h-11 shrink-0 md:h-9"
                        onClick={openCreate}
                    >
                        <Plus className="size-4" />
                        <span>Tambah Pengurus</span>
                    </Button>
                </header>

                <form
                    onSubmit={handleFilterSubmit}
                    className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-2 md:grid-cols-4"
                >
                    <div>
                        <Label
                            htmlFor="filter-periode"
                            className="text-xs text-muted-foreground"
                        >
                            Periode
                        </Label>
                        <select
                            id="filter-periode"
                            name="periode_id"
                            defaultValue={filters.periode_id}
                            className="mt-1 h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                        >
                            <option value="">Semua Periode</option>
                            {options.periode.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.nama} {p.aktif ? '(Aktif)' : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label
                            htmlFor="filter-komsat"
                            className="text-xs text-muted-foreground"
                        >
                            Lingkup / Komsat
                        </Label>
                        <select
                            id="filter-komsat"
                            name="komsat_id"
                            defaultValue={filters.komsat_id}
                            className="mt-1 h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                        >
                            <option value="">Semua Lingkup</option>
                            <option value="wilayah">Tingkat Wilayah</option>
                            {options.komsat.map((k) => (
                                <option key={k.id} value={k.id}>
                                    Komsat {k.kode}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <Label
                            htmlFor="filter-q"
                            className="text-xs text-muted-foreground"
                        >
                            Pencarian
                        </Label>
                        <div className="mt-1 flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="filter-q"
                                    name="q"
                                    defaultValue={filters.q}
                                    placeholder="Cari nama atau jabatan..."
                                    className="h-11 pl-9 md:h-9"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="secondary"
                                className="h-11 shrink-0 md:h-9"
                            >
                                Filter
                            </Button>
                        </div>
                    </div>
                </form>

                <ResponsiveTable
                    data={kepengurusan.data}
                    columns={columns}
                    keyExtractor={(row) => row.id}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-3">
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {row.nama_tampil}
                                    </p>
                                    <p className="text-sm font-medium text-primary">
                                        {row.jabatan}
                                    </p>
                                    {row.mahasiswa_nama && (
                                        <p className="text-xs text-muted-foreground">
                                            Akun: {row.mahasiswa_nama}
                                        </p>
                                    )}
                                </div>
                                <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums">
                                    #{row.urutan}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                                <span>
                                    {row.lingkup_label} · {row.periode_nama}
                                    {row.periode_aktif
                                        ? ' (Periode Aktif)'
                                        : ' (Arsip)'}
                                </span>
                                {row.kontak && <span>{row.kontak}</span>}
                            </div>
                            <div className="flex justify-end gap-2 border-t pt-2">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-11 md:h-9"
                                    onClick={() => openEdit(row)}
                                >
                                    <Pencil className="size-4" />
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    className="h-11 md:h-9"
                                    onClick={() => handleDelete(row)}
                                >
                                    <Trash2 className="size-4" />
                                    Hapus
                                </Button>
                            </div>
                        </div>
                    )}
                    emptyState={
                        <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                            Belum ada data pengurus yang sesuai filter.
                        </div>
                    }
                />

                {kepengurusan.links.length > 3 && (
                    <div className="flex flex-wrap justify-center gap-1">
                        {kepengurusan.links.map((link, idx) => (
                            <Link
                                key={idx}
                                href={link.url ?? '#'}
                                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                                    link.active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-muted'
                                } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            >
                                {decodeLabel(link.label)}
                            </Link>
                        ))}
                    </div>
                )}

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
                        <DialogHeader>
                            <DialogTitle>
                                {editing
                                    ? 'Edit Data Pengurus'
                                    : 'Tambah Pengurus Baru'}
                            </DialogTitle>
                            <DialogDescription>
                                Masukkan detail kepengurusan GenBI Gorontalo
                                untuk direktori publik dan arsip.
                            </DialogDescription>
                        </DialogHeader>

                        {editing ? (
                            <Form
                                {...KepengurusanController.update.form(
                                    editing.id,
                                )}
                                onSuccess={() => setDialogOpen(false)}
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-periode">
                                                Periode *
                                            </Label>
                                            <select
                                                id="edit-periode"
                                                name="periode_id"
                                                defaultValue={
                                                    editing.periode_id
                                                }
                                                className="h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                                                required
                                            >
                                                {options.periode.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.nama}{' '}
                                                        {p.aktif
                                                            ? '(Periode Aktif)'
                                                            : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.periode_id}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Lingkup Kepengurusan *
                                            </Label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="lingkup_radio"
                                                        value="wilayah"
                                                        checked={
                                                            lingkupType ===
                                                            'wilayah'
                                                        }
                                                        onChange={() =>
                                                            setLingkupType(
                                                                'wilayah',
                                                            )
                                                        }
                                                        className="text-primary"
                                                    />
                                                    Tingkat Wilayah
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="lingkup_radio"
                                                        value="komsat"
                                                        checked={
                                                            lingkupType ===
                                                            'komsat'
                                                        }
                                                        onChange={() =>
                                                            setLingkupType(
                                                                'komsat',
                                                            )
                                                        }
                                                        className="text-primary"
                                                    />
                                                    Komisariat (Komsat)
                                                </label>
                                            </div>
                                        </div>

                                        {lingkupType === 'komsat' && (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-komsat">
                                                    Pilih Komsat *
                                                </Label>
                                                <select
                                                    id="edit-komsat"
                                                    name="komsat_id"
                                                    value={selectedKomsatId}
                                                    onChange={(e) =>
                                                        setSelectedKomsatId(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                                                    required={
                                                        lingkupType === 'komsat'
                                                    }
                                                >
                                                    <option value="">
                                                        Pilih Komsat...
                                                    </option>
                                                    {options.komsat.map((k) => (
                                                        <option
                                                            key={k.id}
                                                            value={k.id}
                                                        >
                                                            Komsat {k.kode} -{' '}
                                                            {k.nama}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError
                                                    message={errors.komsat_id}
                                                />
                                            </div>
                                        )}
                                        {lingkupType === 'wilayah' && (
                                            <input
                                                type="hidden"
                                                name="komsat_id"
                                                value=""
                                            />
                                        )}

                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-mahasiswa">
                                                Tautkan Mahasiswa Terdaftar
                                                (Opsional)
                                            </Label>
                                            <select
                                                id="edit-mahasiswa"
                                                name="mahasiswa_id"
                                                value={selectedMahasiswaId}
                                                onChange={(e) =>
                                                    handleMahasiswaChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                                            >
                                                <option value="">
                                                    Bukan Mahasiswa Terdaftar di
                                                    Sistem
                                                </option>
                                                {options.mahasiswa.map((m) => (
                                                    <option
                                                        key={m.id}
                                                        value={m.id}
                                                    >
                                                        {m.nama} ({m.nim} -
                                                        Komsat {m.komsat})
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.mahasiswa_id}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-nama">
                                                Nama Tampil *
                                            </Label>
                                            <Input
                                                id="edit-nama"
                                                name="nama_tampil"
                                                value={namaTampil}
                                                onChange={(e) =>
                                                    setNamaTampil(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Fulan bin Fulan"
                                                className="h-11 md:h-9"
                                                required
                                            />
                                            <InputError
                                                message={errors.nama_tampil}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-jabatan">
                                                Jabatan *
                                            </Label>
                                            <Input
                                                id="edit-jabatan"
                                                name="jabatan"
                                                defaultValue={editing.jabatan}
                                                placeholder="Contoh: Ketua Wilayah, Sekretaris, Bendahara"
                                                className="h-11 md:h-9"
                                                required
                                            />
                                            <InputError
                                                message={errors.jabatan}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-urutan">
                                                    Urutan Tampil *
                                                </Label>
                                                <Input
                                                    id="edit-urutan"
                                                    name="urutan"
                                                    type="number"
                                                    min="0"
                                                    defaultValue={
                                                        editing.urutan
                                                    }
                                                    className="h-11 md:h-9"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.urutan}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-kontak">
                                                    Kontak Publik (Opsional)
                                                </Label>
                                                <Input
                                                    id="edit-kontak"
                                                    name="kontak"
                                                    defaultValue={
                                                        editing.kontak ?? ''
                                                    }
                                                    placeholder="Email / IG / No. Telp"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.kontak}
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter className="gap-2 sm:gap-0">
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    Batal
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Simpan Perubahan'}
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        ) : (
                            <Form
                                {...KepengurusanController.store.form()}
                                onSuccess={() => setDialogOpen(false)}
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="space-y-1.5">
                                            <Label htmlFor="create-periode">
                                                Periode *
                                            </Label>
                                            <select
                                                id="create-periode"
                                                name="periode_id"
                                                defaultValue={
                                                    periode_terpilih?.id ??
                                                    options.periode[0]?.id ??
                                                    ''
                                                }
                                                className="h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                                                required
                                            >
                                                {options.periode.map((p) => (
                                                    <option
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.nama}{' '}
                                                        {p.aktif
                                                            ? '(Periode Aktif)'
                                                            : ''}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.periode_id}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label>
                                                Lingkup Kepengurusan *
                                            </Label>
                                            <div className="flex gap-4">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="lingkup_radio"
                                                        value="wilayah"
                                                        checked={
                                                            lingkupType ===
                                                            'wilayah'
                                                        }
                                                        onChange={() =>
                                                            setLingkupType(
                                                                'wilayah',
                                                            )
                                                        }
                                                        className="text-primary"
                                                    />
                                                    Tingkat Wilayah
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="lingkup_radio"
                                                        value="komsat"
                                                        checked={
                                                            lingkupType ===
                                                            'komsat'
                                                        }
                                                        onChange={() =>
                                                            setLingkupType(
                                                                'komsat',
                                                            )
                                                        }
                                                        className="text-primary"
                                                    />
                                                    Komisariat (Komsat)
                                                </label>
                                            </div>
                                        </div>

                                        {lingkupType === 'komsat' && (
                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-komsat">
                                                    Pilih Komsat *
                                                </Label>
                                                <select
                                                    id="create-komsat"
                                                    name="komsat_id"
                                                    value={selectedKomsatId}
                                                    onChange={(e) =>
                                                        setSelectedKomsatId(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                                                    required={
                                                        lingkupType === 'komsat'
                                                    }
                                                >
                                                    <option value="">
                                                        Pilih Komsat...
                                                    </option>
                                                    {options.komsat.map((k) => (
                                                        <option
                                                            key={k.id}
                                                            value={k.id}
                                                        >
                                                            Komsat {k.kode} -{' '}
                                                            {k.nama}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError
                                                    message={errors.komsat_id}
                                                />
                                            </div>
                                        )}
                                        {lingkupType === 'wilayah' && (
                                            <input
                                                type="hidden"
                                                name="komsat_id"
                                                value=""
                                            />
                                        )}

                                        <div className="space-y-1.5">
                                            <Label htmlFor="create-mahasiswa">
                                                Tautkan Mahasiswa Terdaftar
                                                (Opsional)
                                            </Label>
                                            <select
                                                id="create-mahasiswa"
                                                name="mahasiswa_id"
                                                value={selectedMahasiswaId}
                                                onChange={(e) =>
                                                    handleMahasiswaChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-11 w-full rounded-md border bg-background px-3 text-sm md:h-9"
                                            >
                                                <option value="">
                                                    Bukan Mahasiswa Terdaftar di
                                                    Sistem
                                                </option>
                                                {options.mahasiswa.map((m) => (
                                                    <option
                                                        key={m.id}
                                                        value={m.id}
                                                    >
                                                        {m.nama} ({m.nim} -
                                                        Komsat {m.komsat})
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.mahasiswa_id}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="create-nama">
                                                Nama Tampil *
                                            </Label>
                                            <Input
                                                id="create-nama"
                                                name="nama_tampil"
                                                value={namaTampil}
                                                onChange={(e) =>
                                                    setNamaTampil(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Contoh: Fulan bin Fulan"
                                                className="h-11 md:h-9"
                                                required
                                            />
                                            <InputError
                                                message={errors.nama_tampil}
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="create-jabatan">
                                                Jabatan *
                                            </Label>
                                            <Input
                                                id="create-jabatan"
                                                name="jabatan"
                                                placeholder="Contoh: Ketua Wilayah, Sekretaris, Bendahara"
                                                className="h-11 md:h-9"
                                                required
                                            />
                                            <InputError
                                                message={errors.jabatan}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-urutan">
                                                    Urutan Tampil *
                                                </Label>
                                                <Input
                                                    id="create-urutan"
                                                    name="urutan"
                                                    type="number"
                                                    min="0"
                                                    defaultValue={0}
                                                    className="h-11 md:h-9"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.urutan}
                                                />
                                            </div>

                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-kontak">
                                                    Kontak Publik (Opsional)
                                                </Label>
                                                <Input
                                                    id="create-kontak"
                                                    name="kontak"
                                                    placeholder="Email / IG / No. Telp"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.kontak}
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter className="gap-2 sm:gap-0">
                                            <DialogClose asChild>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                >
                                                    Batal
                                                </Button>
                                            </DialogClose>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Menyimpan...'
                                                    : 'Tambah Pengurus'}
                                            </Button>
                                        </DialogFooter>
                                    </>
                                )}
                            </Form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

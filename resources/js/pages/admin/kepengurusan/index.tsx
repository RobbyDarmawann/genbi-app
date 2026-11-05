import { Form, Head, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Pencil, Plus, Search, Trash2 } from 'lucide-react';
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
import { ContactsDisplay } from '@/pages/public/kepengurusan';
import admin from '@/routes/admin';

type KepengurusanItem = {
    id: number;
    periode_id: number;
    komsat_id: number | null;
    lingkup_label: string;
    mahasiswa_id: number | null;
    mahasiswa_nama: string | null;
    nama_tampil: string;
    jabatan: string;
    urutan: number;
    no_hp: string | null;
    instagram: string | null;
    email: string | null;
    kontak: string | null;
    foto_url: string | null;
};

type KomsatGroup = {
    komsat_id: number;
    komsat_kode: string;
    komsat_nama: string;
    items: KepengurusanItem[];
};

type KepengurusanGroupRow = KepengurusanItem & {
    display_no: number;
    is_first: boolean;
    is_last: boolean;
};

type PageProps = {
    kepengurusan_grouped: {
        wilayah: KepengurusanItem[];
        [key: string]: KepengurusanItem[] | KomsatGroup;
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

export default function KepengurusanIndex({
    kepengurusan_grouped,
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
    const [createUrutan, setCreateUrutan] = useState<number>(1);
    const [deleteTarget, setDeleteTarget] = useState<KepengurusanItem | null>(
        null,
    );

    const komsatGroups = Object.entries(kepengurusan_grouped)
        .filter(([key]) => key.startsWith('komsat_'))
        .map(([key, value]) => {
            const komsat = value as KomsatGroup;
            return {
                key,
                komsat_id: komsat.komsat_id,
                title: `Komsat ${komsat.komsat_kode}`,
                subtitle: komsat.komsat_nama,
                items: komsat.items,
            };
        });

    const allGroups: Array<{
        key: string;
        komsat_id: number | null;
        title: string;
        subtitle: string;
        items: KepengurusanItem[];
    }> = [
        {
            key: 'wilayah',
            komsat_id: null,
            title: 'Tingkat Wilayah',
            subtitle: 'Pengurus Wilayah GenBI Gorontalo',
            items: kepengurusan_grouped.wilayah ?? [],
        },
        ...komsatGroups,
    ];

    const visibleGroups = allGroups.filter((group) => {
        if (!filters.komsat_id || filters.komsat_id === 'all') {
            return true;
        }
        if (filters.komsat_id === 'wilayah') {
            return group.komsat_id === null;
        }
        return String(group.komsat_id) === String(filters.komsat_id);
    });

    const getNextUrutan = (items: KepengurusanItem[]): number => {
        if (items.length === 0) {
            return 1;
        }
        return Math.max(...items.map((item) => item.urutan)) + 1;
    };

    const openCreate = (group?: (typeof allGroups)[number]) => {
        const targetGroup = group ?? allGroups[0];
        setEditing(null);
        setLingkupType(targetGroup.komsat_id === null ? 'wilayah' : 'komsat');
        setSelectedMahasiswaId('');
        setNamaTampil('');
        setSelectedKomsatId(
            targetGroup.komsat_id !== null ? String(targetGroup.komsat_id) : '',
        );
        setCreateUrutan(getNextUrutan(targetGroup.items));
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

    const confirmDelete = () => {
        if (deleteTarget) {
            router.delete(KepengurusanController.destroy(deleteTarget.id), {
                preserveScroll: true,
                onFinish: () => setDeleteTarget(null),
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

    const handleReorder = (id: number, direction: 'up' | 'down') => {
        router.patch(
            KepengurusanController.reorder(id).url,
            { direction },
            { preserveScroll: true, preserveState: true },
        );
    };

    const columns: ResponsiveColumn<KepengurusanGroupRow>[] = [
        {
            key: 'urutan',
            header: 'No.',
            cell: (row) => (
                <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-semibold text-foreground tabular-nums">
                        {row.display_no}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground tabular-nums">
                        (#{row.urutan})
                    </span>
                </div>
            ),
        },
        {
            key: 'nama',
            header: 'Nama & Jabatan',
            cell: (row) => (
                <div className="flex items-center gap-3">
                    {row.foto_url ? (
                        <img
                            src={row.foto_url}
                            alt=""
                            className="size-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                            {row.nama_tampil
                                .split(/\s+/)
                                .slice(0, 2)
                                .map((part) => part[0])
                                .join('')
                                .toUpperCase()}
                        </div>
                    )}
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
                </div>
            ),
        },
        {
            key: 'kontak',
            header: 'Kontak',
            cell: (row) => <ContactsDisplay {...row} />,
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
                        disabled={row.is_first}
                        onClick={() => handleReorder(row.id, 'up')}
                        title="Naikkan urutan"
                    >
                        <ArrowUp className="size-4" />
                        <span className="sr-only">Naik</span>
                    </Button>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="size-8"
                        disabled={row.is_last}
                        onClick={() => handleReorder(row.id, 'down')}
                        title="Turunkan urutan"
                    >
                        <ArrowDown className="size-4" />
                        <span className="sr-only">Turun</span>
                    </Button>
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
                        onClick={() => setDeleteTarget(row)}
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
                        onClick={() => openCreate()}
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

                {visibleGroups.length === 0 ? (
                    <div className="rounded-lg border bg-card p-8 text-center text-sm text-muted-foreground">
                        Belum ada data pengurus yang sesuai filter.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {visibleGroups.map((group) => {
                            const groupRows = group.items.map(
                                (item, idx, arr) => ({
                                    ...item,
                                    display_no: idx + 1,
                                    is_first: idx === 0,
                                    is_last: idx === arr.length - 1,
                                }),
                            );

                            return (
                                <section key={group.key}>
                                    <header className="mb-3 flex items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
                                        <div>
                                            <h3 className="font-semibold text-foreground">
                                                {group.title}
                                            </h3>
                                            <p className="text-sm text-muted-foreground">
                                                {group.subtitle} &middot;{' '}
                                                <span className="font-medium">
                                                    {group.items.length}{' '}
                                                    pengurus
                                                </span>
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="shrink-0"
                                            onClick={() => openCreate(group)}
                                        >
                                            <Plus className="size-4" />
                                            Tambah
                                        </Button>
                                    </header>

                                    {groupRows.length === 0 ? (
                                        <div className="rounded-lg border bg-card p-6 text-center text-sm text-muted-foreground">
                                            Belum ada pengurus di kelompok ini.
                                        </div>
                                    ) : (
                                        <ResponsiveTable
                                            data={groupRows}
                                            columns={columns}
                                            keyExtractor={(row) => row.id}
                                            renderMobileCard={(row) => (
                                                <div className="space-y-3">
                                                    <div className="flex items-start justify-between gap-3">
                                                        <div className="flex items-start gap-3">
                                                            {row.foto_url ? (
                                                                <img
                                                                    src={
                                                                        row.foto_url
                                                                    }
                                                                    alt=""
                                                                    className="size-10 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                                                                    {row.nama_tampil
                                                                        .split(
                                                                            /\s+/,
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            2,
                                                                        )
                                                                        .map(
                                                                            (
                                                                                part,
                                                                            ) =>
                                                                                part[0],
                                                                        )
                                                                        .join(
                                                                            '',
                                                                        )
                                                                        .toUpperCase()}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <p className="font-semibold text-foreground">
                                                                    {
                                                                        row.nama_tampil
                                                                    }
                                                                </p>
                                                                <p className="text-sm font-medium text-primary">
                                                                    {
                                                                        row.jabatan
                                                                    }
                                                                </p>
                                                                {row.mahasiswa_nama && (
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Akun:{' '}
                                                                        {
                                                                            row.mahasiswa_nama
                                                                        }
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-semibold text-foreground tabular-nums">
                                                            {row.display_no}
                                                        </span>
                                                    </div>
                                                    <ContactsDisplay {...row} />
                                                    <div className="flex justify-end gap-2 border-t pt-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-11 md:h-9"
                                                            disabled={
                                                                row.is_first
                                                            }
                                                            onClick={() =>
                                                                handleReorder(
                                                                    row.id,
                                                                    'up',
                                                                )
                                                            }
                                                        >
                                                            <ArrowUp className="size-4" />{' '}
                                                            Naik
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="h-11 md:h-9"
                                                            disabled={
                                                                row.is_last
                                                            }
                                                            onClick={() =>
                                                                handleReorder(
                                                                    row.id,
                                                                    'down',
                                                                )
                                                            }
                                                        >
                                                            <ArrowDown className="size-4" />{' '}
                                                            Turun
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-11 md:h-9"
                                                            onClick={() =>
                                                                openEdit(row)
                                                            }
                                                        >
                                                            <Pencil className="size-4" />{' '}
                                                            Edit
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="destructive"
                                                            className="h-11 md:h-9"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    row,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />{' '}
                                                            Hapus
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    )}
                                </section>
                            );
                        })}
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
                                            <div />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-no-hp">
                                                    Nomor HP/WhatsApp
                                                </Label>
                                                <Input
                                                    id="edit-no-hp"
                                                    name="no_hp"
                                                    defaultValue={
                                                        editing.no_hp ?? ''
                                                    }
                                                    placeholder="08..."
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.no_hp}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-instagram">
                                                    Instagram
                                                </Label>
                                                <Input
                                                    id="edit-instagram"
                                                    name="instagram"
                                                    defaultValue={
                                                        editing.instagram ?? ''
                                                    }
                                                    placeholder="@username"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.instagram}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="edit-email"
                                                    name="email"
                                                    type="email"
                                                    defaultValue={
                                                        editing.email ?? ''
                                                    }
                                                    placeholder="nama@example.com"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="edit-kontak">
                                                    Kontak Lainnya
                                                </Label>
                                                <Input
                                                    id="edit-kontak"
                                                    name="kontak"
                                                    defaultValue={
                                                        editing.kontak ?? ''
                                                    }
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.kontak}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="edit-foto">
                                                Foto Pengurus (Opsional)
                                            </Label>
                                            {editing.foto_url && (
                                                <div className="flex items-center gap-3 rounded-md border bg-muted/40 p-2">
                                                    <img
                                                        src={editing.foto_url}
                                                        alt={`Foto ${editing.nama_tampil}`}
                                                        className="size-12 rounded-full object-cover"
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        Foto saat ini. Pilih
                                                        file baru untuk
                                                        mengganti.
                                                    </span>
                                                </div>
                                            )}
                                            <Input
                                                id="edit-foto"
                                                name="foto"
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                className="h-11 md:h-9"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Format JPG/JPEG/PNG, maksimal 2
                                                MB.
                                            </p>
                                            <InputError message={errors.foto} />
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
                                                    defaultValue={createUrutan}
                                                    className="h-11 md:h-9"
                                                    required
                                                />
                                                <InputError
                                                    message={errors.urutan}
                                                />
                                            </div>
                                            <div />
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-no-hp">
                                                    Nomor HP/WhatsApp
                                                </Label>
                                                <Input
                                                    id="create-no-hp"
                                                    name="no_hp"
                                                    placeholder="08..."
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.no_hp}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-instagram">
                                                    Instagram
                                                </Label>
                                                <Input
                                                    id="create-instagram"
                                                    name="instagram"
                                                    placeholder="@username"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.instagram}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-email">
                                                    Email
                                                </Label>
                                                <Input
                                                    id="create-email"
                                                    name="email"
                                                    type="email"
                                                    placeholder="nama@example.com"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.email}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="create-kontak">
                                                    Kontak Lainnya
                                                </Label>
                                                <Input
                                                    id="create-kontak"
                                                    name="kontak"
                                                    className="h-11 md:h-9"
                                                />
                                                <InputError
                                                    message={errors.kontak}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1.5">
                                            <Label htmlFor="create-foto">
                                                Foto Pengurus (Opsional)
                                            </Label>
                                            <Input
                                                id="create-foto"
                                                name="foto"
                                                type="file"
                                                accept="image/jpeg,image/png"
                                                className="h-11 md:h-9"
                                            />
                                            <p className="text-xs text-muted-foreground">
                                                Format JPG/JPEG/PNG, maksimal 2
                                                MB.
                                            </p>
                                            <InputError message={errors.foto} />
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

                <Dialog
                    open={deleteTarget !== null}
                    onOpenChange={(open) => !open && setDeleteTarget(null)}
                >
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>
                                Hapus Pengurus dari Direktori?
                            </DialogTitle>
                            <DialogDescription>
                                {deleteTarget &&
                                    `Anda akan menghapus "${deleteTarget.nama_tampil}" (${deleteTarget.jabatan}) dari direktori kepengurusan. Tindakan ini tidak dapat dibatalkan.`}
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Batal
                                </Button>
                            </DialogClose>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={confirmDelete}
                            >
                                Hapus
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    );
}

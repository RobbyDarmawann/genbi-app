import { Form, Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Ban, Search, UserCheck, Users } from 'lucide-react';
import { FormEvent, useState } from 'react';
import PesertaKegiatanController from '@/actions/App/Http/Controllers/Admin/PesertaKegiatanController';
import InputError from '@/components/input-error';
import { ResponsiveTable } from '@/components/responsive-table';
import { StatusBadge, type SemanticStatus } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { formatTanggalWita } from '@/lib/format';
import admin from '@/routes/admin';

type PesertaItem = {
    id: number;
    nama: string;
    nim: string;
    komsat_kode: string;
    komsat_nama: string;
    divisi_nama: string;
    peran: string;
    peran_label: string;
    poin_potensial: number;
    status: string;
    status_label: string;
    waktu_daftar: string | null;
    status_kehadiran: string | null;
    status_kehadiran_label: string;
    dapat_ubah_peran: boolean;
    dapat_batalkan: boolean;
};

type Props = {
    kegiatan: {
        id: number;
        judul: string;
        status: string;
        status_label: string;
        kuota: number | null;
        jumlah_terdaftar: number;
        jumlah_hadir: number;
        sisa_kuota: number | null;
    };
    peserta: {
        data: PesertaItem[];
        links: { url: string | null; label: string; active: boolean }[];
        meta: {
            current_page?: number;
            last_page?: number;
            from?: number;
            to?: number;
            total?: number;
        };
    };
    peranOptions: { value: string; label: string; poin: number }[];
    statusOptions: { value: string; label: string }[];
    filters: {
        q: string;
        status: string;
        peran: string;
    };
};

function registrationStatusToSemantic(status: string): SemanticStatus {
    switch (status) {
        case 'terdaftar':
            return 'terdaftar';
        case 'batal':
            return 'dibatalkan';
        default:
            return 'draft';
    }
}

function attendanceStatusToSemantic(status: string | null): SemanticStatus {
    switch (status) {
        case 'valid':
            return 'valid';
        case 'ditolak':
            return 'ditolak';
        default:
            return 'draft';
    }
}

export default function PesertaIndex({
    kegiatan,
    peserta,
    peranOptions,
    statusOptions,
    filters,
}: Props) {
    const [selectedPeranPeserta, setSelectedPeranPeserta] =
        useState<PesertaItem | null>(null);
    const [selectedBatalPeserta, setSelectedBatalPeserta] =
        useState<PesertaItem | null>(null);

    const [statusFilter, setStatusFilter] = useState<string>(
        filters.status || 'all',
    );
    const [peranFilter, setPeranFilter] = useState<string>(
        filters.peran || 'all',
    );

    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const rawQ = form.get('q');

        router.get(
            PesertaKegiatanController.index(kegiatan.id).url,
            {
                q: typeof rawQ === 'string' ? rawQ : '',
                status: statusFilter === 'all' ? '' : statusFilter,
                peran: peranFilter === 'all' ? '' : peranFilter,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <>
            <Head title={`Peserta - ${kegiatan.judul}`} />
            <div className="space-y-6">
                <div>
                    <Button variant="ghost" asChild className="mb-2 -ml-3">
                        <Link href={admin.kegiatan.show(kegiatan.id)}>
                            <ArrowLeft className="size-4" />
                            Kembali ke detail kegiatan
                        </Link>
                    </Button>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Daftar Peserta Kegiatan
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {kegiatan.judul}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Status Kegiatan
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Badge variant="outline" className="text-sm">
                                {kegiatan.status_label}
                            </Badge>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Terdaftar Aktif
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold tabular-nums">
                                {kegiatan.jumlah_terdaftar} orang
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Kapasitas &amp; Sisa
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold tabular-nums">
                                {kegiatan.kuota !== null
                                    ? `Sisa ${kegiatan.sisa_kuota} / ${kegiatan.kuota}`
                                    : 'Tanpa kuota'}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Hadir Valid
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-semibold tabular-nums">
                                {kegiatan.jumlah_hadir} orang
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-col gap-3 md:flex-row md:items-end"
                        >
                            <div className="flex-1 space-y-1">
                                <Label htmlFor="q" className="text-xs">
                                    Cari Nama / NIM
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="q"
                                        name="q"
                                        defaultValue={filters.q}
                                        placeholder="Cari mahasiswa..."
                                        className="h-11 pl-9 md:h-9"
                                    />
                                </div>
                            </div>
                            <div className="w-full space-y-1 md:w-44">
                                <Label className="text-xs">Peran</Label>
                                <Select
                                    value={peranFilter}
                                    onValueChange={setPeranFilter}
                                >
                                    <SelectTrigger className="h-11 md:h-9">
                                        <SelectValue placeholder="Semua peran" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Peran
                                        </SelectItem>
                                        {peranOptions.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="w-full space-y-1 md:w-44">
                                <Label className="text-xs">
                                    Status Pendaftaran
                                </Label>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger className="h-11 md:h-9">
                                        <SelectValue placeholder="Semua status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Status
                                        </SelectItem>
                                        {statusOptions.map((opt) => (
                                            <SelectItem
                                                key={opt.value}
                                                value={opt.value}
                                            >
                                                {opt.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                type="submit"
                                variant="secondary"
                                className="h-11 md:h-9"
                            >
                                Filter
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <ResponsiveTable<PesertaItem>
                    caption="Daftar peserta kegiatan"
                    data={peserta.data}
                    keyExtractor={(row) => row.id}
                    emptyState={
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Users className="size-10 text-muted-foreground" />
                                <p className="mt-3 font-medium">
                                    Belum ada peserta
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Peserta yang mendaftar ke kegiatan ini akan
                                    muncul di sini.
                                </p>
                            </CardContent>
                        </Card>
                    }
                    columns={[
                        {
                            key: 'nama',
                            header: 'Mahasiswa',
                            cell: (row) => (
                                <div>
                                    <p className="font-medium text-foreground">
                                        {row.nama}
                                    </p>
                                    <p className="text-xs text-muted-foreground tabular-nums">
                                        {row.nim}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: 'komsat_divisi',
                            header: 'Komsat / Divisi',
                            cell: (row) => (
                                <div>
                                    <p className="font-medium">
                                        {row.komsat_kode}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {row.divisi_nama}
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: 'peran',
                            header: 'Peran & Poin',
                            cell: (row) => (
                                <div>
                                    <Badge
                                        variant="outline"
                                        className="font-medium"
                                    >
                                        {row.peran_label}
                                    </Badge>
                                    <p className="mt-0.5 text-xs text-muted-foreground tabular-nums">
                                        {row.poin_potensial} poin
                                    </p>
                                </div>
                            ),
                        },
                        {
                            key: 'status',
                            header: 'Status Daftar',
                            cell: (row) => (
                                <StatusBadge
                                    status={registrationStatusToSemantic(
                                        row.status,
                                    )}
                                    label={row.status_label}
                                />
                            ),
                        },
                        {
                            key: 'waktu_daftar',
                            header: 'Waktu Daftar',
                            cell: (row) =>
                                row.waktu_daftar ? (
                                    <span className="text-xs text-muted-foreground">
                                        {formatTanggalWita(row.waktu_daftar, {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                ) : (
                                    '-'
                                ),
                        },
                        {
                            key: 'kehadiran',
                            header: 'Kehadiran',
                            cell: (row) => (
                                <StatusBadge
                                    status={attendanceStatusToSemantic(
                                        row.status_kehadiran,
                                    )}
                                    label={row.status_kehadiran_label}
                                />
                            ),
                        },
                        {
                            key: 'aksi',
                            header: 'Aksi',
                            align: 'right',
                            cell: (row) => (
                                <div className="flex flex-wrap items-center justify-end gap-1.5">
                                    {row.dapat_ubah_peran && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-11 md:h-8"
                                            onClick={() =>
                                                setSelectedPeranPeserta(row)
                                            }
                                        >
                                            <UserCheck className="size-3.5" />
                                            <span>Ubah Peran</span>
                                        </Button>
                                    )}
                                    {row.dapat_batalkan && (
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-11 text-destructive hover:bg-destructive/10 md:h-8"
                                            onClick={() =>
                                                setSelectedBatalPeserta(row)
                                            }
                                        >
                                            <Ban className="size-3.5" />
                                            <span>Batalkan</span>
                                        </Button>
                                    )}
                                    {!row.dapat_ubah_peran &&
                                        !row.dapat_batalkan && (
                                            <span className="text-xs text-muted-foreground">
                                                Terkunci
                                            </span>
                                        )}
                                </div>
                            ),
                        },
                    ]}
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-semibold text-foreground">
                                        {row.nama}
                                    </p>
                                    <p className="text-xs text-muted-foreground tabular-nums">
                                        {row.nim} • {row.komsat_kode} -{' '}
                                        {row.divisi_nama}
                                    </p>
                                </div>
                                <StatusBadge
                                    status={registrationStatusToSemantic(
                                        row.status,
                                    )}
                                    label={row.status_label}
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                <Badge variant="outline">
                                    Peran: {row.peran_label}
                                </Badge>
                                <span className="text-muted-foreground">
                                    Potensi: {row.poin_potensial} poin
                                </span>
                                <span className="ml-auto">
                                    <StatusBadge
                                        status={attendanceStatusToSemantic(
                                            row.status_kehadiran,
                                        )}
                                        label={row.status_kehadiran_label}
                                    />
                                </span>
                            </div>

                            <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                                {row.dapat_ubah_peran && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-11 flex-1 md:h-8"
                                        onClick={() =>
                                            setSelectedPeranPeserta(row)
                                        }
                                    >
                                        <UserCheck className="size-3.5" />
                                        <span>Ubah Peran</span>
                                    </Button>
                                )}
                                {row.dapat_batalkan && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-11 flex-1 text-destructive hover:bg-destructive/10 md:h-8"
                                        onClick={() =>
                                            setSelectedBatalPeserta(row)
                                        }
                                    >
                                        <Ban className="size-3.5" />
                                        <span>Batalkan</span>
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                />

                {peserta.links.length > 3 && (
                    <div className="flex flex-wrap items-center justify-center gap-1">
                        {peserta.links.map((link, idx) => (
                            <Button
                                key={idx}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={Boolean(link.url)}
                                className="h-11 md:h-8"
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveScroll
                                        preserveState
                                    >
                                        <span
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    </Link>
                                ) : (
                                    <span
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>

            {/* Dialog Ubah Peran */}
            <Dialog
                open={selectedPeranPeserta !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedPeranPeserta(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ubah Peran Peserta</DialogTitle>
                        <DialogDescription>
                            Ubah peran untuk{' '}
                            <strong>{selectedPeranPeserta?.nama}</strong> (
                            {selectedPeranPeserta?.nim}). Perubahan peran akan
                            menyesuaikan potensi bobot poin sebelum kegiatan
                            berjalan.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPeranPeserta && (
                        <Form
                            {...PesertaKegiatanController.changeRole.form({
                                kegiatan: kegiatan.id,
                                pendaftaran: selectedPeranPeserta.id,
                            })}
                            options={{ preserveScroll: true }}
                            onSuccess={() => setSelectedPeranPeserta(null)}
                        >
                            {({ errors, processing }) => (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="peran">
                                            Pilih Peran Baru
                                        </Label>
                                        <select
                                            id="peran"
                                            name="peran"
                                            defaultValue={
                                                selectedPeranPeserta.peran
                                            }
                                            className="flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-none md:h-9 md:text-sm"
                                        >
                                            {peranOptions.map((opt) => (
                                                <option
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label} ({opt.poin} poin
                                                    potensial)
                                                </option>
                                            ))}
                                        </select>
                                        <InputError
                                            message={
                                                (
                                                    errors as Record<
                                                        string,
                                                        string
                                                    >
                                                ).peran
                                            }
                                        />
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
                                            {processing && <Spinner />}
                                            <span>Simpan Perubahan</span>
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog Batalkan Pendaftaran oleh Admin */}
            <Dialog
                open={selectedBatalPeserta !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedBatalPeserta(null);
                    }
                }}
            >
                <DialogContent role="alertdialog">
                    <DialogHeader>
                        <DialogTitle>
                            Batalkan Pendaftaran Mahasiswa?
                        </DialogTitle>
                        <DialogDescription>
                            Tindakan ini akan membatalkan status keikutsertaan{' '}
                            <strong>{selectedBatalPeserta?.nama}</strong>. Kuota
                            akan dikembalikan untuk pendaftar lain. Alasan
                            pembatalan wajib dicatat dalam jejak audit.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedBatalPeserta && (
                        <Form
                            {...PesertaKegiatanController.cancel.form({
                                kegiatan: kegiatan.id,
                                pendaftaran: selectedBatalPeserta.id,
                            })}
                            options={{ preserveScroll: true }}
                            onSuccess={() => setSelectedBatalPeserta(null)}
                        >
                            {({ errors, processing }) => (
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="alasan">
                                            Alasan Pembatalan
                                        </Label>
                                        <Input
                                            id="alasan"
                                            name="alasan"
                                            placeholder="Contoh: Mengundurkan diri melalui konfirmasi panitia"
                                            className="h-11 md:h-9"
                                            required
                                        />
                                        <InputError
                                            message={
                                                (
                                                    errors as Record<
                                                        string,
                                                        string
                                                    >
                                                ).alasan
                                            }
                                        />
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                className="h-11 md:h-9"
                                            >
                                                Kembali
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            disabled={processing}
                                            className="h-11 md:h-9"
                                        >
                                            {processing && <Spinner />}
                                            <span>Ya, Batalkan</span>
                                        </Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

PesertaIndex.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

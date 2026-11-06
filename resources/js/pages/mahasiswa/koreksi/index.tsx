import { Form, Head } from '@inertiajs/react';
import { ClipboardCheck } from 'lucide-react';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatWaktuWita } from '@/lib/format';
import mahasiswa from '@/routes/mahasiswa';

type Correction = {
    id: number;
    jenis: string;
    alasan: string;
    status: string;
    catatan_proses: string | null;
    diproses_at: string | null;
    created_at: string;
    kegiatan: { judul: string };
};

type Registration = {
    id: number;
    kegiatan: { id: number; judul: string; tanggal: string };
};

type JenisOption = { value: string; label: string };

type Props = {
    koreksi: { data: Correction[] };
    pendaftaran: Registration[];
    jenis_options: JenisOption[];
};

export default function KoreksiPage({
    koreksi,
    pendaftaran,
    jenis_options,
}: Props) {
    const columns: ResponsiveColumn<Correction>[] = [
        {
            key: 'tanggal',
            header: 'Tanggal Ajuan',
            cell: (row) => (
                <span className="text-xs tabular-nums">
                    {formatWaktuWita(row.created_at)}
                </span>
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
            key: 'catatan',
            header: 'Catatan IM',
            cell: (row) => (
                <span className="text-sm text-muted-foreground">
                    {row.catatan_proses ?? 'Belum diproses'}
                </span>
            ),
        },
    ];

    return (
        <>
            <Head title="Koreksi Saya" />
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <header>
                    <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                        Pengajuan Koreksi
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Ajukan koreksi kehadiran atau poin untuk kegiatan yang
                        pernah Anda ikuti. Bukti gambar atau dokumen bersifat
                        opsional.
                    </p>
                </header>

                {pendaftaran.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Buat Pengajuan Baru</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...mahasiswa.koreksi.store.form()}
                                encType="multipart/form-data"
                                className="grid gap-4 md:grid-cols-2"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor="pendaftaran_id">
                                                Kegiatan
                                            </Label>
                                            <select
                                                id="pendaftaran_id"
                                                name="pendaftaran_id"
                                                required
                                                className="flex h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm md:h-9"
                                            >
                                                <option value="">
                                                    Pilih kegiatan...
                                                </option>
                                                {pendaftaran.map((item) => (
                                                    <option
                                                        key={item.id}
                                                        value={item.id}
                                                    >
                                                        {item.kegiatan.judul}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.pendaftaran_id && (
                                                <p className="text-sm text-destructive">
                                                    {errors.pendaftaran_id}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid min-w-0 gap-2">
                                            <Label htmlFor="jenis">
                                                Jenis Koreksi
                                            </Label>
                                            <select
                                                id="jenis"
                                                name="jenis"
                                                required
                                                className="flex h-11 w-full min-w-0 rounded-md border border-input bg-background px-3 text-sm md:h-9"
                                            >
                                                <option value="">
                                                    Pilih jenis...
                                                </option>
                                                {jenis_options.map((item) => (
                                                    <option
                                                        key={item.value}
                                                        value={item.value}
                                                    >
                                                        {item.label}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.jenis && (
                                                <p className="text-sm text-destructive">
                                                    {errors.jenis}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="alasan">
                                                Alasan (min. 10 karakter)
                                            </Label>
                                            <Textarea
                                                id="alasan"
                                                name="alasan"
                                                required
                                                minLength={10}
                                                maxLength={3000}
                                                className="min-h-28"
                                                placeholder="Jelaskan alasan koreksi secara rinci..."
                                            />
                                            {errors.alasan && (
                                                <p className="text-sm text-destructive">
                                                    {errors.alasan}
                                                </p>
                                            )}
                                        </div>

                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="bukti">
                                                Bukti (opsional, maks. 5 MB)
                                            </Label>
                                            <Input
                                                id="bukti"
                                                name="bukti"
                                                type="file"
                                                accept="image/jpeg,image/png,application/pdf"
                                                className="h-11 md:h-9"
                                            />
                                            {errors.bukti && (
                                                <p className="text-sm text-destructive">
                                                    {errors.bukti}
                                                </p>
                                            )}
                                        </div>

                                        <div className="md:col-span-2">
                                            <Button
                                                type="submit"
                                                className="h-11 md:h-9"
                                                disabled={processing}
                                            >
                                                {processing
                                                    ? 'Mengirim...'
                                                    : 'Kirim Pengajuan'}
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}

                <section className="space-y-3">
                    <h2 className="text-lg font-semibold">
                        Riwayat Pengajuan Saya
                    </h2>
                    <ResponsiveTable
                        caption="Daftar koreksi yang Anda ajukan"
                        columns={columns}
                        data={koreksi.data}
                        keyExtractor={(row) => row.id}
                        emptyState={
                            <Card>
                                <CardContent className="flex flex-col items-center py-12 text-center">
                                    <ClipboardCheck className="size-10 text-muted-foreground" />
                                    <p className="mt-3 text-sm font-medium">
                                        Belum ada pengajuan koreksi
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Ajukan koreksi jika Anda mengalami
                                        masalah kehadiran atau poin.
                                    </p>
                                </CardContent>
                            </Card>
                        }
                        renderMobileCard={(row) => (
                            <div className="space-y-2">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-medium">
                                        {row.kegiatan.judul}
                                    </p>
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
                                <p className="text-sm text-muted-foreground capitalize">
                                    {row.jenis.replaceAll('_', ' ')}
                                </p>
                                <p className="text-sm">{row.alasan}</p>
                                {row.catatan_proses && (
                                    <p className="rounded bg-muted p-2 text-xs">
                                        <strong>Catatan IM:</strong>{' '}
                                        {row.catatan_proses}
                                    </p>
                                )}
                                <p className="text-xs text-muted-foreground tabular-nums">
                                    Diajukan {formatWaktuWita(row.created_at)}
                                </p>
                            </div>
                        )}
                    />
                </section>
            </div>
        </>
    );
}

KoreksiPage.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

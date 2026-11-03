import { Head, Link } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    ExternalLink,
    XCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Form } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatAngka, formatTanggalWita, formatWaktuWita } from '@/lib/format';
import admin from '@/routes/admin';

type Props = {
    koreksi: {
        id: number;
        jenis: string;
        alasan: string;
        bukti_path: string | null;
        status: string;
        catatan_proses: string | null;
        diproses_at: string | null;
        created_at: string;
        mahasiswa: {
            id: number;
            nim: string;
            user: { name: string };
            komsat?: { kode: string; nama: string };
            divisi?: { nama: string };
        };
        kegiatan: {
            id: number;
            judul: string;
            tanggal: string;
            lokasi_nama: string;
            status: string;
            komsat?: { kode: string };
        };
        pendaftaran: {
            id: number;
            peran: string;
            status: string;
            kehadiran?: {
                id: number;
                status: string;
                waktu_checkin: string;
                sumber: string;
            } | null;
        } | null;
        pemroses?: { name: string } | null;
    };
    riwayat_poin: Array<{
        id: number;
        tipe: string;
        jumlah: number;
        keterangan: string;
        created_at: string;
    }>;
};

function getBuktiUrl(koreksiId: number): string {
    return `/koreksi/${koreksiId}/bukti`;
}

export default function AdminKoreksiShow({ koreksi, riwayat_poin }: Props) {
    const canProcess = koreksi.status === 'menunggu';
    const hasPoints = riwayat_poin.length > 0;

    return (
        <>
            <Head title={`Koreksi #${koreksi.id}`} />
            <div className="mx-auto w-full max-w-5xl space-y-6 p-4 md:p-6">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link href={admin.koreksi.index()}>
                            <ArrowLeft className="size-4" />
                            Kembali
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Detail Koreksi #{koreksi.id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Diajukan {formatWaktuWita(koreksi.created_at)}
                        </p>
                    </div>
                </div>

                {koreksi.status !== 'menunggu' && (
                    <Alert>
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            Koreksi ini telah{' '}
                            <strong>
                                {koreksi.status === 'disetujui'
                                    ? 'disetujui'
                                    : 'ditolak'}
                            </strong>{' '}
                            oleh {koreksi.pemroses?.name ?? 'sistem'} pada{' '}
                            {koreksi.diproses_at
                                ? formatWaktuWita(koreksi.diproses_at)
                                : '-'}
                            .
                        </AlertDescription>
                    </Alert>
                )}

                {hasPoints && canProcess && (
                    <Alert variant="destructive">
                        <AlertCircle className="size-4" />
                        <AlertDescription>
                            <strong>Perhatian:</strong> Sudah terdapat{' '}
                            {riwayat_poin.length} transaksi poin untuk kegiatan
                            ini. Hindari duplikasi dengan menolak permohonan
                            atau verifikasi kembali transaksi yang ada.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Data Mahasiswa</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Nama
                                </p>
                                <p className="font-medium">
                                    {koreksi.mahasiswa.user.name}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    NIM
                                </p>
                                <p className="font-mono">
                                    {koreksi.mahasiswa.nim}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Komisariat
                                </p>
                                <p>
                                    {koreksi.mahasiswa.komsat?.kode ?? '-'} •{' '}
                                    {koreksi.mahasiswa.komsat?.nama ?? '-'}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Divisi
                                </p>
                                <p>{koreksi.mahasiswa.divisi?.nama ?? '-'}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Data Kegiatan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Judul
                                </p>
                                <p className="font-medium">
                                    {koreksi.kegiatan.judul}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal
                                </p>
                                <p>
                                    {formatTanggalWita(
                                        koreksi.kegiatan.tanggal,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lokasi
                                </p>
                                <p>{koreksi.kegiatan.lokasi_nama}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status Kegiatan
                                </p>
                                <Badge variant="secondary">
                                    {koreksi.kegiatan.status}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Detail Koreksi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Jenis Koreksi
                            </p>
                            <p className="font-medium capitalize">
                                {koreksi.jenis.replaceAll('_', ' ')}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Alasan
                            </p>
                            <p className="rounded bg-muted p-3 text-sm whitespace-pre-wrap">
                                {koreksi.alasan}
                            </p>
                        </div>
                        {koreksi.bukti_path && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Bukti Lampiran
                                </p>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="sm"
                                    className="mt-2"
                                >
                                    <a
                                        href={getBuktiUrl(koreksi.id)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <ExternalLink className="size-3.5" />
                                        Lihat Bukti
                                    </a>
                                </Button>
                            </div>
                        )}
                        {koreksi.pendaftaran && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Peran Pendaftaran
                                </p>
                                <Badge variant="outline" className="capitalize">
                                    {koreksi.pendaftaran.peran}
                                </Badge>
                            </div>
                        )}
                        {koreksi.pendaftaran?.kehadiran && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Status Kehadiran Saat Ini
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <Badge
                                        variant={
                                            koreksi.pendaftaran.kehadiran
                                                .status === 'valid'
                                                ? 'default'
                                                : 'secondary'
                                        }
                                    >
                                        {koreksi.pendaftaran.kehadiran.status}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground">
                                        Sumber:{' '}
                                        {koreksi.pendaftaran.kehadiran.sumber}
                                    </span>
                                </div>
                            </div>
                        )}
                        {koreksi.catatan_proses && (
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Catatan Proses
                                </p>
                                <p className="rounded bg-muted p-3 text-sm whitespace-pre-wrap">
                                    {koreksi.catatan_proses}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {riwayat_poin.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Riwayat Poin Kegiatan Ini</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {riwayat_poin.map((trx) => (
                                    <div
                                        key={trx.id}
                                        className="flex items-center justify-between rounded border p-3"
                                    >
                                        <div>
                                            <Badge variant="outline">
                                                {trx.tipe}
                                            </Badge>
                                            <p className="mt-1 text-sm">
                                                {trx.keterangan}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatWaktuWita(
                                                    trx.created_at,
                                                )}
                                            </p>
                                        </div>
                                        <p
                                            className={`text-lg font-bold tabular-nums ${
                                                trx.jumlah >= 0
                                                    ? 'text-success'
                                                    : 'text-destructive'
                                            }`}
                                        >
                                            {trx.jumlah >= 0 ? '+' : ''}
                                            {formatAngka(trx.jumlah)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {canProcess && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Keputusan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Form
                                {...admin.koreksi.decide.form({
                                    koreksi: koreksi.id,
                                })}
                                className="space-y-4"
                            >
                                {({ processing, errors }) => (
                                    <>
                                        <div className="grid gap-2">
                                            <Label htmlFor="catatan_proses">
                                                Catatan (wajib saat menolak)
                                            </Label>
                                            <Textarea
                                                id="catatan_proses"
                                                name="catatan_proses"
                                                placeholder="Tuliskan catatan atau alasan keputusan..."
                                                className="min-h-24"
                                            />
                                            {errors.catatan_proses && (
                                                <p className="text-sm text-destructive">
                                                    {errors.catatan_proses}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            <Button
                                                type="submit"
                                                name="keputusan"
                                                value="setujui"
                                                variant="default"
                                                className="h-11 flex-1 md:h-9"
                                                disabled={processing}
                                            >
                                                <CheckCircle className="size-4" />
                                                Setujui
                                            </Button>
                                            <Button
                                                type="submit"
                                                name="keputusan"
                                                value="tolak"
                                                variant="destructive"
                                                className="h-11 flex-1 md:h-9"
                                                disabled={processing}
                                            >
                                                <XCircle className="size-4" />
                                                Tolak
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </Form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}

AdminKoreksiShow.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

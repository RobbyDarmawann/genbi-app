import { Form, Head, Link } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock,
    Info,
    MapPin,
} from 'lucide-react';
import { useState } from 'react';
import AbsensiController from '@/actions/App/Http/Controllers/Mahasiswa/AbsensiController';
import MahasiswaKegiatanController from '@/actions/App/Http/Controllers/Mahasiswa/KegiatanController';
import InputError from '@/components/input-error';
import { kegiatanStatusToSemantic } from '@/components/kegiatan/types';
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
    DialogTrigger,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { formatRentangTanggalWita } from '@/lib/format';

type Props = {
    kegiatan: {
        id: number;
        judul: string;
        deskripsi: string | null;
        tanggal: string;
        tanggal_selesai: string;
        jam_mulai: string;
        jam_selesai: string;
        lokasi_nama: string;
        status: string;
        status_label: string;
        komsat: { nama: string } | null;
        kuota: number | null;
        jumlah_pendaftar: number;
        sisa_kuota: number | null;
        divisi_target: { id: number; nama: string; komsat_nama?: string }[];
        bobot_list: { peran: string; label: string; poin: number | null }[];
    };
    ditargetkan_untuk_saya: boolean;
    status_pendaftaran_tampil: string;
    status_pendaftaran_label: string;
    dapat_mendaftar: boolean;
    dapat_membatalkan: boolean;
    dapat_absen: boolean;
    alasan_tidak_dapat_mendaftar: string | null;
    pendaftaran: {
        id: number;
        peran_label: string;
        status: string;
        status_tampil: string;
        status_label: string;
        poin: number;
        sudah_hadir: boolean;
        memiliki_kehadiran: boolean;
        kehadiran_hari_ini: {
            status: string;
            status_label: string;
            alasan: string | null;
            poin_terkredit: number;
        } | null;
    } | null;
    peran_efektif: { peran: string; label: string; poin: number };
};

function registrationStatusToSemantic(statusTampil: string): SemanticStatus {
    switch (statusTampil) {
        case 'terdaftar':
            return 'terdaftar';
        case 'sudah_hadir':
            return 'valid';
        case 'batal':
            return 'dibatalkan';
        default:
            return 'draft';
    }
}

export default function Show({
    kegiatan,
    ditargetkan_untuk_saya,
    status_pendaftaran_tampil,
    status_pendaftaran_label,
    dapat_mendaftar,
    dapat_membatalkan,
    dapat_absen,
    alasan_tidak_dapat_mendaftar,
    pendaftaran,
    peran_efektif,
}: Props) {
    const [batalOpen, setBatalOpen] = useState(false);

    return (
        <>
            <Head title={kegiatan.judul} />
            <div className="mx-auto max-w-3xl space-y-6">
                <Button variant="ghost" asChild className="-ml-3">
                    <Link href={MahasiswaKegiatanController.index()}>
                        <ArrowLeft className="size-4" />
                        Kembali ke kegiatan
                    </Link>
                </Button>
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                            status={kegiatanStatusToSemantic(kegiatan.status)}
                            label={kegiatan.status_label}
                        />
                        <StatusBadge
                            status={registrationStatusToSemantic(
                                status_pendaftaran_tampil,
                            )}
                            label={status_pendaftaran_label}
                        />
                        {ditargetkan_untuk_saya && (
                            <Badge
                                variant="outline"
                                className="border-primary/30 bg-primary/10 text-primary"
                            >
                                Target divisi Anda
                            </Badge>
                        )}
                    </div>
                    <header>
                        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
                            {kegiatan.judul}
                        </h1>
                    </header>
                </div>

                {!ditargetkan_untuk_saya && (
                    <Card className="border-muted bg-muted/40">
                        <CardContent className="flex items-start gap-3 p-4">
                            <Info className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                            <div>
                                <p className="text-sm font-medium">
                                    Kegiatan ini ditujukan untuk divisi
                                    terpilih.
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Anda dapat melihat rincian jadwal kegiatan
                                    ini secara baca-saja.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Status pendaftaran Anda</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                    <StatusBadge
                                        status={registrationStatusToSemantic(
                                            status_pendaftaran_tampil,
                                        )}
                                        label={status_pendaftaran_label}
                                    />
                                    <span className="text-sm font-medium">
                                        Peran: {peran_efektif.label}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Bobot poin bila hadir valid:{' '}
                                    <span className="font-semibold text-foreground tabular-nums">
                                        {peran_efektif.poin} poin
                                    </span>
                                </p>
                            </div>

                            {dapat_mendaftar && (
                                <Form
                                    {...MahasiswaKegiatanController.daftar.form(
                                        kegiatan.id,
                                    )}
                                    options={{ preserveScroll: true }}
                                >
                                    {({ errors, processing }) => (
                                        <div className="space-y-2">
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="h-11 w-full sm:w-auto md:h-9"
                                            >
                                                {processing && <Spinner />}
                                                <span>Ikut Kegiatan</span>
                                            </Button>
                                            <InputError
                                                message={
                                                    (
                                                        errors as Record<
                                                            string,
                                                            string
                                                        >
                                                    ).pendaftaran
                                                }
                                            />
                                        </div>
                                    )}
                                </Form>
                            )}

                            {dapat_absen && (
                                <Button
                                    asChild
                                    className="h-11 w-full sm:w-auto md:h-9"
                                >
                                    <Link
                                        href={AbsensiController.create(
                                            kegiatan.id,
                                        )}
                                    >
                                        <CheckCircle2 className="size-4" />
                                        <span>Absen Sekarang</span>
                                    </Link>
                                </Button>
                            )}

                            {dapat_membatalkan && (
                                <Dialog
                                    open={batalOpen}
                                    onOpenChange={setBatalOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 w-full sm:w-auto md:h-9"
                                        >
                                            Batalkan Pendaftaran
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent role="alertdialog">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Batalkan pendaftaran kegiatan?
                                            </DialogTitle>
                                            <DialogDescription>
                                                Anda akan membatalkan
                                                pendaftaran pada kegiatan{' '}
                                                <strong>
                                                    {kegiatan.judul}
                                                </strong>
                                                . Kursi Anda akan dilepas untuk
                                                anggota lain.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <Form
                                            {...MahasiswaKegiatanController.batal.form(
                                                kegiatan.id,
                                            )}
                                            options={{ preserveScroll: true }}
                                            onSuccess={() =>
                                                setBatalOpen(false)
                                            }
                                        >
                                            {({ errors, processing }) => (
                                                <>
                                                    <InputError
                                                        message={
                                                            (
                                                                errors as Record<
                                                                    string,
                                                                    string
                                                                >
                                                            ).pendaftaran
                                                        }
                                                    />
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
                                                            disabled={
                                                                processing
                                                            }
                                                            className="h-11 md:h-9"
                                                        >
                                                            {processing && (
                                                                <Spinner />
                                                            )}
                                                            <span>
                                                                Ya, Batalkan
                                                            </span>
                                                        </Button>
                                                    </DialogFooter>
                                                </>
                                            )}
                                        </Form>
                                    </DialogContent>
                                </Dialog>
                            )}
                        </div>

                        {ditargetkan_untuk_saya &&
                            !dapat_mendaftar &&
                            alasan_tidak_dapat_mendaftar && (
                                <p className="text-sm text-muted-foreground">
                                    {alasan_tidak_dapat_mendaftar}
                                </p>
                            )}

                        {pendaftaran?.memiliki_kehadiran && (
                            <Card className="border-primary/30 bg-primary/5">
                                <CardContent className="space-y-2 p-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-medium">
                                            Status Kehadiran
                                        </p>
                                        <StatusBadge
                                            status={
                                                pendaftaran.kehadiran_hari_ini
                                                    ?.status === 'valid'
                                                    ? 'valid'
                                                    : pendaftaran
                                                            .kehadiran_hari_ini
                                                            ?.status ===
                                                        'ditolak'
                                                      ? 'ditolak'
                                                      : 'diajukan'
                                            }
                                            label={
                                                pendaftaran.kehadiran_hari_ini
                                                    ?.status_label ?? 'Menunggu'
                                            }
                                        />
                                    </div>
                                    {pendaftaran.kehadiran_hari_ini?.status ===
                                        'valid' && (
                                        <p className="text-sm text-muted-foreground">
                                            Poin +
                                            {
                                                pendaftaran.kehadiran_hari_ini
                                                    .poin_terkredit
                                            }{' '}
                                            telah ditambahkan ke akun Anda.
                                        </p>
                                    )}
                                    {pendaftaran.kehadiran_hari_ini?.alasan && (
                                        <p className="text-sm text-muted-foreground">
                                            {
                                                pendaftaran.kehadiran_hari_ini
                                                    .alasan
                                            }
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {pendaftaran?.memiliki_kehadiran && (
                            <p className="text-sm text-muted-foreground">
                                Anda sudah memiliki catatan kehadiran pada
                                kegiatan ini sehingga pendaftaran tidak dapat
                                dibatalkan.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="grid gap-4 p-5">
                        <div className="flex gap-3">
                            <Calendar className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal
                                </p>
                                <p className="font-medium">
                                    {formatRentangTanggalWita(
                                        kegiatan.tanggal,
                                        kegiatan.tanggal_selesai,
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Clock className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Waktu
                                </p>
                                <p className="font-medium">
                                    {kegiatan.jam_mulai} -{' '}
                                    {kegiatan.jam_selesai} WITA
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <MapPin className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lokasi
                                </p>
                                <p className="font-medium">
                                    {kegiatan.lokasi_nama}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {kegiatan.deskripsi && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Deskripsi</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">
                                {kegiatan.deskripsi}
                            </p>
                        </CardContent>
                    </Card>
                )}
                <Card>
                    <CardHeader>
                        <CardTitle>Target divisi dan kuota</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                            {kegiatan.divisi_target.map((divisi) => (
                                <Badge key={divisi.id} variant="outline">
                                    {divisi.nama}
                                </Badge>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {kegiatan.kuota === null
                                ? `${kegiatan.jumlah_pendaftar} pendaftar`
                                : `${kegiatan.jumlah_pendaftar} pendaftar • sisa ${kegiatan.sisa_kuota}`}
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Bobot poin</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-3 sm:grid-cols-3">
                        {kegiatan.bobot_list.map((item) => (
                            <div
                                key={item.peran}
                                className="rounded-md border p-3"
                            >
                                <p className="text-sm text-muted-foreground">
                                    {item.label}
                                </p>
                                <p className="text-lg font-semibold tabular-nums">
                                    {item.poin ?? 0} poin
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
Show.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

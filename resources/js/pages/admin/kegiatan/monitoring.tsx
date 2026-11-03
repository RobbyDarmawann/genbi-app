import { Form, Head, Link, usePoll } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    Lock,
    RefreshCw,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';
import MonitoringKegiatanController from '@/actions/App/Http/Controllers/Admin/MonitoringKegiatanController';
import InputError from '@/components/input-error';
import {
    ResponsiveTable,
    type ResponsiveColumn,
} from '@/components/responsive-table';
import { StatusBadge, type SemanticStatus } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { formatAngka, formatTanggalWita, formatWaktuWita } from '@/lib/format';
import admin from '@/routes/admin';
import kehadiranRoutes from '@/routes/kehadiran';

type PesertaMonitoring = {
    id: number;
    nama: string;
    nim: string;
    komsat_kode: string;
    divisi_nama: string;
    peran_label: string;
    kehadiran: {
        id: number;
        status: string;
        status_label: string;
        waktu_checkin: string;
        jarak_m: string | null;
        akurasi_m: string | null;
        alasan_penolakan: string | null;
        has_foto: boolean;
        poin_terkredit: number | null;
    } | null;
};

type PenghambatItem = {
    id: number;
    nama: string;
    nim: string;
    tipe: string;
};

type Props = {
    kegiatan: {
        id: number;
        judul: string;
        status: string;
        status_label: string;
        tanggal: string;
        jam_selesai: string;
        kuota: number | null;
        dapat_ditandai_selesai: boolean;
        dapat_dikunci: boolean;
    };
    ringkasan: {
        divisi_target: { nama: string; komsat_id: number }[];
        kuota: number | null;
        jumlah_terdaftar: number;
        jumlah_valid: number;
        jumlah_menunggu: number;
        jumlah_ditolak: number;
        belum_hadir: number;
    };
    peserta: PesertaMonitoring[];
    penghambat_kunci: {
        kehadiran_menunggu: number;
        koreksi_menunggu: number;
        daftar_penghambat: PenghambatItem[];
    };
};

function activitySemantic(status: string): SemanticStatus {
    switch (status) {
        case 'terbit':
        case 'berlangsung':
            return 'terbuka';
        case 'selesai':
            return 'selesai';
        case 'terkunci':
            return 'dikunci';
        case 'dibatalkan':
            return 'dibatalkan';
        default:
            return 'draft';
    }
}

function attendanceSemantic(status: string): SemanticStatus {
    switch (status) {
        case 'valid':
            return 'valid';
        case 'menunggu_tinjau':
            return 'diajukan';
        case 'ditolak':
            return 'ditolak';
        default:
            return 'draft';
    }
}

export default function MonitoringKegiatanShow({
    kegiatan,
    ringkasan,
    peserta,
    penghambat_kunci,
}: Props) {
    // Refresh berkala ringan setiap 15 detik hanya saat tab aktif (keepAlive default false)
    usePoll(15000, {
        only: ['kegiatan', 'ringkasan', 'peserta', 'penghambat_kunci'],
    });

    const [selectedFoto, setSelectedFoto] = useState<{
        id: number;
        nama: string;
    } | null>(null);
    const [rejectTarget, setRejectTarget] = useState<{
        kehadiranId: number;
        nama: string;
    } | null>(null);

    const isLocked = kegiatan.status === 'terkunci';
    const hasBlockers = penghambat_kunci.daftar_penghambat.length > 0;

    const columns: ResponsiveColumn<PesertaMonitoring>[] = [
        {
            key: 'peserta',
            header: 'Peserta',
            cell: (row) => (
                <div className="min-w-0">
                    <p className="font-medium">{row.nama}</p>
                    <p className="text-xs text-muted-foreground tabular-nums">
                        {row.nim} • {row.komsat_kode} ({row.divisi_nama})
                    </p>
                </div>
            ),
        },
        {
            key: 'peran',
            header: 'Peran',
            cell: (row) => <Badge variant="outline">{row.peran_label}</Badge>,
        },
        {
            key: 'status',
            header: 'Status Kehadiran',
            cell: (row) =>
                row.kehadiran ? (
                    <div className="space-y-1">
                        <StatusBadge
                            status={attendanceSemantic(row.kehadiran.status)}
                            label={row.kehadiran.status_label}
                        />
                        <p className="text-xs text-muted-foreground tabular-nums">
                            {formatWaktuWita(row.kehadiran.waktu_checkin)}
                        </p>
                        {row.kehadiran.alasan_penolakan && (
                            <p className="max-w-xs text-xs text-destructive">
                                Alasan: {row.kehadiran.alasan_penolakan}
                            </p>
                        )}
                        {row.kehadiran.status === 'ditolak' && (
                            <p className="text-xs text-muted-foreground">
                                Perubahan status ditolak wajib melalui alur
                                pengajuan koreksi formal mahasiswa.
                            </p>
                        )}
                    </div>
                ) : (
                    <StatusBadge status="draft" label="Belum Hadir" />
                ),
        },
        {
            key: 'geofence',
            header: 'Jarak / Akurasi',
            align: 'right',
            cell: (row) =>
                row.kehadiran?.jarak_m !== null &&
                row.kehadiran?.jarak_m !== undefined ? (
                    <div className="text-xs tabular-nums">
                        <div>{row.kehadiran.jarak_m} m</div>
                        {row.kehadiran.akurasi_m && (
                            <div className="text-muted-foreground">
                                ±{row.kehadiran.akurasi_m} m
                            </div>
                        )}
                    </div>
                ) : (
                    '-'
                ),
        },
        {
            key: 'aksi',
            header: 'Foto & Peninjauan',
            align: 'right',
            cell: (row) => (
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {row.kehadiran?.has_foto && (
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() =>
                                setSelectedFoto({
                                    id: row.kehadiran!.id,
                                    nama: row.nama,
                                })
                            }
                        >
                            <Camera className="size-4" />
                            Foto
                        </Button>
                    )}

                    {!isLocked &&
                        row.kehadiran?.status === 'menunggu_tinjau' && (
                            <>
                                <Form
                                    {...MonitoringKegiatanController.reviewAttendance.form(
                                        {
                                            kegiatan: kegiatan.id,
                                            kehadiran: row.kehadiran.id,
                                        },
                                    )}
                                >
                                    {({ processing }) => (
                                        <>
                                            <input
                                                type="hidden"
                                                name="status"
                                                value="valid"
                                            />
                                            <Button
                                                type="submit"
                                                size="sm"
                                                disabled={processing}
                                            >
                                                {processing ? (
                                                    <Spinner />
                                                ) : (
                                                    <CheckCircle2 className="size-4" />
                                                )}
                                                Setujui
                                            </Button>
                                        </>
                                    )}
                                </Form>

                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                        setRejectTarget({
                                            kehadiranId: row.kehadiran!.id,
                                            nama: row.nama,
                                        })
                                    }
                                >
                                    <XCircle className="size-4" />
                                    Tolak
                                </Button>
                            </>
                        )}
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title={`Monitoring — ${kegiatan.judul}`} />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <Button asChild variant="ghost" size="sm">
                        <Link href={admin.kegiatan.show(kegiatan.id)}>
                            <ArrowLeft className="size-4" />
                            Kembali ke Detail Kegiatan
                        </Link>
                    </Button>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <RefreshCw className="size-3.5" />
                        <span>
                            Pembaruan otomatis tiap 15 detik saat tab aktif
                        </span>
                    </div>
                </div>

                <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge
                                status={activitySemantic(kegiatan.status)}
                                label={kegiatan.status_label}
                            />
                            <span className="text-xs text-muted-foreground">
                                {formatTanggalWita(kegiatan.tanggal)} • Berakhir{' '}
                                {kegiatan.jam_selesai.substring(0, 5)} WITA
                            </span>
                        </div>
                        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Monitoring: {kegiatan.judul}
                        </h1>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            {ringkasan.divisi_target.map((d, idx) => (
                                <Badge key={idx} variant="secondary">
                                    {d.nama}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    {/* Aksi Tutup & Kunci Kegiatan */}
                    <div className="flex flex-wrap items-center gap-2">
                        {kegiatan.status !== 'selesai' &&
                            kegiatan.status !== 'terkunci' &&
                            kegiatan.status !== 'dibatalkan' && (
                                <Form
                                    {...MonitoringKegiatanController.complete.form(
                                        kegiatan.id,
                                    )}
                                >
                                    {({ processing }) => (
                                        <Button
                                            type="submit"
                                            variant="outline"
                                            className="h-11 md:h-9"
                                            disabled={
                                                processing ||
                                                !kegiatan.dapat_ditandai_selesai
                                            }
                                            title={
                                                !kegiatan.dapat_ditandai_selesai
                                                    ? 'Hanya dapat ditandai selesai setelah kegiatan berlangsung dan melewati jam selesai'
                                                    : undefined
                                            }
                                        >
                                            {processing && <Spinner />}
                                            Tandai Kegiatan Selesai
                                        </Button>
                                    )}
                                </Form>
                            )}

                        {kegiatan.status === 'selesai' && (
                            <Form
                                {...MonitoringKegiatanController.lock.form(
                                    kegiatan.id,
                                )}
                            >
                                {({ processing }) => (
                                    <Button
                                        type="submit"
                                        className="h-11 md:h-9"
                                        disabled={processing || hasBlockers}
                                    >
                                        {processing ? (
                                            <Spinner />
                                        ) : (
                                            <Lock className="size-4" />
                                        )}
                                        Kunci Kegiatan Final
                                    </Button>
                                )}
                            </Form>
                        )}
                    </div>
                </header>

                {/* Peringatan Penghambat Kunci */}
                {hasBlockers && !isLocked && (
                    <Card className="border-warning/50 bg-warning/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-warning">
                                <AlertTriangle className="size-4 shrink-0" />
                                Penghambat Penguncian Kegiatan (
                                {penghambat_kunci.daftar_penghambat.length}{' '}
                                item)
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Kegiatan belum dapat dikunci selama masih
                                terdapat kehadiran menunggu tinjau atau koreksi
                                yang belum diputuskan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-inside list-disc space-y-1 text-xs">
                                {penghambat_kunci.daftar_penghambat.map(
                                    (item, index) => (
                                        <li
                                            key={`${item.tipe}-${item.id}-${index}`}
                                        >
                                            <strong>{item.nama}</strong> (
                                            {item.nim}) — {item.tipe}
                                        </li>
                                    ),
                                )}
                            </ul>
                        </CardContent>
                    </Card>
                )}

                {/* Ringkasan Statistik Monitoring */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                    <SummaryTile
                        label="Kuota"
                        value={
                            ringkasan.kuota !== null
                                ? formatAngka(ringkasan.kuota)
                                : 'Bebas'
                        }
                    />
                    <SummaryTile
                        label="Terdaftar"
                        value={formatAngka(ringkasan.jumlah_terdaftar)}
                    />
                    <SummaryTile
                        label="Hadir Valid"
                        value={formatAngka(ringkasan.jumlah_valid)}
                    />
                    <SummaryTile
                        label="Menunggu Tinjau"
                        value={formatAngka(ringkasan.jumlah_menunggu)}
                    />
                    <SummaryTile
                        label="Ditolak"
                        value={formatAngka(ringkasan.jumlah_ditolak)}
                    />
                    <SummaryTile
                        label="Belum Hadir"
                        value={formatAngka(ringkasan.belum_hadir)}
                    />
                </div>

                {/* Tabel Peserta & Kehadiran */}
                <ResponsiveTable
                    caption="Daftar peserta dan status kehadiran"
                    columns={columns}
                    data={peserta}
                    keyExtractor={(row) => row.id}
                    emptyState={
                        <Card>
                            <CardContent className="py-10 text-center text-sm text-muted-foreground">
                                Belum ada peserta terdaftar pada kegiatan ini.
                            </CardContent>
                        </Card>
                    }
                    renderMobileCard={(row) => (
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <p className="font-medium">{row.nama}</p>
                                    <p className="text-xs text-muted-foreground tabular-nums">
                                        {row.nim} • {row.komsat_kode}
                                    </p>
                                </div>
                                <Badge variant="outline">
                                    {row.peran_label}
                                </Badge>
                            </div>

                            {row.kehadiran ? (
                                <div className="space-y-2 rounded-md bg-muted/50 p-2.5 text-xs">
                                    <div className="flex items-center justify-between gap-2">
                                        <StatusBadge
                                            status={attendanceSemantic(
                                                row.kehadiran.status,
                                            )}
                                            label={row.kehadiran.status_label}
                                        />
                                        <span className="tabular-nums">
                                            {row.kehadiran.jarak_m ?? '-'} m
                                        </span>
                                    </div>
                                    <p className="text-muted-foreground tabular-nums">
                                        Check-in:{' '}
                                        {formatWaktuWita(
                                            row.kehadiran.waktu_checkin,
                                        )}
                                    </p>
                                    {row.kehadiran.alasan_penolakan && (
                                        <p className="text-destructive">
                                            Alasan:{' '}
                                            {row.kehadiran.alasan_penolakan}
                                        </p>
                                    )}
                                    {row.kehadiran.status === 'ditolak' && (
                                        <p className="text-muted-foreground">
                                            Perubahan status ditolak hanya dapat
                                            diproses melalui pengajuan koreksi
                                            formal mahasiswa.
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <StatusBadge
                                    status="draft"
                                    label="Belum Hadir"
                                />
                            )}

                            <div className="flex flex-wrap gap-2">
                                {row.kehadiran?.has_foto && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-11 flex-1"
                                        onClick={() =>
                                            setSelectedFoto({
                                                id: row.kehadiran!.id,
                                                nama: row.nama,
                                            })
                                        }
                                    >
                                        <Camera className="size-4" />
                                        Lihat Foto
                                    </Button>
                                )}

                                {!isLocked &&
                                    row.kehadiran?.status ===
                                        'menunggu_tinjau' && (
                                        <>
                                            <Form
                                                {...MonitoringKegiatanController.reviewAttendance.form(
                                                    {
                                                        kegiatan: kegiatan.id,
                                                        kehadiran:
                                                            row.kehadiran.id,
                                                    },
                                                )}
                                                className="flex-1"
                                            >
                                                {({ processing }) => (
                                                    <>
                                                        <input
                                                            type="hidden"
                                                            name="status"
                                                            value="valid"
                                                        />
                                                        <Button
                                                            type="submit"
                                                            className="h-11 w-full"
                                                            disabled={
                                                                processing
                                                            }
                                                        >
                                                            {processing && (
                                                                <Spinner />
                                                            )}
                                                            Setujui
                                                        </Button>
                                                    </>
                                                )}
                                            </Form>
                                            <Button
                                                type="button"
                                                variant="destructive"
                                                className="h-11 flex-1"
                                                onClick={() =>
                                                    setRejectTarget({
                                                        kehadiranId:
                                                            row.kehadiran!.id,
                                                        nama: row.nama,
                                                    })
                                                }
                                            >
                                                Tolak
                                            </Button>
                                        </>
                                    )}
                            </div>
                        </div>
                    )}
                />
            </div>

            {/* Dialog Bukti Foto Berizin */}
            <Dialog
                open={selectedFoto !== null}
                onOpenChange={(open) => !open && setSelectedFoto(null)}
            >
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Foto Bukti Kehadiran</DialogTitle>
                        <DialogDescription>
                            Peserta: {selectedFoto?.nama}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedFoto && (
                        <div className="overflow-hidden rounded-lg border bg-muted">
                            <img
                                src={kehadiranRoutes.foto.url(selectedFoto.id)}
                                alt={`Foto kehadiran ${selectedFoto.nama}`}
                                className="aspect-[4/3] w-full object-cover"
                                loading="lazy"
                            />
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Dialog Tolak Kehadiran Menunggu Tinjau */}
            <Dialog
                open={rejectTarget !== null}
                onOpenChange={(open) => !open && setRejectTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Tolak Kehadiran Peserta</DialogTitle>
                        <DialogDescription>
                            Masukkan alasan penolakan kehadiran untuk{' '}
                            <strong>{rejectTarget?.nama}</strong>. Poin tidak
                            akan diberikan.
                        </DialogDescription>
                    </DialogHeader>
                    {rejectTarget && (
                        <Form
                            {...MonitoringKegiatanController.reviewAttendance.form(
                                {
                                    kegiatan: kegiatan.id,
                                    kehadiran: rejectTarget.kehadiranId,
                                },
                            )}
                            onSuccess={() => setRejectTarget(null)}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <input
                                        type="hidden"
                                        name="status"
                                        value="ditolak"
                                    />
                                    <div className="space-y-2">
                                        <Label htmlFor="alasan">
                                            Alasan Penolakan (Wajib)
                                        </Label>
                                        <Textarea
                                            id="alasan"
                                            name="alasan"
                                            required
                                            rows={3}
                                            placeholder="Contoh: Foto tidak memperlihatkan wajah di lokasi kegiatan."
                                        />
                                        <InputError message={errors.alasan} />
                                    </div>
                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-11 md:h-9"
                                            >
                                                Batal
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            variant="destructive"
                                            className="h-11 md:h-9"
                                            disabled={processing}
                                        >
                                            {processing && <Spinner />}
                                            Konfirmasi Tolak
                                        </Button>
                                    </DialogFooter>
                                </>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

function SummaryTile({ label, value }: { label: string; value: string }) {
    return (
        <Card>
            <CardContent className="p-3.5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
            </CardContent>
        </Card>
    );
}

MonitoringKegiatanShow.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

import { Head, Link } from '@inertiajs/react';
import {
    Calendar,
    CalendarDays,
    CheckCircle2,
    FileText,
    Trophy,
} from 'lucide-react';
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
import AppLayout from '@/layouts/app-layout';
import { formatTanggalWita } from '@/lib/format';
import mahasiswa from '@/routes/mahasiswa';

type KegiatanMendatang = {
    id: number;
    judul: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi_nama: string;
    status_kegiatan: string;
    status_kegiatan_label: string;
    peran_label: string;
    kehadiran: {
        id: number;
        status: string;
        status_label: string;
    } | null;
};

type LeaderboardItem = {
    peringkat: number;
    nama: string;
    komsat_kode: string;
    total_poin: number;
    is_current_user: boolean;
};

type Props = {
    ringkasan: {
        total_poin: number;
        jumlah_kegiatan: number;
        jumlah_hadir_valid: number;
        jumlah_koreksi_menunggu: number;
        peringkat_saya: number | string;
    };
    kegiatan_mendatang: KegiatanMendatang[];
    leaderboard: LeaderboardItem[];
};

function statusKegiatanToSemantic(status: string): SemanticStatus {
    switch (status) {
        case 'terbit':
            return 'terbuka';
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

function statusKehadiranToSemantic(status: string): SemanticStatus {
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

export default function MahasiswaDashboard({
    ringkasan,
    kegiatan_mendatang,
    leaderboard,
}: Props) {
    return (
        <>
            <Head title="Dashboard Mahasiswa" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            Mahasiswa GenBI Gorontalo
                        </p>
                        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                            Dashboard
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Pantau perolehan poin ledger, status kehadiran, dan
                            jadwal kegiatan Anda.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            asChild
                            variant="outline"
                            className="h-11 md:h-9"
                        >
                            <Link href={mahasiswa.kehadiran.index()}>
                                Riwayat Kehadiran
                            </Link>
                        </Button>
                        <Button asChild className="h-11 md:h-9">
                            <Link href={mahasiswa.poin.riwayat()}>
                                Riwayat Poin
                            </Link>
                        </Button>
                    </div>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Poin
                            </CardTitle>
                            <Trophy className="size-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">
                                {ringkasan.total_poin}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Peringkat #{ringkasan.peringkat_saya} di
                                internal
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kegiatan Diikuti
                            </CardTitle>
                            <Calendar className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">
                                {ringkasan.jumlah_kegiatan}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pendaftaran aktif terdaftar
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kehadiran Valid
                            </CardTitle>
                            <CheckCircle2 className="size-4 text-success" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">
                                {ringkasan.jumlah_hadir_valid}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Terverifikasi sistem &amp; berpoin
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">
                                Koreksi Menunggu
                            </CardTitle>
                            <FileText className="size-4 text-warning" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold tabular-nums">
                                {ringkasan.jumlah_koreksi_menunggu}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Pengajuan dalam proses
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Kegiatan Saya Mendatang
                            </h2>
                            <Button asChild variant="link" className="px-0">
                                <Link href={mahasiswa.kegiatan.index()}>
                                    Lihat semua katalog &rarr;
                                </Link>
                            </Button>
                        </div>

                        {kegiatan_mendatang.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-10 text-center">
                                    <CalendarDays className="size-10 text-muted-foreground" />
                                    <p className="mt-2 text-sm font-medium">
                                        Belum ada kegiatan mendatang
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground">
                                        Silakan cek katalog kegiatan yang
                                        ditargetkan untuk divisi Anda.
                                    </p>
                                    <Button
                                        asChild
                                        className="mt-4 h-11 md:h-9"
                                    >
                                        <Link href={mahasiswa.kegiatan.index()}>
                                            Buka Katalog Kegiatan
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid gap-3">
                                {kegiatan_mendatang.map((item) => (
                                    <Card
                                        key={item.id}
                                        className="transition-colors hover:border-primary/50"
                                    >
                                        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                                            <div className="min-w-0 space-y-1">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <StatusBadge
                                                        status={statusKegiatanToSemantic(
                                                            item.status_kegiatan,
                                                        )}
                                                        label={
                                                            item.status_kegiatan_label
                                                        }
                                                    />
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs font-normal"
                                                    >
                                                        Peran:{' '}
                                                        {item.peran_label}
                                                    </Badge>
                                                    {item.kehadiran && (
                                                        <StatusBadge
                                                            status={statusKehadiranToSemantic(
                                                                item.kehadiran
                                                                    .status,
                                                            )}
                                                            label={`Kehadiran: ${item.kehadiran.status_label}`}
                                                        />
                                                    )}
                                                </div>
                                                <h3 className="font-medium">
                                                    <Link
                                                        href={mahasiswa.kegiatan.show(
                                                            item.id,
                                                        )}
                                                        className="hover:underline focus:outline-none"
                                                    >
                                                        {item.judul}
                                                    </Link>
                                                </h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatTanggalWita(
                                                        item.tanggal,
                                                    )}{' '}
                                                    •{' '}
                                                    {item.jam_mulai.substring(
                                                        0,
                                                        5,
                                                    )}{' '}
                                                    -{' '}
                                                    {item.jam_selesai.substring(
                                                        0,
                                                        5,
                                                    )}{' '}
                                                    WITA • {item.lokasi_nama}
                                                </p>
                                            </div>

                                            <div className="flex shrink-0 items-center gap-2">
                                                {item.status_kegiatan ===
                                                    'berlangsung' &&
                                                !item.kehadiran ? (
                                                    <Button
                                                        asChild
                                                        className="h-11 md:h-9"
                                                    >
                                                        <Link
                                                            href={mahasiswa.absensi.form(
                                                                item.id,
                                                            )}
                                                        >
                                                            Check-in Sekarang
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        asChild
                                                        variant="outline"
                                                        className="h-11 md:h-9"
                                                    >
                                                        <Link
                                                            href={mahasiswa.kegiatan.show(
                                                                item.id,
                                                            )}
                                                        >
                                                            Detail
                                                        </Link>
                                                    </Button>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold tracking-tight">
                                Leaderboard Poin
                            </h2>
                            <span className="text-xs text-muted-foreground">
                                Top 10 Mahasiswa
                            </span>
                        </div>

                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-sm font-medium">
                                    Peringkat Keaktifan GenBI
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    Peringkat dihitung otomatis dari total
                                    perolehan poin ledger.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-0">
                                {leaderboard.length === 0 ? (
                                    <p className="p-4 text-xs text-muted-foreground">
                                        Belum ada perolehan poin tercatat.
                                    </p>
                                ) : (
                                    <ol className="divide-y text-sm">
                                        {leaderboard.map((item) => (
                                            <li
                                                key={item.peringkat}
                                                className={`flex items-center justify-between px-4 py-3 ${
                                                    item.is_current_user
                                                        ? 'bg-primary/10 font-semibold text-primary'
                                                        : ''
                                                }`}
                                            >
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold tabular-nums">
                                                        {item.peringkat}
                                                    </span>
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm">
                                                            {item.nama}
                                                            {item.is_current_user &&
                                                                ' (Saya)'}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Komsat{' '}
                                                            {item.komsat_kode}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="shrink-0 text-right font-medium tabular-nums">
                                                    {item.total_poin} poin
                                                </div>
                                            </li>
                                        ))}
                                    </ol>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

MahasiswaDashboard.layout = (page: React.ReactNode) => (
    <AppLayout>{page}</AppLayout>
);

import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    ClipboardCheck,
    FileWarning,
    type LucideIcon,
    Users,
} from 'lucide-react';
import { CountUpNumber } from '@/components/ui/count-up-number';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import admin from '@/routes/admin';

type Summary = {
    kegiatan_aktif: number;
    anggota_aktif: number;
    kehadiran_bulan_ini: number;
    koreksi_menunggu: number;
};

type PendingItem = {
    id: number;
    mahasiswa_nama: string;
    kegiatan_id: number;
    kegiatan_judul: string;
};

type UpcomingActivity = {
    id: number;
    judul: string;
    tanggal: string;
    jam_mulai: string;
    status_label: string;
};

type DashboardProps = {
    ringkasan: Summary;
    koreksi_menunggu: PendingItem[];
    kehadiran_menunggu: PendingItem[];
    kegiatan_terdekat: UpcomingActivity[];
};

function SummaryCard({
    icon: Icon,
    label,
    value,
    description,
}: {
    icon: LucideIcon;
    label: string;
    value: number;
    description: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{label}</CardTitle>
                <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <CountUpNumber value={value} className="text-2xl font-bold" />
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );
}

function EmptyState({ children }: { children: string }) {
    return <p className="py-2 text-sm text-muted-foreground">{children}</p>;
}

export default function AdminDashboard({
    ringkasan,
    koreksi_menunggu,
    kehadiran_menunggu,
    kegiatan_terdekat,
}: DashboardProps) {
    return (
        <>
            <Head title="Dashboard Internal Manajemen" />
            <div className="mx-auto w-full max-w-6xl space-y-6">
                <header>
                    <p className="text-sm font-medium text-primary">
                        Internal Manajemen
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Ringkasan operasional GenBI Gorontalo.
                    </p>
                </header>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <SummaryCard
                        icon={CalendarDays}
                        label="Kegiatan Aktif"
                        value={ringkasan.kegiatan_aktif}
                        description="Dalam periode aktif"
                    />
                    <SummaryCard
                        icon={Users}
                        label="Anggota Aktif"
                        value={ringkasan.anggota_aktif}
                        description="Mahasiswa berstatus aktif"
                    />
                    <SummaryCard
                        icon={ClipboardCheck}
                        label="Kehadiran Bulan Ini"
                        value={ringkasan.kehadiran_bulan_ini}
                        description="Status valid, WITA"
                    />
                    <SummaryCard
                        icon={BarChart3}
                        label="Koreksi Menunggu"
                        value={ringkasan.koreksi_menunggu}
                        description="Menunggu persetujuan"
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Sistem</CardTitle>
                        <CardDescription>
                            Prioritas kerja terbaru dan agenda terdekat.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 lg:grid-cols-3">
                        <section aria-labelledby="koreksi-menunggu-title">
                            <h2
                                id="koreksi-menunggu-title"
                                className="mb-3 flex items-center gap-2 font-semibold"
                            >
                                <FileWarning className="size-4 text-muted-foreground" />
                                Koreksi menunggu
                            </h2>
                            {koreksi_menunggu.length === 0 ? (
                                <EmptyState>
                                    Tidak ada koreksi yang menunggu.
                                </EmptyState>
                            ) : (
                                <ul className="grid gap-2">
                                    {koreksi_menunggu.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={admin.koreksi.show({
                                                    koreksi: item.id,
                                                })}
                                                className="group flex min-h-11 items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate font-medium">
                                                        {item.mahasiswa_nama}
                                                    </span>
                                                    <span className="block truncate text-xs text-muted-foreground">
                                                        {item.kegiatan_judul}
                                                    </span>
                                                </span>
                                                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section aria-labelledby="kehadiran-menunggu-title">
                            <h2
                                id="kehadiran-menunggu-title"
                                className="mb-3 flex items-center gap-2 font-semibold"
                            >
                                <ClipboardCheck className="size-4 text-muted-foreground" />
                                Kehadiran menunggu
                            </h2>
                            {kehadiran_menunggu.length === 0 ? (
                                <EmptyState>
                                    Tidak ada kehadiran yang menunggu tinjau.
                                </EmptyState>
                            ) : (
                                <ul className="grid gap-2">
                                    {kehadiran_menunggu.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={admin.kegiatan.monitoring(
                                                    item.kegiatan_id,
                                                )}
                                                className="group flex min-h-11 items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate font-medium">
                                                        {item.mahasiswa_nama}
                                                    </span>
                                                    <span className="block truncate text-xs text-muted-foreground">
                                                        {item.kegiatan_judul}
                                                    </span>
                                                </span>
                                                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>

                        <section aria-labelledby="kegiatan-terdekat-title">
                            <h2
                                id="kegiatan-terdekat-title"
                                className="mb-3 flex items-center gap-2 font-semibold"
                            >
                                <CalendarDays className="size-4 text-muted-foreground" />
                                Kegiatan terdekat
                            </h2>
                            {kegiatan_terdekat.length === 0 ? (
                                <EmptyState>
                                    Tidak ada kegiatan terdekat.
                                </EmptyState>
                            ) : (
                                <ul className="grid gap-2">
                                    {kegiatan_terdekat.map((item) => (
                                        <li key={item.id}>
                                            <Link
                                                href={admin.kegiatan.show(
                                                    item.id,
                                                )}
                                                className="group flex min-h-11 items-center justify-between gap-3 rounded-md border p-3 transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                            >
                                                <span className="min-w-0">
                                                    <span className="block truncate font-medium">
                                                        {item.judul}
                                                    </span>
                                                    <span className="block text-xs text-muted-foreground">
                                                        {item.tanggal} ·{' '}
                                                        {item.jam_mulai} ·{' '}
                                                        {item.status_label}
                                                    </span>
                                                </span>
                                                <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: admin.dashboard(),
        },
    ],
};

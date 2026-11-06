import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    Building2,
    Calendar,
    ChevronRight,
    MapPin,
    Sparkles,
    Trophy,
    Users,
} from 'lucide-react';
import JadwalController from '@/actions/App/Http/Controllers/Public/JadwalController';
import { kegiatanStatusToSemantic } from '@/components/kegiatan/types';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CountUpNumber } from '@/components/ui/count-up-number';
import { RevealSection } from '@/components/ui/reveal-section';
import PublicLayout from '@/layouts/public-layout';
import { formatRentangTanggalWita } from '@/lib/format';
import { jadwal, kepengurusan, statistik } from '@/routes/public';

type KegiatanItem = {
    id: number;
    judul: string;
    tanggal: string;
    tanggal_selesai: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi_nama: string;
    penyelenggara: string;
    status: string;
    status_label: string;
};

type Props = {
    kegiatan_terbaru: KegiatanItem[];
    ringkasan: {
        penerima_aktif: number;
        total_kegiatan: number;
        komsat_aktif: number;
    };
    komsat: { id: number; kode: string; nama: string }[];
    periode_aktif: { id: number; nama: string; aktif: boolean } | null;
};

const peranGenbi = [
    {
        title: 'Front Liners',
        description:
            'Menjadi garda terdepan dalam menyebarkan informasi ekonomi, kebijakan, dan kebanksentralan Bank Indonesia kepada masyarakat.',
        ilustrasi: '/ilustrasi/front-liners.svg',
        alt: 'Ilustrasi Front Liners GenBI',
    },
    {
        title: 'Change Agents',
        description:
            'Agen perubahan aktif yang menggerakkan aksi sosial, peduli lingkungan, dan membawa dampak positif nyata di Bumi Hulondhalo.',
        ilustrasi: '/ilustrasi/change-agents.svg',
        alt: 'Ilustrasi Change Agents GenBI',
    },
    {
        title: 'Future Leaders',
        description:
            'Wadah pengembangan diri terpadu guna membentuk calon pemimpin masa depan yang berintegritas, kritis, dan berdaya saing tinggi.',
        ilustrasi: '/ilustrasi/future-leaders.svg',
        alt: 'Ilustrasi Future Leaders GenBI',
    },
];

export default function Welcome({
    kegiatan_terbaru,
    ringkasan,
    komsat,
    periode_aktif,
}: Props) {
    return (
        <>
            <Head title="Beranda" />

            {/* Hero Section with Community Illustration */}
            <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
                    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
                        <div className="space-y-6 text-center lg:col-span-7 lg:text-left">
                            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
                                <Sparkles className="size-3.5" />
                                <span>
                                    Generasi Baru Indonesia · Provinsi Gorontalo
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:leading-[1.15]">
                                Energi untuk Negeri dari{' '}
                                <span className="text-primary">
                                    Bumi Hulondhalo
                                </span>
                            </h1>
                            <p className="mx-auto max-w-2xl text-base text-muted-foreground sm:text-lg lg:mx-0">
                                Sistem Informasi dan Penilaian Terintegrasi
                                Komunitas Mahasiswa Penerima Beasiswa Bank
                                Indonesia di 5 Komisariat Kampus se-Provinsi
                                Gorontalo.
                            </p>
                            <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row lg:justify-start">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-11 md:h-10"
                                >
                                    <Link href={jadwal()}>
                                        <Calendar className="size-4" />
                                        Lihat Aktivitas
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="outline"
                                    size="lg"
                                    className="h-11 md:h-10"
                                >
                                    <Link href={statistik()}>
                                        <Trophy className="size-4" />
                                        Lihat Statistik
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="order-first flex justify-center lg:order-last lg:col-span-5">
                            <div className="relative w-full max-w-md lg:max-w-none">
                                <img
                                    src="/ilustrasi/hero-komunitas.svg"
                                    alt="Ilustrasi komunitas mahasiswa GenBI Gorontalo"
                                    className="h-auto max-h-56 w-full object-contain sm:max-h-72 lg:max-h-96"
                                    width={480}
                                    height={360}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stat Counters Bento */}
            <section className="border-b bg-muted/20">
                <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <RevealSection className="grid gap-4 sm:grid-cols-3">
                        <Card className="border-border/80 shadow-xs transition-shadow hover:shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Users className="size-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Anggota Aktif
                                    </p>
                                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        <CountUpNumber
                                            value={ringkasan.penerima_aktif}
                                        />
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/80 shadow-xs transition-shadow hover:shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Calendar className="size-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Kegiatan Terlaksana
                                    </p>
                                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        <CountUpNumber
                                            value={ringkasan.total_kegiatan}
                                        />
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-border/80 shadow-xs transition-shadow hover:shadow-sm">
                            <CardContent className="flex items-center gap-4 p-5 sm:p-6">
                                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Building2 className="size-6" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                        Komsat Aktif
                                    </p>
                                    <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        <CountUpNumber
                                            value={ringkasan.komsat_aktif}
                                        />
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </RevealSection>
                </div>
            </section>

            {/* Kegiatan Terbaru Section */}
            <section className="border-b py-12 md:py-16">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                                <Calendar className="size-3.5" />
                                <span>Agenda Terjadwal</span>
                            </div>
                            <h2 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
                                Kegiatan Terbaru
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Jadwal partisipasi dan kegiatan publik GenBI
                                Gorontalo mendatang.
                            </p>
                        </div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="self-start sm:self-auto"
                        >
                            <Link href={jadwal()} className="gap-1.5">
                                Lihat semua agenda
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>

                    {kegiatan_terbaru.length === 0 ? (
                        <Card className="border-dashed bg-muted/20">
                            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                <Calendar className="size-10 text-muted-foreground" />
                                <p className="mt-3 font-semibold text-foreground">
                                    Belum ada kegiatan terjadwal
                                </p>
                                <p className="mt-1 max-w-md text-xs text-muted-foreground sm:text-sm">
                                    Jadwal kegiatan publik terbaru akan
                                    ditampilkan di sini setelah diterbitkan oleh
                                    pengurus.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <RevealSection className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {kegiatan_terbaru.map((item) => (
                                <Card
                                    key={item.id}
                                    className="flex flex-col justify-between border-border/80 transition-all hover:border-primary/50 hover:shadow-xs"
                                >
                                    <CardContent className="space-y-3.5 p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                href={JadwalController.show(
                                                    item.id,
                                                )}
                                                className="line-clamp-2 font-semibold text-foreground transition-colors hover:text-primary hover:underline"
                                            >
                                                {item.judul}
                                            </Link>
                                            <StatusBadge
                                                status={kegiatanStatusToSemantic(
                                                    item.status,
                                                )}
                                                label={item.status_label}
                                                className="shrink-0"
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-xs text-muted-foreground sm:text-sm">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="size-4 shrink-0 text-primary/70" />
                                                <span>
                                                    {formatRentangTanggalWita(
                                                        item.tanggal,
                                                        item.tanggal_selesai,
                                                    )}{' '}
                                                    · {item.jam_mulai} WITA
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="size-4 shrink-0 text-primary/70" />
                                                <span className="truncate">
                                                    {item.lokasi_nama}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="border-t border-border/50 pt-2 text-xs font-medium text-muted-foreground">
                                            Penyelenggara:{' '}
                                            <span className="text-foreground">
                                                {item.penyelenggara}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </RevealSection>
                    )}
                </div>
            </section>

            {/* Tiga Peran GenBI Bento */}
            <section className="border-b bg-muted/30 py-12 md:py-20">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-12 text-center">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                            <Sparkles className="size-3.5" />
                            <span>Visi &amp; Peran Strategis</span>
                        </div>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Tiga Peran Utama GenBI
                        </h2>
                        <p className="mx-auto mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                            Misi berkesinambungan penerima beasiswa Bank
                            Indonesia sebagai garda depan inovasi dan
                            kepemimpinan.
                        </p>
                    </div>

                    <RevealSection className="grid gap-6 md:grid-cols-3">
                        {peranGenbi.map((peran) => (
                            <Card
                                key={peran.title}
                                className="overflow-hidden border-border/80 shadow-xs transition-all hover:border-primary/50 hover:shadow-md"
                            >
                                <div className="flex h-44 items-center justify-center bg-primary/5 p-4 sm:h-48">
                                    <img
                                        src={peran.ilustrasi}
                                        alt={peran.alt}
                                        loading="lazy"
                                        className="h-full max-h-36 w-auto object-contain transition-transform duration-300 hover:scale-105"
                                        width={240}
                                        height={160}
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-lg font-bold text-primary">
                                        {peran.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                        {peran.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </RevealSection>
                </div>
            </section>

            {/* Lima Komisariat Aktif */}
            <section className="border-b py-12 md:py-16">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                            <Building2 className="size-3.5" />
                            <span>Jaringan Kampus</span>
                        </div>
                        <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                            Lima Komisariat Aktif
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            GenBI hadir di 5 perguruan tinggi mitra resmi Bank
                            Indonesia di Gorontalo.
                        </p>
                    </div>

                    {komsat.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Data komisariat belum tersedia.
                        </p>
                    ) : (
                        <RevealSection className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-5">
                            {komsat.map((item) => (
                                <li
                                    key={item.id}
                                    className="list-none rounded-xl border border-border/80 bg-card p-5 shadow-2xs transition-all hover:border-primary/50 hover:bg-accent/40 hover:shadow-xs"
                                >
                                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                                        {item.kode}
                                    </div>
                                    <p className="mt-3 text-base font-bold text-foreground">
                                        Komsat {item.kode}
                                    </p>
                                    <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                                        {item.nama}
                                    </p>
                                </li>
                            ))}
                        </RevealSection>
                    )}
                </div>
            </section>

            {/* CTA Kepengurusan Banner */}
            <section className="py-12 md:py-16">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <RevealSection>
                        <Card className="overflow-hidden border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent shadow-xs">
                            <CardContent className="flex flex-col items-center justify-between gap-6 p-6 sm:p-8 md:flex-row md:p-10">
                                <div className="space-y-2 text-center md:text-left">
                                    <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                        Kenali Struktur Kepengurusan
                                    </h2>
                                    <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
                                        {periode_aktif
                                            ? `Struktur kepengurusan aktif periode ${periode_aktif.nama} di tingkat Wilayah dan Komisariat kampus se-Gorontalo.`
                                            : 'Struktur kepengurusan aktif di tingkat Wilayah dan 5 Komisariat kampus se-Gorontalo.'}
                                    </p>
                                </div>
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-11 shrink-0 md:h-10"
                                >
                                    <Link
                                        href={kepengurusan()}
                                        className="gap-2"
                                    >
                                        <span>Buka Direktori Kepengurusan</span>
                                        <ChevronRight className="size-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </RevealSection>
                </div>
            </section>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;

import { Head, Link } from '@inertiajs/react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import JadwalController from '@/actions/App/Http/Controllers/Public/JadwalController';
import { kegiatanStatusToSemantic } from '@/components/kegiatan/types';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { formatAngka, formatTanggalWita } from '@/lib/format';
import { jadwal, kepengurusan, statistik } from '@/routes/public';

type KegiatanItem = {
    id: number;
    judul: string;
    tanggal: string;
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
            'Menjadi garda terdepan dalam menyebarkan informasi ekonomi dan kebanksentralan kepada masyarakat.',
    },
    {
        title: 'Change Agents',
        description:
            'Agen perubahan yang membawa dampak positif bagi lingkungan dan masyarakat sekitar.',
    },
    {
        title: 'Future Leaders',
        description:
            'Mempersiapkan diri menjadi pemimpin masa depan yang berintegritas dan berwawasan luas.',
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

            <section className="border-b">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 md:py-20 lg:px-8">
                    <div className="max-w-2xl">
                        <p className="mb-3 text-sm font-medium text-primary">
                            Generasi Baru Indonesia · Provinsi Gorontalo
                        </p>
                        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                            Energi untuk Negeri dari Bumi Hulondhalo
                        </h1>
                        <p className="mt-4 text-base text-muted-foreground md:text-lg">
                            Komunitas mahasiswa Generasi Baru Indonesia (GenBI)
                            Gorontalo di lima komisariat kampus se-Provinsi
                            Gorontalo.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button asChild className="h-11 md:h-10">
                                <Link href={jadwal()}>
                                    <Calendar />
                                    Lihat Aktivitas
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 md:h-10"
                            >
                                <Link href={statistik()}>Lihat Statistik</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="border-b">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">
                                    Anggota Aktif
                                </p>
                                <p className="mt-2 text-3xl font-semibold tabular-nums">
                                    {formatAngka(ringkasan.penerima_aktif)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">
                                    Kegiatan Publik
                                </p>
                                <p className="mt-2 text-3xl font-semibold tabular-nums">
                                    {formatAngka(ringkasan.total_kegiatan)}
                                </p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <p className="text-sm text-muted-foreground">
                                    Komsat Aktif
                                </p>
                                <p className="mt-2 text-3xl font-semibold tabular-nums">
                                    {formatAngka(ringkasan.komsat_aktif)}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="border-b">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                                Kegiatan terbaru
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Aktivitas GenBI Gorontalo yang akan datang.
                            </p>
                        </div>
                        <Button asChild variant="ghost" size="sm">
                            <Link href={jadwal()}>
                                Lihat semua
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                    {kegiatan_terbaru.length === 0 ? (
                        <div className="rounded-lg border bg-card p-8 text-center">
                            <p className="font-medium text-foreground">
                                Belum ada kegiatan terjadwal
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Jadwal kegiatan publik terbaru akan ditampilkan
                                di sini setelah diterbitkan.
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {kegiatan_terbaru.map((item) => (
                                <Card key={item.id}>
                                    <CardContent className="space-y-3 p-5">
                                        <div className="flex items-start justify-between gap-2">
                                            <Link
                                                href={JadwalController.show(
                                                    item.id,
                                                )}
                                                className="font-semibold hover:underline"
                                            >
                                                {item.judul}
                                            </Link>
                                            <StatusBadge
                                                status={kegiatanStatusToSemantic(
                                                    item.status,
                                                )}
                                                label={item.status_label}
                                            />
                                        </div>
                                        <div className="space-y-1.5 text-sm text-muted-foreground">
                                            <div className="flex gap-2">
                                                <Calendar className="size-4 shrink-0" />
                                                {formatTanggalWita(
                                                    item.tanggal,
                                                    {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    },
                                                )}
                                                {' · '}
                                                {item.jam_mulai} WITA
                                            </div>
                                            <div className="flex gap-2">
                                                <MapPin className="size-4 shrink-0" />
                                                {item.lokasi_nama}
                                            </div>
                                        </div>
                                        <p className="text-sm font-medium">
                                            {item.penyelenggara}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <section className="border-b bg-muted/30">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                            Tiga Peran GenBI
                        </h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Misi kami sebagai Generasi Baru Indonesia
                        </p>
                    </div>
                    <div className="grid gap-6 md:grid-cols-3">
                        {peranGenbi.map((peran) => (
                            <Card key={peran.title}>
                                <CardContent className="p-6">
                                    <h3 className="mb-2 font-semibold text-primary">
                                        {peran.title}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {peran.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="border-b">
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h2 className="mb-1 text-xl font-semibold tracking-tight md:text-2xl">
                        Lima komisariat aktif
                    </h2>
                    <p className="mb-6 text-sm text-muted-foreground">
                        GenBI hadir di perguruan tinggi mitra se-Gorontalo.
                    </p>
                    {komsat.length === 0 ? (
                        <p className="py-8 text-center text-sm text-muted-foreground">
                            Data komisariat belum tersedia.
                        </p>
                    ) : (
                        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                            {komsat.map((item) => (
                                <li
                                    key={item.id}
                                    className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
                                >
                                    <p className="text-lg font-semibold text-primary">
                                        Komsat {item.kode}
                                    </p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.nama}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </section>

            <section>
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
                        <div>
                            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                                Kenali kepengurusan kami
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {periode_aktif
                                    ? `Struktur pengurus periode ${periode_aktif.nama}`
                                    : 'Struktur pengurus Wilayah dan Komisariat GenBI Gorontalo'}
                            </p>
                        </div>
                        <Button asChild className="h-11 md:h-10">
                            <Link href={kepengurusan()}>
                                Lihat Direktori
                                <ArrowRight className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;

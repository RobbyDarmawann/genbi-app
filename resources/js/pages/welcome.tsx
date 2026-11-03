import { Head, Link, usePage } from '@inertiajs/react';
import { CalendarDays, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PublicLayout from '@/layouts/public-layout';
import { dashboard, login } from '@/routes';
import { jadwal } from '@/routes/public';

const komsat = [
    { kode: 'UNG', nama: 'Universitas Negeri Gorontalo' },
    { kode: 'IAIN', nama: 'IAIN Sultan Amai Gorontalo' },
    { kode: 'UG', nama: 'Universitas Gorontalo' },
    { kode: 'UMGO', nama: 'Universitas Muhammadiyah Gorontalo' },
    { kode: 'UBM', nama: 'Universitas Bina Mandiri Gorontalo' },
];

export default function Welcome() {
    const { auth } = usePage().props;

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
                            Komunitas penerima beasiswa Bank Indonesia di lima
                            komisariat kampus se-Provinsi Gorontalo. Lihat
                            kegiatan terbaru, atau masuk untuk mendaftar dan
                            melakukan absensi.
                        </p>
                        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                            <Button asChild className="h-11 md:h-10">
                                <Link href={jadwal()}>
                                    <CalendarDays />
                                    Lihat Aktivitas
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 md:h-10"
                            >
                                {auth.user ? (
                                    <Link href={dashboard()}>
                                        Buka Dashboard
                                    </Link>
                                ) : (
                                    <Link href={login()}>
                                        <LogIn />
                                        Masuk Anggota
                                    </Link>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <section>
                <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                    <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
                        Lima komisariat resmi
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Komsat GenBI Gorontalo di perguruan tinggi mitra.
                    </p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        {komsat.map((item) => (
                            <li
                                key={item.kode}
                                className="rounded-lg border p-4"
                            >
                                <p className="text-lg font-semibold text-primary">
                                    {item.kode}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {item.nama}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>
        </>
    );
}

Welcome.layout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;

import { Head, router } from '@inertiajs/react';
import { RefreshCw, Search, Trophy } from 'lucide-react';
import { useState } from 'react';
import { ResponsiveTable } from '@/components/responsive-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CountUpNumber } from '@/components/ui/count-up-number';
import { RevealSection } from '@/components/ui/reveal-section';
import PublicLayout from '@/layouts/public-layout';
import { formatAngka } from '@/lib/format';
import { statistik } from '@/routes/public';

type Person = {
    peringkat: number;
    nama: string;
    komsat: string;
    total_poin: number;
};
type Props = {
    ringkasan: {
        penerima_aktif: number;
        non_penerima_aktif: number;
        alumni: number;
        total_kegiatan: number;
        komsat_aktif: number;
    };
    leaderboard: Person[];
    tertinggi: Person[];
    terendah: Person[];
    filters: { q: string };
};

export default function Statistik({
    ringkasan,
    leaderboard,
    tertinggi,
    terendah,
    filters,
}: Props) {
    const [query, setQuery] = useState(filters.q ?? '');
    const summary: [string, number][] = [
        ['Penerima aktif', ringkasan.penerima_aktif],
        ['Non-penerima aktif', ringkasan.non_penerima_aktif],
        ['Alumni', ringkasan.alumni],
        ['Kegiatan publik', ringkasan.total_kegiatan],
        ['Komsat aktif', ringkasan.komsat_aktif],
    ];
    const columns = [
        {
            key: 'peringkat',
            header: 'Peringkat',
            cell: (row: Person) => (
                <span className="font-semibold text-primary">
                    #{row.peringkat}
                </span>
            ),
        },
        {
            key: 'nama',
            header: 'Nama',
            cell: (row: Person) => (
                <span className="font-medium text-foreground">{row.nama}</span>
            ),
        },
        {
            key: 'komsat',
            header: 'Komsat',
            cell: (row: Person) => (
                <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {row.komsat}
                </span>
            ),
        },
        {
            key: 'poin',
            header: 'Total poin',
            align: 'right' as const,
            cell: (row: Person) => (
                <span className="font-bold text-foreground tabular-nums">
                    {formatAngka(row.total_poin)}
                </span>
            ),
        },
    ];
    const renderPerson = (row: Person) => (
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                <p className="truncate font-semibold text-foreground">
                    {row.nama}
                </p>
                <p className="text-xs text-muted-foreground">
                    #{row.peringkat} · {row.komsat}
                </p>
            </div>
            <p className="shrink-0 font-bold text-primary tabular-nums">
                {formatAngka(row.total_poin)} poin
            </p>
        </div>
    );

    return (
        <>
            <Head title="Statistik GenBI Gorontalo" />
            <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-primary uppercase">
                            <Trophy className="size-3.5" />
                            <span>Statistik &amp; Peringkat</span>
                        </div>
                        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                            Statistik GenBI Gorontalo
                        </h1>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                            Ringkasan aktivitas dan kontribusi anggota
                            berdasarkan pencatatan poin terintegrasi.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="h-11 gap-2 md:h-9"
                        onClick={() => router.reload()}
                    >
                        <RefreshCw className="size-4" />
                        <span>Perbarui data</span>
                    </Button>
                </header>

                <RevealSection
                    aria-label="Ringkasan statistik"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                >
                    {summary.map(([label, value]) => (
                        <Card
                            key={label}
                            className="border-border/80 shadow-2xs"
                        >
                            <CardHeader className="pt-4 pb-1.5">
                                <CardTitle className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
                                    {label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pb-4">
                                <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                                    <CountUpNumber value={value} />
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </RevealSection>

                <RevealSection className="space-y-4">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight">
                                Leaderboard Anggota
                            </h2>
                            <p className="text-xs text-muted-foreground sm:text-sm">
                                Peringkat teratas anggota berdasarkan akumulasi
                                transaksi poin valid.
                            </p>
                        </div>
                    </div>
                    <form
                        className="flex flex-col gap-2 sm:flex-row"
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(
                                statistik().url,
                                { q: query },
                                { preserveState: true, replace: true },
                            );
                        }}
                    >
                        <div className="relative min-w-0 flex-1">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                aria-label="Cari nama mahasiswa"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.target.value)
                                }
                                placeholder="Cari nama mahasiswa..."
                                className="h-11 w-full rounded-md border border-input bg-background pr-3 pl-9 text-base text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none md:h-9 md:text-sm"
                            />
                        </div>
                        <Button type="submit" className="h-11 md:h-9">
                            Cari
                        </Button>
                    </form>
                    <ResponsiveTable<Person>
                        columns={columns}
                        data={leaderboard}
                        keyExtractor={(row) => row.peringkat}
                        renderMobileCard={renderPerson}
                        emptyState={
                            <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
                                Belum ada data poin untuk ditampilkan.
                            </p>
                        }
                    />
                </RevealSection>

                <RevealSection className="grid gap-8 lg:grid-cols-2">
                    {(
                        [
                            ['Nilai Tertinggi', tertinggi],
                            ['Nilai Terendah', terendah],
                        ] as [string, Person[]][]
                    ).map(([title, people]) => (
                        <div key={title} className="space-y-3">
                            <h2 className="text-lg font-bold tracking-tight">
                                {title}
                            </h2>
                            <ResponsiveTable<Person>
                                columns={columns}
                                data={people}
                                keyExtractor={(row) => row.peringkat}
                                renderMobileCard={renderPerson}
                                emptyState={
                                    <p className="rounded-xl border border-dashed p-6 text-center text-xs text-muted-foreground sm:text-sm">
                                        Belum ada data poin.
                                    </p>
                                }
                            />
                        </div>
                    ))}
                </RevealSection>
            </div>
        </>
    );
}

Statistik.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);

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
    foto_url?: string | null;
    jenis_kelamin?: string | null;
    karakter?: string | null;
};

function getInitials(nama: string): string {
    return nama
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0])
        .join('')
        .toUpperCase();
}

function PodiumStep({
    person,
    stepHeight,
}: {
    person: Person;
    stepHeight: string;
}) {
    const isFirst = person.peringkat === 1;
    const isSecond = person.peringkat === 2;

    return (
        <div className="flex min-w-0 flex-1 flex-col items-center justify-end">
            <div className="mb-2 flex flex-col items-center sm:mb-3">
                {person.foto_url ? (
                    <div
                        className={`flex size-14 items-center justify-center overflow-hidden rounded-full border-2 bg-muted shadow-md transition-transform sm:size-20 md:size-24 ${
                            isFirst
                                ? 'border-amber-300 ring-4 ring-amber-400 dark:border-amber-400 dark:ring-amber-500'
                                : 'border-background ring-2 ring-primary/30'
                        }`}
                    >
                        <img
                            src={person.foto_url}
                            alt={`Foto ${person.nama}`}
                            className="size-full object-cover"
                            loading="lazy"
                        />
                    </div>
                ) : person.karakter ? (
                    <div
                        className={`flex items-end justify-center ${
                            isFirst
                                ? 'h-28 drop-shadow-[0_0_10px_rgba(251,191,36,0.45)] sm:h-36 md:h-40'
                                : 'h-24 sm:h-28 md:h-32'
                        }`}
                    >
                        <img
                            src={`/ilustrasi/${person.karakter}`}
                            alt={`Ilustrasi ${person.nama}`}
                            className="h-full w-auto object-contain"
                            loading="lazy"
                        />
                    </div>
                ) : (
                    <div
                        className={`flex size-14 items-center justify-center overflow-hidden rounded-full border-2 bg-muted text-base font-bold shadow-md transition-transform sm:size-20 sm:text-xl md:size-24 ${
                            isFirst
                                ? 'border-amber-300 ring-4 ring-amber-400 dark:border-amber-400 dark:ring-amber-500'
                                : 'border-background text-primary ring-2 ring-primary/30'
                        }`}
                    >
                        <span
                            className={
                                isFirst
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-primary'
                            }
                        >
                            {getInitials(person.nama)}
                        </span>
                    </div>
                )}
            </div>

            <div
                className={`flex w-full flex-col items-center justify-between rounded-t-xl p-2 text-center shadow-sm sm:p-4 ${stepHeight} ${
                    isFirst
                        ? 'border-t-2 border-amber-400 bg-gradient-to-t from-primary to-primary/95 text-primary-foreground'
                        : isSecond
                          ? 'bg-gradient-to-t from-primary/90 to-primary/80 text-primary-foreground'
                          : 'bg-gradient-to-t from-primary/80 to-primary/70 text-primary-foreground'
                }`}
            >
                <span
                    className={`leading-none font-black tracking-tight ${
                        isFirst
                            ? 'text-4xl text-amber-300 sm:text-5xl md:text-6xl'
                            : isSecond
                              ? 'text-3xl text-primary-foreground/90 sm:text-4xl md:text-5xl'
                              : 'text-2xl text-primary-foreground/80 sm:text-3xl md:text-4xl'
                    }`}
                >
                    {person.peringkat}
                </span>

                <div className="w-full min-w-0 space-y-0.5 sm:space-y-1">
                    <p
                        className="line-clamp-2 text-xs font-bold text-primary-foreground sm:text-sm"
                        title={person.nama}
                    >
                        {person.nama}
                    </p>
                    <div className="flex items-center justify-center">
                        <span className="inline-block rounded bg-primary-foreground/20 px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground sm:text-xs">
                            {person.komsat}
                        </span>
                    </div>
                    <p
                        className={`text-[11px] font-extrabold tabular-nums sm:text-xs md:text-sm ${
                            isFirst
                                ? 'text-amber-200'
                                : 'text-primary-foreground'
                        }`}
                    >
                        {formatAngka(person.total_poin)} poin
                    </p>
                </div>
            </div>
        </div>
    );
}

function Podium({ items }: { items: Person[] }) {
    if (items.length === 0) {
        return null;
    }

    if (items.length === 1) {
        return (
            <div className="mx-auto flex w-full max-w-xs items-end justify-center rounded-xl border border-border/80 bg-muted/20 px-4 pt-6 pb-2 sm:pt-8 sm:pb-4">
                <PodiumStep person={items[0]} stepHeight="h-44 sm:h-56" />
            </div>
        );
    }

    if (items.length === 2) {
        const first = items.find((p) => p.peringkat === 1) ?? items[0];
        const second = items.find((p) => p.peringkat === 2) ?? items[1];

        return (
            <div className="mx-auto grid w-full max-w-md grid-cols-2 items-end gap-2 rounded-xl border border-border/80 bg-muted/20 px-3 pt-6 pb-2 sm:gap-4 sm:px-6 sm:pt-8 sm:pb-4">
                <PodiumStep person={second} stepHeight="h-36 sm:h-44" />
                <PodiumStep person={first} stepHeight="h-44 sm:h-56" />
            </div>
        );
    }

    const first = items.find((p) => p.peringkat === 1) ?? items[0];
    const second = items.find((p) => p.peringkat === 2) ?? items[1];
    const third = items.find((p) => p.peringkat === 3) ?? items[2];

    return (
        <div className="mx-auto grid w-full max-w-3xl grid-cols-3 items-end gap-2 rounded-xl border border-border/80 bg-muted/20 px-2 pt-6 pb-2 sm:gap-4 sm:px-6 sm:pt-8 sm:pb-4">
            <PodiumStep person={second} stepHeight="h-36 sm:h-44" />
            <PodiumStep person={first} stepHeight="h-44 sm:h-56" />
            <PodiumStep person={third} stepHeight="h-28 sm:h-36" />
        </div>
    );
}
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
                    <Podium items={tertinggi} />
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

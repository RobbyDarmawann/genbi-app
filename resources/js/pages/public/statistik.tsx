import { Head, router } from '@inertiajs/react';
import { statistik } from '@/routes/public';
import { useState } from 'react';
import { ResponsiveTable } from '@/components/responsive-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { formatAngka } from '@/lib/format';

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
            cell: (row: Person) => `#${row.peringkat}`,
        },
        { key: 'nama', header: 'Nama', cell: (row: Person) => row.nama },
        { key: 'komsat', header: 'Komsat', cell: (row: Person) => row.komsat },
        {
            key: 'poin',
            header: 'Total poin',
            align: 'right' as const,
            cell: (row: Person) => formatAngka(row.total_poin),
        },
    ];
    const renderPerson = (row: Person) => (
        <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
                <p className="truncate font-medium">{row.nama}</p>
                <p className="text-sm text-muted-foreground">
                    #{row.peringkat} · {row.komsat}
                </p>
            </div>
            <p className="shrink-0 font-semibold tabular-nums">
                {formatAngka(row.total_poin)} poin
            </p>
        </div>
    );

    return (
        <>
            <Head title="Statistik GenBI Gorontalo" />
            <main className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-medium text-primary">
                            GenBI Gorontalo
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                            Statistik
                        </h1>
                        <p className="mt-2 max-w-2xl text-muted-foreground">
                            Ringkasan aktivitas dan kontribusi anggota
                            berdasarkan data sistem.
                        </p>
                    </div>
                    <Button
                        variant="outline"
                        className="h-11 md:h-9"
                        onClick={() => router.reload()}
                    >
                        Perbarui data
                    </Button>
                </header>
                <section
                    aria-label="Ringkasan statistik"
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                >
                    {summary.map(([label, value]) => (
                        <Card key={label}>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {label}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-2xl font-semibold tabular-nums">
                                    {formatAngka(value)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </section>
                <section className="space-y-4">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Leaderboard anggota
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Sepuluh peringkat teratas berdasarkan total
                            transaksi poin.
                        </p>
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
                        <input
                            aria-label="Cari nama mahasiswa"
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder="Cari nama"
                            className="h-11 min-w-0 flex-1 rounded-md border bg-background px-3 text-base focus-visible:ring-2 focus-visible:ring-ring md:text-sm"
                        />
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
                            <p className="rounded-lg border p-6 text-center text-muted-foreground">
                                Belum ada data poin untuk ditampilkan.
                            </p>
                        }
                    />
                </section>
                <section className="grid gap-8 lg:grid-cols-2">
                    {(
                        [
                            ['Nilai tertinggi', tertinggi],
                            ['Nilai terendah', terendah],
                        ] as [string, Person[]][]
                    ).map(([title, people]) => (
                        <div key={title} className="space-y-3">
                            <h2 className="text-xl font-semibold">{title}</h2>
                            <ResponsiveTable<Person>
                                columns={columns}
                                data={people}
                                keyExtractor={(row) => row.peringkat}
                                renderMobileCard={renderPerson}
                                emptyState={
                                    <p className="rounded-lg border p-5 text-sm text-muted-foreground">
                                        Belum ada data poin.
                                    </p>
                                }
                            />
                        </div>
                    ))}
                </section>
            </main>
        </>
    );
}

Statistik.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);

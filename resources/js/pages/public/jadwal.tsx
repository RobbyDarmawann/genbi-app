import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { FormEvent } from 'react';
import JadwalController from '@/actions/App/Http/Controllers/Public/JadwalController';
import { kegiatanStatusToSemantic } from '@/components/kegiatan/types';
import {
    PaginationControls,
    type PaginationMeta,
} from '@/components/pagination-controls';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import PublicLayout from '@/layouts/public-layout';
import { formatTanggalWita } from '@/lib/format';
import { jadwal } from '@/routes/public';

type Item = {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi_nama: string;
    penyelenggara: string;
    status: string;
    status_label: string;
};
type Props = {
    kegiatan: { data: Item[] } & PaginationMeta;
    filters: { q: string };
};
export default function Jadwal({ kegiatan, filters }: Props) {
    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        router.get(
            jadwal().url,
            Object.fromEntries(new FormData(e.currentTarget)),
            { preserveState: true, replace: true },
        );
    };
    return (
        <>
            <Head title="Aktivitas" />
            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Jadwal aktivitas
                    </h1>
                    <p className="mt-2 text-muted-foreground">
                        Informasi kegiatan publik GenBI Gorontalo.
                    </p>
                </div>
                <form onSubmit={submit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari kegiatan"
                            className="h-11 pl-9 md:h-9"
                        />
                    </div>
                    <Button type="submit" className="h-11 md:h-9">
                        Cari
                    </Button>
                </form>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {kegiatan.data.map((item) => (
                        <Card key={item.id}>
                            <CardContent className="space-y-3 p-5">
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        href={JadwalController.show(item.id)}
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
                                        <Calendar className="size-4" />
                                        {formatTanggalWita(item.tanggal, {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </div>
                                    <div className="flex gap-2">
                                        <Clock className="size-4" />
                                        {item.jam_mulai} - {item.jam_selesai}{' '}
                                        WITA
                                    </div>
                                    <div className="flex gap-2">
                                        <MapPin className="size-4" />
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
                <PaginationControls meta={kegiatan} itemLabel="kegiatan" />
            </div>
        </>
    );
}
Jadwal.layout = (page: React.ReactNode) => <PublicLayout>{page}</PublicLayout>;

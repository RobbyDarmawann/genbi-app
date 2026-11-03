import { Head, Link, router } from '@inertiajs/react';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { FormEvent } from 'react';
import MahasiswaKegiatanController from '@/actions/App/Http/Controllers/Mahasiswa/KegiatanController';
import {
    kegiatanStatusLabel,
    kegiatanStatusToSemantic,
} from '@/components/kegiatan/types';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import AppLayout from '@/layouts/app-layout';
import { formatTanggalWita } from '@/lib/format';

type Activity = {
    id: number;
    judul: string;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi_nama: string;
    status: string;
    komsat: { kode: string; nama: string } | null;
    kuota: number | null;
    jumlah_pendaftar: number;
    sisa_kuota: number | null;
    ditargetkan_untuk_saya: boolean;
    status_pendaftaran: string | null;
    status_pendaftaran_tampil: string;
    status_pendaftaran_label: string;
    peran_saya: string | null;
    peran_saya_label: string;
    poin_peran_saya: number;
};
type Props = {
    kegiatan: { data: Activity[] };
    mahasiswaInfo: { nama: string; komsat_kode: string; divisi_nama: string };
    filters: { q: string; tab: string; untuk_saya: boolean };
};
export default function Index({ kegiatan, filters }: Props) {
    const handleSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        router.get(
            MahasiswaKegiatanController.index().url,
            {
                ...Object.fromEntries(form),
                tab: filters.tab,
                untuk_saya: filters.untuk_saya ? '1' : '0',
            },
            { preserveState: true, replace: true },
        );
    };
    const handleTabChange = (tab: string) => {
        router.get(
            MahasiswaKegiatanController.index().url,
            { q: filters.q, tab, untuk_saya: tab === 'untuk_saya' ? '1' : '0' },
            { preserveState: true, replace: true },
        );
    };
    return (
        <>
            <Head title="Kegiatan Saya" />
            <div className="space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Kegiatan
                    </h1>
                </header>
                <div className="flex gap-2 border-b">
                    <button
                        type="button"
                        onClick={() => handleTabChange('untuk_saya')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium ${filters.tab === 'untuk_saya' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    >
                        Kegiatan untuk Saya
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTabChange('semua')}
                        className={`border-b-2 px-4 py-2 text-sm font-medium ${filters.tab === 'semua' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'}`}
                    >
                        Semua Jadwal
                    </button>
                </div>
                <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            name="q"
                            defaultValue={filters.q}
                            placeholder="Cari judul kegiatan"
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
                            <CardContent className="space-y-3 p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <Link
                                        href={MahasiswaKegiatanController.show(
                                            item.id,
                                        )}
                                        className="line-clamp-2 font-semibold hover:underline"
                                    >
                                        {item.judul}
                                    </Link>
                                    <StatusBadge
                                        status={kegiatanStatusToSemantic(
                                            item.status,
                                        )}
                                        label={kegiatanStatusLabel(item.status)}
                                    />
                                </div>
                                <div className="space-y-1.5 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="size-4 shrink-0" />
                                        <span>
                                            {formatTanggalWita(item.tanggal, {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="size-4 shrink-0" />
                                        <span>
                                            {item.jam_mulai} -{' '}
                                            {item.jam_selesai} WITA
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="size-4 shrink-0" />
                                        <span className="truncate">
                                            {item.lokasi_nama}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    {item.ditargetkan_untuk_saya ? (
                                        <Badge
                                            variant="outline"
                                            className="border-primary/30 bg-primary/10 text-primary"
                                        >
                                            Target divisi Anda
                                        </Badge>
                                    ) : (
                                        <Badge variant="outline">
                                            Divisi terpilih
                                        </Badge>
                                    )}
                                    {item.status_pendaftaran_label && (
                                        <Badge variant="secondary">
                                            {item.status_pendaftaran_label}
                                        </Badge>
                                    )}
                                    <span className="ml-auto text-sm font-semibold tabular-nums">
                                        {item.poin_peran_saya} poin
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}
Index.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

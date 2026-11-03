import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Calendar, Clock, MapPin } from 'lucide-react';
import { kegiatanStatusToSemantic } from '@/components/kegiatan/types';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { formatTanggalWita } from '@/lib/format';
import { jadwal } from '@/routes/public';
type Props = {
    kegiatan: {
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
};
export default function JadwalShow({ kegiatan }: Props) {
    return (
        <>
            <Head title={kegiatan.judul} />
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
                <Button variant="ghost" asChild className="-ml-3">
                    <Link href={jadwal()}>
                        <ArrowLeft className="size-4" />
                        Kembali ke jadwal
                    </Link>
                </Button>
                <div>
                    <StatusBadge
                        status={kegiatanStatusToSemantic(kegiatan.status)}
                        label={kegiatan.status_label}
                    />
                    <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                        {kegiatan.judul}
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        {kegiatan.penyelenggara}
                    </p>
                </div>
                <Card>
                    <CardContent className="grid gap-4 p-5">
                        <div className="flex gap-3">
                            <Calendar className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Tanggal
                                </p>
                                <p className="font-medium">
                                    {formatTanggalWita(kegiatan.tanggal, {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Clock className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Waktu
                                </p>
                                <p className="font-medium">
                                    {kegiatan.jam_mulai} -{' '}
                                    {kegiatan.jam_selesai} WITA
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <MapPin className="size-5 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Lokasi
                                </p>
                                <p className="font-medium">
                                    {kegiatan.lokasi_nama}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {kegiatan.deskripsi && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Deskripsi kegiatan</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm whitespace-pre-wrap">
                                {kegiatan.deskripsi}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </>
    );
}
JadwalShow.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);

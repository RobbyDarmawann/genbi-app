import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    Clock,
    type LucideIcon,
    MapPin,
    Pencil,
    Users,
} from 'lucide-react';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import LeafletPicker from '@/components/kegiatan/leaflet-picker';
import {
    kegiatanStatusLabel,
    kegiatanStatusToSemantic,
} from '@/components/kegiatan/types';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { formatTanggalWita } from '@/lib/format';
import admin from '@/routes/admin';

type Activity = {
    id: number;
    judul: string;
    deskripsi: string | null;
    tanggal: string;
    jam_mulai: string;
    jam_selesai: string;
    lokasi_nama: string;
    latitude: number;
    longitude: number;
    radius_m: number;
    status: string;
    komsat: { kode: string; nama: string } | null;
    divisi_target: {
        id: number;
        nama: string;
        komsat_id: number;
        komsat_kode?: string | null;
    }[];
    bobot_list: { peran: string; label: string; poin: number }[];
    kuota: number | null;
    sisa_kuota: number | null;
    pendaftaran_count: number;
    jumlah_hadir: number;
    pembuat: { name: string };
};
type Props = {
    kegiatan: Activity;
    map: { latitude: number; longitude: number; radius_m: number };
};
export default function Show({ kegiatan, map }: Props) {
    const changeStatus = (status: string) => {
        router.patch(
            AdminKegiatanController.updateStatus(kegiatan.id).url,
            { status },
            { preserveScroll: true },
        );
    };
    return (
        <>
            <Head title={kegiatan.judul} />
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                        <header>
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {kegiatan.judul}
                            </h1>
                        </header>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <StatusBadge
                                status={kegiatanStatusToSemantic(
                                    kegiatan.status,
                                )}
                                label={kegiatanStatusLabel(kegiatan.status)}
                            />
                            <span className="text-sm text-muted-foreground">
                                oleh {kegiatan.pembuat.name}
                            </span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {kegiatan.status === 'draft' && (
                            <Button
                                type="button"
                                onClick={() => changeStatus('terbit')}
                                className="h-11 md:h-9"
                            >
                                Terbitkan
                            </Button>
                        )}
                        {kegiatan.status === 'selesai' && (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => changeStatus('terkunci')}
                                className="h-11 md:h-9"
                            >
                                Kunci Kegiatan
                            </Button>
                        )}
                        {kegiatan.status !== 'terkunci' &&
                            kegiatan.status !== 'dibatalkan' && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    onClick={() => changeStatus('dibatalkan')}
                                    className="h-11 md:h-9"
                                >
                                    Batalkan
                                </Button>
                            )}
                        {kegiatan.status !== 'terkunci' && (
                            <Button
                                asChild
                                variant="outline"
                                className="h-11 md:h-9"
                            >
                                <Link
                                    href={AdminKegiatanController.edit(
                                        kegiatan.id,
                                    )}
                                >
                                    <Pencil className="size-4" />
                                    Edit
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informasi kegiatan</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Item
                                icon={Calendar}
                                label="Tanggal"
                                value={formatTanggalWita(kegiatan.tanggal, {
                                    weekday: 'long',
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                })}
                            />
                            <Item
                                icon={Clock}
                                label="Waktu"
                                value={`${kegiatan.jam_mulai.slice(0, 5)} - ${kegiatan.jam_selesai.slice(0, 5)} WITA`}
                            />
                            <Item
                                icon={MapPin}
                                label="Lokasi"
                                value={`${kegiatan.lokasi_nama} (Radius ${map.radius_m} m)`}
                            />
                            <Item
                                icon={Users}
                                label="Penyelenggara"
                                value={
                                    kegiatan.komsat?.nama ??
                                    'Wilayah GenBI Gorontalo'
                                }
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>Partisipasi &amp; Monitoring</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Item
                                label="Kapasitas / Kuota"
                                value={
                                    kegiatan.kuota !== null
                                        ? `${kegiatan.kuota} kursi (Sisa ${kegiatan.sisa_kuota ?? 0} kursi)`
                                        : 'Tanpa batas kuota'
                                }
                            />
                            <Item
                                label="Terdaftar aktif"
                                value={`${kegiatan.pendaftaran_count} orang`}
                            />
                            <Item
                                label="Hadir valid"
                                value={`${kegiatan.jumlah_hadir} orang`}
                            />
                            <div className="flex flex-wrap gap-2 pt-2">
                                <Button asChild className="h-11 md:h-9">
                                    <Link
                                        href={admin.kegiatan.peserta.index(
                                            kegiatan.id,
                                        )}
                                    >
                                        <Users className="size-4" />
                                        Kelola Peserta
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    asChild
                                    className="h-11 md:h-9"
                                >
                                    <Link
                                        href={admin.kegiatan.monitoring(
                                            kegiatan.id,
                                        )}
                                    >
                                        Lihat Monitoring Kehadiran
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Peta Lokasi &amp; Geofence</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <LeafletPicker
                            latitude={map.latitude}
                            longitude={map.longitude}
                            radius={map.radius_m}
                            readOnly
                        />
                        <p className="text-xs text-muted-foreground">
                            Koordinat: {map.latitude}, {map.longitude} • Radius
                            geofence: {map.radius_m} meter
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Divisi target</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {kegiatan.divisi_target.map((divisi) => (
                                <span
                                    key={divisi.id}
                                    className="rounded-md border bg-muted/50 px-3 py-1.5 text-sm"
                                >
                                    {divisi.komsat_kode
                                        ? `${divisi.komsat_kode} — ${divisi.nama}`
                                        : divisi.nama}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Bobot poin peran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-2 sm:grid-cols-3">
                            {kegiatan.bobot_list.map((item) => (
                                <div
                                    key={item.peran}
                                    className="rounded-md border p-3"
                                >
                                    <p className="text-sm text-muted-foreground">
                                        {item.label}
                                    </p>
                                    <p className="text-lg font-semibold tabular-nums">
                                        {item.poin} poin
                                    </p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                {kegiatan.deskripsi && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Deskripsi</CardTitle>
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
Show.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;
function Item({
    icon: Icon,
    label,
    value,
}: {
    icon?: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <div className="flex gap-3">
            {Icon && (
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        </div>
    );
}

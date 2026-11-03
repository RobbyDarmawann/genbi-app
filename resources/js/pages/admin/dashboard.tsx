import { Head } from '@inertiajs/react';
import { BarChart3, CalendarDays, ClipboardCheck, Users } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes/admin';

export default function AdminDashboard() {
    return (
        <>
            <Head title="Dashboard Internal Manajemen" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header>
                    <p className="text-sm font-medium text-primary">
                        Internal Manajemen
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Kelola kegiatan, anggota, dan sistem GenBI Gorontalo.
                    </p>
                </header>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kegiatan Aktif
                            </CardTitle>
                            <CalendarDays className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Total kegiatan periode ini
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Anggota Aktif
                            </CardTitle>
                            <Users className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Mahasiswa terdaftar
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kehadiran Bulan Ini
                            </CardTitle>
                            <ClipboardCheck className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Total kehadiran valid
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Koreksi Menunggu
                            </CardTitle>
                            <BarChart3 className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Menunggu persetujuan
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Ringkasan Sistem</CardTitle>
                        <CardDescription>
                            Statistik akan tersedia pada fase implementasi
                            berikutnya.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Dashboard ini akan menampilkan grafik partisipasi,
                        kegiatan mendatang, dan data operasional lainnya.
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

AdminDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

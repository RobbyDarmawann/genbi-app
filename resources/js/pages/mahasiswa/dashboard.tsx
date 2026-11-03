import { Head } from '@inertiajs/react';
import { CalendarDays, ClipboardCheck, Star } from 'lucide-react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard } from '@/routes/mahasiswa';

export default function MahasiswaDashboard() {
    return (
        <>
            <Head title="Dashboard Mahasiswa" />
            <div className="mx-auto w-full max-w-6xl space-y-6 p-4 md:p-6">
                <header>
                    <p className="text-sm font-medium text-primary">
                        Mahasiswa GenBI
                    </p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                        Dashboard
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Ringkasan kegiatan, kehadiran, dan poin Anda.
                    </p>
                </header>
                <div className="grid gap-4 sm:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kegiatan Mendatang
                            </CardTitle>
                            <CalendarDays className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Kegiatan yang dapat diikuti
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Kehadiran
                            </CardTitle>
                            <ClipboardCheck className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Kehadiran valid
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Poin Saya
                            </CardTitle>
                            <Star className="size-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">—</div>
                            <p className="text-xs text-muted-foreground">
                                Total poin terkumpul
                            </p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Aktivitas Anda</CardTitle>
                        <CardDescription>
                            Informasi kegiatan dan kehadiran terbaru.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                        Belum ada aktivitas untuk ditampilkan.
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

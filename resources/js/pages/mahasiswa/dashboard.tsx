import { Head } from '@inertiajs/react';

export default function MahasiswaDashboard() {
    return (
        <>
            <Head title="Dashboard Mahasiswa" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="space-y-2">
                    <h1 className="text-2xl font-semibold">Dashboard Mahasiswa</h1>
                    <p className="text-muted-foreground">Kelola kegiatan dan poin Anda.</p>
                </div>
            </div>
        </>
    );
}

MahasiswaDashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: '/mahasiswa/dashboard',
        },
    ],
};

import { Head } from '@inertiajs/react';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import { KegiatanForm } from '@/components/kegiatan/kegiatan-form';
import AppLayout from '@/layouts/app-layout';

type Props = {
    komsatOptions: { id: number; kode: string; nama: string }[];
    divisiGroups: {
        id: number;
        kode: string;
        nama: string;
        divisi: { id: number; nama: string }[];
    }[];
    statusOptions: { value: string; label: string }[];
    peranOptions: { value: string; label: string }[];
};
export default function Create({
    komsatOptions,
    divisiGroups,
    statusOptions,
}: Props) {
    return (
        <>
            <Head title="Buat Kegiatan" />
            <div className="mx-auto max-w-5xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Buat kegiatan
                    </h1>
                    <p className="mt-1 text-muted-foreground">
                        Isi informasi kegiatan, lokasi, target divisi, dan bobot
                        poin.
                    </p>
                </header>
                <KegiatanForm
                    komsatOptions={komsatOptions}
                    divisiGroups={divisiGroups}
                    statusOptions={statusOptions}
                    cancelHref={AdminKegiatanController.index().url}
                />
            </div>
        </>
    );
}
Create.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

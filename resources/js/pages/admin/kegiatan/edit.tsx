import { Head } from '@inertiajs/react';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import { KegiatanForm } from '@/components/kegiatan/kegiatan-form';
import AppLayout from '@/layouts/app-layout';

type Props = {
    kegiatan: Parameters<typeof KegiatanForm>[0]['record'];
    komsatOptions: { id: number; kode: string; nama: string }[];
    divisiGroups: {
        id: number;
        kode: string;
        nama: string;
        divisi: { id: number; nama: string }[];
    }[];
    statusOptions: { value: string; label: string }[];
    peringatanKehadiran?: boolean;
};
export default function Edit({
    kegiatan,
    komsatOptions,
    divisiGroups,
    statusOptions,
    peringatanKehadiran,
}: Props) {
    return (
        <>
            <Head title="Edit Kegiatan" />
            <div className="mx-auto max-w-5xl space-y-6">
                <header>
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Edit kegiatan
                    </h1>
                </header>
                <KegiatanForm
                    record={kegiatan}
                    komsatOptions={komsatOptions}
                    divisiGroups={divisiGroups}
                    statusOptions={statusOptions}
                    peringatanKehadiran={peringatanKehadiran}
                    cancelHref={
                        kegiatan
                            ? AdminKegiatanController.show(kegiatan.id).url
                            : AdminKegiatanController.index().url
                    }
                />
            </div>
        </>
    );
}
Edit.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

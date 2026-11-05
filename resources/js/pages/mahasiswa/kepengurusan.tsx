import { Head } from '@inertiajs/react';
import {
    DirektoriKepengurusanContent,
    type KepengurusanPageProps,
} from '@/pages/public/kepengurusan';
import mahasiswa from '@/routes/mahasiswa';

export default function KepengurusanMahasiswa(props: KepengurusanPageProps) {
    return (
        <>
            <Head title="Direktori Kepengurusan" />
            <div className="mx-auto w-full max-w-7xl space-y-6">
                <DirektoriKepengurusanContent
                    {...props}
                    filterUrl={mahasiswa.kepengurusan.index().url}
                />
            </div>
        </>
    );
}

import { Head } from '@inertiajs/react';
import Heading from '@/components/heading';
import { MahasiswaForm } from '@/components/mahasiswa/mahasiswa-form';
import type {
    DivisiOption,
    KomsatOption,
    StatusPenerimaOption,
} from '@/components/mahasiswa/types';
import { Card, CardContent } from '@/components/ui/card';
import admin, { dashboard } from '@/routes/admin';

type Props = {
    komsatOptions: KomsatOption[];
    divisiOptions: DivisiOption[];
    statusPenerimaOptions: StatusPenerimaOption[];
};

export default function MahasiswaCreate({
    komsatOptions,
    divisiOptions,
    statusPenerimaOptions,
}: Props) {
    return (
        <>
            <Head title="Tambah Anggota Mahasiswa" />
            <div className="mx-auto w-full max-w-4xl space-y-6">
                <Heading
                    title="Tambah Anggota Mahasiswa"
                    description="Buat akun login dan daftarkan profil mahasiswa GenBI baru secara bersamaan."
                />

                <Card>
                    <CardContent className="p-4 md:p-6">
                        <MahasiswaForm
                            komsatOptions={komsatOptions}
                            divisiOptions={divisiOptions}
                            statusPenerimaOptions={statusPenerimaOptions}
                            cancelHref={admin.mahasiswa.index().url}
                        />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaCreate.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Anggota', href: admin.mahasiswa.index() },
        { title: 'Tambah Anggota', href: admin.mahasiswa.create() },
    ],
};

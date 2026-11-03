import { Head, Link } from '@inertiajs/react';
import { Eye, ShieldAlert } from 'lucide-react';
import Heading from '@/components/heading';
import { DeleteMahasiswaDialog } from '@/components/mahasiswa/delete-mahasiswa-dialog';
import { MahasiswaForm } from '@/components/mahasiswa/mahasiswa-form';
import { ResetPasswordCard } from '@/components/mahasiswa/reset-password-card';
import {
    formatPoin,
    type DivisiOption,
    type KomsatOption,
    type MahasiswaRow,
    type StatusPenerimaOption,
} from '@/components/mahasiswa/types';
import { StatusBadge } from '@/components/status-badge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import admin, { dashboard } from '@/routes/admin';

type Props = {
    mahasiswa: MahasiswaRow;
    komsatOptions: KomsatOption[];
    divisiOptions: DivisiOption[];
    statusPenerimaOptions: StatusPenerimaOption[];
};

export default function MahasiswaEdit({
    mahasiswa,
    komsatOptions,
    divisiOptions,
    statusPenerimaOptions,
}: Props) {
    return (
        <>
            <Head title={`Ubah Anggota - ${mahasiswa.name}`} />
            <div className="mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Heading
                            title={`Ubah: ${mahasiswa.name}`}
                            description={`Perbarui profil keanggotaan @${mahasiswa.username} (${mahasiswa.nim}).`}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <StatusBadge
                                status={mahasiswa.aktif ? 'aktif' : 'nonaktif'}
                            />
                            <Badge variant="secondary">
                                {mahasiswa.status_penerima_label}
                            </Badge>
                            <span className="text-sm font-semibold text-foreground tabular-nums">
                                {formatPoin(mahasiswa.total_poin)} poin
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            variant="outline"
                            asChild
                            className="h-11 md:h-9"
                        >
                            <Link href={admin.mahasiswa.show(mahasiswa.id)}>
                                <Eye className="size-4" />
                                <span>Lihat Profil</span>
                            </Link>
                        </Button>
                        <DeleteMahasiswaDialog row={mahasiswa} />
                    </div>
                </header>

                {mahasiswa.terikat && (
                    <div className="flex items-start gap-3 rounded-lg border border-info/30 bg-info/10 p-4 text-sm text-info">
                        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="font-semibold">
                                Anggota Memiliki Riwayat Aktivitas
                            </p>
                            <p className="text-muted-foreground">
                                Anggota ini telah memiliki catatan riwayat
                                kegiatan, transaksi poin, koreksi, atau
                                kepengurusan. Akun tidak dapat dihapus permanen;
                                gunakan status nonaktif bila anggota sudah tidak
                                berhak mengakses sistem.
                            </p>
                        </div>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Informasi Anggota & Akun
                        </CardTitle>
                        <CardDescription>
                            Perubahan pada form ini tidak memengaruhi password
                            login mahasiswa.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <MahasiswaForm
                            record={mahasiswa}
                            komsatOptions={komsatOptions}
                            divisiOptions={divisiOptions}
                            statusPenerimaOptions={statusPenerimaOptions}
                            cancelHref={admin.mahasiswa.index().url}
                        />
                    </CardContent>
                </Card>

                <ResetPasswordCard
                    mahasiswaId={mahasiswa.id}
                    username={mahasiswa.username}
                />
            </div>
        </>
    );
}

MahasiswaEdit.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Anggota', href: admin.mahasiswa.index() },
        { title: 'Ubah Data', href: '#' },
    ],
};

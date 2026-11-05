import { Head, Link } from '@inertiajs/react';
import {
    CalendarDays,
    IdCard,
    Pencil,
    Phone,
    ShieldAlert,
    UserRound,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Heading from '@/components/heading';
import { DeleteMahasiswaDialog } from '@/components/mahasiswa/delete-mahasiswa-dialog';
import {
    formatPoin,
    formatTanggalWaktu,
    type MahasiswaRow,
    type RiwayatPoinItem,
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
    riwayatPoin: RiwayatPoinItem[];
};

export default function MahasiswaShow({ mahasiswa, riwayatPoin }: Props) {
    return (
        <>
            <Head title={`Detail Anggota - ${mahasiswa.name}`} />
            <div className="mx-auto w-full max-w-5xl space-y-6">
                <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <Heading
                            title={mahasiswa.name}
                            description={`@${mahasiswa.username} · NIM ${mahasiswa.nim}`}
                        />
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            <StatusBadge
                                status={mahasiswa.aktif ? 'aktif' : 'nonaktif'}
                            />
                            <Badge variant="secondary">
                                {mahasiswa.status_penerima_label}
                            </Badge>
                            <span className="text-sm font-semibold tabular-nums">
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
                            <Link href={admin.mahasiswa.edit(mahasiswa.id)}>
                                <Pencil className="size-4" />
                                <span>Ubah Data</span>
                            </Link>
                        </Button>
                        <DeleteMahasiswaDialog row={mahasiswa} />
                    </div>
                </header>

                {!mahasiswa.aktif && (
                    <div className="flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                        <ShieldAlert className="mt-0.5 size-5 shrink-0" />
                        <div>
                            <p className="font-semibold">Akun Nonaktif</p>
                            <p className="text-muted-foreground">
                                Mahasiswa tidak dapat login, mendaftar kegiatan,
                                atau melakukan absensi sampai akun diaktifkan
                                kembali.
                            </p>
                        </div>
                    </div>
                )}

                <section className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <UserRound className="size-4 text-muted-foreground" />
                                Profil Keanggotaan
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Info
                                    label="Nama lengkap"
                                    value={mahasiswa.name}
                                />
                                <Info
                                    label="Username"
                                    value={`@${mahasiswa.username}`}
                                />
                                <Info label="NIM" value={mahasiswa.nim} />
                                <Info
                                    label="Angkatan"
                                    value={mahasiswa.angkatan}
                                />
                                <Info
                                    label="Komisariat"
                                    value={
                                        mahasiswa.komsat
                                            ? `${mahasiswa.komsat.kode} — ${mahasiswa.komsat.nama}`
                                            : '—'
                                    }
                                />
                                <Info
                                    label="Divisi"
                                    value={mahasiswa.divisi?.nama ?? '—'}
                                />
                                <Info
                                    label="Status penerima"
                                    value={mahasiswa.status_penerima_label}
                                />
                                <Info
                                    label="Status akun"
                                    value={
                                        mahasiswa.aktif ? 'Aktif' : 'Nonaktif'
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-base">
                                <CalendarDays className="size-4 text-muted-foreground" />
                                Ringkasan Riwayat
                            </CardTitle>
                            <CardDescription>
                                Catatan aktivitas dipertahankan meskipun akun
                                dinonaktifkan.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <Info
                                label="Pendaftaran kegiatan"
                                value={formatPoin(mahasiswa.counts.pendaftaran)}
                            />
                            <Info
                                label="Transaksi poin"
                                value={formatPoin(
                                    mahasiswa.counts.poin_transaksi,
                                )}
                            />
                            <Info
                                label="Koreksi"
                                value={formatPoin(mahasiswa.counts.koreksi)}
                            />
                            <Info
                                label="Kepengurusan"
                                value={formatPoin(
                                    mahasiswa.counts.kepengurusan,
                                )}
                            />
                        </CardContent>
                    </Card>
                </section>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <IdCard className="size-4 text-muted-foreground" />
                            Data Diri
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {[
                            mahasiswa.jenis_kelamin,
                            mahasiswa.agama,
                            mahasiswa.golongan_darah,
                            mahasiswa.tanggal_lahir,
                            mahasiswa.domisili,
                            mahasiswa.no_hp,
                            mahasiswa.foto_url,
                        ].every((value) => !value) ? (
                            <p className="text-sm text-muted-foreground">
                                Mahasiswa belum melengkapi data diri.
                            </p>
                        ) : (
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted text-lg font-semibold">
                                    {mahasiswa.foto_url ? (
                                        <img
                                            src={mahasiswa.foto_url}
                                            alt={`Foto ${mahasiswa.name}`}
                                            className="size-full object-cover"
                                        />
                                    ) : (
                                        mahasiswa.name
                                            .split(/\s+/)
                                            .slice(0, 2)
                                            .map((part) => part[0] ?? '')
                                            .join('')
                                            .toUpperCase()
                                    )}
                                </div>
                                <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                    <Info
                                        label="Jenis kelamin"
                                        value={mahasiswa.jenis_kelamin ?? '—'}
                                    />
                                    <Info
                                        label="Agama"
                                        value={mahasiswa.agama ?? '—'}
                                    />
                                    <Info
                                        label="Golongan darah"
                                        value={mahasiswa.golongan_darah ?? '—'}
                                    />
                                    <Info
                                        label="Tanggal lahir"
                                        value={formatTanggalLahir(
                                            mahasiswa.tanggal_lahir,
                                        )}
                                    />
                                    <Info
                                        label="Domisili"
                                        value={mahasiswa.domisili ?? '—'}
                                    />
                                    <Info
                                        label="Email akun"
                                        value={mahasiswa.email ?? '—'}
                                    />
                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-muted-foreground">
                                            Nomor HP
                                        </p>
                                        {mahasiswa.no_hp ? (
                                            <a
                                                href={`https://wa.me/${formatWhatsAppNumber(mahasiswa.no_hp)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-1 inline-flex min-h-8 items-center gap-2 rounded-md border bg-muted/40 px-2 text-sm font-medium hover:bg-muted"
                                            >
                                                <Phone className="size-4" />
                                                {mahasiswa.no_hp}
                                            </a>
                                        ) : (
                                            <p className="mt-1 font-medium">
                                                —
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Riwayat Transaksi Poin
                        </CardTitle>
                        <CardDescription>
                            Total poin berasal dari penjumlahan ledger transaksi
                            poin anggota.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {riwayatPoin.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-8 text-center">
                                <p className="font-medium">
                                    Belum ada transaksi poin
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    Transaksi akan tercatat setelah modul
                                    kegiatan dan poin berjalan.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="hidden overflow-x-auto md:block">
                                    <table className="w-full caption-bottom text-sm">
                                        <thead className="sticky top-0 border-b bg-muted/50 text-left">
                                            <tr>
                                                <th className="h-10 px-3 font-medium">
                                                    Waktu
                                                </th>
                                                <th className="h-10 px-3 font-medium">
                                                    Keterangan
                                                </th>
                                                <th className="h-10 px-3 font-medium">
                                                    Kegiatan
                                                </th>
                                                <th className="h-10 px-3 text-right font-medium">
                                                    Jumlah
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {riwayatPoin.map((item) => (
                                                <tr
                                                    key={item.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="p-3">
                                                        {formatTanggalWaktu(
                                                            item.created_at,
                                                        )}
                                                    </td>
                                                    <td className="p-3">
                                                        <span className="font-medium">
                                                            {item.keterangan}
                                                        </span>
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2"
                                                        >
                                                            {item.tipe ===
                                                            'kredit'
                                                                ? 'Kredit'
                                                                : 'Koreksi'}
                                                        </Badge>
                                                    </td>
                                                    <td className="p-3">
                                                        {item.kegiatan_nama ??
                                                            '—'}
                                                    </td>
                                                    <td className="p-3 text-right font-semibold tabular-nums">
                                                        {item.jumlah > 0
                                                            ? `+${formatPoin(item.jumlah)}`
                                                            : formatPoin(
                                                                  item.jumlah,
                                                              )}{' '}
                                                        poin
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <ul className="grid gap-3 md:hidden">
                                    {riwayatPoin.map((item) => (
                                        <li
                                            key={item.id}
                                            className="rounded-md border p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {item.keterangan}
                                                    </p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {formatTanggalWaktu(
                                                            item.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 font-semibold tabular-nums">
                                                    {item.jumlah > 0
                                                        ? `+${formatPoin(item.jumlah)}`
                                                        : formatPoin(
                                                              item.jumlah,
                                                          )}{' '}
                                                    poin
                                                </span>
                                            </div>
                                            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="outline">
                                                    {item.tipe === 'kredit'
                                                        ? 'Kredit'
                                                        : 'Koreksi'}
                                                </Badge>
                                                <span>
                                                    {item.kegiatan_nama ?? '—'}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {mahasiswa.counts.poin_transaksi >
                                    riwayatPoin.length && (
                                    <p className="mt-4 text-sm text-muted-foreground">
                                        Menampilkan 10 transaksi terbaru.
                                    </p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

MahasiswaShow.layout = {
    breadcrumbs: [
        { title: 'Dashboard', href: dashboard() },
        { title: 'Anggota', href: admin.mahasiswa.index() },
        { title: 'Detail', href: '#' },
    ],
};

function formatTanggalLahir(value: string | null | undefined): string {
    if (!value) {
        return '—';
    }

    const [year, month, day] = value.split('-').map(Number);
    return new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'long',
        timeZone: 'UTC',
    }).format(new Date(Date.UTC(year, month - 1, day)));
}

function formatWhatsAppNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
}

function Info({ label, value }: { label: string; value: string | ReactNode }) {
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">{label}</p>
            <p className="mt-1 font-medium break-words">{value}</p>
        </div>
    );
}

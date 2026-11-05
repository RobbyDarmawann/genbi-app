import { Head, router } from '@inertiajs/react';
import { Instagram, Mail, Phone, Search } from 'lucide-react';
import { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PublicLayout from '@/layouts/public-layout';
import { kepengurusan } from '@/routes/public';

export type KepengurusanEntry = {
    id: number;
    nama_tampil: string;
    jabatan: string;
    no_hp: string | null;
    instagram: string | null;
    email: string | null;
    kontak: string | null;
    komsat_nama: string | null;
    komsat_kode: string | null;
    foto_url: string | null;
};

export type KepengurusanPageProps = {
    periode: { id: number; nama: string; aktif: boolean } | null;
    direktori: {
        wilayah: KepengurusanEntry[];
        komsat: Record<string, KepengurusanEntry[]>;
    };
    filters: { periode_id: string; komsat_id: string };
    options: {
        periode: { id: number; nama: string; aktif: boolean }[];
        komsat: { id: number; kode: string; nama: string }[];
    };
};

function initials(name: string): string {
    return name
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('');
}

export function formatWhatsAppNumber(phone: string): string {
    const digits = phone.replace(/\D/g, '');
    if (digits.startsWith('0')) {
        return `62${digits.slice(1)}`;
    }
    return digits;
}

export function ContactsDisplay({
    no_hp,
    instagram,
    email,
    kontak,
}: {
    no_hp?: string | null;
    instagram?: string | null;
    email?: string | null;
    kontak?: string | null;
}) {
    const cleanPhone = no_hp?.trim() || null;
    const cleanIg = instagram?.trim() || null;
    const cleanEmail = email?.trim() || null;
    const cleanKontak = kontak?.trim() || null;

    if (!cleanPhone && !cleanIg && !cleanEmail && !cleanKontak) {
        return null;
    }

    const waNumber = cleanPhone ? formatWhatsAppNumber(cleanPhone) : null;

    return (
        <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
            {cleanPhone && waNumber && (
                <a
                    className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-primary hover:bg-muted hover:underline"
                    href={`https://wa.me/${waNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`WhatsApp ${cleanPhone}`}
                >
                    <Phone className="size-3.5 shrink-0" />
                    <span>{cleanPhone}</span>
                </a>
            )}
            {cleanIg && (
                <a
                    className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-primary hover:bg-muted hover:underline"
                    href={`https://www.instagram.com/${cleanIg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Instagram @${cleanIg}`}
                >
                    <Instagram className="size-3.5 shrink-0" />
                    <span>@{cleanIg}</span>
                </a>
            )}
            {cleanEmail && (
                <a
                    className="inline-flex items-center gap-1 rounded-md border bg-muted/40 px-2 py-1 text-primary hover:bg-muted hover:underline"
                    href={`mailto:${cleanEmail}`}
                    aria-label={`Email ${cleanEmail}`}
                >
                    <Mail className="size-3.5 shrink-0" />
                    <span>{cleanEmail}</span>
                </a>
            )}
            {cleanKontak && (
                <span className="inline-flex items-center gap-1 rounded-md border bg-muted/30 px-2 py-1 text-muted-foreground">
                    <span>{cleanKontak}</span>
                </span>
            )}
        </div>
    );
}

export function DirektoriKepengurusanContent({
    periode,
    direktori,
    filters,
    options,
    filterUrl,
}: KepengurusanPageProps & { filterUrl: string }) {
    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        router.get(
            filterUrl,
            Object.fromEntries(new FormData(event.currentTarget)),
            { preserveState: true, replace: true },
        );
    };

    const groups = [
        ...(direktori.wilayah.length
            ? [
                  {
                      key: 'wilayah',
                      title: 'Tingkat Wilayah',
                      subtitle: 'Pengurus Wilayah GenBI Gorontalo',
                      entries: direktori.wilayah,
                  },
              ]
            : []),
        ...Object.entries(direktori.komsat).map(([code, entries]) => ({
            key: code,
            title: `Komsat ${code}`,
            subtitle: entries[0]?.komsat_nama ?? `Komisariat ${code}`,
            entries,
        })),
    ];

    return (
        <div className="space-y-8">
            <header>
                <p className="text-sm font-medium text-primary">
                    Direktori Kepengurusan
                </p>
                <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                    Kepengurusan GenBI Gorontalo
                </h1>
                <p className="mt-2 max-w-2xl text-muted-foreground">
                    Struktur pengurus tingkat wilayah dan komisariat perguruan
                    tinggi mitra di Provinsi Gorontalo.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="grid gap-3 rounded-lg border bg-card p-4 sm:grid-cols-[1fr_1fr_auto]"
            >
                <select
                    name="periode_id"
                    defaultValue={filters.periode_id}
                    aria-label="Pilih periode kepengurusan"
                    className="h-11 rounded-md border bg-background px-3 text-sm md:h-9"
                >
                    {options.periode.length === 0 ? (
                        <option value="">Belum ada periode</option>
                    ) : (
                        options.periode.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama}
                                {item.aktif ? ' (Periode Aktif)' : ' (Arsip)'}
                            </option>
                        ))
                    )}
                </select>
                <select
                    name="komsat_id"
                    defaultValue={filters.komsat_id}
                    aria-label="Pilih lingkup atau komisariat"
                    className="h-11 rounded-md border bg-background px-3 text-sm md:h-9"
                >
                    <option value="">Semua lingkup</option>
                    <option value="wilayah">Tingkat Wilayah</option>
                    {options.komsat.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.kode} - {item.nama}
                        </option>
                    ))}
                </select>
                <Button type="submit" className="h-11 md:h-9">
                    <Search className="size-4" />
                    Terapkan
                </Button>
            </form>

            {periode && (
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span>
                        Menampilkan periode{' '}
                        <span className="font-medium text-foreground">
                            {periode.nama}
                        </span>
                    </span>
                    {periode.aktif ? (
                        <span className="rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            Periode Aktif
                        </span>
                    ) : (
                        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            Arsip Periode
                        </span>
                    )}
                </div>
            )}

            {groups.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        {periode
                            ? 'Belum ada data kepengurusan untuk pilihan periode dan lingkup ini.'
                            : 'Belum ada data kepengurusan periode aktif yang dipublikasikan.'}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-5 lg:grid-cols-2">
                    {groups.map((group) => (
                        <Card key={group.key}>
                            <CardHeader>
                                <CardTitle>{group.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    {group.subtitle}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {group.entries.map((entry) => (
                                    <div
                                        key={entry.id}
                                        className="flex items-start justify-between gap-4 border-b pb-3 last:border-0 last:pb-0"
                                    >
                                        <div className="flex min-w-0 items-start gap-3">
                                            {entry.foto_url ? (
                                                <img
                                                    src={entry.foto_url}
                                                    alt={`Foto ${entry.nama_tampil}`}
                                                    className="size-12 shrink-0 rounded-full object-cover ring-2 ring-primary/15"
                                                />
                                            ) : (
                                                <div
                                                    aria-hidden="true"
                                                    className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-semibold text-primary-foreground"
                                                >
                                                    {initials(
                                                        entry.nama_tampil,
                                                    )}
                                                </div>
                                            )}
                                            <div className="min-w-0">
                                                <p className="font-medium">
                                                    {entry.nama_tampil}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {entry.jabatan}
                                                </p>
                                                {entry.komsat_nama && (
                                                    <p className="text-xs text-muted-foreground">
                                                        {entry.komsat_nama}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <ContactsDisplay
                                            no_hp={entry.no_hp}
                                            instagram={entry.instagram}
                                            email={entry.email}
                                            kontak={entry.kontak}
                                        />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function Kepengurusan(props: KepengurusanPageProps) {
    return (
        <>
            <Head title="Kepengurusan" />
            <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <DirektoriKepengurusanContent
                    {...props}
                    filterUrl={kepengurusan().url}
                />
            </div>
        </>
    );
}

Kepengurusan.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);

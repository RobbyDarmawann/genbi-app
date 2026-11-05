import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Instagram,
    Mail,
    MessageSquare,
    Phone,
    RotateCw,
    Search,
} from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RevealSection } from '@/components/ui/reveal-section';
import PublicLayout from '@/layouts/public-layout';
import { cn } from '@/lib/utils';
import { kepengurusan } from '@/routes/public';

export type KepengurusanEntry = {
    id: number;
    nama_tampil: string;
    jabatan: string;
    urutan?: number;
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
    const cleanIg = instagram?.trim().replace(/^@+/, '') || null;
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

function KepengurusanPlayingCard({
    entry,
    size = 'standard',
}: {
    entry: KepengurusanEntry;
    size?: 'featured' | 'medium' | 'standard';
}) {
    const [isFlipped, setIsFlipped] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const cleanPhone = entry.no_hp?.trim() || null;
    const cleanIg = entry.instagram?.trim().replace(/^@+/, '') || null;
    const cleanEmail = entry.email?.trim() || null;
    const cleanKontak = entry.kontak?.trim() || null;
    const hasContacts = Boolean(
        cleanPhone || cleanIg || cleanEmail || cleanKontak,
    );
    const waNumber = cleanPhone ? formatWhatsAppNumber(cleanPhone) : null;

    // Aktifkan flip jika diklik/tap ATAU di-hover dengan mouse pada desktop
    const showBack = isFlipped || isHovered;

    const handlePointerEnter = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'mouse') {
            setIsHovered(true);
        }
    };

    const handlePointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
        if (e.pointerType === 'mouse') {
            setIsHovered(false);
        }
    };

    const toggleFlipped = () => {
        setIsFlipped((prev) => !prev);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Escape' && (isFlipped || isHovered)) {
            event.preventDefault();
            setIsFlipped(false);
            setIsHovered(false);
            return;
        }

        if (
            event.target === event.currentTarget &&
            (event.key === 'Enter' || event.key === ' ')
        ) {
            event.preventDefault();
            toggleFlipped();
        }
    };

    return (
        <div
            role="button"
            tabIndex={0}
            aria-pressed={isFlipped}
            aria-label={`Buka kontak ${entry.nama_tampil}`}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onClick={(event) => {
                if (
                    !(event.target as HTMLElement).closest(
                        'a, button, input, select, textarea',
                    )
                ) {
                    toggleFlipped();
                }
            }}
            onKeyDown={handleKeyDown}
            className={cn(
                'perspective-1000 relative z-10 w-full select-none',
                size === 'featured' && 'mx-auto max-w-[270px] sm:max-w-[290px]',
                size === 'medium' && 'mx-auto max-w-[240px] sm:max-w-[255px]',
                size === 'standard' && 'mx-auto max-w-[225px] sm:max-w-[235px]',
            )}
        >
            <div
                data-flipped={showBack}
                className="flip-card-inner preserve-3d relative aspect-[3/4] w-full rounded-2xl shadow-sm transition-transform duration-500 ease-out"
            >
                {/* SISI DEPAN */}
                <div
                    aria-hidden={showBack}
                    onClick={(event) => {
                        event.stopPropagation();
                        toggleFlipped();
                    }}
                    className="flip-face-front absolute inset-0 flex cursor-pointer flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs transition-shadow backface-hidden hover:shadow-md"
                >
                    {entry.foto_url ? (
                        <img
                            src={entry.foto_url}
                            alt={`Foto ${entry.nama_tampil}`}
                            loading="lazy"
                            className="absolute inset-0 size-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                    ) : (
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-primary via-[oklch(0.32_0.15_262)] to-[oklch(0.22_0.10_262)] p-6 text-white"
                        >
                            <div
                                className={cn(
                                    'flex items-center justify-center rounded-full border-2 border-white/25 bg-white/10 font-bold tracking-wider text-white shadow-inner backdrop-blur-xs',
                                    size === 'featured'
                                        ? 'size-24 text-3xl'
                                        : size === 'medium'
                                          ? 'size-20 text-2xl'
                                          : 'size-16 text-xl',
                                )}
                            >
                                {initials(entry.nama_tampil)}
                            </div>
                        </div>
                    )}

                    {/* Top badge corner */}
                    <div className="relative z-10 flex items-center justify-between p-3">
                        <span className="inline-flex items-center rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs">
                            {entry.komsat_kode
                                ? `Komsat ${entry.komsat_kode}`
                                : 'Wilayah'}
                        </span>
                        <button
                            type="button"
                            tabIndex={showBack ? -1 : 0}
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleFlipped();
                            }}
                            aria-label={`Lihat kontak ${entry.nama_tampil}`}
                            className="inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] font-medium text-white backdrop-blur-xs transition hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                        >
                            <RotateCw className="size-3" />
                            <span>Kontak</span>
                        </button>
                    </div>

                    {/* Pita bawah gradasi gelap */}
                    <div className="relative z-10 mt-auto bg-gradient-to-t from-black/90 via-black/70 to-transparent p-4 pt-12 text-white">
                        <p
                            className={cn(
                                'line-clamp-2 leading-snug font-bold text-white',
                                size === 'featured' ? 'text-lg' : 'text-base',
                            )}
                        >
                            {entry.nama_tampil}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-xs font-medium text-white/90">
                            {entry.jabatan}
                        </p>
                        {entry.komsat_nama && (
                            <p className="mt-1 truncate text-[11px] text-white/75">
                                {entry.komsat_nama}
                            </p>
                        )}
                    </div>
                </div>

                {/* SISI BELAKANG */}
                <div
                    aria-hidden={!showBack}
                    className="flip-face-back absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-primary/40 bg-[oklch(0.24_0.11_262)] p-4 text-white shadow-md backface-hidden"
                >
                    <div className="border-b border-white/15 pb-2.5">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="line-clamp-1 text-sm font-bold text-white">
                                    {entry.nama_tampil}
                                </p>
                                <p className="line-clamp-1 text-xs font-medium text-white/80">
                                    {entry.jabatan}
                                </p>
                            </div>
                            <button
                                type="button"
                                tabIndex={showBack ? 0 : -1}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    toggleFlipped();
                                }}
                                aria-label="Tutup kontak dan balik kartu ke depan"
                                className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                            >
                                <RotateCw className="size-3.5" />
                            </button>
                        </div>
                        {entry.komsat_nama && (
                            <p className="mt-0.5 truncate text-[11px] text-white/65">
                                {entry.komsat_nama}
                            </p>
                        )}
                    </div>

                    <div className="my-auto space-y-2 py-2 text-xs">
                        {!hasContacts ? (
                            <div className="rounded-lg border border-white/15 bg-white/5 px-3 py-4 text-center text-xs text-white/80">
                                Kontak belum ditambahkan
                            </div>
                        ) : (
                            <>
                                {cleanPhone && waNumber && (
                                    <a
                                        href={`https://wa.me/${waNumber}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        tabIndex={showBack ? 0 : -1}
                                        aria-label={`WhatsApp ${cleanPhone}`}
                                        className="flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    >
                                        <Phone className="size-3.5 shrink-0 text-white/85" />
                                        <span className="truncate font-medium">
                                            {cleanPhone}
                                        </span>
                                    </a>
                                )}
                                {cleanIg && (
                                    <a
                                        href={`https://www.instagram.com/${cleanIg}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        tabIndex={showBack ? 0 : -1}
                                        aria-label={`Instagram @${cleanIg}`}
                                        className="flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    >
                                        <Instagram className="size-3.5 shrink-0 text-white/85" />
                                        <span className="truncate font-medium">
                                            @{cleanIg}
                                        </span>
                                    </a>
                                )}
                                {cleanEmail && (
                                    <a
                                        href={`mailto:${cleanEmail}`}
                                        tabIndex={showBack ? 0 : -1}
                                        aria-label={`Email ${cleanEmail}`}
                                        className="flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2 text-white transition-colors hover:bg-white/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                                    >
                                        <Mail className="size-3.5 shrink-0 text-white/85" />
                                        <span className="truncate font-medium">
                                            {cleanEmail}
                                        </span>
                                    </a>
                                )}
                                {cleanKontak && (
                                    <div className="flex items-center gap-2.5 rounded-lg bg-white/10 px-3 py-2 text-white/90">
                                        <MessageSquare className="size-3.5 shrink-0 text-white/80" />
                                        <span className="truncate">
                                            {cleanKontak}
                                        </span>
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/15 pt-2 text-[11px] text-white/75">
                        <span>GenBI Gorontalo</span>
                        <span className="inline-flex items-center gap-1">
                            <RotateCw className="size-3" />
                            Balik kartu
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function OrgChartGroup({
    title,
    subtitle,
    entries,
}: {
    title: string;
    subtitle: string;
    entries: KepengurusanEntry[];
}) {
    const tier1 = entries[0] ?? null;
    const tier2 = entries.slice(1, 4);
    const tier3 = entries.slice(4);

    return (
        <RevealSection className="rounded-2xl border border-border/80 bg-card p-5 shadow-2xs sm:p-8">
            <div className="mb-8 border-b pb-4 text-center">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    <Building2 className="size-3.5" />
                    <span>Struktur Organisasi</span>
                </div>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {title}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {/* Mobile Vertical Rail Layout (< 768px) */}
            <div className="relative ml-3 border-l-2 border-primary/30 pl-5 md:hidden">
                <div className="space-y-6">
                    {tier1 && (
                        <div className="relative">
                            <span
                                aria-hidden="true"
                                className="absolute top-8 -left-[27px] size-3.5 rounded-full border-2 border-background bg-primary ring-2 ring-primary/30"
                            />
                            <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
                                Pimpinan Utama
                            </p>
                            <KepengurusanPlayingCard
                                entry={tier1}
                                size="featured"
                            />
                        </div>
                    )}

                    {tier2.map((entry) => (
                        <div key={entry.id} className="relative">
                            <span
                                aria-hidden="true"
                                className="absolute top-8 -left-[25px] size-2.5 rounded-full border-2 border-background bg-primary/80"
                            />
                            <KepengurusanPlayingCard
                                entry={entry}
                                size="medium"
                            />
                        </div>
                    ))}

                    {tier3.map((entry) => (
                        <div key={entry.id} className="relative">
                            <span
                                aria-hidden="true"
                                className="absolute top-8 -left-[25px] size-2.5 rounded-full border-2 border-background bg-muted-foreground/50"
                            />
                            <KepengurusanPlayingCard
                                entry={entry}
                                size="standard"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop Hierarchical Org-Chart (>= 768px) */}
            <div className="hidden md:block">
                {/* Tier 1: Puncak */}
                {tier1 && (
                    <div className="relative flex flex-col items-center">
                        <KepengurusanPlayingCard
                            entry={tier1}
                            size="featured"
                        />
                        {(tier2.length > 0 || tier3.length > 0) && (
                            <div
                                aria-hidden="true"
                                className="relative z-0 h-8 w-0.5 bg-border"
                            />
                        )}
                    </div>
                )}

                {/* Tier 2: Maksimal 3 kartu sejajar */}
                {tier2.length > 0 && (
                    <div className="relative flex flex-col items-center">
                        <div
                            className={cn(
                                'grid w-full max-w-4xl',
                                tier2.length === 1 && 'grid-cols-1',
                                tier2.length === 2 && 'grid-cols-2',
                                tier2.length >= 3 && 'grid-cols-3',
                            )}
                        >
                            {tier2.map((entry, idx) => (
                                <div
                                    key={entry.id}
                                    className="relative flex flex-col items-center px-3"
                                >
                                    {tier2.length > 1 && (
                                        <div
                                            aria-hidden="true"
                                            className={cn(
                                                'absolute top-0 z-0 h-0.5 bg-border',
                                                idx === 0 && 'right-0 left-1/2',
                                                idx === tier2.length - 1 &&
                                                    'right-1/2 left-0',
                                                idx > 0 &&
                                                    idx < tier2.length - 1 &&
                                                    'inset-x-0',
                                            )}
                                        />
                                    )}
                                    <div
                                        aria-hidden="true"
                                        className="relative z-0 h-6 w-0.5 bg-border"
                                    />
                                    <KepengurusanPlayingCard
                                        entry={entry}
                                        size="medium"
                                    />
                                </div>
                            ))}
                        </div>
                        {tier3.length > 0 && (
                            <div
                                aria-hidden="true"
                                className="relative z-0 h-8 w-0.5 bg-border"
                            />
                        )}
                    </div>
                )}

                {/* Tier 3: Grid Pengurus Lainnya */}
                {tier3.length > 0 && (
                    <div className="relative flex flex-col items-center">
                        <div
                            aria-hidden="true"
                            className="relative z-0 h-0.5 w-3/4 bg-border"
                        />
                        <div className="grid w-full gap-x-5 gap-y-6 md:grid-cols-3 lg:grid-cols-4">
                            {tier3.map((entry) => (
                                <div
                                    key={entry.id}
                                    className="relative flex flex-col items-center"
                                >
                                    <div
                                        aria-hidden="true"
                                        className="relative z-0 h-5 w-0.5 bg-border"
                                    />
                                    <KepengurusanPlayingCard
                                        entry={entry}
                                        size="standard"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </RevealSection>
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
            <header className="space-y-2">
                <p className="text-sm font-semibold text-primary">
                    Direktori Kepengurusan
                </p>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                    Kepengurusan GenBI Gorontalo
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Bagan struktur pengurus tingkat wilayah dan komisariat
                    perguruan tinggi mitra di Provinsi Gorontalo. Ketuk atau
                    arahkan kursor pada kartu untuk membalik kartu dan melihat
                    kontak pengurus.
                </p>
            </header>

            <form
                onSubmit={submit}
                className="grid gap-3 rounded-xl border bg-card p-4 shadow-2xs sm:grid-cols-[1fr_1fr_auto]"
            >
                <select
                    name="periode_id"
                    defaultValue={filters.periode_id}
                    aria-label="Pilih periode kepengurusan"
                    className="h-11 rounded-md border bg-background px-3 text-sm text-foreground md:h-9"
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
                    className="h-11 rounded-md border bg-background px-3 text-sm text-foreground md:h-9"
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
                        <span className="font-semibold text-foreground">
                            {periode.nama}
                        </span>
                    </span>
                    {periode.aktif ? (
                        <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                            Periode Aktif
                        </span>
                    ) : (
                        <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
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
                <div className="space-y-10">
                    {groups.map((group) => (
                        <OrgChartGroup
                            key={group.key}
                            title={group.title}
                            subtitle={group.subtitle}
                            entries={group.entries}
                        />
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

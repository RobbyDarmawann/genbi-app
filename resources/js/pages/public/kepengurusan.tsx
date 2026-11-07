import { Head, router } from '@inertiajs/react';
import {
    Building2,
    Instagram,
    Mail,
    MessageSquare,
    Phone,
    RotateCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
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
    periode_terpilih: { id: number; nama: string; aktif: boolean } | null;
    daftar_periode: {
        id: number;
        nama: string;
        label: string;
        aktif: boolean;
        jumlah_pengurus: number;
    }[];
    direktori: {
        wilayah: KepengurusanEntry[];
        komsat: Record<string, KepengurusanEntry[]>;
    };
    komsat_tersedia: { kode: string; nama: string }[];
    filters: { periode: string; lingkup: string };
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
    groupKey,
    title,
    subtitle,
    entries,
}: {
    groupKey: string;
    title: string;
    subtitle: string;
    entries: KepengurusanEntry[];
}) {
    // BAGIAN 1: Deteksi Pembina untuk kelompok Wilayah
    const isWilayah = groupKey === 'wilayah';

    let puncak: KepengurusanEntry[] = [];
    let tier1: KepengurusanEntry | null = null;
    let tier2: KepengurusanEntry[] = [];
    let tier3: KepengurusanEntry[] = [];

    if (isWilayah) {
        // Kumpulkan SEMUA Pembina (pertahankan urutan simpan)
        const semuaPembina = entries.filter((e) =>
            e.jabatan.trim().toLowerCase().startsWith('pembina'),
        );

        // Kumpulkan semua non-Pembina
        const nonPembina = entries.filter(
            (e) => !e.jabatan.trim().toLowerCase().startsWith('pembina'),
        );

        if (semuaPembina.length > 0) {
            // Ada Pembina: ketua = non-Pembina pertama
            const ketua = nonPembina[0];

            if (ketua) {
                // puncak = [ketua, ...semuaPembina] (Ketua Umum KIRI, Pembina KANAN)
                puncak = [ketua, ...semuaPembina];
                tier2 = nonPembina.slice(1, 4);
                tier3 = nonPembina.slice(4);
            } else {
                // Edge case: hanya ada Pembina tanpa ketua
                tier1 = semuaPembina[0] ?? null;
            }
        } else {
            // Tidak ada Pembina: pakai pemotongan lama
            tier1 = entries[0] ?? null;
            tier2 = entries.slice(1, 4);
            tier3 = entries.slice(4);
        }
    } else {
        // Kelompok Komsat: pemotongan lama tidak berubah
        tier1 = entries[0] ?? null;
        tier2 = entries.slice(1, 4);
        tier3 = entries.slice(4);
    }

    const hasDualPuncak = puncak.length === 2;

    return (
        <RevealSection
            id={`group-${groupKey}`}
            className="scroll-mt-[204px] rounded-2xl border border-border/80 bg-card p-5 shadow-2xs sm:p-8 md:scroll-mt-[142px] lg:scroll-mt-20"
        >
            <div className="-mx-5 -mt-5 mb-8 rounded-t-2xl border-b border-border/80 bg-card px-5 py-4 text-center sm:-mx-8 sm:-mt-8 sm:px-8">
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
                    {/* Puncak: strip horizontal bila dual, kartu tunggal bila single */}
                    {hasDualPuncak ? (
                        <div className="relative">
                            <span
                                aria-hidden="true"
                                className="absolute top-8 -left-[27px] size-3.5 rounded-full border-2 border-background bg-primary ring-2 ring-primary/30"
                            />
                            <p className="mb-2 text-xs font-semibold tracking-wider text-primary uppercase">
                                Pimpinan Utama
                            </p>
                            <div className="-mr-5 [scrollbar-width:none] scrollbar-thin overflow-x-auto pr-5 pb-2 [&::-webkit-scrollbar]:hidden">
                                <div className="flex gap-4">
                                    {puncak.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="w-[270px] flex-none"
                                        >
                                            <KepengurusanPlayingCard
                                                entry={entry}
                                                size="featured"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        tier1 && (
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
                        )
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
                {/* Tier 1: Puncak (dual atau single) */}
                {hasDualPuncak ? (
                    <div className="relative flex flex-col items-center">
                        <div className="flex justify-center gap-12">
                            {puncak.map((entry, idx) => (
                                <div
                                    key={entry.id}
                                    className="relative flex w-[270px] flex-col items-center sm:w-[290px]"
                                >
                                    <KepengurusanPlayingCard
                                        entry={entry}
                                        size="featured"
                                    />
                                    {(tier2.length > 0 || tier3.length > 0) && (
                                        <>
                                            <div
                                                aria-hidden="true"
                                                className="relative z-0 h-8 w-0.5 bg-border"
                                            />
                                            <div
                                                aria-hidden="true"
                                                className={cn(
                                                    'absolute bottom-0 z-0 h-0.5 bg-border',
                                                    idx === 0 &&
                                                        '-right-6 left-1/2',
                                                    idx === 1 &&
                                                        'right-1/2 -left-6',
                                                )}
                                            />
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        {(tier2.length > 0 || tier3.length > 0) && (
                            <div
                                aria-hidden="true"
                                className="relative z-0 h-8 w-0.5 bg-border"
                            />
                        )}
                    </div>
                ) : (
                    tier1 && (
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
                    )
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

function PeriodeTimelineDesktop({
    daftar_periode,
    periode_terpilih,
    onPeriodeSelect,
}: {
    daftar_periode: KepengurusanPageProps['daftar_periode'];
    periode_terpilih: KepengurusanPageProps['periode_terpilih'];
    onPeriodeSelect: (periodeId: number) => void;
}) {
    return (
        <nav
            aria-label="Linimasa Periode Kepengurusan"
            className="relative max-h-[calc(100vh-6rem)] scrollbar-thin overflow-y-auto pr-2"
        >
            <div className="relative space-y-1">
                {/* Garis vertikal netral 2px menembus titik-titik simpul */}
                <div
                    aria-hidden="true"
                    className="absolute top-4 bottom-4 left-[19px] w-[2px] bg-border"
                />
                {daftar_periode.map((periode) => {
                    const isSelected = periode.id === periode_terpilih?.id;
                    return (
                        <button
                            key={periode.id}
                            type="button"
                            onClick={() => onPeriodeSelect(periode.id)}
                            className={cn(
                                'group relative flex w-full items-start gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                isSelected && 'bg-muted/40',
                            )}
                            aria-label={`Pilih periode ${periode.label}`}
                            aria-current={isSelected ? 'page' : undefined}
                        >
                            <span className="relative z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center">
                                <span
                                    className={cn(
                                        'rounded-full transition-all duration-200',
                                        isSelected
                                            ? 'size-4 border-2 border-white bg-[#0035a0] shadow-xs ring-4 ring-[#0035a0]/30'
                                            : 'size-2.5 border border-background bg-muted-foreground/50 group-hover:scale-125 group-hover:bg-[#0035a0]',
                                    )}
                                />
                            </span>
                            <div className="min-w-0 flex-1 space-y-0.5">
                                <p
                                    className={cn(
                                        'line-clamp-2 text-sm leading-snug transition-colors',
                                        isSelected
                                            ? 'font-bold text-[#0035a0] dark:text-primary'
                                            : 'font-medium text-foreground group-hover:text-primary',
                                    )}
                                >
                                    {periode.label}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                    {periode.aktif && (
                                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                                            Aktif
                                        </span>
                                    )}
                                    <span className="text-xs text-muted-foreground tabular-nums">
                                        {periode.jumlah_pengurus} pengurus
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

function PeriodeTimelineMobile({
    daftar_periode,
    periode_terpilih,
    onPeriodeSelect,
}: {
    daftar_periode: KepengurusanPageProps['daftar_periode'];
    periode_terpilih: KepengurusanPageProps['periode_terpilih'];
    onPeriodeSelect: (periodeId: number) => void;
}) {
    return (
        <div className="rounded-xl border bg-card p-4 shadow-2xs">
            <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Linimasa Periode
            </p>
            <div className="-mx-4 scrollbar-thin overflow-x-auto px-4">
                <div
                    className="flex snap-x snap-mandatory gap-2 pb-1"
                    role="group"
                    aria-label="Pilih periode kepengurusan"
                >
                    {daftar_periode.map((periode) => {
                        const isSelected = periode.id === periode_terpilih?.id;
                        return (
                            <button
                                key={periode.id}
                                type="button"
                                onClick={() => onPeriodeSelect(periode.id)}
                                className={cn(
                                    'shrink-0 snap-start rounded-lg border-2 px-3 py-2 text-left transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                    isSelected
                                        ? 'border-[#0035a0] bg-[#0035a0] text-white shadow-sm'
                                        : 'border-border bg-background hover:border-[#0035a0]/50 hover:bg-muted',
                                )}
                                aria-label={`Pilih periode ${periode.label}`}
                                aria-current={isSelected ? 'page' : undefined}
                            >
                                <p
                                    className={cn(
                                        'text-sm leading-snug font-semibold whitespace-nowrap',
                                        isSelected
                                            ? 'text-white'
                                            : 'text-foreground',
                                    )}
                                >
                                    {periode.label}
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    {periode.aktif && (
                                        <span
                                            className={cn(
                                                'rounded-md px-1.5 py-0.5 text-[10px] font-semibold',
                                                isSelected
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-primary/10 text-primary',
                                            )}
                                        >
                                            Aktif
                                        </span>
                                    )}
                                    <span
                                        className={cn(
                                            'text-xs tabular-nums',
                                            isSelected
                                                ? 'text-white/80'
                                                : 'text-muted-foreground',
                                        )}
                                    >
                                        {periode.jumlah_pengurus} pengurus
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

function useActiveGroupScrollspy(groups: { key: string }[]): string | null {
    const [activeKey, setActiveKey] = useState<string | null>(
        groups[0]?.key ?? null,
    );

    useEffect(() => {
        if (groups.length === 0) {
            setActiveKey(null);
            return;
        }

        setActiveKey(groups[0]?.key ?? null);

        const groupKeys = groups.map((g) => g.key);

        const elements = groupKeys
            .map((key) => ({
                key,
                element: document.getElementById(`group-${key}`),
            }))
            .filter(
                (item): item is { key: string; element: HTMLElement } =>
                    item.element !== null,
            );

        if (elements.length === 0) {
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                const intersecting = entries.filter((e) => e.isIntersecting);
                if (intersecting.length > 0) {
                    const sorted = intersecting.sort((a, b) => {
                        const topA = a.boundingClientRect.top;
                        const topB = b.boundingClientRect.top;
                        return Math.abs(topA) - Math.abs(topB);
                    });
                    const targetId = sorted[0]?.target.id;
                    if (targetId?.startsWith('group-')) {
                        setActiveKey(targetId.replace('group-', ''));
                    }
                }
            },
            {
                rootMargin: '-10% 0px -65% 0px',
                threshold: [0, 0.2, 0.5],
            },
        );

        elements.forEach(({ element }) => observer.observe(element));

        const handleScroll = () => {
            if (window.scrollY < 120 && groups[0]) {
                setActiveKey(groups[0].key);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener('scroll', handleScroll);
        };
    }, [groups]);

    return activeKey;
}

function AnchorJumpList({
    groups,
    activeLingkup,
    activeGroupKey,
}: {
    groups: { key: string; title: string }[];
    activeLingkup: string;
    activeGroupKey: string | null;
}) {
    const visibleGroups =
        activeLingkup === 'semua'
            ? groups
            : groups.filter((g) => g.key === activeLingkup);

    if (visibleGroups.length === 0) {
        return null;
    }

    const handleJump = (key: string) => {
        const element = document.getElementById(`group-${key}`);
        if (element) {
            const reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;
            element.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });
        }
    };

    return (
        <div className="mt-6 border-t border-border pt-4">
            <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                Isi periode ini
            </p>
            <nav
                aria-label="Lompatan ke kelompok kepengurusan"
                className="mt-2 space-y-1"
            >
                {visibleGroups.map((group) => {
                    const isActive = activeGroupKey === group.key;
                    return (
                        <button
                            key={group.key}
                            type="button"
                            onClick={() => handleJump(group.key)}
                            className={cn(
                                'group relative flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                isActive
                                    ? 'bg-[#0035a0]/10 font-bold text-[#0035a0] dark:text-primary'
                                    : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                            aria-current={isActive ? 'location' : undefined}
                        >
                            <span
                                className={cn(
                                    'size-1.5 shrink-0 rounded-full transition-all duration-200',
                                    isActive
                                        ? 'scale-125 bg-[#0035a0] dark:bg-primary'
                                        : 'bg-muted-foreground/40 group-hover:bg-muted-foreground',
                                )}
                                aria-hidden="true"
                            />
                            <span className="truncate">{group.title}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}

function MobileGroupChips({
    groups,
    activeGroupKey,
}: {
    groups: { key: string; title: string }[];
    activeGroupKey: string | null;
}) {
    const handleChipClick = (key: string) => {
        const element = document.getElementById(`group-${key}`);
        if (element) {
            const reducedMotion = window.matchMedia(
                '(prefers-reduced-motion: reduce)',
            ).matches;
            element.scrollIntoView({
                behavior: reducedMotion ? 'auto' : 'smooth',
                block: 'start',
            });
        }
    };

    if (groups.length <= 1) {
        return null;
    }

    return (
        <div className="sticky top-[142px] z-30 -mx-4 border-b border-border/80 bg-background/95 backdrop-blur-sm sm:-mx-6 lg:hidden">
            <div className="scrollbar-thin overflow-x-auto px-4 py-2 sm:px-6">
                <div
                    className="flex gap-2"
                    role="group"
                    aria-label="Navigasi kelompok kepengurusan"
                >
                    {groups.map((group) => {
                        const isActive = activeGroupKey === group.key;
                        const label =
                            group.key === 'wilayah' ? 'Wilayah' : group.key;
                        return (
                            <button
                                key={group.key}
                                type="button"
                                onClick={() => handleChipClick(group.key)}
                                className={cn(
                                    'shrink-0 rounded-full border px-3.5 py-1.5 text-xs transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                                    isActive
                                        ? 'border-[#0035a0] bg-[#0035a0] font-semibold text-white shadow-xs'
                                        : 'border-border bg-background font-medium text-muted-foreground hover:border-[#0035a0]/50 hover:text-foreground',
                                )}
                                aria-current={isActive ? 'location' : undefined}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export function DirektoriKepengurusanContent({
    periode_terpilih,
    daftar_periode,
    direktori,
    komsat_tersedia,
    filters,
    filterUrl,
}: KepengurusanPageProps & { filterUrl: string }) {
    const handlePeriodeSelect = (periodeId: number) => {
        router.get(
            filterUrl,
            {
                periode: String(periodeId),
                lingkup: filters.lingkup || 'semua',
            },
            { preserveState: true, preserveScroll: true, replace: true },
        );
    };

    const handleLingkupSelect = (lingkup: string) => {
        router.get(
            filterUrl,
            {
                periode: filters.periode,
                lingkup,
            },
            { preserveState: true, preserveScroll: true, replace: true },
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

    const currentPeriode = daftar_periode.find(
        (p) => p.id === periode_terpilih?.id,
    );

    const activeLingkup = filters.lingkup || 'semua';
    const activeGroupKey = useActiveGroupScrollspy(groups);

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

            {/* Mobile: horizontal pill timeline (< lg) */}
            {daftar_periode.length > 0 && (
                <div className="lg:hidden">
                    <PeriodeTimelineMobile
                        daftar_periode={daftar_periode}
                        periode_terpilih={periode_terpilih}
                        onPeriodeSelect={handlePeriodeSelect}
                    />
                </div>
            )}

            {/* Desktop ≥ lg: Two-column layout */}
            <div className="lg:flex lg:gap-8">
                {/* Left rail: sticky vertical timeline + anchor jump list (desktop only ≥ lg) */}
                {daftar_periode.length > 0 && (
                    <aside className="hidden lg:block lg:w-[280px] lg:shrink-0">
                        <div className="sticky top-20 space-y-0">
                            <p className="mb-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Linimasa Periode
                            </p>
                            <PeriodeTimelineDesktop
                                daftar_periode={daftar_periode}
                                periode_terpilih={periode_terpilih}
                                onPeriodeSelect={handlePeriodeSelect}
                            />
                            {currentPeriode && groups.length > 0 && (
                                <AnchorJumpList
                                    groups={groups}
                                    activeLingkup={activeLingkup}
                                    activeGroupKey={activeGroupKey}
                                />
                            )}
                        </div>
                    </aside>
                )}

                {/* Right content: period context + scope chips + directory */}
                <div className="min-w-0 flex-1 space-y-6">
                    {currentPeriode && (
                        <div className="space-y-4">
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 px-4 py-3">
                                <div className="flex flex-wrap items-center gap-2 text-sm">
                                    <span className="text-muted-foreground">
                                        Periode:
                                    </span>
                                    <span className="text-base font-bold text-foreground">
                                        {currentPeriode.nama}
                                    </span>
                                    {currentPeriode.aktif ? (
                                        <span className="rounded-md bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                                            Periode Aktif
                                        </span>
                                    ) : (
                                        <span className="rounded-md bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                            Arsip Periode
                                        </span>
                                    )}
                                </div>
                                <span className="text-xs font-medium text-muted-foreground tabular-nums sm:text-sm">
                                    {currentPeriode.jumlah_pengurus} pengurus
                                    terdaftar
                                </span>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                    Pilihan Lingkup
                                </p>
                                <div
                                    className="flex flex-wrap gap-2"
                                    role="group"
                                    aria-label="Filter Lingkup Kepengurusan"
                                >
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            activeLingkup === 'semua'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            handleLingkupSelect('semua')
                                        }
                                        className={cn(
                                            'h-11 px-4 text-sm md:h-9',
                                            activeLingkup === 'semua' &&
                                                'bg-[#0035a0] text-white hover:bg-[#0035a0]/90',
                                        )}
                                    >
                                        Semua
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={
                                            activeLingkup === 'wilayah'
                                                ? 'default'
                                                : 'outline'
                                        }
                                        onClick={() =>
                                            handleLingkupSelect('wilayah')
                                        }
                                        className={cn(
                                            'h-11 px-4 text-sm md:h-9',
                                            activeLingkup === 'wilayah' &&
                                                'bg-[#0035a0] text-white hover:bg-[#0035a0]/90',
                                        )}
                                    >
                                        Wilayah
                                    </Button>
                                    {komsat_tersedia.map((komsat) => (
                                        <Button
                                            key={komsat.kode}
                                            type="button"
                                            size="sm"
                                            variant={
                                                activeLingkup === komsat.kode
                                                    ? 'default'
                                                    : 'outline'
                                            }
                                            onClick={() =>
                                                handleLingkupSelect(komsat.kode)
                                            }
                                            className={cn(
                                                'h-11 px-4 text-sm md:h-9',
                                                activeLingkup === komsat.kode &&
                                                    'bg-[#0035a0] text-white hover:bg-[#0035a0]/90',
                                            )}
                                        >
                                            {komsat.kode}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {groups.length === 0 ? (
                        <Card>
                            <CardContent className="p-8 text-center text-muted-foreground">
                                {periode_terpilih
                                    ? 'Belum ada data pengurus untuk periode dan lingkup yang dipilih.'
                                    : 'Belum ada data kepengurusan yang dipublikasikan.'}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-10">
                            {activeLingkup === 'semua' && groups.length > 1 && (
                                <MobileGroupChips
                                    groups={groups}
                                    activeGroupKey={activeGroupKey}
                                />
                            )}
                            {groups.map((group) => (
                                <OrgChartGroup
                                    key={group.key}
                                    groupKey={group.key}
                                    title={group.title}
                                    subtitle={group.subtitle}
                                    entries={group.entries}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
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

const WITA_TIMEZONE = 'Asia/Makassar';

export function formatTanggalWita(
    value: Date | string | number,
    options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    },
): string {
    const date = value instanceof Date ? value : new Date(value);

    return new Intl.DateTimeFormat('id-ID', {
        ...options,
        timeZone: WITA_TIMEZONE,
    }).format(date);
}

export function formatWaktuWita(value: Date | string | number): string {
    const date = value instanceof Date ? value : new Date(value);
    const formatted = new Intl.DateTimeFormat('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: WITA_TIMEZONE,
    }).format(date);

    return `${formatted} WITA`;
}

export function formatAngka(value: number): string {
    return new Intl.NumberFormat('id-ID').format(value);
}

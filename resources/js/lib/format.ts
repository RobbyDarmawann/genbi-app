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

export function formatRentangTanggalWita(
    mulai: string,
    selesai: string,
): string {
    const start = new Date(`${mulai}T12:00:00`);
    const end = new Date(`${selesai}T12:00:00`);
    const sameDay = mulai === selesai;
    const sameMonth =
        start.getUTCFullYear() === end.getUTCFullYear() &&
        start.getUTCMonth() === end.getUTCMonth();

    if (sameDay) {
        return formatTanggalWita(start, {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    const startOptions: Intl.DateTimeFormatOptions = sameMonth
        ? { day: 'numeric' }
        : { day: 'numeric', month: 'short' };

    return `${formatTanggalWita(start, startOptions)}–${formatTanggalWita(end, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })}`;
}

import type { SemanticStatus } from '@/components/status-badge';

export type KomsatOption = {
    id: number;
    kode: string;
    nama: string;
};

export type DivisiGroup = KomsatOption & {
    divisi: {
        id: number;
        nama: string;
    }[];
};

export type SelectOption = {
    value: string;
    label: string;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export function kegiatanStatusToSemantic(status: string): SemanticStatus {
    switch (status) {
        case 'draft':
            return 'draft';
        case 'terbit':
            return 'terbuka';
        case 'berlangsung':
            return 'aktif';
        case 'selesai':
            return 'selesai';
        case 'terkunci':
            return 'dikunci';
        case 'dibatalkan':
            return 'dibatalkan';
        default:
            return 'draft';
    }
}

export function kegiatanStatusLabel(status: string): string {
    switch (status) {
        case 'draft':
            return 'Draf';
        case 'terbit':
            return 'Terbit';
        case 'berlangsung':
            return 'Berlangsung';
        case 'selesai':
            return 'Selesai';
        case 'terkunci':
            return 'Terkunci';
        case 'dibatalkan':
            return 'Dibatalkan';
        default:
            return status;
    }
}

export function decodePaginationLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&')
        .trim();
}

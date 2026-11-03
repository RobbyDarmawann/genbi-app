export type KomsatOption = {
    id: number;
    kode: string;
    nama: string;
    aktif: boolean;
};

export type DivisiOption = {
    id: number;
    komsat_id: number;
    nama: string;
    aktif: boolean;
};

export type StatusPenerimaValue = 'penerima' | 'non_penerima' | 'alumni';

export type StatusPenerimaOption = {
    value: StatusPenerimaValue;
    label: string;
};

export type MahasiswaCounts = {
    pendaftaran: number;
    poin_transaksi: number;
    koreksi: number;
    kepengurusan: number;
};

export type MahasiswaRow = {
    id: number;
    user_id: number;
    name: string;
    username: string;
    nim: string;
    angkatan: string;
    status_penerima: StatusPenerimaValue;
    status_penerima_label: string;
    aktif: boolean;
    total_poin: number;
    komsat_id: number;
    divisi_id: number;
    komsat: { id: number; kode: string; nama: string } | null;
    divisi: {
        id: number;
        komsat_id: number;
        nama: string;
        aktif: boolean;
    } | null;
    counts: MahasiswaCounts;
    terikat: boolean;
    created_at?: string | null;
};

export type RiwayatPoinItem = {
    id: number;
    tipe: 'kredit' | 'koreksi';
    jumlah: number;
    keterangan: string;
    kegiatan_nama: string | null;
    created_at: string | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

const numberFormatter = new Intl.NumberFormat('id-ID');

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Makassar',
});

export function formatPoin(value: number): string {
    return numberFormatter.format(value);
}

export function formatTanggalWaktu(iso: string | null | undefined): string {
    if (!iso) {
        return '—';
    }

    return `${dateTimeFormatter.format(new Date(iso))} WITA`;
}

export function decodePaginationLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '«')
        .replace(/&raquo;/g, '»')
        .replace(/&amp;/g, '&');
}

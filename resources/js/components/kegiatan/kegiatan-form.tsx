import { Form, Link } from '@inertiajs/react';
import { AlertTriangle, Check, MapPin, Search } from 'lucide-react';
import { useState } from 'react';
import LeafletPicker from '@/components/kegiatan/leaflet-picker';
import AdminKegiatanController from '@/actions/App/Http/Controllers/Admin/KegiatanController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';

type Option = { id: number; kode: string; nama: string };
type DivisiGroup = Option & { divisi: { id: number; nama: string }[] };
type LokasiOption = {
    id: number;
    nama: string;
    latitude: number;
    longitude: number;
    radius_m: number;
    keterangan: string | null;
};
type Activity = {
    id: number;
    lokasi_id?: number | null;
    judul: string;
    deskripsi: string | null;
    komsat_id: number | null;
    lokasi_nama: string;
    latitude: string;
    longitude: string;
    radius_m: number;
    tanggal: string;
    tanggal_selesai: string | null;
    jam_mulai: string;
    jam_selesai: string;
    sesi_absensi: { tanggal: string; jam_buka: string; jam_tutup: string }[];
    pendaftaran_dibuka_at: string | null;
    batas_daftar_at: string | null;
    kuota: number | null;
    status: string;
    divisi_ids: number[];
    bobot: Record<string, number>;
};

type AttendanceSession = {
    tanggal: string;
    jam_buka: string;
    jam_tutup: string;
};

function dateRange(start: string, end: string): string[] {
    if (!start) {
        return [];
    }

    const dates: string[] = [];
    const current = new Date(`${start}T12:00:00`);
    const last = new Date(`${end || start}T12:00:00`);

    while (current <= last) {
        dates.push(current.toISOString().slice(0, 10));
        current.setDate(current.getDate() + 1);
    }

    return dates;
}

function sessionLabel(date: string): string {
    return new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date(`${date}T12:00:00`));
}
type Props = {
    record?: Activity;
    komsatOptions: Option[];
    lokasiOptions?: LokasiOption[];
    divisiGroups: DivisiGroup[];
    statusOptions: { value: string; label: string }[];
    peringatanKehadiran?: boolean;
    cancelHref: string;
};

export function KegiatanForm({
    record,
    komsatOptions,
    lokasiOptions = [],
    divisiGroups,
    statusOptions,
    peringatanKehadiran,
    cancelHref,
}: Props) {
    const [lokasiId, setLokasiId] = useState<string>(
        record?.lokasi_id ? String(record.lokasi_id) : 'manual',
    );
    const [lokasiDialogOpen, setLokasiDialogOpen] = useState(false);
    const [lokasiSearchQuery, setLokasiSearchQuery] = useState('');
    const [lokasiNama, setLokasiNama] = useState<string>(
        record?.lokasi_nama ?? '',
    );
    const [selectedDivisi, setSelectedDivisi] = useState<number[]>(
        record?.divisi_ids ?? [],
    );
    const [latitude, setLatitude] = useState<number>(
        record?.latitude ? parseFloat(String(record.latitude)) : 0.5435442,
    );
    const [longitude, setLongitude] = useState<number>(
        record?.longitude ? parseFloat(String(record.longitude)) : 123.0567972,
    );
    const [radius, setRadius] = useState<number>(record?.radius_m ?? 100);
    const [tanggal, setTanggal] = useState(record?.tanggal ?? '');
    const [tanggalSelesai, setTanggalSelesai] = useState(
        record?.tanggal_selesai ?? '',
    );
    const [sessions, setSessions] = useState<AttendanceSession[]>(() => {
        const saved = new Map(
            (record?.sesi_absensi ?? []).map((session) => [
                session.tanggal,
                session,
            ]),
        );
        return dateRange(
            record?.tanggal ?? '',
            record?.tanggal_selesai ?? '',
        ).map(
            (date) =>
                saved.get(date) ?? {
                    tanggal: date,
                    jam_buka: '07:30',
                    jam_tutup: '12:30',
                },
        );
    });
    const locationLocked = Boolean(record && peringatanKehadiran);
    const selectedLokasiMaster =
        lokasiId !== 'manual' && lokasiId !== ''
            ? (lokasiOptions.find(
                  (item) => String(item.id) === String(lokasiId),
              ) ?? null)
            : null;
    const filteredLokasiOptions = lokasiOptions.filter((item) =>
        item.nama
            .toLowerCase()
            .includes(lokasiSearchQuery.trim().toLowerCase()),
    );
    const pilihLokasi = (value: string) => {
        setLokasiId(value);
        const master = lokasiOptions.find((item) => String(item.id) === value);

        if (master) {
            setLokasiNama(master.nama);
            setLatitude(master.latitude);
            setLongitude(master.longitude);
            setRadius(master.radius_m);
        }

        setLokasiDialogOpen(false);
    };
    const endpoint = record
        ? AdminKegiatanController.update.form(record.id)
        : AdminKegiatanController.store.form();
    const updateSession = (
        index: number,
        changes: Partial<AttendanceSession>,
    ) => {
        setSessions((current) =>
            current.map((session, sessionIndex) =>
                sessionIndex === index ? { ...session, ...changes } : session,
            ),
        );
    };
    const setAllSessionTimes = (
        jamBuka: string | undefined,
        jamTutup: string | undefined,
    ) => {
        setSessions((current) =>
            current.map((session) => ({
                ...session,
                ...(jamBuka === undefined ? {} : { jam_buka: jamBuka }),
                ...(jamTutup === undefined ? {} : { jam_tutup: jamTutup }),
            })),
        );
    };
    return (
        <Form
            {...endpoint}
            options={{ preserveScroll: true }}
            className="min-w-0 space-y-6"
        >
            {({ errors, processing }) => (
                <>
                    {peringatanKehadiran && (
                        <div className="flex gap-3 rounded-lg border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
                            <AlertTriangle
                                className="mt-0.5 size-4 shrink-0"
                                aria-hidden="true"
                            />
                            <p>
                                Kegiatan telah memiliki kehadiran valid. Titik
                                lokasi, radius, dan bobot poin tidak dapat
                                diubah.
                            </p>
                        </div>
                    )}
                    <section className="grid min-w-0 grid-cols-1 gap-4 rounded-lg border p-4 sm:p-6">
                        <h2 className="text-lg font-semibold">
                            Informasi kegiatan
                        </h2>
                        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2">
                            <Field
                                label="Judul kegiatan"
                                name="judul"
                                error={errors.judul}
                                defaultValue={record?.judul}
                                required
                            />
                            <div className="grid gap-2">
                                <Label htmlFor="komsat_id">
                                    Penyelenggara (opsional)
                                </Label>
                                <Select
                                    name="komsat_id"
                                    defaultValue={
                                        record?.komsat_id
                                            ? String(record.komsat_id)
                                            : 'wilayah'
                                    }
                                >
                                    <SelectTrigger
                                        id="komsat_id"
                                        className="h-11 md:h-9"
                                    >
                                        <SelectValue placeholder="Pilih penyelenggara" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wilayah">
                                            Wilayah GenBI Gorontalo
                                        </SelectItem>
                                        {komsatOptions.map((item) => (
                                            <SelectItem
                                                key={item.id}
                                                value={String(item.id)}
                                            >
                                                {item.kode} — {item.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.komsat_id} />
                            </div>
                            <div className="grid gap-2 md:col-span-2">
                                <Label htmlFor="deskripsi">Deskripsi</Label>
                                <textarea
                                    id="deskripsi"
                                    name="deskripsi"
                                    defaultValue={record?.deskripsi ?? ''}
                                    rows={4}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                />
                                <InputError message={errors.deskripsi} />
                            </div>
                            <Field
                                label="Nama lokasi"
                                name="lokasi_nama"
                                error={errors.lokasi_nama}
                                value={lokasiNama}
                                onChange={(event) =>
                                    setLokasiNama(event.target.value)
                                }
                                required
                            />
                            <Field
                                label="Tanggal"
                                name="tanggal"
                                type="date"
                                error={errors.tanggal}
                                value={tanggal}
                                onChange={(event) => {
                                    const next = event.target.value;
                                    setTanggal(next);
                                    const saved = new Map(
                                        sessions.map((session) => [
                                            session.tanggal,
                                            session,
                                        ]),
                                    );
                                    setSessions(
                                        dateRange(next, tanggalSelesai).map(
                                            (date) =>
                                                saved.get(date) ?? {
                                                    tanggal: date,
                                                    jam_buka: '07:30',
                                                    jam_tutup: '12:30',
                                                },
                                        ),
                                    );
                                }}
                                required
                            />
                            <Field
                                label="Tanggal selesai"
                                name="tanggal_selesai"
                                type="date"
                                error={errors.tanggal_selesai}
                                value={tanggalSelesai}
                                onChange={(event) => {
                                    const next = event.target.value;
                                    setTanggalSelesai(next);
                                    const saved = new Map(
                                        sessions.map((session) => [
                                            session.tanggal,
                                            session,
                                        ]),
                                    );
                                    setSessions(
                                        dateRange(tanggal, next).map(
                                            (date) =>
                                                saved.get(date) ?? {
                                                    tanggal: date,
                                                    jam_buka: '07:30',
                                                    jam_tutup: '12:30',
                                                },
                                        ),
                                    );
                                }}
                            />
                            <Field
                                label="Jam mulai"
                                name="jam_mulai"
                                type="time"
                                error={errors.jam_mulai}
                                defaultValue={record?.jam_mulai?.slice(0, 5)}
                                required
                            />
                            <Field
                                label="Jam selesai"
                                name="jam_selesai"
                                type="time"
                                error={errors.jam_selesai}
                                defaultValue={record?.jam_selesai?.slice(0, 5)}
                                required
                            />
                        </div>
                    </section>
                    <section className="grid min-w-0 grid-cols-1 gap-4 rounded-lg border p-4 sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Lokasi dan absensi
                            </h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Klik pada peta untuk memilih titik pusat
                                geofence.
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sumber_lokasi_trigger">
                                Sumber lokasi
                            </Label>
                            <input
                                type="hidden"
                                name="lokasi_id"
                                value={lokasiId === 'manual' ? '' : lokasiId}
                            />
                            {selectedLokasiMaster ? (
                                <div className="flex flex-col gap-3 rounded-lg border bg-muted/20 p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 items-start gap-3">
                                        <div className="shrink-0 rounded-md border bg-background p-2 text-primary">
                                            <MapPin className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-foreground">
                                                    {selectedLokasiMaster.nama}
                                                </p>
                                                <span className="shrink-0 rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-medium text-primary">
                                                    Master Lokasi
                                                </span>
                                            </div>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Radius bawaan:{' '}
                                                {selectedLokasiMaster.radius_m}{' '}
                                                m
                                                {selectedLokasiMaster.keterangan
                                                    ? ` • ${selectedLokasiMaster.keterangan}`
                                                    : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        id="sumber_lokasi_trigger"
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-11 shrink-0 md:h-9"
                                        onClick={() => {
                                            setLokasiSearchQuery('');
                                            setLokasiDialogOpen(true);
                                        }}
                                        disabled={locationLocked}
                                    >
                                        Ganti
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 rounded-lg border border-dashed p-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground">
                                            Input manual
                                        </p>
                                        <p className="mt-0.5 text-xs text-muted-foreground">
                                            Titik koordinat dan radius
                                            ditentukan bebas pada peta atau
                                            input di bawah.
                                        </p>
                                    </div>
                                    <Button
                                        id="sumber_lokasi_trigger"
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="h-11 shrink-0 md:h-9"
                                        onClick={() => {
                                            setLokasiSearchQuery('');
                                            setLokasiDialogOpen(true);
                                        }}
                                        disabled={locationLocked}
                                    >
                                        <MapPin className="size-4" />
                                        <span>Pilih dari daftar lokasi</span>
                                    </Button>
                                </div>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Data lokasi disalin ke kegiatan; titik dan
                                radius tetap dapat disesuaikan untuk kegiatan
                                ini saja.
                            </p>
                            <InputError message={errors.lokasi_id} />
                        </div>

                        <Dialog
                            open={lokasiDialogOpen}
                            onOpenChange={setLokasiDialogOpen}
                        >
                            <DialogContent className="flex max-h-[85vh] max-w-lg flex-col gap-0 overflow-hidden p-0">
                                <DialogHeader className="border-b p-4 pb-3">
                                    <DialogTitle>
                                        Pilih Lokasi Kegiatan
                                    </DialogTitle>
                                    <DialogDescription>
                                        Pilih titik lokasi dari daftar master
                                        data atau gunakan mode input manual.
                                    </DialogDescription>
                                    <div className="relative mt-3">
                                        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                        <Input
                                            placeholder="Cari nama lokasi..."
                                            value={lokasiSearchQuery}
                                            onChange={(event) =>
                                                setLokasiSearchQuery(
                                                    event.target.value,
                                                )
                                            }
                                            className="h-10 pl-9"
                                            autoFocus
                                        />
                                    </div>
                                </DialogHeader>

                                <div className="flex-1 space-y-2 overflow-y-auto p-4">
                                    <button
                                        type="button"
                                        onClick={() => pilihLokasi('manual')}
                                        className={`flex w-full items-start justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                                            lokasiId === 'manual' || !lokasiId
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border'
                                        }`}
                                    >
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-foreground">
                                                Input manual
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Tentukan nama lokasi, titik
                                                koordinat, dan radius secara
                                                bebas tanpa menautkan master
                                                data.
                                            </p>
                                        </div>
                                        {(lokasiId === 'manual' ||
                                            !lokasiId) && (
                                            <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                        )}
                                    </button>

                                    <div className="pt-2 pb-1">
                                        <span className="text-[11px] font-semibold tracking-wider text-muted-foreground uppercase">
                                            Daftar Lokasi Master (
                                            {filteredLokasiOptions.length})
                                        </span>
                                    </div>

                                    {filteredLokasiOptions.length === 0 ? (
                                        <div className="py-8 text-center text-sm text-muted-foreground">
                                            Tidak ada lokasi yang cocok dengan
                                            &quot;{lokasiSearchQuery}&quot;.
                                        </div>
                                    ) : (
                                        filteredLokasiOptions.map((item) => {
                                            const isSelected =
                                                String(item.id) ===
                                                String(lokasiId);
                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() =>
                                                        pilihLokasi(
                                                            String(item.id),
                                                        )
                                                    }
                                                    className={`flex w-full items-start justify-between gap-3 rounded-lg border p-3 text-left transition-colors hover:bg-accent ${
                                                        isSelected
                                                            ? 'border-primary bg-primary/5'
                                                            : 'border-border'
                                                    }`}
                                                >
                                                    <div className="min-w-0 space-y-1">
                                                        <p className="text-sm leading-tight font-semibold text-foreground">
                                                            {item.nama}
                                                        </p>
                                                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
                                                            <span>
                                                                Radius:{' '}
                                                                {item.radius_m}{' '}
                                                                m
                                                            </span>
                                                            <span>•</span>
                                                            <span className="font-mono text-[11px] opacity-75">
                                                                {Number(
                                                                    item.latitude,
                                                                ).toFixed(6)}
                                                                ,{' '}
                                                                {Number(
                                                                    item.longitude,
                                                                ).toFixed(6)}
                                                            </span>
                                                        </div>
                                                        {item.keterangan && (
                                                            <p className="line-clamp-2 text-xs text-muted-foreground">
                                                                {
                                                                    item.keterangan
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                    {isSelected && (
                                                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                                                    )}
                                                </button>
                                            );
                                        })
                                    )}
                                </div>

                                <DialogFooter className="border-t bg-muted/20 p-3 sm:justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setLokasiDialogOpen(false)
                                        }
                                    >
                                        Tutup
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                        <LeafletPicker
                            latitude={latitude}
                            longitude={longitude}
                            radius={radius}
                            readOnly={locationLocked}
                            onLocationChange={
                                locationLocked
                                    ? undefined
                                    : (lat, lng) => {
                                          setLatitude(lat);
                                          setLongitude(lng);
                                      }
                            }
                        />
                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <Field
                                label="Latitude"
                                name="latitude"
                                type="number"
                                step="any"
                                error={errors.latitude}
                                value={latitude}
                                onChange={
                                    locationLocked
                                        ? undefined
                                        : (e) =>
                                              setLatitude(
                                                  parseFloat(e.target.value) ||
                                                      0,
                                              )
                                }
                                required
                            />
                            <Field
                                label="Longitude"
                                name="longitude"
                                type="number"
                                step="any"
                                error={errors.longitude}
                                value={longitude}
                                onChange={
                                    locationLocked
                                        ? undefined
                                        : (e) =>
                                              setLongitude(
                                                  parseFloat(e.target.value) ||
                                                      0,
                                              )
                                }
                                required
                            />
                            <Field
                                label="Radius (meter)"
                                name="radius_m"
                                type="number"
                                error={errors.radius_m}
                                value={radius}
                                onChange={
                                    locationLocked
                                        ? undefined
                                        : (e) =>
                                              setRadius(
                                                  parseInt(e.target.value) || 0,
                                              )
                                }
                                required
                            />
                            <Field
                                label="Kuota (opsional)"
                                name="kuota"
                                type="number"
                                error={errors.kuota}
                                defaultValue={record?.kuota}
                            />
                            <Field
                                label="Pendaftaran dibuka"
                                name="pendaftaran_dibuka_at"
                                type="datetime-local"
                                error={errors.pendaftaran_dibuka_at}
                                defaultValue={record?.pendaftaran_dibuka_at}
                            />
                            <Field
                                label="Batas daftar"
                                name="batas_daftar_at"
                                type="datetime-local"
                                error={errors.batas_daftar_at}
                                defaultValue={record?.batas_daftar_at}
                            />
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-3 rounded-md border p-3 sm:p-4">
                            <div className="flex min-w-0 flex-wrap items-end justify-between gap-3">
                                <div>
                                    <h3 className="font-medium">
                                        Jadwal absensi per hari
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Kosongkan tanggal selesai bila kegiatan
                                        hanya satu hari.
                                    </p>
                                </div>
                                <div className="grid w-full min-w-0 grid-cols-2 items-end gap-2 sm:w-auto">
                                    <div className="grid min-w-0 gap-1">
                                        <Label htmlFor="jam_semua_buka">
                                            Jam untuk semua hari
                                        </Label>
                                        <Input
                                            id="jam_semua_buka"
                                            type="time"
                                            className="h-11 w-full min-w-0 sm:w-32 md:h-9"
                                            onChange={(event) =>
                                                setAllSessionTimes(
                                                    event.target.value,
                                                    undefined,
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="grid min-w-0 gap-1">
                                        <Label htmlFor="jam_semua_tutup">
                                            Jam tutup
                                        </Label>
                                        <Input
                                            id="jam_semua_tutup"
                                            type="time"
                                            className="h-11 w-full min-w-0 sm:w-32 md:h-9"
                                            onChange={(event) =>
                                                setAllSessionTimes(
                                                    undefined,
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {sessions.map((session, index) => (
                                <div
                                    key={session.tanggal}
                                    className="grid min-w-0 grid-cols-2 gap-3 rounded-md bg-muted/40 p-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem]"
                                >
                                    <div className="col-span-2 flex min-w-0 items-center text-sm font-medium md:col-span-1">
                                        {sessionLabel(session.tanggal)}
                                        <input
                                            type="hidden"
                                            name={`sesi_absensi[${index}][tanggal]`}
                                            value={session.tanggal}
                                            readOnly
                                        />
                                    </div>
                                    <Field
                                        label="Jam buka"
                                        name={`sesi_absensi[${index}][jam_buka]`}
                                        type="time"
                                        value={session.jam_buka}
                                        error={
                                            errors[
                                                `sesi_absensi.${index}.jam_buka`
                                            ]
                                        }
                                        onChange={(event) =>
                                            updateSession(index, {
                                                jam_buka: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                    <Field
                                        label="Jam tutup"
                                        name={`sesi_absensi[${index}][jam_tutup]`}
                                        type="time"
                                        value={session.jam_tutup}
                                        error={
                                            errors[
                                                `sesi_absensi.${index}.jam_tutup`
                                            ]
                                        }
                                        onChange={(event) =>
                                            updateSession(index, {
                                                jam_tutup: event.target.value,
                                            })
                                        }
                                        required
                                    />
                                </div>
                            ))}
                            <InputError message={errors.sesi_absensi} />
                        </div>
                    </section>
                    <section className="grid min-w-0 grid-cols-1 gap-4 rounded-lg border p-4 sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Target divisi
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Pilih divisi aktif yang menjadi sasaran
                                kegiatan.
                            </p>
                        </div>
                        {divisiGroups.map((group) => (
                            <fieldset key={group.id} className="grid gap-2">
                                <legend className="font-medium">
                                    {group.kode} — {group.nama}
                                </legend>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {group.divisi.map((divisi) => (
                                        <label
                                            key={divisi.id}
                                            className="flex min-h-11 items-center gap-3 rounded-md border px-3"
                                        >
                                            <input
                                                type="checkbox"
                                                name="divisi_ids[]"
                                                value={divisi.id}
                                                checked={selectedDivisi.includes(
                                                    divisi.id,
                                                )}
                                                onChange={(event) =>
                                                    setSelectedDivisi(
                                                        event.target.checked
                                                            ? [
                                                                  ...selectedDivisi,
                                                                  divisi.id,
                                                              ]
                                                            : selectedDivisi.filter(
                                                                  (id) =>
                                                                      id !==
                                                                      divisi.id,
                                                              ),
                                                    )
                                                }
                                            />
                                            {divisi.nama}
                                        </label>
                                    ))}
                                </div>
                            </fieldset>
                        ))}
                        <InputError message={errors.divisi_ids} />
                    </section>
                    <section className="grid min-w-0 grid-cols-1 gap-4 rounded-lg border p-4 sm:p-6">
                        <div>
                            <h2 className="text-lg font-semibold">
                                Bobot poin peran
                            </h2>
                            <p className="text-sm text-muted-foreground">
                                Bobot peserta wajib ditetapkan sebelum kegiatan
                                diterbitkan.
                            </p>
                        </div>
                        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                            <Field
                                label="Peserta"
                                name="bobot[peserta]"
                                type="number"
                                min="0"
                                error={errors['bobot.peserta']}
                                defaultValue={record?.bobot.peserta ?? ''}
                            />
                            <Field
                                label="Panitia"
                                name="bobot[panitia]"
                                type="number"
                                min="0"
                                error={errors['bobot.panitia']}
                                defaultValue={record?.bobot.panitia ?? ''}
                            />
                            <Field
                                label="Pemateri"
                                name="bobot[pemateri]"
                                type="number"
                                min="0"
                                error={errors['bobot.pemateri']}
                                defaultValue={record?.bobot.pemateri ?? ''}
                            />
                        </div>
                        <div className="grid gap-2 md:max-w-sm">
                            <Label htmlFor="status">Status kegiatan</Label>
                            <Select
                                name="status"
                                defaultValue={record?.status ?? 'draft'}
                            >
                                <SelectTrigger
                                    id="status"
                                    className="h-11 md:h-9"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusOptions
                                        .filter((option) => {
                                            if (!record) {
                                                return option.value === 'draft';
                                            }
                                            if (record.status === 'draft') {
                                                return (
                                                    option.value !== 'terbit' &&
                                                    option.value !== 'terkunci'
                                                );
                                            }
                                            return (
                                                option.value !== 'terkunci' ||
                                                record.status === 'selesai' ||
                                                record.status === 'terkunci'
                                            );
                                        })
                                        .map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </section>
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            asChild
                            className="h-11 md:h-9"
                        >
                            <Link href={cancelHref}>Batal</Link>
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="h-11 md:h-9"
                        >
                            {processing && <Spinner />}Simpan kegiatan
                        </Button>
                    </div>
                </>
            )}
        </Form>
    );
}

function Field({
    label,
    name,
    type = 'text',
    error,
    defaultValue,
    value,
    onChange,
    required = false,
    ...inputProps
}: {
    label: string;
    name: string;
    type?: string;
    error?: string;
    defaultValue?: string | number | null;
    value?: string | number;
    onChange?: React.ChangeEventHandler<HTMLInputElement>;
    required?: boolean;
    min?: string;
    step?: string;
}) {
    const controlledProps =
        value !== undefined
            ? { value, onChange }
            : { defaultValue: defaultValue ?? '' };
    return (
        <div className="grid min-w-0 gap-2">
            <Label htmlFor={name}>{label}</Label>
            <Input
                id={name}
                name={name}
                type={type}
                required={required}
                className="h-11 w-full max-w-full min-w-0 md:h-9"
                {...controlledProps}
                {...inputProps}
            />
            <InputError message={error} />
        </div>
    );
}

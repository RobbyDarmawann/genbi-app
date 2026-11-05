import { Head, Link, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    Calendar,
    Camera,
    CheckCircle2,
    Clock,
    Compass,
    MapPin,
    RefreshCw,
    ShieldCheck,
    XCircle,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AbsensiController from '@/actions/App/Http/Controllers/Mahasiswa/AbsensiController';
import MahasiswaKegiatanController from '@/actions/App/Http/Controllers/Mahasiswa/KegiatanController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { StatusBadge } from '@/components/status-badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { formatAngka, formatTanggalWita, formatWaktuWita } from '@/lib/format';

type KehadiranData = {
    id: number;
    status: 'valid' | 'menunggu_tinjau' | 'ditolak';
    status_label: string;
    alasan: string | null;
    jarak_m: number;
    akurasi_m: number;
    waktu_checkin: string;
    poin: number;
};

type Props = {
    kegiatan: {
        id: number;
        judul: string;
        tanggal: string;
        jam_mulai: string;
        jam_selesai: string;
        lokasi_nama: string;
        absensi_buka_at: string;
        absensi_tutup_at: string;
        status: string;
        status_label: string;
        radius_m: number;
        bobot_poin: number;
    };
    pendaftaran: {
        id: number;
        status: string;
        status_label: string;
        peran_label: string;
        kehadiran: KehadiranData | null;
    };
};

type GeoState =
    | { status: 'idle' }
    | { status: 'loading' }
    | {
          status: 'success';
          latitude: number;
          longitude: number;
          accuracy: number;
      }
    | { status: 'denied'; message: string }
    | { status: 'timeout'; message: string }
    | { status: 'unsupported'; message: string }
    | { status: 'error'; message: string };

type CameraState =
    | { status: 'idle' }
    | { status: 'streaming' }
    | { status: 'captured'; previewUrl: string; sizeKb: number }
    | { status: 'fallback'; reason: string };

const MAX_IMAGE_DIMENSION = 1280;
const TARGET_MAX_BYTES = 500 * 1024;

async function compressImageToJpegFile(
    source: HTMLVideoElement | HTMLImageElement,
): Promise<File> {
    const rawWidth =
        source instanceof HTMLVideoElement
            ? source.videoWidth
            : source.naturalWidth;
    const rawHeight =
        source instanceof HTMLVideoElement
            ? source.videoHeight
            : source.naturalHeight;

    const scale = Math.min(
        1,
        MAX_IMAGE_DIMENSION / Math.max(rawWidth || 1, rawHeight || 1),
    );
    const width = Math.max(1, Math.round((rawWidth || 640) * scale));
    const height = Math.max(1, Math.round((rawHeight || 480) * scale));

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('Tidak dapat memproses gambar pada browser ini.');
    }

    ctx.drawImage(source, 0, 0, width, height);

    const qualities = [0.82, 0.7, 0.58, 0.45];
    let selectedBlob: Blob | null = null;

    for (const quality of qualities) {
        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob((result) => resolve(result), 'image/jpeg', quality),
        );
        if (blob) {
            selectedBlob = blob;
            if (blob.size <= TARGET_MAX_BYTES) {
                break;
            }
        }
    }

    if (!selectedBlob) {
        throw new Error('Gagal mengompresi foto selfie.');
    }

    return new File([selectedBlob], `selfie-absensi-${Date.now()}.jpg`, {
        type: 'image/jpeg',
    });
}

function formatDurationMs(diffMs: number): string {
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
        return `${hours}j ${minutes}m ${seconds}d`;
    }
    if (minutes > 0) {
        return `${minutes}m ${seconds}d`;
    }
    return `${seconds} detik`;
}

export default function Checkin({ kegiatan, pendaftaran }: Props) {
    const [nowMs, setNowMs] = useState<number>(() => Date.now());
    const [geoState, setGeoState] = useState<GeoState>({ status: 'idle' });
    const [cameraState, setCameraState] = useState<CameraState>({
        status: 'idle',
    });
    const [cameraError, setCameraError] = useState<string | null>(null);
    const [compressing, setCompressing] = useState(false);

    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const fallbackInputRef = useRef<HTMLInputElement | null>(null);

    const form = useForm<{
        latitude: string;
        longitude: string;
        akurasi_m: string;
        foto: File | null;
    }>({
        latitude: '',
        longitude: '',
        akurasi_m: '',
        foto: null,
    });

    const pageErrors = form.errors as Record<string, string | undefined>;

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNowMs(Date.now());
        }, 1000);
        return () => window.clearInterval(timer);
    }, []);

    const stopCameraStream = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    useEffect(() => {
        return () => {
            stopCameraStream();
        };
    }, []);

    const bukaMs = new Date(kegiatan.absensi_buka_at).getTime();
    const tutupMs = new Date(kegiatan.absensi_tutup_at).getTime();
    const belumBuka = nowMs < bukaMs;
    const sudahTutup = nowMs > tutupMs;
    const dalamJendela = !belumBuka && !sudahTutup;

    const handleAmbilLokasi = () => {
        if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
            setGeoState({
                status: 'unsupported',
                message:
                    'Browser Anda tidak mendukung fitur Geolocation HTML5. Gunakan browser modern seperti Chrome atau Firefox.',
            });
            return;
        }

        setGeoState({ status: 'loading' });

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lng = position.coords.longitude;
                const acc = position.coords.accuracy;

                setGeoState({
                    status: 'success',
                    latitude: lat,
                    longitude: lng,
                    accuracy: acc,
                });

                form.setData((prev) => ({
                    ...prev,
                    latitude: String(lat),
                    longitude: String(lng),
                    akurasi_m: String(Math.round(acc * 100) / 100),
                }));
            },
            (error) => {
                if (error.code === error.PERMISSION_DENIED) {
                    setGeoState({
                        status: 'denied',
                        message:
                            'Izin akses lokasi ditolak. Aktifkan izin lokasi (GPS) untuk situs ini di pengaturan browser lalu coba lagi.',
                    });
                } else if (error.code === error.TIMEOUT) {
                    setGeoState({
                        status: 'timeout',
                        message:
                            'Waktu pengambilan lokasi habis (timeout). Pastikan GPS aktif dan Anda berada di area dengan sinyal yang baik.',
                    });
                } else {
                    setGeoState({
                        status: 'error',
                        message:
                            'Gagal memperoleh titik koordinat perangkat. Pastikan layanan lokasi perangkat Anda aktif.',
                    });
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            },
        );
    };

    const handleMulaiKamera = async () => {
        setCameraError(null);

        if (
            typeof navigator === 'undefined' ||
            !navigator.mediaDevices ||
            typeof navigator.mediaDevices.getUserMedia !== 'function'
        ) {
            setCameraState({
                status: 'fallback',
                reason: 'Kamera langsung tidak tersedia pada perangkat/browser ini. Silakan ambil foto langsung melalui tombol kamera perangkat di bawah.',
            });
            return;
        }

        try {
            stopCameraStream();
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' },
                audio: false,
            });
            streamRef.current = stream;
            setCameraState({ status: 'streaming' });

            window.requestAnimationFrame(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    void videoRef.current.play();
                }
            });
        } catch {
            setCameraState({
                status: 'fallback',
                reason: 'Tidak dapat membuka pratinjau kamera secara langsung. Gunakan tombol ambil foto kamera perangkat di bawah ini.',
            });
        }
    };

    const handleAmbilFotoDariVideo = async () => {
        if (!videoRef.current) {
            return;
        }

        setCompressing(true);
        setCameraError(null);

        try {
            const compressedFile = await compressImageToJpegFile(
                videoRef.current,
            );
            const previewUrl = URL.createObjectURL(compressedFile);
            stopCameraStream();

            form.setData('foto', compressedFile);
            setCameraState({
                status: 'captured',
                previewUrl,
                sizeKb: Math.max(1, Math.round(compressedFile.size / 1024)),
            });
        } catch (err) {
            setCameraError(
                err instanceof Error
                    ? err.message
                    : 'Gagal mengambil dan mengompresi foto.',
            );
        } finally {
            setCompressing(false);
        }
    };

    const handleFallbackFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const rawFile = event.target.files?.[0];
        if (!rawFile) {
            return;
        }

        setCompressing(true);
        setCameraError(null);

        try {
            const imgUrl = URL.createObjectURL(rawFile);
            const imageElement = await new Promise<HTMLImageElement>(
                (resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () =>
                        reject(new Error('File gambar tidak valid.'));
                    img.src = imgUrl;
                },
            );

            const compressedFile = await compressImageToJpegFile(imageElement);
            URL.revokeObjectURL(imgUrl);

            const previewUrl = URL.createObjectURL(compressedFile);
            form.setData('foto', compressedFile);
            setCameraState({
                status: 'captured',
                previewUrl,
                sizeKb: Math.max(1, Math.round(compressedFile.size / 1024)),
            });
        } catch (err) {
            setCameraError(
                err instanceof Error
                    ? err.message
                    : 'Gagal memproses foto dari kamera.',
            );
        } finally {
            setCompressing(false);
        }
    };

    const handleUlangFoto = () => {
        if (cameraState.status === 'captured') {
            URL.revokeObjectURL(cameraState.previewUrl);
        }
        form.setData('foto', null);
        void handleMulaiKamera();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.processing || pendaftaran.kehadiran !== null) {
            return;
        }

        form.post(AbsensiController.store.url(kegiatan.id), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    const kehadiran = pendaftaran.kehadiran;
    const siapKirim =
        geoState.status === 'success' &&
        form.data.foto !== null &&
        !form.processing &&
        !compressing &&
        kehadiran === null;

    return (
        <>
            <Head title={`Absensi Check-in - ${kegiatan.judul}`} />

            <div className="mx-auto max-w-3xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2">
                    <Button asChild variant="ghost" size="sm">
                        <Link
                            href={MahasiswaKegiatanController.show(kegiatan.id)}
                        >
                            <ArrowLeft className="size-4" />
                            <span>Kembali ke Detail Kegiatan</span>
                        </Link>
                    </Button>
                    <StatusBadge
                        status="terdaftar"
                        label={pendaftaran.status_label}
                    />
                </div>

                <Heading
                    title={`Check-in Absensi: ${kegiatan.judul}`}
                    description="Verifikasi kehadiran mandiri menggunakan titik lokasi perangkat dan foto selfie di lokasi kegiatan."
                />

                {/* Ringkasan Kegiatan & Jendela Absensi */}
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <CardTitle className="text-base">
                                Ringkasan Kegiatan
                            </CardTitle>
                            <span className="text-xs font-medium text-muted-foreground">
                                Peran: {pendaftaran.peran_label} (+
                                {formatAngka(kegiatan.bobot_poin)} poin)
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                            <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Tanggal & Waktu Kegiatan
                                </p>
                                <p className="text-sm font-medium">
                                    {formatTanggalWita(kegiatan.tanggal)}
                                </p>
                                <p className="text-xs text-muted-foreground tabular-nums">
                                    {kegiatan.jam_mulai} –{' '}
                                    {kegiatan.jam_selesai} WITA
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div>
                                <p className="text-xs text-muted-foreground">
                                    Lokasi & Radius Geofence
                                </p>
                                <p className="text-sm font-medium">
                                    {kegiatan.lokasi_nama}
                                </p>
                                <p className="text-xs text-muted-foreground tabular-nums">
                                    Radius maksimal{' '}
                                    {formatAngka(kegiatan.radius_m)} meter dari
                                    titik kegiatan
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 sm:col-span-2">
                            <Clock className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                    Jendela Waktu Absensi (WITA)
                                </p>
                                <p className="text-sm font-medium tabular-nums">
                                    {formatWaktuWita(kegiatan.absensi_buka_at)}{' '}
                                    s.d.{' '}
                                    {formatWaktuWita(kegiatan.absensi_tutup_at)}
                                </p>
                                {kehadiran === null && (
                                    <p className="text-xs font-medium text-primary tabular-nums">
                                        {belumBuka &&
                                            `Hitung mundur pembukaan absensi: ${formatDurationMs(bukaMs - nowMs)}`}
                                        {dalamJendela &&
                                            `Absensi sedang dibuka • Sisa waktu: ${formatDurationMs(tutupMs - nowMs)}`}
                                        {sudahTutup &&
                                            'Jendela waktu absensi telah berakhir.'}
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Satu Hasil Jelas Setelah Submit */}
                {kehadiran !== null ? (
                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    {kehadiran.status === 'valid' && (
                                        <CheckCircle2 className="size-5 text-primary" />
                                    )}
                                    {kehadiran.status === 'menunggu_tinjau' && (
                                        <AlertCircle className="size-5 text-amber-600 dark:text-amber-400" />
                                    )}
                                    {kehadiran.status === 'ditolak' && (
                                        <XCircle className="size-5 text-destructive" />
                                    )}
                                    <span>Hasil Check-in Absensi</span>
                                </CardTitle>
                                <StatusBadge
                                    status={
                                        kehadiran.status === 'valid'
                                            ? 'valid'
                                            : kehadiran.status === 'ditolak'
                                              ? 'ditolak'
                                              : 'diajukan'
                                    }
                                    label={kehadiran.status_label}
                                />
                            </div>
                            <CardDescription>
                                Tercatat pada{' '}
                                {formatWaktuWita(kehadiran.waktu_checkin)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {kehadiran.status === 'valid' && (
                                <Alert>
                                    <ShieldCheck className="size-4" />
                                    <AlertTitle>
                                        Absensi berhasil. Poin +
                                        {formatAngka(kehadiran.poin)} telah
                                        ditambahkan.
                                    </AlertTitle>
                                    <AlertDescription>
                                        Lokasi Anda berada di dalam radius
                                        kegiatan (
                                        {formatAngka(kehadiran.jarak_m)} meter
                                        dari pusat kegiatan, akurasi GPS ±
                                        {formatAngka(kehadiran.akurasi_m)}{' '}
                                        meter).
                                    </AlertDescription>
                                </Alert>
                            )}

                            {kehadiran.status === 'menunggu_tinjau' && (
                                <Alert>
                                    <AlertCircle className="size-4" />
                                    <AlertTitle>
                                        Menunggu Peninjauan Internal Manajemen
                                    </AlertTitle>
                                    <AlertDescription>
                                        {kehadiran.alasan ??
                                            'Akurasi GPS perangkat melebihi batas verifikasi otomatis (>100 meter). Kehadiran Anda telah disimpan dan menunggu peninjauan Internal Manajemen. Poin belum ditambahkan sebelum disetujui.'}
                                    </AlertDescription>
                                </Alert>
                            )}

                            {kehadiran.status === 'ditolak' && (
                                <Alert variant="destructive">
                                    <XCircle className="size-4" />
                                    <AlertTitle>Absensi Ditolak</AlertTitle>
                                    <AlertDescription>
                                        {kehadiran.alasan ??
                                            `Titik lokasi Anda berada di luar radius kegiatan (${formatAngka(kehadiran.jarak_m)} meter dari titik kegiatan).`}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button
                                    asChild
                                    variant="outline"
                                    className="h-11 md:h-9"
                                >
                                    <Link
                                        href={MahasiswaKegiatanController.show(
                                            kegiatan.id,
                                        )}
                                    >
                                        Kembali ke Detail Kegiatan
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {pageErrors.absensi && (
                            <Alert variant="destructive">
                                <AlertCircle className="size-4" />
                                <AlertTitle>
                                    Absensi Tidak Dapat Diproses
                                </AlertTitle>
                                <AlertDescription>
                                    {pageErrors.absensi}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Langkah 1: Lokasi Geolocation */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    1. Ambil Titik Lokasi (GPS)
                                </CardTitle>
                                <CardDescription>
                                    Pastikan Anda sudah berada di lokasi
                                    kegiatan sebelum menekan tombol ambil
                                    lokasi.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex flex-wrap items-center gap-3">
                                    <Button
                                        type="button"
                                        variant={
                                            geoState.status === 'success'
                                                ? 'outline'
                                                : 'default'
                                        }
                                        className="h-11 w-full sm:w-auto md:h-9"
                                        onClick={handleAmbilLokasi}
                                        disabled={
                                            geoState.status === 'loading' ||
                                            form.processing
                                        }
                                    >
                                        {geoState.status === 'loading' ? (
                                            <Spinner />
                                        ) : (
                                            <Compass className="size-4" />
                                        )}
                                        <span>
                                            {geoState.status === 'loading'
                                                ? 'Meminta izin & mengambil lokasi...'
                                                : geoState.status === 'success'
                                                  ? 'Perbarui Lokasi GPS'
                                                  : 'Ambil Lokasi Saya'}
                                        </span>
                                    </Button>
                                </div>

                                {geoState.status === 'loading' && (
                                    <p className="text-sm text-muted-foreground">
                                        Meminta izin lokasi perangkat. Pilih
                                        &ldquo;Izinkan&rdquo; (Allow) jika
                                        muncul dialog pada browser Anda...
                                    </p>
                                )}

                                {geoState.status === 'success' && (
                                    <div className="space-y-1 rounded-md border bg-muted/40 p-3 text-sm">
                                        <p className="font-medium text-foreground">
                                            Lokasi diperoleh dengan akurasi ±
                                            {formatAngka(
                                                Math.round(geoState.accuracy),
                                            )}{' '}
                                            meter
                                        </p>
                                        <p className="text-xs text-muted-foreground tabular-nums">
                                            Koordinat:{' '}
                                            {geoState.latitude.toFixed(6)},{' '}
                                            {geoState.longitude.toFixed(6)}
                                        </p>
                                        {geoState.accuracy > 100 && (
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                Catatan: Akurasi GPS di atas 100
                                                meter akan memerlukan peninjauan
                                                Internal Manajemen. Anda dapat
                                                menekan &ldquo;Perbarui Lokasi
                                                GPS&rdquo; di area terbuka untuk
                                                sinyal lebih akurat.
                                            </p>
                                        )}
                                    </div>
                                )}

                                {(geoState.status === 'denied' ||
                                    geoState.status === 'timeout' ||
                                    geoState.status === 'unsupported' ||
                                    geoState.status === 'error') && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="size-4" />
                                        <AlertTitle>
                                            {geoState.status === 'denied' &&
                                                'Izin Lokasi Ditolak'}
                                            {geoState.status === 'timeout' &&
                                                'Waktu Pengambilan Lokasi Habis'}
                                            {geoState.status ===
                                                'unsupported' &&
                                                'Browser Tidak Mendukung Geolocation'}
                                            {geoState.status === 'error' &&
                                                'Gagal Mengambil Lokasi'}
                                        </AlertTitle>
                                        <AlertDescription>
                                            {geoState.message}
                                        </AlertDescription>
                                    </Alert>
                                )}

                                <InputError
                                    message={
                                        form.errors.latitude ||
                                        form.errors.longitude
                                    }
                                />
                                <InputError message={form.errors.akurasi_m} />
                            </CardContent>
                        </Card>

                        {/* Langkah 2: Kamera Selfie */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    2. Ambil Foto Selfie Kehadiran
                                </CardTitle>
                                <CardDescription>
                                    Ambil foto wajah Anda secara langsung di
                                    lokasi kegiatan sebagai bukti kehadiran.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {cameraState.status === 'idle' && (
                                    <Button
                                        type="button"
                                        className="h-11 w-full sm:w-auto md:h-9"
                                        onClick={() => void handleMulaiKamera()}
                                        disabled={form.processing}
                                    >
                                        <Camera className="size-4" />
                                        <span>Buka Kamera Selfie</span>
                                    </Button>
                                )}

                                {cameraState.status === 'streaming' && (
                                    <div className="space-y-3">
                                        <div className="max-w-md overflow-hidden rounded-lg border bg-black">
                                            <video
                                                ref={videoRef}
                                                autoPlay
                                                playsInline
                                                muted
                                                className="aspect-4/3 w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            <Button
                                                type="button"
                                                className="h-11 w-full sm:w-auto md:h-9"
                                                onClick={() =>
                                                    void handleAmbilFotoDariVideo()
                                                }
                                                disabled={compressing}
                                            >
                                                {compressing ? (
                                                    <Spinner />
                                                ) : (
                                                    <Camera className="size-4" />
                                                )}
                                                <span>Ambil Foto</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {cameraState.status === 'captured' && (
                                    <div className="space-y-3">
                                        <div className="max-w-md overflow-hidden rounded-lg border">
                                            <img
                                                src={cameraState.previewUrl}
                                                alt="Pratinjau foto selfie absensi"
                                                className="aspect-4/3 w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex max-w-md flex-wrap items-center justify-between gap-2">
                                            <span className="text-xs text-muted-foreground tabular-nums">
                                                Format JPEG terkompresi (
                                                {formatAngka(
                                                    cameraState.sizeKb,
                                                )}{' '}
                                                KB)
                                            </span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="h-11 md:h-9"
                                                onClick={handleUlangFoto}
                                                disabled={
                                                    form.processing ||
                                                    compressing
                                                }
                                            >
                                                <RefreshCw className="size-4" />
                                                <span>Ambil Ulang Foto</span>
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {cameraState.status === 'fallback' && (
                                    <div className="space-y-3">
                                        <p className="text-sm text-muted-foreground">
                                            {cameraState.reason}
                                        </p>
                                        <input
                                            ref={fallbackInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            onChange={(e) =>
                                                void handleFallbackFileChange(e)
                                            }
                                            className="hidden"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="h-11 w-full sm:w-auto md:h-9"
                                            onClick={() =>
                                                fallbackInputRef.current?.click()
                                            }
                                            disabled={
                                                compressing || form.processing
                                            }
                                        >
                                            {compressing ? (
                                                <Spinner />
                                            ) : (
                                                <Camera className="size-4" />
                                            )}
                                            <span>
                                                Ambil Foto dengan Kamera
                                                Perangkat
                                            </span>
                                        </Button>
                                    </div>
                                )}

                                {cameraError && (
                                    <InputError message={cameraError} />
                                )}
                                <InputError message={form.errors.foto} />
                            </CardContent>
                        </Card>

                        {/* Langkah 3: Kirim Absensi */}
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-muted-foreground">
                                Foto bukti kehadiran disimpan secara privat dan
                                hanya dapat diakses oleh Anda serta Divisi
                                Internal Manajemen.
                            </p>
                            <Button
                                type="submit"
                                className="h-11 w-full sm:w-auto md:h-9"
                                disabled={!siapKirim}
                            >
                                {form.processing && <Spinner />}
                                <span>Kirim Check-in Absensi</span>
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

Checkin.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>;

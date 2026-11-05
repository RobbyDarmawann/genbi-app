<?php

namespace Database\Seeders;

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusPendaftaran;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Komsat;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TrenDemoSeeder extends Seeder
{
    /**
     * Seeder opsional untuk menambahkan riwayat partisipasi bulanan demo (Juni - September 2026)
     * agar panel Proyeksi Tren per Komsat menghasilkan angka proyeksi (n >= 4).
     *
     * Seeder ini idempoten, tanpa kehadiran baru, dan tanpa transaksi poin baru.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $internalUser = User::where('username', 'internal')->firstOrFail();

            $ung = Komsat::where('kode', 'UNG')->firstOrFail();
            $iain = Komsat::where('kode', 'IAIN')->firstOrFail();
            $ug = Komsat::where('kode', 'UG')->firstOrFail();
            $umgo = Komsat::where('kode', 'UMGO')->firstOrFail();
            $ubm = Komsat::where('kode', 'UBM')->firstOrFail();

            $divisiTargetIds = Divisi::whereIn('komsat_id', [$ung->id, $iain->id, $ug->id, $umgo->id, $ubm->id])
                ->where('aktif', true)
                ->pluck('id')
                ->all();

            // Peta mahasiswa demo berdasarkan username
            $mahasiswaMap = Mahasiswa::whereHas('user', function ($q) {
                $q->whereIn('username', [
                    'mhs001', 'mhs002', 'mhs003', 'mhs004',
                    'mhs005', 'mhs006', 'mhs007', 'mhs008',
                    'mhs009', 'mhs010', 'mhs011', 'mhs012',
                    'mhs013', 'mhs014', 'mhs015',
                ]);
            })->with('user')->get()->keyBy(fn (Mahasiswa $m) => $m->user->username);

            $tz = config('app.timezone', 'Asia/Makassar');

            // 4 Kegiatan Tambahan Demo Tren (Juni, Juli, Agustus, September 2026)
            $kegiatanData = [
                [
                    'judul' => 'Workshop Metodologi Riset dan Karya Ilmiah Mahasiswa (Demo Tren)',
                    'deskripsi' => 'Penguatan metodologi penulisan karya tulis ilmiah dan publikasi mahasiswa penerima beasiswa.',
                    'tanggal' => '2026-06-15',
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '12:00:00',
                    'absensi_buka_at' => Carbon::parse('2026-06-15 07:30:00', $tz),
                    'absensi_tutup_at' => Carbon::parse('2026-06-15 12:30:00', $tz),
                    'pendaftaran_dibuka_at' => Carbon::parse('2026-06-01 08:00:00', $tz),
                    'batas_daftar_at' => Carbon::parse('2026-06-14 23:59:00', $tz),
                    'pendaftar' => [
                        'mhs005', // IAIN (1)
                        'mhs008', // UG (1)
                    ],
                ],
                [
                    'judul' => 'Seminar Literasi Keuangan Digital dan QRIS Nasional (Demo Tren)',
                    'deskripsi' => 'Sosialisasi adopsi pembayaran digital berbasis QRIS di lingkungan kampus se-Gorontalo.',
                    'tanggal' => '2026-07-15',
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '12:00:00',
                    'absensi_buka_at' => Carbon::parse('2026-07-15 07:30:00', $tz),
                    'absensi_tutup_at' => Carbon::parse('2026-07-15 12:30:00', $tz),
                    'pendaftaran_dibuka_at' => Carbon::parse('2026-07-01 08:00:00', $tz),
                    'batas_daftar_at' => Carbon::parse('2026-07-14 23:59:00', $tz),
                    'pendaftar' => [
                        'mhs001', // UNG (1)
                        'mhs005', // IAIN (1)
                        'mhs011', // UMGO (1)
                        'mhs014', // UBM (1)
                    ],
                ],
                [
                    'judul' => 'Pelatihan Jurnalisme Warga dan Desain Konten Edukatif (Demo Tren)',
                    'deskripsi' => 'Pengembangan kompetensi pembuatan konten edukatif kebanksentralan untuk media sosial GenBI.',
                    'tanggal' => '2026-08-15',
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '12:00:00',
                    'absensi_buka_at' => Carbon::parse('2026-08-15 07:30:00', $tz),
                    'absensi_tutup_at' => Carbon::parse('2026-08-15 12:30:00', $tz),
                    'pendaftaran_dibuka_at' => Carbon::parse('2026-08-01 08:00:00', $tz),
                    'batas_daftar_at' => Carbon::parse('2026-08-14 23:59:00', $tz),
                    'pendaftar' => [
                        'mhs001', // UNG (2)
                        'mhs002', // UNG
                        'mhs005', // IAIN (1)
                        'mhs008', // UG (1)
                        'mhs011', // UMGO (1)
                    ],
                ],
                [
                    'judul' => 'Bina Desa: Penguatan Kapasitas UMKM Lokal Gorontalo (Demo Tren)',
                    'deskripsi' => 'Program pengabdian masyarakat pembinaan pembukuan keuangan sederhana bagi pelaku usaha mikro.',
                    'tanggal' => '2026-09-15',
                    'jam_mulai' => '08:00:00',
                    'jam_selesai' => '12:00:00',
                    'absensi_buka_at' => Carbon::parse('2026-09-15 07:30:00', $tz),
                    'absensi_tutup_at' => Carbon::parse('2026-09-15 12:30:00', $tz),
                    'pendaftaran_dibuka_at' => Carbon::parse('2026-09-01 08:00:00', $tz),
                    'batas_daftar_at' => Carbon::parse('2026-09-14 23:59:00', $tz),
                    'pendaftar' => [
                        'mhs001', // UNG (3)
                        'mhs002', // UNG
                        'mhs003', // UNG
                        'mhs005', // IAIN (2)
                        'mhs006', // IAIN
                        'mhs008', // UG (1)
                        'mhs011', // UMGO (1)
                        'mhs014', // UBM (1)
                    ],
                ],
            ];

            foreach ($kegiatanData as $kegiatanItem) {
                $kegiatan = Kegiatan::updateOrCreate(
                    ['judul' => $kegiatanItem['judul']],
                    [
                        'deskripsi' => $kegiatanItem['deskripsi'],
                        'komsat_id' => null, // Lingkup Wilayah
                        'lokasi_nama' => 'Aula Kantor Perwakilan BI Gorontalo (Demo Tren)',
                        'latitude' => '0.5402000',
                        'longitude' => '123.0601000',
                        'radius_m' => 150,
                        'tanggal' => $kegiatanItem['tanggal'],
                        'jam_mulai' => $kegiatanItem['jam_mulai'],
                        'jam_selesai' => $kegiatanItem['jam_selesai'],
                        'absensi_buka_at' => $kegiatanItem['absensi_buka_at'],
                        'absensi_tutup_at' => $kegiatanItem['absensi_tutup_at'],
                        'pendaftaran_dibuka_at' => $kegiatanItem['pendaftaran_dibuka_at'],
                        'batas_daftar_at' => $kegiatanItem['batas_daftar_at'],
                        'kuota' => 50,
                        'status' => StatusKegiatan::Terbit, // Efektif Selesai karena di masa lalu
                        'dibuat_oleh' => $internalUser->id,
                    ]
                );

                $kegiatan->divisiTarget()->syncWithoutDetaching($divisiTargetIds);

                $this->seedBobotKegiatan($kegiatan, 10, 20, 30);

                foreach ($kegiatanItem['pendaftar'] as $username) {
                    $mahasiswa = $mahasiswaMap->get($username);
                    if ($mahasiswa !== null) {
                        Pendaftaran::updateOrCreate(
                            [
                                'kegiatan_id' => $kegiatan->id,
                                'mahasiswa_id' => $mahasiswa->id,
                            ],
                            [
                                'peran' => PeranKegiatan::Peserta,
                                'status' => StatusPendaftaran::Terdaftar,
                            ]
                        );
                    }
                }
            }

            $this->command?->info('✓ TrenDemoSeeder selesai: 4 kegiatan demo tren (Juni - September 2026) dan 19 pendaftaran peserta berhasil ditambahkan.');
        });
    }

    private function seedBobotKegiatan(Kegiatan $kegiatan, int $peserta, int $panitia, int $pemateri): void
    {
        KegiatanBobot::updateOrCreate(
            ['kegiatan_id' => $kegiatan->id, 'peran' => PeranKegiatan::Peserta],
            ['poin' => $peserta]
        );
        KegiatanBobot::updateOrCreate(
            ['kegiatan_id' => $kegiatan->id, 'peran' => PeranKegiatan::Panitia],
            ['poin' => $panitia]
        );
        KegiatanBobot::updateOrCreate(
            ['kegiatan_id' => $kegiatan->id, 'peran' => PeranKegiatan::Pemateri],
            ['poin' => $pemateri]
        );
    }
}

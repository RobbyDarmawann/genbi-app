<?php

namespace Database\Seeders;

use App\Enums\JenisKoreksi;
use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusKoreksi;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Enums\SumberKehadiran;
use App\Enums\TipePoin;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Kehadiran;
use App\Models\Kepengurusan;
use App\Models\Komsat;
use App\Models\Koreksi;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\PoinTransaksi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    private ?User $internalUser = null;

    private ?Periode $periodeDemo = null;

    /**
     * Seed data demo UAS yang idempoten dan konsisten.
     * Data ini terpisah dari master data production.
     */
    public function run(): void
    {
        DB::transaction(function () {
            $this->internalUser = User::where('username', 'internal')->firstOrFail();

            $this->seedPeriodeDemo();
            $this->seedDivisiDemo();
            $mahasiswaList = $this->seedMahasiswaDemo();
            $this->seedKepengurusanDemo($mahasiswaList);
            $this->seedKegiatanDemo($mahasiswaList);

            $this->command?->info('✓ DemoSeeder selesai: periode demo, divisi, 15 mahasiswa, kepengurusan, dan 8 kegiatan dengan pendaftaran/kehadiran/poin.');
        });
    }

    private function seedPeriodeDemo(): void
    {
        $this->periodeDemo = Periode::updateOrCreate(
            ['nama' => 'Periode Demo UAS 2026'],
            [
                'tanggal_mulai' => Carbon::now(config('app.timezone'))->startOfYear()->toDateString(),
                'tanggal_selesai' => Carbon::now(config('app.timezone'))->endOfYear()->toDateString(),
                'aktif' => true,
            ]
        );
    }

    private function seedDivisiDemo(): void
    {
        $genericDivisiNames = [
            'Divisi Pendidikan (Demo)',
            'Divisi Kewirausahaan (Demo)',
            'Divisi Kesehatan Masyarakat (Demo)',
        ];

        $komsats = Komsat::where('kode', '!=', 'UNG')->get();

        foreach ($komsats as $komsat) {
            foreach ($genericDivisiNames as $nama) {
                Divisi::updateOrCreate(
                    [
                        'komsat_id' => $komsat->id,
                        'nama' => $nama,
                    ],
                    [
                        'aktif' => true,
                    ]
                );
            }
        }
    }

    /**
     * @return array<string, Mahasiswa>
     */
    private function seedMahasiswaDemo(): array
    {
        $ung = Komsat::where('kode', 'UNG')->firstOrFail();
        $iain = Komsat::where('kode', 'IAIN')->firstOrFail();
        $ug = Komsat::where('kode', 'UG')->firstOrFail();
        $umgo = Komsat::where('kode', 'UMGO')->firstOrFail();
        $ubm = Komsat::where('kode', 'UBM')->firstOrFail();

        $divUngPendidikan = Divisi::where('komsat_id', $ung->id)->where('nama', 'Pendidikan')->firstOrFail();
        $divUngKewirausahaan = Divisi::where('komsat_id', $ung->id)->where('nama', 'Kewirausahaan')->firstOrFail();
        $divUngKominfo = Divisi::where('komsat_id', $ung->id)->where('nama', 'Kominfo')->firstOrFail();
        $divUngKesmas = Divisi::where('komsat_id', $ung->id)->where('nama', 'Kesehatan Masyarakat')->firstOrFail();

        $divIainPendidikan = Divisi::where('komsat_id', $iain->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divIainKewirausahaan = Divisi::where('komsat_id', $iain->id)->where('nama', 'Divisi Kewirausahaan (Demo)')->firstOrFail();
        $divIainKesmas = Divisi::where('komsat_id', $iain->id)->where('nama', 'Divisi Kesehatan Masyarakat (Demo)')->firstOrFail();

        $divUgPendidikan = Divisi::where('komsat_id', $ug->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divUgKewirausahaan = Divisi::where('komsat_id', $ug->id)->where('nama', 'Divisi Kewirausahaan (Demo)')->firstOrFail();
        $divUgKesmas = Divisi::where('komsat_id', $ug->id)->where('nama', 'Divisi Kesehatan Masyarakat (Demo)')->firstOrFail();

        $divUmgoPendidikan = Divisi::where('komsat_id', $umgo->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divUmgoKewirausahaan = Divisi::where('komsat_id', $umgo->id)->where('nama', 'Divisi Kewirausahaan (Demo)')->firstOrFail();
        $divUmgoKesmas = Divisi::where('komsat_id', $umgo->id)->where('nama', 'Divisi Kesehatan Masyarakat (Demo)')->firstOrFail();

        $divUbmPendidikan = Divisi::where('komsat_id', $ubm->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divUbmKewirausahaan = Divisi::where('komsat_id', $ubm->id)->where('nama', 'Divisi Kewirausahaan (Demo)')->firstOrFail();

        $demoStudentsData = [
            ['username' => 'mhs001', 'name' => 'Aditia Pratama (Demo)', 'email' => 'mhs001@genbigto.test', 'komsat_id' => $ung->id, 'divisi_id' => $divUngPendidikan->id, 'nim' => 'UNG2024001', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs002', 'name' => 'Bella Nurhaliza (Demo)', 'email' => 'mhs002@genbigto.test', 'komsat_id' => $ung->id, 'divisi_id' => $divUngKewirausahaan->id, 'nim' => 'UNG2024002', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs003', 'name' => 'Candra Wijaya (Demo)', 'email' => 'mhs003@genbigto.test', 'komsat_id' => $ung->id, 'divisi_id' => $divUngKominfo->id, 'nim' => 'UNG2023003', 'angkatan' => '2023', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs004', 'name' => 'Dian Kusuma (Demo)', 'email' => 'mhs004@genbigto.test', 'komsat_id' => $ung->id, 'divisi_id' => $divUngKesmas->id, 'nim' => 'UNG2024004', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs005', 'name' => 'Eka Ramadhani (Demo)', 'email' => 'mhs005@genbigto.test', 'komsat_id' => $iain->id, 'divisi_id' => $divIainPendidikan->id, 'nim' => 'IAIN2024005', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs006', 'name' => 'Fajar Hidayat (Demo)', 'email' => 'mhs006@genbigto.test', 'komsat_id' => $iain->id, 'divisi_id' => $divIainKewirausahaan->id, 'nim' => 'IAIN2023006', 'angkatan' => '2023', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs007', 'name' => 'Gita Lestari (Demo)', 'email' => 'mhs007@genbigto.test', 'komsat_id' => $iain->id, 'divisi_id' => $divIainKesmas->id, 'nim' => 'IAIN2024007', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs008', 'name' => 'Hendra Saputra (Demo)', 'email' => 'mhs008@genbigto.test', 'komsat_id' => $ug->id, 'divisi_id' => $divUgPendidikan->id, 'nim' => 'UG2024008', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs009', 'name' => 'Indah Permata (Demo)', 'email' => 'mhs009@genbigto.test', 'komsat_id' => $ug->id, 'divisi_id' => $divUgKewirausahaan->id, 'nim' => 'UG2023009', 'angkatan' => '2023', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs010', 'name' => 'Joko Santoso (Demo)', 'email' => 'mhs010@genbigto.test', 'komsat_id' => $ug->id, 'divisi_id' => $divUgKesmas->id, 'nim' => 'UG2024010', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs011', 'name' => 'Kartika Sari (Demo)', 'email' => 'mhs011@genbigto.test', 'komsat_id' => $umgo->id, 'divisi_id' => $divUmgoPendidikan->id, 'nim' => 'UMGO2024011', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs012', 'name' => 'Lukman Hakim (Demo)', 'email' => 'mhs012@genbigto.test', 'komsat_id' => $umgo->id, 'divisi_id' => $divUmgoKewirausahaan->id, 'nim' => 'UMGO2023012', 'angkatan' => '2023', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs013', 'name' => 'Maya Anggraini (Demo)', 'email' => 'mhs013@genbigto.test', 'komsat_id' => $umgo->id, 'divisi_id' => $divUmgoKesmas->id, 'nim' => 'UMGO2024013', 'angkatan' => '2024', 'status' => StatusPenerima::Penerima],
            ['username' => 'mhs014', 'name' => 'Naufal Rizky (Demo)', 'email' => 'mhs014@genbigto.test', 'komsat_id' => $ubm->id, 'divisi_id' => $divUbmPendidikan->id, 'nim' => 'UBM2024014', 'angkatan' => '2024', 'status' => StatusPenerima::NonPenerima],
            ['username' => 'mhs015', 'name' => 'Olivia Putri (Demo)', 'email' => 'mhs015@genbigto.test', 'komsat_id' => $ubm->id, 'divisi_id' => $divUbmKewirausahaan->id, 'nim' => 'UBM2022015', 'angkatan' => '2022', 'status' => StatusPenerima::Alumni],
        ];

        $mahasiswaList = [];

        foreach ($demoStudentsData as $data) {
            $user = User::updateOrCreate(
                ['username' => $data['username']],
                [
                    'name' => $data['name'],
                    'email' => $data['email'],
                    'password' => Hash::make('password'),
                    'is_active' => true,
                ]
            );

            if (! $user->hasRole('mahasiswa')) {
                $user->assignRole('mahasiswa');
            }

            $mahasiswa = Mahasiswa::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'komsat_id' => $data['komsat_id'],
                    'divisi_id' => $data['divisi_id'],
                    'nim' => $data['nim'],
                    'angkatan' => $data['angkatan'],
                    'status_penerima' => $data['status'],
                    'aktif' => true,
                ]
            );

            $mahasiswaList[$data['username']] = $mahasiswa;
        }

        return $mahasiswaList;
    }

    /**
     * @param  array<string, Mahasiswa>  $mahasiswaList
     */
    private function seedKepengurusanDemo(array $mahasiswaList): void
    {
        $periodeId = $this->periodeDemo->id ?? Periode::where('aktif', true)->firstOrFail()->id;

        $ung = Komsat::where('kode', 'UNG')->firstOrFail();
        $iain = Komsat::where('kode', 'IAIN')->firstOrFail();
        $ug = Komsat::where('kode', 'UG')->firstOrFail();
        $umgo = Komsat::where('kode', 'UMGO')->firstOrFail();
        $ubm = Komsat::where('kode', 'UBM')->firstOrFail();

        $kepengurusanData = [
            // Pengurus Wilayah (komsat_id null)
            [
                'periode_id' => $periodeId,
                'komsat_id' => null,
                'mahasiswa_id' => $mahasiswaList['mhs001']->id,
                'nama_tampil' => 'Aditia Pratama',
                'jabatan' => 'Ketua Wilayah',
                'urutan' => 1,
                'kontak' => '081234567801',
            ],
            [
                'periode_id' => $periodeId,
                'komsat_id' => null,
                'mahasiswa_id' => $mahasiswaList['mhs002']->id,
                'nama_tampil' => 'Bella Nurhaliza',
                'jabatan' => 'Sekretaris Wilayah',
                'urutan' => 2,
                'kontak' => '081234567802',
            ],
            [
                'periode_id' => $periodeId,
                'komsat_id' => null,
                'mahasiswa_id' => $mahasiswaList['mhs003']->id,
                'nama_tampil' => 'Candra Wijaya',
                'jabatan' => 'Bendahara Wilayah',
                'urutan' => 3,
                'kontak' => '081234567803',
            ],
            // Pengurus Komsat UNG
            [
                'periode_id' => $periodeId,
                'komsat_id' => $ung->id,
                'mahasiswa_id' => $mahasiswaList['mhs004']->id,
                'nama_tampil' => 'Dian Kusuma',
                'jabatan' => 'Ketua Komsat UNG',
                'urutan' => 1,
                'kontak' => '081234567804',
            ],
            // Pengurus Komsat IAIN
            [
                'periode_id' => $periodeId,
                'komsat_id' => $iain->id,
                'mahasiswa_id' => $mahasiswaList['mhs005']->id,
                'nama_tampil' => 'Eka Ramadhani',
                'jabatan' => 'Ketua Komsat IAIN',
                'urutan' => 1,
                'kontak' => '081234567805',
            ],
            // Pengurus Komsat UG
            [
                'periode_id' => $periodeId,
                'komsat_id' => $ug->id,
                'mahasiswa_id' => $mahasiswaList['mhs008']->id,
                'nama_tampil' => 'Hendra Saputra',
                'jabatan' => 'Ketua Komsat UG',
                'urutan' => 1,
                'kontak' => '081234567808',
            ],
            // Pengurus Komsat UMGO
            [
                'periode_id' => $periodeId,
                'komsat_id' => $umgo->id,
                'mahasiswa_id' => $mahasiswaList['mhs011']->id,
                'nama_tampil' => 'Kartika Sari',
                'jabatan' => 'Ketua Komsat UMGO',
                'urutan' => 1,
                'kontak' => '081234567811',
            ],
            // Pengurus Komsat UBM
            [
                'periode_id' => $periodeId,
                'komsat_id' => $ubm->id,
                'mahasiswa_id' => $mahasiswaList['mhs014']->id,
                'nama_tampil' => 'Naufal Rizky',
                'jabatan' => 'Ketua Komsat UBM',
                'urutan' => 1,
                'kontak' => '081234567814',
            ],
        ];

        foreach ($kepengurusanData as $data) {
            Kepengurusan::updateOrCreate(
                [
                    'periode_id' => $data['periode_id'],
                    'komsat_id' => $data['komsat_id'],
                    'jabatan' => $data['jabatan'],
                ],
                [
                    'mahasiswa_id' => $data['mahasiswa_id'],
                    'nama_tampil' => $data['nama_tampil'],
                    'urutan' => $data['urutan'],
                    'kontak' => $data['kontak'],
                ]
            );
        }
    }

    /**
     * @param  array<string, Mahasiswa>  $mahasiswaList
     */
    private function seedKegiatanDemo(array $mahasiswaList): void
    {
        $internalUserId = $this->internalUser->id ?? User::where('username', 'internal')->firstOrFail()->id;
        $now = Carbon::now(config('app.timezone'));

        $ung = Komsat::where('kode', 'UNG')->firstOrFail();
        $iain = Komsat::where('kode', 'IAIN')->firstOrFail();
        $ug = Komsat::where('kode', 'UG')->firstOrFail();
        $umgo = Komsat::where('kode', 'UMGO')->firstOrFail();
        $ubm = Komsat::where('kode', 'UBM')->firstOrFail();

        $divUngPendidikan = Divisi::where('komsat_id', $ung->id)->where('nama', 'Pendidikan')->firstOrFail();
        $divUngKewirausahaan = Divisi::where('komsat_id', $ung->id)->where('nama', 'Kewirausahaan')->firstOrFail();
        $divUngKominfo = Divisi::where('komsat_id', $ung->id)->where('nama', 'Kominfo')->firstOrFail();

        $divIainPendidikan = Divisi::where('komsat_id', $iain->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divUgPendidikan = Divisi::where('komsat_id', $ug->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divUmgoPendidikan = Divisi::where('komsat_id', $umgo->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();
        $divUbmPendidikan = Divisi::where('komsat_id', $ubm->id)->where('nama', 'Divisi Pendidikan (Demo)')->firstOrFail();

        // 8 Kegiatan Demo:
        // 1. Terkunci (Selesai 14 hari lalu) - Tingkat Wilayah, Target Divisi Pendidikan semua Komsat
        $kegiatan1 = Kegiatan::updateOrCreate(
            ['judul' => 'Sosialisasi CBP Rupiah di Sekolah Binaan (Demo UAS)'],
            [
                'deskripsi' => 'Edukasi Cinta, Bangga, Paham Rupiah kepada siswa sekolah binaan GenBI se-Gorontalo.',
                'komsat_id' => null, // Wilayah
                'lokasi_nama' => 'Aula KPw Bank Indonesia Gorontalo (Demo)',
                'latitude' => '0.5402000',
                'longitude' => '123.0601000',
                'radius_m' => 150,
                'tanggal' => $now->copy()->subDays(14)->toDateString(),
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '12:00:00',
                'absensi_buka_at' => $now->copy()->subDays(14)->setTime(7, 45),
                'absensi_tutup_at' => $now->copy()->subDays(14)->setTime(12, 15),
                'pendaftaran_dibuka_at' => $now->copy()->subDays(20)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->subDays(15)->setTime(23, 59),
                'kuota' => 50,
                'status' => StatusKegiatan::Terkunci,
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan1->divisiTarget()->syncWithoutDetaching([
            $divUngPendidikan->id,
            $divIainPendidikan->id,
            $divUgPendidikan->id,
            $divUmgoPendidikan->id,
            $divUbmPendidikan->id,
        ]);
        $this->seedBobotKegiatan($kegiatan1, 10, 20, 30);

        // Peserta kegiatan 1: mhs001 (panitia, valid), mhs005 (peserta, valid), mhs008 (peserta, valid), mhs011 (peserta, ditolak)
        $this->seedPendaftaranDanKehadiran($kegiatan1, $mahasiswaList['mhs001'], PeranKegiatan::Panitia, StatusKehadiran::Valid, 20);
        $this->seedPendaftaranDanKehadiran($kegiatan1, $mahasiswaList['mhs005'], PeranKegiatan::Peserta, StatusKehadiran::Valid, 10);
        $this->seedPendaftaranDanKehadiran($kegiatan1, $mahasiswaList['mhs008'], PeranKegiatan::Peserta, StatusKehadiran::Valid, 10);
        $this->seedPendaftaranDanKehadiran($kegiatan1, $mahasiswaList['mhs011'], PeranKegiatan::Peserta, StatusKehadiran::Ditolak, 0, 'Foto bukti tidak memuat wajah (Data Demo)');

        // 2. Terkunci (Selesai 10 hari lalu) - Komsat UNG, Target Divisi Kewirausahaan
        $kegiatan2 = Kegiatan::updateOrCreate(
            ['judul' => 'Workshop GenBI Preneur: Digital Marketing UMKM (Demo UAS)'],
            [
                'deskripsi' => 'Pelatihan pendampingan digitalisasi pemasaran UMKM lokal di Gorontalo.',
                'komsat_id' => $ung->id,
                'lokasi_nama' => 'Gedung PKM UNG (Demo)',
                'latitude' => '0.5541000',
                'longitude' => '123.0612000',
                'radius_m' => 100,
                'tanggal' => $now->copy()->subDays(10)->toDateString(),
                'jam_mulai' => '09:00:00',
                'jam_selesai' => '15:00:00',
                'absensi_buka_at' => $now->copy()->subDays(10)->setTime(8, 30),
                'absensi_tutup_at' => $now->copy()->subDays(10)->setTime(15, 30),
                'pendaftaran_dibuka_at' => $now->copy()->subDays(18)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->subDays(11)->setTime(23, 59),
                'kuota' => 30,
                'status' => StatusKegiatan::Terkunci,
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan2->divisiTarget()->syncWithoutDetaching([$divUngKewirausahaan->id]);
        $this->seedBobotKegiatan($kegiatan2, 15, 25, 40);

        // Peserta kegiatan 2: mhs002 (peserta, valid)
        $this->seedPendaftaranDanKehadiran($kegiatan2, $mahasiswaList['mhs002'], PeranKegiatan::Peserta, StatusKehadiran::Valid, 15);

        // 3. Terkunci (Selesai 7 hari lalu) - Wilayah, dengan Approved Koreksi
        $kegiatan3 = Kegiatan::updateOrCreate(
            ['judul' => 'Pelatihan Publikasi Media Sosial dan Desain Kreatif (Demo UAS)'],
            [
                'deskripsi' => 'Workshop peningkatan keterampilan komunikasi visual dan publikasi media GenBI.',
                'komsat_id' => null,
                'lokasi_nama' => 'Pusat Komputer UNG (Demo)',
                'latitude' => '0.5545000',
                'longitude' => '123.0620000',
                'radius_m' => 120,
                'tanggal' => $now->copy()->subDays(7)->toDateString(),
                'jam_mulai' => '13:00:00',
                'jam_selesai' => '17:00:00',
                'absensi_buka_at' => $now->copy()->subDays(7)->setTime(12, 30),
                'absensi_tutup_at' => $now->copy()->subDays(7)->setTime(17, 30),
                'pendaftaran_dibuka_at' => $now->copy()->subDays(14)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->subDays(8)->setTime(23, 59),
                'kuota' => 40,
                'status' => StatusKegiatan::Terkunci,
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan3->divisiTarget()->syncWithoutDetaching([$divUngKominfo->id, $divUngPendidikan->id]);
        $this->seedBobotKegiatan($kegiatan3, 10, 20, 30);

        // Peserta kegiatan 3: mhs003 (panitia, valid), mhs001 (peserta, hadir via koreksi yang disetujui)
        $this->seedPendaftaranDanKehadiran($kegiatan3, $mahasiswaList['mhs003'], PeranKegiatan::Panitia, StatusKehadiran::Valid, 20);
        $this->seedKehadiranKoreksiDisetujui($kegiatan3, $mahasiswaList['mhs001'], PeranKegiatan::Peserta, 10);

        // 4. Selesai secara Waktu (Kemarin, tersimpan Terbit -> Efektif Selesai, siap dikunci)
        $kegiatan4 = Kegiatan::updateOrCreate(
            ['judul' => 'Diskusi Panel Kebanksentralan dan Inflasi Daerah (Demo UAS)'],
            [
                'deskripsi' => 'Kajian rutin ekonomi daerah bersama analis Bank Indonesia.',
                'komsat_id' => null,
                'lokasi_nama' => 'Auditorium IAIN Sultan Amai (Demo)',
                'latitude' => '0.5562000',
                'longitude' => '123.0645000',
                'radius_m' => 200,
                'tanggal' => $now->copy()->subDays(1)->toDateString(),
                'jam_mulai' => '09:00:00',
                'jam_selesai' => '12:00:00',
                'absensi_buka_at' => $now->copy()->subDays(1)->setTime(8, 30),
                'absensi_tutup_at' => $now->copy()->subDays(1)->setTime(12, 30),
                'pendaftaran_dibuka_at' => $now->copy()->subDays(7)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->subDays(2)->setTime(23, 59),
                'kuota' => 60,
                'status' => StatusKegiatan::Terbit, // Efektif Selesai karena kemarin
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan4->divisiTarget()->syncWithoutDetaching([$divIainPendidikan->id, $divUngPendidikan->id]);
        $this->seedBobotKegiatan($kegiatan4, 10, 20, 35);
        $this->seedPendaftaranDanKehadiran($kegiatan4, $mahasiswaList['mhs005'], PeranKegiatan::Peserta, StatusKehadiran::Valid, 10);

        // 5. Berlangsung (Hari ini, jam mulai < now < jam selesai, status Terbit -> Efektif Berlangsung)
        $kegiatan5 = Kegiatan::updateOrCreate(
            ['judul' => 'GenBI Mengajar di Panti Asuhan Harapan Kita (Demo UAS)'],
            [
                'deskripsi' => 'Kegiatan pengabdian masyarakat mengajarkan literasi dasar dan edukasi tabungan Rupiah.',
                'komsat_id' => $ung->id,
                'lokasi_nama' => 'Panti Asuhan Kota Gorontalo (Demo)',
                'latitude' => '0.5398000',
                'longitude' => '123.0595000',
                'radius_m' => 100,
                'tanggal' => $now->toDateString(),
                'jam_mulai' => '00:01:00',
                'jam_selesai' => '23:59:00',
                'absensi_buka_at' => $now->copy()->setTime(0, 0),
                'absensi_tutup_at' => $now->copy()->setTime(23, 59),
                'pendaftaran_dibuka_at' => $now->copy()->subDays(5)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->subDays(1)->setTime(23, 59),
                'kuota' => 25,
                'status' => StatusKegiatan::Terbit, // Efektif Berlangsung hari ini
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan5->divisiTarget()->syncWithoutDetaching([$divUngPendidikan->id]);
        $this->seedBobotKegiatan($kegiatan5, 15, 25, 30);
        $this->seedPendaftaranDanKehadiran($kegiatan5, $mahasiswaList['mhs001'], PeranKegiatan::Peserta, StatusKehadiran::Valid, 15);

        // 6. Terbit Mendatang 1 (3 hari ke depan, tersimpan Terbit -> Efektif Terbit)
        $kegiatan6 = Kegiatan::updateOrCreate(
            ['judul' => 'GenBI Bersih Pantai dan Aksi Lingkungan Hijau (Demo UAS)'],
            [
                'deskripsi' => 'Aksi peduli pesisir membersihkan sampah plastik dan penanaman bibit mangrove.',
                'komsat_id' => null,
                'lokasi_nama' => 'Pantai Kurenai Gorontalo (Demo)',
                'latitude' => '0.5180000',
                'longitude' => '123.0850000',
                'radius_m' => 300,
                'tanggal' => $now->copy()->addDays(3)->toDateString(),
                'jam_mulai' => '07:00:00',
                'jam_selesai' => '11:00:00',
                'absensi_buka_at' => $now->copy()->addDays(3)->setTime(6, 30),
                'absensi_tutup_at' => $now->copy()->addDays(3)->setTime(11, 30),
                'pendaftaran_dibuka_at' => $now->copy()->subDays(3)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->addDays(2)->setTime(23, 59),
                'kuota' => 50,
                'status' => StatusKegiatan::Terbit,
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan6->divisiTarget()->syncWithoutDetaching([$divUngPendidikan->id, $divUgPendidikan->id]);
        $this->seedBobotKegiatan($kegiatan6, 10, 20, 30);

        // Pendaftaran aktif mhs001 dan mhs008
        Pendaftaran::updateOrCreate(
            ['kegiatan_id' => $kegiatan6->id, 'mahasiswa_id' => $mahasiswaList['mhs001']->id],
            ['peran' => PeranKegiatan::Peserta, 'status' => StatusPendaftaran::Terdaftar]
        );
        Pendaftaran::updateOrCreate(
            ['kegiatan_id' => $kegiatan6->id, 'mahasiswa_id' => $mahasiswaList['mhs008']->id],
            ['peran' => PeranKegiatan::Panitia, 'status' => StatusPendaftaran::Terdaftar]
        );

        // 7. Terbit Mendatang 2 (10 hari ke depan, tersimpan Terbit -> Efektif Terbit)
        $kegiatan7 = Kegiatan::updateOrCreate(
            ['judul' => 'Leadership Camp dan Pembekalan Anggota Baru GenBI (Demo UAS)'],
            [
                'deskripsi' => 'Pelatihan kepemimpinan dan nilai kebanksentralan untuk generasi penerus.',
                'komsat_id' => null,
                'lokasi_nama' => 'Balai Diklat Keuangan Gorontalo (Demo)',
                'latitude' => '0.5470000',
                'longitude' => '123.0670000',
                'radius_m' => 200,
                'tanggal' => $now->copy()->addDays(10)->toDateString(),
                'jam_mulai' => '08:00:00',
                'jam_selesai' => '17:00:00',
                'absensi_buka_at' => $now->copy()->addDays(10)->setTime(7, 30),
                'absensi_tutup_at' => $now->copy()->addDays(10)->setTime(17, 30),
                'pendaftaran_dibuka_at' => $now->copy()->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->addDays(8)->setTime(23, 59),
                'kuota' => 100,
                'status' => StatusKegiatan::Terbit,
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan7->divisiTarget()->syncWithoutDetaching([
            $divUngPendidikan->id,
            $divIainPendidikan->id,
            $divUgPendidikan->id,
            $divUmgoPendidikan->id,
            $divUbmPendidikan->id,
        ]);
        $this->seedBobotKegiatan($kegiatan7, 20, 35, 50);

        // 8. Draft (Masa Depan, belum terbit)
        $kegiatan8 = Kegiatan::updateOrCreate(
            ['judul' => 'Rapat Kerja Tahunan Evaluasi Program GenBI (Demo UAS)'],
            [
                'deskripsi' => 'Rapat kerja internal evaluasi capaian program tahunan (Draf perencanaan).',
                'komsat_id' => null,
                'lokasi_nama' => 'Ruang Rapat Kantor Wilayah BI (Demo)',
                'latitude' => '0.5402000',
                'longitude' => '123.0601000',
                'radius_m' => 100,
                'tanggal' => $now->copy()->addDays(25)->toDateString(),
                'jam_mulai' => '09:00:00',
                'jam_selesai' => '16:00:00',
                'absensi_buka_at' => $now->copy()->addDays(25)->setTime(8, 30),
                'absensi_tutup_at' => $now->copy()->addDays(25)->setTime(16, 30),
                'pendaftaran_dibuka_at' => $now->copy()->addDays(15)->setTime(8, 0),
                'batas_daftar_at' => $now->copy()->addDays(23)->setTime(23, 59),
                'kuota' => 30,
                'status' => StatusKegiatan::Draft,
                'dibuat_oleh' => $internalUserId,
            ]
        );
        $kegiatan8->divisiTarget()->syncWithoutDetaching([$divUngPendidikan->id]);
        $this->seedBobotKegiatan($kegiatan8, 10, 20, 30);
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

    private function seedPendaftaranDanKehadiran(
        Kegiatan $kegiatan,
        Mahasiswa $mahasiswa,
        PeranKegiatan $peran,
        StatusKehadiran $statusKehadiran,
        int $poinKredit,
        ?string $alasanPenolakan = null
    ): void {
        $internalUserId = $this->internalUser->id ?? User::where('username', 'internal')->firstOrFail()->id;

        $pendaftaran = Pendaftaran::updateOrCreate(
            ['kegiatan_id' => $kegiatan->id, 'mahasiswa_id' => $mahasiswa->id],
            ['peran' => $peran, 'status' => StatusPendaftaran::Terdaftar]
        );

        $kehadiran = Kehadiran::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id],
            [
                'waktu_checkin' => $kegiatan->absensi_buka_at->copy()->addMinutes(15),
                'latitude' => $kegiatan->latitude,
                'longitude' => $kegiatan->longitude,
                'akurasi_m' => '12.50',
                'jarak_m' => '25.00',
                'sumber' => SumberKehadiran::Mandiri,
                'status' => $statusKehadiran,
                'alasan_penolakan' => $alasanPenolakan,
            ]
        );

        if ($statusKehadiran === StatusKehadiran::Valid && $poinKredit > 0) {
            PoinTransaksi::updateOrCreate(
                [
                    'mahasiswa_id' => $mahasiswa->id,
                    'kegiatan_id' => $kegiatan->id,
                    'kehadiran_id' => $kehadiran->id,
                    'tipe' => TipePoin::Kredit,
                ],
                [
                    'jumlah' => $poinKredit,
                    'keterangan' => 'Kredit kehadiran peran '.$peran->label().' pada '.$kegiatan->judul,
                    'dibuat_oleh' => $internalUserId,
                ]
            );
        }
    }

    private function seedKehadiranKoreksiDisetujui(
        Kegiatan $kegiatan,
        Mahasiswa $mahasiswa,
        PeranKegiatan $peran,
        int $poinKredit
    ): void {
        $internalUserId = $this->internalUser->id ?? User::where('username', 'internal')->firstOrFail()->id;

        $pendaftaran = Pendaftaran::updateOrCreate(
            ['kegiatan_id' => $kegiatan->id, 'mahasiswa_id' => $mahasiswa->id],
            ['peran' => $peran, 'status' => StatusPendaftaran::Terdaftar]
        );

        $kehadiran = Kehadiran::updateOrCreate(
            ['pendaftaran_id' => $pendaftaran->id],
            [
                'waktu_checkin' => $kegiatan->absensi_buka_at->copy()->addMinutes(30),
                'latitude' => null,
                'longitude' => null,
                'akurasi_m' => null,
                'jarak_m' => null,
                'sumber' => SumberKehadiran::Koreksi,
                'status' => StatusKehadiran::Valid,
                'alasan_penolakan' => null,
            ]
        );

        PoinTransaksi::updateOrCreate(
            [
                'mahasiswa_id' => $mahasiswa->id,
                'kegiatan_id' => $kegiatan->id,
                'kehadiran_id' => $kehadiran->id,
                'tipe' => TipePoin::Koreksi,
            ],
            [
                'jumlah' => $poinKredit,
                'keterangan' => 'Koreksi poin kehadiran peran '.$peran->label().' pada '.$kegiatan->judul,
                'dibuat_oleh' => $internalUserId,
            ]
        );

        Koreksi::updateOrCreate(
            [
                'mahasiswa_id' => $mahasiswa->id,
                'kegiatan_id' => $kegiatan->id,
                'pendaftaran_id' => $pendaftaran->id,
                'jenis' => JenisKoreksi::BelumAbsen,
            ],
            [
                'alasan' => 'Kendala GPS di lokasi acara, telah diverifikasi oleh koordinator lapangan (Data Demo).',
                'status' => StatusKoreksi::Disetujui,
                'diproses_oleh' => $internalUserId,
                'catatan_proses' => 'Disetujui berdasarkan konfirmasi absensi fisik di lokasi kegiatan.',
                'diproses_at' => Carbon::now(config('app.timezone')),
            ]
        );
    }
}

<?php

namespace Database\Seeders;

use App\Enums\PeranKegiatan;
use App\Enums\StatusKegiatan;
use App\Enums\StatusKehadiran;
use App\Enums\StatusPendaftaran;
use App\Enums\StatusPenerima;
use App\Enums\SumberKehadiran;
use App\Enums\TipePoin;
use App\Models\Divisi;
use App\Models\Kegiatan;
use App\Models\KegiatanBobot;
use App\Models\Kehadiran;
use App\Models\Komsat;
use App\Models\LokasiKegiatan;
use App\Models\Mahasiswa;
use App\Models\Pendaftaran;
use App\Models\Periode;
use App\Models\PoinTransaksi;
use App\Models\SesiAbsensi;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DataTrenSeeder extends Seeder
{
    public function run(): void
    {
        mt_srand(20261119);

        $this->call(DatabaseSeeder::class);

        $tz = config('app.timezone', 'Asia/Makassar');

        DB::transaction(function () use ($tz): void {
            // D1. Periode 2026
            Periode::updateOrCreate(
                ['nama' => 'Periode 2026'],
                [
                    'tanggal_mulai' => '2026-01-01',
                    'tanggal_selesai' => '2026-12-31',
                    'aktif' => false,
                ]
            );

            $internalUser = User::where('username', 'internal')->firstOrFail();

            // Master 5 Komsat
            $komsatCodes = ['UNG', 'IAIN', 'UG', 'UMGO', 'UBM'];
            /** @var array<string, Komsat> $komsatMap */
            $komsatMap = [];
            foreach ($komsatCodes as $code) {
                $komsatMap[$code] = Komsat::where('kode', $code)->firstOrFail();
            }

            // Pastikan 4 tema divisi tersedia di setiap Komsat
            $temaDivisiList = ['Pendidikan', 'Kewirausahaan', 'Kesehatan Masyarakat', 'Kominfo'];
            /** @var array<string, array<string, Divisi>> $divisiByKomsatAndTema */
            $divisiByKomsatAndTema = [];
            foreach ($komsatCodes as $code) {
                $komsat = $komsatMap[$code];
                $divisiByKomsatAndTema[$code] = [];
                foreach ($temaDivisiList as $tema) {
                    $existing = Divisi::where('komsat_id', $komsat->id)
                        ->where(function ($q) use ($tema) {
                            $q->where('nama', $tema)
                                ->orWhere('nama', 'like', "%{$tema}%");
                        })
                        ->first();

                    if (! $existing) {
                        $existing = Divisi::updateOrCreate(
                            ['komsat_id' => $komsat->id, 'nama' => $tema],
                            ['aktif' => true]
                        );
                    }

                    $divisiByKomsatAndTema[$code][$tema] = $existing;
                }
            }

            // D1. 60 Anggota: UNG 16, IAIN 12, UG 11, UMGO 11, UBM 10
            $memberProfiles = [
                // UNG (1..16)
                ['nama' => 'Fajar Hidayat', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Nurul Fadilah', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Rizky Pratama', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Siti Rahmawati', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Muhammad Ilham', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Putri Lestari', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Dimas Wahyudi', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Annisa Permata', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Aditya Nugraha', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Dewi Anggraini', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Bayu Saputra', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Indah Cahyani', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Rian Firmansyah', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Mega Puspitasari', 'komsat' => 'UNG', 'jk' => 'P'],
                ['nama' => 'Taufik Hidayat', 'komsat' => 'UNG', 'jk' => 'L'],
                ['nama' => 'Sri Wahyuni', 'komsat' => 'UNG', 'jk' => 'P'],
                // IAIN (17..28)
                ['nama' => 'Ahmad Fauzi', 'komsat' => 'IAIN', 'jk' => 'L'],
                ['nama' => 'Fatimah Zahra', 'komsat' => 'IAIN', 'jk' => 'P'],
                ['nama' => 'Arif Rahman', 'komsat' => 'IAIN', 'jk' => 'L'],
                ['nama' => 'Nabila Salsabila', 'komsat' => 'IAIN', 'jk' => 'P'],
                ['nama' => 'Faisal Basri', 'komsat' => 'IAIN', 'jk' => 'L'],
                ['nama' => 'Zulfa Maulida', 'komsat' => 'IAIN', 'jk' => 'P'],
                ['nama' => 'Farhan Maulana', 'komsat' => 'IAIN', 'jk' => 'L'],
                ['nama' => 'Aulia Rahmah', 'komsat' => 'IAIN', 'jk' => 'P'],
                ['nama' => 'Wahyu Ramadhan', 'komsat' => 'IAIN', 'jk' => 'L'],
                ['nama' => 'Tri Handayani', 'komsat' => 'IAIN', 'jk' => 'P'],
                ['nama' => 'Zulkifli Hasan', 'komsat' => 'IAIN', 'jk' => 'L'],
                ['nama' => 'Husnul Khotimah', 'komsat' => 'IAIN', 'jk' => 'P'],
                // UG (29..39)
                ['nama' => 'Mohamad Rivaldi', 'komsat' => 'UG', 'jk' => 'L'],
                ['nama' => 'Nadya Utami', 'komsat' => 'UG', 'jk' => 'P'],
                ['nama' => 'Hendra Gunawan', 'komsat' => 'UG', 'jk' => 'L'],
                ['nama' => 'Gita Savitri', 'komsat' => 'UG', 'jk' => 'P'],
                ['nama' => 'Aldi Kurniawan', 'komsat' => 'UG', 'jk' => 'L'],
                ['nama' => 'Rina Marlina', 'komsat' => 'UG', 'jk' => 'P'],
                ['nama' => 'Danang Prasetyo', 'komsat' => 'UG', 'jk' => 'L'],
                ['nama' => 'Mutia Syarif', 'komsat' => 'UG', 'jk' => 'P'],
                ['nama' => 'Agung Wicaksono', 'komsat' => 'UG', 'jk' => 'L'],
                ['nama' => 'Vina Panduwinata', 'komsat' => 'UG', 'jk' => 'P'],
                ['nama' => 'Sandi Kurnia', 'komsat' => 'UG', 'jk' => 'L'],
                // UMGO (40..50)
                ['nama' => 'Irfan Hakim', 'komsat' => 'UMGO', 'jk' => 'L'],
                ['nama' => 'Suci Ramadhani', 'komsat' => 'UMGO', 'jk' => 'P'],
                ['nama' => 'Fikri Haikal', 'komsat' => 'UMGO', 'jk' => 'L'],
                ['nama' => 'Tiara Andini', 'komsat' => 'UMGO', 'jk' => 'P'],
                ['nama' => 'Yusuf Maulana', 'komsat' => 'UMGO', 'jk' => 'L'],
                ['nama' => 'Maya Safitri', 'komsat' => 'UMGO', 'jk' => 'P'],
                ['nama' => 'Ridwan Kamil', 'komsat' => 'UMGO', 'jk' => 'L'],
                ['nama' => 'Bella Oktaviani', 'komsat' => 'UMGO', 'jk' => 'P'],
                ['nama' => 'Haris Fadillah', 'komsat' => 'UMGO', 'jk' => 'L'],
                ['nama' => 'Melani Putri', 'komsat' => 'UMGO', 'jk' => 'P'],
                ['nama' => 'Ilham Ramadhan', 'komsat' => 'UMGO', 'jk' => 'L'],
                // UBM (51..60)
                ['nama' => 'Naufal Azhar', 'komsat' => 'UBM', 'jk' => 'L'],
                ['nama' => 'Intan Permatasari', 'komsat' => 'UBM', 'jk' => 'P'],
                ['nama' => 'Rendy Pangalila', 'komsat' => 'UBM', 'jk' => 'L'],
                ['nama' => 'Sarah Azhari', 'komsat' => 'UBM', 'jk' => 'P'],
                ['nama' => 'Gilang Ramadhan', 'komsat' => 'UBM', 'jk' => 'L'],
                ['nama' => 'Fitri Handayani', 'komsat' => 'UBM', 'jk' => 'P'],
                ['nama' => 'Kevin Julio', 'komsat' => 'UBM', 'jk' => 'L'],
                ['nama' => 'Tasya Kamila', 'komsat' => 'UBM', 'jk' => 'P'],
                ['nama' => 'Reyhan Pratama', 'komsat' => 'UBM', 'jk' => 'L'],
                ['nama' => 'Ayu Wandira', 'komsat' => 'UBM', 'jk' => 'P'],
            ];

            $hashedPassword = Hash::make('Password123!');
            $angkatanOptions = ['2023', '2024', '2025'];
            $goldarOptions = ['A', 'B', 'AB', 'O'];
            $domisiliOptions = ['Kota Gorontalo', 'Bone Bolango', 'Kabupaten Gorontalo'];

            /** @var array<int, array{mahasiswa: Mahasiswa, komsat: string}> $memberPool */
            $memberPool = [];
            $komsatCounter = ['UNG' => 0, 'IAIN' => 0, 'UG' => 0, 'UMGO' => 0, 'UBM' => 0];

            foreach ($memberProfiles as $idx => $profile) {
                $num = $idx + 1;
                $username = sprintf('anggota%02d', $num);
                $komsatCode = $profile['komsat'];
                $komsat = $komsatMap[$komsatCode];

                $angkatan = $angkatanOptions[$idx % 3];
                $nim = sprintf('%s%s%02d', $komsatCode, $angkatan, $num);

                $temaIdx = $komsatCounter[$komsatCode] % count($temaDivisiList);
                $komsatCounter[$komsatCode]++;
                $tema = $temaDivisiList[$temaIdx];
                $divisi = $divisiByKomsatAndTema[$komsatCode][$tema];

                $user = User::updateOrCreate(
                    ['username' => $username],
                    [
                        'name' => $profile['nama'],
                        'email' => $username.'@genbigto.id',
                        'password' => $hashedPassword,
                        'is_active' => true,
                    ]
                );
                $user->syncRoles(['mahasiswa']);

                $mahasiswa = Mahasiswa::updateOrCreate(
                    ['user_id' => $user->id],
                    [
                        'nim' => $nim,
                        'komsat_id' => $komsat->id,
                        'divisi_id' => $divisi->id,
                        'angkatan' => $angkatan,
                        'no_hp' => sprintf('0821%08d', 40000000 + $num),
                        'status_penerima' => StatusPenerima::Penerima,
                        'aktif' => true,
                        'jenis_kelamin' => $profile['jk'],
                        'agama' => 'Islam',
                        'golongan_darah' => $goldarOptions[$idx % 4],
                        'tanggal_lahir' => Carbon::create(2004, ($idx % 12) + 1, ($idx % 25) + 1)->toDateString(),
                        'domisili' => $domisiliOptions[$idx % 3],
                    ]
                );

                $memberPool[] = [
                    'mahasiswa' => $mahasiswa,
                    'komsat' => $komsatCode,
                ];
            }

            /** @var array<int, int> $participationCounts */
            $participationCounts = array_fill(0, count($memberPool), 0);

            // D2. 24 Kegiatan (Jan - Des 2026)
            mt_srand(20261119);
            $kegiatanDefinitions = [
                [
                    'tanggal' => '2026-01-17',
                    'judul' => 'Sosialisasi CBP Rupiah di Sekolah Binaan',
                    'komsat' => null,
                    'lokasi' => 'SMP Negeri 1 Kota Gorontalo',
                    'lat' => '0.5453000',
                    'lng' => '123.0581000',
                    'radius' => 120,
                    'target' => 12,
                    'kuota' => 25,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-01-24',
                    'judul' => 'Rapat Kerja Wilayah dan Penyusunan Program Kerja 2026',
                    'komsat' => null,
                    'lokasi' => 'Aula KPw Bank Indonesia Gorontalo',
                    'lat' => '0.5402000',
                    'lng' => '123.0601000',
                    'radius' => 150,
                    'target' => 9,
                    'kuota' => 20,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-02-14',
                    'judul' => 'GenBI Berbagi Takjil dan Buka Puasa Bersama Anak Panti',
                    'komsat' => 'UNG',
                    'lokasi' => 'Panti Asuhan Harapan Kita, Kota Gorontalo',
                    'lat' => '0.5398000',
                    'lng' => '123.0595000',
                    'radius' => 100,
                    'target' => 14,
                    'kuota' => 25,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-02-21',
                    'judul' => 'Sosialisasi QRIS untuk Pedagang Pasar Sentral',
                    'komsat' => 'IAIN',
                    'lokasi' => 'Gelanggang Olahraga Kota Gorontalo',
                    'lat' => '0.5517812',
                    'lng' => '123.0563066',
                    'radius' => 150,
                    'target' => 12,
                    'kuota' => 25,
                    'tema' => 'Kewirausahaan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-03-07',
                    'judul' => 'Bakti Sosial dan Layanan Kesehatan Gratis',
                    'komsat' => 'UG',
                    'lokasi' => 'Aula Universitas Gorontalo',
                    'lat' => '0.5621000',
                    'lng' => '123.0702000',
                    'radius' => 150,
                    'target' => 11,
                    'kuota' => 20,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-03-14',
                    'judul' => 'Kelas Literasi Keuangan Edisi Ramadan',
                    'komsat' => null,
                    'lokasi' => 'Aula KPw Bank Indonesia Gorontalo',
                    'lat' => '0.5402000',
                    'lng' => '123.0601000',
                    'radius' => 150,
                    'target' => 13,
                    'kuota' => 25,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-04-11',
                    'judul' => 'GenBI Mengajar di Desa Binaan Tilongkabila',
                    'komsat' => 'UMGO',
                    'lokasi' => 'Balai Desa Binaan, Kecamatan Tilongkabila',
                    'lat' => '0.5712000',
                    'lng' => '123.0915000',
                    'radius' => 200,
                    'target' => 13,
                    'kuota' => 25,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-04-25',
                    'judul' => 'Workshop GenBI Preneur: Digital Marketing untuk UMKM',
                    'komsat' => 'UNG',
                    'lokasi' => 'Gedung PKM Universitas Negeri Gorontalo',
                    'lat' => '0.5541000',
                    'lng' => '123.0612000',
                    'radius' => 120,
                    'target' => 18,
                    'kuota' => 30,
                    'tema' => 'Kewirausahaan',
                    'bobot' => 15,
                ],
                [
                    'tanggal' => '2026-05-09',
                    'judul' => 'Donor Darah dan Cek Kesehatan Bersama PMI Gorontalo',
                    'komsat' => null,
                    'lokasi' => 'Gelanggang Olahraga Kota Gorontalo',
                    'lat' => '0.5517812',
                    'lng' => '123.0563066',
                    'radius' => 150,
                    'target' => 17,
                    'kuota' => 35,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-05-23',
                    'judul' => 'Pelatihan Desain Kreatif dan Pengelolaan Media Sosial',
                    'komsat' => 'UBM',
                    'lokasi' => 'Aula Universitas Bina Mandiri Gorontalo',
                    'lat' => '0.5447000',
                    'lng' => '123.0663000',
                    'radius' => 150,
                    'target' => 12,
                    'kuota' => 20,
                    'tema' => 'Kominfo',
                    'bobot' => 15,
                ],
                [
                    'tanggal' => '2026-06-13',
                    'judul' => 'Seminar Kebanksentralan dan Inflasi Daerah',
                    'komsat' => null,
                    'lokasi' => 'Aula KPw Bank Indonesia Gorontalo',
                    'lat' => '0.5402000',
                    'lng' => '123.0601000',
                    'radius' => 150,
                    'target' => 21,
                    'kuota' => 40,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-06-27',
                    'judul' => 'Aksi Bersih Pantai dan Penanaman Mangrove di Kurenai',
                    'komsat' => 'UNG',
                    'lokasi' => 'Pantai Kurenai, Bone Bolango',
                    'lat' => '0.5180000',
                    'lng' => '123.0850000',
                    'radius' => 300,
                    'target' => 17,
                    'kuota' => 30,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-07-11',
                    'judul' => 'Leadership Camp dan Pembekalan Anggota GenBI',
                    'komsat' => null,
                    'lokasi' => 'Balai Diklat Keuangan Gorontalo',
                    'lat' => '0.5470000',
                    'lng' => '123.0670000',
                    'radius' => 200,
                    'target' => 24,
                    'kuota' => 40,
                    'tema' => 'Pendidikan',
                    'bobot' => 15,
                ],
                [
                    'tanggal' => '2026-07-25',
                    'judul' => 'GenBI Mengajar: Kelas Inspirasi Musim Liburan',
                    'komsat' => 'IAIN',
                    'lokasi' => 'Auditorium IAIN Sultan Amai Gorontalo',
                    'lat' => '0.5562000',
                    'lng' => '123.0645000',
                    'radius' => 200,
                    'target' => 20,
                    'kuota' => 35,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-08-15',
                    'judul' => 'Lomba Cerdas Cermat CBP Rupiah Antar-Kampus',
                    'komsat' => null,
                    'lokasi' => 'Gelanggang Olahraga Kota Gorontalo',
                    'lat' => '0.5517812',
                    'lng' => '123.0563066',
                    'radius' => 150,
                    'target' => 23,
                    'kuota' => 40,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-08-29',
                    'judul' => 'Aksi Lingkungan Hijau dan Edukasi Sampah Plastik',
                    'komsat' => 'UG',
                    'lokasi' => 'Pantai Kurenai, Bone Bolango',
                    'lat' => '0.5180000',
                    'lng' => '123.0850000',
                    'radius' => 300,
                    'target' => 18,
                    'kuota' => 30,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-09-12',
                    'judul' => 'Sosialisasi CBP Rupiah Serentak Lima Komsat',
                    'komsat' => null,
                    'lokasi' => 'Aula KPw Bank Indonesia Gorontalo',
                    'lat' => '0.5402000',
                    'lng' => '123.0601000',
                    'radius' => 150,
                    'target' => 28,
                    'kuota' => 50,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-09-26',
                    'judul' => 'Pelatihan Public Speaking dan Keprotokolan',
                    'komsat' => 'UMGO',
                    'lokasi' => 'Aula Universitas Muhammadiyah Gorontalo',
                    'lat' => '0.5489000',
                    'lng' => '123.0498000',
                    'radius' => 150,
                    'target' => 21,
                    'kuota' => 35,
                    'tema' => 'Kominfo',
                    'bobot' => 15,
                ],
                [
                    'tanggal' => '2026-10-10',
                    'judul' => 'Bulan Inklusi Keuangan: Edukasi QRIS dan Tabungan Pelajar',
                    'komsat' => null,
                    'lokasi' => 'Gelanggang Olahraga Kota Gorontalo',
                    'lat' => '0.5517812',
                    'lng' => '123.0563066',
                    'radius' => 150,
                    'target' => 30,
                    'kuota' => 55,
                    'tema' => 'Kewirausahaan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-10-24',
                    'judul' => 'Workshop Kewirausahaan Mahasiswa dan Bazar UMKM Binaan',
                    'komsat' => 'UNG',
                    'lokasi' => 'Gedung PKM Universitas Negeri Gorontalo',
                    'lat' => '0.5541000',
                    'lng' => '123.0612000',
                    'radius' => 120,
                    'target' => 25,
                    'kuota' => 40,
                    'tema' => 'Kewirausahaan',
                    'bobot' => 15,
                ],
                [
                    'tanggal' => '2026-11-07',
                    'judul' => 'Musyawarah Wilayah dan Evaluasi Program Kerja',
                    'komsat' => null,
                    'lokasi' => 'Aula KPw Bank Indonesia Gorontalo',
                    'lat' => '0.5402000',
                    'lng' => '123.0601000',
                    'radius' => 150,
                    'target' => 27,
                    'kuota' => 45,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-11-14',
                    'judul' => 'Bakti Sosial Akhir Tahun di Panti Asuhan',
                    'komsat' => 'IAIN',
                    'lokasi' => 'Panti Asuhan Harapan Kita, Kota Gorontalo',
                    'lat' => '0.5398000',
                    'lng' => '123.0595000',
                    'radius' => 100,
                    'target' => 25,
                    'kuota' => 40,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-12-10',
                    'judul' => 'Sosialisasi CBP Rupiah dan Literasi Keuangan Akhir Tahun',
                    'komsat' => null,
                    'lokasi' => 'Aula KPw Bank Indonesia Gorontalo',
                    'lat' => '0.5402000',
                    'lng' => '123.0601000',
                    'radius' => 150,
                    'target' => 6,
                    'kuota' => 60,
                    'tema' => 'Pendidikan',
                    'bobot' => 10,
                ],
                [
                    'tanggal' => '2026-12-17',
                    'judul' => 'GenBI Berbagi Akhir Tahun Bersama Anak Panti',
                    'komsat' => 'UNG',
                    'lokasi' => 'Panti Asuhan Harapan Kita, Kota Gorontalo',
                    'lat' => '0.5398000',
                    'lng' => '123.0595000',
                    'radius' => 100,
                    'target' => 4,
                    'kuota' => 40,
                    'tema' => 'Kesehatan Masyarakat',
                    'bobot' => 10,
                ],
            ];

            foreach ($kegiatanDefinitions as $def) {
                $tgl = Carbon::parse($def['tanggal'], $tz);
                $isDesember = $tgl->month === 12;
                $hostKomsatCode = $def['komsat'];
                $komsatModel = $hostKomsatCode !== null ? $komsatMap[$hostKomsatCode] : null;

                $lokasiMaster = LokasiKegiatan::updateOrCreate(
                    ['nama' => $def['lokasi']],
                    [
                        'latitude' => $def['lat'],
                        'longitude' => $def['lng'],
                        'radius_m' => $def['radius'],
                        'aktif' => true,
                    ]
                );

                $kegiatan = Kegiatan::updateOrCreate(
                    ['judul' => $def['judul']],
                    [
                        'deskripsi' => 'Pelaksanaan kegiatan program kerja GenBI Gorontalo tahun 2026: '.$def['judul'].'.',
                        'komsat_id' => $komsatModel?->id,
                        'lokasi_id' => $lokasiMaster->id,
                        'lokasi_nama' => $def['lokasi'],
                        'latitude' => $def['lat'],
                        'longitude' => $def['lng'],
                        'radius_m' => $def['radius'],
                        'tanggal' => $tgl->toDateString(),
                        'jam_mulai' => '08:00:00',
                        'jam_selesai' => '12:00:00',
                        'absensi_buka_at' => $tgl->copy()->setTime(7, 30),
                        'absensi_tutup_at' => $tgl->copy()->setTime(12, 30),
                        'pendaftaran_dibuka_at' => $tgl->copy()->subDays(12)->setTime(8, 0),
                        'batas_daftar_at' => $tgl->copy()->subDays(1)->setTime(23, 59),
                        'kuota' => $def['kuota'],
                        'status' => $isDesember ? StatusKegiatan::Terbit : StatusKegiatan::Terkunci,
                        'dibuat_oleh' => $internalUser->id,
                    ]
                );

                // Bobot peran
                $bobotPeserta = $def['bobot'];
                $bobotPanitia = $bobotPeserta + 10;
                KegiatanBobot::updateOrCreate(
                    ['kegiatan_id' => $kegiatan->id, 'peran' => PeranKegiatan::Peserta],
                    ['poin' => $bobotPeserta]
                );
                KegiatanBobot::updateOrCreate(
                    ['kegiatan_id' => $kegiatan->id, 'peran' => PeranKegiatan::Panitia],
                    ['poin' => $bobotPanitia]
                );
                KegiatanBobot::updateOrCreate(
                    ['kegiatan_id' => $kegiatan->id, 'peran' => PeranKegiatan::Pemateri],
                    ['poin' => 30]
                );

                // Sesi absensi
                $sesi = SesiAbsensi::query()
                    ->where('kegiatan_id', $kegiatan->id)
                    ->whereDate('tanggal', $tgl->toDateString())
                    ->first();

                if ($sesi === null) {
                    SesiAbsensi::query()->create([
                        'kegiatan_id' => $kegiatan->id,
                        'tanggal' => $tgl->toDateString(),
                        'jam_buka' => '07:30:00',
                        'jam_tutup' => '12:30:00',
                    ]);
                } else {
                    $sesi->update([
                        'jam_buka' => '07:30:00',
                        'jam_tutup' => '12:30:00',
                    ]);
                }

                // Divisi target: semua Komsat dengan tema yang cocok
                $targetDivisiIds = [];
                foreach ($komsatCodes as $code) {
                    $targetDivisiIds[] = $divisiByKomsatAndTema[$code][$def['tema']]->id;
                }
                $kegiatan->divisiTarget()->syncWithoutDetaching($targetDivisiIds);

                // D3. Pilih pendaftar deterministik tepat sesuai target
                $targetCount = $def['target'];
                $scoredIndices = [];
                foreach ($memberPool as $mIdx => $memberEntry) {
                    $currentCount = $participationCounts[$mIdx] ?? 0;
                    $score = (30 - $currentCount) * 10;
                    if ($hostKomsatCode !== null && $memberEntry['komsat'] === $hostKomsatCode) {
                        $score += 150;
                    } elseif ($hostKomsatCode === null && $memberEntry['komsat'] === 'UNG') {
                        $score += 20;
                    }
                    $score += mt_rand(0, 50);
                    $scoredIndices[] = ['idx' => $mIdx, 'score' => $score];
                }

                usort($scoredIndices, fn (array $a, array $b): int => $b['score'] <=> $a['score'] ?: $a['idx'] <=> $b['idx']);
                $selectedSlice = array_slice($scoredIndices, 0, $targetCount);

                $selectedMahasiswaIds = [];
                $panitiaQuota = $targetCount >= 20 ? 3 : 2;

                foreach ($selectedSlice as $rank => $picked) {
                    $poolIndex = $picked['idx'];
                    $participationCounts[$poolIndex] = ($participationCounts[$poolIndex] ?? 0) + 1;
                    $mahasiswa = $memberPool[$poolIndex]['mahasiswa'];
                    $selectedMahasiswaIds[] = $mahasiswa->id;

                    $peran = $rank < $panitiaQuota ? PeranKegiatan::Panitia : PeranKegiatan::Peserta;
                    $poinPeran = $peran === PeranKegiatan::Panitia ? $bobotPanitia : $bobotPeserta;

                    $pendaftaran = Pendaftaran::updateOrCreate(
                        [
                            'kegiatan_id' => $kegiatan->id,
                            'mahasiswa_id' => $mahasiswa->id,
                        ],
                        [
                            'peran' => $peran,
                            'status' => StatusPendaftaran::Terdaftar,
                        ]
                    );

                    // Kegiatan Desember (mendatang) hanya memiliki pendaftaran, tanpa kehadiran
                    if ($isDesember) {
                        continue;
                    }

                    // Campuran kehadiran untuk kegiatan lampau (Jan - Nov):
                    // 1..2 (2%): Tanpa catatan kehadiran
                    // 3..4 (2%): Ditolak (jarak 350 - 2.400 m)
                    // 5..7 (3%): Menunggu Tinjau (akurasi 120 - 280 m)
                    // 8..100 (93%): Valid (jarak 5 - 85 m, akurasi 8 - 45 m, poin kredit)
                    $roll = mt_rand(1, 100);
                    $checkinAt = $tgl->copy()->setTime(7, 35)->addMinutes(mt_rand(0, 50));

                    if ($roll <= 2) {
                        // Tanpa catatan kehadiran
                        $existingKehadiran = Kehadiran::where('pendaftaran_id', $pendaftaran->id)->first();
                        if ($existingKehadiran) {
                            PoinTransaksi::where('kehadiran_id', $existingKehadiran->id)->delete();
                            $existingKehadiran->delete();
                        }

                        continue;
                    }

                    if ($roll <= 4) {
                        // Ditolak: jarak 350 - 2.400 m
                        $jarakM = (float) mt_rand(350, 2400);
                        $akurasiM = (float) mt_rand(15, 60);

                        $kehadiran = Kehadiran::updateOrCreate(
                            ['pendaftaran_id' => $pendaftaran->id],
                            [
                                'tanggal' => $tgl->toDateString(),
                                'waktu_checkin' => $checkinAt,
                                'latitude' => number_format((float) $def['lat'] + ($jarakM / 111320), 7, '.', ''),
                                'longitude' => $def['lng'],
                                'jarak_m' => number_format($jarakM, 2, '.', ''),
                                'akurasi_m' => number_format($akurasiM, 2, '.', ''),
                                'foto_path' => 'sample-selfie.svg',
                                'status' => StatusKehadiran::Ditolak,
                                'sumber' => SumberKehadiran::Mandiri,
                                'alasan_penolakan' => 'Lokasi di luar radius kegiatan',
                            ]
                        );

                        PoinTransaksi::where('kehadiran_id', $kehadiran->id)->delete();

                        continue;
                    }

                    if ($roll <= 7) {
                        // Menunggu Tinjau: akurasi 120 - 280 m
                        $jarakM = (float) mt_rand(15, 80);
                        $akurasiM = (float) mt_rand(120, 280);

                        $kehadiran = Kehadiran::updateOrCreate(
                            ['pendaftaran_id' => $pendaftaran->id],
                            [
                                'tanggal' => $tgl->toDateString(),
                                'waktu_checkin' => $checkinAt,
                                'latitude' => number_format((float) $def['lat'] + ($jarakM / 111320), 7, '.', ''),
                                'longitude' => $def['lng'],
                                'jarak_m' => number_format($jarakM, 2, '.', ''),
                                'akurasi_m' => number_format($akurasiM, 2, '.', ''),
                                'foto_path' => 'sample-selfie.svg',
                                'status' => StatusKehadiran::MenungguTinjau,
                                'sumber' => SumberKehadiran::Mandiri,
                                'alasan_penolakan' => null,
                            ]
                        );

                        PoinTransaksi::where('kehadiran_id', $kehadiran->id)->delete();

                        continue;
                    }

                    // Valid: jarak 5 - 85 m, akurasi 8 - 45 m
                    $jarakM = (float) mt_rand(5, 85);
                    $akurasiM = (float) mt_rand(8, 45);

                    $kehadiran = Kehadiran::updateOrCreate(
                        ['pendaftaran_id' => $pendaftaran->id],
                        [
                            'tanggal' => $tgl->toDateString(),
                            'waktu_checkin' => $checkinAt,
                            'latitude' => number_format((float) $def['lat'] + ($jarakM / 111320), 7, '.', ''),
                            'longitude' => $def['lng'],
                            'jarak_m' => number_format($jarakM, 2, '.', ''),
                            'akurasi_m' => number_format($akurasiM, 2, '.', ''),
                            'foto_path' => 'sample-selfie.svg',
                            'status' => StatusKehadiran::Valid,
                            'sumber' => SumberKehadiran::Mandiri,
                            'alasan_penolakan' => null,
                        ]
                    );

                    PoinTransaksi::updateOrCreate(
                        [
                            'mahasiswa_id' => $mahasiswa->id,
                            'kegiatan_id' => $kegiatan->id,
                            'kehadiran_id' => $kehadiran->id,
                            'tipe' => TipePoin::Kredit,
                        ],
                        [
                            'jumlah' => $poinPeran,
                            'keterangan' => 'Kredit kehadiran peran '.$peran->label().' pada '.$kegiatan->judul,
                            'dibuat_oleh' => $internalUser->id,
                        ]
                    );
                }

                // Pastikan hanya pendaftar terpilih dari kumpulan anggota01..60 yang terdaftar pada kegiatan ini
                $poolMahasiswaIds = array_map(fn (array $entry): int => $entry['mahasiswa']->id, $memberPool);
                $unselectedIds = array_values(array_diff($poolMahasiswaIds, $selectedMahasiswaIds));
                if ($unselectedIds !== []) {
                    $unselectedPendaftaran = Pendaftaran::where('kegiatan_id', $kegiatan->id)
                        ->whereIn('mahasiswa_id', $unselectedIds)
                        ->get();

                    foreach ($unselectedPendaftaran as $stalePendaftaran) {
                        $staleKehadiran = Kehadiran::where('pendaftaran_id', $stalePendaftaran->id)->first();
                        if ($staleKehadiran) {
                            PoinTransaksi::where('kehadiran_id', $staleKehadiran->id)->delete();
                            $staleKehadiran->delete();
                        }
                        $stalePendaftaran->delete();
                    }
                }
            }
        });
    }
}

# Rencana Pengujian dan Hardening GenBI

Dokumen ini mencatat inventaris route, cakupan KF-00 sampai KF-12, hasil aktual dari pengujian yang benar-benar dijalankan, dan pekerjaan manual yang tersisa.

## 1. Inventaris Route

Perintah sumber: `php artisan route:list --except-vendor --json`.
Semua route nonpublik berada di balik `auth` dan role middleware yang sesuai; Form Request dan Policy tetap menjadi pemeriksaan per-record.

| Method                | URI             | Nama route            | Middleware                         |
| --------------------- | --------------- | --------------------- | ---------------------------------- |
| GET/HEAD              | `/`             | `home`                | web                                |
| GET/HEAD              | `/aktivitas`    | `public.aktivitas`    | web                                |
| GET/HEAD              | `/statistik`    | `public.statistik`    | web                                |
| GET/HEAD              | `/kepengurusan` | `public.kepengurusan` | web                                |
| GET/HEAD              | `/login`        | `login`               | web, guest                         |
| GET/HEAD              | `admin/*`       | `admin.*`             | web, auth, role:internal_manajemen |
| GET/HEAD              | `mahasiswa/*`   | `mahasiswa.*`         | web, auth, mahasiswa.active        |
| POST/PATCH/PUT/DELETE | `admin/*`       | operasi admin         | web, auth, role:internal_manajemen |
| POST/PATCH            | `mahasiswa/*`   | operasi mahasiswa     | web, auth, mahasiswa.active        |

Inventaris detail tetap dapat dibuat ulang dari perintah route di atas agar tidak menduplikasi daftar route hasil generator.

## 2. Matriks Pengujian Fungsional

| ID    | Kebutuhan      | Skenario / data uji                                    | Langkah                                 | Hasil diharapkan                                          | Hasil aktual                                                                         | Status |
| ----- | -------------- | ------------------------------------------------------ | --------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------ |
| KF-00 | Publik         | Guest membuka beranda, aktivitas, statistik, direktori | GET route publik                        | HTTP 200, tidak ada data sensitif                         | Dicakup `PublicAndRoleLayoutsTest`, `PublicDirektoriTest`, `StatistikDanLaporanTest` | LULUS  |
| KF-01 | Auth/role      | login username, akun nonaktif, registrasi              | Jalankan test auth dan registration     | login valid; nonaktif ditolak; registrasi publik tertutup | `AuthenticationTest`, `RegistrationTest`, `RoleAuthorizationTest` lulus              | LULUS  |
| KF-02 | Kegiatan       | CRUD kegiatan, target divisi, bobot, kunci             | Jalankan test kegiatan sebagai IM       | validasi dan policy berlaku                               | `KegiatanManagementTest` lulus                                                       | LULUS  |
| KF-03 | Pendaftaran    | kuota, duplikasi, satu peran                           | submit mahasiswa berulang/berbeda peran | duplikat dan kuota ditolak                                | `PendaftaranTest` lulus                                                              | LULUS  |
| KF-04 | Absensi        | valid, di luar jendela, geofence, duplikat, tinjau     | submit check-in dengan fixture          | server memvalidasi dan idempoten                          | `AbsensiCheckinTest` lulus                                                           | LULUS  |
| KF-05 | Poin           | kredit atomik dan tepat satu kali                      | check-in valid dan submit ulang         | satu ledger kredit sesuai bobot                           | `MonitoringDanPoinTest`, `PoinLeaderboardTest` lulus                                 | LULUS  |
| KF-06 | Poin mahasiswa | dashboard/riwayat/leaderboard                          | akses sebagai pemilik dan user lain     | data terisolasi                                           | `DashboardTest`, `PoinLeaderboardTest` lulus                                         | LULUS  |
| KF-07 | Koreksi        | buat, duplikat menunggu, keputusan, anti poin ganda    | mahasiswa lalu IM memproses             | keputusan tercatat, ledger tidak ganda                    | `KoreksiTest` lulus                                                                  | LULUS  |
| KF-08 | Monitoring     | review absensi dan kunci kegiatan                      | review lalu lock                        | status dan blokir sesuai aturan                           | `MonitoringDanPoinTest`, `KegiatanManagementTest` lulus                              | LULUS  |
| KF-09 | Laporan        | filter Komsat, agregat, export, formula injection      | akses dashboard/export dan audit        | agregat konsisten; mahasiswa ditolak                      | `StatistikDanLaporanTest`, `SecurityAndHardeningTest` lulus                          | LULUS  |
| KF-10 | Direktori      | periode aktif, filter Komsat, arsip                    | akses publik dan admin                  | aktif default; arsip tidak berlabel aktif                 | `PublicDirektoriTest` lulus                                                          | LULUS  |
| KF-11 | Master data    | Komsat-divisi-periode, anggota                         | CRUD dengan payload privilege           | FK, policy, allow-list berlaku                            | `MasterDataTest`, `MahasiswaManagementTest`, `SecurityAndHardeningTest` lulus        | LULUS  |
| KF-12 | Audit          | mutasi poin, koreksi, export                           | periksa audit log pada alur             | aktor/waktu/sumber tersimpan                              | test koreksi, poin, export lulus                                                     | LULUS  |

## 3. Pengujian Unit dan Keamanan

| ID      | Cakupan                                                           | Hasil aktual                                                                                                                               | Status           |
| ------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- |
| UNIT-01 | Haversine: titik sama, jarak batas, jarak luar                    | `tests/Unit/HaversineTest.php` lulus                                                                                                       | LULUS            |
| UNIT-02 | Total poin dari ledger dan leaderboard deterministik              | `tests/Unit/PoinLeaderboardTest.php` lulus                                                                                                 | LULUS            |
| SEC-01  | Composer audit terkunci                                           | Tidak ada advisory                                                                                                                         | LULUS            |
| SEC-02  | npm audit produksi                                                | 3 advisory transitive pada `node-fetch` melalui `face-api.js` (1 high, 2 low); perbaikan upstream memerlukan breaking `face-api.js@0.20.0` | TERBITKAN RISIKO |
| SEC-03  | Security gate                                                     | `red-flag-hits=0`; 1 failure audit dependency dan 1 warning `.npmrc` min-release-age                                                       | TERBITKAN RISIKO |
| SEC-04  | Private storage, ownership, upload, formula injection, rate limit | `SecurityAndHardeningTest.php` lulus                                                                                                       | LULUS            |

Temuan `face-api.js` tidak diabaikan: package tersebut tidak digunakan untuk face recognition pada MVP. Upgrade force tidak dilakukan karena akan mengubah dependency tanpa persetujuan dan berpotensi breaking.

## 4. Quality Gate

| Gate           | Perintah                                   | Hasil                                                    |
| -------------- | ------------------------------------------ | -------------------------------------------------------- |
| Pest penuh     | `vendor\\bin\\pest`                        | 188 test, 181 lulus, 7 skip, 0 gagal, 1.147 assertions   |
| Pint           | `vendor\\bin\\pint --dirty --format agent` | Lulus                                                    |
| PHPStan        | `composer types:check`                     | Lulus, 0 errors                                          |
| TypeScript     | `npm run types:check`                      | Lulus                                                    |
| Frontend lint  | `npm run check`                            | Lulus                                                    |
| Build          | `npm run build`                            | Lulus                                                    |
| Composer audit | `composer audit --locked`                  | Lulus, advisory 0                                        |
| NPM audit      | `npm audit --omit=dev`                     | Gagal gate karena 3 advisory transitive; dicatat di atas |

## 5. Aksesibilitas dan QA Manual

Label input dan `InputError` tersedia pada form utama; tombol submit memakai state `processing` dan disabled. Empty state publik tersedia untuk direktori/statistik. Aksi hapus direktori memakai dialog konfirmasi yang dapat diakses, bukan `confirm()` browser.

Belum dapat dipastikan hanya melalui feature test: visual QA pada 360/390/768/1024/1280/1536 px, alur kamera dan GPS pada secure context, mock location di browser nyata, uji beban 150 submit/10 menit, kompresi foto, dan retensi storage.

## 6. Risiko Tersisa

- Web test tidak membuktikan koordinat perangkat dan kamera nyata; lakukan QA pada HTTPS/localhost secure context dengan izin kamera/lokasi.
- `npm audit` tetap melaporkan dependency transitive `face-api.js`; jangan gunakan modul tersebut di MVP dan rencanakan upgrade terpisah.
- Security gate memperingatkan `.npmrc` belum memiliki `min-release-age`, karena npm lokal belum memenuhi versi yang diperlukan.

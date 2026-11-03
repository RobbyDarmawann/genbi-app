# Rencana Implementasi: Sistem Informasi GenBI Gorontalo Terintegrasi

Dokumen ini adalah cetak biru implementasi teknis bertahap untuk pengembangan **Sistem Informasi GenBI Gorontalo Terintegrasi** menggunakan stack Laravel 13, Inertia v3, React 19, Tailwind CSS v4, dan MySQL. Dokumen ini menjadi acuan eksekusi per fase untuk memastikan setiap modul dibuat terstruktur, aman, idempoten, dan teruji.

---

## 1. Arsitektur & Prinsip Desain Sistem

1. **Stack Inti**:
    - Backend: Laravel 13 (PHP 8.5)
    - Frontend: Inertia.js v3 + React 19 + TypeScript + Tailwind CSS v4
    - UI Primitives: Komponen bawaan Starter Kit (Radix UI / shadcn) + Lucide Icons
    - Database: MySQL (laragon: `genbigto_db`) untuk runtime, SQLite in-memory untuk testing
    - Library Tambahan: `spatie/laravel-permission` (otorisasi role), `maatwebsite/excel` (ekspor laporan), `leaflet` & `react-leaflet` (peta geofence), `recharts` (visualisasi tren)
2. **Pola Aliran Data Backend**:
    - `Route` -> `Controller` (thin, <= 20 baris) -> `FormRequest` (validasi + otorisasi via Policy) -> `Action` (logika bisnis dalam `DB::transaction`) -> `Model` (casts, enum, fillable, hidden).
    - Seluruh mutasi bisnis yang mengubah saldo poin, kehadiran, dan status kegiatan dieksekusi melalui Action class mandiri di `app/Actions/<Domain>/` dengan pencatatan `audit_logs`.
3. **Pola Frontend & Wayfinder**:
    - Semua route dipanggil melalui typed helpers Wayfinder (`@/routes/...` dan `@/actions/...`).
    - Tidak ada URL hardcoded string di React.
    - Desain responsif mobile-first (360px hingga 1280px+) sesuai skill `responsive-ui-ux`.
4. **Keamanan & Privasi (UU PDP No. 27/2022)**:
    - Bukti foto absensi disimpan pada disk private: `storage/app/private/absensi` (driver `local`, `serve` => false).
    - Akses foto hanya melalui controller berotorisasi khusus (`KehadiranFotoController`) yang dilindungi Policy.
    - Password di-hash via bcrypt; token dan credential disaring dari response Inertia.
5. **Zona Waktu & Lokalisasi**:
    - Timezone baku: `Asia/Makassar` (WITA) di semua level (app, server timestamp, validasi waktu).
    - Locale: `id` (Bahasa Indonesia).

### 1.1 Kondisi Aktual Proyek (hasil pemeriksaan 3 Nov 2026) dan Prasyarat Fase 0

| Temuan                                                                                                                                                       | Dampak                                                                | Tindakan di Fase 0                                                                                                                                                                                                                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pdo_sqlite` dan `sqlite3` nonaktif di `php.ini` Laragon (`php -m` hanya memuat `pdo_mysql`); `php artisan test` gagal dengan "could not find driver"        | Seluruh test (SQLite `:memory:` di `phpunit.xml`) tidak bisa berjalan | Aktifkan `extension=pdo_sqlite` dan `extension=sqlite3` di `php.ini` (DLL sudah ada), lalu buka terminal baru                                                                                                                                     |
| MySQL Laragon belum berjalan saat pemeriksaan (`.env` memakai `DB_CONNECTION=mysql`, `genbigto_db`)                                                          | `migrate` gagal                                                       | Start MySQL di Laragon sebelum migrate                                                                                                                                                                                                            |
| `.env`/`.env.example` masih `APP_NAME=Laravel`, `APP_LOCALE=en`; `config/app.php` memakai `'timezone' => 'UTC'` (hardcode)                                   | Waktu absensi tidak WITA                                              | Set timezone `Asia/Makassar` langsung di `config/app.php`, `APP_LOCALE=id`, `APP_FALLBACK_LOCALE=id`, `APP_NAME` sesuai nama sistem                                                                                                               |
| Folder `lang/` belum ada                                                                                                                                     | Pesan validasi/bawaan masih Inggris                                   | Buat `lang/id` (`php artisan lang:publish`, lalu terjemahan Indonesia) tanpa menambah paket baru kecuali disetujui                                                                                                                                |
| `face-api.js` terpasang di `package.json`                                                                                                                    | Bertentangan dengan keputusan (tanpa face recognition)                | Usulkan penghapusan (`npm uninstall face-api.js`); butuh persetujuan karena mengubah dependency                                                                                                                                                   |
| `leaflet`, `react-leaflet`, `recharts` terpasang, `@types/leaflet` belum                                                                                     | `types:check` akan gagal saat peta dipakai                            | Usulkan `@types/leaflet` (dev dependency) di Fase 2; butuh persetujuan                                                                                                                                                                            |
| `spatie/laravel-permission` terpasang, migration permission sudah ada (`teams` = false)                                                                      | Siap dipakai                                                          | Tambahkan trait `HasRoles` ke `User`, seed 2 role                                                                                                                                                                                                 |
| Starter kit masih memuat route/halaman register, forgot/reset password, verify email, 2FA, passkey, dan `config/fortify.php` memakai `'username' => 'email'` | Bertentangan dengan keputusan                                         | Nonaktifkan fitur di `config/fortify.php`; hapus view/registrasi terkait di `FortifyServiceProvider`; ubah `login.tsx`; ubah/hapus test kit yang memakai fitur itu (jangan hapus tanpa persetujuan: ubah menjadi test bahwa route tidak tersedia) |
| Route `settings/*` dan `dashboard` memakai middleware `verified`                                                                                             | Tanpa email verification, user tidak bisa masuk                       | Hapus `verified` dari grup route; Profil hanya mengubah nama/password sendiri (username dan role tidak bisa diubah user)                                                                                                                          |
| `HandleInertiaRequests` membagikan seluruh `auth.user`                                                                                                       | Risiko kebocoran kolom                                                | Bagikan hanya `id`, `name`, `username`, `role`, dan flag `can`; tipe `User` di `resources/js/types/auth.ts` disesuaikan                                                                                                                           |
| Sidebar masih berisi tautan repo/dokumentasi starter kit; dashboard berisi placeholder                                                                       | Slop bawaan kit                                                       | Ganti menu menurut role (Mahasiswa vs Internal Manajemen); branding memakai logo yang ada di `docs/referensi-ui/06-logo-genbi.svg` bila disetujui, tanpa membuat branding palsu                                                                   |
| Belum ada commit git (`master` tanpa commit; semua file staged)                                                                                              | Tidak ada baseline diff                                               | Buat commit baseline sebelum Fase 0                                                                                                                                                                                                               |
| `.npmrc`: `ignore-scripts=true`; lockfile JS: `package-lock.json`                                                                                            | Gunakan `npm`                                                         | Gunakan `npm install` / `npm ci`, bukan pnpm                                                                                                                                                                                                      |

Catatan konsistensi: test bawaan kit untuk registrasi, 2FA, reset password, dan verifikasi email memakai `skipUnlessFortifyHas(...)`, sehingga akan ter-skip otomatis saat fitur dimatikan. Test login dan profil harus diperbarui ke `username`.

---

## 2. Struktur Database & Relasi Entitas

### 2.1 Skema Tabel Lengkap

```
users
 ├── id (PK)
 ├── name (string)
 ├── username (string, unique, index)
 ├── email (string, unique, nullable)
 ├── password (string)
 ├── aktif (boolean, default: true)
 └── timestamps

komsat (5 baris baku: UNG, IAIN, UG, UMGO, UBM)
 ├── id (PK)
 ├── kode (string, unique)  -- UNG, IAIN, UG, UMGO, UBM
 ├── nama (string)          -- Nama lengkap perguruan tinggi mitra
 ├── aktif (boolean, default: true)
 └── timestamps

divisi
 ├── id (PK)
 ├── komsat_id (FK -> komsat.id, onDelete cascade)
 ├── nama (string)          -- Misal: Pendidikan, Kewirausahaan, PTD, KMS, LKH, Kominfo
 ├── kode (string, nullable)
 ├── aktif (boolean, default: true)
 └── timestamps

mahasiswa
 ├── id (PK)
 ├── user_id (FK -> users.id, unique, onDelete cascade)
 ├── komsat_id (FK -> komsat.id)
 ├── divisi_id (FK -> divisi.id)
 ├── nim (string, index)
 ├── nama (string)
 ├── angkatan (unsignedSmallInteger)
 ├── status_penerima (enum: penerima, non_penerima, alumni)
 ├── telepon (string, nullable)
 ├── aktif (boolean, default: true)
 └── timestamps

periode
 ├── id (PK)
 ├── nama (string)          -- Misal: "2025-2026"
 ├── tanggal_mulai (date)
 ├── tanggal_selesai (date)
 ├── aktif (boolean, default: false)
 └── timestamps

kepengurusan
 ├── id (PK)
 ├── periode_id (FK -> periode.id, onDelete cascade)
 ├── komsat_id (FK -> komsat.id, nullable)  -- null = Pengurus Wilayah
 ├── mahasiswa_id (FK -> mahasiswa.id, nullable)
 ├── nama_tampil (string)
 ├── jabatan (string)       -- Ketua, Sekretaris, Koordinator Divisi, dll.
 ├── divisi_nama (string, nullable)
 ├── urutan (integer, default: 0)
 ├── kontak (string, nullable)
 └── timestamps

kegiatan
 ├── id (PK)
 ├── komsat_id (FK -> komsat.id, nullable)  -- null = Kegiatan Tingkat Wilayah
 ├── judul (string)
 ├── deskripsi (text, nullable)
 ├── tanggal (date, index)
 ├── jam_mulai (time)
 ├── jam_selesai (time)
 ├── lokasi_nama (string)
 ├── lat (decimal 10,7)     -- Titik pusat geofence
 ├── lng (decimal 10,7)
 ├── radius_m (unsignedInteger, default: 100) -- Batas radius geofence (meter)
 ├── absensi_buka (dateTime, index)
 ├── absensi_tutup (dateTime, index)
 ├── kuota (unsignedInteger, nullable)
 ├── status (enum: draft, terbit, berlangsung, selesai, terkunci)
 ├── dibuat_oleh (FK -> users.id)
 └── timestamps

kegiatan_divisi_target (Pivot)
 ├── id (PK)
 ├── kegiatan_id (FK -> kegiatan.id, onDelete cascade)
 ├── divisi_id (FK -> divisi.id, onDelete cascade)
 └── unique(kegiatan_id, divisi_id)

kegiatan_bobot
 ├── id (PK)
 ├── kegiatan_id (FK -> kegiatan.id, onDelete cascade)
 ├── peran (enum: peserta, panitia, pemateri)
 ├── poin (integer)
 ├── timestamps
 └── unique(kegiatan_id, peran)

pendaftaran
 ├── id (PK)
 ├── kegiatan_id (FK -> kegiatan.id, onDelete cascade)
 ├── mahasiswa_id (FK -> mahasiswa.id, onDelete cascade)
 ├── peran (enum: peserta, panitia, pemateri, default: peserta)
 ├── status (enum: terdaftar, batal, default: terdaftar)
 ├── timestamps
 └── unique(kegiatan_id, mahasiswa_id) -- Aturan 1 peran per mahasiswa per kegiatan

kehadiran
 ├── id (PK)
 ├── pendaftaran_id (FK -> pendaftaran.id, unique, onDelete cascade) -- KUNCI IDEMPOTENSI
 ├── waktu_absen (dateTime) -- Waktu server (Asia/Makassar)
 ├── lat_absen (decimal 10,7)
 ├── lng_absen (decimal 10,7)
 ├── akurasi_m (decimal 8,2)
 ├── jarak_m (decimal 8,2)  -- Hasil perhitungan Haversine di server
 ├── foto_path (string)     -- Disimpan di private disk
 ├── status (enum: valid, ditolak, menunggu_tinjau)
 ├── catatan (string, nullable)
 └── timestamps

poin_transaksi (Ledger Poin)
 ├── id (PK)
 ├── mahasiswa_id (FK -> mahasiswa.id, onDelete cascade)
 ├── kegiatan_id (FK -> kegiatan.id, nullable, onDelete set null)
 ├── kehadiran_id (FK -> kehadiran.id, nullable, onDelete set null)
 ├── tipe (enum: kredit, koreksi)
 ├── jumlah (integer)       -- Nilai delta (+/-)
 ├── keterangan (string)
 ├── dibuat_oleh (FK -> users.id)
 └── timestamps

koreksi
 ├── id (PK)
 ├── mahasiswa_id (FK -> mahasiswa.id, onDelete cascade)
 ├── kegiatan_id (FK -> kegiatan.id, onDelete cascade)
 ├── jenis (enum: belum_absen, poin_belum_masuk, lainnya)
 ├── alasan (text)
 ├── bukti_path (string, nullable) -- Disimpan di private disk
 ├── status (enum: menunggu, disetujui, ditolak, default: menunggu)
 ├── poin_diajukan (integer, nullable)
 ├── diproses_oleh (FK -> users.id, nullable)
 ├── catatan_proses (text, nullable)
 ├── waktu_proses (dateTime, nullable)
 └── timestamps

audit_logs
 ├── id (PK)
 ├── user_id (FK -> users.id, nullable)
 ├── action (string)        -- misal: "kegiatan.kunci", "poin.koreksi", "peran.ubah"
 ├── auditable_type (string, nullable)
 ├── auditable_id (unsignedBigInteger, nullable)
 ├── old_values (json, nullable)
 ├── new_values (json, nullable)
 ├── ip_address (string, 45, nullable)
 ├── user_agent (text, nullable)
 └── created_at (timestamp)
```

### 2.2 Backed Enums PHP (`app/Enums/`)

1. `PeranKegiatan: string` -> `Peserta = 'peserta'`, `Panitia = 'panitia'`, `Pemateri = 'pemateri'`
2. `StatusKegiatan: string` -> `Draft = 'draft'`, `Terbit = 'terbit'`, `Berlangsung = 'berlangsung'`, `Selesai = 'selesai'`, `Terkunci = 'terkunci'`
3. `StatusPendaftaran: string` -> `Terdaftar = 'terdaftar'`, `Batal = 'batal'`
4. `StatusKehadiran: string` -> `Valid = 'valid'`, `Ditolak = 'ditolak'`, `MenungguTinjau = 'menunggu_tinjau'`
5. `TipePoin: string` -> `Kredit = 'kredit'`, `Koreksi = 'koreksi'`
6. `StatusKoreksi: string` -> `Menunggu = 'menunggu'`, `Disetujui = 'disetujui'`, `Ditolak = 'ditolak'`
7. `StatusPenerima: string` -> `Penerima = 'penerima'`, `NonPenerima = 'non_penerima'`, `Alumni = 'alumni'`

---

## 3. Rincian Fase Implementasi

### FASE 0: Fondasi Sistem & Konfigurasi Lingkungan

Tujuan: Menyiapkan konfigurasi runtime, otorisasi awal, dan hardening sistem sesuai aturan permanen.

- **Tugas & Modul**:
    1. Konfigurasi `config/app.php`: `timezone => 'Asia/Makassar'`, `locale => 'id'`, `fallback_locale => 'id'`.
    2. Modifikasi `config/fortify.php`:
        - Ubah `username => 'username'`.
        - Nonaktifkan `Features::registration()`, `Features::twoFactorAuthentication()`, `Features::passkeys()`, `Features::emailVerification()`, `Features::resetPasswords()`.
        - Pertahankan otentikasi sesi murni username + password.
    3. Konfigurasi `config/filesystems.php`:
        - Tambahkan disk `absensi`: driver `local`, root `storage_path('app/private/absensi')`, `visibility => 'private'`.
    4. Migration Modifikasi `users` & Buat `audit_logs`:
        - Tambahkan kolom `username` (string, unique), `aktif` (boolean, default true).
        - Kolom `email` dibuat nullable.
        - Buat tabel `audit_logs`.
    5. Seeder Role & Akun Awal:
        - Role spatie: `internal_manajemen` dan `mahasiswa`.
        - Akun default Internal Manajemen (username: `admin_im`, password dari env/seeder lokal, tidak di-commit).
    6. Otorisasi & shared props:
        - Tambahkan trait `HasRoles` pada `User`; daftarkan alias middleware `role` spatie di `bootstrap/app.php`.
        - Persempit `HandleInertiaRequests::share` (lihat 1.1), perbarui `login.tsx` (field `username`, tanpa tautan register/lupa password, teks Indonesia), sidebar, dan `dashboard`.
        - Hapus `verified` dari grup route; sesuaikan test kit ke username dan ubah test fitur yang dimatikan menjadi test "route tidak tersedia".
    7. Aktifkan `pdo_sqlite` dan buat commit baseline (lihat 1.1) sebelum mengubah kode.
- **File Dibuat / Dimodifikasi**:
    - `config/app.php`
    - `config/fortify.php`
    - `config/filesystems.php`
    - `database/migrations/xxxx_xx_xx_xxxxxx_modify_users_table_for_username.php`
    - `database/migrations/xxxx_xx_xx_xxxxxx_create_audit_logs_table.php`
    - `app/Models/AuditLog.php`
    - `app/Actions/Audit/RecordAuditLog.php`
    - `database/seeders/RoleAndPermissionSeeder.php`
    - `database/seeders/InternalManajemenUserSeeder.php`
- **Acceptance Criteria Fase 0**:
    - `php artisan migrate` sukses tanpa error.
    - Role `internal_manajemen` dan `mahasiswa` terdaftar di database.
    - Akun Internal Manajemen dapat login menggunakan `username` dan `password`.
    - Halaman `register`, `forgot-password`, `two-factor-challenge`, `email/verify`, dan route passkey tidak lagi terdaftar (404 di `route:list`).
    - `php artisan test` berjalan (driver SQLite aktif) dan hijau setelah test kit disesuaikan.

---

### FASE 1: Master Data Kampus, Divisi, Anggota & Manajemen Akun

Tujuan: Mengelola 5 Komsat sah, divisi per Komsat, dan data mahasiswa lengkap dengan akun login yang dibuatkan langsung oleh Internal Manajemen.

- **Tugas & Modul**:
    1. Migration & Model:
        - Tabel `komsat`, `divisi`, `mahasiswa`.
        - Relasi Eloquent lengkap dengan eager loading & strict mode.
    2. Master Komsat 5 Baku Seeder:
        - Seed 5 Komsat: `UNG`, `IAIN`, `UG`, `UMGO`, `UBM`.
        - Seed divisi per Komsat (misal divisi UNG: Pendidikan, Kewirausahaan, PTD, KMS, LKH, Kominfo).
    3. CRUD Master Komsat & Divisi (Role: `internal_manajemen`):
        - Form Request validasi & Policy.
        - Tampilan responsif (tabel desktop, card mobile).
    4. CRUD Mahasiswa & Pembuatan Akun Mahasiswa (Role: `internal_manajemen`):
        - Action: `CreateMahasiswaWithUserAction` (membuat row `users` ber-role `mahasiswa` sekaligus row `mahasiswa` dalam 1 transaksi).
        - Action: `ToggleMahasiswaActiveAction` & `ResetMahasiswaPasswordAction`.
        - Filter pencarian berbasis Komsat, Divisi, Status Penerima, dan Nama/NIM.
- **Rute Inertia**:
    - `GET /admin/komsat` -> `admin.komsat.index`
    - `POST /admin/komsat` -> `admin.komsat.store`
    - `PATCH /admin/komsat/{komsat}` -> `admin.komsat.update`
    - `GET /admin/divisi` -> `admin.divisi.index`
    - `POST /admin/divisi` -> `admin.divisi.store`
    - `PATCH /admin/divisi/{divisi}` -> `admin.divisi.update`
    - `GET /admin/mahasiswa` -> `admin.mahasiswa.index`
    - `GET /admin/mahasiswa/create` -> `admin.mahasiswa.create`
    - `POST /admin/mahasiswa` -> `admin.mahasiswa.store`
    - `GET /admin/mahasiswa/{mahasiswa}/edit` -> `admin.mahasiswa.edit`
    - `PATCH /admin/mahasiswa/{mahasiswa}` -> `admin.mahasiswa.update`
    - `POST /admin/mahasiswa/{mahasiswa}/reset-password` -> `admin.mahasiswa.reset-password`
- **File Dibuat**:
    - Migrations: `komsat`, `divisi`, `mahasiswa`.
    - Enums: `StatusPenerima`.
    - Models & Policies: `Komsat`, `Divisi`, `Mahasiswa`.
    - Requests: `StoreKomsatRequest`, `UpdateKomsatRequest`, `StoreDivisiRequest`, `StoreMahasiswaRequest`, `UpdateMahasiswaRequest`.
    - Actions: `CreateMahasiswaWithUser`, `UpdateMahasiswa`, `ResetMahasiswaPassword`.
    - Controllers: `KomsatController`, `DivisiController`, `MahasiswaController`.
    - Pages: `resources/js/pages/admin/komsat/index.tsx`, `resources/js/pages/admin/divisi/index.tsx`, `resources/js/pages/admin/mahasiswa/{index,create,edit}.tsx`.
    - Tests: `tests/Feature/Admin/KomsatTest.php`, `tests/Feature/Admin/MahasiswaTest.php`.
- **Acceptance Criteria Fase 1**:
    - Master Komsat menampilkan 5 perguruan tinggi baku (kode tidak boleh diubah menjadi alias lama).
    - Internal Manajemen dapat mendaftarkan mahasiswa baru; user mahasiswa otomatis terbuat dengan username & password default.
    - Mahasiswa yang baru dibuat dapat login menggunakan username + password dan memiliki role `mahasiswa`.
    - User selain Internal Manajemen diblokir (403) saat mengakses rute `/admin/*`.

---

### FASE 2: Manajemen Kegiatan, Divisi Target & Pendaftaran Mandiri

Tujuan: Menggantikan pendaftaran manual via list WhatsApp dengan pembuatan kegiatan ber-divisi target dan pendaftaran mandiri oleh mahasiswa aktif.

- **Tugas & Modul**:
    1. Migration & Model:
        - Tabel `kegiatan`, `kegiatan_divisi_target`, `kegiatan_bobot`, `pendaftaran`.
    2. Pengelolaan Kegiatan oleh Internal Manajemen:
        - Input koordinat (lat, lng) & radius geofence via Leaflet picker.
        - Penentuan jendela absensi (`absensi_buka` dan `absensi_tutup`).
        - Pemilihan satu atau lebih **divisi target** (lintas Komsat atau spesifik Komsat).
        - Konfigurasi bobot poin per peran (`peserta`, `panitia`, `pemateri`).
        - Aksi pengubahan peran pendaftar oleh Internal Manajemen sebelum kegiatan terkunci.
    3. Katalog & Pendaftaran Mandiri Mahasiswa (Role: `mahasiswa`):
        - Mahasiswa melihat kegiatan yang divisinya masuk dalam target.
        - Tombol "Daftar Kegiatan" (Action: `DaftarKegiatanAction`):
            - Validasi: mahasiswa aktif, divisi sesuai target, kuota belum penuh, belum pernah mendaftar.
            - Role default: `peserta`.
        - Tombol "Batal Daftar" (hanya jika kegiatan belum berlangsung/selesai/terkunci).
    4. Halaman Jadwal Kegiatan Publik (Guest / Tanpa Login):
        - Pengunjung publik dapat melihat jadwal kegiatan resmi, lokasi, dan tanggal tanpa tombol absensi/pendaftaran.
- **Rute Inertia**:
    - Guest: `GET /jadwal` -> `public.jadwal`
    - Mahasiswa: `GET /kegiatan` -> `mahasiswa.kegiatan.index`
    - Mahasiswa: `GET /kegiatan/{kegiatan}` -> `mahasiswa.kegiatan.show`
    - Mahasiswa: `POST /kegiatan/{kegiatan}/daftar` -> `mahasiswa.kegiatan.daftar`
    - Mahasiswa: `DELETE /kegiatan/{kegiatan}/batal` -> `mahasiswa.kegiatan.batal`
    - Admin IM: `GET /admin/kegiatan` -> `admin.kegiatan.index`
    - Admin IM: `GET /admin/kegiatan/create` -> `admin.kegiatan.create`
    - Admin IM: `POST /admin/kegiatan` -> `admin.kegiatan.store`
    - Admin IM: `GET /admin/kegiatan/{kegiatan}` -> `admin.kegiatan.show`
    - Admin IM: `GET /admin/kegiatan/{kegiatan}/edit` -> `admin.kegiatan.edit`
    - Admin IM: `PATCH /admin/kegiatan/{kegiatan}` -> `admin.kegiatan.update`
    - Admin IM: `PATCH /admin/kegiatan/{kegiatan}/pendaftar/{pendaftaran}/peran` -> `admin.kegiatan.ubah-peran`
- **File Dibuat**:
    - Migrations: `kegiatan`, `kegiatan_divisi_target`, `kegiatan_bobot`, `pendaftaran`.
    - Enums: `StatusKegiatan`, `PeranKegiatan`, `StatusPendaftaran`.
    - Models & Policies: `Kegiatan`, `KegiatanBobot`, `Pendaftaran`.
    - Requests: `StoreKegiatanRequest`, `UpdateKegiatanRequest`, `UbahPeranPendaftarRequest`.
    - Actions: `CreateKegiatanAction`, `UpdateKegiatanAction`, `DaftarKegiatanAction`, `BatalkanPendaftaranAction`, `UbahPeranPendaftarAction`.
    - Components: `resources/js/components/kegiatan/map-picker.tsx`, `resources/js/components/kegiatan/kegiatan-card.tsx`.
    - Pages: `resources/js/pages/public/jadwal.tsx`, `resources/js/pages/mahasiswa/kegiatan/{index,show}.tsx`, `resources/js/pages/admin/kegiatan/{index,create,edit,show}.tsx`.
    - Tests: `tests/Feature/Kegiatan/PendaftaranTest.php`, `tests/Feature/Admin/KegiatanCrudTest.php`.
- **Acceptance Criteria Fase 2**:
    - Kegiatan hanya bisa didaftar oleh mahasiswa yang divisi-nya termasuk dalam `kegiatan_divisi_target`.
    - Satu mahasiswa hanya memiliki 1 baris pendaftaran aktif per kegiatan.
    - Mahasiswa di luar divisi target mendapat pesan penolakan validasi yang jelas.
    - Internal Manajemen dapat mengubah peran pendaftar (peserta -> panitia/pemateri) dan tercatat di audit log.

---

### FASE 3: Absensi Geofence + Foto Selfie Langsung, Validasi Server & Transaksi Poin Atomik

Tujuan: Menjalankan presensi mandiri bergeofence dengan bukti selfie, validasi server ketat, dan pemberian poin idempoten dalam satu transaksi basis data.

- **Tugas & Modul**:
    1. Migration & Model:
        - Tabel `kehadiran` (kolom `pendaftaran_id` berstatus `UNIQUE`).
        - Tabel `poin_transaksi` (tipe: `kredit` atau `koreksi`).
    2. Komponen Frontend Absensi (`resources/js/components/absensi/camera-capture.tsx`):
        - Meminta izin Geolocation browser (`navigator.geolocation.getCurrentPosition` dengan opsi `enableHighAccuracy: true`).
        - Mengakses stream kamera via `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })`.
        - Mengambil snapshot frame kamera ke canvas (tanpa fitur upload galeri file).
        - Mengompresi hasil foto di klien menjadi JPEG <= 500 KB sebelum diunggah.
    3. Action & Validasi Server (`ProsesAbsensiAction`):
        - Menggunakan rumus **Haversine** di PHP untuk menghitung jarak antara koordinat submit dengan titik kegiatan:
          $$d = 2r \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta\phi}{2}\right) + \cos(\phi_1)\cos(\phi_2)\sin^2\left(\frac{\Delta\lambda}{2}\right)}\right)$$
        - Validasi berlapis:
            1. Pendaftaran mahasiswa berstatus `terdaftar` untuk kegiatan terkait.
            2. Waktu server saat request tiba berada dalam rentang `absensi_buka` <= $waktu$ <= `absensi_tutup` (WITA).
            3. Akurasi GPS klien `<= 100` meter.
            4. Jarak kalkulasi Haversine `<= radius_m`.
            5. Belum pernah ada baris `kehadiran` untuk `pendaftaran_id` tersebut (idempotensi).
        - Mutasi Atomik dalam `DB::transaction`:
            1. Simpan foto ke disk private `storage/app/private/absensi/{uuid}.jpg`.
            2. Simpan record `kehadiran` dengan status `valid`, jarak, akurasi, dan waktu server.
            3. Cari bobot poin sesuai peran mahasiswa pada kegiatan tersebut di `kegiatan_bobot`.
            4. Buat record di `poin_transaksi` (tipe: `kredit`, jumlah: `+$bobot`, `kehadiran_id`, `kegiatan_id`).
    4. Pengamanan File Foto:
        - Controller `KehadiranFotoController` melayani file dari disk private dengan pengecekan Policy: hanya pemilik kehadiran atau user ber-role `internal_manajemen` yang boleh melihat foto.
    5. Dashboard Mahasiswa:
        - Menampilkan akumulasi total poin (`SUM(jumlah)` dari `poin_transaksi`), riwayat keikutsertaan kegiatan, dan status kehadiran.
    6. Monitoring Real-Time & Penguncian Kegiatan oleh Internal Manajemen:
        - Halaman pantau daftar hadir per kegiatan.
        - Tombol "Tutup Sesi Absensi" dan "Kunci Kegiatan".
        - Saat kegiatan dikunci (`status = 'terkunci'`), tidak ada absensi atau pengubahan peran yang dapat dilakukan lagi.
- **Rute Inertia**:
    - Mahasiswa: `GET /kegiatan/{kegiatan}/absen` -> `mahasiswa.absensi.form`
    - Mahasiswa: `POST /kegiatan/{kegiatan}/absen` -> `mahasiswa.absensi.submit`
    - Semua role: `GET /dashboard` -> `dashboard` (satu route; konten dibedakan menurut role di controller)`r`n - Mahasiswa: `GET /poin/riwayat` -> `mahasiswa.poin.riwayat`
    - Auth: `GET /kehadiran/{kehadiran}/foto` -> `kehadiran.foto` (stream private)
    - Admin IM: `GET /admin/kegiatan/{kegiatan}/kehadiran` -> `admin.kegiatan.kehadiran`
    - Admin IM: `POST /admin/kegiatan/{kegiatan}/kunci` -> `admin.kegiatan.kunci`
- **File Dibuat**:
    - Migrations: `kehadiran`, `poin_transaksi`.
    - Enums: `StatusKehadiran`, `TipePoin`.
    - Models & Policies: `Kehadiran`, `PoinTransaksi`.
    - Support class murni tanpa state: `app/Support/Geofence.php` (fungsi Haversine, diuji unit).
    - Requests: `SubmitAbsensiRequest`.
    - Actions: `ProsesAbsensiAction`, `KunciKegiatanAction`.
    - Controllers: `AbsensiController`, `PoinMahasiswaController`, `KehadiranFotoController`, `MonitoringKehadiranController`.
    - Components: `resources/js/components/absensi/camera-capture.tsx`, `resources/js/components/absensi/geo-status.tsx`.
    - Pages: `resources/js/pages/mahasiswa/absensi.tsx`, `resources/js/pages/mahasiswa/dashboard.tsx`, `resources/js/pages/mahasiswa/poin/index.tsx`, `resources/js/pages/admin/kegiatan/monitoring.tsx`.
    - Tests: `tests/Feature/Absensi/AbsensiGeofenceTest.php`, `tests/Feature/Absensi/PoinAtomikTest.php`.
- **Acceptance Criteria Fase 3**:
    - Percobaan absensi di luar radius `radius_m` ditolak server dengan pesan jarak terhitung.
    - Percobaan absensi di luar jendela waktu server ditolak dengan pesan sesi belum buka/sudah tutup.
    - Absensi yang valid menghasilkan baris kehadiran dan baris kredit poin dalam 1 transaksi; jika penyimpanan foto atau poin gagal, seluruh transaksi rollback.
    - Pengiriman absensi ganda (klik cepat/duplikat) gagal karena constraint UNIQUE pada `kehadiran.pendaftaran_id`.
    - Foto selfie tersimpan di disk private dan tidak bisa diakses langsung via URL publik tanpa otentikasi & otorisasi.
    - Kegiatan yang sudah dikunci menolak segala mutasi absensi.

---

### FASE 4: Fitur Instrumen IPPL (Rekap & Tren Komsat, Direktori Kepengurusan, Pengajuan Koreksi)

Tujuan: Menyelesaikan seluruh kebutuhan evaluasi kelembagaan yang diidentifikasi dalam Instrumen IPPL (rekap tren keaktifan antar-Komsat, direktori pengurus aktif per periode, dan mekanisme koreksi resmi).

- **Tugas & Modul**:
    1. Migration & Model:
        - Tabel `periode`, `kepengurusan`, `koreksi`.
    2. Rekap & Tren per Komsat (Fitur Instrumen IPPL No. 2a):
        - Dashboard statistik untuk Internal Manajemen dan versi ringkas untuk Publik/Guest.
        - Grafik tren keaktifan (recharts): total kegiatan, total partisipasi, dan rata-rata poin per Komsat.
        - Filter perguruan tinggi (UNG, IAIN, UG, UMGO, UBM) dan filter periode kepengurusan.
        - Ekspor laporan rekapitulasi ke format Excel menggunakan `maatwebsite/excel`.
    3. Direktori Kepengurusan Aktif (Fitur Instrumen IPPL No. 2b):
        - Internal Manajemen mengelola periode kepengurusan dan anggota pengurus (Tingkat Wilayah & 5 Komsat).
        - Halaman publik `/kepengurusan` menampilkan struktur pengurus periode aktif dengan filter Komsat, menggantikan direktori lama yang basi.
    4. Pengajuan & Validasi Koreksi Kehadiran / Poin (Jalur Resmi Pengganti "Hubungi Sekretaris"):
        - Mahasiswa mengajukan permohonan koreksi dengan memilih kegiatan, alasan, dan bukti pendukung (foto surat tugas/foto kegiatan).
        - Internal Manajemen meninjau daftar ajuan koreksi.
        - Aksi Persetujuan Koreksi (Action: `SetujuiKoreksiAction`):
            - Berjalan dalam `DB::transaction`.
            - Status koreksi berubah menjadi `disetujui`.
            - Menulis baris transaksi baru di `poin_transaksi` (tipe: `koreksi`, jumlah: `+$bobot`, dibuat_oleh: admin).
            - Mencatat jejak di `audit_logs`.
        - Aksi Penolakan Koreksi dengan catatan alasan penolakan.
- **Rute Inertia**:
    - Publik: `GET /statistik` -> `public.statistik` (rekap umum & leaderboard)
    - Publik: `GET /kepengurusan` -> `public.kepengurusan` (direktori aktif)
    - Mahasiswa: `GET /koreksi` -> `mahasiswa.koreksi.index`
    - Mahasiswa: `POST /koreksi` -> `mahasiswa.koreksi.store`
    - Admin IM: `GET /admin/rekap` -> `admin.rekap.index`
    - Admin IM: `GET /admin/rekap/ekspor` -> `admin.rekap.ekspor-excel`
    - Admin IM: `GET /admin/periode` -> `admin.periode.index`
    - Admin IM: `POST /admin/periode` -> `admin.periode.store`
    - Admin IM: `GET /admin/kepengurusan` -> `admin.kepengurusan.index`
    - Admin IM: `POST /admin/kepengurusan` -> `admin.kepengurusan.store`
    - Admin IM: `GET /admin/koreksi` -> `admin.koreksi.index`
    - Admin IM: `PATCH /admin/koreksi/{koreksi}/proses` -> `admin.koreksi.proses`
- **File Dibuat**:
    - Migrations: `periode`, `kepengurusan`, `koreksi`.
    - Enums: `StatusKoreksi`.
    - Models & Policies: `Periode`, `Kepengurusan`, `Koreksi`.
    - Exports: `app/Exports/RekapKegiatanExport.php`.
    - Requests: `StoreKoreksiRequest`, `ProsesKoreksiRequest`, `StorePeriodeRequest`, `StoreKepengurusanRequest`.
    - Actions: `AjukanKoreksiAction`, `ProsesKoreksiAction`, `UpdateKepengurusanAction`.
    - Controllers: `StatistikPublicController`, `KepengurusanPublicController`, `KoreksiMahasiswaController`, `RekapAdminController`, `PeriodeAdminController`, `KepengurusanAdminController`, `KoreksiAdminController`.
    - Components: `resources/js/components/rekap/tren-chart.tsx`, `resources/js/components/kepengurusan/pengurus-card.tsx`.
    - Pages: `resources/js/pages/public/{statistik,kepengurusan}.tsx`, `resources/js/pages/mahasiswa/koreksi/index.tsx`, `resources/js/pages/admin/rekap/index.tsx`, `resources/js/pages/admin/koreksi/index.tsx`, `resources/js/pages/admin/kepengurusan/index.tsx`.
    - Tests: `tests/Feature/Koreksi/PengajuanKoreksiTest.php`, `tests/Feature/Admin/RekapKomsatTest.php`.
- **Acceptance Criteria Fase 4**:
    - Halaman `/kepengurusan` hanya menampilkan pengurus dari periode yang berstatus `aktif`.
    - Filter Komsat di halaman statistik dan direktori memfilter data secara presisi pada 5 kampus sah.
    - Ekspor Excel menghasilkan berkas spreadsheet yang valid dan terproteksi dari formula injection (sel berawalan `=`, `+`, `-`, `@` diberi prefix petik tunggal).
    - Persetujuan koreksi menambahkan poin ke ledger `poin_transaksi` dan langsung merefleksikan saldo baru mahasiswa secara transparan.

---

### FASE 5: Uji Komprehensif, Validasi Responsif & Kesiapan Presentasi UAS

Tujuan: Menjamin ketahanan sistem dari sisi fungsional, keamanan, dan responsivitas UI untuk kebutuhan ujian mata kuliah IPPL.

- **Tugas & Modul**:
    1. Pengujian Fungsional Black-Box (Pest):
        - Rangkaian pengujian terotomasi untuk seluruh Kebutuhan Fungsional (KF-00 s.d. KF-12).
        - Test otorisasi ketat: memastikan mahasiswa tidak bisa mengakses fungsi admin, dan tidak bisa melihat foto milik mahasiswa lain.
    2. Pengujian Batas Geofence & Waktu:
        - Simulasi posisi di dalam radius, tepat di batas radius (boundary test), dan di luar radius.
        - Simulasi waktu sebelum buka, saat sesi aktif, dan setelah tutup.
    3. Database Seeder Demo Lengkap:
        - `DemoDataSeeder`: menyiapkan 1 periode aktif, 5 Komsat, divisi lengkap, 20+ akun mahasiswa realistis per Komsat, beberapa kegiatan lampau dengan riwayat poin, dan 1 kegiatan aktif siap uji absensi langsung.
    4. Validasi Visual & Responsif (Skill `responsive-ui-ux`):
        - Uji tampilan pada viewport mobile 360px, tablet 768px, dan desktop 1280px.
        - Memastikan tidak ada horizontal scrollbar (`overflow-x`), target sentuh tombol minimal 44px di mobile.
    5. Pemeriksaan Seluruh Quality Gates:
        - `vendor/bin/pint --format agent`
        - `composer types:check` (Larastan Level 7)
        - `npm run types:check`
        - `npm run check`
        - `npm run build`
- **Acceptance Criteria Fase 5**:
    - Seluruh test Pest lulus tanpa kegagalan.
    - Quality gates backend dan frontend bersih (0 error, 0 warning).
    - Data demo siap digunakan untuk simulasi alur end-to-end tanpa kendala teknis saat presentasi UAS.

---

## 4. Matriks Rute & Hak Akses (RBAC)

| Rute / Path                   | Metode     | Nama Rute                   | Hak Akses / Middleware     | Keterangan                          |
| ----------------------------- | ---------- | --------------------------- | -------------------------- | ----------------------------------- |
| `/`                           | GET        | `home`                      | Guest (Publik)             | Beranda & ringkasan komunitas       |
| `/jadwal`                     | GET        | `public.jadwal`             | Guest (Publik)             | Jadwal kegiatan resmi terbuka       |
| `/statistik`                  | GET        | `public.statistik`          | Guest (Publik)             | Statistik partisipasi & leaderboard |
| `/kepengurusan`               | GET        | `public.kepengurusan`       | Guest (Publik)             | Direktori pengurus periode aktif    |
| `/login`                      | GET, POST  | `login`, `login.store`      | Guest (belum login)        | Login via username + password       |
| `/logout`                     | POST       | `logout`                    | Auth                       | Keluar dari sesi                    |
| `/dashboard`                  | GET        | `dashboard`                 | Auth (Semua Role)          | Dialihkan sesuai role (Admin / Mhs) |
| `/kegiatan`                   | GET        | `mahasiswa.kegiatan.index`  | Role: `mahasiswa`          | Katalog kegiatan divisi target      |
| `/kegiatan/{kegiatan}`        | GET        | `mahasiswa.kegiatan.show`   | Role: `mahasiswa`          | Detail kegiatan & tombol ikut       |
| `/kegiatan/{kegiatan}/daftar` | POST       | `mahasiswa.kegiatan.daftar` | Role: `mahasiswa`          | Pendaftaran mandiri kegiatan        |
| `/kegiatan/{kegiatan}/batal`  | DELETE     | `mahasiswa.kegiatan.batal`  | Role: `mahasiswa`          | Pembatalan pendaftaran              |
| `/kegiatan/{kegiatan}/absen`  | GET, POST  | `mahasiswa.absensi.*`       | Role: `mahasiswa`          | Form & submit geofence + selfie     |
| `/poin/riwayat`               | GET        | `mahasiswa.poin.riwayat`    | Role: `mahasiswa`          | Ledger riwayat poin pribadi         |
| `/koreksi`                    | GET, POST  | `mahasiswa.koreksi.*`       | Role: `mahasiswa`          | Riwayat & pengajuan koreksi         |
| `/kehadiran/{kehadiran}/foto` | GET        | `kehadiran.foto`            | Auth + Policy              | Akses privat stream foto selfie     |
| `/admin/kegiatan`             | Resource   | `admin.kegiatan.*`          | Role: `internal_manajemen` | CRUD kegiatan + geofence + bobot    |
| `/admin/kegiatan/{keg}/kunci` | POST       | `admin.kegiatan.kunci`      | Role: `internal_manajemen` | Kunci kegiatan & finalisasi poin    |
| `/admin/mahasiswa`            | Resource   | `admin.mahasiswa.*`         | Role: `internal_manajemen` | Kelola anggota & generate akun      |
| `/admin/komsat`               | Resource   | `admin.komsat.*`            | Role: `internal_manajemen` | Kelola master 5 Komsat sah          |
| `/admin/divisi`               | Resource   | `admin.divisi.*`            | Role: `internal_manajemen` | Kelola master divisi per Komsat     |
| `/admin/periode`              | Resource   | `admin.periode.*`           | Role: `internal_manajemen` | Kelola periode kepengurusan         |
| `/admin/kepengurusan`         | Resource   | `admin.kepengurusan.*`      | Role: `internal_manajemen` | Kelola personel pengurus            |
| `/admin/koreksi`              | GET, PATCH | `admin.koreksi.*`           | Role: `internal_manajemen` | Review & persetujuan koreksi        |
| `/admin/rekap`                | GET        | `admin.rekap.index`         | Role: `internal_manajemen` | Analisis tren & evaluasi Komsat     |
| `/admin/rekap/ekspor`         | GET        | `admin.rekap.ekspor`        | Role: `internal_manajemen` | Unduh rekap format Excel            |

---

## 5. Ringkasan Perubahan Antara Rencana Awal vs Keputusan Final

| Aspek                    | Rencana Awal (Dokumen Lama)                            | Keputusan Final (Diadopsi Penuh)                                                                                                  |
| ------------------------ | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **Role & Aktor**         | 4 aktor (Sekretaris Wilayah, Komsat, Mahasiswa, Guest) | HANYA 3 aktor (Guest publik, Mahasiswa, Divisi Internal Manajemen). Role DB spatie hanya 2: `internal_manajemen` dan `mahasiswa`. |
| **Registrasi Akun**      | Register bawaan starter kit / self-registration        | Registrasi publik dimatikan total. Seluruh akun dibuat oleh Internal Manajemen.                                                   |
| **Identitas Login**      | Email + Password (+ 2FA/Passkey)                       | Username + Password. Tanpa 2FA/passkey (dimatikan di Fortify).                                                                    |
| **Komsat Baku**          | Label bervariasi (IAIN SAG, UNIGO, UIN, UBMG)          | Baku hanya 5 kode: UNG, IAIN, UG, UMGO, UBM.                                                                                      |
| **Pendaftaran Kegiatan** | Form eksternal (Google Form) / WhatsApp                | Terintegrasi di web: IM pilih divisi target, mahasiswa aktif divisi target daftar mandiri di web.                                 |
| **Peran Kegiatan**       | Rentan multi-peran tidak jelas                         | 1 mahasiswa = 1 peran per kegiatan (`peserta`, `panitia`, `pemateri`). Idempoten per `pendaftaran_id`.                            |
| **Absensi & Biometrik**  | Wacana face-api.js, liveness CNN, check-out            | MVP HANYA check-in: Geolocation Haversine + Foto selfie bukti langsung dari kamera. Tanpa face recognition/matching/liveness.     |
| **Poin & Penalti**       | Wacana poin negatif otomatis (-23)                     | Tidak ada penalti/poin negatif otomatis. Poin adalah ledger transaksi (`kredit`/`koreksi`). Mutasi atomik via `DB::transaction`.  |
| **Penyimpanan Foto**     | Belum spesifik / storage public                        | Disk private `storage/app/private/absensi`. Akses hanya via controller terotorisasi.                                              |
| **Audit Trail**          | Paket eksternal                                        | Tabel mandiri `audit_logs` proyek.                                                                                                |
| **Timezone & Bahasa**    | UTC default                                            | `Asia/Makassar` (WITA) di semua level; Bahasa Indonesia (`id`).                                                                   |

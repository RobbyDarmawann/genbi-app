# Sistem Informasi GenBI Gorontalo Terintegrasi

Sistem informasi monolith untuk mengelola kegiatan, keanggotaan, pendaftaran,
absensi berbasis geolokasi dan selfie, ledger poin, koreksi, laporan, serta
direktori kepengurusan GenBI Gorontalo.

## Latar belakang

Pendataan anggota dan pendaftaran kegiatan sebelumnya tersebar di WhatsApp
atau formulir eksternal, sedangkan absensi dicatat terpisah. Sistem ini
memindahkan alur tersebut ke satu aplikasi agar data pendaftaran, validasi
absensi, poin, koreksi, dan laporan saling terhubung.

## Aktor dan fitur

### Guest

- Melihat Beranda.
- Melihat `Aktivitas`/jadwal kegiatan publik dan detail kegiatan.
- Melihat `Statistik` poin dan leaderboard.
- Melihat `Kepengurusan` Wilayah dan Komsat.
- Menggunakan footer dan tautan media sosial resmi.

Guest bukan role database dan tidak dapat mengakses modul internal.

### Mahasiswa

- Login menggunakan `username` dan password.
- Melihat dashboard, katalog kegiatan, jadwal mendatang, dan detail kegiatan.
- Mendaftar atau membatalkan pendaftaran pada kegiatan yang menargetkan
  divisinya.
- Melakukan check-in absensi dengan geolokasi HTML5 dan foto kamera.
- Melihat riwayat kehadiran serta riwayat poin.
- Melihat direktori kepengurusan.
- Mengajukan koreksi dengan jenis `Belum absen`, `Poin belum masuk`,
  `Data salah`, atau `Lainnya`.

### Internal Manajemen

- Mengelola master `Periode`, `Komsat`, dan `Divisi`.
- Membuat dan mengelola akun mahasiswa, termasuk status aktif dan reset
  password.
- Membuat kegiatan, target divisi lintas Komsat, jendela absensi, radius
  geofence, kuota, serta bobot poin peran.
- Memantau pendaftaran dan kehadiran, meninjau absensi, serta mengunci
  kegiatan.
- Memproses pengajuan koreksi.
- Melihat `Laporan dan evaluasi`, rekap, dan export.
- Mengelola direktori `Kepengurusan` serta urutan tampilnya.

Role database yang tersedia hanya `internal_manajemen` dan `mahasiswa`.
Registrasi publik tidak tersedia.

## Stack dan arsitektur

- Laravel 13.17 dan PHP 8.3+.
- Inertia.js v3 dengan React 19 dan TypeScript.
- Tailwind CSS v4, Radix UI/shadcn-style components, dan Lucide React.
- MySQL untuk pengembangan Laragon; SQLite in-memory digunakan pada test.
- Leaflet/React Leaflet untuk peta dan Recharts untuk grafik.
- Spatie Laravel Permission untuk dua role aplikasi.
- Laravel Wayfinder untuk route helper TypeScript.
- Maatwebsite Excel untuk export rekap.

Arsitekturnya adalah **Inertia monolith**: route Laravel memanggil controller
dan action, lalu merender page Inertia React. Tidak ada REST API terpisah dan
tidak ada client-side store seperti Redux, Zustand, atau TanStack Query.

## Kebutuhan lokal

- Laragon dengan PHP 8.3+ dan MySQL.
- Composer.
- Node.js dan npm.
- Git.
- Browser modern dengan dukungan Geolocation API dan kamera untuk uji
  check-in.

## Instalasi dengan Laragon dan MySQL

1. Clone repository ke folder `C:\laragon\www\genbigto-app`.
2. Buat database MySQL kosong, misalnya `genbi_app`.
3. Salin `.env.example` menjadi `.env`.
4. Sesuaikan koneksi database tanpa menuliskan secret ke repository:

   ```dotenv
   APP_NAME="Sistem Informasi GenBI Gorontalo Terintegrasi"
   APP_ENV=local
   APP_DEBUG=true
   APP_URL=http://genbigto-app.test

   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=genbi_app
   DB_USERNAME=root
   DB_PASSWORD=
   ```

   Untuk instalasi lokal standar Laragon, password MySQL sering kosong.
   Gunakan password lokal Anda sendiri bila konfigurasi Laragon berbeda.
5. Jalankan:

   ```powershell
   composer install
   php artisan key:generate
   npm install
   php artisan migrate
   php artisan db:seed
   php artisan db:seed --class=DemoSeeder
   ```

`php artisan db:seed` menjalankan `DatabaseSeeder`, yaitu role, lima Komsat,
contoh divisi UNG, periode contoh, serta satu akun internal dan satu akun
mahasiswa dasar. `DemoSeeder` harus dijalankan setelahnya karena membutuhkan
master data tersebut dan menambahkan data demo UAS.

Jangan menjalankan `migrate:fresh` atau `db:wipe` pada database yang berisi
data penting tanpa persetujuan eksplisit.

## Menjalankan aplikasi

Dengan server Laravel dan Vite terpisah:

```powershell
php artisan serve --host=127.0.0.1 --port=8000
npm run dev
```

Alternatif script Composer:

```powershell
composer run dev
```

Pada Laragon, aplikasi juga dapat diakses melalui virtual host yang diarahkan
ke folder `public`. Pastikan URL tersebut sesuai dengan `APP_URL`.

## Perintah pengembangan dan test

```powershell
# Migration
php artisan migrate

# Seeder master/baseline
php artisan db:seed

# Seeder data demo UAS
php artisan db:seed --class=DemoSeeder

# Frontend development dan production build
npm run dev
npm run build

# Frontend quality checks
npm run types:check
npm run check

# Backend formatting, static analysis, dan test
vendor/bin/pint --dirty --format agent
composer types:check
php artisan test --compact
```

Test menggunakan SQLite in-memory sesuai konfigurasi `phpunit.xml`.

## Akun demo lokal

Semua akun demo berikut menggunakan password `password`:

- Internal Manajemen: username `internal`.
- Mahasiswa: username `mhs001` sampai `mhs015`.
- Akun baseline tambahan: username `mahasiswa1`.

Data demo, nama, email, NIM, dan password di atas hanya untuk pengembangan
lokal/UAS. **Jangan gunakan, aktifkan, atau pertahankan kredensial tersebut
di production.** Ganti password dan buat akun baru sebelum deployment.

## Batasan MVP

- Absensi hanya **check-in**; belum ada check-out.
- Foto selfie hanya menjadi bukti absensi dan tidak diproses dengan face
  recognition, face matching, face embedding, atau liveness detection.
- Tidak ada penalti poin otomatis dan tidak ada poin negatif otomatis.
- Web tidak dapat mendeteksi mock location secara andal; validasi tetap
  mengandalkan waktu server, koordinat, akurasi GPS, radius Haversine,
  status pendaftaran, dan pencegahan duplikasi.
- Belum ada aplikasi mobile native, WebSocket, atau API publik pihak ketiga.
- Registrasi publik, lupa password mandiri, dan verifikasi email bukan bagian
  dari alur aplikasi final.

## Dokumen proyek

- [ERD aktual](docs/05-erd.md)
- [Manual pengguna](docs/06-manual-pengguna.md)
- [Skrip demo UAS](docs/07-skrip-demo-uas.md)
- [Rencana implementasi](docs/03-rencana-implementasi.md)

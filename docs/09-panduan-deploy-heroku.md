# Panduan Deploy Heroku — Sistem Informasi GenBI Gorontalo Terintegrasi

Dokumen ini adalah panduan linear langkah demi langkah untuk men-deploy aplikasi **Sistem Informasi GenBI Gorontalo Terintegrasi** (`genbigto-app`) ke Heroku untuk keperluan demo dan evaluasi UAS.

---

## 1. Prasyarat

Sebelum memulai proses deploy, pastikan prasyarat berikut sudah terpenuhi:

1. **Akun Heroku & Kredit Platform**:
    - Memiliki akun Heroku yang terverifikasi.
    - Telah mengaktifkan manfaat **Heroku Platform Credits** melalui **GitHub Student Developer Pack** (`heroku.com/github-students`) sehingga akun memiliki saldo kredit aktif untuk menjalankan dyno (Eco/Basic) dan add-on database.
2. **Heroku CLI**:
    - Terpasang di komputer lokal. Verifikasi dengan menjalankan:
        ```powershell
        heroku --version
        ```
    - Masuk ke akun Heroku melalui terminal:
        ```powershell
        heroku login
        ```
3. **Git Repository Bersih**:
    - Pastikan seluruh perubahan kode, termasuk berkas `Procfile` di root proyek, sudah di-commit ke branch utama (`main`).
    - Isi `Procfile` wajib persis:
        ```text
        web: vendor/bin/heroku-php-apache2 public/
        ```

---

## 2. Pembuatan Aplikasi Heroku

Buat aplikasi baru di Heroku (ganti `<nama-app-genbi>` dengan nama unik pilihan Anda, misalnya `genbi-gorontalo-uas`):

```powershell
heroku create <nama-app-genbi>
```

Perintah ini otomatis membuat aplikasi di Heroku sekaligus menambahkan remote Git bernama `heroku`. Verifikasi remote dengan:

```powershell
git remote -v
```

---s

## 3. Konfigurasi Buildpack (Urutan Wajib)

Aplikasi ini membutuhkan **Node.js** terlebih dahulu untuk mengompilasi aset frontend Vite + React + Wayfinder (`npm run build`), lalu **PHP** untuk menginstal dependensi Composer dan menjalankan server Apache.

Atur urutan buildpack secara eksplisit (**`heroku/nodejs` pada indeks 1, `heroku/php` pada indeks 2**):

```powershell
heroku buildpacks:clear -a <nama-app-genbi>
heroku buildpacks:add --index 1 heroku/nodejs -a <nama-app-genbi>
heroku buildpacks:add --index 2 heroku/php -a <nama-app-genbi>
```

Verifikasi urutan buildpack:

```powershell
heroku buildpacks -a <nama-app-genbi>
```

Pastikan keluarannya menampilkan urutan:

1. `heroku/nodejs`
2. `heroku/php`

---

## 4. Penyediaan Database (Heroku Postgres)

Tambahkan add-on **Heroku Postgres** (paket `essential-0`):

```powershell
heroku addons:create heroku-postgresql:essential-0 -a <nama-app-genbi>
```

Heroku secara otomatis menyuntikkan config var `DATABASE_URL` ke environment aplikasi. Laravel secara bawaan mengenali `DATABASE_URL` ketika `DB_CONNECTION=pgsql` ditetapkan.

---

## 5. Pengaturan Config Vars (Environment Variables)

Hasilkan `APP_KEY` baru secara lokal tanpa mengubah `.env` lokal:

```powershell
php artisan key:generate --show
```

Salin keluaran `base64:...` tersebut, lalu atur seluruh config vars wajib di Heroku (ganti `<APP_KEY_HASIL_GENERATE>` dan `<nama-app-genbi>` sesuai milik Anda; **jangan pernah menyimpan nilai kunci rahasia di dalam repositori Git**):

```powershell
heroku config:set `
  APP_NAME="Sistem Informasi GenBI Gorontalo" `
  APP_ENV=production `
  APP_DEBUG=false `
  APP_KEY="<APP_KEY_HASIL_GENERATE>" `
  APP_URL="https://<nama-app-genbi>.herokuapp.com" `
  DB_CONNECTION=pgsql `
  LOG_CHANNEL=stderr `
  SESSION_DRIVER=file `
  CACHE_STORE=file `
  -a <nama-app-genbi>
```

### Daftar Ringkas Config Vars Wajib

| Variabel         | Nilai Konfigurasi                          | Keterangan                                                           |
| ---------------- | ------------------------------------------ | -------------------------------------------------------------------- |
| `APP_NAME`       | `"Sistem Informasi GenBI Gorontalo"`       | Nama aplikasi pada judul halaman dan header                          |
| `APP_ENV`        | `production`                               | Mode lingkungan produksi                                             |
| `APP_DEBUG`      | `false`                                    | Wajib `false` agar detail stack trace tidak bocor                    |
| `APP_KEY`        | `<output php artisan key:generate --show>` | Kunci enkripsi sesi dan cookie (rahasia)                             |
| `APP_URL`        | `https://<nama-app-genbi>.herokuapp.com`   | URL kanonis aplikasi live di Heroku                                  |
| `DB_CONNECTION`  | `pgsql`                                    | Mengarahkan koneksi database ke `DATABASE_URL` Heroku Postgres       |
| `LOG_CHANNEL`    | `stderr`                                   | Mengarahkan log aplikasi ke stream log Heroku (`heroku logs --tail`) |
| `SESSION_DRIVER` | `file`                                     | Penyimpanan sesi di filesystem dyno                                  |
| `CACHE_STORE`    | `file`                                     | Penyimpanan cache di filesystem dyno                                 |

---

## 6. Deploy Kode ke Heroku

Kirim branch `main` ke remote `heroku`:

```powershell
git push heroku main
```

Saat proses push berlangsung, Heroku akan:

1. Menjalankan buildpack Node.js untuk menginstal paket npm dan membangun aset produksi (`public/build`).
2. Menjalankan buildpack PHP untuk menginstal paket Composer (`--no-dev`) dan menyiapkan `heroku-php-apache2`.

Pastikan minimal satu dyno `web` aktif:

```powershell
heroku ps:scale web=1 -a <nama-app-genbi>
```

---

## 7. Migrasi Database dan Seeder Demo

Setelah rilis selesai, jalankan migrasi skema diikuti oleh seeder master dan ketiga seeder demo secara berurutan:

```powershell
heroku run php artisan migrate --force -a <nama-app-genbi>
heroku run php artisan db:seed --force -a <nama-app-genbi>
heroku run php artisan db:seed --class=DemoSeeder --force -a <nama-app-genbi>
heroku run php artisan db:seed --class=KepengurusanHistorisSeeder --force -a <nama-app-genbi>
heroku run php artisan db:seed --class=TrenDemoSeeder --force -a <nama-app-genbi>
```

Keterangan urutan seeder:

1. `DatabaseSeeder`: menyiapkan role (`internal_manajemen`, `mahasiswa`), 5 master Komsat (`UNG`, `IAIN`, `UG`, `UMGO`, `UBM`), divisi dasar, periode dasar, dan akun `internal`.
2. `DemoSeeder`: menyiapkan `Periode Demo UAS 2026`, 15 akun mahasiswa (`mhs001`–`mhs015`), kepengurusan aktif, serta 8 kegiatan demo beserta pendaftaran, kehadiran, poin, dan koreksi.
3. `KepengurusanHistorisSeeder`: menyiapkan 6 periode historis (2018–2025) beserta 126 data pengurus untuk linimasa multi-periode.
4. `TrenDemoSeeder`: menyiapkan riwayat kegiatan & pendaftaran Juni–September 2026 sehingga grafik dan proyeksi tren per Komsat terisi penuh.

---

## 8. Daftar Smoke Test Pasca-Deploy (URL Live)

Buka `https://<nama-app-genbi>.herokuapp.com` dan jalankan pemeriksaan berikut pada URL live:

1. **A. Jadwal Publik (`/jadwal`)**:
    - Kelompok kegiatan mendatang/berlangsung tampil di atas dengan urutan tanggal naik (ASC), diikuti kelompok kegiatan selesai/lewat dengan urutan tanggal turun (DESC).
    - Paginasi membatasi 9 kegiatan per halaman, dan parameter pencarian/filter bertahan saat berpindah halaman.
2. **B. Panel Mahasiswa (`mhs001` — `/kegiatan`)**:
    - Masuk sebagai `mhs001` / `password`.
    - Tab **Kegiatan untuk Saya** dan **Semua Jadwal** memiliki paginasi independen (`halaman_untuk_saya` dan `halaman_semua`); berpindah halaman di satu tab tidak menggeser halaman tab lainnya.
3. **C. Statistik Publik (`/statistik`)**:
    - Podium menampilkan urutan kolom **2–1–3** dengan ilustrasi karakter badan penuh utuh (bukan potongan lingkaran).
    - Tabel daftar peringkat di bawah podium dimulai dari peringkat **4**.
    - Tooltip pada grafik Tren melabeli kedua seri secara akurat sebagai **"Kegiatan"** dan **"Pendaftaran"**.
4. **D. Direktori Kepengurusan Publik (`/kepengurusan`)**:
    - Menampilkan 7 periode pada linimasa terurut dari terbaru ke terlama (`Periode Demo UAS 2026` hingga `Periode 2018/2020`).
    - Pada layar desktop (`>= 1024px`), rel vertikal di sisi kiri bersifat sticky disertai daftar **"Isi periode ini"** yang memperbarui indikator aktif (scrollspy) saat halaman digulir (uji pada `Periode 2020/2021`).
    - Header kelompok (`GenBI Wilayah`, `Komsat UNG`, dst.) bersifat **statis** (tidak menempel saat digulir).
    - Pada layar mobile, chip kelompok menggulir tepat ke seksi tujuan tanpa tertutup header, klik kartu membalik (flip) dan mengunci tampilan kontak, serta header publik bersembunyi saat gulir ke bawah dan muncul kembali saat gulir ke atas tanpa menutupi konten pada posisi diam.
5. **E. Navigasi Panel Responsif (`390px` & `1280px`)**:
    - Pada viewport mobile (`390px`), drawer navigasi tertutup otomatis setelah memilih menu baik pada akun `internal` maupun `mhs001`.
    - Pada viewport desktop (`1280px`), status buka/tutup sidebar tidak berubah ketika berpindah halaman.
6. **F. Alur Inti Kegiatan & Pendaftaran**:
    - Masuk sebagai `internal` / `password`, buat kegiatan draft baru dengan divisi target yang mencakup divisi `mhs001`, lalu ubah status menjadi **Terbit**.
    - Masuk sebagai `mhs001`, daftar pada kegiatan tersebut hingga berstatus **Terdaftar**, lalu buka halaman absensi kegiatan untuk memastikan halaman beserta komponen peta/lokasi tampil normal.
7. **G. Rekap Internal Manajemen (`/admin/rekap`)**:
    - Halaman Rekap terbuka tanpa error, panel Proyeksi Tren per Komsat menampilkan angka proyeksi dan kemiringan tren, serta tombol **Export Excel** berhasil mengunduh berkas `.xlsx` yang utuh (memuat 5 sheet).

---

## 9. Catatan Keterbatasan Filesystem Ephemeral Heroku

- Dyno Heroku menggunakan **ephemeral filesystem**: setiap berkas yang ditulis ke disk lokal dyno setelah deploy (termasuk foto selfie absensi pada `storage/app/private/absensi`, lampiran bukti koreksi, foto pengurus yang baru diunggah, serta berkas sesi di `storage/framework/sessions`) **akan terhapus setiap kali dyno melakukan restart otomatis (setiap ~24 jam) atau saat rilis baru di-deploy**.
- Untuk kebutuhan **demo UAS**, karakteristik ini sudah memadai selama sesi pengujian berlangsung dalam satu siklus hidup dyno, dan seluruh ilustrasi bawaan di folder `public/ilustrasi/` tetap aman karena ikut ter-commit di Git.
- **Tindak Lanjut Pasca-UAS (Produksi Jangka Panjang)**:
    - Migrasikan penyimpanan disk `absensi` dan berkas unggahan ke layanan Object Storage yang kompatibel dengan S3 (misalnya Cloudflare R2 atau AWS S3) menggunakan adapter `league/flysystem-aws-s3-v3`, serta pindahkan `SESSION_DRIVER` dan `CACHE_STORE` ke `database` atau `redis`.

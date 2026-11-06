# Skrip Demo UAS GenBI

Durasi yang disarankan: **10–15 menit**. Demo memakai data lokal dari
`DemoSeeder`, bukan data mahasiswa asli.

## Persiapan sebelum demo

1. Pastikan `.env` menunjuk ke database lokal.
2. Jalankan migration dan master seeder:

    ```powershell
    php artisan migrate
    php artisan db:seed
    php artisan db:seed --class=DemoSeeder
    ```

3. Jalankan server:

    ```powershell
    php artisan serve --host=127.0.0.1 --port=8000
    npm run dev
    ```

4. Siapkan dua profil browser atau satu jendela incognito:
    - Internal Manajemen: `internal` / `password`.
    - Mahasiswa: `mhs001` / `password`.

    Kredensial ini khusus demo lokal dan tidak boleh digunakan di production.

## Data demo yang tersedia

`DemoSeeder` menyiapkan:

- Periode `Periode Demo UAS 2026`.
- Lima Komsat: `UNG`, `IAIN`, `UG`, `UMGO`, `UBM`.
- 15 akun mahasiswa `mhs001`–`mhs015`.
- Kepengurusan Wilayah serta satu contoh ketua untuk setiap Komsat.
- Delapan kegiatan demo dengan status terkunci, terbit, atau draft.
- Pendaftaran, kehadiran valid/ditolak, bobot `Peserta`/`Panitia`/`Pemateri`,
  transaksi poin, dan contoh koreksi yang disetujui.

Judul kegiatan demo antara lain:

- `Sosialisasi CBP Rupiah di Sekolah Binaan (Demo UAS)`.
- `Workshop GenBI Preneur: Digital Marketing UMKM (Demo UAS)`.
- `Pelatihan Publikasi Media Sosial dan Desain Kreatif (Demo UAS)`.
- `Diskusi Panel Kebanksentralan dan Inflasi Daerah (Demo UAS)`.
- `Leadership Camp dan Pembekalan Anggota Baru GenBI (Demo UAS)`.
- `Rapat Kerja Tahunan Evaluasi Program GenBI (Demo UAS)`.

Beberapa kegiatan demo lain memiliki tanggal relatif terhadap waktu seeder,
sehingga tanggal efektif dapat berubah saat seeder dijalankan ulang.

## Urutan demo 10–15 menit

### Menit 0–2: login Internal Manajemen

1. Buka `Login`.
2. Login sebagai `internal` dengan password `password`.
3. Tunjukkan `Dashboard Internal Manajemen`.
4. Buka `Periode`, `Komsat`, `Divisi`, dan `Mahasiswa` secara singkat untuk
   menunjukkan master data dan akun sudah tersedia.

### Menit 2–5: buat dan siapkan kegiatan

1. Buka `Kegiatan`.
2. Pilih `Tambah kegiatan`.
3. Isi judul demo baru, deskripsi, lokasi, tanggal, jam kegiatan, kuota,
   jendela pendaftaran, dan jendela absensi.
4. Isi latitude/longitude dari lokasi demo yang memang disepakati untuk
   perangkat uji; jangan gunakan koordinat pribadi.
5. Atur radius absensi yang wajar.
6. Pilih target divisi, misalnya `Pendidikan` pada Komsat yang digunakan.
7. Isi bobot untuk `Peserta`, `Panitia`, dan `Pemateri`.
8. Simpan sebagai draft, lalu terbitkan dengan aksi status.

Jangan membuat kegiatan demo dengan koordinat palsu hanya agar absensi
terlihat berhasil.

### Menit 5–7: login mahasiswa dan mendaftar

1. Buka profil browser kedua.
2. Login sebagai `mhs001` / `password`.
3. Buka `Kegiatan` dan pilih kegiatan baru yang target divisinya sesuai.
4. Pilih `Daftar kegiatan`.
5. Tunjukkan status `Terdaftar` pada detail kegiatan.

Jika kegiatan baru tidak cocok dengan divisi `mhs001`, gunakan kegiatan demo
yang sudah disiapkan atau targetkan divisi yang memang dimiliki akun tersebut.

### Menit 7–9: check-in dan poin

1. Dari detail kegiatan, pilih `Absen`/`Check-in`.
2. Tunjukkan permintaan lokasi dan kamera.
3. Pastikan perangkat berada pada lokasi uji yang benar, ambil selfie dari
   kamera, lalu pilih `Kirim absensi`.
4. Tunjukkan status check-in pada `Riwayat Kehadiran`.
5. Buka `Riwayat Poin` dan tunjukkan transaksi `kredit` bila kehadiran
   tervalidasi.

Jangan mengubah request, database, atau status secara manual untuk
memalsukan absensi. Poin hanya bertambah setelah kehadiran valid dan transaksi
ledger berhasil dicatat dalam alur aplikasi.

### Menit 9–11: dashboard dan rekap

1. Kembali ke profil Internal Manajemen.
2. Buka `Monitoring` kegiatan dan tunjukkan peserta serta status kehadiran.
3. Buka `Rekap`.
4. Terapkan filter periode atau Komsat.
5. Tunjukkan kartu ringkasan, grafik, tabel rekap, lalu pilih `Export`.

### Mode proyeksi tren opsional

Secara bawaan, `DemoSeeder` hanya menyediakan riwayat dua bulan, sehingga
panel Proyeksi Tren per Komsat memang menampilkan pesan bahwa data belum cukup.
Untuk menambah riwayat Juni–September 2026, jalankan seeder opsional:

```powershell
php artisan db:seed --class=TrenDemoSeeder
```

Mode ini menambah empat kegiatan Wilayah berstatus tersimpan `Terbit` beserta
pendaftaran peserta yang tidak memiliki kehadiran. Total kegiatan dan
pendaftaran naik, sehingga tingkat kehadiran dapat turun. Tidak ada kehadiran
atau transaksi poin baru; total poin, leaderboard, dan dashboard mahasiswa
tidak berubah. Seeder tidak dipanggil oleh `DatabaseSeeder` dan aman dijalankan
berulang kali.

### Data demo historis kepengurusan multi-periode (opsional)

Untuk mendemonstrasikan linimasa multi-periode di direktori kepengurusan publik
dengan menampilkan enam periode masa lalu (2018–2025), jalankan:

```powershell
php artisan db:seed --class=KepengurusanHistorisSeeder
```

Seeder ini membuat:

- 6 Periode lama tidak aktif: `Periode 2018/2020` s.d. `Periode 2024/2025`.
- 126 pengurus historis:
    - Periode 2018/2020: 23 orang (14 Wilayah, 3 Komsat IAIN, 3 Komsat UNG, 3 Komsat UG).
    - Periode 2020/2021: 39 orang susunan lengkap (12 Wilayah, 9 Komsat UNG, 9 Komsat IAIN, 9 Komsat UG).
    - Periode 2021/2022: 23 orang (14 Wilayah, 3 Komsat UNG, 3 Komsat IAIN, 3 Komsat UG).
    - Periode 2022/2023: 15 orang (6 Wilayah, 3 Komsat UNG, 3 Komsat IAIN, 3 Komsat UG).
    - Periode 2023/2024: 13 orang (4 Wilayah, 3 Komsat UNG, 3 Komsat IAIN, 3 Komsat UG).
    - Periode 2024/2025: 13 orang (4 Wilayah, 3 Komsat UNG, 3 Komsat IAIN, 3 Komsat UG).
- Nama asli dari organigram GenBI Gorontalo dibiarkan tanpa kontak karangan, sedangkan nama bertanda `(Demo)` membawa kontak contoh.
- Bersifat idempoten (bisa dijalankan berulang tanpa menduplikasi data).
- Tidak dipanggil oleh `DatabaseSeeder` maupun `DemoSeeder`, dan tidak mengubah data kanonis aktif.

Untuk kembali ke data demo bawaan, jalankan perintah berikut pada database
lokal yang aman di-reset. `DatabaseSeeder` memanggil seeder master saja dan
tidak memanggil `DemoSeeder` atau `TrenDemoSeeder`/`KepengurusanHistorisSeeder`; jalankan kembali `DemoSeeder`
setelah reset untuk memulihkan seluruh dataset demo:

```powershell
php artisan migrate:fresh --seed
php artisan db:seed --class=DemoSeeder
```

### Menit 11–13: koreksi

1. Buka `Koreksi` sebagai mahasiswa dan tunjukkan contoh pengajuan demo yang
   tersedia, atau ajukan koreksi yang benar-benar relevan.
2. Buka pengajuan tersebut sebagai Internal Manajemen.
3. Tunjukkan alasan, bukti, dan status `Menunggu`.
4. Pilih keputusan yang sesuai, misalnya `Setujui`, lalu simpan catatan.
5. Buka kembali riwayat poin untuk menunjukkan transaksi `koreksi` bila
   keputusan memang menghasilkan koreksi poin.

Jangan menyetujui koreksi tanpa alasan atau bukti hanya demi menaikkan angka
demo.

### Menit 13–15: direktori dan penutup

1. Buka `Kepengurusan` publik.
2. Tunjukkan hierarki Wilayah/Komsat dan urutan kartu.
3. Klik/ketuk kartu untuk membuka kontak; tunjukkan bahwa detail kontak
   berada di sisi belakang.
4. Tutup dengan batasan MVP: check-in saja, tidak ada face matching,
   tidak ada penalti, dan web tidak dapat mendeteksi mock location secara
   andal.

## Fallback perangkat demo

### GPS tidak tersedia atau di luar radius

- Jangan memalsukan koordinat atau memaksa status `Valid`.
- Tunjukkan pesan validasi dan jelaskan bahwa server memeriksa waktu, radius,
  akurasi, status pendaftaran, dan duplikasi.
- Lanjutkan demonstrasi poin menggunakan record kehadiran valid yang sudah
  disediakan `DemoSeeder`, tanpa mengklaim bahwa check-in live berhasil.

### Kamera tidak tersedia

- Jangan mengunggah foto palsu atau memakai foto absensi orang lain.
- Tunjukkan state/error kamera pada halaman check-in.
- Lanjutkan ke monitoring dan riwayat menggunakan data valid dari seeder.

### Tidak ada HTTPS atau izin browser

- Pada lingkungan lokal, berikan izin browser sesuai kebutuhan perangkat.
- Bila browser tetap menolak geolocation/kamera, dokumentasikan error dan
  gunakan fallback data demo yang sudah tersedia.

## Hal yang tidak boleh dilakukan saat demo

- Jangan memakai kredensial demo di production.
- Jangan menampilkan data mahasiswa asli.
- Jangan membagikan file foto absensi atau path disk private.
- Jangan mengubah database secara manual untuk membuat hasil absensi,
  poin, atau koreksi terlihat berhasil.

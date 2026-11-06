MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Perbaikan terbukti: pendaftaran 500 di PostgreSQL + tiga halaman rusak oleh perubahan kontrak kehadiran

Dua cacat di bawah sudah dibuktikan penyebabnya secara independen (reproduksi SQL di PostgreSQL sungguhan + perbandingan kontrak controller↔halaman). Kerjakan persis seperti tertulis; ini perbaikan sempit, bukan refactor.

## Cacat 1 (KRITIS) — POST daftar kegiatan selalu 500 di produksi PostgreSQL

Berkas: `app/Actions/Pendaftaran/RegisterForActivityAction.php`.

Di dalam transaksi, hitungan kuota saat ini ditulis sebagai query agregat yang dikunci:

```php
$activeCount = Pendaftaran::query()
    ->where('kegiatan_id', $lockedActivity->id)
    ->where('status', StatusPendaftaran::Terdaftar)
    ->lockForUpdate()
    ->count();
```

PostgreSQL menolaknya dengan error SQLSTATE 0A000: `FOR UPDATE is not allowed with aggregate functions` — sehingga SETIAP pendaftaran mahasiswa di produksi gagal 500 sebelum baris apa pun dibuat. (SQLite dan MySQL membiarkan bentuk ini lolos; baris `kegiatan` induknya sudah dikunci `lockForUpdate()` di awal transaksi, jadi penguncian baris-baris pendaftaran untuk keperluan hitungan kuota memang tidak diperlukan.)

Perbaikan — hapus HANYA `->lockForUpdate()` dari query hitungan kuota itu, sisanya jangan berubah:

```php
$activeCount = Pendaftaran::query()
    ->where('kegiatan_id', $lockedActivity->id)
    ->where('status', StatusPendaftaran::Terdaftar)
    ->count();
```

Larangan pada cacat ini:

- JANGAN menghapus atau melemahkan kunci lain: kunci baris `kegiatan` di awal transaksi dan kunci baris pendaftaran milik mahasiswa yang mendaftar TETAP seperti sekarang — keduanya sah di PostgreSQL dan merupakan pengaman anti-balapan yang sebenarnya.
- JANGAN mengubah urutan pemeriksaan, pesan validasi, pembuatan/reaktivasi baris, atau penulisan AuditLog.
- Audit codebase: cari pola `lockForUpdate()` lain yang menempel pada query agregat (`count`, `sum`, `exists` yang dibangun dari agregat, dan sejenisnya) di seluruh `app/`. Laporkan temuanmu; perbaiki HANYA bila pola persis sama ditemukan (agregat + lockForUpdate), jangan menyentuh lockForUpdate pada query baris biasa — pola itu sah dan disengaja di banyak tempat.

## Cacat 2 — Halaman riwayat kehadiran mahasiswa (/kehadiran) white screen

Kontrak prop berubah sebelah pihak saat fitur multi-hari: `Mahasiswa/RiwayatController::kehadiran()` sekarang mengirim, untuk tiap baris, `kehadiran` sebagai DAFTAR (array) rekaman per hari dan `poin` yang tertanam DI DALAM tiap rekaman — tetapi `resources/js/pages/mahasiswa/kehadiran/index.tsx` masih bertipe & membaca bentuk LAMA (`kehadiran` objek tunggal atau null, dan `poin` di level baris), sehingga melempar TypeError saat render (`reading 'status' of array`) dan halaman putih untuk mahasiswa yang punya riwayat.

Samakan halaman dengan kontrak controller yang sekarang:

- Per baris bisa ada BEBERAPA rekaman kehadiran (satu per hari). Tampilkan semuanya: perluas baris per kegiatan menjadi satu entri per rekaman kehadiran (tanggal + waktu check-in + status + jarak/akurasi + alasan + poin per rekaman dari field `poin` di dalam rekaman), ATAU tampilkan rekaman-rekaman itu sebagai daftar bertumpuk di dalam sel/baris kegiatan — pilih satu pola, konsisten antara tabel desktop dan kartu mobile.
- Field yang tersedia per rekaman dari controller (pakai persis ini, jangan mengarang field lain): `id, tanggal, waktu_checkin, status, status_label, jarak_m, akurasi_m, alasan_penolakan, has_foto, poin`.
- Tipe TypeScript `RiwayatItem` diperbarui mengikuti bentuk itu; `poin` TIDAK lagi dibaca dari level baris.
- Tombol "Lihat Foto" tetap memakai `id` rekaman yang bersangkutan.
- JANGAN mengubah controller-nya — controller adalah sumber kebenaran kontrak yang baru.

## Cacat 3 — Halaman check-in: hitung mundur "Infinityj NaNm NaNd" saat tidak ada sesi hari ini

Berkas: `resources/js/pages/mahasiswa/kehadiran/checkin.tsx`. Akar masalahnya sudah terbaca persis di kode: saat `kegiatan.sesi_hari_ini` null, kode memakai sentinel `bukaMs = Number.POSITIVE_INFINITY` dan `tutupMs = Number.NEGATIVE_INFINITY`, sehingga `belumBuka` dan `sudahTutup` sama-sama true; blok status lalu menggabungkan teks hitung mundur dari selisih tak-hingga (`formatDurationMs(Infinity)` menghasilkan "Infinityj NaNm NaNd") dengan teks "Jendela waktu absensi telah berakhir." sekaligus.

Perbaikan:

- Bila `sesi_hari_ini` null: baris jendela menampilkan "-" boleh tetap, tetapi blok status di bawahnya WAJIB menampilkan tepat satu kalimat: "Absensi tidak dijadwalkan untuk hari ini." — tanpa hitung mundur, tanpa teks berakhir, dan formulir check-in (lokasi + foto + tombol kirim) tetap nonaktif dalam keadaan itu.
- Buang pemakaian sentinel Infinity dari logika status: turunkan `belumBuka`/`sudahTutup`/`dalamJendela` hanya bila sesi hari ini ada, sehingga ketiga keadaan (belum buka / sedang dibuka / sudah tutup) selalu saling lepas.
- Keadaan lain TIDAK berubah: sesi ada + belum buka → hitung mundur pembukaan yang benar; sesi ada + dalam jendela → sisa waktu; sesi ada + sudah tutup → "Jendela waktu absensi telah berakhir."; sudah check-in hari ini → ringkasan kehadiran seperti sekarang.

## Cacat 4 — Halaman monitoring IM (/admin/kegiatan/{id}/monitoring) white screen

Pola yang sama, berkas `resources/js/pages/admin/kegiatan/monitoring.tsx`: controller `MonitoringKegiatanController::show()` sekarang mengirim, untuk tiap peserta, `kehadiran` sebagai DAFTAR rekaman per hari (field per rekaman: `id, tanggal, status, status_label, waktu_checkin, jarak_m, akurasi_m, alasan_penolakan, has_foto, poin_terkredit`), tetapi halaman ini masih bertipe & membaca `kehadiran` sebagai objek tunggal atau null — halaman putih untuk kegiatan yang pesertanya punya rekaman kehadiran (kegiatan tanpa rekaman tampil normal).

Samakan halaman dengan kontrak controller yang sekarang, sejajar dengan pola yang kamu pakai pada Cacat 2:

- Tipe `PesertaMonitoring.kehadiran` menjadi array rekaman.
- Kolom status/jarak/foto menampilkan SEMUA rekaman peserta itu (daftar bertumpuk per hari di dalam sel, atau entri terpisah per rekaman — satu pola, konsisten desktop + kartu mobile).
- Aksi tinjau (setujui/tolak) dan tombol foto bekerja PER REKAMAN yang berstatus `menunggu_tinjau` / yang punya foto, memakai `id` rekaman itu — perilaku verifikasi IM tidak boleh hilang atau berubah sasarannya.
- Peserta tanpa rekaman: tampilkan penanda belum hadir seperti sebelumnya.
- JANGAN mengubah controller-nya.

## Cacat 5 — Sapu bersih: jangan sampai ada halaman keempat

Sesudah Cacat 2 dan 4, lakukan audit menyeluruh dan laporkan hasilnya sebagai tabel (halaman → bentuk prop dari controller → bentuk yang dibaca .tsx → cocok/tidak):

- Telusuri SEMUA pemakaian relasi `Pendaftaran::kehadiran()` di `app/` dan SEMUA halaman .tsx yang membaca prop bernama `kehadiran`, `daftar_kehadiran`, atau `kehadiran_hari_ini` dari halaman mana pun (publik, mahasiswa, admin — termasuk koreksi, peserta, dashboard).
- Untuk tiap ketidakcocokan bentuk yang ditemukan (server mengirim array, halaman membaca objek — atau sebaliknya), perbaiki SISI HALAMAN mengikuti controller, dengan pola yang sama seperti Cacat 2/4.
- Controller yang sudah diperiksa dan dinyatakan COCOK oleh penilai independen (jangan diubah, cukup konfirmasi di tabel): `Admin/PesertaKegiatanController` (memakai `ringkasan_kehadiran` array + `status_kehadiran` rekaman pertama — peserta.tsx membaca persis itu), `Mahasiswa/KegiatanController` show (`kehadiran` tunggal di dalam prop pendaftaran kini = kehadiran HARI INI; halaman show membacanya sebagai objek tunggal dan itu memang bentuk yang dikirim), `Mahasiswa/AbsensiController`, `Mahasiswa/DashboardController`.

## Gerbang & laporan

Sesudah perbaikan, jalankan: test terkait (`PendaftaranTest` dan test riwayat kehadiran — cari nama persisnya), lalu suite penuh `php artisan test --compact` sampai selesai dengan akuntansi klop, `vendor\bin\pint --dirty`, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Laporkan: baris persis yang diubah pada cacat 1, hasil audit pola agregat+kunci (berkas apa saja yang ditemukan/diubah), pola tampilan yang dipilih pada cacat 2, dan angka persis semua gerbang. JANGAN commit — commit dilakukan pemilik proyek.

# Perbaikan terbukti: sesi hari ini tidak ditemukan di halaman check-in (kegiatan multi-hari tidak bisa absen)

MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools yang tersedia untukmu (baca berkas, edit berkas, terminal) sampai selesai, termasuk seluruh gerbang di akhir. Jangan berhenti pada ringkasan atau rencana. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

## Bukti cacat (sudah diverifikasi dari sistem live, jangan diperdebatkan)

Kegiatan 13 "Extravaganza Fest 2026" di produksi: rentang 6–15 Nov 2026, sesi absensi 16:00–23:00. Halaman edit IM menampilkan 10 sesi lengkap, jendela turunan benar (buka 6 Nov 16:00 WITA, tutup 15 Nov 23:00 WITA), tetapi halaman check-in mahasiswa menerima `sesi_hari_ini: null` PADA HARI DAN JAM SESI SEDANG TERBUKA — formulir nonaktif, mahasiswa tidak bisa absen. Penyebabnya di `app/Http/Controllers/Mahasiswa/AbsensiController.php` method `create()`:

```php
$kegiatan->load(['komsat:id,kode,nama', 'bobot', 'sesiAbsensi']);
...
$today = now(config('app.timezone'))->toDateString();
$sesiHariIni = $kegiatan->sesiAbsensi->firstWhere('tanggal', $today);
```

`sesiAbsensi` di sini adalah Collection yang sudah dimuat ke memori, dan atribut `tanggal` pada model `SesiAbsensi` memakai cast `date` sehingga nilainya objek Carbon — sedangkan `$today` adalah string `'Y-m-d'`. `firstWhere()` membandingkan keduanya dengan perbandingan longgar di memori dan tidak pernah cocok, sehingga sesi tidak pernah ditemukan lewat jalur ini. Jalur kirim (`SubmitAttendanceAction`) TIDAK kena karena ia memilih sesi lewat query database `whereDate('tanggal', $today)`.

## Perbaikan yang diminta

Di `AbsensiController::create()`, ganti pemilihan sesi hari ini dari perbandingan Collection di memori menjadi query database yang sama polanya dengan `SubmitAttendanceAction`, misalnya:

```php
$sesiHariIni = $kegiatan->sesiAbsensi()
    ->whereDate('tanggal', $today)
    ->first();
```

Sesuaikan pemuatan relasi sesudahnya seperlunya (baris `$existingKehadiran` memakai `$pendaftaran->kehadiran` — itu Collection relasi pendaftaran dan perbandingannya memakai `toDateString()` di kedua sisi, JANGAN diubah). Tidak ada perubahan lain di controller ini: bentuk prop `sesi_hari_ini` (id, tanggal, jam_buka, jam_tutup, buka_at, tutup_at) dan seluruh prop lain tetap persis.

Lalu SAPU pola yang sama di seluruh `app/`: cari semua `firstWhere(` / `where(` pada Collection hasil `load()`/`get()` yang membandingkan atribut bercast `date`/`datetime` dengan string tanggal. Untuk tiap temuan: bila perbandingannya memang bisa tidak cocok karena tipe (objek Carbon vs string), perbaiki dengan pola yang sama (query `whereDate`, atau samakan kedua sisi menjadi string tanggal sebelum membandingkan di memori bila query tidak memungkinkan). Laporkan tiap temuan dan keputusannya sebagai tabel. Jangan mengubah perbandingan yang kedua sisinya sudah bertipe sama.

## Gerbang & laporan

Jalankan dan laporkan angka persisnya: test terkait kehadiran (`tests/Feature/Kehadiran` atau yang setara), suite penuh (passed/skipped/failed + assertion, akuntansi harus klop), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Tambahkan atau sesuaikan SATU test fitur yang membuktikan halaman check-in kegiatan multi-hari memuat `sesi_hari_ini` tidak null pada hari sesi (kegiatan dengan sesi hari ini, mahasiswa terdaftar membuka formulir absen, prop `sesi_hari_ini` terisi tanggal hari ini) — test ini harus GAGAL pada kode lama dan LULUS sesudah perbaikan; buktikan dengan menyebut nama testnya. JANGAN commit.

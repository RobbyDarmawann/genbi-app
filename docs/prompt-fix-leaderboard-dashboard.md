# Perbaikan: leaderboard & peringkat dashboard mahasiswa bernilai 0 / salah di PostgreSQL

MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools yang tersedia untukmu (baca berkas, edit berkas, terminal) sampai selesai, termasuk seluruh gerbang di akhir. Jangan berhenti pada ringkasan atau rencana. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

## Bukti cacat (terverifikasi dari payload live produksi, jangan diperdebatkan)

Payload Inertia halaman `/mahasiswa/dashboard` untuk mhs001 di produksi (PostgreSQL):

- `ringkasan.total_poin` = **45** (BENAR — cocok dengan riwayat poinnya: +15 +20 +10)
- `ringkasan.peringkat_saya` = **12** (SALAH — pemilik poin tertinggi tidak mungkin peringkat 12)
- `leaderboard` berisi 10 entri dan **semuanya `total_poin: 0`**, tersusun bukan menurut poin, dan pemilik 45 poin TIDAK masuk 10 besar sama sekali.

Di halaman publik `/statistik`, podium dengan data yang sama tampil BENAR (45 / 20 / 20). Jadi data poinnya sehat; yang rusak khusus jalur peringkat di `app/Http/Controllers/Mahasiswa/DashboardController.php`, yang memakai agregat relasi:

```php
$allRanked = Mahasiswa::query()
    ->where('aktif', true)
    ->with(['user:id,name', 'komsat:id,kode'])
    ->withSum('poinTransaksi as total_poin', 'jumlah')
    ->orderByDesc('total_poin')
    ->orderBy('id')
    ->get();
```

Di SQLite/MySQL lokal hasil query ini tampak benar (itu sebabnya lolos suite); di PostgreSQL nilai agregatnya kembali kosong/nol secara senyap — pola kegagalan khas proyek ini (keluarga yang sama dengan error FOR UPDATE pada agregat). Tugasmu: buktikan penyebab persisnya (tulis SQL yang dihasilkan query itu dan jelaskan mengapa PostgreSQL mengembalikan nilai yang berbeda), lalu perbaiki.

## Perbaikan yang diminta

- Ubah cara DashboardController menghitung total poin per mahasiswa untuk leaderboard & `peringkat_saya` menjadi mekanisme yang nilainya terbukti benar di PostgreSQL maupun SQLite/MySQL — misalnya mengambil jumlah per mahasiswa lewat query agregat langsung ke tabel poin (pola yang sama dengan yang sudah terbukti benar untuk `total_poin` pribadi di controller yang sama dan untuk podium `/statistik`), lalu memetakan hasilnya ke daftar mahasiswa. Bentuk prop TIDAK berubah: `leaderboard` tetap daftar {peringkat, nama, komsat_kode, total_poin, is_current_user} terurut poin menurun (seri: id menaik), dan `peringkat_saya` tetap posisi pengguna di daftar yang sama.
- SAPU pola sekeluarga di seluruh `app/`: semua pemakaian `withSum` / `withCount` / `withAggregate` lain dan semua `orderBy` pada alias agregat. Untuk tiap pemakaian, nilai kebenaran hasilnya terhadap fixture hitung tangan (di mesin uji yang tersedia) dan laporkan sebagai tabel: lokasi → pola → nilai yang dihasilkan → seharusnya → keputusan (dibiarkan / diperbaiki dengan pola yang sama). Perbaiki hanya yang terbukti bisa salah; jangan mengutak-atik yang sudah benar (podium statistik dan hitungan monitoring SUDAH terverifikasi benar di produksi — bila sapuanmu menyentuhnya, jelaskan buktinya dua kali).

## Gerbang & laporan

Jalankan dan laporkan angka persisnya: test terkait dashboard, suite penuh (passed/skipped/failed + assertion, akuntansi harus klop), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Tambahkan SATU test fitur kontrak leaderboard: fixture beberapa mahasiswa dengan poin berbeda-beda (termasuk yang 0), buka dashboard sebagai salah satunya, assert `leaderboard` terurut benar dengan total yang benar dan `peringkat_saya` benar. Catat di laporan bahwa test berjalan di SQLite (di sana cacat lama memang tidak tampak) dan bukti final PostgreSQL adalah verifikasi payload live sesudah deploy oleh penilai — jangan mengklaim bukti Postgres lokal yang tidak ada. JANGAN commit.

## LARANGAN KERAS — REGENERASI WAYFINDER MANUAL (ditempa dari insiden produksi 6 Nov 2026)

- DILARANG menjalankan `php artisan wayfinder:generate` secara manual dalam bentuk apa pun. Perintah CLI itu menghasilkan berkas generated TANPA pembangun `.form()` dan pernah membuat halaman login serta semua halaman berform PUTIH TOTAL di produksi (commit ac26a05), walau seluruh gerbang termasuk TypeScript lulus.
- Berkas di `resources/js/actions/` dan `resources/js/routes/` adalah berkas generated yang versi sehatnya SUDAH ter-commit. JANGAN mengedit, menghapus, memulihkan, atau men-generate ulang berkas-berkas itu. `npm run build` boleh jalan apa adanya (plugin Vite yang men-generate saat build adalah jalur yang benar).
- Kalau suatu gate memodifikasi berkas generated apa pun di luar perubahan yang memang kau buat sendiri: BERHENTI, jangan commit perubahan generated itu, dan laporkan berkasnya apa adanya di laporan akhir.

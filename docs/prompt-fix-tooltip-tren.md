MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

PERBAIKAN MIKRO — TOOLTIP GRAFIK TREN MASIH SALAH NAMA (perbaikan lanjutan Tugas A prompt gabungan rekap, commit 5fd2026).

Gejala terverifikasi dari screenshot pengguna (5 Nov 2026): pada grafik batang "Tren kegiatan dan partisipasi" di halaman Rekap, Legend kini benar (Kegiatan / Pendaftaran / Proyeksi) dan atribut name pada elemen batang juga benar, TETAPI tooltip saat hover kelompok Okt 2026 menampilkan dua baris yang sama-sama bernama "Proyeksi": "Proyeksi : 3" (biru) dan "Proyeksi : 7" (merah). Nilai 3 dan 7 itu adalah nilai BATANG (Kegiatan dan Pendaftaran), bukan nilai proyeksi — jadi nama yang dirender tooltip untuk kedua seri batang salah, kemungkinan tertimpa/terpetakan ke nama seri Line "Proyeksi" yang ditambahkan pada grafik yang sama.

Tugasmu HANYA memperbaiki nama tooltip itu:

1. Baca komponen grafik tren di resources/js/pages/admin/rekap.tsx dan konfigurasi Recharts-nya (Bar, Line, Tooltip, dataKey, name, dan formatter/custom content bila ada). Temukan penyebab kedua seri batang dirender bernama "Proyeksi" di tooltip, dan laporkan akar penyebabnya dalam satu kalimat di laporan.
2. Perbaiki agar tooltip menampilkan nama sesuai serinya: batang biru "Kegiatan", batang merah "Pendaftaran", dan seri garis putus-putus (bila tampil di titik bulan proyeksi) "Proyeksi". Jangan mengubah data, query, rumus regresi, panel proyeksi, maupun tampilan lain grafik. Tanpa library baru.
3. VERIFIKASI WAJIB BERBASIS HOVER SUNGGUHAN (bukan atribut DOM): buka http://127.0.0.1:8000/admin/rekap di browser, arahkan kursor ke kelompok batang Okt 2026, dan buktikan isi tooltip yang TER-RENDER terbaca "Kegiatan : 3" dan "Pendaftaran : 7" (atau angka sesuai data aktif dengan nama seri yang benar dan berbeda). Bila verifikasi otomatis tidak stabil, lakukan hover manual lewat browser dan laporkan teks tooltip persis yang terlihat. Perbaikan TIDAK boleh dinyatakan selesai hanya dari pembacaan kode/atribut SVG.
4. GERBANG: test terkait rekap + suite penuh (patokan tidak turun dari 196 lulus, 7 skip, 0 gagal), npm run types:check, npm run check, npm run build.

Laporan: akar penyebab, file & baris yang diubah, teks tooltip hasil verifikasi persisnya, angka gerbang.
Pesan commit yang disarankan: fix: correct trend chart tooltip series names

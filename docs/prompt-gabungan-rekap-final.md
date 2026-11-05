MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

PROMPT GABUNGAN REKAP FINAL — tiga pekerjaan dalam SATU sesi, satu wilayah yang sama (halaman Laporan/Rekap Internal Manajemen + ekspornya). Kerjakan berurutan: Tugas A dulu, lalu Tugas B. Verifikasi masing-masing terpisah, laporkan per tugas. Commit tetap DUA, terpisah per tugas seperti di bagian akhir.

=== TUGAS A: PROYEKSI TREN (REGRESI LINEAR) + PERBAIKAN LABEL GRAFIK TREN ===

Konteks: rubrik penilaian menuntut adanya algoritma peramalan tren. Halaman Laporan/Rekap Internal Manajemen sudah menyajikan agregat per Komsat dan grafik batang "Tren kegiatan dan partisipasi". Tambahkan proyeksi tren SATU bulan ke depan memakai regresi linear (ordinary least squares) atas deret bulanan yang sudah ada, dan sekalian perbaiki label grafik batang itu. TANPA mengubah skema database dan TANPA mengubah angka rekap/statistik yang sudah ada.

A1. PERBAIKAN LABEL GRAFIK BATANG (kerjakan pertama, satu komponen yang sama):

- Pada grafik "Tren kegiatan dan partisipasi", seri batang biru brand (#0035A0) saat ini salah nama menjadi "Pendaftaran" di tooltip, sehingga kedua seri tampil sama-sama "Pendaftaran". Perbaiki: seri biru diberi name="Kegiatan" sesuai dataKey jumlah kegiatan; seri merah (#ED1C24) tetap name="Pendaftaran".
- Tambahkan komponen Legend dari Recharts pada grafik itu, agar kedua seri terlabel tanpa harus hover.
- Verifikasi browser: hover batang Okt 2026 harus menampilkan "Kegiatan : 3" dan "Pendaftaran : 7" (atau angka sesuai data saat verifikasi, dengan nama seri yang benar dan berbeda).

A2. BACA DULU implementasi rekap saat ini (controller, props, komponen grafik) dan pakai pembagian bulan (bucketing) serta cakupan filter (periode + Komsat) yang SAMA dengan grafik tren yang ada. Bila deret bulanan per Komsat ternyata belum ada, buat bucketing-nya dari tanggal kegiatan dalam periode terpilih dengan pola yang sama seperti agregat lain di halaman itu, dan laporkan temuan itu.

A3. DERET: untuk setiap Komsat, deret y = jumlah partisipasi (baris pendaftaran) per bulan dalam periode terpilih, x = indeks bulan 1..n urut kronologis. Bulan tanpa kegiatan tetap dihitung sebagai titik bernilai 0 di antara bulan pertama dan terakhir periode.

A4. RUMUS (persis ini, jangan diganti metode lain): slope b = Σ(x−x̄)(y−ȳ) / Σ(x−x̄)²; intercept a = ȳ − b·x̄; proyeksi bulan berikutnya ŷ = a + b·(n+1). Hasil proyeksi DIBULATKAN ke bilangan bulat terdekat dan di-CLAMP minimum 0. Arah tren: b > 0,5 → "Naik"; b < −0,5 → "Turun"; selain itu "Stabil".

A5. PENGAMAN: proyeksi hanya dihitung bila n ≥ 4 titik bulanan. Bila kurang, jangan tampilkan angka proyeksi; tampilkan pesan persis: "Data belum cukup untuk proyeksi (minimal 4 bulan)."

A6. TAMPILAN di halaman rekap: (a) grafik tren yang ada diperpanjang dengan segmen GARIS PUTUS-PUTUS satu titik proyeksi untuk deret yang sedang ditampilkan, diberi label "Proyeksi"; (b) panel/tabel "Proyeksi Tren per Komsat": kolom Komsat | Bulan data (n) | Tren (Naik/Turun/Stabil) | Proyeksi partisipasi bulan berikutnya; (c) keterangan metode di bawah panel, teks persis: "Proyeksi dihitung dengan regresi linear dari data partisipasi bulanan periode aktif. Angka proyeksi adalah estimasi arah tren, bukan kepastian." Ikuti design system yang ada; tanpa library baru.

A7. TEST dengan angka yang bisa dihitung tangan, assert EKSAK: deret [10, 12, 14, 16] → slope 2, proyeksi 18, arah Naik; deret [20, 16, 12, 8] → proyeksi 4, arah Turun; deret datar [7, 7, 7, 7] → proyeksi 7, arah Stabil; deret 3 titik → status data belum cukup, tanpa angka proyeksi; deret menurun curam yang proyeksinya negatif → ter-clamp ke 0.

A8. DOKUMEN: sinkronkan docs/06-manual-pengguna.md bagian laporan dengan panel proyeksi + metode; bila README atau dokumen lain menyatakan peramalan belum tersedia, betulkan pernyataan itu.

=== TUGAS B: FORMAT EKSPOR EXCEL ===

Konteks: ekspor Excel laporan (5 sheet: Ringkasan, Rekap Komsat, Kegiatan, Kehadiran, Transaksi Poin) isinya sudah benar tetapi tampilannya mentah: tanpa judul, header polos, tanpa garis tabel. Poles PRESENTASINYA saja — dilarang mengubah data, angka, susunan kolom, dan nama sheet.

B1. Baca kelas export yang ada (maatwebsite/excel) dan terapkan styling lewat concern yang sesuai pola proyek. Untuk SETIAP sheet: (a) baris judul di atas: "Sistem Informasi GenBI Gorontalo — [nama sheet]" tebal; (b) baris konteks di bawahnya: periode yang diekspor + tanggal ekspor (format: "Periode: {nama periode} | Diekspor: {dd/mm/yyyy HH:mm} WITA"); (c) baris header kolom: isian biru brand #0035A0, teks putih tebal, rata tengah; (d) garis tabel: border tipis pada seluruh sel data termasuk header; baris data berselang latar sangat tipis bila mudah diterapkan konsisten; (e) lebar kolom diatur agar isi terbaca (lebar eksplisit per kolom atau autosize); (f) format angka: bilangan bulat dengan pemisah ribuan, kolom persentase satu desimal dengan akhiran %; (g) freeze panes tepat di bawah baris header.

B2. Bila ada test ekspor yang mengunci posisi sel absolut, perbarui test itu agar mencari isi berdasarkan label/teks (bukan koordinat buta) dan SEBUTKAN perubahan test ini di laporan — jangan diam-diam mengubah ekspektasi angka; semua total harus tetap sama persis.

B3. VERIFIKASI: hasilkan berkas ekspor sungguhan dari data demo, lalu baca kembali berkasnya secara programatis dan laporkan per sheet: judul ada, warna isian header = 0035A0, border header/data ada, dan total angka sama dengan sebelum pemolesan.

=== GERBANG & LAPORAN ===
Test terkait + suite penuh (patokan tidak turun dari 192 lulus, 7 skip, 0 gagal; Tugas A menambah test baru sehingga jumlah lulus harus NAIK), Pint, composer types:check, npm run types:check, npm run check, npm run build — semua hijau. Laporan per tugas: file berubah, hasil verifikasi dengan angka/bukti persisnya (termasuk bukti hover tooltip untuk A1 dan bukti baca-balik Excel untuk B3).

Pesan commit (DUA commit terpisah):

- Tugas A: feat: add linear regression trend projection to recap
- Tugas B: style: format Excel export sheets

MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 6. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Tugas: Pembina sejajar Ketua Umum sebagai puncak bersama di direktori kepengurusan

## Konteks terverifikasi (hasil pemeriksaan kode & data live — pakai sebagai peta, verifikasi ulang seperlunya)

- Komponen target: `resources/js/pages/public/kepengurusan.tsx`, komponen `OrgChartGroup`. Halaman mahasiswa (`resources/js/pages/mahasiswa/kepengurusan.tsx`) memakai ulang komponen yang sama lewat `DirektoriKepengurusanContent`, jadi perbaikan di satu tempat berlaku untuk keduanya.
- Cara potong tingkat SAAT INI di `OrgChartGroup` (berlaku untuk semua kelompok): `tier1 = entries[0]` (satu kartu `featured` di puncak), `tier2 = entries.slice(1, 4)`, `tier3 = entries.slice(4)`. Desktop (`hidden md:block`): pohon hierarki dengan garis penghubung `bg-border`. Mobile (`md:hidden`): rel vertikal dengan label "Pimpinan Utama" untuk tier1.
- Ukuran kartu `KepengurusanPlayingCard`: `featured` max-w 270px (sm 290px), `medium` 240/255px, `standard` 225/235px, rasio 3/4. Perilaku flip kartu (klik mengunci, hover, Escape) SUDAH benar — jangan diubah.
- Fakta data (terverifikasi dari situs live):
    - Periode historis (dari KepengurusanHistorisSeeder) di kelompok Wilayah SELALU punya jabatan **Pembina** dan **Ketua Umum**. Pada sebagian besar periode urutan tersimpannya Pembina dulu; pada SATU periode urutan tersimpannya justru **Ketua Umum dulu, baru Pembina** — jadi deteksi TIDAK BOLEH berdasarkan posisi/urutan.
    - Periode aktif demo (2025–2026) TIDAK punya Pembina; puncak kelompok Wilayah-nya berjudul **"Ketua Wilayah"** dengan Ketua Komsat di tingkat bawahnya. Struktur ini TIDAK BOLEH berubah tampilannya.
    - Kelompok Komsat: kepala kelompoknya Ketua Komisariat/Ketua Komsat — TIDAK disentuh tugas ini.

## Keputusan desain (dari pemilik, sudah final)

- Di kelompok **Wilayah** yang memiliki Pembina: **Pembina menjadi posisi nomor 1 dan tampil SEJAJAR dengan Ketua Umum** sebagai puncak bersama — Pembina di **KIRI**, Ketua Umum di **KANAN**, keduanya ukuran `featured`, satu baris, di tengah.
- Di **mobile**: pasangan puncak itu bisa **digeser horizontal (scroll menyamping di dalam strip-nya)** supaya kedua kartu tampil utuh pada ukuran aslinya; halaman tidak boleh ikut bergeser.
- Di **desktop**: pasangan itu tampil utuh tanpa scroll, tetap di tengah, garis hierarki ke tingkat bawah disesuaikan dengan rapi.
- Kelompok/periode TANPA Pembina: tampilan harus PERSIS seperti sekarang (puncak satu kartu).

## BAGIAN 1 — Deteksi & pemotongan tingkat baru (khusus kelompok Wilayah)

1. Di `OrgChartGroup`, untuk kelompok Wilayah saja, pisahkan entri Pembina dari daftar berdasarkan TEKS jabatan: entri yang `jabatan`-nya (sesudah trim, tidak peka huruf besar/kecil) DIAWALI kata **"Pembina"**.
2. Bentuk ulang tingkatannya bila Pembina ditemukan:
    - `puncak = [pembina, ketua]` — ketua = entri PERTAMA dari sisa daftar (apa pun judulnya: Ketua Umum / Ketua Wilayah / lainnya). Pembina selalu elemen pertama (posisi 1).
    - `tier2` = 3 entri berikutnya sesudah ketua; `tier3` = sisanya — sama seperti pemotongan lama, hanya digeser oleh keluarnya Pembina.
    - Entri "Ketua Komisariat" yang berada di kelompok Wilayah (ada di periode historis) tetap di tingkat bawah seperti sekarang; jangan diberi perlakuan khusus.
3. Bila Pembina TIDAK ditemukan: pakai pemotongan lama persis (`tier1` tunggal) — jalur ini tidak boleh berubah perilaku sama sekali.
4. Kelompok Komsat: pemotongan dan tampilan tidak berubah sama sekali.
5. Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test bila kau menambah test). DILARANG mengubah controller, seeder, atau data.

## BAGIAN 2 — Tampilan desktop (≥768 px)

1. Bila `puncak` berisi 2 kartu: render keduanya dalam satu baris flex di tengah (`justify-center`, jarak wajar mengikuti ritme garis yang ada, mis. `gap-10`/`gap-14` — sesuaikan supaya garis penghubung di bawah rapi).
2. Garis penghubung WAJIB disesuaikan dengan pola yang sudah dipakai tingkat 2 (garis vertikal pendek dari tiap kartu, bar horizontal penghubung, lalu satu garis vertikal dari TENGAH bar turun ke tingkat 2):
    - Dari bawah TIAP kartu puncak: garis vertikal pendek (`w-0.5 bg-border`, tinggi mengikuti pola lama ±h-8).
    - Bar horizontal `h-0.5 bg-border` menghubungkan kedua titik turun itu.
    - Dari tengah bar: garis vertikal turun ke tingkat 2 (yang kemudian bercabang seperti sekarang).
    - Bila tidak ada tier2/tier3, garis tidak perlu digambar.
3. Bila `puncak` berisi 1 kartu (tanpa Pembina): render jalur lama persis seperti sekarang.
4. Tingkat 2 dan 3: tidak ada perubahan.

## BAGIAN 3 — Tampilan mobile (<768 px)

1. Bila `puncak` berisi 2 kartu: gantikan blok tier1 pada rel vertikal dengan sebuah **strip geser horizontal**:
    - Label "Pimpinan Utama" tetap tampil di atas strip (seperti sekarang).
    - Kontainer strip: `overflow-x-auto` dengan kedua kartu `featured` berdampingan pada ukuran aslinya (`flex-none`, TIDAK menyusut), jarak wajar.
    - Strip boleh menempel pada rel/garis vertikal yang ada atau berdiri sendiri di atas rel — pilih yang paling rapi dan konsisten secara visual, jelaskan pilihanmu di laporan.
    - Dokumen halaman TIDAK BOLEH mendapat overflow horizontal global gara-gara strip ini (yang bergeser hanya isi strip).
    - Sembunyikan/lembutkan scrollbar strip mengikuti pola aplikasi yang sudah ada (bila tidak ada pola, pakai cara paling sederhana dan sebutkan di laporan).
2. Tier2 dan tier3 di mobile: tetap rel vertikal seperti sekarang, tidak berubah.
3. Bila `puncak` 1 kartu: mobile persis seperti sekarang.

## BAGIAN 4 — Verifikasi terukur (Playwright/Chromium, bukti sebelum–sesudah)

Verifikasi dengan data LOKAL (seeder historis tersedia di proyek) pada tiga kasus:

1. **Periode Wilayah ber-Pembina dengan urutan simpan normal** (Pembina tercatat sebelum Ketua Umum): pasangan tampil — Pembina kiri, Ketua Umum kanan.
2. **Periode Wilayah yang urutan simpannya Ketua Umum SEBELUM Pembina**: Pembina tetap tampil pertama/kiri (membuktikan deteksi berbasis jabatan, bukan posisi).
3. **Periode aktif demo tanpa Pembina**: tampilan puncak identik dengan sebelum perubahan (Ketua Wilayah sendirian, Ketua Komsat di bawahnya).

Lebar uji: **360 px** (strip bisa digeser, kedua kartu utuh pada ukuran asli, overflow dokumen = 0), **768 px** dan **1280 px** (pasangan di tengah, tanpa scroll, garis penghubung rapi dan menyambung). Sertakan screenshot dan/atau angka pengukuran tiap kasus di laporan. Periksa halaman publik `/kepengurusan`; halaman mahasiswa memakai komponen sama — cukup nyatakan itu, tidak wajib diuji terpisah.

## BAGIAN 5 — LARANGAN KERAS (ditempa dari insiden produksi 6 Nov 2026)

- DILARANG menjalankan `php artisan wayfinder:generate` secara manual dalam bentuk apa pun.
- Berkas `resources/js/actions/` dan `resources/js/routes/` JANGAN diedit/dihapus/dipulihkan/di-generate ulang. `npm run build` boleh jalan apa adanya.
- Jangan mengubah data/seeder/controller untuk membuat kasus uji "kelihatan benar" — kasus uji pakai data seeder yang memang sudah ada.
- JANGAN commit. Pemilik yang commit.

## BAGIAN 6 — Gerbang & LAPORAN AKHIR

Jalankan dan laporkan angka persisnya: test terkait + suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Akuntansi suite harus klop (passed + skipped + failed = total).

LAPORAN AKHIR memuat:

1. Cara deteksi Pembina yang kau implementasikan + di mana pemotongan tingkat diubah.
2. Hasil verifikasi tiga kasus BAGIAN 4 dengan bukti (screenshot/angka) per lebar.
3. Pilihan tata letak mobile yang kau ambil (strip menempel rel atau berdiri sendiri) + alasannya.
4. Hasil semua gerbang dengan angka persis.
5. Daftar berkas yang diubah (git status). Tidak ada commit.

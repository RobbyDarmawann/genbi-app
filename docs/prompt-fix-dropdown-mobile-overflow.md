MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 6. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Tugas: perbaiki dropdown yang keluar batas / bergeser di tampilan HP

## Konteks (baca dulu)

- Aplikasi Laravel + React (Inertia) + Tailwind + komponen UI bergaya shadcn/Radix di `resources/js/components/ui/`.
- Keluhan pemilik situs (6 Nov 2026, dari pemakaian HP asli): pada tampilan mobile, beberapa dropdown kadang **melewati batas layar**. Contoh konkret yang ia sebut: di halaman Kegiatan ada dropdown **"Pilih Komsat"** yang panel/isinya **miring bergeser ke kiri** sampai keluar batas. Ia meminta dropdown disesuaikan supaya rapi di HP.

## BAGIAN 1 — Inventarisasi dropdown

1. Cari semua pemakaian komponen dropdown/pilih di `resources/js/`:
    - `Select` dari `@/components/ui/select` (SelectTrigger/SelectContent),
    - `DropdownMenu` dari `@/components/ui/dropdown-menu`,
    - elemen `<select>` native,
    - komponen pemilih buatan sendiri (combobox, popover pemilih, dsb.).
2. Temukan secara spesifik dropdown **"Pilih Komsat"** di halaman-halaman Kegiatan (cari teks/label "Komsat" di halaman & komponen Kegiatan, termasuk formulir buat/edit dan filter daftar). Catat berkas + halaman tempatnya dirender.
3. Tulis daftar inventaris di laporan akhir (komponen, berkas, halaman).

## BAGIAN 2 — Reproduksi terukur di lebar HP

1. Jalankan pemeriksaan browser pada lebar viewport **360 px** (dan ulangi ringkas di 390 px bila perlu) terhadap halaman yang memuat dropdown "Pilih Komsat" itu:
    - Buka dropdown-nya.
    - Ukur/laporkan: posisi tepi kiri & kanan panel dropdown terhadap lebar viewport, apakah panel keluar layar, apakah halaman jadi bisa digeser menyamping (overflow horizontal dokumen) saat dropdown terbuka maupun tertutup.
    - Ambil bukti (screenshot atau angka pengukuran) SEBELUM perbaikan.
2. Nyatakan akar masalahnya secara spesifik sebelum memperbaiki. Kandidat yang wajib diperiksa (buktikan mana yang benar, jangan menebak):
    - `SelectContent` Radix dengan `position="popper"` tanpa batas lebar: panel mengikuti lebar pemicu di desktop tetapi di layar sempit posisinya bergeser keluar.
    - Panel tidak punya `max-width` terhadap viewport.
    - Leluhur (ancestor) dengan `transform`, `overflow`, atau lebar tetap (mis. `w-screen`, grid/kolom) yang menggeser acuan posisi popper.
    - Kelas lebar pada pemicu/panel (mis. `w-[...]` tetap) yang lebih lebar dari layar.
3. Periksa juga komponen UI bersama-nya (`resources/js/components/ui/select.tsx` dan `dropdown-menu.tsx`) — apakah pola cacatnya berasal dari komponen bersama (berarti satu perbaikan di sana menyembuhkan semua halaman) atau dari pemakaian per halaman.

## BAGIAN 2B — Tambahan: dashboard admin mobile ikut melewati batas kanan

Keluhan kedua pemilik situs (6 Nov 2026, malam yang sama): pada **dashboard admin versi mobile**, ada tampilan yang **melewati batas ke kanan** juga. Ini satu keluarga masalah dengan dropdown (overflow horizontal mobile), jadi kerjakan dalam tugas yang sama:

1. Buka halaman dashboard admin (`/admin/dashboard`) pada viewport 360 px dan 390 px; ukur elemen apa saja yang membuat dokumen bisa digeser menyamping / melewati tepi kanan (kandidat yang wajib diperiksa: grid kartu statistik, grafik/chart — termasuk kontainer Recharts, bagian Ringkasan Sistem, tabel atau daftar apa pun di halaman itu). Sertakan bukti sebelum (angka/screenshot).
2. Perbaiki tata letaknya supaya pada 360/390 px tidak ada overflow horizontal sama sekali, tanpa mengubah data/angka/logika dan tanpa mengubah tampilan desktop (≥768 px).
3. Verifikasi sesudah dengan cara yang sama seperti BAGIAN 4 dan laporkan di laporan akhir sebagai sub-bagian tersendiri.

## BAGIAN 3 — Perbaikan

1. Perbaiki di tingkat yang benar:
    - Bila akar masalah ada di komponen bersama, perbaiki SEKALI di komponen bersama itu (mis. batasi lebar panel `max-w-[calc(100vw-2rem)]`, atur ulang posisi/offset popper supaya panel selalu di dalam viewport dan sejajar dengan pemicunya).
    - Bila akar masalah per halaman, perbaiki di halaman itu dan sebutkan alasannya.
2. Hasil akhir yang WAJIB dicapai pada 360 px dan 390 px:
    - Panel dropdown selalu utuh di dalam viewport (tidak ada tepi yang keluar layar), sejajar wajar dengan pemicunya (tidak miring/bergeser ke kiri).
    - Tidak ada overflow horizontal dokumen, dropdown terbuka maupun tertutup.
    - Item di dalam panel terbaca penuh (tidak terpotong menyamping).
3. Tampilan desktop (≥768 px) TIDAK BOLEH berubah/bergeser dari sebelumnya — perbaikan tidak boleh mengorbankan desktop.
4. Jangan mengubah data, opsi, logika, atau perilaku pilih dropdown; ini murni perbaikan tata letak/posisi. Jangan menambah library baru.

## BAGIAN 4 — Verifikasi sesudah perbaikan

1. Ulangi pengukuran BAGIAN 2 pada halaman yang sama: panel di dalam viewport, sejajar, tanpa overflow horizontal — sertakan bukti sesudah (screenshot/angka) di laporan.
2. Cek titik lain secara ringkas (minimal 2 dropdown lain dari inventaris BAGIAN 1, idealnya yang memakai komponen bersama yang sama): pastikan tidak ikut rusak dan tidak keluar batas di 360 px.
3. Cek sekilas lebar desktop (≥1024 px) pada halaman yang diperbaiki: dropdown tampil seperti sebelumnya.

## BAGIAN 5 — LARANGAN KERAS (ditempa dari insiden produksi 6 Nov 2026)

- DILARANG menjalankan `php artisan wayfinder:generate` secara manual dalam bentuk apa pun — perintah CLI itu pernah menghasilkan berkas generated tanpa pembangun `.form()` dan membuat halaman login + semua halaman berform putih total di produksi.
- Berkas di `resources/js/actions/` dan `resources/js/routes/` JANGAN diedit, dihapus, dipulihkan, atau di-generate ulang. `npm run build` boleh jalan apa adanya (plugin Vite adalah jalur generate yang benar).
- Kalau suatu gate memodifikasi berkas generated apa pun: BERHENTI, jangan commit perubahan generated itu, laporkan apa adanya.
- JANGAN commit. Pemilik yang commit.

## BAGIAN 6 — Gerbang & LAPORAN AKHIR

Jalankan dan laporkan angka persisnya: test terkait yang tersentuh perubahannya + suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`. Akuntansi suite harus klop (passed + skipped + failed = total).

LAPORAN AKHIR memuat:

1. Inventaris dropdown (BAGIAN 1) dan lokasi persis dropdown "Pilih Komsat".
2. Akar masalah terukur + bukti sebelum (angka/screenshot).
3. Perbaikan yang dilakukan per berkas + alasannya.
4. Bukti sesudah pada 360/390 px + cek desktop + cek 2 dropdown lain.
5. Hasil semua gerbang dengan angka persis.
6. Daftar berkas yang diubah (git status). Tidak ada commit.

MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

PERBAIKAN BUILD HEROKU — PLUGIN WAYFINDER GAGAL KARENA PHP BELUM TERSEDIA SAAT BUILD NODE.

BUKTI KEGAGALAN (log deploy Heroku, buildpack heroku/nodejs berjalan SEBELUM heroku/php):
[plugin @laravel/vite-plugin-wayfinder] RolldownError: Error generating types: Error: Command failed: php artisan wayfinder:generate --with-form
/bin/sh: 1: php: not found
Akibatnya `vp build` gagal sebelum transform modul apa pun. Di lokal build selalu lulus karena PHP Laragon tersedia. Ini BUKAN bug aplikasi — jangan mengubah kode aplikasi, route, atau halaman apa pun.

STRATEGI PERBAIKAN (satu-satunya jalur; jangan mengganti urutan buildpack dan jangan mencabut paket plugin): berkas hasil generate Wayfinder yang sudah ada di lokal ikut di-commit, dan build di lingkungan tanpa PHP diperintahkan untuk TIDAK men-generate ulang.

TUGAS:

1. Identifikasi dari konfigurasi Vite dan impor kode aplikasi: direktori/berkas hasil generate plugin @laravel/vite-plugin-wayfinder (umumnya resources/js/routes dan resources/js/actions, plus berkas types bila ada). Jalankan `npm run build` normal sekali agar hasil generate mutakhir, lalu pastikan seluruh berkas hasil generate itu TERLACAK git (bukan ter-ignore): periksa `git status` dan .gitignore; bila ada aturan ignore yang menelan berkas hasil generate itu, persempit/perbaiki aturannya hanya untuk jalur tersebut dan laporkan baris yang diubah.
2. Ubah HANYA file konfigurasi Vite: plugin wayfinder() dimasukkan ke daftar plugin HANYA bila variabel lingkungan WAYFINDER_GENERATE tidak bernilai 'false' (baca lewat process.env di file konfigurasi). Perilaku bawaan tanpa variabel itu = sama persis seperti sekarang (generate aktif) sehingga pengembangan lokal tidak berubah sama sekali. Jangan mengubah script "build" di package.json dan jangan menambah dependensi.
3. PEMBUKTIAN LOKAL dua arah (wajib dua-duanya):
   a. `npm run build` normal → sukses (generate tetap berjalan seperti biasa).
   b. Hapus folder public/build, lalu jalankan build dengan WAYFINDER_GENERATE=false terpasang di lingkungan shell (PowerShell: $env:WAYFINDER_GENERATE='false') → build SUKSES tanpa menjalankan php artisan, dan public/build/manifest.json ada. Sesudahnya kembalikan variabel ke keadaan semula.
4. Tulis di laporan: daftar berkas hasil generate yang kini terlacak git, perubahan .gitignore bila ada, dan satu baris instruksi untuk pemilik proyek persis seperti ini: "Di Heroku Settings → Config Vars tambahkan WAYFINDER_GENERATE = false sebelum Deploy Branch ulang."

GERBANG: suite penuh 0 failed dengan passed tidak di bawah baseline perintah pendamping, vendor\bin\pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: hasil tiap butir tugas + hasil pembuktian dua arah + angka gerbang.
Pesan commit yang disarankan: fix: allow frontend build without PHP for Heroku (commit generated Wayfinder routes)

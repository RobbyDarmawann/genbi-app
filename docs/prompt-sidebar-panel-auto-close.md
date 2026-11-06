MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

SIDEBAR PANEL MOBILE HARUS TERTUTUP OTOMATIS SESUDAH NAVIGASI (IM & MAHASISWA).

MASALAH (terverifikasi pengguna di HP asli): di panel terautentikasi, sidebar mobile (drawer "Menu utama") TIDAK tertutup sesudah pengguna menekan menu — halaman di belakangnya berpindah, tetapi drawer tetap terbuka menutupi halaman tujuan dan harus ditutup manual. Ini sisa Bagian C dari prompt header/navigasi mobile yang ternyata belum terimplementasi; prompt ini menutupnya secara khusus.

TUGAS:

1. Audit layout panel (AppLayout + komponen sidebar dan navigasinya — pola shadcn Sidebar starter kit): identifikasi state drawer mobile (umumnya `openMobile`/`setOpenMobile` dari konteks `useSidebar`) dan semua tautan di dalam sidebar: menu utama, submenu bila ada, tautan "Lihat Situs Publik", serta tautan apa pun di footer/user-card sidebar yang memicu perpindahan halaman.
2. Terapkan penutupan otomatis: setiap klik pada tautan navigasi di dalam sidebar MOBILE menutup drawer sebagai bagian dari perpindahan halaman (mekanisme tersedikit yang konsisten: panggil `setOpenMobile(false)` pada klik tautan, atau tutup pada event navigasi Inertia — pilih satu, terapkan seragam ke semua tautan di butir 1, dan pastikan halaman tujuan tampil tanpa drawer/overlay di atasnya).
3. Hanya drawer mobile yang terpengaruh: state sidebar DESKTOP (terbuka / terciut ikon, termasuk persistensinya) tidak berubah oleh navigasi. Item yang BUKAN navigasi halaman (mis. tombol buka dropdown user, tombol ciutkan sidebar) tidak ikut diperlakukan sebagai pemicu tutup selain perilaku yang sudah ada.
4. Audit silang singkat: periksa apakah header judul kelompok di direktori publik /kepengurusan masih ber-perilaku sticky saat halaman digulir (buka halaman dan gulir). Bila masih sticky, terapkan pencabutannya sesuai file docs/prompt-cabut-sticky-header-kelompok.md (header kelompok menjadi statis + scrollspy aktif di daftar "Isi periode ini"); bila sudah statis, cukup laporkan buktinya — jangan mengubah apa pun di halaman itu selain kebutuhan butir ini.

TEST: asersi yang ada tidak berubah; suite tidak boleh turun dari baseline pada perintah pendamping dan failed tetap 0.

VERIFIKASI BROWSER (Playwright, viewport 390 px, login lewat formulir memakai akun demo): sebagai `internal` — buka drawer sidebar, tekan menu "Kegiatan": URL berpindah ke halaman Kegiatan DAN drawer sudah tertutup (tidak ada overlay/sheet terlihat); ulangi dengan satu menu lain (mis. "Kepengurusan"). Sebagai `mhs001` — buka drawer, tekan satu menu mahasiswa: hasil sama. Pada 1280 px: tekan menu navigasi dan pastikan keadaan sidebar desktop tidak berubah. Console error 0. Laporkan per peran + per ukuran. Berkas verifikasi sementara (termasuk kredensial apa pun yang dipakai skrip — jangan menulis kata sandi akun ke berkas yang tertinggal di repo) dihapus sesudah selesai.

GERBANG: test terkait + suite penuh, vendor\bin\pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: mekanisme yang dipakai + file berubah, hasil audit silang butir 4, hasil verifikasi per peran, angka gerbang.
Pesan commit yang disarankan: fix: close mobile panel sidebar after navigation

MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

CABUT HEADER KELOMPOK STICKY DI /kepengurusan — GANTI DENGAN KEADAAN AKTIF (SCROLLSPY) PADA NAVIGASI KELOMPOK.

LATAR. Revisi linimasa vertikal menambahkan header judul kelompok yang sticky (menempel di bawah header publik selama kelompok digulir) di direktori kepengurusan. Di pemakaian nyata header sticky itu mengganggu di mobile maupun desktop: ia menutupi/memakan ruang baca dan menduplikasi informasi yang sudah disediakan navigasi kelompok. Keputusan desain final: header sticky DICABUT; sebagai gantinya, penanda posisi baca dipindah ke navigasi kelompok yang sudah ada dalam bentuk keadaan aktif mengikuti guliran (scrollspy).

TUGAS:

1. Di halaman publik kepengurusan, kembalikan header tiap kelompok lingkup (badge "Struktur Organisasi" + judul + subjudul) menjadi header seksi STATIS biasa (tidak sticky, tidak menempel) dengan desain visual yang sama. Pertahankan `id` kelompok dan `scroll-mt` yang benar agar lompatan jangkar tetap mendarat pas di judul kelompok tanpa tertutup header publik.
2. Scrollspy desktop: pada daftar lompatan "Isi periode ini" di rel kiri, tautan kelompok yang seksinya sedang berada di area baca diberi keadaan AKTIF yang jelas (aksen biru brand #0035a0: teks tebal berwarna brand dan/atau penanda titik/garis di sisi tautan — ikuti bahasa desain rel yang ada). Gunakan IntersectionObserver atas seksi-seksi kelompok dengan rootMargin yang membuat tepat satu kelompok aktif pada satu waktu (kelompok yang menempati area atas-tengah viewport); saat posisi di paling atas halaman, kelompok pertama aktif. Mengklik tautan tetap menggulir halus ke kelompoknya dan keadaan aktif menyusul secara alami.
3. Scrollspy mobile: terapkan prinsip yang sama pada chip lompatan kelompok dari prompt header/navigasi mobile (chip kelompok yang sedang dibaca tertandai aktif). Bila prompt itu belum dijalankan, cukup pastikan pencabutan header sticky di butir 1 berlaku juga di mobile dan jangan membangun chip baru di prompt ini.
4. Hormati prefers-reduced-motion untuk gulir halus; observer dibersihkan dengan benar saat komponen dilepas/ganti periode (tidak ada kebocoran listener saat berpindah periode/lingkup).

YANG TIDAK BERUBAH: backend, props, parameter URL, seeder, isi & desain kartu, garis hierarki antar kelompok, rel periode vertikal, header publik, dan chip lingkup/periode.

TEST: asersi data tidak berubah; suite tidak boleh turun dari baseline pada perintah pendamping dan failed tetap 0.

VERIFIKASI BROWSER (http://127.0.0.1:8000/kepengurusan, tanpa login; data 7 periode): buka Periode 2020/2021 lingkup "Semua" pada 1280 px — gulir perlahan dari atas ke bawah: tidak ada header kelompok yang menempel/menutupi kartu; keadaan aktif di "Isi periode ini" berpindah berurutan Wilayah → Komsat UNG → Komsat IAIN → Komsat UG mengikuti posisi gulir; klik tiap tautan tetap mendarat tepat di kelompoknya. Pada 360/390 px: header kelompok statis tidak menutupi apa pun saat menggulir seluruh halaman. Overflow 0 px dan console error 0 di 360/390/768/1280/1536. Laporkan per lebar. Berkas verifikasi sementara dihapus dari repo sesudah selesai.

GERBANG: test terkait + suite penuh, vendor\bin\pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: file berubah, cara scrollspy diimplementasikan (termasuk rootMargin yang dipakai), hasil verifikasi, angka gerbang.
Pesan commit yang disarankan: fix: replace sticky board group headers with scrollspy rail state

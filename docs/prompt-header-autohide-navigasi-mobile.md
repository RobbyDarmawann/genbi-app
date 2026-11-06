MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

HEADER PUBLIK SEMBUNYI/MUNCUL MENGIKUTI ARAH GULIR + NAVIGASI KELOMPOK MOBILE DI /kepengurusan + SIDEBAR PANEL TERTUTUP OTOMATIS SESUDAH NAVIGASI DI MOBILE.

BAGIAN A — Header publik hide-on-scroll (semua halaman publik):

1. Audit header di layout publik (PublicLayout / komponen header-nya): saat ini sticky dan selalu tampil, menempati 64 px (h-16) di atas layar.
2. Ubah perilakunya menjadi: header MENGHILANG dengan transisi halus (translate-y negatif penuh / setara) ketika pengguna menggulir ke BAWAH melewati ambang kecil (sekitar 64–96 px dari atas), dan MUNCUL KEMBALI seketika ketika pengguna menggulir ke ATAS berapa pun jaraknya, serta selalu tampil penuh saat posisi di paling atas halaman (scrollY mendekati 0). Sembunyi/muncul TIDAK boleh membuat isi halaman melompat (header tetap sticky/fixed di luar aliran konten seperti sekarang — hanya transform/visibilitasnya yang berubah).
3. Syarat teknis: deteksi arah gulir memakai requestAnimationFrame/throttle ringan (tidak ada listener scroll mentah yang berat); keadaan disimpan lokal di komponen header; menu/dropdown yang sedang terbuka di dalam header tidak boleh memaksa header hilang di tengah interaksi (bila ada menu mobile/dropdown yang terbuka, header tetap tampil sampai menu ditutup); fokus keyboard di dalam header membuatnya tampil; transisi menghormati prefers-reduced-motion (instan tanpa animasi).
4. Sesuaikan offset elemen sticky lain yang menempel di bawah header publik agar tidak mengambang aneh saat header tersembunyi: khususnya header kelompok sticky di halaman kepengurusan (sekarang top-16) — saat header publik tersembunyi, header kelompok boleh naik menempel ke tepi atas layar (top-0) dengan transisi yang sama; perilaku saat header tampil tetap top-16 seperti sekarang. Bila penyesuaian ini terbukti rapuh, pertahankan top-16 tetap dan laporkan alasannya — jangan mengorbankan kestabilan demi efek ini.

BAGIAN B — Navigasi kelompok khusus mobile di /kepengurusan (di bawah lg):

1. Masalah: pada lingkup "Semua", pengguna mobile menggulir sangat panjang melewati kelompok Wilayah sebelum mencapai Komsat yang dicarinya; chip lingkup memang menyaring, tetapi tidak ada jalan pintas saat melihat "Semua".
2. Tambahkan, HANYA di bawah lg dan HANYA saat lingkup = "Semua" serta ada lebih dari satu kelompok tampil: baris chip lompatan kelompok yang sticky tepat di bawah header publik (di bawah baris pill periode & chip lingkup yang sudah ada — audit susunan sticky yang ada agar tidak saling menumpuk; bila terlalu banyak lapisan sticky, gabungkan pill periode + chip lingkup + chip kelompok ke dalam SATU wadah sticky mobile yang ringkas). Chip berisi nama kelompok yang tampil (Wilayah + Komsat-Komsat berdata); mengklik chip menggulir halus ke header kelompok itu (hormati prefers-reduced-motion, scroll-margin benar).
3. Chip kelompok yang sedang berada di layar tertandai aktif mengikuti posisi gulir (scrollspy sederhana berbasis IntersectionObserver) — bila scrollspy terbukti tidak stabil di implementasi, tampilkan chip tanpa keadaan aktif dan laporkan alasannya; jangan memaksakan.
4. Di desktop (≥ lg) bagian ini TIDAK ditampilkan (daftar "Isi periode ini" di rel kiri sudah mengemban fungsi ini).

BAGIAN C — Sidebar panel (IM & mahasiswa) tertutup otomatis sesudah navigasi di mobile:

1. Audit layout panel terautentikasi (layout aplikasi untuk Internal Manajemen & mahasiswa): di mobile sidebar tampil sebagai drawer/sheet yang saat ini tetap terbuka sesudah pengguna menekan salah satu menu navigasi, sehingga menutupi halaman tujuan.
2. Ubah perilakunya: menekan tautan navigasi mana pun di sidebar mobile MENUTUP drawer itu sebagai bagian dari perpindahan halaman (tertutup saat navigasi dimulai/berhasil — saat halaman tujuan tampil, drawer sudah hilang dan tidak perlu ditutup manual). Terapkan lewat mekanisme yang sesuai struktur kode yang ada (mis. setOpenMobile(false) dari konteks sidebar pada klik tautan, atau berlangganan event navigasi Inertia) — pilih yang paling sedikit menyentuh kode dan konsisten untuk SEMUA tautan di sidebar (menu utama, submenu bila ada, dan tautan di footer sidebar bila ada).
3. Hanya drawer MOBILE yang terpengaruh: keadaan sidebar desktop (terbuka/terciut versi ikon) TIDAK berubah oleh navigasi dan tetap mengikuti pilihan pengguna seperti sekarang. Perilaku ini berlaku sama di panel Internal Manajemen maupun panel mahasiswa (keduanya memakai layout yang sama — verifikasi dari audit).

YANG TIDAK BERUBAH: backend, props, parameter URL, seeder, komponen kartu, perilaku flip, linimasa vertikal desktop, header publik selain Bagian A, dan halaman kepengurusan selain Bagian B.

TEST: asersi data tidak boleh berubah; suite tidak boleh turun dari baseline pada perintah pendamping dan failed tetap 0. Bila ada test yang menyentuh markup header/layout publik, sesuaikan seperlunya tanpa melemahkan asersi.

VERIFIKASI BROWSER (tanpa login; 360/390/768/1280/1536): (a) di /kepengurusan dan satu halaman publik lain (mis. /jadwal): gulir ke bawah jauh → header publik hilang; gulir ke atas sedikit → header muncul lagi; kembali ke paling atas → header tampil; tidak ada lompatan isi dan overflow 0 px di semua lebar; (b) mobile 360/390 lingkup "Semua" Periode 2020/2021: chip kelompok tampil, klik "Komsat IAIN" menggulir tepat ke kelompok IAIN (header kelompoknya tidak tertutup elemen sticky), chip aktif mengikuti gulir bila scrollspy diterapkan; (c) desktop 1280: chip kelompok mobile tidak tampil, rel + "Isi periode ini" tetap bekerja; (d) panel panel: pada 360/390 px login sebagai internal dan sebagai mhs001 — buka sidebar, tekan satu menu navigasi: halaman berpindah dan sidebar sudah tertutup saat halaman tujuan tampil; pada 1280 px menekan menu tidak mengubah keadaan sidebar desktop; console error 0 di semua pemeriksaan. Laporkan per butir + per lebar. Berkas verifikasi sementara dihapus dari repo sesudah selesai.

GERBANG: test terkait + suite penuh, vendor\bin\pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: file berubah, keputusan teknis (ambang gulir, perlakuan offset sticky kepengurusan, scrollspy jadi/tidak beserta alasan), hasil verifikasi, angka gerbang.
Pesan commit yang disarankan: feat: auto-hide public header, add mobile group jumps, auto-close panel sidebar

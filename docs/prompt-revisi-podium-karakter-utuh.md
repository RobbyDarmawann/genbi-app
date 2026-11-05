MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

REVISI TAMPILAN KARAKTER DI PODIUM STATISTIK — WAJAH JANGAN TERTUTUP LINGKARAN.

KONTEKS. Podium peringkat di halaman publik /statistik SUDAH terimplementasi dan berfungsi (props tertinggi memuat foto_url, jenis_kelamin, karakter; susunan 2–1–3; daftar bawah mulai peringkat 4; suite terakhir 223 passed). Satu-satunya cacat: representasi karakter di atas anak tangga saat ini dirender di dalam lingkaran kecil bergaya avatar (kemungkinan besar dibungkus elemen bulat overflow-hidden dengan object-cover atau setara), sehingga gambar karakter — yang merupakan ilustrasi badan penuh rasio portrait — terpotong parah: wajah dan sebagian besar badan tertutup/di luar lingkaran, yang terlihat praktis hanya bagian dada/baju. Perbaiki CARA MENAMPILKAN gambar karakternya saja.

YANG DILARANG BERUBAH:

- Controller, props, perhitungan karakter deterministik, urutan peringkat, dan data: tidak berubah sama sekali.
- Berkas aset di public/ilustrasi/: jangan diubah, jangan diganti, jangan di-crop salinannya. Keenam berkas karakter adalah ilustrasi badan penuh rasio portrait (450×1000) berlatar transparan.
- Prioritas representasi tetap: (a) foto_url → foto; (b) karakter; (c) inisial.
- Susunan podium 2–1–3, teks nama/Komsat/poin, dan daftar bawah mulai peringkat 4: tidak berubah.

PERBAIKAN YANG DIMINTA:

1. KARAKTER ditampilkan sebagai gambar badan penuh yang terlihat UTUH, BUKAN di dalam lingkaran/clip bulat: render berkas karakternya dengan object-contain (atau tanpa object-fit crop sama sekali) di dalam wadah portrait yang transparan, berdiri tepat di atas anak tangganya, tanpa bingkai lingkaran, tanpa ring, tanpa latar bulat di belakangnya. Seluruh karakter dari kepala sampai kaki harus terlihat.
2. Ukuran tampil diseragamkan antar anak tangga memakai TINGGI yang sama (bukan lebar): peringkat 1 paling besar (sekitar 150–170 px tinggi di desktop), peringkat 2 dan 3 sedikit lebih kecil (sekitar 120–140 px); di mobile 360 px mengecil proporsional (sekitar 96–120 px) dan TIDAK menimbulkan overflow horizontal. Lebar mengikuti rasio asli berkas (jangan dipaksa melebar/menggepeng).
3. FOTO (prioritas a) tetap lingkaran seperti sekarang (rounded-full + object-cover) — yang berubah hanya tampilan KARAKTER. Khusus peringkat 1: cincin emas sekarang melingkari avatar lingkaran; untuk karakter, aksen emas dipindah menjadi garis/bayangan emas tipis di tepi anak tangga peringkat 1 atau glow emas lembut di belakang karakter — pilih satu yang paling konsisten dengan bahasa desain halaman, TANPA membungkus karakter dalam lingkaran. Aksen untuk foto peringkat 1 tetap cincin emas seperti sekarang.
4. INISIAL (prioritas c) tetap lingkaran seperti sekarang.
5. Periksa tidak ada sisa CSS yang memotong karakter: tidak ada overflow-hidden berbentuk bulat/kotak yang memangkas gambar karakter, tidak ada object-cover pada elemen gambar karakter, dan tinggi wadahnya cukup sehingga kepala karakter tidak terpotong di semua lebar layar (360/390/768/1280/1536).

TEST: sesuaikan test yang ada bila ada asersi yang menyentuh markup/avatar podium (jangan melemahkan asersi data: props, determinisme karakter, daftar bawah mulai peringkat 4, dan ketiadaan nim/username tetap wajib lulus). Suite TIDAK boleh turun dari 223 passed.

VERIFIKASI BROWSER (http://127.0.0.1:8000/statistik, tanpa login, Playwright seperti putaran sebelumnya): ambil screenshot podium pada 1280 px dan 360 px dan periksa dari DOM/screenshot bahwa (a) ketiga karakter ter-render sebagai gambar portrait utuh — kepala, wajah, badan, dan kaki terlihat semua, tidak terpotong lingkaran; (b) tinggi tampil ketiganya mengikuti aturan ukuran di atas dan peringkat 1 yang terbesar; (c) overflow horizontal 0 px di kedua lebar. Tulis hasil pemeriksaan per anak tangga (nama, berkas karakter, dan status utuh/tidak) di laporan. Hapus berkas screenshot/skrip verifikasi dari repo sesudah selesai seperti putaran sebelumnya.

GERBANG: test terkait + suite penuh (minimal 223 passed, 7 skip, 0 gagal), vendor\bin\pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: akar penyebab pemotongan (elemen/kelas persis), file berubah, hasil verifikasi browser per anak tangga + kedua lebar, angka gerbang.
Pesan commit yang disarankan: fix: show full podium characters instead of circular crops

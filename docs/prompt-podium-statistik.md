MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

PODIUM PERINGKAT DI HALAMAN STATISTIK PUBLIK (/statistik). Halaman statistik sudah memiliki daftar peringkat/leaderboard poin mahasiswa dari ledger. Tugas ini mengubah penyajian TIGA peringkat teratas menjadi podium visual; perhitungan poin, urutan peringkat, dan isi data TIDAK berubah.

ASET (prasyarat, disediakan pengguna — periksa, jangan membuat/mengganti sendiri). Enam varian karakter flat warna brand di public/ilustrasi/:

- karakter-laki-1.svg (rambut poni bergelombang), karakter-laki-2.svg (rambut afro keriting), karakter-laki-3.svg (rambut messy + kacamata)
- karakter-perempuan-4.svg (rambut bob sebahu + poni), karakter-perempuan-5.svg (rambut panjang bergelombang), karakter-perempuan-6.svg (sanggul + untaian samping panjang)
  Berkas lama karakter-laki-laki.svg / karakter-perempuan.svg TIDAK dipakai lagi (abaikan/hapus dari daftar aset bila masih ada). Varian dipilih per mahasiswa secara DETERMINISTIK dari id mahasiswa (lihat Bagian A) agar terlihat beragam tetapi tidak berubah-ubah antar kunjungan — JANGAN memakai Math.random()/acak per render. Bila sebagian berkas varian tidak ada di path itu, JANGAN mengarang penggantinya: pakai varian yang ada secara bergilir untuk gender itu, bangun sisanya dengan avatar foto/inisial, dan tulis dengan jelas di laporan berkas mana saja yang hilang.

BAGIAN A — Data:

1. Audit controller + komponen halaman statistik publik: dari mana daftar peringkat berasal dan field apa saja yang tersedia. Untuk TIGA peringkat teratas saja, props perlu memuat tambahan: foto_url (dari foto_path biodata, Storage disk public seperti pola lain di proyek), jenis_kelamin mahasiswa, dan karakter — nama berkas varian karakter yang dipilih server untuk mahasiswa itu, dihitung sebagai berikut: untuk jenis_kelamin "Laki-laki" pilih dari [karakter-laki-1.svg, karakter-laki-2.svg, karakter-laki-3.svg], untuk "Perempuan" dari [karakter-perempuan-4.svg, karakter-perempuan-5.svg, karakter-perempuan-6.svg], dengan indeks = (id mahasiswa) mod jumlah varian pada kelompok gendernya (3 untuk Laki-laki, 3 untuk Perempuan); karakter bernilai null bila jenis_kelamin kosong/tidak dikenal atau foto_url ada (foto didahulukan). NIM, username, dan data pribadi lain TETAP tidak boleh dikirim ke halaman publik.
2. Tidak ada query/aturan poin baru: podium memakai urutan peringkat yang sama persis dengan daftar yang sudah ada (total = SUM poin_transaksi).

BAGIAN B — Podium:

1. Di bagian peringkat halaman /statistik, tiga peringkat teratas ditampilkan sebagai podium: susunan visual [Peringkat 2 — Peringkat 1 — Peringkat 3], peringkat 1 di tengah dengan anak tangga paling tinggi, peringkat 2 di kiri lebih rendah, peringkat 3 di kanan paling rendah. Tinggi anak tangga mengikuti pola itu juga di tampilan mobile (boleh mengecil proporsional, urutan visual tidak berubah).
2. Di atas setiap anak tangga tampil representasi mahasiswa dengan prioritas: (a) foto bila foto_url ada (foto lingkaran rapi); (b) bila tidak ada foto, gambar karakter dari field karakter pada props (varian sesuai jenis_kelamin mahasiswa itu, sudah dipilih deterministik di server — komponen tinggal merender berkas /ilustrasi/<karakter>); (c) bila jenis_kelamin kosong/tidak dikenal, lingkaran inisial nama seperti pola avatar proyek. Di anak tangga tampil: angka peringkat besar (1/2/3), nama mahasiswa, label Komsat, dan total poin dengan format yang sama seperti daftar ("NN poin"). Aksen peringkat memakai bahasa desain proyek (gradien biru brand; peringkat 1 boleh memakai aksen emas pada angka/cincin avatar — TANPA emoji).
3. Daftar peringkat di bawah podium mulai dari peringkat 4 dengan tampilan persis seperti sekarang (tiga teratas tidak tampil dobel). Bila jumlah mahasiswa berperingkat kurang dari 3, podium merender hanya yang ada (1 atau 2 anak tangga) tanpa ruang kosong rusak; bila tidak ada data peringkat sama sekali, bagian ini mengikuti empty state yang sudah ada.
4. Ikuti skill responsive-ui-ux proyek: podium tetap terbaca di lebar 360 px (karakter/avatar mengecil, nama boleh ellipsis dua baris), tidak menimbulkan overflow horizontal, dan mendukung prefers-reduced-motion untuk animasi masuk bila ditambahkan (animasi count-up angka yang sudah ada di halaman ini tidak diubah perilakunya).

BAGIAN C — Test:

1. Test halaman statistik publik: props tiga teratas memuat jenis_kelamin + foto_url + karakter (dan tetap TIDAK memuat nim/username); nilai karakter deterministik — id mahasiswa yang sama selalu menghasilkan varian yang sama dan berasal dari kelompok gender yang benar; urutan podium sesuai total poin tertinggi; daftar bawah mulai dari peringkat ke-4 (peringkat 1–3 tidak dobel). Sesuaikan test statistik lama seperlunya tanpa melemahkan asersi lamanya.

VERIFIKASI BROWSER (http://127.0.0.1:8000/statistik, tanpa login): podium terlihat dengan peringkat 1 di tengah (data demo saat ini: Aditia Pratama mhs001, UNG, 45 poin — karakter laki-laki karena foto biodata demo kosong dan jenis_kelamin Laki-laki), peringkat 2 dan 3 sesuai leaderboard berjalan; sebutkan nama + poin + representasi (foto/nama berkas karakter persis/inisial) yang ter-render untuk masing-masing anak tangga, dan pastikan daftar di bawahnya mulai dari peringkat 4. Bila data lokal sudah berbeda, laporkan keadaan aktual beserta kesesuaiannya dengan aturan di atas.

GERBANG: test terkait + suite penuh (patokan baseline yang diberikan pada perintah pendamping; jumlah lulus WAJIB naik), Pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: hasil audit awal, keberadaan keenam berkas aset, file berubah, hasil verifikasi browser per anak tangga, angka gerbang.
Pesan commit yang disarankan: feat: add podium presentation to public statistics leaderboard

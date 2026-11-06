MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Jangan menjawab dengan sapaan atau pertanyaan generik, jangan bertanya balik. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

SEEDER KEPENGURUSAN HISTORIS SEMUA PERIODE (2018–2025) — MENGGANTIKAN KepengurusanDemoSeeder.

KONTEKS & TUJUAN. Fitur direktori kepengurusan multi-periode sudah selesai (linimasa periode + filter lingkup di /kepengurusan publik). Prompt ini memperluas DATA demonya: seeder opsional sebelumnya (KepengurusanDemoSeeder, satu periode lama, 13 orang) DIGANTI dengan seeder historis yang mengisi susunan pengurus untuk ENAM periode lama sekaligus, datanya diambil dari organigram asli GenBI Gorontalo yang diberikan pemilik proyek (nama asli TANPA tanda demo) ditambah nama karangan bertanda "(Demo)" untuk posisi yang datanya tidak tersedia dan untuk dua periode terakhir. Pemilik proyek akan menyesuaikan data ini sendiri sesudahnya — tugasmu menanamnya persis seperti daftar di bawah.

ATURAN UMUM:

1. Buat kelas `KepengurusanHistorisSeeder` (database/seeders), OPSIONAL dan TERPISAH: TIDAK dipanggil DatabaseSeeder/DemoSeeder, TIDAK mengubah keduanya, TIDAK mengubah data kanonis (total poin, pendaftaran, kehadiran, kepengurusan periode aktif dari DemoSeeder tetap persis).
2. HAPUS `KepengurusanDemoSeeder` beserta test khususnya; rujukan di docs/07-skrip-demo-uas.md dialihkan ke kelas baru ini (cara aktivasi + pemulihan diperbarui mengikuti pola catatan seeder opsional yang ada).
3. Audit dulu skema Periode (nama, tanggal mulai/selesai, flag aktif) dan Kepengurusan (periode_id, lingkup, komsat_id, jabatan, urutan, mahasiswa_id, kolom kontak). Semua periode historis di bawah dibuat TIDAK aktif; satu-satunya periode aktif tetap periode kanonis DemoSeeder. Tanggal periode mengikuti pola tahun ajaran: mulai 1 Agustus tahun pertama s.d. 31 Juli tahun penutup (untuk "Periode 2018/2020": 1 Agu 2018 s.d. 31 Jul 2020) — sesuaikan dengan field tanggal yang benar-benar ada hasil audit; yang wajib benar adalah URUTAN kronologisnya agar linimasa publik terurut terbaru → terlama.
4. Entri historis adalah record bebas (bukan akun mahasiswa): mahasiswa_id null bila model mengizinkan. Bila audit membuktikan kepengurusan WAJIB terhubung ke mahasiswa, BERHENTI dan laporkan temuan itu apa adanya — jangan membuat akun mahasiswa palsu.
5. Kontak: nama ASLI dari organigram → semua kolom kontak DIKOSONGKAN (jangan mengarang nomor HP/email orang asli). Nama bertanda "(Demo)" → kontak contoh mengikuti pola seeder lain di proyek (nomor 08xx contoh) atau kosong; konsisten satu pola.
6. Kolom `urutan` diisi berurutan per kelompok mengikuti urutan daftar di bawah (Pembina lebih dulu di Wilayah; Ketua lebih dulu di tiap kelompok Komsat) agar garis hierarki direktori tampil masuk akal.
7. Idempoten: kunci unik alami = (periode, lingkup/komsat, jabatan, nama); jalan dua kali tidak menggandakan periode maupun orang.

DATA PER PERIODE (nama periode persis seperti tertulis; jabatan persis seperti tertulis):

PERIODE "Periode 2018/2020" — total 23 orang.
Wilayah (14): Pembina: One Yusril Fikar; Pembina: Rahmi Mabruri; Pembina: Arief Setyowidodo; Pembina: Siti Murtafi'ah Mooduto; Ketua Umum: Vebriansyah Mohi; Wakil Ketua: Adelia Arkhani; Sekretaris Umum: Nur Atika Devannie; Bendahara Umum: Nurnadia Z. Husain; KaDiv Organisasi dan Keanggotaan: Maghfira Safitri; KaDiv Kerjasama dan Kemitraan: Agatha Elda; KaDiv Kewirausahaan: Gilvia Potale; KaDiv Pendidikan: Lisa Manggopa; KaDiv Kesehatan: Bela Otoluwa; KaDiv Lingkungan Hidup: Baharudin Sunge.
Komsat IAIN (3): Ketua Komisariat: Maulidin R. Pratama; Sekretaris Komisariat: Fadila Rahman (Demo); Bendahara Komisariat: Nur Haliza (Demo).
Komsat UNG (3, semua Demo — di organigram aslinya slot ini tertulis "Demisioner"): Ketua Komisariat: Andika Pratama (Demo); Sekretaris Komisariat: Rizky Ramadhan (Demo); Bendahara Komisariat: Putri Ayu (Demo).
Komsat UG (3, semua Demo — alasan sama): Ketua Komisariat: Fajar Nugroho (Demo); Sekretaris Komisariat: Maya Kusuma (Demo); Bendahara Komisariat: Rian Saputra (Demo).

PERIODE "Periode 2020/2021" — total 39 orang (susunan terlengkap, semua nama asli).
Wilayah (12): Pembina: Arief Setyowidodo; Pembina: Abdullah Ulil Albab; Pembina: Siti Murtafi'ah Mooduto; Ketua Umum: Moh. Zulkifli Katili; Sekretaris Umum: Revandi Pakaya; Bendahara Umum: Siti M.V. Mohammad; KaDep Organisasi dan Keanggotaan: Sianly Kindangen; KaDep Kerjasama dan Kemitraan: Ali Luqman Adam; KaDep Kewirausahaan: Arya Daud; KaDep Agama dan Pendidikan: Yusril Katili; KaDep Lingkungan Hidup: Mukhlisa Tuli; KaDep Kesehatan Masyarakat: Moh. Rizal Baginda.
Komsat UNG (9): Ketua Komisariat: Naswa Adilia Alamri; Sekretaris Komisariat: Fitriyanti B Tahir; Bendahara Komisariat: Anatasya Lahay; KaDiv Potensi Diri: Nadiya Yunus; KaDiv Komunikasi dan Informasi: Ahmad Haikal Bahar; KaDiv Kewirausahaan: Tika Pausther; KaDiv Pendidikan: Nabil A Panja; KaDiv Lingkungan Hidup: Maharani; KaDiv Kesehatan Masyarakat: Fritania Bonde.
Komsat IAIN (9): Ketua Komisariat: Tasya Dwias Amanda; Sekretaris Komisariat: Rehanun; Bendahara Komisariat: Minarti Mansombo; KaDiv Potensi Diri: Muslihah; KaDiv Komunikasi dan Informasi: Hamsil Hamdi; KaDiv Kewirausahaan: Della A. Darise; KaDiv Pendidikan: Yuliananda J.A.K.; KaDiv Lingkungan Hidup: Muthia Nur Kholifah; KaDiv Kesehatan Masyarakat: Nabila Solaeman.
Komsat UG (9): Ketua Komisariat: Rolly Ramdi Basri; Sekretaris Komisariat: Yeni Dyana Sari; Bendahara Komisariat: Sri W. A. K. Bangi; KaDiv Kesenian: Moh. Safar Ahmad; KaDiv Keagamaan: Rahmat Uno; KaDiv Kewirausahaan: Nur Fazrin Lamato; KaDiv Pendidikan: Claraswati Katili; KaDiv Lingkungan Hidup: Ayu Lestari Kunuti; KaDiv Kesehatan Masyarakat: Novia S Hasan.

PERIODE "Periode 2021/2022" — total 23 orang.
Wilayah (14): Pembina: Abdullah Ulil Albab; Pembina: Hilmy Munis; Pembina: Siti Murtafi'ah Mooduto; Ketua Umum: Komang Darma Widia; Sekretaris Umum: Muhammad Al-Haddad; Bendahara Umum: Fitriyanti B Tahir; Koordinator Media Sosial: Hamsil Hamdi; Kadiv Organisasi dan Keanggotaan: Tasya Dwias Amanda; Kadiv Kerjasama dan Kemitraan: Adinda Pratiwi Musa; Kadiv Pendidikan: La Imudi; Kadiv Lingkungan Hidup: Nur Amalia Katili; Kadiv Kesekretariatan: David Ansari Lubis; Kadiv Kewirausahaan: Rangga Wijaya (Demo); Kadiv Masyarakat: Cahyadi Mutiara.
Komsat UNG (3): Ketua Komisariat: Alviansyah S. Malawe; Sekretaris Komisariat: Bagas Prasetyo (Demo); Bendahara Komisariat: Laras Setiawan (Demo).
Komsat IAIN (3): Ketua Komisariat: Minarti Mansombo; Sekretaris Komisariat: Hana Pertiwi (Demo); Bendahara Komisariat: Yusuf Maulana (Demo).
Komsat UG (3): Ketua Komisariat: Arafik Pakaya; Sekretaris Komisariat: Dimas Anggara (Demo); Bendahara Komisariat: Sari Wulandari (Demo).

PERIODE "Periode 2022/2023" — total 15 orang.
Wilayah (6): Pembina: Hilmy Munis; Pembina: Anisa Kurniarahman; Pembina: Siti Murtafi'ah Mooduto; Ketua Umum: Muh Zamharir Malongi; Sekretaris Umum: Ilham Saputra (Demo); Bendahara Umum: Rina Amelia (Demo).
Komsat UNG (3): Ketua Komisariat: Moh. Abror Maaruf; Sekretaris Komisariat: Galih Permana (Demo); Bendahara Komisariat: Nadia Safitri (Demo).
Komsat IAIN (3): Ketua Komisariat: Indrianto J. Hasan; Sekretaris Komisariat: Fikri Ramadhan (Demo); Bendahara Komisariat: Aisyah Putri (Demo).
Komsat UG (3): Ketua Komisariat: Ulfadiyanti Udju; Sekretaris Komisariat: Bima Aditya (Demo); Bendahara Komisariat: Citra Lestari (Demo).

PERIODE "Periode 2023/2024" — total 13 orang, SEMUA (Demo).
Wilayah (4): Pembina: Hendra Gunawan (Demo); Ketua Umum: Raka Pradana (Demo); Sekretaris Umum: Sinta Maharani (Demo); Bendahara Umum: Dewi Anggraini (Demo).
Komsat UNG (3): Ketua Komisariat: Yoga Pratama (Demo); Sekretaris Komisariat: Intan Permata (Demo); Bendahara Komisariat: Agus Salim (Demo).
Komsat IAIN (3): Ketua Komisariat: Salman Alfarisi (Demo); Sekretaris Komisariat: Fatimah Zahra (Demo); Bendahara Komisariat: Umar Bakri (Demo).
Komsat UG (3): Ketua Komisariat: Kevin Hartanto (Demo); Sekretaris Komisariat: Mega Utami (Demo); Bendahara Komisariat: Rudi Hartono (Demo).

PERIODE "Periode 2024/2025" — total 13 orang, SEMUA (Demo).
Wilayah (4): Pembina: Bambang Sutrisno (Demo); Ketua Umum: Aldi Firmansyah (Demo); Sekretaris Umum: Ratu Balqis (Demo); Bendahara Umum: Novi Rahmawati (Demo).
Komsat UNG (3): Ketua Komisariat: Farhan Akbar (Demo); Sekretaris Komisariat: Gita Savitri (Demo); Bendahara Komisariat: Hadi Purnomo (Demo).
Komsat IAIN (3): Ketua Komisariat: Ikhsan Ramadhan (Demo); Sekretaris Komisariat: Jihan Aulia (Demo); Bendahara Komisariat: Khalid Basalamah (Demo).
Komsat UG (3): Ketua Komisariat: Lukman Hakim (Demo); Sekretaris Komisariat: Mira Handayani (Demo); Bendahara Komisariat: Nanda Rizky (Demo).

TOTAL KESELURUHAN SEEDER: 6 periode, 126 pengurus.

TEST: ganti test KepengurusanDemoSeeder yang lama dengan test kelas baru: (1) sesudah jalan sekali: tepat 6 periode historis tidak aktif + jumlah pengurus per periode persis 23/39/23/15/13/13 (total 126) dan periode aktif kanonis tidak bertambah periodenya; (2) jalan dua kali: angka-angka itu tidak berubah (idempoten); (3) data kanonis tidak berubah (kepengurusan periode aktif tetap jumlah semula, total poin tetap 110, pendaftaran tetap angka kanonis); (4) nama asli tidak membawa kontak karangan (kolom kontak nama tanpa "(Demo)" pada periode historis kosong/null). Suite TIDAK boleh turun dari baseline pada perintah pendamping; satu-satunya kegagalan yang ditoleransi adalah TrenDemoSeederTest yang sudah dikenal bila diagnosisnya belum dijalankan — kegagalan lain = pekerjaan belum selesai.

VERIFIKASI BROWSER (http://127.0.0.1:8000/kepengurusan, tanpa login; jalankan seeder sekali): linimasa menampilkan 7 periode terurut terbaru → terlama (periode aktif paling atas, Periode 2018/2020 paling bawah); membuka Periode 2020/2021 menampilkan susunan Wilayah 12 orang dan chip UNG menampilkan 9 orang komisariat UNG dipimpin Naswa Adilia Alamri; membuka Periode 2018/2020 menampilkan Vebriansyah Mohi sebagai Ketua Umum; klik kartu membalik & mengunci kontak seperti biasa; overflow 0 px di 360/390/768/1280/1536, console error 0. Laporkan per periode (jumlah tampil vs data) + per lebar. Berkas verifikasi sementara dihapus dari repo sesudah selesai.

GERBANG: test terkait + suite penuh, vendor\bin\pint, composer types:check, npm run types:check, npm run check, npm run build.
LAPORAN: hasil audit skema (termasuk putusan mahasiswa_id), file berubah/dihapus, hasil verifikasi browser, angka gerbang.
Pesan commit yang disarankan: chore: seed historical board structures for all past periods

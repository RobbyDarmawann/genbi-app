# Analisis Sistem GenBI Gorontalo (genbigto.site)

### Bahan awal Project UAS — Implementasi & Pengujian Perangkat Lunak (IPPL)

Disusun: 3 November 2026 (WITA) — status: analisis awal, bukan source code resmi

---

## 1. Ringkasan Eksekutif

genbigto.site adalah website resmi GenBI Gorontalo — komunitas mahasiswa penerima
Beasiswa Bank Indonesia di bawah Kantor Perwakilan BI Provinsi Gorontalo.
Fungsi publiknya: profil komunitas, aktivitas/statistik, dan kepengurusan wilayah.
Fungsi internalnya (di balik login) adalah **Scoring System**: evaluasi keaktifan
penerima beasiswa berbasis poin yang dikumpulkan dari kehadiran/keikutsertaan
pada kegiatan resmi.

Masalah inti yang mau diselesaikan pada pengembangan ulang ini:

1. **Proses terpisah dari web utama.** Pendataan peserta terbukti berjalan di
   luar web (form pihak ketiga — data wawancara Instrumen IPPL). Untuk absensi:
   menurut SATU sumber lisan (cerita teman user) absensi foto wajah + lokasi
   berjalan di sistem eksternal lalu poin tercermin di genbigto.site —
   **status: HIPOTESIS, belum terverifikasi** (lihat Bagian 2 & 2.2). Jika
   benar, alurnya terputus dan rawan tidak sinkron; jika keliru, masalah
   intinya tetap sama: proses kunci berjalan di luar satu sistem.
2. **Pendataan peserta masih pakai form pihak ketiga** (temuan wawancara di
   Instrumen IPPL) — sekretaris/panitia bekerja dua kali, data tidak satu wadah.
3. **Evaluasi timpang ke individu.** Yang terlihat hanya nilai tertinggi per orang;
   tidak ada rekap tren kegiatan per Komsat untuk evaluasi antar-kampus.
4. **Direktori kepengurusan basi.** Masih menampilkan pengurus lama/demisioner,
   menghambat komunikasi lintas Komsat.

Rencana pengembangan: **satu sistem terintegrasi** — kegiatan dibuat di dalam
sistem, absensi (wajah + geolokasi) terjadi di dalam sistem yang sama, dan poin
masuk otomatis sebagai satu transaksi yang tercatat (audit trail), ditambah
fitur rekap per Komsat dan direktori kepengurusan aktif terfilter kampus.

---

## 2. Bukti & Sumber (apa yang terverifikasi, apa yang belum)

| Klaim                                                                                                                                                                                                                           | Sumber                                                                       | Status                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GenBI = komunitas penerima Beasiswa BI, di bawah KPw BI Gorontalo; kampus mitra awal: UNG, IAIN Sultan Amai Gorontalo, Universitas Gorontalo                                                                                    | Halaman utama genbigto.site (dibaca 3 Nov 2026)                              | Terverifikasi publik                                                                                                                                          |
| genbigto punya portal login "Scoring System" untuk manajemen internal anggota                                                                                                                                                   | Instrumen IPPL (PDF lampiran user)                                           | Dari dokumen user                                                                                                                                             |
| Platform ini disebut "Genbigto Score Platform — scholarship evaluation system" oleh salah satu pengembangnya (PM & DevOps, Fyodor Lab — GenBI Gorontalo); infra Docker/CI/CD, multi-cloud                                       | Portofolio azhr.cloud                                                        | Terverifikasi publik (pihak ketiga)                                                                                                                           |
| Poin keaktifan terinput saat anggota mengikuti kegiatan; bila belum terinput, hubungi sekretaris komisariat; poin juga dapat dilihat pihak KPw BI                                                                               | Rumah GenBI Bengkulu (rumah-genbi.com/leaderboard) — pola GenBI wilayah lain | Pola umum GenBI, bukan khusus Gorontalo                                                                                                                       |
| Tugas sekretaris GenBI mencakup pengabsensian anggota di kegiatan internal komisariat/korkom/BI dan rekapitulasi poin keaktifan dari setiap partisipasi **guna pencairan uang beasiswa**                                        | Profil Magenta (Sekretaris GenBI)                                            | Pola umum GenBI                                                                                                                                               |
| Di GenBI UPN Jatim, pengelolaan poin manual meliputi pencatatan, validasi ajuan, pendaftaran kegiatan, monitoring; solusinya (GenPoint): kelola kegiatan, ajuan+validasi poin, dashboard monitoring, logbook, leaderboard/badge | Skripsi GenPoint, Repository UPN "Veteran" Jatim (2026)                      | Sistem analog, terdokumentasi penuh                                                                                                                           |
| Di GenBI Polibatam, absensi manual + data tidak terintegrasi memicu manipulasi; solusinya QR Code dinamis + poin keaktifan terhubung sistem, dipantau Humas BI real-time                                                        | Repository Polibatam (2025)                                                  | Sistem analog                                                                                                                                                 |
| Mitra BI Gorontalo 2026 berkembang jadi 5 PT: UNG, IAIN Sultan Amai, Universitas Gorontalo, UMGO, UBMG                                                                                                                          | Berita orientasi GenBI 2026 (otanaha.id) + kegiatan GenBI Care UBMG          | Terverifikasi publik — **beda dengan PDF (3 kampus) dan beda lagi dengan filter yang diminta user di wawancara (UNG, UMGO, UNIGO)**                           |
| Alur absensi eksternal: internal manajemen set absensi di luar web → mahasiswa input foto wajah + aktifkan lokasi → ada validasi jarak → submit → poin otomatis bertambah di web utama                                          | Penjelasan teman user (disampaikan user 3 Nov 2026)                          | **TERKONFIRMASI orang dalam** lewat tanya-jawab terstruktur ke teman user (3 Nov 2026, lihat Bagian 2.3) — tetap satu sumber, tapi sumbernya pelaku prosesnya |
| Pendaftaran peserta kegiatan: Internal Manajemen mengadakan event, memilih bidang/divisi tertentu sebagai peserta, membagikan list di grup WhatsApp; mahasiswa divisi itu yang mau ikut tinggal mengisi list                    | Jawaban teman user (3 Nov 2026)                                              | Terkonfirmasi orang dalam                                                                                                                                     |
| Akun login mahasiswa dibuatkan oleh **Internal Manajemen**                                                                                                                                                                      | Jawaban teman user (3 Nov 2026)                                              | Terkonfirmasi orang dalam — mengoreksi asumsi awal Feign (Sekretaris Wilayah)                                                                                 |
| Daftar Komsat aktif: **UNG, IAIN, UG, UMGO, UBM** (5)                                                                                                                                                                           | Jawaban teman user (3 Nov 2026)                                              | Terkonfirmasi orang dalam — daftar baku Bagian 11.2 SAH                                                                                                       |
| Bobot poin per kegiatan/peran, radius geofence, jendela waktu absensi, ambang poin minimum, mekanisme banding/koreksi poin                                                                                                      | —                                                                            | **Belum ada data. Harus digali (lihat Bagian 9)**                                                                                                             |

Catatan batasan: area login genbigto.site tidak diakses (tidak ada kredensial dan
tidak diminta). Semua yang terjadi di balik login direkonstruksi dari PDF
Instrumen IPPL, penjelasan user, dan pola sistem GenBI lain yang terdokumentasi.

### 2.1 Hasil penjelajahan langsung halaman publik (3 Nov 2026, 00:09–00:13 WITA)

Navigasi situs hanya 5 menu: Beranda `/`, Aktivitas `/schedule`,
Statistik `/statistik`, Kepengurusan `/timeline`, Login `/login`.

- **Login — judul tab "GenBI GTO Score".** Ilustrasi "SCORING SYSTEM", kolom
  Username + Password saja; tidak ada lupa password, tidak ada pendaftaran
  akun. Akun jelas dibuatkan oleh pengelola (bukan self-register).
- **Statistik bersifat PUBLIK dan ini temuan penting.** Kartu: Penerima Aktif
  309, Non Penerima Aktif 95, Alumni (kisaran) 200, Aktivitas 59. Ada ringkasan
  "3 Teratas" (nilai 187, ketiganya dari UG) dan **"3 Terbawah" bernilai −23
  (ketiganya dari UMGO)** → **terbukti nilai bisa NEGATIF**: sistem mengenal
  pengurangan poin/sanksi, bukan cuma penambahan. Ada tombol "Refresh Nilai"
  → nilai tampaknya dihitung/diperbarui berkala, bukan selalu real-time.
  (Angka adalah potret saat penjelajahan dan bisa berubah.)
- **Aktivitas — 59 kegiatan tampil publik** sebagai daftar teks (tanggal,
  label kelompok, nama) **tanpa tautan detail, tanpa form, tanpa tautan
  absensi**. Ada entri bernama "ABSEN SARONDE 2026 DAY 1/2/3" — kata "absen"
  muncul sebagai judul jadwal, menguatkan dugaan sesi absensi memang
  dijadwalkan sebagai entri tersendiri, tapi pintunya tidak ada di web publik.
- **Label Komsat yang benar-benar muncul di jadwal:** UNG, IAIN SAG, UG,
  UMGO, UBM, UNIGO, UIN — artinya lingkupnya sudah **lebih dari 3 kampus
  lama**, dan penamaannya tidak konsisten (UG vs UNIGO; IAIN SAG vs UIN;
  UBM kemungkinan UBMG). Divisi UNG berkode: PDK (Pendidikan), KWU
  (Kewirausahaan), PTD (Potensi Diri), KMS (Kesehatan Masyarakat), LKH
  (Lingkungan Hidup), KMF (Kominfo).
- **Kepengurusan TERBUKTI basi:** periode terbaru yang tampil adalah
  **2022–2023**; tidak ada 2023–2024 dan seterusnya. Ini bukti langsung
  keluhan wawancara di Instrumen IPPL soal direktori pengurus lama.
- **Tidak ditemukan tautan Google Form / form eksternal / sistem absensi
  eksternal di seluruh halaman publik** — konsisten dengan cerita bahwa
  absensi dan pendataan berjalan di luar web ini dan disebar lewat jalur
  lain (grup chat/link terpisah).
- Footer: "Scoring System • Generasi Baru Indonesia Gorontalo • Coded
  ©Katili.dev". IG resmi: @genbi_gto, @genbi.ung, @genbi_komsat_iainsag,
  @genbi.ug.

### 2.2 Hasil riset khusus: apakah ada "pendaftaran peserta" di sistem ini? (3 Nov 2026)

User mengakui tidak tahu mekanisme pendaftarannya dan meminta pencarian
sumber. Hasil pencarian web + media sosial (Instagram/Facebook GenBI
Gorontalo & BI Gorontalo), jujur apa adanya:

1. **Di dalam genbigto.site: TIDAK ada pendaftaran peserta.** Terverifikasi
   dari penjelajahan publik: jadwal kegiatan hanya teks, login tanpa
   pendaftaran akun, tidak ada tautan form apa pun.
2. **Sumber terkuat justru PDF Instrumen IPPL itu sendiri** (data wawancara
   user): pendataan peserta saat Komsat mengadakan kegiatan dilakukan dengan
   **keluar dari website, membuat & membagikan link form pihak ketiga** —
   itulah keluhan yang melahirkan kebutuhan No. 1. Jadi "pendaftaran peserta"
   dalam konteks ini = pendataan via form eksternal, BUKAN fitur web.
3. **Petunjuk dari rundown resmi SARONDE 2026** (posting GenBI Gorontalo):
   agenda Hari ke-1 memuat sesi "registrasi peserta" di lokasi acara, dan
   peserta adalah anggota yang sudah ditentukan (marak twibbon "I'm Ready
   For Saronde" dari anggota). Indikasi: untuk kegiatan internal,
   "pendaftaran" berbentuk registrasi ulang/daftar hadir di tempat bagi
   anggota, bukan pendaftaran online terbuka.
4. **Jangan tertukar: pendaftaran BEASISWA GenBI itu ada dan online**
   (pengumuman BI Gorontalo, seleksi Semester 1/2026: pendaftaran online
   22–25 April 2026, lanjut tes/seleksi berkas/wawancara). Itu pendaftaran
   menjadi anggota/penerima beasiswa — proses berbeda dari pendataan
   peserta kegiatan.
5. **Tidak ditemukan** satu pun tautan Google Form/absensi yang dapat
   diatribusikan secara pasti ke kegiatan GenBI Gorontalo di ruang publik.
   Mekanisme absensi wajah+lokasi tetap hanya bersumber dari cerita teman
   user; dan klaim user bahwa "absensi masih pakai form pihak ketiga"
   kemungkinan merujuk hal yang sama dengan poin 2 (pendataan) ATAU praktik
   absensi via form di sebagian kegiatan — **belum bisa dipastikan tanpa
   konfirmasi orang dalam.**

Kesimpulan desain: modul pendaftaran pada sistem To-Be dipertahankan, tapi
landasannya ditulis dengan benar — ia menggantikan pendataan form pihak
ketiga (kebutuhan No. 1 Instrumen IPPL), bukan meniru fitur pendaftaran
yang sudah ada.

### 2.3 Hasil konfirmasi orang dalam (jawaban teman user, 3 Nov 2026) — MENUTUP GERBANG #1 & #2

1. **Pendaftaran = list WhatsApp berbasis divisi target.** Internal
   Manajemen mengadakan event dan MEMILIH bidang/divisi tertentu sebagai
   peserta; list dibagikan di grup; mahasiswa divisi itu yang mau ikut
   tinggal mengisi list. Masih manual via WhatsApp.
2. **Absensi = form dari web lain** (di luar genbigto.site): login username,
   nyalakan lokasi, input foto, submit → **poin otomatis bertambah bila
   validasi berhasil**. Fondasi cerita awal TERKONFIRMASI.
3. **Yang men-set absensi: Internal Manajemen.**
4. **Poin otomatis dari validasi jarak (sesuai set) dan foto.**
5. **Poin negatif: tidak ditanyakan; user memutuskan TIDAK PENTING** →
   mekanisme penalti dinyatakan DI LUAR SCOPE (pertanyaan ditutup oleh
   keputusan user, bukan oleh jawaban).
6. **Komsat aktif = 5: UNG, IAIN, UG, UMGO, UBM.** (Penamaan orang dalam:
   "IAIN" dan "UBM" — dipakai sebagai nama baku.)
7. **Akun dibuatkan oleh Internal Manajemen.**
8. **KEPUTUSAN USER (3 Nov 2026): aktor disederhanakan jadi 3** — Mahasiswa,
   Divisi Internal Manajemen, dan Guest. Sekretaris Wilayah & Sekretaris
   Komsat DICABUT sebagai aktor; seluruh kebutuhan Instrumen IPPL
   (pendataan, rekap per Komsat, direktori kepengurusan) dibebankan ke
   Internal Manajemen; Guest mewakili pengunjung publik situs.

---

## 3. Aktor & Perannya

Tiga aktor (KEPUTUSAN USER 3 Nov 2026, menyederhanakan model 4 aktor
sebelumnya): Mahasiswa, Divisi Internal Manajemen, dan Guest. Sekretaris
Wilayah & Sekretaris Komsat dicabut; KPw BI juga tidak dipakai. Seluruh
kebutuhan Instrumen IPPL dibebankan pengelolaannya ke Internal Manajemen.

> **Asal-usul data:** nama aktor & pembagian ini keputusan user untuk
> batasan tugas. Peran Internal Manajemen sebagai pembuat akun, pen-set
> absensi, dan pemilik event = TERKONFIRMASI dari teman user (Bagian 2.3).
> Peran Guest diturunkan dari halaman publik situs yang memang terbuka
> tanpa login (Beranda, Aktivitas, Statistik, Kepengurusan).

| Aktor                                             | Peran dalam alur utama                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Guest** (pengunjung tanpa login)                | Melihat halaman publik: beranda & profil komunitas, jadwal aktivitas, statistik & leaderboard publik, direktori kepengurusan — persis permukaan publik genbigto.site saat ini                                                                                                                                                                                                                                                   |
| **Mahasiswa** (anggota GenBI / penerima beasiswa) | Login (akun dibuatkan Internal Manajemen); melihat kegiatan yang ditargetkan ke divisinya; mengambil tempat/list keikutsertaan di dalam sistem (pengganti list WhatsApp); melakukan absensi (foto + lokasi) saat kegiatan; memantau poin, riwayat kehadiran, dan posisinya (leaderboard); mengajukan koreksi bila poin belum masuk                                                                                              |
| **Divisi Internal Manajemen**                     | SATU-SATUNYA pengelola: membuat akun & mengelola data anggota; master Komsat (5) & divisi; membuat event + memilih divisi target + mengatur parameter absensi (titik lokasi, radius, jendela waktu) & bobot poin; memantau kehadiran real-time; memvalidasi koreksi; menutup & mengunci kegiatan; mengelola direktori kepengurusan & periode; melihat rekap & tren per Komsat + ekspor laporan (semua kebutuhan Instrumen IPPL) |

---

## 4. Alur Proses Bisnis Utama — Kondisi Sekarang (As-Is)

> ✅ **Status bagian ini (diperbarui 3 Nov 2026):** alur di bawah kini
> TERKONFIRMASI oleh orang dalam (jawaban teman user, Bagian 2.3):
> pendaftaran via list WhatsApp per divisi target, absensi via form web
> lain (login username + lokasi + foto → poin otomatis bila validasi
> lolos), pen-set absensi = Internal Manajemen, akun dibuatkan Internal
> Manajemen. Satu-satunya yang tetap dari wawancara IPPL: keluhan bahwa
> pendataan/administrasi berjalan di luar website utama.

Direkonstruksi dari penjelasan user + PDF + pola GenBI terdokumentasi:

```
[Internal Manajemen mengadakan event]
        │
        ▼
(1) Internal Manajemen MEMILIH bidang/divisi tertentu sebagai peserta
    event, lalu membagikan LIST di grup WhatsApp
        │
        ▼
(2) Mahasiswa di divisi terpilih yang mau ikut mengisi list
    (pendataan manual via WhatsApp — di kegiatan lain, pendataan
    peserta juga berjalan via form pihak ketiga: keluhan wawancara)
        │
        ▼
(3) Internal Manajemen menyiapkan absensi DI FORM WEB LAIN
    (set lokasi/radius — di luar genbigto.site)
        │
        ▼
(4) Mahasiswa hadir di lokasi → buka form absensi → login username
    → aktifkan lokasi → input foto → submit
        │
        ▼
(5) Validasi: jarak lokasi vs titik yang di-set + foto
        │ lolos
        ▼
(6) Poin otomatis bertambah di web utama genbigto.site (Scoring System)
        │
        ▼
(7) Mahasiswa memantau poinnya (Statistik publik: peringkat & nilai,
    termasuk kemungkinan nilai negatif yang mekanismenya tidak
    dijelaskan dan dinyatakan user di luar scope)
        │
        ▼
(8) Evaluasi: yang tervisualisasi hanya capaian individu tertinggi;
    tren per Komsat tidak ada; direktori pengurus di web basi
```

Titik putus (pain points) pada alur As-Is:

- **P1 — Dua sistem, satu kebenaran yang kabur.** Absensi dan poin beda rumah;
  kalau sinkronisasi gagal, mahasiswa tidak tahu poinnya hilang di mana, dan
  jalan keluarnya manual: menghubungi sekretaris (pola yang sama persis tertulis
  di Rumah GenBI Bengkulu).
- **P2 — Pendataan peserta di luar sistem** (form pihak ketiga): data peserta,
  kehadiran, dan poin tidak pernah bertemu dalam satu basis data.
- **P3 — Tidak ada jejak audit yang terlihat user:** mahasiswa tidak bisa
  membuktikan "saya sudah absen" selain dari bertambah/tidaknya poin.
- **P4 — Evaluasi per Komsat tidak tersedia;** direktori kepengurusan tidak aktual;
  tidak ada filter per kampus (UNG/UMGO/UNIGO dst.).

---

## 5. Alur Proses Bisnis Usulan — Sistem Terintegrasi (To-Be)

Satu sistem, satu basis data, satu transaksi "hadir → poin":

### 5.1 Alur utama (happy path)

1. **Pembuatan kegiatan** — Internal Manajemen membuat kegiatan: nama,
   penyelenggara (Komsat/divisi), tanggal & jam, lokasi + titik koordinat,
   **radius geofence**, **jendela absensi** (buka–tutup), kuota, **bobot
   poin** (dibedakan per peran bila perlu: peserta/panitia/pemateri), dan
   **divisi target** — meniru persis praktik aslinya, hanya dipindah ke
   sistem: hanya divisi yang dipilih yang menjadi calon peserta.
2. **Publikasi & pendaftaran (list di dalam sistem)** — Kegiatan tampil ke
   mahasiswa yang divisinya ditargetkan (dan sebagai jadwal publik untuk
   Guest). Mahasiswa mengambil tempat dengan sekali klik "Ikut" — inilah
   list WhatsApp yang dipindahkan ke dalam sistem (Fitur Tambahan 1).
   Status: Terdaftar. **Hanya mahasiswa terdaftar dari divisi target yang
   dapat melakukan absensi kegiatan ini** — menjawab risiko "semua divisi
   bisa absensi": tanpa target + tanpa list, absensi tertolak sebelum
   validasi lokasi/foto berjalan.
3. **Pembukaan sesi absensi** — Saat jendela absensi tiba, sesi aktif otomatis
   (atau dibuka manual oleh panitia/Internal Manajemen).
4. **Absensi mahasiswa** — Mahasiswa membuka kegiatan → sistem meminta:
   izin lokasi → koordinat perangkat; izin kamera → foto wajah langsung
   (bukan unggah galeri).
5. **Validasi berlapis (server-side):**
   a. Jarak Haversine(koordinat mahasiswa, titik kegiatan) ≤ radius → jika di
   luar radius: ditolak dengan alasan eksplisit.
   b. Waktu server masih di dalam jendela absensi.
   c. Wajah cocok dengan data wajah terdaftar mahasiswa (face matching) +
   liveness dasar (anti foto-dari-foto).
   d. Belum pernah absen untuk kegiatan ini (idempoten: 1 mahasiswa × 1
   kegiatan = maksimal 1 catatan kehadiran valid).
6. **Kredit poin atomik** — Kehadiran valid dan penambahan poin ditulis dalam
   **satu transaksi basis data**: tabel `kehadiran` (bukti: waktu, jarak,
   status validasi) + tabel `poin_transaksi` (delta poin, sumber = kegiatan X).
   Tidak ada lagi sinkronisasi antar-sistem. Mahasiswa langsung melihat
   poinnya bertambah + menerima bukti kehadiran digital.
7. **Penutupan & penguncian** — Sesi ditutup; Internal Manajemen meninjau
   anomali (absensi ditolak, pengajuan koreksi), lalu kegiatan **dikunci**:
   poin final, tidak bisa diubah kecuali lewat mekanisme koreksi tercatat.
8. **Monitoring & evaluasi** — Internal Manajemen melihat dashboard:
   poin individu, leaderboard, **tren & rekap kegiatan per Komsat** (Fitur
   Tambahan 2a), dan dapat mengekspor laporan per periode. Guest &
   mahasiswa melihat versi publiknya (statistik & leaderboard).

### 5.2 Alur alternatif / pengecualian (wajib ada di desain & pengujian)

- **Di luar radius / GPS tidak akurat** → absensi ditolak, sistem mencatat
  percobaan; mahasiswa dapat mengajukan **koreksi kehadiran** dengan bukti
  (mis. foto kegiatan) → divalidasi Internal Manajemen → poin
  masuk lewat transaksi koreksi yang tercatat (bukan edit diam-diam).
- **Wajah tidak cocok / kamera ditolak** → percobaan gagal tercatat; setelah
  N kali gagal, diarahkan ke validasi manual panitia di lokasi.
- **Tidak mendaftar tapi hadir** → kebijakan harus diputuskan: absensi walk-in
  boleh dengan persetujuan panitia, atau ditolak. (Masuk daftar pertanyaan
  Bagian 9.)
- **Kegiatan dibatalkan / diubah jadwal** → sesi absensi ikut berubah; poin
  yang sudah terkredit dari sesi yang batal harus punya aturan rollback
  tercatat.
- **Duplikasi submit** (klik ganda, jaringan putus saat submit) → kunci
  idempotensi = **pendaftaran_id** (bukan sekadar mahasiswa×kegiatan).
  Keputusan model: satu mahasiswa hanya boleh memegang **satu peran per
  kegiatan** (peserta ATAU panitia ATAU pemateri, tercatat di pendaftaran),
  sehingga satu pendaftaran = maksimal satu kehadiran valid = satu kredit
  poin berbobot sesuai perannya. Ini menutup bentrok antara idempotensi
  dan bobot per peran yang ditunjuk review.

### 5.3 Fitur tambahan dari Instrumen IPPL

- **FT-1 Pendataan/pendaftaran peserta terintegrasi** (Bagian 5.1 langkah 2):
  mengganti form pihak ketiga; data peserta otomatis menjadi daftar hadir
  calon penerima poin.
- **FT-2a Rekap tren kegiatan per Komsat:** grafik/jumlah kegiatan, total
  partisipasi, dan rata-rata poin per Komsat per periode + **filter kampus**
  (UNG, UMGO, UNIGO, IAIN/UIN, UBMG — daftar final mengikuti data mitra
  terbaru, lihat catatan Bagian 2).
- **FT-2b Direktori kepengurusan aktif:** struktur Wilayah & Komsat yang bisa
  diperbarui Internal Manajemen (per periode kepengurusan), lengkap dengan
  kontak penanggung jawab dan filter per kampus — mengganti data demisioner
  yang sekarang tampil.

---

## 6. Kebutuhan Fungsional Inti (ringkas, untuk diteruskan ke SRS/UML)

| Kode  | Kebutuhan                                                                                                                                | Aktor                                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| KF-00 | Halaman publik tanpa login: beranda, jadwal, statistik/leaderboard, direktori kepengurusan                                               | Guest                                                             |
| KF-01 | Login & manajemen peran (3 peran: Guest publik, Mahasiswa, Internal Manajemen); akun dibuatkan Internal Manajemen                        | Mahasiswa, Internal Manajemen                                     |
| KF-02 | CRUD kegiatan + divisi target + parameter absensi (koordinat, radius, jendela waktu, bobot poin)                                         | Internal Manajemen                                                |
| KF-03 | Pendaftaran peserta kegiatan dalam sistem                                                                                                | Mahasiswa                                                         |
| KF-04 | Absensi: ambil lokasi + foto selfie bukti, validasi geofence/waktu/duplikasi di server (pencocokan wajah otomatis = FASE 2, di luar MVP) | Mahasiswa                                                         |
| KF-05 | Kredit poin otomatis & atomik dari kehadiran valid; riwayat poin per transaksi                                                           | Sistem                                                            |
| KF-06 | Dashboard poin & riwayat kehadiran pribadi; leaderboard individu                                                                         | Mahasiswa                                                         |
| KF-07 | Pengajuan & validasi koreksi kehadiran/poin                                                                                              | Mahasiswa → Internal Manajemen                                    |
| KF-08 | Monitoring real-time kehadiran per kegiatan; tutup & kunci kegiatan                                                                      | Internal Manajemen                                                |
| KF-09 | Rekap & tren per Komsat + filter kampus; ekspor laporan periode                                                                          | Internal Manajemen (kelola), Guest/Mahasiswa (lihat versi publik) |
| KF-10 | Direktori kepengurusan aktif per periode + filter kampus                                                                                 | Internal Manajemen (kelola), Semua (lihat)                        |
| KF-11 | Master data anggota & akun, Komsat, divisi, periode kepengurusan, kategori & bobot poin                                                  | Internal Manajemen                                                |
| KF-12 | Log audit: setiap perubahan poin menyimpan siapa/kapan/alasan/sumber                                                                     | Sistem                                                            |

Entitas data inti: `pengguna, mahasiswa, komsat, periode, kepengurusan,
kegiatan, pendaftaran (memuat peran tunggal per kegiatan), sesi_absensi,
kehadiran (unik per pendaftaran_id), kategori_poin, poin_transaksi,
koreksi_kehadiran`. (`data_wajah`/embedding hanya relevan bila fase 2 face
matching diambil.)

### 6.1 Kebutuhan Nonfungsional (ringkas, baru — menutup celah review)

| Kode   | Kebutuhan                                                                                                                                                                  |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| KNF-01 | Absensi memuncak bersamaan: sistem harus melayani ±150 submit dalam 10 menit pertama sesi tanpa error (uji beban sederhana cukup untuk UAS)                                |
| KNF-02 | Waktu submit absensi < 3 detik pada jaringan 4G wajar (foto dikompresi di klien ≤ ±500 KB)                                                                                 |
| KNF-03 | Retensi: foto bukti absensi disimpan selama periode berjalan + 1 periode berikutnya, lalu dihapus/dianonimkan; tidak ada data biometrik (embedding) yang disimpan pada MVP |
| KNF-04 | Notifikasi cukup in-app (status absensi diterima/ditolak, koreksi disetujui/ditolak, perubahan jadwal); email/WhatsApp di luar scope                                       |
| KNF-05 | Kebijakan check-out: MVP check-in saja (asumsi A-05 di Bagian 11)                                                                                                          |
| KNF-06 | Semua perubahan poin tercatat di log audit (KF-12) dan dapat diekspor bersama laporan periode                                                                              |

---

## 7. Catatan Teknis & Risiko (penting untuk bab pengujian IPPL)

- **Geofence:** jarak dihitung di **server** (Haversine), bukan dipercaya dari
  klien. Radius literatur presensi umumnya 50–100 m; GPS dalam ruangan bisa
  meleset 20–50 m, jadi radius terlalu kecil = banyak penolakan palsu.
- **Anti-spoofing (DIKOREKSI mengikuti review):** risiko utama = Fake GPS
  (mock location) dan foto dari layar/cetakan. KOREKSI TEKNIS: **aplikasi web
  TIDAK bisa mendeteksi mock location secara andal** — Geolocation API
  browser tidak menyediakan penanda lokasi palsu (itu kemampuan aplikasi
  native Android). Jadi untuk platform web, geofence adalah mitigasi
  PARSIAL: ia menyaring ketidakhadiran kasar, bukan titip-absen yang
  disengaja. Mitigasi web yang realistis: Haversine di server, timestamp
  server, foto selfie langsung dari kamera (bukan galeri) sebagai bukti yang
  bisa ditinjau manual, dan deteksi anomali (akurasi GPS buruk, banyak akun
  dari koordinat identik). Deteksi mock location hanya mungkin bila kelak
  dibuat aplikasi native/hybrid — di luar scope UAS ini.
- **Status pustaka wajah (diverifikasi 3 Nov 2026):** face-api.js asli
  (justadudewhohacks) berhenti di v0.22.2 (2020), tidak dirawat. Fork
  @vladmandic/face-api adalah penerusnya (kompatibel TensorFlow.js 4), dan
  penerus modernnya adalah library Human. Jika face matching dipakai, pakai
  fork itu — jangan paket aslinya.
- **KEPUTUSAN SCOPE MVP (usulan, menunggu persetujuan user/dosen):**
  absensi MVP = **geofence server-side + foto selfie sebagai bukti +
  timestamp server**, TANPA pencocokan wajah otomatis dan TANPA liveness.
  Face matching otomatis = fase 2 di luar MVP. Alasan: beban akurasi &
  privasi biometrik tidak sebanding untuk skala UAS; bukti foto + tinjauan
  manual panitia menutup kebutuhan audit. Konsekuensi jujur: MVP tidak
  mencegah titip absen oleh teman yang hadir — dicatat sebagai keterbatasan.
- **Anti-replay & duplikasi:** payload absensi ditandatangani sesi dan sekali
  pakai; penambahan poin idempoten.
- **Privasi biometrik (UU PDP No. 27/2022):** data wajah = data pribadi
  bersifat spesifik. Simpan **embedding/template** terenkripsi, bukan foto
  mentah jangka panjang; minta persetujuan saat pendaftaran wajah; batasi
  akses. Ini nilai plus besar bila ditulis di laporan.
- **Integritas poin:** poin tidak pernah di-UPDATE diam-diam — selalu
  transaksi baru (kredit/koreksi/rollback) sehingga total = jumlah riwayat.
  Ini menjawab langsung masalah "poin belum masuk" tanpa jejak.
- **Pengujian yang relevan (IPPL):** Black Box per KF; skenario batas radius
  (di dalam / tepat di batas / di luar), jendela waktu (sebelum/sesudah),
  submit ganda, wajah orang lain, GPS dimatikan, peran mencoba akses lingkup
  Komsat lain (otorisasi), dan UAT ke 3 aktor.

---

## 8. Perbandingan dengan Sistem Analog (bahan tinjauan pustaka)

| Sistem                                             | Mekanisme poin                                                                                                      | Pelajaran untuk proyek ini                                                                                                                |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Rumah GenBI Bengkulu                               | Poin terinput setelah ikut kegiatan; koreksi manual via sekretaris komisariat; leaderboard publik; BI ikut memantau | Persis pola As-Is Gorontalo → membuktikan P1 itu masalah generik GenBI                                                                    |
| GenPoint — GenBI UPN Jatim (Laravel)               | Anggota mengajukan poin, sekretaris memvalidasi; logbook, badge, leaderboard                                        | Alur validasi manual = aman tapi lambat; proyek ini menggantinya dengan validasi otomatis absensi + jalur koreksi manual sebagai cadangan |
| SIM Keanggotaan — GenBI Polibatam (Angular/NestJS) | Absensi QR dinamis terhubung poin; anti-manipulasi; pemantauan real-time oleh BI                                    | Bukti integrasi absensi→poin dalam satu sistem memang arah yang dipakai GenBI lain                                                        |
| Genbigto Score Platform (eksisting)                | Evaluasi beasiswa berbasis poin; absensi di sistem terpisah (wajah + lokasi)                                        | Objek pengembangan ulang proyek ini                                                                                                       |

---

## 9. Data yang Masih Kurang — Pertanyaan untuk Internal/Teman User

1. Bobot poin: berapa poin per kegiatan? Apakah beda menurut jenis kegiatan
   (BI/wilayah/Komsat), peran (peserta vs panitia), atau durasi?
2. Radius geofence & jendela absensi yang dipakai sistem absensi sekarang?
   Check-in saja, atau check-in + check-out?
3. Apakah poin sekarang masuk **murni otomatis**, atau tetap ada validasi
   manual Internal Manajemen/Sekretaris sebelum final?
4. Ambang/target poin per semester dan konsekuensinya (evaluasi/pencairan
   beasiswa)?
5. Daftar Komsat final saat ini? Jadwal publik sudah menampilkan label UNG,
   IAIN SAG, UG, UMGO, UBM, UNIGO, UIN — perlu daftar resmi + satu nama baku
   per Komsat (UG atau UNIGO? IAIN SAG atau UIN? UBM = UBMG?).
6. Kebijakan walk-in dan titip absen terdeteksi? Untuk pengurangan poin:
   halaman Statistik membuktikan nilai bisa sampai −23, jadi mekanismenya
   ADA — yang perlu ditanyakan: pengurangan itu karena apa (tidak hadir?
   pelanggaran? keterlambatan?) dan berapa besarannya per kejadian.
7. Data wajah sekarang disimpan dalam bentuk apa, dan siapa pengelolanya?
8. Apakah leaderboard bersifat publik (seperti Bengkulu) atau internal saja?
9. Siapa yang berhak membuat kegiatan: Internal Manajemen saja, atau
   Sekretaris Komsat juga untuk kegiatan Komsatnya?
10. Format laporan yang dibutuhkan Sekretaris Wilayah/BI (Excel/PDF, per apa)?

---

## 10. Sumber

1. genbigto.site — halaman utama GenBI Gorontalo (diakses 3 Nov 2026).
2. Instrumen IPPL — "Analisis Kebutuhan Pengguna Website Genbigto.site"
   (PDF lampiran user, 2026).
3. azhr.cloud — portofolio pengembang: "Genbigto Score Platform — Scholarship
   evaluation system", Fyodor Lab — GenBI Gorontalo.
4. rumah-genbi.com/leaderboard — Rumah GenBI Bengkulu: mekanisme poin
   keaktifan & leaderboard.
5. Repository UPN "Veteran" Jawa Timur (2026) — Skripsi GenPoint: Sistem
   Informasi Pengelolaan Poin Keaktifan GenBI (RAD + gamifikasi).
6. Repository Polibatam (2025) — Sistem Informasi Manajemen Keanggotaan GenBI
   (QR dinamis + poin keaktifan).
7. magentaku.id — profil Sekretaris GenBI: tugas pengabsensian & rekapitulasi
   poin keaktifan guna pencairan beasiswa.
8. otanaha.id (15 Jun 2026) — Orientasi GenBI 2026 BI Gorontalo: 5 PT mitra.
9. JOISIE Vol. 10 No. 1 (2026) — Dual-Layer Anti-Spoofing presensi: liveness
   CNN + geofencing Haversine.
10. Sistemasi (2025–2026) — presensi face recognition + geolocation Haversine.
11. bi.go.id & genbi.id — konteks GenBI nasional: frontliner, change agent,
    future leader; program Beasiswa Bank Indonesia.

---

## 11. Daftar Asumsi Tertulis & Gerbang Keputusan (ditambahkan 3 Nov 2026 mengikuti review)

Review atas dokumen ini menyimpulkan: valid untuk analisis/desain, belum
untuk develop penuh. Bagian ini adalah jawabannya — asumsi dibuat EKSPLISIT
agar pengembangan bisa jalan tanpa mengarang fakta. Asumsi berlaku sampai
digantikan jawaban konfirmasi.

### 11.1 Asumsi yang diadopsi

| Kode | Asumsi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  | Dasar / alasan                                                                              |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| A-01 | Proyek ini **prototipe UAS yang berdiri sendiri**. TIDAK ada migrasi data dari sistem lama (±404 akun, 59 kegiatan, riwayat poin hanya jadi referensi statistik) dan tidak menggantikan sistem berjalan                                                                                                                                                                                                                                                                                                                                 | User tidak punya source code/akses sistem lama; ruang lingkup mata kuliah                   |
| A-02 | ~~Alur absensi sebagai hipotesis~~ → **SELESAI**: alur absensi TERKONFIRMASI orang dalam (Bagian 2.3). Asumsi ini gugur dan digantikan fakta                                                                                                                                                                                                                                                                                                                                                                                            | Konfirmasi teman user 3 Nov 2026                                                            |
| A-03 | Aturan poin **sepenuhnya parameter yang dapat diatur** dan **seluruhnya di-set oleh Internal Manajemen** (konsekuensi model 3 aktor): kategori poin + bobot diisi IM saat kegiatan dibuat, dapat dibedakan per kegiatan/divisi target/peran. Tidak ada angka yang dikunci di kode. Setelah kegiatan dikunci, bobot beku (perubahan hanya via transaksi koreksi tercatat). Mekanisme penalti/poin negatif TIDAK dibangun (keputusan user: tidak penting, di luar scope) — tabel poin_transaksi tetap mendukung debit hanya untuk koreksi | Bobot asli belum diketahui; kewenangan disederhanakan mengikuti pencabutan aktor sekretaris |
| A-04 | MVP absensi **tanpa face matching otomatis** (geofence + foto bukti + timestamp server); face matching = fase 2. **Status: DISETUJUI sebagai scope kerja** — user memutuskan masuk tahap develop 3 Nov 2026; selaras praktik terkonfirmasi (validasi asli = jarak + foto)                                                                                                                                                                                                                                                               | Beban akurasi/privasi vs skala UAS; keterbatasan web soal mock location diterima & dicatat  |
| A-05 | Absensi **check-in saja**, tanpa check-out                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              | Belum ada bukti praktik check-out                                                           |
| A-06 | Satu mahasiswa = **satu peran per kegiatan**; idempotensi per pendaftaran_id                                                                                                                                                                                                                                                                                                                                                                                                                                                            | Menutup bentrok model data                                                                  |
| A-07 | Hipotesis nilai −23: tiga anggota UMGO bernilai sama persis −23 mengindikasikan **penalti seragam berbasis aturan** (mis. satu ketetapan penalti yang dikenakan massal) atau anomali impor data — HIPOTESIS review, belum terbukti; masuk daftar tanya                                                                                                                                                                                                                                                                                  | Pola angka identik lintas orang                                                             |

### 11.2 Daftar Komsat baku — SAH (terkonfirmasi orang dalam, 3 Nov 2026)

Daftar ini disahkan oleh jawaban teman user ("ung, iain, ug, umgo, ubm")
dan cocok dengan bukti berita orientasi 2026 (lima perguruan tinggi
mitra). Nama baku mengikuti penamaan orang dalam; label situs dipetakan:

| Kode baku | Nama baku                          | Label lain yang muncul di jadwal situs/berita |
| --------- | ---------------------------------- | --------------------------------------------- |
| UNG       | Universitas Negeri Gorontalo       | —                                             |
| IAIN      | IAIN Sultan Amai Gorontalo         | IAIN SAG, UIN                                 |
| UG        | Universitas Gorontalo              | UNIGO                                         |
| UMGO      | Universitas Muhammadiyah Gorontalo | —                                             |
| UBM       | Universitas Bina Mandiri Gorontalo | UBMG                                          |

Filter "UNG, UMGO, UNIGO" dari wawancara Instrumen IPPL dipetakan ke kode
baku UNG, UMGO, UG. **Status: SAH untuk di-seed sebagai master data.**

### 11.3 Empat gerbang sebelum develop penuh (dari review) — STATUS DIPERBARUI

1. ✅ **TERTUTUP** — Konfirmasi alur absensi: TERKONFIRMASI orang dalam
   (Bagian 2.3): absensi form web lain (username + lokasi + foto → poin
   otomatis), pen-set = Internal Manajemen.
2. ✅ **TERTUTUP** — Daftar Komsat baku SAH (11.2): UNG, IAIN, UG, UMGO, UBM.
3. ✅ **TERTUTUP sebagai scope kerja** — User memutuskan masuk tahap
   develop (3 Nov 2026) dengan scope MVP A-04 (tanpa face matching).
   Persetujuan dosen tetap jalur aman, tapi tidak lagi menghalangi coding.
4. 🔶 **SEBAGIAN** — Aturan poin: kewenangan diputuskan (semua di Internal
   Manajemen, lihat A-03 revisi); angka bobot asli tetap tidak diketahui →
   A-03 (parameter) tetap berlaku. Penalti poin negatif: DITUTUP oleh
   keputusan user (tidak penting, di luar scope).

Yang BOLEH jalan sebelum gerbang tertutup (sesuai rekomendasi review):
KF-01, KF-02, KF-03, KF-06, KF-09, KF-10, KF-11, KF-12, skema DB inti,
desain UI/alur — semuanya dengan parameter yang dapat diatur.

### 11.4 Status verifikasi sumber (kejujuran pustaka)

- **Dibuka & dibaca langsung oleh Feign:** seluruh halaman publik
  genbigto.site; halaman portofolio azhr.cloud; halaman leaderboard Rumah
  GenBI Bengkulu; artikel otanaha.id (teks penuh, diverifikasi 3 Nov 2026);
  abstrak + daftar isi skripsi GenPoint UPN Jatim.
- **Baru level abstrak/cuplikan hasil pencarian:** JOISIE 2026, jurnal
  Sistemasi, abstrak repository Polibatam, profil Magenta. Klaim yang
  bersandar pada sumber ini harus dicek teks penuhnya sebelum masuk daftar
  pustaka laporan final.

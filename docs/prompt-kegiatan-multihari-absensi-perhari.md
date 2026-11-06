MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Tugas: Kegiatan multi-hari + sesi absensi per hari + absensi & poin per hari

Konteks terverifikasi (jangan diperdebatkan, jadikan acuan):

- Saat ini `kegiatan` hanya punya `tanggal` (date), `jam_mulai`, `jam_selesai`, dan SATU jendela absensi `absensi_buka_at`/`absensi_tutup_at` (datetime). `kehadiran.pendaftaran_id` UNIQUE (satu pendaftaran = satu kehadiran = poin sekali). Produksi berjalan di PostgreSQL (Heroku), lokal MySQL, test SQLite — SEMUA SQL mentah wajib portabel di tiga mesin (tanpa fungsi khas satu mesin seperti DATE()/TIME()/DATE_FORMAT()).
- Keputusan pemilik proyek: kegiatan boleh berlangsung beberapa hari; absensi dilakukan PER HARI (check-in sendiri tiap hari); poin dikredit PER HARI kehadiran valid; Internal Manajemen (IM) mengatur jendela absensi TIAP HARI — boleh jam yang sama untuk semua hari, boleh beda per hari.

## Bagian A — Rentang tanggal kegiatan

1. Migrasi BARU (jangan edit migrasi lama): tambah kolom `tanggal_selesai` (date, nullable) sesudah `tanggal` di tabel `kegiatan`. Semantik: `tanggal` = tanggal mulai; `tanggal_selesai` null atau sama dengan `tanggal` = kegiatan satu hari. Tambahkan accessor/metode pembantu di model `Kegiatan`, mis. `tanggalSelesaiEfektif()` yang mengembalikan `tanggal_selesai ?? tanggal`, dan pakai itu di semua tempat yang membutuhkan ujung rentang. Daftarkan `tanggal_selesai` di Fillable + casts (`date`) + docblock.
2. `Kegiatan::statusEfektif()`: waktu mulai = `tanggal` + `jam_mulai`; waktu selesai = `tanggalSelesaiEfektif()` + `jam_selesai`. Logika status tersimpan (Draft/Dibatalkan/Terkunci menang) tidak berubah.
3. `scopeStatusEfektif()`: sesuaikan padanan SQL-nya dengan semantik yang sama — sisi "sudah selesai" memakai tanggal selesai efektif, sisi "sudah mulai" memakai tanggal mulai. `COALESCE(tanggal_selesai, tanggal)` diperbolehkan (portabel). Status Berlangsung untuk rentang: sudah melewati mulai DAN belum melewati selesai.
4. `scopeUrutJadwal()`: kelompok mendatang (grup 0) = kegiatan yang WAKTU SELESAINYA (tanggal selesai efektif + `jam_selesai`) belum lewat; urutan dalam kelompok mendatang tetap tanggal mulai ASC lalu `jam_mulai` ASC; kelompok lewat diurutkan tanggal selesai efektif DESC lalu `jam_selesai` DESC. Pertahankan lima `orderByRaw` CASE + `orderBy('id')` dan kolom TELANJANG (tanpa fungsi) seperti hasil perbaikan Postgres sebelumnya — jangan kembalikan DATE()/TIME().
5. Validasi `StoreKegiatanRequest` & `UpdateKegiatanRequest`:
    - `tanggal_selesai`: nullable, `date_format:Y-m-d`, `after_or_equal:tanggal`.
    - Aturan `jam_selesai` `after:jam_mulai` HANYA berlaku bila kegiatan satu hari (tanggal_selesai kosong atau sama dengan tanggal); untuk multi-hari aturan itu tidak diberlakukan (jam adalah jam harian kegiatan).
    - Empty string dari form untuk `tanggal_selesai` dinormalisasi menjadi null di `prepareForValidation` (ikuti pola field nullable yang sudah ada).
6. Create/Update Action kegiatan: simpan `tanggal_selesai` (null bila kosong).

## Bagian B — Sesi absensi per hari

1. Migrasi + model BARU `SesiAbsensi` (tabel `sesi_absensi`): `id`, `kegiatan_id` FK cascadeOnDelete, `tanggal` (date), `jam_buka` (time), `jam_tutup` (time), timestamps, UNIQUE (`kegiatan_id`, `tanggal`). Relasi: `Kegiatan::sesiAbsensi()` HasMany terurut tanggal; `SesiAbsensi::kegiatan()` BelongsTo. Metode pembantu di SesiAbsensi: `bukaAt()` dan `tutupAt()` mengembalikan Carbon gabungan tanggal+jam di zona waktu aplikasi.
2. BACKFILL di migrasi yang sama (portabel, pakai query builder, tanpa SQL khas mesin): untuk setiap kegiatan yang sudah ada, buat tepat satu baris sesi pada `tanggal` kegiatan dengan `jam_buka` = bagian jam dari `absensi_buka_at` dan `jam_tutup` = bagian jam dari `absensi_tutup_at`. `down()`: hapus tabel sesi (dan kolom `tanggal_selesai` untuk migrasi Bagian A).
3. KEPUTUSAN DESAIN WAJIB: kolom `absensi_buka_at`/`absensi_tutup_at` di `kegiatan` DIPERTAHANKAN sebagai jendela keseluruhan dan menjadi NILAI TURUNAN — setiap Create/Update kegiatan menghitungnya dari sesi: `absensi_buka_at` = sesi hari pertama (tanggal terkecil) gabungan jam_buka; `absensi_tutup_at` = sesi hari terakhir (tanggal terbesar) gabungan jam_tutup. Semua pembaca lama kolom ini (prop halaman, pagar pendaftaran/batal, dsb.) TIDAK diubah perilakunya. Jangan menghapus kolom ini dan jangan biarkan form mengisinya secara independen lagi.
4. FormRequest: ganti validasi input `absensi_buka_at`/`absensi_tutup_at` dari form menjadi input `sesi_absensi`: array wajib, minimal 1 baris; tiap baris: `tanggal` wajib `date_format:Y-m-d`, `jam_buka` wajib `date_format:H:i`, `jam_tutup` wajib `date_format:H:i` dan `after:jam_buka`. Validasi lanjutan di `after()`:
    - Himpunan tanggal sesi HARUS PERSIS sama dengan seluruh hari dari `tanggal` sampai `tanggal_selesai` efektif (tidak kurang, tidak lebih, tanpa duplikat) — pesan error Bahasa Indonesia pada field `sesi_absensi`.
    - Pagar lama "absensi buka maksimal 12 jam sebelum mulai / tutup maksimal 12 jam sesudah selesai" DIHAPUS untuk jendela per sesi (jendela kini selalu di dalam hari kalendernya sendiri); aturan pendaftaran yang merujuk `absensi_tutup_at` turunan tetap jalan seperti sebelumnya.
    - Pesan validasi baru dalam Bahasa Indonesia mengikuti gaya `messages()` yang ada.
5. Create/Update Action: dalam transaksi yang sama, tulis ulang baris sesi kegiatan dari input (hapus sesi lama, buat yang baru — pola yang sama seperti divisi target/bobot), lalu hitung & simpan `absensi_buka_at`/`absensi_tutup_at` turunan. Parameter sensitif yang membeku sesudah ada kehadiran valid: perilaku pembekuan yang sudah ada untuk jadwal TIDAK berubah cakupannya — jangan longgarkan dan jangan perluas tanpa test.
6. Factory `KegiatanFactory`: sesudah kegiatan dibuat, buat baris sesi yang cocok dengan `absensi_buka_at`/`absensi_tutup_at` factory (satu baris pada `tanggal`, jam dari kedua kolom itu) supaya test lama yang mengandalkan jendela absensi tetap bermakna. Seeder yang membuat kegiatan lewat model langsung (DemoSeeder, TrenDemoSeeder, DatabaseSeeder bila ada): tambahkan pembuatan sesi yang setara untuk kegiatan yang dibuatnya (satu baris dari jendela absensinya). Jangan mengubah data/judul/tanggal kegiatan demo yang sudah ada.

## Bagian C — Check-in per hari & poin per hari

1. Migrasi BARU untuk `kehadiran`: tambah kolom `tanggal` (date, nullable dulu), backfill `tanggal` = tanggal dari `waktu_checkin` (di zona waktu aplikasi; backfill boleh memakai ekspresi tanggal standar yang portabel — bila ragu, lakukan iterasi query builder per baris), lalu jadikan NOT NULL; HAPUS unique lama pada `pendaftaran_id`, ganti UNIQUE komposit (`pendaftaran_id`, `tanggal`). Model `Kehadiran`: Fillable + cast `tanggal` => `date`.
2. Relasi `Pendaftaran::kehadiran()` berubah HasOne → HasMany `kehadiran()` (nama relasi tetap `kehadiran`, terurut `tanggal`). SEMUA pemakai lama yang mengasumsikan satu objek WAJIB disesuaikan dengan semantik per hari:
    - `Mahasiswa/KegiatanController` (show + resolveStudentRegistrationStatus): `memilikiKehadiran` = ada baris kehadiran apa pun; `sudah_hadir`/status tampil: bila ada kehadiran VALID untuk HARI INI → "Sudah Hadir"; prop `kehadiran` menjadi daftar per hari (`daftar_kehadiran`: array tanggal, status, status_label, alasan, poin_terkredit) + `kehadiran_hari_ini` (objek atau null). `dapatAbsen` = terdaftar aktif DAN belum ada kehadiran untuk hari ini DAN sekarang di dalam sesi hari ini. `dapatMembatalkan` tetap mensyaratkan belum ada kehadiran sama sekali.
    - `Mahasiswa/AbsensiController`: halaman check-in memakai SESI HARI INI: kirim prop sesi hari ini (tanggal, jam_buka, jam_tutup) + kehadiran hari ini (bukan lagi satu kehadiran tunggal); bila tidak ada sesi untuk hari ini, halaman menyatakan absensi tidak dijadwalkan hari ini.
    - `Mahasiswa/DashboardController`, `Admin/MonitoringKegiatanController`, `Admin/PesertaKegiatanController` (daftar peserta: tampilkan jumlah hari hadir valid + daftar ringkas per hari), `Admin/KoreksiController`: sesuaikan ke HasMany tanpa mengubah makna bisnis selain per-hari. `Kegiatan::kehadiran()` HasManyThrough tetap.
    - Frontend (.tsx) yang membaca prop yang berubah bentuk WAJIB disesuaikan sampai `npm run types:check` dan `npm run build` hijau; label tanggal memakai format Indonesia yang sudah dipakai halaman lain.
3. `SubmitAttendanceAction`:
    - Ambil sesi untuk TANGGAL HARI INI (zona waktu aplikasi) dari kegiatan terkunci. Bila tidak ada sesi hari ini → ValidationException 'Absensi tidak dijadwalkan untuk hari ini.' Bila sekarang sebelum sesi buka → 'Jendela absensi belum dibuka.'; sesudah sesi tutup → 'Jendela absensi sudah ditutup.' (Gerbang jendela keseluruhan lama dari `absensi_buka_at`/`absensi_tutup_at` DIGANTI gerbang sesi ini.)
    - Pencarian kehadiran yang sudah ada kini difilter `pendaftaran_id` DAN `tanggal` = hari ini; bila ada → jalur idempotent yang sama seperti sekarang (audit `kehadiran.duplicate_attempt` + kembalikan baris itu). Kehadiran hari-hari sebelumnya TIDAK menghalangi check-in hari ini.
    - Baris kehadiran baru mengisi `tanggal` = hari ini. Selain itu seluruh logika TIDAK berubah: Haversine server, radius, akurasi ≤100 m untuk valid otomatis, menunggu_tinjau, ditolak tetap tersimpan + foto privat, poin kredit DALAM TRANSAKSI YANG SAMA sebesar bobot peran pendaftaran (dikredit SEKALI PER HARI = satu baris poin per kehadiran valid; `poin_transaksi.kehadiran_id` tetap pengikatnya), audit `kehadiran.submitted` (tambahkan `tanggal` ke metadata).
4. Tinjauan/koreksi IM atas kehadiran menunggu_tinjau: pastikan alur persetujuan yang ada tetap bekerja per baris kehadiran (per hari) dan kredit poinnya tetap satu baris per kehadiran; jangan ubah aturannya. Penghambat kunci kegiatan (kehadiran menunggu_tinjau / koreksi menunggu) tetap dihitung atas semua baris.

## Bagian D — Formulir & tampilan

1. `resources/js/components/kegiatan/kegiatan-form.tsx`: tambah input "Tanggal Selesai" (date, boleh kosong, placeholder/petunjuk "Kosongkan bila kegiatan hanya satu hari") di samping "Tanggal". GANTI dua input datetime jendela absensi lama dengan bagian "Jadwal Absensi per Hari": daftar baris yang dibuat OTOMATIS mengikuti rentang tanggal (satu baris per hari, label tanggal Bahasa Indonesia), tiap baris punya input jam buka & jam tutup; sediakan dua input "Jam buka semua hari" + "Jam tutup semua hari" dengan tombol "Terapkan ke semua hari" yang mengisi semua baris (nilai awal semua baris sama). Pertahankan nilai baris yang sudah diedit user saat rentang berubah sejauh tanggalnya masih ada. Mode edit: baris diisi dari sesi tersimpan kegiatan. Hapus pengiriman `absensi_buka_at`/`absensi_tutup_at` dari payload form; kirim `tanggal_selesai` + `sesi_absensi`.
2. Tampilan tanggal di kartu/detail: buat helper format rentang (di tempat yang paling konsisten dengan pola proyek) — satu hari: seperti sekarang; multi-hari: "13–15 Nov 2026" bila bulan sama, "30 Nov – 2 Des 2026" bila beda bulan, selalu disertai jam harian. Terapkan di: jadwal publik (index + show), beranda publik, panel mahasiswa (index + show), panel admin kegiatan (index + show + monitoring), dashboard admin & mahasiswa seperlunya. Jangan ubah format tanggal di luar konteks kegiatan.
3. Detail mahasiswa: tampilkan daftar sesi absensi kegiatan (tanggal + jam buka–tutup per hari) dan daftar kehadiran per hari miliknya. Halaman check-in menampilkan sesi hari ini dengan jelas.

## Bagian E — Test

1. Test lama yang gugur karena perubahan bentuk (payload form kegiatan, prop kehadiran tunggal, jendela absensi) BOLEH disesuaikan isinya mengikuti desain baru, tetapi cakupan perilakunya tidak boleh menyusut; laporkan test mana saja yang diubah dan kenapa.
2. Test BARU wajib (feature test, pola file yang ada):
    - Membuat kegiatan multi-hari dengan sesi per hari (jam sama semua hari) tersimpan benar + `absensi_buka_at`/`absensi_tutup_at` turunan benar.
    - Validasi: tanggal_selesai sebelum tanggal mulai ditolak; himpunan tanggal sesi kurang/lebih dari rentang ditolak; jam_tutup ≤ jam_buka pada satu sesi ditolak; multi-hari dengan jam_selesai ≤ jam_mulai DITERIMA.
    - `statusEfektif` multi-hari: hari ke-2 di antara jam kegiatan = Berlangsung; sesudah tanggal selesai + jam selesai = Selesai.
    - Urutan jadwal: kegiatan multi-hari yang tanggal mulainya sudah lewat tetapi tanggal selesainya belum lewat tetap di kelompok mendatang.
    - Check-in hari ke-1 valid → poin kredit 1 baris; check-in hari yang sama diulang → idempotent (tetap 1 baris kehadiran hari itu, poin tidak dobel); check-in hari ke-2 valid → kehadiran kedua + poin kredit kedua; total poin mahasiswa = 2 × bobot.
    - Check-in di luar sesi hari ini (sebelum buka / sesudah tutup / tidak ada sesi hari ini) ditolak dengan pesan validasi, tanpa baris kehadiran.
    - Kegiatan satu hari: seluruh perilaku lama (check-in valid, idempotent, poin sekali) tetap lulus.
3. Gerbang (semua wajib hijau, laporkan angkanya persis): `php artisan test --compact` (baseline sebelum tugas 236 passed, 7 skipped, 0 failed — jumlah akhir harus NAIK karena test baru, failed tetap 0), `vendor\bin\pint`, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build`.

## Larangan

- Jangan mengubah: aturan bobot poin per peran, Haversine/radius/ambang akurasi, alur pendaftaran & kuota, ledger poin selain yang disebut, skema tabel selain `kegiatan.tanggal_selesai`, `sesi_absensi`, dan `kehadiran.tanggal` + indeksnya.
- Jangan menghapus kolom `absensi_buka_at`/`absensi_tutup_at`.
- Jangan menulis SQL mentah khas satu mesin database.
- Jangan `git add -A`; stage per berkas. Jangan commit tanpa melaporkan hasil gerbang dulu di jawaban akhirmu.

## Bagian F — Overflow horizontal mobile di halaman Pengajuan Koreksi

Diagnosis terverifikasi dari kode (bukan tebakan): di `resources/js/pages/mahasiswa/koreksi/index.tsx`, kedua `<select>` natif pada formulir (Kegiatan, baris ±136; Jenis Koreksi, baris ±165) memakai class `h-11 rounded-md border border-input bg-background px-3 text-sm md:h-9` — TIDAK ada `w-full` dan TIDAK ada `min-w-0`, sementara semua saudaranya punya: `ui/input.tsx` memakai `flex h-9 w-full min-w-0`, `ui/textarea.tsx` memakai `w-full`, dan select natif di `admin/kegiatan/peserta.tsx` memakai `flex h-11 w-full`. Akibatnya select dirender selebar konten terpanjangnya (judul kegiatan panjang, mis. "Pelatihan Jurnalisme Warga dan Desain Konten Edukasi ...") dan menembus tepi kanan kartu + layar pada viewport mobile; rambatannya yang membuat textarea dan input file di bawahnya ikut tampak melebar. Kerangka layout (`SidebarInset`) sudah benar (`max-w-full`) — JANGAN diubah.

1. Perbaiki KEDUA select di halaman koreksi mahasiswa itu menjadi pola proyek yang baku: tambahkan `w-full min-w-0` pada class-nya (samakan dengan pola select peserta: `flex h-11 w-full min-w-0 ... md:h-9`), tanpa mengubah atribut/logika lain. Tambahkan juga `min-w-0` pada div pembungkus grid tiap field bila diperlukan agar kolom grid benar-benar bisa menyusut (ikuti kebutuhan hasil render, seminimal mungkin).
2. Audit singkat pola yang sama: periksa semua `<select>` natif lain di `resources/js/pages` dan `resources/js/components` yang belum memakai `w-full` (saat prompt ini ditulis: `resources/js/pages/settings/profile.tsx` memiliki select tanpa `w-full` di dalam grid dua kolom — perbaiki dengan pola yang sama bila terbukti bisa meluber; bila tidak meluber, tetap samakan polanya dan catat di laporan). Jangan mengubah komponen `ui/select.tsx` (Radix) maupun layout global.
3. Verifikasi WAJIB dengan pengukuran, bukan klaim: render halaman koreksi mahasiswa pada lebar 390 px dan 360 px (Playwright/device mode) dan laporkan `document.documentElement.scrollWidth <= window.innerWidth` (overflow horizontal = 0), sesudah memilih opsi kegiatan berjudul panjang pada select pertama. Sertakan juga cek sekilas 1280 px agar tata letak desktop tidak berubah. Bila tool browser tidak tersedia di sesimu, buktikan lewat inspeksi class akhir + nyatakan dengan jujur bahwa pengukuran viewport tidak dijalankan.
4. Bagian ini TIDAK mengubah backend, route, atau test PHP; gerbang frontend (`npm run types:check`, `npm run check`, `npm run build`) tetap wajib hijau.

## Bagian G — Tab filter "Bisa Didaftar" di panel kegiatan mahasiswa

Tujuan: mahasiswa tidak perlu berburu manual kegiatan mana yang bisa ia daftari. Tambahkan tab ketiga pada `Mahasiswa/KegiatanController@index` di samping tab "untuk_saya" dan "semua":

1. Tab baru dengan parameter `tab=bisa_daftar`, nama halaman paginasi sendiri `halaman_bisa_daftar` (9 per halaman, independen dari dua tab lain, mengikuti pola yang ada), dan parameter pencarian `q` tetap berlaku di dalam tab ini. Resolusi tab yang ada (termasuk parameter warisan `untuk_saya`) tidak boleh rusak: tab eksplisit selalu menang.
2. Syarat sebuah kegiatan muncul di tab ini — semuanya di level query (BUKAN menyaring sesudah paginasi), SQL portabel tiga mesin:
    - kegiatan terbit untuk umum (scope `terbit()` yang ada) DAN belum selesai secara efektif: waktu selesai (tanggal selesai efektif + `jam_selesai`, semantik Bagian A) belum lewat;
    - mahasiswa adalah divisi target kegiatan itu;
    - mahasiswa BELUM punya pendaftaran berstatus terdaftar pada kegiatan itu;
    - mahasiswa BELUM punya kehadiran apa pun pada kegiatan itu (pendaftaran lama yang batal TANPA kehadiran boleh muncul lagi; yang punya kehadiran tidak);
    - jendela pendaftaran sedang buka: (`pendaftaran_dibuka_at` null ATAU ≤ sekarang) DAN (`batas_daftar_at` null ATAU ≥ sekarang);
    - kuota belum penuh: `kuota` null ATAU jumlah pendaftaran terdaftar < `kuota` (hitung lewat subquery COUNT standar di WHERE, bukan having alias).
      Satu penyimpangan yang disengaja dari logika tombol di halaman detail: kegiatan yang sudah selesai secara efektif disembunyikan walau aksi daftar lama secara teknis masih menerimanya bila `batas_daftar_at` kosong — catat penyimpangan ini di laporanmu, jangan ubah aturan aksi daftar.
3. Frontend `resources/js/pages/mahasiswa/kegiatan/index.tsx`: tombol tab ketiga "Bisa Didaftar" sejajar dua tab yang ada (gaya dan pola URL sama), status kosong tab ini: "Tidak ada kegiatan yang bisa didaftar saat ini." Jangan ubah tampilan dua tab lama.
4. Test baru wajib: kegiatan memenuhi semua syarat muncul; masing-masing satu skenario gugur per syarat (sudah terdaftar, kuota penuh, pendaftaran belum dibuka, lewat batas daftar, sudah selesai efektif — termasuk kegiatan multi-hari yang tanggal mulainya lewat tetapi tanggal selesainya belum lewat HARUS tetap muncul, bukan divisi target, pendaftaran batal tanpa kehadiran muncul lagi, pendaftaran dengan kehadiran tidak muncul); paginasi tab ini tidak mencampuri nomor halaman dua tab lain.

## Bagian H — Pilihan lapisan peta (Jalan / Satelit) pada pemilih lokasi

Konteks terverifikasi: peta proyek memakai Leaflet dengan ubin OpenStreetMap standar (`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`) di SATU komponen, `resources/js/components/kegiatan/leaflet-picker.tsx`, yang dipakai formulir kegiatan maupun tampilan peta read-only lain. Data OSM memang berbeda dari Google Maps (sumber & gaya gambar berbeda) — itu bukan kerusakan. Yang ditambahkan di sini hanyalah lapisan citra satelit sebagai alternatif tampilan; koordinat, lingkaran geofence, dan logika apa pun TIDAK berubah.

1. Di `leaflet-picker.tsx`, tambahkan kontrol lapisan bawaan Leaflet (`LayersControl` dari react-leaflet, atau mekanisme setara yang konsisten dengan pola komponen ini) dengan dua lapisan dasar:
    - "Jalan" — ubin OpenStreetMap yang sekarang, tetap menjadi bawaan (checked).
    - "Satelit" — Esri World Imagery: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}` dengan atribusi `Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics`, DITAMBAH lapisan label nama jalan di atasnya (gabungkan sebagai satu pilihan lapisan/grup) memakai ubin label CARTO `https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png` dengan atribusi `&copy; OpenStreetMap contributors &copy; CARTO` — hasilnya mode hibrida seperti satelit Google Maps: citra udara + nama jalan tetap terbaca. Catatan yang tidak boleh dilanggar: nama jalan di SEMUA lapisan tetap berasal dari data OpenStreetMap — mengambil nama/data jalan dari Google ke peta ini melanggar ketentuan Google dan memang tidak disediakan jalurnya; jangan mencoba mengakalinya.
2. Jangan mengubah: URL/atribusi lapisan OSM yang ada, properti komponen (`latitude`, `longitude`, `radius`, `readOnly`, `onLocationChange`), perilaku klik-peta, `MapUpdater`, lingkaran geofence (#0035a0), dan pemakaian komponen ini di halaman mana pun. Jangan menambahkan dependensi baru; jangan memakai ubin Google Maps (melanggar ketentuan Google — lapisan Google resmi butuh Google Maps JS API + kunci API berbayar, di luar scope).
3. Verifikasi: `npm run types:check`, `npm run check`, `npm run build` hijau; buktikan manual/Playwright bahwa kontrol lapisan muncul di formulir kegiatan dan mode read-only, lapisan Satelit memuat citra (bukan ubin abu-abu), dan memilih titik di kedua lapisan menghasilkan koordinat yang sama. Laporkan hasilnya di laporan akhir.

## Laporan akhir wajib

Ringkasan per bagian (A–H), daftar berkas yang diubah/dibuat, test lama yang disesuaikan + alasannya, hasil pengukuran overflow Bagian F, angka semua gerbang, dan pesan commit yang disarankan: `feat: add multi-day activities with per-day attendance sessions` (Bagian F boleh di-commit terpisah lebih dulu: `fix: prevent horizontal overflow on mobile correction form`; Bagian G boleh menyusul di commit yang sama dengan fitur utama; Bagian H boleh di-commit terpisah: `feat: add satellite base layer option to location picker`).

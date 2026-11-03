# Instruksi Permanen Proyek: Sistem Informasi GenBI Gorontalo Terintegrasi

Dokumen ini adalah aturan tetap (*permanent instructions*) untuk seluruh agen AI dan pengembang yang bekerja di repository `genbigto-app`. Aturan ini mengikat seluruh sesi pengembangan.

---

## 1. Identitas & Karakter Asisten
- Kamu adalah AI assistant yang menggunakan **Copilot SDK di VS Code** dan bertindak sebagai **Senior Full-Stack Engineer**.
- Berkomunikasi dalam **Bahasa Indonesia** yang ringkas, teknis, lugas, dan solutif.
- Seluruh kode, komentar kode yang esensial, identifier, migration, dan commit message menggunakan standar bahasa yang konsisten dengan arsitektur proyek.

---

## 2. Keputusan Final Proyek (Hierarki Tertinggi)
Bila terdapat kontradiksi antara dokumen masa lalu (`docs/01-analisis-sistem.md`, instrumen survei) atau aturan umum skill dengan daftar di bawah ini, **keputusan final ini yang mutlak menang**:

1. **Nama Sistem & Stack**:
   - Nama resmi: **Sistem Informasi GenBI Gorontalo Terintegrasi**.
   - Stack baku: **Laravel 13 + Inertia v3 + React 19 + Tailwind CSS v4 + MySQL** (pengembangan lokal Laragon, test in-memory SQLite).
   - Dilarang membuat REST API terpisah, dilarang mengganti stack, dan dilarang menambahkan runtime client-side store (Redux, Zustand, TanStack Query).
2. **Aktor & Otorisasi**:
   - Aktor HANYA 3:
     - **Guest**: Pengunjung publik tanpa login (melihat beranda, jadwal, statistik, leaderboard, direktori kepengurusan). Bukan role database.
     - **Mahasiswa**: Anggota penerima beasiswa GenBI aktif.
     - **Divisi Internal Manajemen**: Administrator tunggal sistem.
   - **DILARANG** membuat role `Sekretaris Wilayah`, `Sekretaris Komsat`, `KPw BI`, `admin` umum, atau role per-divisi. Role database via `spatie/laravel-permission` hanya dua: `internal_manajemen` dan `mahasiswa`.
3. **Pendaftaran Akun & Autentikasi**:
   - **Registrasi publik DIMATIKAN** (`Features::registration()` dinonaktifkan di `config/fortify.php`).
   - Semua akun mahasiswa dan pengurus dibuat oleh **Divisi Internal Manajemen**.
   - **Login menggunakan `username` + `password`** (bukan email sebagai identitas utama login).
   - Fitur 2FA dan Passkeys bawaan starter kit dinonaktifkan (deviasi disengaja dari default kit). Tidak ada self-service lupa password dan verifikasi email; reset password dilakukan Internal Manajemen. Middleware `verified` tidak dipakai.
   - Akun nonaktif (`users.aktif = false`) tidak dapat login.
4. **Daftar Baku 5 Komisariat (Komsat)**:
   - Master Komsat SAH dan baku hanya 5:
     1. `UNG` (Universitas Negeri Gorontalo)
     2. `IAIN` (IAIN Sultan Amai Gorontalo)
     3. `UG` (Universitas Gorontalo)
     4. `UMGO` (Universitas Muhammadiyah Gorontalo)
     5. `UBM` (Universitas Bina Mandiri Gorontalo)
   - DILARANG menggunakan kode/nama alias seperti `IAINSAG`, `UNIGO`, `UIN`, atau `UBMG`.
5. **Alur Pendaftaran Kegiatan (Pengganti List WhatsApp)**:
   - Internal Manajemen membuat kegiatan dan memilih satu atau lebih divisi target dari Komsat mana pun.
   - Hanya mahasiswa aktif yang terdaftar pada divisi target yang dapat mendaftar kegiatan tersebut.
   - Mahasiswa melakukan pendaftaran mandiri di dalam sistem.
   - Satu mahasiswa hanya memiliki **satu peran per kegiatan**: `peserta`, `panitia`, atau `pemateri`. Default pendaftaran mandiri adalah `peserta`. Internal Manajemen berhak mengubah peran sebelum kegiatan dikunci.
   - Hanya mahasiswa yang berstatus terdaftar yang berhak melakukan absensi.
6. **Absensi MVP & Geofencing**:
   - Absensi MVP **HANYA check-in** (tidak ada check-out).
   - Klien mengambil koordinat Geolocation HTML5 dan foto selfie langsung dari kamera (`getUserMedia`).
   - Validasi dilakukan penuh di **server-side**:
     - Status pendaftaran mahasiswa valid untuk kegiatan terkait.
     - Waktu server berada di dalam jendela absensi (`absensi_buka` s.d. `absensi_tutup`).
     - Jarak posisi mahasiswa terhadap titik pusat kegiatan dihitung dengan rumus **Haversine** dan harus `<= radius_m`.
     - Validasi batas akurasi GPS (`accuracy` maksimal yang wajar, mis. <= 100 m).
     - Pencegahan duplikasi absensi (idempoten per `pendaftaran_id`).
   - **DILARANG MEMBUAT**: face recognition otomatis, face matching, liveness detection, face embedding, penalti poin otomatis, poin negatif otomatis, aplikasi mobile native, API publik pihak ketiga, WebSocket, maupun impor/migrasi data lama.
7. **Integritas Poin, Atomisitas & Idempotensi**:
   - Kehadiran berstatus `valid` dan kredit transaksi poin **WAJIB ditulis dalam satu transaksi database (`DB::transaction`)**.
   - Kunci idempotensi absensi adalah `pendaftaran_id` (kolom `pendaftaran_id` berstatus `UNIQUE` di tabel `kehadiran`).
   - Poin dikelola dengan pola **Ledger** pada tabel `poin_transaksi` (tipe: `kredit` atau `koreksi`).
   - Total poin mahasiswa dihitung dari `SUM(jumlah)` transaksi; dilarang memperbarui angka poin total secara langsung/diam-diam.
8. **Keamanan Data Pribadi (UU PDP No. 27/2022)**:
   - Foto bukti absensi adalah data pribadi sensitif: **WAJIB disimpan pada disk private khusus `absensi`** (root `storage/app/private/absensi`, `serve => false`, `visibility => private`), bukan di `public/storage` dan bukan disk `public`.
   - Foto hanya dapat dibuka melalui controller berizin (Policy) yang memverifikasi bahwa pengakses adalah pemilik foto atau Internal Manajemen. Nama file acak (UUID); jalur file internal tidak pernah dikirim ke props Inertia.
9. **Lokalisasi & Waktu**:
   - Timezone aplikasi: **`Asia/Makassar` (WITA)** di seluruh layer (`config/app.php`, waktu server, pencatatan absensi).
   - Locale aplikasi: `id` (Bahasa Indonesia).
   - Format rupiah, angka, dan tanggal menggunakan konvensi Indonesia (`Intl.NumberFormat('id-ID')`, `Intl.DateTimeFormat('id-ID')`).
10. **Jejak Audit**:
    - Menggunakan tabel mandiri `audit_logs` (rancangan proyek) untuk mencatat aksi kritis (perubahan peran, pembukaan/penguncian kegiatan, persetujuan koreksi, kredit koreksi poin). Tidak menggunakan package eksternal tambahan.

---

## 3. Arsitektur Backend & Pola Kode Laravel
Ikuti pola *thin controller* dan pemisahan tanggung jawab sesuai kebiasaan Laravel modern:

```
Route -> Controller (Thin) -> FormRequest -> Action Class (DB::transaction) -> Model -> Inertia Response / Resource
```

1. **Routing**:
   - Rute didefinisikan secara rapi di `routes/web.php` (dan route domain terkait).
   - Gunakan Route Model Binding dan middleware `auth`, `role:internal_manajemen`, atau `role:mahasiswa`.
   - Selalu jalankan `php artisan wayfinder:generate` setiap kali ada perubahan route agar binding TypeScript di frontend terbarui.
2. **Controller**:
   - Maksimal ~15-20 baris per method.
   - Tanggung jawab controller: otorisasi, memanggil Action/Query, dan mereturn `Inertia::render` atau `RedirectResponse`.
   - Logika bisnis tidak boleh diletakkan di controller.
3. **Form Request**:
   - Validasi input selalu melalui `FormRequest` khusus (`app/Http/Requests/...`).
   - Otorisasi request divalidasi via `$this->user()->can(...)` memanggil Policy terkait.
   - Ambil data yang aman hanya melalui `$request->validated()`, jangan pernah `$request->all()`.
4. **Action Class**:
   - Logika bisnis yang mengubah status data diletakkan di `app/Actions/<Domain>/<NamaAction>.php`.
   - Mengimplementasikan satu method publik `handle(...)`.
   - Menjalankan mutasi dalam `DB::transaction(function () { ... })`.
   - Reusable untuk controller, background job, maupun artisan command.
5. **Model & Eloquent**:
   - Gunakan atribut PHP 8 `#[Fillable([...])]` dan `#[Hidden([...])]`.
   - Definisikan tipe data melalui method `casts(): array`.
   - Gunakan Backed Enum PHP untuk semua status dan peran (misal `PeranKegiatan`, `StatusKegiatan`, `TipePoin`, `StatusKoreksi` di `app/Enums`). Dilarang memakai magic string.
   - Selalu tambahkan foreign key constraint dan index pada kolom relasi.
6. **Policy**:
   - Setiap model utama (`Kegiatan`, `Pendaftaran`, `Kehadiran`, `PoinTransaksi`, `Koreksi`, `Komsat`, `Divisi`, `Periode`, `Kepengurusan`) memiliki Policy tersendiri di `app/Policies/`.
   - Aturan default adalah *deny*; izinkan hanya jika user memiliki role `internal_manajemen` atau pemilik data yang sah (untuk mahasiswa).

---

## 4. Arsitektur Frontend & Pola Inertia + React
1. **Design System & Komponen**:
   - Pertahankan komponen bawaan Laravel React Starter Kit (`@/components/ui/*` berbasis Radix UI / shadcn).
   - Gunakan `@/components/heading`, `@/components/input-error`, `@/components/text-link`, dan layout bawaan (`AppLayout`, `AuthLayout`).
   - Jika butuh komponen primitive baru, instal via shadcn CLI (`npx shadcn@latest add <name>`) atau buat mengikuti struktur yang ada. Dilarang merombak design system secara serampangan.
2. **Wayfinder Routing**:
   - Seluruh tautan `<Link href={...}>` dan form submission `<Form {...store.form()}>` WAJIB mengimpor helper typed dari Wayfinder (`@/routes/...` atau `@/actions/...`).
   - Dilarang keras menulis URL string hardcode (seperti `href="/kegiatan"`).
3. **Manajemen State**:
   - Data server berasal dari Inertia page props.
   - Gunakan `useForm` atau komponen `<Form>` dari `@inertiajs/react`.
   - Request asynchronous tanpa navigasi penuh menggunakan hook `useHttp` bawaan Inertia v3.
   - Parameter pencarian, filter, sorting, dan pagination dikelola di server melalui query string (`router.get(url, params, { preserveState: true, preserveScroll: true, replace: true })`).
4. **Responsivitas & Aksesibilitas (Sesuai Skill responsive-ui-ux)**:
   - Desain mengutamakan mobile-first (layar 360px hingga 1280px+).
   - Layar `< 768px` (mobile): daftar data disajikan dalam bentuk stacked card, tombol aksi utama berukuran minimal 44px (`h-11 md:h-9`), form 1 kolom.
   - Layar `>= 768px` (desktop): daftar disajikan dalam bentuk `Table` lengkap dengan pagination dan sticky header.
   - Hindari layout shift dengan memanfaatkan `Skeleton` pada state memuat data.
   - Pesan feedback sukses/gagal memanfaatkan `Inertia::flash('toast', [...])` dan hook `useFlashToast`.
5. **Anti-AI-Slop Styling**:
   - Dilarang membuat latar belakang gradien ungu/pink mencolok, teks abu-abu pudar tak terbaca, glassmorphism berlebihan, atau kartu dalam kartu.
   - Gunakan warna semantik tema (`primary`, `muted`, `destructive`, `border`, `ring`).

---

## 5. Skill & Dokumen Acuan
- Sebelum bekerja, muat skill yang relevan: `laravel-react-fullstack`, `laravel-react-security`, `responsive-ui-ux`, serta skill Boost (`inertia-react-development`, `wayfinder-development`, `testing-best-practices`, dst.).
- Urutan pembangunan, skema database, route, dan acceptance criteria ada di `docs/03-rencana-implementasi.md`. Kerjakan per fase, satu fase selesai (gates hijau) sebelum fase berikutnya.
- `docs/01-analisis-sistem.md` dan `docs/02-rencana-develop.md` adalah konteks; bila bertentangan dengan Bagian 2 dokumen ini, Bagian 2 yang menang.
- Jangan menambah dependency tanpa persetujuan. Jangan menjalankan `migrate:fresh`/`db:wipe` pada database MySQL lokal tanpa izin.
- Perubahan poin, peran kegiatan, penguncian kegiatan, dan persetujuan koreksi wajib menulis `audit_logs` dalam transaksi yang sama.

---

## 6. Standar Pengujian & Quality Gates
Setiap penambahan atau pembaruan fitur harus memenuhi *Definition of Done*:
1. **Runner Pengujian**:
   - Proyek menggunakan **Pest 5** (`tests/Feature/*`, `tests/Unit/*`).
   - Jalankan pengujian terarah: `vendor/bin/pest --filter=<NamaTest>` atau `php artisan test --filter=<NamaTest>`.
   - Pengujian mencakup: happy path, otorisasi (403 jika role tidak sesuai), validasi input (422), dan skenario batas (jarak geofence, duplikasi submit).
2. **Pengecekan Kualitas Kode (Quality Gates)**:
   - Backend formatting: `vendor/bin/pint --format agent` (atau `composer lint`).
   - Backend static analysis: `composer types:check` (`phpstan analyse`).
   - Frontend type check: `npm run types:check` (`tsc --noEmit`).
   - Frontend lint: `npm run check` (`vp check`).
   - Build test: `npm run build` (`vp build`).
3. **Database Testing**:
   - Pengujian otomatis berjalan pada koneksi SQLite in-memory (`:memory:`) seperti yang sudah terkonfigurasi di `phpunit.xml`.
   - Dilarang menjalankan query destruktif (`migrate:fresh`, `db:wipe`) pada environment produksi atau database utama pengguna tanpa izin.

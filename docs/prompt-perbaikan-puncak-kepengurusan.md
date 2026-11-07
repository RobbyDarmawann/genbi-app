MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 5. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Perbaikan puncak kepengurusan: gerbang jumlah kartu + geometri batang Ketua Umum

## Fakta terverifikasi dari kode ter-commit (431c70b) & situs live — ini titik berangkatmu

Di `resources/js/pages/public/kepengurusan.tsx`, komponen `OrgChartGroup`:

1. Logika pengumpulan puncak SUDAH benar dan JANGAN diubah: semua Pembina dikumpulkan, `ketua` = non-Pembina pertama, `puncak = [ketua, ...semuaPembina]`, `tier2`/`tier3` dari sisa non-Pembina; tanpa Pembina = pemotongan lama.
2. CACAT A (gerbang): render masih memakai `const hasDualPuncak = puncak.length === 2`. Akibatnya untuk `puncak.length` 3–5 (periode dengan 2–4 Pembina), blok puncak TIDAK ter-render sama sekali — kartu Ketua Umum & Pembina hilang dari halaman (terverifikasi live: periode 2018/2020 hanya menampilkan tier2 dengan garis menggantung di atasnya).
3. CACAT B (geometri): pada blok dual yang lama, garis turun ke tingkat 2 masih berupa `<div className="relative z-0 h-8 w-0.5 bg-border" />` yang diletakkan SESUDAH baris kartu di dalam kontainer `flex flex-col items-center` — garis itu jatuh di TENGAH pasangan, BUKAN di bawah Ketua Umum (terverifikasi live pada periode 2024/2025). Segmen bar horizontalnya juga masih memakai pola gap-12 lama (`-right-6`/`-left-6`, `bottom-0`).

Tugasmu: ganti gerbang dan geometri render puncak (desktop & mobile) persis seperti di bawah. JANGAN menulis ulang logika pengumpulan BAGIAN 1 versi lama.

## BAGIAN 1 — Gerbang baru

1. Ganti `hasDualPuncak` menjadi `const hasMultiPuncak = puncak.length >= 2` dan pakai di SEMUA tempat (desktop & mobile).
2. Untuk jalur `puncak.length < 2` (0 atau 1): render jalur lama persis (tier1 tunggal / tidak ada) — perilaku tidak berubah.

## BAGIAN 2 — Geometri desktop (≥768 px) untuk hasMultiPuncak

Struktur yang WAJIB dihasilkan (ilustrasi untuk puncak = [Ketua, P1, P2]):

```
[Ketua]     [P1]      [P2]
   │          │         │
   ├──────────┴─────────┘     bar horizontal di ketinggian yang sama untuk semua kolom
   │
   │                          satu-satunya garis turun, menempel di kolom Ketua
(tingkat 2)
```

Aturan implementasi:

1. Baris puncak adalah flex `gap-8` (32 px). Tiap kartu dibungkus kolom `relative flex w-[270px] flex-none flex-col items-center sm:w-[290px]`.
2. Isi kolom Ketua (idx 0), bila ada tier bawah (`tier2.length > 0 || tier3.length > 0`):
    - kartu,
    - segmen vertikal `relative z-0 h-8 w-0.5 bg-border`,
    - segmen bar horizontal `absolute bottom-8 z-0 h-0.5 bg-border left-1/2 -right-4` (dari titik tengah Ketua membentang ke kanan melewati setengah gap),
    - segmen vertikal lanjutan `relative z-0 h-8 w-0.5 bg-border` (batang utama turun ke tingkat 2).
      Total tinggi garis di kolom Ketua = h-16.
3. Isi kolom Pembina (idx > 0), bila ada tier bawah:
    - kartu,
    - segmen vertikal `relative z-0 h-8 w-0.5 bg-border`,
    - segmen bar horizontal di `absolute bottom-8`:
        - Pembina tengah (bukan terakhir): `-left-4 -right-4`,
        - Pembina terakhir: `-left-4 right-1/2` (berakhir di titik tengah kartu Pembina terakhir),
    - pengganjal tak terlihat `h-8` (div kosong setinggi h-8, TANPA bg) supaya total tinggi kolom sama dengan kolom Ketua dan semua segmen bar berada di ketinggian yang sama (`bottom-8`).
4. HAPUS TOTAL elemen garis tengah lama: TIDAK BOLEH ada lagi div garis vertikal yang dirender sebagai saudara (sibling) SESUDAH baris kartu di dalam kontainer puncak. Satu-satunya garis yang meninggalkan baris puncak menuju tingkat 2 adalah segmen lanjutan di dalam kolom Ketua (butir 2).
5. Penyesuaian bar tingkat 2 (dari rancangan sebelumnya, terapkan sekarang): pada blok tingkat 2, bila `hasMultiPuncak` DAN `tier2.length > 1`, segmen bar horizontal kolom pertama tingkat 2 (idx 0) membentang dari tepi kiri kolomnya: pakai `left-0 right-0` sebagai pengganti `left-1/2 right-0` KHUSUS untuk kondisi itu; kondisi lain (puncak tunggal, atau tier2 1 kartu) TIDAK berubah. Tujuannya: batang Ketua selalu mendarat di atas bar tingkat 2.
6. Bila tidak ada tier bawah: tidak ada segmen garis/bar sama sekali (hanya kartu).

## BAGIAN 3 — Baris lebar & mobile

1. Bila `puncak.length > 2`: bungkus baris puncak desktop dengan strip `overflow-x-auto` (konten `flex w-max min-w-full justify-start gap-8 px-4`, kartu `flex-none`), garis-garis BAGIAN 2 digambar di dalam konten strip. Bila `puncak.length === 2`: baris tampil terpusat (`justify-center`) TANPA strip, seperti sekarang.
2. Mobile (<768 px): strip geser yang sudah ada memakai gerbang `hasMultiPuncak` (bukan dual), urutan kartu = urutan `puncak` (Ketua pertama). Sisanya tidak berubah.
3. Dokumen tidak boleh mendapat overflow horizontal global pada lebar berapa pun.

## BAGIAN 4 — Verifikasi terukur (Playwright/Chromium)

Uji dengan data seeder historis lokal; laporkan bukti (screenshot/angka) tiap kasus pada 360 / 768 / 1280 px:

1. **Periode 2024/2025 (1 Pembina)**: baris puncak = [Ketua Umum, Pembina]; garis turun ke tingkat 2 menempel di bawah KETUA UMUM (ukur posisi x garis turun vs titik tengah kartu Ketua Umum: harus sama); TIDAK ada garis turun di tengah pasangan.
2. **Periode 2018/2020 (4 Pembina)**: kelima kartu puncak tampil (Ketua Umum + 4 Pembina) — tidak ada kartu yang hilang; bar menjangkau Pembina terjauh; batang dari Ketua Umum mendarat di bar tingkat 2; di desktop baris menjadi strip geser (dokumen overflow 0).
3. **Periode 2022/2023 (3 Pembina, tier2 2 kartu)**: pola sama; batang mendarat di bar tingkat 2 pada 768 & 1280 (kasus yang dulu paling rawan meleset).
4. **Periode aktif demo tanpa Pembina**: identik dengan tampilan lama.
5. Kelompok Komsat: tidak berubah.

## BAGIAN 5 — LARANGAN & GERBANG & LAPORAN

- DILARANG menjalankan `php artisan wayfinder:generate` manual; berkas `resources/js/actions/` & `resources/js/routes/` jangan disentuh; `npm run build` boleh apa adanya.
- Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test bila perlu). Jangan mengubah logika pengumpulan puncak, controller, seeder, atau data.
- JANGAN commit.
- Gerbang: test terkait + suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build` — angka persis, akuntansi klop.
- LAPORAN AKHIR: (1) konfirmasi gerbang diganti & di mana saja; (2) konfirmasi elemen garis tengah lama sudah tidak ada (sebutkan cara memastikannya, mis. pencarian teks di berkas); (3) bukti verifikasi 5 kasus BAGIAN 4 termasuk pengukuran posisi batang vs titik tengah Ketua Umum pada kasus 1; (4) hasil gerbang; (5) git status. Tidak ada commit.

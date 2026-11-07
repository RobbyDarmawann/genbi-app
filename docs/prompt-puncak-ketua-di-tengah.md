MODE EKSEKUSI. Kamu berjalan dalam Agent Mode di workspace genbigto-app dan WAJIB menjalankan tugas di bawah ini memakai tools. DILARANG HANYA MENGULANG ATAU MERINGKAS INSTRUKSI INI. Jalankan dari BAGIAN 1 sampai selesai SEKARANG, dalam sesi ini juga, lalu tutup dengan LAPORAN AKHIR sesuai format di BAGIAN 6. Kalau tools ternyata tidak tersedia untukmu, berhenti dan tulis persis: TOOLS TIDAK TERSEDIA.

# Puncak kepengurusan: Ketua Umum berlabuh di tengah, Pembina menyamping ke kanan

## Desain final (dari sketsa pemilik — patuhi persis)

```
              [ Ketua Umum ]
                    │        ─── [ Pembina 1 ] ─── [ Pembina 2 ] ─── ...
                    │            (menyamping sejajar, TIDAK terhubung ke bawah)
        ┌───────────┴───────────┐
     [ Sekretaris ]        [ Bendahara ]        ← tingkat 2 TERPUSAT seperti semula
```

Aturan bentuk:

1. Kartu **Ketua Umum tetap di TENGAH grup** — titik tengahnya sama persis dengan posisi kartu puncak tunggal pada tampilan lama (sumbu tengah konten grup). Ia TIDAK bergeser karena ada Pembina.
2. **Pembina menyamping ke KANAN dari Ketua Umum**, sejajar di ketinggian yang sama, dihubungkan oleh SATU garis horizontal pendek di TENGAH-TINGGI kartu (dari tepi kanan kartu Ketua ke tepi kiri kartu Pembina pertama, dan antar-Pembina bila lebih dari satu). TIDAK ada segmen garis di bawah kartu Pembina, TIDAK ada batang dari Pembina, dan Pembina TIDAK terhubung ke tingkat 2 sama sekali.
3. **Satu-satunya garis turun** adalah dari titik tengah bawah Ketua Umum, LURUS ke tengah bar tingkat 2 — identik dengan jalur puncak tunggal lama.
4. **Tingkat 2 kembali persis seperti semula** (sebelum rangkaian Pembina): grid terpusat `max-w-4xl`, bar horizontal membentang HANYA dari titik tengah kartu pertama sampai titik tengah kartu terakhir tingkat 2. Penyesuaian `left-0` dari perbaikan sebelumnya DIBATALKAN — tidak boleh ada ujung bar yang menjorok keluar melewati kartu pertama.

## Keadaan kode saat ini (titik berangkat — verifikasi sendiri sebelum mengubah)

Di `resources/js/pages/public/kepengurusan.tsx`, komponen `OrgChartGroup`:

- Logika pengumpulan puncak SUDAH benar, JANGAN diubah: `semuaPembina` (jabatan diawali "pembina"), `ketua` = non-Pembina pertama, `puncak = [ketua, ...semuaPembina]`, `tier2`/`tier3` dari sisa non-Pembina; tanpa Pembina = pemotongan lama.
- Gerbang `hasMultiPuncak = puncak.length >= 2` SUDAH benar, pertahankan.
- Yang SALAH dan harus diganti total adalah RENDER blok `hasMultiPuncak` desktop: baris flex terpusat `justify-center` berisi kolom-kolom berisi segmen garis DI BAWAH kartu (stub h-8 + bar di `bottom-8` + lanjutan/spacer), serta segmen bar tingkat 2 kolom pertama yang memakai `left-0` saat `hasMultiPuncak`.

## BAGIAN 1 — Struktur render desktop baru untuk hasMultiPuncak

Bangun ulang blok desktop `hasMultiPuncak` dengan struktur ini (kelas Tailwind persis):

1. Kontainer luar: `relative flex flex-col items-center` (sama seperti jalur tunggal).
2. Kartu Ketua Umum dirender LANGSUNG sebagai anak kontainer itu (TANPA pembungkus baris flex), kartu `KepengurusanPlayingCard` size featured entri `puncak[0]`. Karena kontainer `items-center`, kartu ini otomatis berada di sumbu tengah grup — sama seperti jalur tunggal.
3. Garis turun: bila ada tier bawah (`tier2.length > 0 || tier3.length > 0`), sesudah kartu Ketua render `<div aria-hidden className="relative z-0 h-8 w-0.5 bg-border" />` — persis jalur tunggal.
4. Strip Pembina (overlay absolut, dirender di dalam kontainer luar yang `relative`):
    - Pembungkus: `absolute top-0 left-1/2 ml-[161px] hidden max-w-[calc(50%-177px)] overflow-x-auto md:block` — strip mulai 161 px di kanan sumbu tengah (= setengah lebar kartu 290 + setengah gap 32) dan lebarnya dibatasi sisa ruang sampai tepi kanan grup dikurangi 16 px, supaya tidak pernah menimbulkan overflow dokumen.
    - Isi: `flex w-max gap-8 px-1` berisi kartu-kartu `semuaPembina` (yaitu `puncak.slice(1)`), masing-masing dibungkus `relative flex-none`.
    - Garis penghubung horizontal antar kartu (di tengah-tinggi kartu, y = 193 px dari atas strip): untuk SETIAP kartu Pembina, render segmen `absolute top-[193px] -left-8 h-0.5 w-8 bg-border` (menjembatani gap 32 px di kirinya). Karena kartu pertama juga punya segmen ini, garis itu menyambung dari tepi kanan kartu Ketua (yang berakhir 145 px dari sumbu) ke tepi kiri Pembina pertama (mulai 161 px dari sumbu) — segmen 32 px dari x=145 s/d x=177 relatif sumbu, tepat mengisi gap.
    - TIDAK ada elemen lain di strip: tanpa stub bawah, tanpa bar bawah, tanpa spacer.
5. Bila strip terpotong (Pembina banyak / layar sempit), strip bisa digeser horizontal di dalam areanya; kartu Ketua tidak ikut bergeser dan dokumen tidak overflow.

Catatan lebar: kartu featured selebar 290 px pada sm+ (`sm:w-[290px]`) dan blok desktop hanya tampil ≥768 px, jadi angka 145/161/193 px di atas berlaku. Lebar kartu diambil dari komponen `KepengurusanPlayingCard` size featured — verifikasi dari berkas; bila lebar aktual berbeda, sesuaikan ketiga angka itu secara konsisten (setengah lebar, setengah lebar + setengah gap 16... perhatikan gap antar kartu Pembina tetap 32 px dengan segmen penghubung selebar gap).

## BAGIAN 2 — Kembalikan tingkat 2 ke bentuk semula

Di blok tingkat 2, segmen bar kolom pertama (idx 0) HARUS selalu `'right-0 left-1/2'` untuk semua kondisi — hapus kondisional `hasMultiPuncak ? 'right-0 left-0' : ...`. Bar tingkat 2 dengan demikian membentang hanya dari titik tengah kartu pertama ke titik tengah kartu terakhir, dan batang dari Ketua Umum (di sumbu grup) mendarat tepat di tengah bar itu (grid tingkat 2 terpusat `w-full max-w-4xl` — titik tengah grid = sumbu grup). Tidak ada perubahan lain di tingkat 2/3.

## BAGIAN 3 — Mobile (<768 px)

Layout rel vertikal yang ada dipertahankan: di bagian "Pimpinan Utama", bila `hasMultiPuncak`, render strip geser berisi kartu-kartu `puncak` dengan **Ketua Umum pertama**, diikuti semua Pembina — sama seperti sekarang. Tidak ada garis horizontal penghubung di mobile. Bila sekarang urutannya sudah seperti itu, bagian ini tidak perlu diubah; laporkan apa adanya.

## BAGIAN 4 — Yang TIDAK berubah

- Jalur puncak tunggal (tanpa Pembina) dan kelompok Komsat: pixel-identik dengan sekarang.
- Logika pengumpulan, controller, seeder, data: tidak disentuh.
- Perilaku flip kartu: tidak disentuh.

## BAGIAN 5 — Verifikasi terukur (Playwright/Chromium, sesuaikan skrip verifikasi yang sudah ada)

Laporkan bukti angka/screenshot tiap kasus pada 360 / 768 / 1280 px:

1. **Periode 2024/2025 (1 Pembina)**: (a) titik tengah kartu Ketua Umum == titik tengah area konten grup (selisih ≤ 2 px); (b) Pembina di kanan Ketua, sejajar, dengan garis horizontal penghubung di tengah-tinggi kartu; (c) garis turun dari Ketua Umum lurus ke tengah bar tingkat 2; (d) TIDAK ada garis di bawah kartu Pembina; (e) ujung kiri bar tingkat 2 == titik tengah kartu pertama tingkat 2 (tidak menjorok).
2. **Periode 2018/2020 (4 Pembina)**: kelima kartu ada (Ketua di tengah + 4 Pembina dalam strip kanan); strip bisa digeser; dokumen overflow 0 di semua lebar; batang & bar tingkat 2 seperti kasus 1.
3. **Periode 2022/2023 (3 Pembina, tier2 2 kartu)**: pola sama; titik tengah Ketua == sumbu grup pada 768 & 1280.
4. **Periode aktif tanpa Pembina** dan **kelompok Komsat**: identik tampilan lama.
5. Mobile 360 px: Ketua pertama di strip Pimpinan Utama, lalu Pembina.

## BAGIAN 6 — LARANGAN & GERBANG & LAPORAN

- DILARANG `php artisan wayfinder:generate` manual; berkas `resources/js/actions/` & `resources/js/routes/` jangan disentuh; `npm run build` boleh apa adanya.
- Perubahan HANYA di `resources/js/pages/public/kepengurusan.tsx` (+ berkas test verifikasi bila perlu).
- JANGAN commit.
- Gerbang: suite penuh (`php artisan test`), Pint, `composer types:check`, `npm run types:check`, `npm run check`, `npm run build` — angka persis, akuntansi klop.
- LAPORAN AKHIR: (1) struktur render baru (sebutkan kelas kunci strip & garis penghubung); (2) konfirmasi penyesuaian `left-0` tingkat 2 sudah dicabut; (3) bukti 5 kasus BAGIAN 5 termasuk selisih titik tengah Ketua vs sumbu grup pada kasus 1; (4) hasil gerbang; (5) git status. Tidak ada commit.

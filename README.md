# Sistem Informasi GenBI Gorontalo Terintegrasi

## Data Demo UAS

Jalankan seeder master terlebih dahulu, lalu seeder demo secara terpisah:

```powershell
php artisan db:seed
php artisan db:seed --class=DemoSeeder
```

Data demo dapat dibuat ulang dengan aman menggunakan perintah yang sama. Seeder tidak dipanggil otomatis oleh `DatabaseSeeder` agar data demo tidak tercampur dengan data master/production.

Akun mahasiswa demo tersedia dari `mhs001` sampai `mhs015`; password seluruh akun adalah `password`. Akun ini hanya untuk pengembangan lokal/demo, jangan gunakan atau aktifkan di production.

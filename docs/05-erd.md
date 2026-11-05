# ERD Aktual Sistem GenBI

Diagram berikut diringkas dari migration dan model aplikasi aktual, bukan dari
rencana lama. Tabel framework Laravel seperti `cache`, `jobs`, `sessions`,
`password_reset_tokens`, serta tabel permission Spatie tidak ditampilkan agar
diagram domain tetap terbaca.

```mermaid
erDiagram
    USERS {
        bigint id PK
        string name
        string email UK
        string username UK
        boolean is_active
        string password
    }

    KOMSAT {
        bigint id PK
        string kode UK
        string nama
        boolean aktif
    }

    DIVISI {
        bigint id PK
        bigint komsat_id FK
        string nama
        boolean aktif
    }

    MAHASISWA {
        bigint id PK
        bigint user_id FK,UK
        bigint komsat_id FK
        bigint divisi_id FK
        string nim UK
        string angkatan
        string status_penerima
        boolean aktif
    }

    PERIODE {
        bigint id PK
        string nama UK
        date tanggal_mulai
        date tanggal_selesai
        boolean aktif
    }

    KEPENGURUSAN {
        bigint id PK
        bigint periode_id FK
        bigint komsat_id FK
        bigint mahasiswa_id FK
        string nama_tampil
        string jabatan
        int urutan
        string kontak
        string no_hp
        string instagram
        string email
        string foto_path
    }

    KEGIATAN {
        bigint id PK
        string judul
        text deskripsi
        bigint komsat_id FK
        string lokasi_nama
        decimal latitude
        decimal longitude
        int radius_m
        date tanggal
        time jam_mulai
        time jam_selesai
        datetime absensi_buka_at
        datetime absensi_tutup_at
        datetime pendaftaran_dibuka_at
        datetime batas_daftar_at
        int kuota
        string status
        bigint dibuat_oleh FK
    }

    KEGIATAN_DIVISI_TARGET {
        bigint kegiatan_id PK,FK
        bigint divisi_id PK,FK
    }

    KEGIATAN_BOBOT {
        bigint id PK
        bigint kegiatan_id FK
        string peran
        int poin
        string kegiatan_id_peran UK
    }

    PENDAFTARAN {
        bigint id PK
        bigint kegiatan_id FK
        bigint mahasiswa_id FK
        string peran
        string status
        string kegiatan_id_mahasiswa_id UK
    }

    KEHADIRAN {
        bigint id PK
        bigint pendaftaran_id FK,UK
        datetime waktu_checkin
        decimal latitude
        decimal longitude
        decimal akurasi_m
        decimal jarak_m
        string foto_path
        string sumber
        string status
        string alasan_penolakan
        json metadata
    }

    POIN_TRANSAKSI {
        bigint id PK
        bigint mahasiswa_id FK
        bigint kegiatan_id FK
        bigint kehadiran_id FK
        string tipe
        int jumlah
        string keterangan
        bigint dibuat_oleh FK
    }

    KOREKSI {
        bigint id PK
        bigint mahasiswa_id FK
        bigint kegiatan_id FK
        bigint pendaftaran_id FK
        string jenis
        text alasan
        string bukti_path
        string status
        bigint diproses_oleh FK
        text catatan_proses
        datetime diproses_at
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        string aksi
        string subject_type
        bigint subject_id
        json metadata
        string ip_address
    }

    USERS ||--o| MAHASISWA : memiliki
    USERS ||--o{ KEGIATAN : membuat
    USERS ||--o{ POIN_TRANSAKSI : membuat
    USERS ||--o{ KOREKSI : memproses
    USERS ||--o{ AUDIT_LOGS : menghasilkan

    KOMSAT ||--o{ DIVISI : memiliki
    KOMSAT ||--o{ MAHASISWA : menaungi
    KOMSAT ||--o{ KEPENGURUSAN : mengelompokkan
    KOMSAT ||--o{ KEGIATAN : menjadi_lingkup

    DIVISI ||--o{ MAHASISWA : menempatkan
    PERIODE ||--o{ KEPENGURUSAN : memiliki
    MAHASISWA ||--o{ KEPENGURUSAN : dapat_menjadi_pengurus

    KEGIATAN ||--o{ KEGIATAN_DIVISI_TARGET : menargetkan
    DIVISI ||--o{ KEGIATAN_DIVISI_TARGET : menjadi_target
    KEGIATAN ||--o{ KEGIATAN_BOBOT : memiliki_bobot
    KEGIATAN ||--o{ PENDAFTARAN : menerima
    MAHASISWA ||--o{ PENDAFTARAN : melakukan
    KEGIATAN ||--o{ KOREKSI : terkait
    KEGIATAN ||--o{ POIN_TRANSAKSI : sumber

    PENDAFTARAN ||--o| KEHADIRAN : memiliki_satu_checkin
    MAHASISWA ||--o{ POIN_TRANSAKSI : memiliki_ledger
    KEHADIRAN ||--o| POIN_TRANSAKSI : menghasilkan_kredit
    PENDAFTARAN ||--o{ KOREKSI : dapat_dikoreksi
    MAHASISWA ||--o{ KOREKSI : mengajukan
    KEHADIRAN ||--o{ POIN_TRANSAKSI : menjadi_referensi
```

## Constraint dan aturan penting

- `pendaftaran.kegiatan_id` + `pendaftaran.mahasiswa_id` unik: satu mahasiswa
  hanya memiliki satu pendaftaran per kegiatan.
- `divisi.komsat_id` + `divisi.nama` unik: nama divisi tidak boleh berulang
  pada Komsat yang sama.
- `kehadiran.pendaftaran_id` **unik**: satu pendaftaran hanya memiliki satu
  record check-in.
- `kegiatan_bobot.kegiatan_id` + `kegiatan_bobot.peran` unik; peran yang
  didukung adalah `peserta`, `panitia`, dan `pemateri`.
- `poin_transaksi` adalah ledger. Total poin mahasiswa dihitung dari
  `SUM(jumlah)`, bukan dari kolom total yang disimpan langsung.
- Tipe transaksi poin aktual adalah `kredit` dan `koreksi`; sumber koreksi
  dapat merujuk ke kehadiran dengan `sumber = koreksi`.
- Status kegiatan: `draft`, `terbit`, `berlangsung`, `selesai`, `terkunci`,
  `dibatalkan`.
- Status pendaftaran: `terdaftar`, `batal`.
- Status kehadiran: `valid`, `ditolak`, `menunggu_tinjau`.
- Status koreksi: `menunggu`, `disetujui`, `ditolak`.

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('kegiatan', function (Blueprint $table) {
            $table->id();
            $table->string('judul');
            $table->text('deskripsi')->nullable();
            $table->foreignId('komsat_id')->nullable()->constrained('komsat')->nullOnDelete();
            $table->string('lokasi_nama');
            $table->decimal('latitude', 10, 7);
            $table->decimal('longitude', 11, 7);
            $table->unsignedInteger('radius_m')->default(100);
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->dateTime('absensi_buka_at');
            $table->dateTime('absensi_tutup_at');
            $table->dateTime('pendaftaran_dibuka_at')->nullable();
            $table->dateTime('batas_daftar_at')->nullable();
            $table->unsignedInteger('kuota')->nullable();
            $table->string('status')->default('draft');
            $table->foreignId('dibuat_oleh')->constrained('users')->restrictOnDelete();
            $table->timestamps();

            $table->index('status');
            $table->index('tanggal');
            $table->index('komsat_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kegiatan');
    }
};

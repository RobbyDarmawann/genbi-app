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
        Schema::create('koreksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('mahasiswa_id')->constrained('mahasiswa')->cascadeOnDelete();
            $table->foreignId('kegiatan_id')->constrained('kegiatan')->cascadeOnDelete();
            $table->foreignId('pendaftaran_id')->nullable()->constrained('pendaftaran')->nullOnDelete();
            $table->string('jenis');
            $table->text('alasan');
            $table->string('bukti_path')->nullable();
            $table->string('status')->default('menunggu');
            $table->foreignId('diproses_oleh')->nullable()->constrained('users')->nullOnDelete();
            $table->text('catatan_proses')->nullable();
            $table->dateTime('diproses_at')->nullable();
            $table->timestamps();

            $table->index(['mahasiswa_id', 'status']);
            $table->index(['kegiatan_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('koreksi');
    }
};

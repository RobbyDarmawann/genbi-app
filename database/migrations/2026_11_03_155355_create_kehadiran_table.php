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
        Schema::create('kehadiran', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->unique()->constrained('pendaftaran')->cascadeOnDelete();
            $table->dateTime('waktu_checkin');
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 11, 7)->nullable();
            $table->decimal('akurasi_m', 8, 2)->nullable();
            $table->decimal('jarak_m', 8, 2)->nullable();
            $table->string('foto_path')->nullable();
            $table->string('sumber')->default('mandiri');
            $table->string('status');
            $table->string('alasan_penolakan')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['status', 'waktu_checkin']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kehadiran');
    }
};

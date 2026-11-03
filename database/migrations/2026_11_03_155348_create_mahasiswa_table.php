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
        Schema::create('mahasiswa', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained('users')->cascadeOnDelete();
            $table->foreignId('komsat_id')->constrained('komsat')->restrictOnDelete();
            $table->foreignId('divisi_id')->constrained('divisi')->restrictOnDelete();
            $table->string('nim')->unique();
            $table->string('angkatan', 4);
            $table->string('status_penerima')->default('penerima');
            $table->boolean('aktif')->default(true);
            $table->timestamps();

            $table->index(['komsat_id', 'divisi_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mahasiswa');
    }
};

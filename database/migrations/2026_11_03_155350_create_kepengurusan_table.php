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
        Schema::create('kepengurusan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('periode_id')->constrained('periode')->cascadeOnDelete();
            $table->foreignId('komsat_id')->nullable()->constrained('komsat')->nullOnDelete();
            $table->foreignId('mahasiswa_id')->nullable()->constrained('mahasiswa')->nullOnDelete();
            $table->string('nama_tampil');
            $table->string('jabatan');
            $table->integer('urutan')->default(0);
            $table->string('kontak')->nullable();
            $table->timestamps();

            $table->index(['periode_id', 'komsat_id', 'urutan']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kepengurusan');
    }
};

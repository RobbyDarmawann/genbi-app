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
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->string('jenis_kelamin')->nullable();
            $table->string('agama')->nullable();
            $table->string('golongan_darah', 2)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->string('domisili')->nullable();
            $table->string('no_hp', 20)->nullable();
            $table->string('foto_path')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mahasiswa', function (Blueprint $table) {
            $table->dropColumn([
                'jenis_kelamin',
                'agama',
                'golongan_darah',
                'tanggal_lahir',
                'domisili',
                'no_hp',
                'foto_path',
            ]);
        });
    }
};

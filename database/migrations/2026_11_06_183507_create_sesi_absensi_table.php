<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sesi_absensi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('kegiatan_id')->constrained('kegiatan')->cascadeOnDelete();
            $table->date('tanggal');
            $table->time('jam_buka');
            $table->time('jam_tutup');
            $table->timestamps();

            $table->unique(['kegiatan_id', 'tanggal']);
        });

        // Backfill: buat sesi untuk setiap kegiatan yang ada
        DB::table('kegiatan')->orderBy('id')->chunk(100, function ($kegiatanList) {
            foreach ($kegiatanList as $kegiatan) {
                $absenBuka = Carbon::parse($kegiatan->absensi_buka_at);
                $absenTutup = Carbon::parse($kegiatan->absensi_tutup_at);

                DB::table('sesi_absensi')->insert([
                    'kegiatan_id' => $kegiatan->id,
                    'tanggal' => $kegiatan->tanggal,
                    'jam_buka' => $absenBuka->format('H:i:s'),
                    'jam_tutup' => $absenTutup->format('H:i:s'),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sesi_absensi');
    }
};

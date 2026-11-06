<?php

use Carbon\Carbon;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('kehadiran', function (Blueprint $table) {
            $table->date('tanggal')->nullable()->after('pendaftaran_id');
        });

        DB::table('kehadiran')->orderBy('id')->chunk(100, function ($kehadiranList) {
            foreach ($kehadiranList as $kehadiran) {
                $tanggal = Carbon::parse($kehadiran->waktu_checkin, config('app.timezone'))->toDateString();
                DB::table('kehadiran')->where('id', $kehadiran->id)->update([
                    'tanggal' => $tanggal,
                ]);
            }
        });

        Schema::table('kehadiran', function (Blueprint $table) {
            $table->date('tanggal')->nullable(false)->change();
            $table->dropUnique(['pendaftaran_id']);
            $table->unique(['pendaftaran_id', 'tanggal']);
        });
    }

    public function down(): void
    {
        Schema::table('kehadiran', function (Blueprint $table) {
            $table->dropUnique(['pendaftaran_id', 'tanggal']);
            $table->unique('pendaftaran_id');
            $table->dropColumn('tanggal');
        });
    }
};

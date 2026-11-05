<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('kepengurusan', function (Blueprint $table) {
            $table->string('no_hp', 20)->nullable();
            $table->string('instagram', 255)->nullable();
            $table->string('email')->nullable();
        });

        $records = DB::table('kepengurusan')->whereNotNull('kontak')->get(['id', 'kontak']);
        foreach ($records as $record) {
            $value = trim($record->kontak);
            if (preg_match('/^(?:\\+62|08)[0-9 -]+$/', $value) === 1 && preg_match_all('/[0-9]/', $value) >= 9 && preg_match_all('/[0-9]/', $value) <= 15) {
                DB::table('kepengurusan')->where('id', $record->id)->update(['no_hp' => preg_replace('/[ -]+/', '', $value)]);
            } elseif (filter_var($value, FILTER_VALIDATE_EMAIL)) {
                DB::table('kepengurusan')->where('id', $record->id)->update(['email' => $value]);
            } elseif (str_starts_with($value, '@')) {
                DB::table('kepengurusan')->where('id', $record->id)->update(['instagram' => ltrim($value, '@')]);
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('kepengurusan', function (Blueprint $table) {
            $table->dropColumn(['no_hp', 'instagram', 'email']);
        });
    }
};

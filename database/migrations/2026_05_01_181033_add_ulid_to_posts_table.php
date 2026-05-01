<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration {
    public function up(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->string('public_id', 19)->nullable()->after('id');
        });

        DB::table('posts')->orderBy('id')->each(function ($post) {
            do {
                $generator = new \Hidehalo\Nanoid\Client();
                $id = $generator->formattedId('0123456789', 19);
            } while (DB::table('posts')->where('public_id', $id)->exists());

            DB::table('posts')
                ->where('id', $post->id)
                ->update(['public_id' => $id]);
        });

        Schema::table('posts', function (Blueprint $table) {
            $table->string('public_id', 19)->nullable(false)->unique()->change();
        });
    }

    public function down(): void {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('public_id');
        });
    }
};

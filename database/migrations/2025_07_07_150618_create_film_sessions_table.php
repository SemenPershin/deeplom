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
        Schema::create('film_sessions', function (Blueprint $table) {
            $table->id();
            $table->integer('hall_id');
            $table->integer('film_id');

            $table->integer('price_default');
            $table->integer('price_vip');

            $table->integer('session_begin'); //Время указывается в минутах от начала дня
            $table->integer('session_end'); //Время указывается в минутах от начала дня
            $table->string('date');

            $table->boolean("is_active")->default(false);

            $table->timestamps();

            $table->foreign('hall_id')->references('id')->on('halls');
            $table->foreign('film_id')->references('id')->on('films');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('film_sessions');
    }
};

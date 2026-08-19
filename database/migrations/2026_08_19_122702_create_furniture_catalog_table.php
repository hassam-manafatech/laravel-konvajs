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
        Schema::create('furniture_catalog', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('category');
            $table->decimal('width_m', 6, 2);
            $table->decimal('depth_m', 6, 2);
            $table->decimal('height_m', 6, 2);
            $table->decimal('price', 10, 2);
            $table->unsignedSmallInteger('seat_capacity')->default(0);
            $table->string('default_color', 7);
            $table->json('render_metadata')->nullable();
            $table->timestamps();

            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('furniture_catalog');
    }
};

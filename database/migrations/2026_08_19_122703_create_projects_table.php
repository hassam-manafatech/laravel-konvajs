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
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('template_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->decimal('width_m', 6, 2);
            $table->decimal('height_m', 6, 2);
            $table->string('brand_color', 7);
            $table->boolean('show_blueprint_grid')->default(true);
            $table->unsignedInteger('total_seats')->default(0);
            $table->decimal('total_cost', 10, 2)->default(0);
            $table->boolean('fire_safety_active')->default(false);
            $table->timestamps();

            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};

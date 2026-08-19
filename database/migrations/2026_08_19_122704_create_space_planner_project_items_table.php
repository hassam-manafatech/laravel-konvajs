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
        Schema::create('space_planner_project_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('space_planner_projects')->cascadeOnDelete();
            $table->foreignId('furniture_id')->constrained('space_planner_furniture_catalog')->cascadeOnDelete();
            $table->uuid('group_id')->nullable();
            $table->decimal('x_coord', 8, 2);
            $table->decimal('y_coord', 8, 2);
            $table->decimal('rotation', 5, 2)->default(0);
            $table->string('custom_color', 7)->nullable();
            $table->json('meta_data')->nullable();
            $table->timestamps();

            $table->index('group_id');
            $table->index(['project_id', 'group_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('space_planner_project_items');
    }
};

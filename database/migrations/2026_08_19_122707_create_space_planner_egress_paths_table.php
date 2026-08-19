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
        Schema::create('space_planner_egress_paths', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained('space_planner_projects')->cascadeOnDelete();
            $table->json('path_points');
            $table->string('door_label')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('space_planner_egress_paths');
    }
};

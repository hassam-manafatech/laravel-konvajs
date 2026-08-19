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
        Schema::create('space_planner_reservation_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('reservation_id')->constrained('space_planner_reservations')->cascadeOnDelete();
            $table->foreignId('project_item_id')->constrained('space_planner_project_items')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['reservation_id', 'project_item_id'], 'sp_reservation_items_reservation_project_item_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('space_planner_reservation_items');
    }
};

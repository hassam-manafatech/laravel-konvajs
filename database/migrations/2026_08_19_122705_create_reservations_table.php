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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->foreignId('table_item_id')->constrained('project_items')->cascadeOnDelete();
            $table->uuid('group_id')->nullable();
            $table->string('customer_name');
            $table->dateTime('reservation_time');
            $table->string('status')->default('pending');
            $table->unsignedSmallInteger('total_chairs_in_group');
            $table->unsignedSmallInteger('reserved_chairs_count')->default(0);
            $table->timestamps();

            $table->index('group_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};

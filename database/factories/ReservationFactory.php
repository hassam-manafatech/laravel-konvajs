<?php

namespace Database\Factories;

use App\Enums\ReservationStatus;
use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\Reservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Reservation>
 */
class ReservationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => Project::factory(),
            'table_item_id' => ProjectItem::factory(),
            'group_id' => null,
            'customer_name' => fake()->name(),
            'reservation_time' => fake()->dateTimeBetween('now', '+1 month'),
            'status' => ReservationStatus::Pending,
            'total_chairs_in_group' => 1,
            'reserved_chairs_count' => 1,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Enums\ReservationStatus;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerProjectItem;
use App\Models\SpacePlannerReservation;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SpacePlannerReservation>
 */
class ReservationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<SpacePlannerReservation>
     */
    protected $model = SpacePlannerReservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => SpacePlannerProject::factory(),
            'table_item_id' => SpacePlannerProjectItem::factory(),
            'group_id' => null,
            'customer_name' => fake()->name(),
            'reservation_time' => fake()->dateTimeBetween('now', '+1 month'),
            'status' => ReservationStatus::Pending,
            'total_chairs_in_group' => 1,
            'reserved_chairs_count' => 1,
        ];
    }
}

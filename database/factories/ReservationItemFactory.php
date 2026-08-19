<?php

namespace Database\Factories;

use App\Models\SpacePlannerProjectItem;
use App\Models\SpacePlannerReservation;
use App\Models\SpacePlannerReservationItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SpacePlannerReservationItem>
 */
class ReservationItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<SpacePlannerReservationItem>
     */
    protected $model = SpacePlannerReservationItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reservation_id' => SpacePlannerReservation::factory(),
            'project_item_id' => SpacePlannerProjectItem::factory(),
        ];
    }
}

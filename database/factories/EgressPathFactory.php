<?php

namespace Database\Factories;

use App\Models\SpacePlannerEgressPath;
use App\Models\SpacePlannerProject;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SpacePlannerEgressPath>
 */
class EgressPathFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<SpacePlannerEgressPath>
     */
    protected $model = SpacePlannerEgressPath::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => SpacePlannerProject::factory(),
            'path_points' => [
                ['x' => 0, 'y' => 0],
                ['x' => 10, 'y' => 0],
            ],
            'door_label' => fake()->randomElement(['Main Entrance', 'Rear Exit', 'Side Door']),
        ];
    }
}

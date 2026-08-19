<?php

namespace Database\Factories;

use App\Models\EgressPath;
use App\Models\Project;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<EgressPath>
 */
class EgressPathFactory extends Factory
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
            'path_points' => [
                ['x' => 0, 'y' => 0],
                ['x' => 10, 'y' => 0],
            ],
            'door_label' => fake()->randomElement(['Main Entrance', 'Rear Exit', 'Side Door']),
        ];
    }
}

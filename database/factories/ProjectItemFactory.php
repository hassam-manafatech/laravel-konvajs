<?php

namespace Database\Factories;

use App\Models\FurnitureCatalog;
use App\Models\Project;
use App\Models\ProjectItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<ProjectItem>
 */
class ProjectItemFactory extends Factory
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
            'furniture_id' => FurnitureCatalog::factory(),
            'group_id' => null,
            'x_coord' => fake()->randomFloat(2, 0, 20),
            'y_coord' => fake()->randomFloat(2, 0, 20),
            'rotation' => 0,
            'custom_color' => null,
            'meta_data' => null,
        ];
    }
}

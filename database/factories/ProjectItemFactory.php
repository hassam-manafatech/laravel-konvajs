<?php

namespace Database\Factories;

use App\Models\SpacePlannerFurnitureCatalog;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerProjectItem;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SpacePlannerProjectItem>
 */
class ProjectItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<SpacePlannerProjectItem>
     */
    protected $model = SpacePlannerProjectItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'project_id' => SpacePlannerProject::factory(),
            'furniture_id' => SpacePlannerFurnitureCatalog::factory(),
            'group_id' => null,
            'x_coord' => fake()->randomFloat(2, 0, 20),
            'y_coord' => fake()->randomFloat(2, 0, 20),
            'rotation' => 0,
            'custom_color' => null,
            'meta_data' => null,
        ];
    }
}

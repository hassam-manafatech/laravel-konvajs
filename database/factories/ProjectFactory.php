<?php

namespace Database\Factories;

use App\Models\SpacePlannerProject;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<SpacePlannerProject>
 */
class ProjectFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<SpacePlannerProject>
     */
    protected $model = SpacePlannerProject::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'template_id' => null,
            'name' => fake()->words(3, true),
            'width_m' => fake()->randomFloat(2, 8, 20),
            'height_m' => fake()->randomFloat(2, 8, 20),
            'brand_color' => fake()->hexColor(),
            'show_blueprint_grid' => true,
            'total_seats' => 0,
            'total_cost' => 0,
            'fire_safety_active' => false,
        ];
    }
}

<?php

namespace Database\Factories;

use App\Enums\FurnitureCategory;
use App\Models\FurnitureCatalog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<FurnitureCatalog>
 */
class FurnitureCatalogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->words(2, true),
            'category' => fake()->randomElement(FurnitureCategory::cases()),
            'width_m' => fake()->randomFloat(2, 0.4, 2),
            'depth_m' => fake()->randomFloat(2, 0.4, 2),
            'height_m' => fake()->randomFloat(2, 0.4, 1.2),
            'price' => fake()->randomFloat(2, 20, 500),
            'seat_capacity' => 0,
            'default_color' => fake()->hexColor(),
            'render_metadata' => null,
        ];
    }

    /**
     * Indicate that this item is a table.
     */
    public function table(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => FurnitureCategory::Table,
            'seat_capacity' => 0,
        ]);
    }

    /**
     * Indicate that this item is a chair.
     */
    public function chair(): static
    {
        return $this->state(fn (array $attributes) => [
            'category' => FurnitureCategory::Seating,
            'seat_capacity' => 1,
        ]);
    }
}

<?php

namespace Database\Factories;

use App\Enums\TemplateType;
use App\Models\Template;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Template>
 */
class TemplateFactory extends Factory
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
            'type' => fake()->randomElement(TemplateType::cases()),
            'default_width_m' => fake()->randomFloat(2, 8, 20),
            'default_height_m' => fake()->randomFloat(2, 8, 20),
            'thumbnail_url' => null,
            'layout_data' => null,
        ];
    }
}

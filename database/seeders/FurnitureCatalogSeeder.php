<?php

namespace Database\Seeders;

use App\Enums\FurnitureCategory;
use App\Models\FurnitureCatalog;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class FurnitureCatalogSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the furniture catalog with real café/restaurant/co-working reference items.
     */
    public function run(): void
    {
        $items = [
            // Tables
            ['name' => '2-Top Table', 'category' => FurnitureCategory::Table, 'width_m' => 0.6, 'depth_m' => 0.6, 'height_m' => 0.75, 'price' => 150, 'seat_capacity' => 0, 'default_color' => '#8B5E3C'],
            ['name' => '4-Top Table', 'category' => FurnitureCategory::Table, 'width_m' => 0.9, 'depth_m' => 0.9, 'height_m' => 0.75, 'price' => 220, 'seat_capacity' => 0, 'default_color' => '#8B5E3C'],
            ['name' => '6-Top Communal Table', 'category' => FurnitureCategory::Table, 'width_m' => 1.8, 'depth_m' => 0.9, 'height_m' => 0.75, 'price' => 380, 'seat_capacity' => 0, 'default_color' => '#6B4226'],

            // Seating
            ['name' => 'Bistro Chair', 'category' => FurnitureCategory::Seating, 'width_m' => 0.45, 'depth_m' => 0.45, 'height_m' => 0.85, 'price' => 65, 'seat_capacity' => 1, 'default_color' => '#3F3F46'],
            ['name' => 'Upholstered Armchair', 'category' => FurnitureCategory::Seating, 'width_m' => 0.6, 'depth_m' => 0.6, 'height_m' => 0.85, 'price' => 120, 'seat_capacity' => 1, 'default_color' => '#78716C'],
            ['name' => 'Bar Stool', 'category' => FurnitureCategory::Seating, 'width_m' => 0.4, 'depth_m' => 0.4, 'height_m' => 1.05, 'price' => 75, 'seat_capacity' => 1, 'default_color' => '#44403C'],

            // Counters
            ['name' => 'Service Counter', 'category' => FurnitureCategory::Counter, 'width_m' => 2.4, 'depth_m' => 0.6, 'height_m' => 1.1, 'price' => 900, 'seat_capacity' => 0, 'default_color' => '#57534E'],
            ['name' => 'Espresso Bar', 'category' => FurnitureCategory::Counter, 'width_m' => 1.8, 'depth_m' => 0.7, 'height_m' => 1.1, 'price' => 1500, 'seat_capacity' => 0, 'default_color' => '#3F3F46'],

            // Desks
            ['name' => 'Co-working Desk', 'category' => FurnitureCategory::Desk, 'width_m' => 1.2, 'depth_m' => 0.6, 'height_m' => 0.75, 'price' => 260, 'seat_capacity' => 1, 'default_color' => '#92785B'],
            ['name' => 'Standing Desk', 'category' => FurnitureCategory::Desk, 'width_m' => 1.4, 'depth_m' => 0.7, 'height_m' => 1.1, 'price' => 420, 'seat_capacity' => 1, 'default_color' => '#78716C'],

            // Fixtures
            ['name' => 'Potted Plant', 'category' => FurnitureCategory::Fixture, 'width_m' => 0.4, 'depth_m' => 0.4, 'height_m' => 1.2, 'price' => 45, 'seat_capacity' => 0, 'default_color' => '#16A34A'],
            ['name' => 'Display Shelving', 'category' => FurnitureCategory::Fixture, 'width_m' => 1.0, 'depth_m' => 0.4, 'height_m' => 1.8, 'price' => 320, 'seat_capacity' => 0, 'default_color' => '#57534E'],
        ];

        foreach ($items as $item) {
            FurnitureCatalog::query()->create($item);
        }
    }
}

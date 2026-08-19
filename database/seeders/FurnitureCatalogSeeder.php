<?php

namespace Database\Seeders;

use App\Enums\FurnitureCategory;
use App\Models\SpacePlannerFurnitureCatalog;
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
            ['name' => '2-Top Table', 'category' => FurnitureCategory::Table, 'width_m' => 0.6, 'depth_m' => 0.6, 'height_m' => 0.75, 'price' => 150, 'seat_capacity' => 0, 'default_color' => '#8B5E3C', 'render_metadata' => ['shape' => 'round']],
            ['name' => '4-Top Table', 'category' => FurnitureCategory::Table, 'width_m' => 0.9, 'depth_m' => 0.9, 'height_m' => 0.75, 'price' => 220, 'seat_capacity' => 0, 'default_color' => '#8B5E3C', 'render_metadata' => ['shape' => 'round']],
            ['name' => '6-Top Communal Table', 'category' => FurnitureCategory::Table, 'width_m' => 1.8, 'depth_m' => 0.9, 'height_m' => 0.75, 'price' => 380, 'seat_capacity' => 0, 'default_color' => '#6B4226', 'render_metadata' => ['shape' => 'rect']],

            // Seating
            ['name' => 'Bistro Chair', 'category' => FurnitureCategory::Seating, 'width_m' => 0.45, 'depth_m' => 0.45, 'height_m' => 0.85, 'price' => 65, 'seat_capacity' => 1, 'default_color' => '#3F3F46', 'render_metadata' => ['shape' => 'chair']],
            ['name' => 'Upholstered Armchair', 'category' => FurnitureCategory::Seating, 'width_m' => 0.6, 'depth_m' => 0.6, 'height_m' => 0.85, 'price' => 120, 'seat_capacity' => 1, 'default_color' => '#78716C', 'render_metadata' => ['shape' => 'chair', 'brand_accent' => true]],
            ['name' => 'Bar Stool', 'category' => FurnitureCategory::Seating, 'width_m' => 0.4, 'depth_m' => 0.4, 'height_m' => 1.05, 'price' => 75, 'seat_capacity' => 1, 'default_color' => '#44403C', 'render_metadata' => ['shape' => 'stool']],

            // Counters
            ['name' => 'Service Counter', 'category' => FurnitureCategory::Counter, 'width_m' => 2.4, 'depth_m' => 0.6, 'height_m' => 1.1, 'price' => 900, 'seat_capacity' => 0, 'default_color' => '#57534E', 'render_metadata' => ['brand_accent' => true]],
            ['name' => 'Espresso Bar', 'category' => FurnitureCategory::Counter, 'width_m' => 1.8, 'depth_m' => 0.7, 'height_m' => 1.1, 'price' => 1500, 'seat_capacity' => 0, 'default_color' => '#3F3F46', 'render_metadata' => ['brand_accent' => true]],

            // Desks
            ['name' => 'Co-working Desk', 'category' => FurnitureCategory::Desk, 'width_m' => 1.2, 'depth_m' => 0.6, 'height_m' => 0.75, 'price' => 260, 'seat_capacity' => 1, 'default_color' => '#92785B', 'render_metadata' => null],
            ['name' => 'Standing Desk', 'category' => FurnitureCategory::Desk, 'width_m' => 1.4, 'depth_m' => 0.7, 'height_m' => 1.1, 'price' => 420, 'seat_capacity' => 1, 'default_color' => '#78716C', 'render_metadata' => null],

            // Fixtures
            ['name' => 'Potted Plant', 'category' => FurnitureCategory::Fixture, 'width_m' => 0.4, 'depth_m' => 0.4, 'height_m' => 1.2, 'price' => 45, 'seat_capacity' => 0, 'default_color' => '#16A34A', 'render_metadata' => ['shape' => 'plant']],
            ['name' => 'Display Shelving', 'category' => FurnitureCategory::Fixture, 'width_m' => 1.0, 'depth_m' => 0.4, 'height_m' => 1.8, 'price' => 320, 'seat_capacity' => 0, 'default_color' => '#57534E', 'render_metadata' => ['shape' => 'shelf', 'brand_accent' => true]],
        ];

        foreach ($items as $item) {
            SpacePlannerFurnitureCatalog::query()->create($item);
        }
    }
}

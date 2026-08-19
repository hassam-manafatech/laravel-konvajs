<?php

namespace Database\Seeders;

use App\Enums\TemplateType;
use App\Models\SpacePlannerTemplate;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the starting layout templates, one per space type.
     */
    public function run(): void
    {
        $templates = [
            ['name' => 'Cozy Café', 'type' => TemplateType::Cafe, 'default_width_m' => 10, 'default_height_m' => 8],
            ['name' => 'Open Co-working Floor', 'type' => TemplateType::CoWorking, 'default_width_m' => 14, 'default_height_m' => 10],
            ['name' => 'Boutique Showroom', 'type' => TemplateType::Boutique, 'default_width_m' => 8, 'default_height_m' => 8],
            ['name' => 'Full-Service Restaurant', 'type' => TemplateType::Restaurant, 'default_width_m' => 16, 'default_height_m' => 12],
        ];

        foreach ($templates as $template) {
            SpacePlannerTemplate::query()->create($template);
        }
    }
}

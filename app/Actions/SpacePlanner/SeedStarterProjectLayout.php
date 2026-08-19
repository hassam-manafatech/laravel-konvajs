<?php

namespace App\Actions\SpacePlanner;

use App\Enums\FurnitureCategory;
use App\Models\SpacePlannerFurnitureCatalog;
use App\Models\SpacePlannerProject;
use Illuminate\Support\Str;

class SeedStarterProjectLayout
{
    public function __construct(private readonly RecalculateProjectTotals $recalculateProjectTotals) {}

    /**
     * Seed a brand-new project with 2 tables (linked to 4 and 6 chairs).
     */
    public function handle(SpacePlannerProject $project): void
    {
        $table = SpacePlannerFurnitureCatalog::query()->where('category', FurnitureCategory::Table->value)->first();
        $chair = SpacePlannerFurnitureCatalog::query()->where('category', FurnitureCategory::Seating->value)->first();

        if (! $table || ! $chair) {
            return;
        }

        $this->seedTableWithChairs($project, $table, $chair, chairCount: 4, tableX: 2.0, tableY: 2.0);
        $this->seedTableWithChairs($project, $table, $chair, chairCount: 6, tableX: 6.0, tableY: 2.0);

        $this->recalculateProjectTotals->handle($project);
    }

    private function seedTableWithChairs(
        SpacePlannerProject $project,
        SpacePlannerFurnitureCatalog $table,
        SpacePlannerFurnitureCatalog $chair,
        int $chairCount,
        float $tableX,
        float $tableY,
    ): void {
        $groupId = (string) Str::uuid();

        $project->items()->create([
            'furniture_id' => $table->id,
            'group_id' => $groupId,
            'x_coord' => $tableX,
            'y_coord' => $tableY,
            'rotation' => 0,
        ]);

        $chairRadius = 1.0;

        for ($i = 0; $i < $chairCount; $i++) {
            $angle = ($i / $chairCount) * 2 * M_PI;

            $project->items()->create([
                'furniture_id' => $chair->id,
                'group_id' => $groupId,
                'x_coord' => round($tableX + ($chairRadius * cos($angle)), 2),
                'y_coord' => round($tableY + ($chairRadius * sin($angle)), 2),
                'rotation' => round(rad2deg($angle), 2),
            ]);
        }
    }
}

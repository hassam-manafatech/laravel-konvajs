<?php

namespace App\Actions\SpacePlanner;

use App\Models\Project;
use App\Models\ProjectItem;

class RecalculateProjectTotals
{
    /**
     * Recompute and persist the project's cached seat/cost totals from its current items.
     */
    public function handle(Project $project): void
    {
        $totals = ProjectItem::query()
            ->where('project_id', $project->id)
            ->join('furniture_catalog', 'furniture_catalog.id', '=', 'project_items.furniture_id')
            ->selectRaw('coalesce(sum(furniture_catalog.seat_capacity), 0) as seats')
            ->selectRaw('coalesce(sum(furniture_catalog.price), 0) as cost')
            ->first();

        $project->forceFill([
            'total_seats' => (int) $totals->seats,
            'total_cost' => (string) $totals->cost,
        ])->save();
    }
}

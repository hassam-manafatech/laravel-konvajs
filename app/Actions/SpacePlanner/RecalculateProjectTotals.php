<?php

namespace App\Actions\SpacePlanner;

use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerProjectItem;

class RecalculateProjectTotals
{
    /**
     * Recompute and persist the project's cached seat/cost totals from its current items.
     */
    public function handle(SpacePlannerProject $project): void
    {
        $totals = SpacePlannerProjectItem::query()
            ->where('project_id', $project->id)
            ->join('space_planner_furniture_catalog', 'space_planner_furniture_catalog.id', '=', 'space_planner_project_items.furniture_id')
            ->selectRaw('coalesce(sum(space_planner_furniture_catalog.seat_capacity), 0) as seats')
            ->selectRaw('coalesce(sum(space_planner_furniture_catalog.price), 0) as cost')
            ->first();

        $project->forceFill([
            'total_seats' => (int) $totals->seats,
            'total_cost' => (string) $totals->cost,
        ])->save();
    }
}

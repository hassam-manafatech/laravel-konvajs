<?php

namespace App\Actions\SpacePlanner;

use App\Enums\FurnitureCategory;
use App\Enums\ReservationStatus;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerProjectItem;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class ReleaseReservation
{
    /**
     * Free a clicked table's whole reserved chair group, or a single reserved chair.
     */
    public function handle(SpacePlannerProject $project, SpacePlannerProjectItem $clickedItem): int
    {
        return DB::transaction(function () use ($project, $clickedItem) {
            $targets = $this->resolveTargets($project, $clickedItem);

            $activeStatuses = array_map(fn (ReservationStatus $status) => $status->value, ReservationStatus::active());
            $releasedCount = 0;

            foreach ($targets as $item) {
                $activeReservations = $item->reservations()->whereIn('status', $activeStatuses)->get();

                foreach ($activeReservations as $reservation) {
                    $reservation->chairs()->detach($item->id);
                    $reservation->decrement('reserved_chairs_count');
                    $releasedCount++;

                    if ($reservation->fresh()->reserved_chairs_count <= 0) {
                        $reservation->update(['status' => ReservationStatus::Cancelled]);
                    }
                }
            }

            return $releasedCount;
        });
    }

    /**
     * @return Collection<int, SpacePlannerProjectItem>
     */
    private function resolveTargets(SpacePlannerProject $project, SpacePlannerProjectItem $clickedItem): Collection
    {
        $isTable = $clickedItem->furniture->category === FurnitureCategory::Table;

        if ($isTable && $clickedItem->group_id !== null) {
            return $project->items()
                ->where('group_id', $clickedItem->group_id)
                ->whereHas('furniture', fn ($query) => $query->where('category', FurnitureCategory::Seating->value))
                ->get();
        }

        return collect([$clickedItem]);
    }
}

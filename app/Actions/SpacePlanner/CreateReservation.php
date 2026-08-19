<?php

namespace App\Actions\SpacePlanner;

use App\Enums\FurnitureCategory;
use App\Enums\ReservationStatus;
use App\Models\Project;
use App\Models\ProjectItem;
use App\Models\Reservation;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class CreateReservation
{
    /**
     * Reserve a clicked table's whole chair group, or a single clicked chair.
     */
    public function handle(
        Project $project,
        ProjectItem $clickedItem,
        string $customerName,
        CarbonInterface $reservationTime,
        ?int $chairsCount = null,
    ): Reservation {
        return DB::transaction(function () use ($project, $clickedItem, $customerName, $reservationTime, $chairsCount) {
            $targets = $this->resolveTargets($project, $clickedItem);

            $totalChairsInGroup = $targets->count();

            $available = $targets->reject(fn (ProjectItem $item) => $this->hasActiveReservation($item));

            if ($available->isEmpty()) {
                throw ValidationException::withMessages([
                    'project_item_id' => __('All chairs in this group are already reserved.'),
                ]);
            }

            if ($chairsCount !== null) {
                if ($chairsCount > $available->count()) {
                    throw ValidationException::withMessages([
                        'chairs_count' => __('Only :available chair(s) are available in this group.', [
                            'available' => $available->count(),
                        ]),
                    ]);
                }

                $available = $available->take($chairsCount);
            }

            $reservation = $project->reservations()->create([
                'table_item_id' => $clickedItem->id,
                'group_id' => $clickedItem->group_id,
                'customer_name' => $customerName,
                'reservation_time' => $reservationTime,
                'status' => ReservationStatus::Pending,
                'total_chairs_in_group' => $totalChairsInGroup,
                'reserved_chairs_count' => $available->count(),
            ]);

            $reservation->chairs()->attach($available->pluck('id'));

            return $reservation;
        });
    }

    /**
     * @return Collection<int, ProjectItem>
     */
    private function resolveTargets(Project $project, ProjectItem $clickedItem): Collection
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

    private function hasActiveReservation(ProjectItem $item): bool
    {
        $activeStatuses = array_map(fn (ReservationStatus $status) => $status->value, ReservationStatus::active());

        return $item->reservations()
            ->whereIn('status', $activeStatuses)
            ->exists();
    }
}

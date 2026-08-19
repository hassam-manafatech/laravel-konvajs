<?php

namespace App\Http\Controllers\SpacePlanner;

use App\Actions\SpacePlanner\RecalculateProjectTotals;
use App\Enums\ReservationStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\SpacePlanner\LinkProjectItemsRequest;
use App\Http\Requests\SpacePlanner\SyncProjectItemsRequest;
use App\Http\Requests\SpacePlanner\UnlinkProjectItemsRequest;
use App\Models\Project;
use App\Models\ProjectItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class ProjectItemController extends Controller
{
    public function __construct(private readonly RecalculateProjectTotals $recalculateProjectTotals) {}

    /**
     * Upsert placed furniture items (position, rotation, color) for a project.
     */
    public function sync(SyncProjectItemsRequest $request, Project $project): JsonResponse
    {
        foreach ($request->validated('items') as $itemInput) {
            if (! empty($itemInput['id'])) {
                $project->items()->whereKey($itemInput['id'])->first()?->update($itemInput);
            } else {
                $project->items()->create($itemInput);
            }
        }

        $this->recalculateProjectTotals->handle($project);

        return response()->json([
            'items' => $project->items()->with('furniture')->get(),
        ]);
    }

    /**
     * Remove a placed item from a project.
     */
    public function destroy(Project $project, ProjectItem $item): JsonResponse
    {
        Gate::authorize('update', $project);

        $hasActiveReservation = $item->reservations()
            ->whereIn('status', array_map(fn (ReservationStatus $status) => $status->value, ReservationStatus::active()))
            ->exists();

        if ($hasActiveReservation) {
            throw ValidationException::withMessages([
                'item' => __('This item has an active reservation and cannot be deleted.'),
            ]);
        }

        $item->delete();

        $this->recalculateProjectTotals->handle($project);

        return response()->json(['deleted' => $item->id]);
    }

    /**
     * Link a table item with one or more chair items into a shared group.
     */
    public function link(LinkProjectItemsRequest $request, Project $project): JsonResponse
    {
        $tableItem = $project->items()->whereKey($request->validated('table_item_id'))->firstOrFail();

        $groupId = $tableItem->group_id ?? (string) Str::uuid();

        $project->items()
            ->whereIn('id', [$tableItem->id, ...$request->validated('chair_item_ids')])
            ->update(['group_id' => $groupId]);

        return response()->json([
            'items' => $project->items()->with('furniture')->get(),
        ]);
    }

    /**
     * Clear the shared group on the given items.
     */
    public function unlink(UnlinkProjectItemsRequest $request, Project $project): JsonResponse
    {
        $itemIds = $request->validated('item_ids');

        $hasActiveReservation = ProjectItem::query()
            ->whereIn('id', $itemIds)
            ->whereHas('reservations', fn ($query) => $query->whereIn('status', array_map(
                fn (ReservationStatus $status) => $status->value,
                ReservationStatus::active(),
            )))
            ->exists();

        if ($hasActiveReservation) {
            throw ValidationException::withMessages([
                'item_ids' => __('One or more items have an active reservation and cannot be unlinked.'),
            ]);
        }

        $project->items()->whereIn('id', $itemIds)->update(['group_id' => null]);

        return response()->json([
            'items' => $project->items()->with('furniture')->get(),
        ]);
    }
}

<?php

namespace App\Http\Controllers\SpacePlanner;

use App\Actions\SpacePlanner\CreateReservation;
use App\Actions\SpacePlanner\ReleaseReservation;
use App\Http\Controllers\Controller;
use App\Http\Requests\SpacePlanner\ReleaseReservationRequest;
use App\Http\Requests\SpacePlanner\StoreReservationRequest;
use App\Http\Requests\SpacePlanner\UpdateReservationRequest;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerReservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function __construct(
        private readonly CreateReservation $createReservation,
        private readonly ReleaseReservation $releaseReservation,
    ) {}

    /**
     * Reserve a table's whole chair group, or a single chair.
     */
    public function store(StoreReservationRequest $request, SpacePlannerProject $project): RedirectResponse
    {
        $item = $project->items()->whereKey($request->validated('project_item_id'))->firstOrFail();

        $reservation = $this->createReservation->handle(
            $project,
            $item,
            $request->validated('customer_name'),
            Carbon::parse($request->validated('reservation_time')),
            $request->validated('chairs_count'),
        );

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __(':reserved/:total chairs reserved.', [
                'reserved' => $reservation->reserved_chairs_count,
                'total' => $reservation->total_chairs_in_group,
            ]),
        ]);

        return back();
    }

    /**
     * Free a table's whole reserved chair group, or a single reserved chair.
     */
    public function release(ReleaseReservationRequest $request, SpacePlannerProject $project): RedirectResponse
    {
        $item = $project->items()->whereKey($request->validated('project_item_id'))->firstOrFail();

        $releasedCount = $this->releaseReservation->handle($project, $item);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $releasedCount > 0
                ? __(':count chair(s) released.', ['count' => $releasedCount])
                : __('Nothing to release.'),
        ]);

        return back();
    }

    /**
     * Update a reservation's status.
     */
    public function update(UpdateReservationRequest $request, SpacePlannerProject $project, SpacePlannerReservation $reservation): RedirectResponse
    {
        $reservation->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reservation updated.')]);

        return back();
    }
}

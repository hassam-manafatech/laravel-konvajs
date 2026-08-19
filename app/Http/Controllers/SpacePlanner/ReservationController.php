<?php

namespace App\Http\Controllers\SpacePlanner;

use App\Actions\SpacePlanner\CreateReservation;
use App\Http\Controllers\Controller;
use App\Http\Requests\SpacePlanner\StoreReservationRequest;
use App\Http\Requests\SpacePlanner\UpdateReservationRequest;
use App\Models\Project;
use App\Models\Reservation;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ReservationController extends Controller
{
    public function __construct(private readonly CreateReservation $createReservation) {}

    /**
     * Reserve a table's whole chair group, or a single chair.
     */
    public function store(StoreReservationRequest $request, Project $project): RedirectResponse
    {
        $item = $project->items()->whereKey($request->validated('project_item_id'))->firstOrFail();

        $reservation = $this->createReservation->handle(
            $project,
            $item,
            $request->validated('customer_name'),
            Carbon::parse($request->validated('reservation_time')),
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
     * Update a reservation's status.
     */
    public function update(UpdateReservationRequest $request, Project $project, Reservation $reservation): RedirectResponse
    {
        $reservation->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Reservation updated.')]);

        return back();
    }
}

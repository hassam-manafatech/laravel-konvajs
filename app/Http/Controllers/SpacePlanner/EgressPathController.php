<?php

namespace App\Http\Controllers\SpacePlanner;

use App\Http\Controllers\Controller;
use App\Http\Requests\SpacePlanner\StoreEgressPathRequest;
use App\Http\Requests\SpacePlanner\UpdateEgressPathRequest;
use App\Models\EgressPath;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class EgressPathController extends Controller
{
    /**
     * Add an egress path to the project.
     */
    public function store(StoreEgressPathRequest $request, Project $project): RedirectResponse
    {
        $project->egressPaths()->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Egress path added.')]);

        return back();
    }

    /**
     * Update an existing egress path.
     */
    public function update(UpdateEgressPathRequest $request, Project $project, EgressPath $egressPath): RedirectResponse
    {
        $egressPath->update($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Egress path updated.')]);

        return back();
    }

    /**
     * Remove an egress path.
     */
    public function destroy(Project $project, EgressPath $egressPath): RedirectResponse
    {
        Gate::authorize('update', $project);

        $egressPath->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Egress path removed.')]);

        return back();
    }
}

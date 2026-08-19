<?php

namespace App\Http\Controllers\SpacePlanner;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class FireSafetyController extends Controller
{
    /**
     * Toggle the project's fire-safety egress display.
     */
    public function toggle(Project $project): RedirectResponse
    {
        Gate::authorize('update', $project);

        $project->fire_safety_active = ! $project->fire_safety_active;
        $project->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Fire safety view updated.')]);

        return back();
    }
}

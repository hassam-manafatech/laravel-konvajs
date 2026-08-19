<?php

namespace App\Http\Controllers\SpacePlanner;

use App\Actions\SpacePlanner\SeedStarterProjectLayout;
use App\Http\Controllers\Controller;
use App\Http\Requests\SpacePlanner\StoreProjectRequest;
use App\Http\Requests\SpacePlanner\UpdateProjectRequest;
use App\Models\SpacePlannerFurnitureCatalog;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function __construct(private readonly SeedStarterProjectLayout $seedStarterProjectLayout) {}

    /**
     * Display the authenticated user's projects.
     */
    public function index(Request $request): Response
    {
        $projects = SpacePlannerProject::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('space-planner/index', [
            'projects' => $projects,
        ]);
    }

    /**
     * Show the form for creating a new project.
     */
    public function create(): Response
    {
        return Inertia::render('space-planner/create', [
            'templates' => Inertia::defer(fn () => SpacePlannerTemplate::query()->get()),
        ]);
    }

    /**
     * Store a newly created project, seeded with a starter layout.
     */
    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $template = isset($validated['template_id']) ? SpacePlannerTemplate::query()->find($validated['template_id']) : null;

        $project = new SpacePlannerProject($validated);
        $project->user_id = $request->user()->id;
        $project->template_id = $template?->id;
        $project->width_m = $validated['width_m'] ?? $template?->default_width_m ?? 10;
        $project->height_m = $validated['height_m'] ?? $template?->default_height_m ?? 10;
        $project->brand_color = $validated['brand_color'] ?? '#2563EB';
        $project->save();

        $this->seedStarterProjectLayout->handle($project);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Project created.')]);

        return to_route('projects.show', $project);
    }

    /**
     * Display the given project's workspace.
     */
    public function show(SpacePlannerProject $project): Response
    {
        Gate::authorize('view', $project);

        $project->load(['items.furniture', 'reservations.chairs', 'egressPaths']);

        return Inertia::render('space-planner/show', [
            'project' => $project,
            'furnitureCatalog' => Inertia::defer(fn () => SpacePlannerFurnitureCatalog::query()->get()),
        ]);
    }

    /**
     * Update the given project's settings.
     */
    public function update(UpdateProjectRequest $request, SpacePlannerProject $project): RedirectResponse
    {
        $project->fill($request->validated())->save();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Project updated.')]);

        return back();
    }

    /**
     * Delete the given project.
     */
    public function destroy(SpacePlannerProject $project): RedirectResponse
    {
        Gate::authorize('delete', $project);

        $project->delete();

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Project deleted.')]);

        return to_route('projects.index');
    }
}

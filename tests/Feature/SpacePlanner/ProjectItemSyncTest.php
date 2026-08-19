<?php

use App\Actions\SpacePlanner\RecalculateProjectTotals;
use App\Models\SpacePlannerFurnitureCatalog;
use App\Models\SpacePlannerProject;
use App\Models\SpacePlannerProjectItem;
use App\Models\User;

test('syncing project items upserts position, rotation, and color and recalculates totals', function () {
    $user = User::factory()->create();
    $project = SpacePlannerProject::factory()->for($user)->create();
    $chair = SpacePlannerFurnitureCatalog::factory()->chair()->create(['price' => 80]);
    $existing = SpacePlannerProjectItem::factory()->for($project, 'project')->create([
        'furniture_id' => $chair->id,
        'x_coord' => 0,
        'y_coord' => 0,
        'rotation' => 0,
    ]);

    $response = $this->actingAs($user)->postJson(route('project-items.sync', $project), [
        'items' => [
            [
                'id' => $existing->id,
                'furniture_id' => $chair->id,
                'x_coord' => 5.5,
                'y_coord' => 3.2,
                'rotation' => 90,
                'custom_color' => '#ff0000',
            ],
            [
                'furniture_id' => $chair->id,
                'x_coord' => 1,
                'y_coord' => 1,
            ],
        ],
    ]);

    $response->assertOk();

    $existing->refresh();
    expect((float) $existing->x_coord)->toBe(5.5);
    expect((float) $existing->y_coord)->toBe(3.2);
    expect($existing->rotation)->toBe(90.0);
    expect($existing->custom_color)->toBe('#ff0000');

    expect($project->items()->count())->toBe(2);
    expect($project->fresh()->total_seats)->toBe(2);
    expect((float) $project->fresh()->total_cost)->toBe(160.0);
});

test('deleting a project item recalculates totals', function () {
    $user = User::factory()->create();
    $project = SpacePlannerProject::factory()->for($user)->create();
    $chair = SpacePlannerFurnitureCatalog::factory()->chair()->create(['price' => 80]);
    $item = SpacePlannerProjectItem::factory()->for($project, 'project')->create(['furniture_id' => $chair->id]);
    app(RecalculateProjectTotals::class)->handle($project);

    expect($project->fresh()->total_seats)->toBe(1);

    $this->actingAs($user)->deleteJson(route('project-items.destroy', [$project, $item]))->assertOk();

    expect($project->fresh()->total_seats)->toBe(0);
    expect($project->items()->count())->toBe(0);
});

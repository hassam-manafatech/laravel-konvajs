<?php

use App\Models\Project;
use App\Models\User;

test('toggling fire safety flips the flag', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create(['fire_safety_active' => false]);

    $this->actingAs($user)->patch(route('fire-safety.toggle', $project))->assertRedirect();
    expect($project->fresh()->fire_safety_active)->toBeTrue();

    $this->actingAs($user)->patch(route('fire-safety.toggle', $project))->assertRedirect();
    expect($project->fresh()->fire_safety_active)->toBeFalse();
});

test('egress paths can be created, updated, and deleted for a project', function () {
    $user = User::factory()->create();
    $project = Project::factory()->for($user)->create();

    $response = $this->actingAs($user)->post(route('egress-paths.store', $project), [
        'path_points' => [['x' => 0, 'y' => 0], ['x' => 5, 'y' => 0]],
        'door_label' => 'Main Entrance',
    ]);
    $response->assertSessionHasNoErrors();

    $egressPath = $project->egressPaths()->firstOrFail();
    expect($egressPath->door_label)->toBe('Main Entrance');

    $this->actingAs($user)->patch(route('egress-paths.update', [$project, $egressPath]), [
        'door_label' => 'Rear Exit',
    ])->assertSessionHasNoErrors();
    expect($egressPath->fresh()->door_label)->toBe('Rear Exit');

    $this->actingAs($user)->delete(route('egress-paths.destroy', [$project, $egressPath]))->assertRedirect();
    expect($project->egressPaths()->count())->toBe(0);
});

test('another user cannot manage this project\'s egress paths', function () {
    $owner = User::factory()->create();
    $intruder = User::factory()->create();
    $project = Project::factory()->for($owner)->create();

    $this->actingAs($intruder)->post(route('egress-paths.store', $project), [
        'path_points' => [['x' => 0, 'y' => 0], ['x' => 1, 'y' => 1]],
    ])->assertForbidden();
});

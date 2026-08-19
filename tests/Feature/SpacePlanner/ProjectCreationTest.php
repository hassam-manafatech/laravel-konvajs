<?php

use App\Models\FurnitureCatalog;
use App\Models\Project;
use App\Models\User;

beforeEach(function () {
    FurnitureCatalog::factory()->table()->create(['price' => 200]);
    FurnitureCatalog::factory()->chair()->create(['price' => 50]);
});

test('creating a project seeds a starter layout of 2 tables and 4/6 linked chairs', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->post(route('projects.store'), [
        'name' => 'My Cafe',
        'width_m' => 10,
        'height_m' => 10,
        'brand_color' => '#112233',
    ]);

    $project = Project::query()->where('user_id', $user->id)->firstOrFail();

    $response->assertRedirect(route('projects.show', $project));

    expect($project->items()->count())->toBe(12);

    $groupSizes = $project->items()->whereNotNull('group_id')->get()
        ->groupBy('group_id')
        ->map->count()
        ->sort()
        ->values()
        ->all();

    expect($groupSizes)->toBe([5, 7]);
    expect($project->total_seats)->toBe(10);
    expect((float) $project->total_cost)->toBe(900.0);
});

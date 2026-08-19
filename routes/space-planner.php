<?php

use App\Http\Controllers\SpacePlanner\EgressPathController;
use App\Http\Controllers\SpacePlanner\FireSafetyController;
use App\Http\Controllers\SpacePlanner\ProjectController;
use App\Http\Controllers\SpacePlanner\ProjectItemController;
use App\Http\Controllers\SpacePlanner\ReservationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::post('projects', [ProjectController::class, 'store'])->name('projects.store');
    Route::get('projects/{project}', [ProjectController::class, 'show'])->name('projects.show');
    Route::patch('projects/{project}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('projects/{project}', [ProjectController::class, 'destroy'])->name('projects.destroy');

    Route::scopeBindings()->group(function () {
        Route::post('projects/{project}/items/sync', [ProjectItemController::class, 'sync'])->name('project-items.sync');
        Route::delete('projects/{project}/items/{item}', [ProjectItemController::class, 'destroy'])->name('project-items.destroy');
        Route::post('projects/{project}/items/link', [ProjectItemController::class, 'link'])->name('project-items.link');
        Route::post('projects/{project}/items/unlink', [ProjectItemController::class, 'unlink'])->name('project-items.unlink');

        Route::post('projects/{project}/reservations', [ReservationController::class, 'store'])->name('reservations.store');
        Route::post('projects/{project}/reservations/release', [ReservationController::class, 'release'])->name('reservations.release');
        Route::patch('projects/{project}/reservations/{reservation}', [ReservationController::class, 'update'])->name('reservations.update');

        Route::patch('projects/{project}/fire-safety', [FireSafetyController::class, 'toggle'])->name('fire-safety.toggle');

        Route::post('projects/{project}/egress-paths', [EgressPathController::class, 'store'])->name('egress-paths.store');
        Route::patch('projects/{project}/egress-paths/{egressPath}', [EgressPathController::class, 'update'])->name('egress-paths.update');
        Route::delete('projects/{project}/egress-paths/{egressPath}', [EgressPathController::class, 'destroy'])->name('egress-paths.destroy');
    });
});

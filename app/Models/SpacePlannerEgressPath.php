<?php

namespace App\Models;

use Database\Factories\EgressPathFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property array<int, array{x: float, y: float}> $path_points
 * @property string|null $door_label
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['path_points', 'door_label'])]
class SpacePlannerEgressPath extends Model
{
    /** @use HasFactory<EgressPathFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return EgressPathFactory::new();
    }

    /**
     * @return BelongsTo<SpacePlannerProject, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerProject::class, 'project_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'path_points' => 'array',
        ];
    }
}

<?php

namespace App\Models;

use App\Policies\ProjectPolicy;
use Database\Factories\ProjectFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $user_id
 * @property int|null $template_id
 * @property string $name
 * @property string $width_m
 * @property string $height_m
 * @property string $brand_color
 * @property bool $show_blueprint_grid
 * @property int $total_seats
 * @property string $total_cost
 * @property bool $fire_safety_active
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'width_m', 'height_m', 'brand_color', 'show_blueprint_grid'])]
#[UsePolicy(ProjectPolicy::class)]
class SpacePlannerProject extends Model
{
    /** @use HasFactory<ProjectFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return ProjectFactory::new();
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<SpacePlannerTemplate, $this>
     */
    public function template(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerTemplate::class, 'template_id');
    }

    /**
     * @return HasMany<SpacePlannerProjectItem, $this>
     */
    public function items(): HasMany
    {
        return $this->hasMany(SpacePlannerProjectItem::class, 'project_id');
    }

    /**
     * @return HasMany<SpacePlannerReservation, $this>
     */
    public function reservations(): HasMany
    {
        return $this->hasMany(SpacePlannerReservation::class, 'project_id');
    }

    /**
     * @return HasMany<SpacePlannerEgressPath, $this>
     */
    public function egressPaths(): HasMany
    {
        return $this->hasMany(SpacePlannerEgressPath::class, 'project_id');
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'show_blueprint_grid' => 'boolean',
            'fire_safety_active' => 'boolean',
        ];
    }
}

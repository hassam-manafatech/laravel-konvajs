<?php

namespace App\Models;

use App\Enums\ReservationStatus;
use Database\Factories\ReservationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $project_id
 * @property int $table_item_id
 * @property string|null $group_id
 * @property string $customer_name
 * @property Carbon $reservation_time
 * @property ReservationStatus $status
 * @property int $total_chairs_in_group
 * @property int $reserved_chairs_count
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['table_item_id', 'group_id', 'customer_name', 'reservation_time', 'status', 'total_chairs_in_group', 'reserved_chairs_count'])]
class SpacePlannerReservation extends Model
{
    /** @use HasFactory<ReservationFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return ReservationFactory::new();
    }

    /**
     * @return BelongsTo<SpacePlannerProject, $this>
     */
    public function project(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerProject::class, 'project_id');
    }

    /**
     * @return BelongsTo<SpacePlannerProjectItem, $this>
     */
    public function anchorItem(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerProjectItem::class, 'table_item_id');
    }

    /**
     * @return HasMany<SpacePlannerReservationItem, $this>
     */
    public function reservationItems(): HasMany
    {
        return $this->hasMany(SpacePlannerReservationItem::class, 'reservation_id');
    }

    /**
     * @return BelongsToMany<SpacePlannerProjectItem, $this>
     */
    public function chairs(): BelongsToMany
    {
        return $this->belongsToMany(
            SpacePlannerProjectItem::class,
            'space_planner_reservation_items',
            'reservation_id',
            'project_item_id',
        );
    }

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => ReservationStatus::class,
            'reservation_time' => 'datetime',
        ];
    }
}

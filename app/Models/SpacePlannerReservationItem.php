<?php

namespace App\Models;

use Database\Factories\ReservationItemFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property int $reservation_id
 * @property int $project_item_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['reservation_id', 'project_item_id'])]
class SpacePlannerReservationItem extends Model
{
    /** @use HasFactory<ReservationItemFactory> */
    use HasFactory;

    /**
     * Create a new factory instance for the model.
     *
     * @return Factory<static>
     */
    protected static function newFactory(): Factory
    {
        return ReservationItemFactory::new();
    }

    /**
     * @return BelongsTo<SpacePlannerReservation, $this>
     */
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerReservation::class, 'reservation_id');
    }

    /**
     * @return BelongsTo<SpacePlannerProjectItem, $this>
     */
    public function projectItem(): BelongsTo
    {
        return $this->belongsTo(SpacePlannerProjectItem::class, 'project_item_id');
    }
}

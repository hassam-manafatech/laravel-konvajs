<?php

namespace App\Policies;

use App\Models\SpacePlannerProject;
use App\Models\User;

class ProjectPolicy
{
    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SpacePlannerProject $project): bool
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SpacePlannerProject $project): bool
    {
        return $user->id === $project->user_id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SpacePlannerProject $project): bool
    {
        return $user->id === $project->user_id;
    }
}

<?php

namespace App\Http\Requests\SpacePlanner;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UnlinkProjectItemsRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('project'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $projectId = $this->route('project')->id;

        return [
            'item_ids' => ['required', 'array', 'min:1'],
            'item_ids.*' => [
                'integer',
                Rule::exists('space_planner_project_items', 'id')->where('project_id', $projectId),
            ],
        ];
    }
}

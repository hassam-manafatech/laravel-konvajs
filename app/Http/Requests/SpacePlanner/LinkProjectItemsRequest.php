<?php

namespace App\Http\Requests\SpacePlanner;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LinkProjectItemsRequest extends FormRequest
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
            'table_item_id' => [
                'required',
                'integer',
                Rule::exists('project_items', 'id')->where('project_id', $projectId),
            ],
            'chair_item_ids' => ['required', 'array', 'min:1'],
            'chair_item_ids.*' => [
                'integer',
                Rule::exists('project_items', 'id')->where('project_id', $projectId),
            ],
        ];
    }
}

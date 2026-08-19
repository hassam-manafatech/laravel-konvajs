<?php

namespace App\Http\Requests\SpacePlanner;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReservationRequest extends FormRequest
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
            'project_item_id' => [
                'required',
                'integer',
                Rule::exists('project_items', 'id')->where('project_id', $projectId),
            ],
            'customer_name' => ['required', 'string', 'max:255'],
            'reservation_time' => ['required', 'date', 'after_or_equal:now'],
        ];
    }
}

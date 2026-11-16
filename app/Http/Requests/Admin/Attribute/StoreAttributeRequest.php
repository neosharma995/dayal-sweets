<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Attribute;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreAttributeRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if (empty($this->input('slug')) && ! empty($this->input('name'))) {
            $this->merge([
                'slug' => Str::slug((string) $this->input('name')),
            ]);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'unique:product_attributes,slug'],
            'description' => ['nullable', 'string', 'max:1000'],
            'values' => ['nullable', 'array'],
            'values.*' => ['nullable'],
        ];
    }
}

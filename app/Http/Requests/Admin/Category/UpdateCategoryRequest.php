<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Category;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
        if (empty($this->input('category_slug')) && ! empty($this->input('category_name'))) {
            $this->merge([
                'category_slug' => Str::slug((string) $this->input('category_name')),
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
        $categoryId = $this->route('category') instanceof \App\Models\Category
            ? $this->route('category')->id
            : $this->route('category');

        return [
            'category_name' => ['sometimes', 'required', 'string', 'max:255'],
            'category_slug' => [
                'sometimes',
                'nullable',
                'string',
                'max:255',
                Rule::unique('product_categories', 'category_slug')->ignore($categoryId),
            ],
            'category_image' => ['nullable'],
            'category_description' => ['nullable', 'string'],
        ];
    }
}

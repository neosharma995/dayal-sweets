<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin\Category;

use App\Models\Category;
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
        $merge = [];
        if (empty($this->input('category_slug')) && ! empty($this->input('category_name'))) {
            $merge['category_slug'] = Str::slug((string) $this->input('category_name'));
        }
        if ($this->has('parent_id') && ($this->input('parent_id') === '' || $this->input('parent_id') === 'null')) {
            $merge['parent_id'] = null;
        }
        if (! empty($merge)) {
            $this->merge($merge);
        }
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $categoryId = $this->route('category') instanceof Category
            ? $this->route('category')->id
            : $this->route('category');

        return [
            'parent_id' => [
                'nullable',
                'integer',
                'exists:product_categories,id',
                Rule::notIn([$categoryId]),
            ],
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

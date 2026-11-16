<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;
use App\Http\Controllers\Controller;

use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Models\ProductAttribute;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\RedirectResponse;
use App\Models\ProductAttributeValue;
use App\Http\Requests\Admin\Attribute\StoreAttributeRequest;
use App\Http\Requests\Admin\Attribute\UpdateAttributeRequest;

class ProductAttributeController extends Controller
{
    /**
     * Display a listing of product attributes.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $search = $request->query('search');

        $query = ProductAttribute::with(['values'])->withCount('values');

        if (! empty($search)) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $attributes = $query->orderBy('name')->paginate(15)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $attributes,
            ]);
        }

        return Inertia::render('Admin/Attributes/Index', [
            'attributes' => $attributes,
            'filters' => [
                'search' => $search,
            ],
            'totalAttributes' => ProductAttribute::count(),
            'totalValues' => ProductAttributeValue::count(),
        ]);
    }

    /**
     * Show the form for creating a new attribute.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Attributes/Create');
    }

    /**
     * Store a newly created attribute and its values in storage.
     */
    public function store(StoreAttributeRequest $request): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();

        $attribute = DB::transaction(function () use ($validated, $request) {
            $attr = ProductAttribute::create([
                'name' => $validated['name'],
                'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
            ]);

            $rawValues = $request->input('values', []);
            $this->syncAttributeValues($attr, $rawValues);

            return $attr->load('values');
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Attribute created successfully.',
                'data' => $attribute,
            ], 201);
        }

        return redirect()
            ->route('admin.attributes.index')
            ->with('success', 'Attribute "'.$attribute->name.'" created successfully with its values.');
    }

    /**
     * Display the specified attribute.
     */
    public function show(ProductAttribute $attribute, Request $request): Response|JsonResponse
    {
        $attribute->load(['values']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $attribute,
            ]);
        }

        return Inertia::render('Admin/Attributes/Show', [
            'attribute' => $attribute,
        ]);
    }

    /**
     * Show the form for editing the specified attribute.
     */
    public function edit(ProductAttribute $attribute): Response
    {
        $attribute->load('values');

        return Inertia::render('Admin/Attributes/Edit', [
            'attribute' => $attribute,
        ]);
    }

    /**
     * Update the specified attribute and its values in storage.
     */
    public function update(UpdateAttributeRequest $request, ProductAttribute $attribute): RedirectResponse|JsonResponse
    {
        $validated = $request->validated();

        $attribute = DB::transaction(function () use ($attribute, $validated, $request) {
            $attribute->update([
                'name' => $validated['name'],
                'slug' => ! empty($validated['slug']) ? Str::slug($validated['slug']) : Str::slug($validated['name']),
                'description' => $validated['description'] ?? null,
            ]);

            $rawValues = $request->input('values', []);
            $this->syncAttributeValues($attribute, $rawValues);

            return $attribute->fresh('values');
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Attribute updated successfully.',
                'data' => $attribute,
            ]);
        }

        return redirect()
            ->route('admin.attributes.index')
            ->with('success', 'Attribute "'.$attribute->name.'" updated successfully.');
    }

    /**
     * Remove the specified attribute and its values from storage.
     */
    public function destroy(ProductAttribute $attribute, Request $request): RedirectResponse|JsonResponse
    {
        $name = $attribute->name;
        $attribute->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => "Attribute '{$name}' deleted successfully.",
            ]);
        }

        return redirect()
            ->route('admin.attributes.index')
            ->with('success', "Attribute '{$name}' and its values were deleted successfully.");
    }

    /**
     * Helper to sync attribute values.
     */
    protected function syncAttributeValues(ProductAttribute $attribute, array $rawValues): void
    {
        $existingValues = $attribute->values()->get()->keyBy('id');
        $keptIds = [];

        foreach ($rawValues as $item) {
            $val = is_array($item) ? ($item['value'] ?? '') : (string) $item;
            $val = trim($val);
            if ($val === '') {
                continue;
            }

            $slug = is_array($item) && ! empty($item['slug']) ? Str::slug($item['slug']) : Str::slug($val);
            $color = is_array($item) ? ($item['color_code'] ?? null) : null;
            $id = is_array($item) ? ($item['id'] ?? null) : null;

            if ($id && $existingValues->has($id)) {
                $existing = $existingValues->get($id);
                $existing->update([
                    'value' => $val,
                    'slug' => $slug,
                    'color_code' => $color,
                ]);
                $keptIds[] = $existing->id;
            } else {
                $created = $attribute->values()->create([
                    'value' => $val,
                    'slug' => $slug,
                    'color_code' => $color,
                ]);
                $keptIds[] = $created->id;
            }
        }

        // Delete values not present in keptIds
        $attribute->values()->whereNotIn('id', $keptIds)->delete();
    }
}

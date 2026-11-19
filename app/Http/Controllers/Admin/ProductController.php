<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\DietPreference;
use App\Models\Occasion;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\ProductAttribute;
use App\Models\ProductTag;
use App\Models\SeasonalMithai;
use App\Models\TaxRate;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Display a listing of all products (get_all).
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = Product::query()->with(['category', 'categories', 'seasonalMithai', 'seasonalMithais', 'occasion', 'occasions', 'dietPreference', 'dietPreferences', 'tag', 'tags', 'taxRate', 'variations', 'outlets'])->latest('id');

        // Optional search filter by product name or description
        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('product_description', 'like', "%{$search}%");
            });
        }

        // Filter by outlet if specified in query or active session
        $outletId = $request->input('outlet_id') ?? $request->session()->get('active_outlet_id');
        if ($outletId && $outletId !== 'all') {
            $query->whereHas('outlets', function ($q) use ($outletId) {
                $q->where('outlets.id', (int) $outletId);
            });
        }

        $products = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Products retrieved successfully.',
                'count' => $products->count(),
                'data' => $products,
            ]);
        }

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'filters' => array_merge($request->only(['search']), ['outlet_id' => $outletId]),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::orderBy('category_name')->get(['id', 'parent_id', 'category_name']),
            'seasonalMithais' => SeasonalMithai::orderBy('category_name')->get(['id', 'category_name']),
            'occasions' => Occasion::orderBy('category_name')->get(['id', 'category_name']),
            'dietPreferences' => DietPreference::orderBy('category_name')->get(['id', 'category_name']),
            'tags' => ProductTag::orderBy('product_tag_name')->get(['id', 'product_tag_name']),
            'attributes' => ProductAttribute::with('values')->orderBy('name')->get(),
            'taxRates' => TaxRate::where('is_active', true)->orderBy('rate')->get(['id', 'name', 'code', 'rate', 'type', 'tax_class']),
            'outlets' => Outlet::where('status', '!=', 'inactive')->orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'slug', 'city', 'status']),
        ]);
    }

    /**
     * Show the form for editing an existing product.
     */
    public function edit(Product|int|string $product): Response
    {
        $productModel = $product instanceof Product ? $product : Product::findOrFail($product);
        $productModel->load(['category', 'categories', 'seasonalMithai', 'seasonalMithais', 'occasion', 'occasions', 'dietPreference', 'dietPreferences', 'tag', 'tags', 'taxRate', 'variations.attributeValue.attribute', 'outlets']);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $productModel,
            'categories' => Category::orderBy('category_name')->get(['id', 'parent_id', 'category_name']),
            'seasonalMithais' => SeasonalMithai::orderBy('category_name')->get(['id', 'category_name']),
            'occasions' => Occasion::orderBy('category_name')->get(['id', 'category_name']),
            'dietPreferences' => DietPreference::orderBy('category_name')->get(['id', 'category_name']),
            'tags' => ProductTag::orderBy('product_tag_name')->get(['id', 'product_tag_name']),
            'attributes' => ProductAttribute::with('values')->orderBy('name')->get(),
            'taxRates' => TaxRate::where('is_active', true)->orderBy('rate')->get(['id', 'name', 'code', 'rate', 'type', 'tax_class']),
            'outlets' => Outlet::where('status', '!=', 'inactive')->orderBy('sort_order')->orderBy('name')->get(['id', 'name', 'slug', 'city', 'status']),
        ]);
    }

    /**
     * Display a single product by ID (getbyid).
     */
    public function show(Request $request, Product|int|string $product): Response|JsonResponse
    {
        $productModel = $product instanceof Product ? $product : Product::findOrFail($product);
        $productModel->load(['category', 'categories', 'seasonalMithai', 'seasonalMithais', 'occasion', 'occasions', 'dietPreference', 'dietPreferences', 'tag', 'tags', 'taxRate', 'variations.attributeValue.attribute', 'outlets']);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product retrieved successfully.',
                'data' => $productModel,
            ]);
        }

        return Inertia::render('Admin/Products/Show', [
            'product' => $productModel,
        ]);
    }

    /**
     * Store a newly created product (create).
     */
    public function store(StoreProductRequest $request): RedirectResponse|JsonResponse
    {
        $data = $request->validated();

        // Ensure product_qty defaults to 1 if omitted
        if (! isset($data['product_qty']) || $data['product_qty'] === null) {
            $data['product_qty'] = 1;
        }

        // Handle primary product image upload if sent as a file
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                $data['product_image'] = $file->store('products', 'public');
            }
        } elseif ($request->filled('product_image') && is_string($request->input('product_image'))) {
            $data['product_image'] = $request->input('product_image');
        }

        // Handle product_gallaries (array of files or array of URL strings)
        $gallaries = [];
        if ($request->hasFile('product_gallaries')) {
            $files = $request->file('product_gallaries');
            if (is_array($files)) {
                foreach ($files as $file) {
                    if ($file instanceof UploadedFile && $file->isValid()) {
                        $gallaries[] = $file->store('products/gallaries', 'public');
                    }
                }
            }
        } elseif (isset($data['product_gallaries']) && is_array($data['product_gallaries'])) {
            foreach ($data['product_gallaries'] as $item) {
                if ($item instanceof UploadedFile && $item->isValid()) {
                    $gallaries[] = $item->store('products/gallaries', 'public');
                } elseif (is_string($item)) {
                    $gallaries[] = $item;
                }
            }
        }
        $data['product_gallaries'] = $gallaries;

        // Ensure product_details is an array
        if (! isset($data['product_details']) || ! is_array($data['product_details'])) {
            $data['product_details'] = [];
        }

        $variationsData = $data['variations'] ?? null;
        unset($data['variations']);

        $tagIds = $data['tag_ids'] ?? null;
        unset($data['tag_ids']);

        $outletIds = $data['outlet_ids'] ?? null;
        unset($data['outlet_ids']);

        $categoryIds = $data['category_ids'] ?? null;
        unset($data['category_ids']);
        $seasonalIds = $data['seasonal_mithai_ids'] ?? null;
        unset($data['seasonal_mithai_ids']);
        $occasionIds = $data['occasion_ids'] ?? null;
        unset($data['occasion_ids']);
        $dietIds = $data['diet_preference_ids'] ?? null;
        unset($data['diet_preference_ids']);

        if (is_array($categoryIds)) {
            $data['category_id'] = ! empty($categoryIds) ? $categoryIds[0] : null;
        }
        if (is_array($seasonalIds)) {
            $data['seasonal_mithai_id'] = ! empty($seasonalIds) ? $seasonalIds[0] : null;
        }
        if (is_array($occasionIds)) {
            $data['occasion_id'] = ! empty($occasionIds) ? $occasionIds[0] : null;
        }
        if (is_array($dietIds)) {
            $data['diet_preference_id'] = ! empty($dietIds) ? $dietIds[0] : null;
        }

        if (empty($data['product_tag_id']) && is_array($tagIds) && ! empty($tagIds)) {
            $data['product_tag_id'] = $tagIds[0];
        }

        $createdProduct = DB::transaction(function () use ($data, $variationsData, $tagIds, $outletIds, $categoryIds, $seasonalIds, $occasionIds, $dietIds) {
            $product = Product::create($data);

            if (is_array($variationsData) && ! empty($variationsData)) {
                $this->syncProductVariations($product, $variationsData);
            }

            if (is_array($categoryIds)) {
                $product->categories()->sync($categoryIds);
            } elseif (! empty($product->category_id)) {
                $product->categories()->sync([$product->category_id]);
            }

            if (is_array($seasonalIds)) {
                $product->seasonalMithais()->sync($seasonalIds);
            } elseif (! empty($product->seasonal_mithai_id)) {
                $product->seasonalMithais()->sync([$product->seasonal_mithai_id]);
            }

            if (is_array($occasionIds)) {
                $product->occasions()->sync($occasionIds);
            } elseif (! empty($product->occasion_id)) {
                $product->occasions()->sync([$product->occasion_id]);
            }

            if (is_array($dietIds)) {
                $product->dietPreferences()->sync($dietIds);
            } elseif (! empty($product->diet_preference_id)) {
                $product->dietPreferences()->sync([$product->diet_preference_id]);
            }

            if (is_array($tagIds)) {
                $product->tags()->sync($tagIds);
            } elseif (! empty($product->product_tag_id)) {
                $product->tags()->sync([$product->product_tag_id]);
            }

            if (is_array($outletIds)) {
                $product->outlets()->sync($outletIds);
            }

            return $product;
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product created successfully.',
                'data' => $createdProduct->load(['category', 'categories', 'seasonalMithai', 'seasonalMithais', 'occasion', 'occasions', 'dietPreference', 'dietPreferences', 'tag', 'tags', 'taxRate', 'variations', 'outlets'])->fresh(),
            ], 201);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product created successfully.');
    }

    /**
     * Update an existing product (update).
     */
    public function update(UpdateProductRequest $request, Product|int|string $product): RedirectResponse|JsonResponse
    {
        $productModel = $product instanceof Product ? $product : Product::findOrFail($product);
        $data = $request->validated();

        // Handle primary product image replacement
        if ($request->hasFile('product_image')) {
            $file = $request->file('product_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                // Delete previous stored file if it exists locally
                if ($productModel->product_image && Storage::disk('public')->exists($productModel->product_image)) {
                    Storage::disk('public')->delete($productModel->product_image);
                }
                $data['product_image'] = $file->store('products', 'public');
            }
        } elseif ($request->filled('product_image') && is_string($request->input('product_image'))) {
            $data['product_image'] = $request->input('product_image');
        }

        // Handle product_gallaries update
        if ($request->hasFile('product_gallaries')) {
            $files = $request->file('product_gallaries');
            $newGallaries = [];
            if (is_array($files)) {
                foreach ($files as $file) {
                    if ($file instanceof UploadedFile && $file->isValid()) {
                        $newGallaries[] = $file->store('products/gallaries', 'public');
                    }
                }
            }
            $data['product_gallaries'] = $newGallaries;
        } elseif (isset($data['product_gallaries']) && is_array($data['product_gallaries'])) {
            $processedGallaries = [];
            foreach ($data['product_gallaries'] as $item) {
                if ($item instanceof UploadedFile && $item->isValid()) {
                    $processedGallaries[] = $item->store('products/gallaries', 'public');
                } elseif (is_string($item)) {
                    $processedGallaries[] = $item;
                }
            }
            $data['product_gallaries'] = $processedGallaries;
        }

        // Handle product_details update if provided
        if (isset($data['product_details']) && ! is_array($data['product_details'])) {
            $data['product_details'] = [];
        }

        $variationsData = $data['variations'] ?? null;
        unset($data['variations']);

        $tagIds = $data['tag_ids'] ?? null;
        unset($data['tag_ids']);

        $outletIds = $data['outlet_ids'] ?? null;
        unset($data['outlet_ids']);

        $categoryIds = $data['category_ids'] ?? null;
        unset($data['category_ids']);
        $seasonalIds = $data['seasonal_mithai_ids'] ?? null;
        unset($data['seasonal_mithai_ids']);
        $occasionIds = $data['occasion_ids'] ?? null;
        unset($data['occasion_ids']);
        $dietIds = $data['diet_preference_ids'] ?? null;
        unset($data['diet_preference_ids']);

        if (is_array($categoryIds)) {
            $data['category_id'] = ! empty($categoryIds) ? $categoryIds[0] : null;
        }
        if (is_array($seasonalIds)) {
            $data['seasonal_mithai_id'] = ! empty($seasonalIds) ? $seasonalIds[0] : null;
        }
        if (is_array($occasionIds)) {
            $data['occasion_id'] = ! empty($occasionIds) ? $occasionIds[0] : null;
        }
        if (is_array($dietIds)) {
            $data['diet_preference_id'] = ! empty($dietIds) ? $dietIds[0] : null;
        }

        if (empty($data['product_tag_id']) && is_array($tagIds) && ! empty($tagIds)) {
            $data['product_tag_id'] = $tagIds[0];
        }

        DB::transaction(function () use ($productModel, $data, $variationsData, $tagIds, $outletIds, $categoryIds, $seasonalIds, $occasionIds, $dietIds) {
            $productModel->update($data);

            if (is_array($variationsData)) {
                $this->syncProductVariations($productModel, $variationsData);
            }

            if (is_array($categoryIds)) {
                $productModel->categories()->sync($categoryIds);
            } elseif (! empty($productModel->category_id)) {
                $productModel->categories()->sync([$productModel->category_id]);
            }

            if (is_array($seasonalIds)) {
                $productModel->seasonalMithais()->sync($seasonalIds);
            } elseif (! empty($productModel->seasonal_mithai_id)) {
                $productModel->seasonalMithais()->sync([$productModel->seasonal_mithai_id]);
            }

            if (is_array($occasionIds)) {
                $productModel->occasions()->sync($occasionIds);
            } elseif (! empty($productModel->occasion_id)) {
                $productModel->occasions()->sync([$productModel->occasion_id]);
            }

            if (is_array($dietIds)) {
                $productModel->dietPreferences()->sync($dietIds);
            } elseif (! empty($productModel->diet_preference_id)) {
                $productModel->dietPreferences()->sync([$productModel->diet_preference_id]);
            }

            if (is_array($tagIds)) {
                $productModel->tags()->sync($tagIds);
            } elseif (! empty($productModel->product_tag_id)) {
                $productModel->tags()->sync([$productModel->product_tag_id]);
            }

            if (is_array($outletIds)) {
                $productModel->outlets()->sync($outletIds);
            }
        });

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully.',
                'data' => $productModel->load(['category', 'categories', 'seasonalMithai', 'seasonalMithais', 'occasion', 'occasions', 'dietPreference', 'dietPreferences', 'tag', 'tags', 'taxRate', 'variations', 'outlets'])->fresh(),
            ]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product updated successfully.');
    }

    /**
     * Synchronize product variations for this product.
     */
    protected function syncProductVariations(Product $product, array $variations): void
    {
        $existingVariations = $product->variations()->get()->keyBy('id');
        $keptIds = [];
        $hasDefault = false;

        foreach ($variations as $item) {
            if (empty($item['variation_name']) || ! isset($item['price']) || ! isset($item['selling_price'])) {
                continue;
            }

            $isDefault = ! empty($item['is_default']);
            if ($isDefault) {
                if ($hasDefault) {
                    $isDefault = false;
                } else {
                    $hasDefault = true;
                }
            }

            $vPayload = [
                'attribute_value_id' => ! empty($item['attribute_value_id']) ? (int) $item['attribute_value_id'] : null,
                'variation_name' => (string) $item['variation_name'],
                'price' => (float) $item['price'],
                'selling_price' => (float) $item['selling_price'],
                'product_qty' => isset($item['product_qty']) ? (int) $item['product_qty'] : 1,
                'weight_value' => ! empty($item['weight_value']) ? (float) $item['weight_value'] : null,
                'weight_unit' => ! empty($item['weight_unit']) ? (string) $item['weight_unit'] : 'g',
                'sku' => ! empty($item['sku']) ? (string) $item['sku'] : null,
                'is_default' => $isDefault,
            ];

            $id = $item['id'] ?? null;
            if ($id && $existingVariations->has($id)) {
                $existing = $existingVariations->get($id);
                $existing->update($vPayload);
                $keptIds[] = $existing->id;
            } else {
                $created = $product->variations()->create($vPayload);
                $keptIds[] = $created->id;
            }
        }

        // If at least one variation was saved and none marked default, mark the first one as default
        if ($hasDefault === false && ! empty($keptIds)) {
            $product->variations()->where('id', $keptIds[0])->update(['is_default' => true]);
        }

        // Delete variations not kept in this submission
        $product->variations()->whereNotIn('id', $keptIds)->delete();
    }

    /**
     * Delete a product (delete).
     */
    public function destroy(Request $request, Product|int|string $product): RedirectResponse|JsonResponse
    {
        $productModel = $product instanceof Product ? $product : Product::findOrFail($product);

        // Delete associated uploaded main image
        if ($productModel->product_image && Storage::disk('public')->exists($productModel->product_image)) {
            Storage::disk('public')->delete($productModel->product_image);
        }

        // Delete associated gallery files
        if (! empty($productModel->product_gallaries) && is_array($productModel->product_gallaries)) {
            foreach ($productModel->product_gallaries as $imagePath) {
                if (is_string($imagePath) && Storage::disk('public')->exists($imagePath)) {
                    Storage::disk('public')->delete($imagePath);
                }
            }
        }

        $productModel->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product deleted successfully.',
            ]);
        }

        return redirect()->route('admin.products.index')->with('success', 'Product deleted successfully.');
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductTag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProductTagController extends Controller
{
    /**
     * Display a listing of all product tags.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = ProductTag::query()->withCount('products')->latest('id');

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('product_tag_name', 'like', "%{$search}%")
                  ->orWhere('product_tag_description', 'like', "%{$search}%")
                  ->orWhere('product_tag_slug', 'like', "%{$search}%");
            });
        }

        $items = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product tags retrieved successfully.',
                'count' => $items->count(),
                'data' => $items,
            ]);
        }

        return Inertia::render('Admin/ProductTags/Index', [
            'productTags' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new product tag.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/ProductTags/Create');
    }

    /**
     * Store a newly created product tag.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'product_tag_name' => ['required', 'string', 'max:255'],
            'product_tag_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_tags', 'product_tag_slug')],
            'product_tag_description' => ['nullable', 'string'],
            'product_tag_image' => ['nullable'],
        ]);

        if (empty($data['product_tag_slug'])) {
            $data['product_tag_slug'] = Str::slug($data['product_tag_name']);
        }

        if ($request->hasFile('product_tag_image')) {
            $file = $request->file('product_tag_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                $data['product_tag_image'] = $file->store('product_tags', 'public');
            }
        } elseif ($request->filled('product_tag_image') && is_string($request->input('product_tag_image'))) {
            $data['product_tag_image'] = $request->input('product_tag_image');
        }

        $item = ProductTag::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product tag created successfully.',
                'data' => $item,
            ], 201);
        }

        return redirect()->route('admin.product-tags.index')->with('success', 'Product tag created successfully.');
    }

    /**
     * Show the form for editing an existing product tag.
     */
    public function edit(ProductTag|int|string $productTag): Response
    {
        $tagModel = $productTag instanceof ProductTag ? $productTag : ProductTag::findOrFail($productTag);

        return Inertia::render('Admin/ProductTags/Edit', [
            'productTag' => $tagModel,
        ]);
    }

    /**
     * Update an existing product tag.
     */
    public function update(Request $request, ProductTag|int|string $productTag): RedirectResponse|JsonResponse
    {
        $tagModel = $productTag instanceof ProductTag ? $productTag : ProductTag::findOrFail($productTag);

        $data = $request->validate([
            'product_tag_name' => ['required', 'string', 'max:255'],
            'product_tag_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_tags', 'product_tag_slug')->ignore($tagModel->id)],
            'product_tag_description' => ['nullable', 'string'],
            'product_tag_image' => ['nullable'],
        ]);

        if (empty($data['product_tag_slug'])) {
            $data['product_tag_slug'] = Str::slug($data['product_tag_name']);
        }

        if ($request->hasFile('product_tag_image')) {
            $file = $request->file('product_tag_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                if ($tagModel->product_tag_image && Storage::disk('public')->exists($tagModel->product_tag_image)) {
                    Storage::disk('public')->delete($tagModel->product_tag_image);
                }
                $data['product_tag_image'] = $file->store('product_tags', 'public');
            }
        } elseif ($request->filled('product_tag_image') && is_string($request->input('product_tag_image'))) {
            $data['product_tag_image'] = $request->input('product_tag_image');
        }

        $tagModel->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product tag updated successfully.',
                'data' => $tagModel,
            ]);
        }

        return redirect()->route('admin.product-tags.index')->with('success', 'Product tag updated successfully.');
    }

    /**
     * Remove the specified product tag.
     */
    public function destroy(Request $request, ProductTag|int|string $productTag): RedirectResponse|JsonResponse
    {
        $tagModel = $productTag instanceof ProductTag ? $productTag : ProductTag::findOrFail($productTag);

        if ($tagModel->product_tag_image && Storage::disk('public')->exists($tagModel->product_tag_image)) {
            Storage::disk('public')->delete($tagModel->product_tag_image);
        }

        $tagModel->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product tag deleted successfully.',
            ]);
        }

        return redirect()->route('admin.product-tags.index')->with('success', 'Product tag deleted successfully.');
    }
}

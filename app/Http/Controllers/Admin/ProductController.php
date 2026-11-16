<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
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
        $query = Product::query()->with('category')->latest('id');

        // Optional search filter by product name or description
        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('product_name', 'like', "%{$search}%")
                    ->orWhere('product_description', 'like', "%{$search}%");
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
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::orderBy('category_name')->get(['id', 'category_name']),
        ]);
    }

    /**
     * Show the form for editing an existing product.
     */
    public function edit(Product|int|string $product): Response
    {
        $productModel = $product instanceof Product ? $product : Product::findOrFail($product);
        $productModel->load('category');

        return Inertia::render('Admin/Products/Edit', [
            'product' => $productModel,
            'categories' => Category::orderBy('category_name')->get(['id', 'category_name']),
        ]);
    }

    /**
     * Display a single product by ID (getbyid).
     */
    public function show(Request $request, Product|int|string $product): Response|JsonResponse
    {
        $productModel = $product instanceof Product ? $product : Product::findOrFail($product);
        $productModel->load('category');

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

        $createdProduct = Product::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product created successfully.',
                'data' => $createdProduct->fresh(),
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

        $productModel->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Product updated successfully.',
                'data' => $productModel->fresh(),
            ]);
        }

        return back()->with('success', 'Product updated successfully.');
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

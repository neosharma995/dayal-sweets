<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Category\StoreCategoryRequest;
use App\Http\Requests\Admin\Category\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    /**
     * Display a listing of all product categories (get_all).
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = Category::query()->withCount('products')->latest('id');

        // Optional search filter
        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('category_name', 'like', "%{$search}%")
                  ->orWhere('category_description', 'like', "%{$search}%")
                  ->orWhere('category_slug', 'like', "%{$search}%");
            });
        }

        $categories = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Categories retrieved successfully.',
                'count' => $categories->count(),
                'data' => $categories,
            ]);
        }

        return Inertia::render('Admin/Categories/Index', [
            'categories' => $categories,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new category.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Categories/Create');
    }

    /**
     * Store a newly created category (create).
     */
    public function store(StoreCategoryRequest $request): RedirectResponse|JsonResponse
    {
        $data = $request->validated();

        // Handle category image file upload
        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                $data['category_image'] = $file->store('categories', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $category = Category::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category created successfully.',
                'data' => $category->fresh(),
            ], 201);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category created successfully.');
    }

    /**
     * Display a single category by ID along with its products (getbyid).
     */
    public function show(Request $request, Category|int|string $category): Response|JsonResponse
    {
        $categoryModel = $category instanceof Category ? $category : Category::findOrFail($category);
        $categoryModel->load(['products' => fn ($q) => $q->with('variations')->latest('id')])->loadCount('products');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category retrieved successfully.',
                'data' => $categoryModel,
            ]);
        }

        return Inertia::render('Admin/Categories/Show', [
            'category' => $categoryModel,
        ]);
    }

    /**
     * Show the form for editing an existing category.
     */
    public function edit(Category|int|string $category): Response
    {
        $categoryModel = $category instanceof Category ? $category : Category::findOrFail($category);
        $categoryModel->loadCount('products');

        return Inertia::render('Admin/Categories/Edit', [
            'category' => $categoryModel,
        ]);
    }

    /**
     * Update an existing category (update).
     */
    public function update(UpdateCategoryRequest $request, Category|int|string $category): RedirectResponse|JsonResponse
    {
        $categoryModel = $category instanceof Category ? $category : Category::findOrFail($category);
        $data = $request->validated();

        // Handle category image replacement
        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                if ($categoryModel->category_image && Storage::disk('public')->exists($categoryModel->category_image)) {
                    Storage::disk('public')->delete($categoryModel->category_image);
                }
                $data['category_image'] = $file->store('categories', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $categoryModel->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category updated successfully.',
                'data' => $categoryModel->fresh(),
            ]);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category updated successfully.');
    }

    /**
     * Delete a category (delete).
     */
    public function destroy(Request $request, Category|int|string $category): RedirectResponse|JsonResponse
    {
        $categoryModel = $category instanceof Category ? $category : Category::findOrFail($category);

        // Delete associated image file
        if ($categoryModel->category_image && Storage::disk('public')->exists($categoryModel->category_image)) {
            Storage::disk('public')->delete($categoryModel->category_image);
        }

        $categoryModel->delete();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Category deleted successfully.',
            ]);
        }

        return redirect()->route('admin.categories.index')->with('success', 'Category deleted successfully.');
    }
}

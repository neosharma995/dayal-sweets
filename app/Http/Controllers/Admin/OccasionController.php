<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Occasion;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OccasionController extends Controller
{
    /**
     * Display a listing of all occasions.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = Occasion::query()->withCount('products')->latest('id');

        if ($request->filled('search')) {
            $search = (string) $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('category_name', 'like', "%{$search}%")
                    ->orWhere('category_description', 'like', "%{$search}%")
                    ->orWhere('category_slug', 'like', "%{$search}%");
            });
        }

        $items = $query->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Occasions retrieved successfully.',
                'count' => $items->count(),
                'data' => $items,
            ]);
        }

        return Inertia::render('Admin/Occasions/Index', [
            'occasions' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new occasion.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Occasions/Create');
    }

    /**
     * Store a newly created occasion.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'category_name' => ['required', 'string', 'max:255'],
            'category_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_occasions', 'category_slug')],
            'category_description' => ['nullable', 'string'],
            'category_image' => ['nullable'],
        ]);

        if (empty($data['category_slug'])) {
            $data['category_slug'] = Str::slug($data['category_name']);
        }

        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                $data['category_image'] = $file->store('occasions', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $item = Occasion::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Occasion created successfully.',
                'data' => $item,
            ], 201);
        }

        return redirect()->route('admin.occasions.index')->with('success', 'Occasion created successfully.');
    }

    /**
     * Show the form for editing an existing occasion.
     */
    public function edit(Occasion $occasion): Response
    {
        $occasion->loadCount('products');

        return Inertia::render('Admin/Occasions/Edit', [
            'occasion' => $occasion,
        ]);
    }

    /**
     * Update an existing occasion.
     */
    public function update(Request $request, Occasion $occasion): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'category_name' => ['required', 'string', 'max:255'],
            'category_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_occasions', 'category_slug')->ignore($occasion->id)],
            'category_description' => ['nullable', 'string'],
            'category_image' => ['nullable'],
        ]);

        if (empty($data['category_slug'])) {
            $data['category_slug'] = Str::slug($data['category_name']);
        }

        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                if ($occasion->category_image && Storage::disk('public')->exists($occasion->category_image)) {
                    Storage::disk('public')->delete($occasion->category_image);
                }
                $data['category_image'] = $file->store('occasions', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $occasion->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Occasion updated successfully.',
                'data' => $occasion->fresh(),
            ]);
        }

        return redirect()->route('admin.occasions.index')->with('success', 'Occasion updated successfully.');
    }

    /**
     * Delete an occasion.
     */
    public function destroy(Occasion $occasion): RedirectResponse|JsonResponse
    {
        if ($occasion->category_image && Storage::disk('public')->exists($occasion->category_image)) {
            Storage::disk('public')->delete($occasion->category_image);
        }

        $occasion->delete();

        return redirect()->route('admin.occasions.index')->with('success', 'Occasion deleted successfully.');
    }
}

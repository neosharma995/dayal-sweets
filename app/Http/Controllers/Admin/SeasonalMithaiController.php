<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeasonalMithai;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class SeasonalMithaiController extends Controller
{
    /**
     * Display a listing of all seasonal mithais.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = SeasonalMithai::query()->withCount('products')->latest('id');

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
                'message' => 'Seasonal mithais retrieved successfully.',
                'count' => $items->count(),
                'data' => $items,
            ]);
        }

        return Inertia::render('Admin/SeasonalMithais/Index', [
            'seasonalMithais' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new seasonal mithai.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/SeasonalMithais/Create');
    }

    /**
     * Store a newly created seasonal mithai.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'category_name' => ['required', 'string', 'max:255'],
            'category_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_seasonal_mithais', 'category_slug')],
            'category_description' => ['nullable', 'string'],
            'category_image' => ['nullable'],
        ]);

        if (empty($data['category_slug'])) {
            $data['category_slug'] = Str::slug($data['category_name']);
        }

        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                $data['category_image'] = $file->store('seasonal_mithais', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $item = SeasonalMithai::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Seasonal mithai created successfully.',
                'data' => $item,
            ], 201);
        }

        return redirect()->route('admin.seasonal-mithais.index')->with('success', 'Seasonal Mithai created successfully.');
    }

    /**
     * Show the form for editing an existing seasonal mithai.
     */
    public function edit(SeasonalMithai $seasonalMithai): Response
    {
        $seasonalMithai->loadCount('products');

        return Inertia::render('Admin/SeasonalMithais/Edit', [
            'seasonalMithai' => $seasonalMithai,
        ]);
    }

    /**
     * Update an existing seasonal mithai.
     */
    public function update(Request $request, SeasonalMithai $seasonalMithai): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'category_name' => ['required', 'string', 'max:255'],
            'category_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_seasonal_mithais', 'category_slug')->ignore($seasonalMithai->id)],
            'category_description' => ['nullable', 'string'],
            'category_image' => ['nullable'],
        ]);

        if (empty($data['category_slug'])) {
            $data['category_slug'] = Str::slug($data['category_name']);
        }

        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                if ($seasonalMithai->category_image && Storage::disk('public')->exists($seasonalMithai->category_image)) {
                    Storage::disk('public')->delete($seasonalMithai->category_image);
                }
                $data['category_image'] = $file->store('seasonal_mithais', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $seasonalMithai->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Seasonal mithai updated successfully.',
                'data' => $seasonalMithai->fresh(),
            ]);
        }

        return redirect()->route('admin.seasonal-mithais.index')->with('success', 'Seasonal Mithai updated successfully.');
    }

    /**
     * Delete a seasonal mithai.
     */
    public function destroy(SeasonalMithai $seasonalMithai): RedirectResponse|JsonResponse
    {
        if ($seasonalMithai->category_image && Storage::disk('public')->exists($seasonalMithai->category_image)) {
            Storage::disk('public')->delete($seasonalMithai->category_image);
        }

        $seasonalMithai->delete();

        return redirect()->route('admin.seasonal-mithais.index')->with('success', 'Seasonal Mithai deleted successfully.');
    }
}

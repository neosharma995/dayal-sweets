<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DietPreference;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class DietPreferenceController extends Controller
{
    /**
     * Display a listing of all diet preferences.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $query = DietPreference::query()->withCount('products')->latest('id');

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
                'message' => 'Diet preferences retrieved successfully.',
                'count' => $items->count(),
                'data' => $items,
            ]);
        }

        return Inertia::render('Admin/DietPreferences/Index', [
            'dietPreferences' => $items,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Show the form for creating a new diet preference.
     */
    public function create(): Response
    {
        return Inertia::render('Admin/DietPreferences/Create');
    }

    /**
     * Store a newly created diet preference.
     */
    public function store(Request $request): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'category_name' => ['required', 'string', 'max:255'],
            'category_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_diet_preferences', 'category_slug')],
            'category_description' => ['nullable', 'string'],
            'category_image' => ['nullable'],
        ]);

        if (empty($data['category_slug'])) {
            $data['category_slug'] = Str::slug($data['category_name']);
        }

        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                $data['category_image'] = $file->store('diet_preferences', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $item = DietPreference::create($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Diet preference created successfully.',
                'data' => $item,
            ], 201);
        }

        return redirect()->route('admin.diet-preferences.index')->with('success', 'Diet Preference created successfully.');
    }

    /**
     * Show the form for editing an existing diet preference.
     */
    public function edit(DietPreference $dietPreference): Response
    {
        $dietPreference->loadCount('products');

        return Inertia::render('Admin/DietPreferences/Edit', [
            'dietPreference' => $dietPreference,
        ]);
    }

    /**
     * Update an existing diet preference.
     */
    public function update(Request $request, DietPreference $dietPreference): RedirectResponse|JsonResponse
    {
        $data = $request->validate([
            'category_name' => ['required', 'string', 'max:255'],
            'category_slug' => ['nullable', 'string', 'max:255', Rule::unique('product_diet_preferences', 'category_slug')->ignore($dietPreference->id)],
            'category_description' => ['nullable', 'string'],
            'category_image' => ['nullable'],
        ]);

        if (empty($data['category_slug'])) {
            $data['category_slug'] = Str::slug($data['category_name']);
        }

        if ($request->hasFile('category_image')) {
            $file = $request->file('category_image');
            if ($file instanceof UploadedFile && $file->isValid()) {
                if ($dietPreference->category_image && Storage::disk('public')->exists($dietPreference->category_image)) {
                    Storage::disk('public')->delete($dietPreference->category_image);
                }
                $data['category_image'] = $file->store('diet_preferences', 'public');
            }
        } elseif ($request->filled('category_image') && is_string($request->input('category_image'))) {
            $data['category_image'] = $request->input('category_image');
        }

        $dietPreference->update($data);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Diet preference updated successfully.',
                'data' => $dietPreference->fresh(),
            ]);
        }

        return redirect()->route('admin.diet-preferences.index')->with('success', 'Diet Preference updated successfully.');
    }

    /**
     * Delete a diet preference.
     */
    public function destroy(DietPreference $dietPreference): RedirectResponse|JsonResponse
    {
        if ($dietPreference->category_image && Storage::disk('public')->exists($dietPreference->category_image)) {
            Storage::disk('public')->delete($dietPreference->category_image);
        }

        $dietPreference->delete();

        return redirect()->route('admin.diet-preferences.index')->with('success', 'Diet Preference deleted successfully.');
    }
}

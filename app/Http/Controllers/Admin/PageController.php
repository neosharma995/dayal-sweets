<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a listing of configurable dynamic pages.
     */
    public function index(Request $request): Response|JsonResponse
    {
        Page::getOrCreateContactUs();
        Page::getOrCreateGallery();
        $pages = Page::query()->where('slug', '!=', 'header-footer')->orderBy('id')->get();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $pages,
            ]);
        }

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
        ]);
    }

    /**
     * Show the editor for the Contact Us page.
     */
    public function contactUs(Request $request): Response|JsonResponse
    {
        $page = Page::getOrCreateContactUs();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $page,
            ]);
        }

        return Inertia::render('Admin/Pages/ContactUs', [
            'page' => $page,
        ]);
    }

    /**
     * Update the Contact Us page fields.
     */
    public function updateContactUs(Request $request): RedirectResponse|JsonResponse
    {
        $page = Page::getOrCreateContactUs();

        $validated = $request->validate([
            // Top Bar Section
            'top_bar_Heading' => ['required', 'string', 'max:255'],
            'top_bar_sub_heading' => ['nullable', 'string', 'max:255'],
            'top_bar_description' => ['nullable', 'string'],

            // Contact Information Section
            'emails' => ['nullable', 'array'],
            'emails.*' => ['required', 'string', 'email:rfc,filter'],

            'phones' => ['nullable', 'array'],
            'phones.*' => ['required', 'string', 'max:50'],

            'opening_hours' => ['nullable', 'string', 'max:255'],
        ], [
            'top_bar_Heading.required' => 'The heading title is required.',
            'emails.*.email' => 'Each email must be a valid email address.',
            'phones.*.required' => 'Each phone number is required.',
        ]);

        $sections = [
            'top_bar_Heading' => $validated['top_bar_Heading'],
            'top_bar_sub_heading' => $validated['top_bar_sub_heading'] ?? '',
            'top_bar_description' => $validated['top_bar_description'] ?? '',
            'emails' => array_values(array_filter($validated['emails'] ?? [], fn ($e) => ! empty(trim((string) $e)))),
            'phones' => array_values(array_filter($validated['phones'] ?? [], fn ($p) => ! empty(trim((string) $p)))),
            'opening_hours' => $validated['opening_hours'] ?? 'Mon-Sun ( 07:00 AM - 12:00 AM )',
        ];

        // Ensure at least one default if empty
        if (empty($sections['emails'])) {
            $sections['emails'] = ['info@dayalsweets.com'];
        }
        if (empty($sections['phones'])) {
            $sections['phones'] = ['+91 98765 43210'];
        }

        $page->update([
            'sections' => $sections,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Contact Us page content updated successfully.',
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->route('admin.pages.contact-us')->with('success', 'Contact Us page content updated successfully.');
    }

    /**
     * Show the editor for the Gallery page.
     */
    public function gallery(Request $request): Response|JsonResponse
    {
        $page = Page::getOrCreateGallery();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $page,
            ]);
        }

        return Inertia::render('Admin/Pages/Gallery', [
            'page' => $page,
        ]);
    }

    /**
     * Upload an image file for the gallery and return its public URL.
     */
    public function uploadGalleryImage(Request $request): JsonResponse
    {
        $request->validate([
            'image_file' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,avif', 'max:5120'],
        ]);

        $path = $request->file('image_file')->store('gallery', 'public');
        $url = '/storage/'.$path;

        return response()->json([
            'success' => true,
            'url' => $url,
            'message' => 'Image uploaded successfully.',
        ]);
    }

    /**
     * Update the Gallery page fields.
     */
    public function updateGallery(Request $request): RedirectResponse|JsonResponse
    {
        $page = Page::getOrCreateGallery();

        $validated = $request->validate([
            // Top Bar Section
            'top_bar_Heading' => ['required', 'string', 'max:255'],
            'top_bar_sub_heading' => ['nullable', 'string', 'max:255'],
            'top_bar_description' => ['nullable', 'string'],

            // Categories Section
            'categories' => ['nullable', 'array'],
            'categories.*.id' => ['nullable', 'string', 'max:100'],
            'categories.*.name' => ['required', 'string', 'max:100'],

            // Images Section
            'images' => ['nullable', 'array'],
            'images.*.name' => ['required', 'string', 'max:255'],
            'images.*.category' => ['required', 'string', 'max:100'],
            'images.*.image' => ['nullable', 'string'],
        ], [
            'top_bar_Heading.required' => 'The heading title is required.',
            'categories.*.name.required' => 'Category name is required.',
            'images.*.name.required' => 'Image name is required.',
            'images.*.category.required' => 'Please assign a category to each image.',
        ]);

        // Process categories
        $categories = [];
        foreach ($validated['categories'] ?? [] as $cat) {
            $name = trim($cat['name'] ?? '');
            if ($name === '') {
                continue;
            }
            $slug = ! empty($cat['id']) ? \Illuminate\Support\Str::slug($cat['id']) : \Illuminate\Support\Str::slug($name);
            $categories[] = [
                'id' => $slug,
                'name' => $name,
            ];
        }

        // Process images
        $images = [];
        $idCounter = 1;
        foreach ($validated['images'] ?? [] as $img) {
            $name = trim($img['name'] ?? '');
            $cat = trim($img['category'] ?? 'all');
            $imagePath = trim($img['image'] ?? '');
            if ($name === '' && $imagePath === '') {
                continue;
            }

            $images[] = [
                'id' => $img['id'] ?? $idCounter++,
                'name' => $name,
                'title' => $name,
                'category' => $cat,
                'categories' => ! empty($img['categories']) && is_array($img['categories']) ? $img['categories'] : [$cat],
                'image' => $imagePath ?: '/uploads/2026/08/Family-Dining.png',
            ];
        }

        $sections = [
            'top_bar_Heading' => $validated['top_bar_Heading'],
            'top_bar_sub_heading' => $validated['top_bar_sub_heading'] ?? '',
            'top_bar_description' => $validated['top_bar_description'] ?? '',
            'categories' => array_values($categories),
            'images' => array_values($images),
        ];

        $page->update([
            'sections' => $sections,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Gallery page content updated successfully.',
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->route('admin.pages.gallery')->with('success', 'Gallery page content updated successfully.');
    }
}


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

class HeaderFooterController extends Controller
{
    /**
     * Display the Header & Footer management screen.
     */
    public function index(Request $request): Response|JsonResponse
    {
        $page = Page::getOrCreateHeaderFooter();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $page,
            ]);
        }

        return Inertia::render('Admin/HeaderFooter/Index', [
            'settings' => $page->sections,
            'page' => $page,
        ]);
    }

    /**
     * Upload an image file for Header or Footer and return its public URL.
     */
    public function uploadImage(Request $request): JsonResponse
    {
        $request->validate([
            'image_file' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,avif', 'max:5120'],
        ]);

        $path = $request->file('image_file')->store('header-footer', 'public');
        $url = '/storage/'.$path;

        return response()->json([
            'success' => true,
            'url' => $url,
            'message' => 'Image uploaded successfully.',
        ]);
    }

    /**
     * Update the Header & Footer configuration.
     */
    public function update(Request $request): RedirectResponse|JsonResponse
    {
        $page = Page::getOrCreateHeaderFooter();

        $validated = $request->validate([
            // Header
            'header_logo' => ['nullable', 'string'],

            // Footer Bar
            'footer_bar' => ['nullable', 'array'],
            'footer_bar.sub_heading' => ['nullable', 'string', 'max:255'],
            'footer_bar.heading' => ['nullable', 'string', 'max:255'],
            'footer_bar.description' => ['nullable', 'string'],
            'footer_bar.phone_number' => ['nullable', 'string', 'max:50'],
            'footer_bar.image' => ['nullable', 'string'],
            'footer_bar.items' => ['nullable', 'array'],
            'footer_bar.items.*.heading' => ['nullable', 'string', 'max:255'],
            'footer_bar.items.*.para' => ['nullable', 'string'],
            'footer_bar.items.*.icon' => ['nullable', 'string'],

            // Footer Main
            'footer_logo' => ['nullable', 'string'],
            'footer_description' => ['nullable', 'string'],
            'certified_groups' => ['nullable', 'array'],
            'certified_groups.*' => ['nullable', 'string'],
            'social_links' => ['nullable', 'array'],
            'social_links.*.name' => ['nullable', 'string', 'max:100'],
            'social_links.*.link' => ['nullable', 'string', 'max:500'],
            'copyright_description' => ['nullable', 'string', 'max:255'],
        ]);

        // Clean items repeater
        $items = [];
        foreach ($validated['footer_bar']['items'] ?? [] as $item) {
            $h = trim((string) ($item['heading'] ?? ''));
            $p = trim((string) ($item['para'] ?? ''));
            if ($h === '' && $p === '') {
                continue;
            }
            $items[] = [
                'heading' => $h,
                'para' => $p,
                'icon' => $item['icon'] ?? 'Vector-3.svg',
            ];
        }

        // Clean social links repeater
        $socialLinks = [];
        foreach ($validated['social_links'] ?? [] as $social) {
            $name = trim((string) ($social['name'] ?? ''));
            $link = trim((string) ($social['link'] ?? ''));
            if ($name === '' && $link === '') {
                continue;
            }
            $socialLinks[] = [
                'name' => $name,
                'link' => $link,
            ];
        }

        // Clean certified groups array
        $certifiedGroups = array_values(array_filter(
            $validated['certified_groups'] ?? [],
            fn ($c) => ! empty(trim((string) $c))
        ));

        $sections = [
            'header_logo' => $validated['header_logo'] ?? '/uploads/2026/07/Frame-51-2-e1789985433447.png',
            'footer_bar' => [
                'sub_heading' => $validated['footer_bar']['sub_heading'] ?? '',
                'heading' => $validated['footer_bar']['heading'] ?? '',
                'description' => $validated['footer_bar']['description'] ?? '',
                'phone_number' => $validated['footer_bar']['phone_number'] ?? '',
                'image' => $validated['footer_bar']['image'] ?? '',
                'items' => $items,
            ],
            'footer_logo' => $validated['footer_logo'] ?? '/uploads/2026/07/Frame-51-1-1.png',
            'footer_description' => $validated['footer_description'] ?? '',
            'certified_groups' => $certifiedGroups,
            'social_links' => $socialLinks,
            'copyright_description' => $validated['copyright_description'] ?? '© 2026 Dayal Sweets. All rights reserved.',
        ];

        $page->update([
            'sections' => $sections,
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Header & Footer settings saved successfully.',
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->route('admin.header-footer.index')->with('success', 'Header & Footer settings saved successfully.');
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Display a listing of all configurable website pages and their SEO summary.
     */
    public function index(Request $request): Response|JsonResponse
    {
        Page::ensureAllWebsitePagesExist();

        $search = trim((string) $request->input('search', ''));
        $status = (string) $request->input('status', 'all');
        $perPage = (int) $request->input('per_page', 15);
        if ($perPage < 1 || $perPage > 100) {
            $perPage = 15;
        }

        $query = Page::query()->where('slug', '!=', 'header-footer')->orderBy('id');

        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        } elseif ($status === 'seo_ready') {
            $query->whereNotNull('meta_title')->where('meta_title', '!=', '')
                ->whereNotNull('meta_description')->where('meta_description', '!=', '');
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('meta_title', 'like', "%{$search}%")
                    ->orWhere('meta_description', 'like', "%{$search}%")
                    ->orWhere('meta_keywords', 'like', "%{$search}%");
            });
        }

        $allPagesQuery = Page::query()->where('slug', '!=', 'header-footer');
        $stats = [
            'total' => (clone $allPagesQuery)->count(),
            'active' => (clone $allPagesQuery)->where('is_active', true)->count(),
            'seo_configured' => (clone $allPagesQuery)
                ->whereNotNull('meta_title')
                ->where('meta_title', '!=', '')
                ->whereNotNull('meta_description')
                ->where('meta_description', '!=', '')
                ->count(),
            'indexed' => (clone $allPagesQuery)
                ->where(function ($q) {
                    $q->whereNull('robots')->orWhere('robots', 'not like', '%noindex%');
                })
                ->count(),
        ];

        $pages = $query->paginate($perPage)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $pages,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Pages/Index', [
            'pages' => $pages,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
                'page' => (int) $request->input('page', 1),
            ],
        ]);
    }

    /**
     * Display the dedicated Pages SEO Information management screen.
     */
    public function seo(Request $request): Response|JsonResponse
    {
        Page::ensureAllWebsitePagesExist();

        $search = trim((string) $request->input('search', ''));
        $robotsFilter = (string) $request->input('robots', 'all');
        $perPage = (int) $request->input('per_page', 15);
        if ($perPage < 1 || $perPage > 100) {
            $perPage = 15;
        }

        $query = Page::query()->where('slug', '!=', 'header-footer')->orderBy('id');

        if ($robotsFilter === 'indexed') {
            $query->where(function ($q) {
                $q->whereNull('robots')->orWhere('robots', 'not like', '%noindex%');
            });
        } elseif ($robotsFilter === 'noindex') {
            $query->where('robots', 'like', '%noindex%');
        }

        if ($search !== '') {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('slug', 'like', "%{$search}%")
                    ->orWhere('meta_title', 'like', "%{$search}%")
                    ->orWhere('meta_description', 'like', "%{$search}%")
                    ->orWhere('meta_keywords', 'like', "%{$search}%");
            });
        }

        $allPagesQuery = Page::query()->where('slug', '!=', 'header-footer');
        $stats = [
            'total_pages' => (clone $allPagesQuery)->count(),
            'meta_complete' => (clone $allPagesQuery)
                ->whereNotNull('meta_title')
                ->where('meta_title', '!=', '')
                ->whereNotNull('meta_description')
                ->where('meta_description', '!=', '')
                ->count(),
            'with_keywords' => (clone $allPagesQuery)
                ->whereNotNull('meta_keywords')
                ->where('meta_keywords', '!=', '')
                ->count(),
            'indexed_pages' => (clone $allPagesQuery)
                ->where(function ($q) {
                    $q->whereNull('robots')->orWhere('robots', 'not like', '%noindex%');
                })
                ->count(),
        ];

        $pages = $query->paginate($perPage)->withQueryString();

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $pages,
                'stats' => $stats,
            ]);
        }

        return Inertia::render('Admin/Pages/Seo', [
            'pages' => $pages,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'robots' => $robotsFilter,
                'per_page' => $perPage,
                'page' => (int) $request->input('page', 1),
            ],
        ]);
    }

    /**
     * Update SEO information for a specific page.
     */
    public function updateSeo(Request $request, Page $page): RedirectResponse|JsonResponse
    {
        $validated = $request->validate([
            'meta_title' => ['required', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'meta_keywords' => ['nullable', 'string', 'max:1000'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'robots' => ['nullable', 'string', 'max:100'],
        ]);

        $this->applySeoToPage($page, $validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "SEO information for '{$page->title}' updated successfully.",
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->back()->with('success', "SEO information for '{$page->title}' updated successfully.");
    }

    /**
     * Upload an Open Graph / SEO image file and return its public URL.
     */
    public function uploadSeoImage(Request $request): JsonResponse
    {
        $request->validate([
            'image_file' => ['required', 'image', 'mimes:jpeg,png,jpg,webp,avif', 'max:5120'],
        ]);

        $path = $request->file('image_file')->store('seo', 'public');
        $url = '/storage/'.$path;

        return response()->json([
            'success' => true,
            'url' => $url,
            'message' => 'SEO Open Graph image uploaded successfully.',
        ]);
    }

    /**
     * Show the editor for any website page by slug.
     */
    public function edit(Request $request, string $slug): Response|JsonResponse
    {
        if ($slug === 'contact-us') {
            return $this->contactUs($request);
        }
        if ($slug === 'gallery') {
            return $this->gallery($request);
        }

        $page = Page::getOrCreateBySlug($slug);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'data' => $page,
            ]);
        }

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    /**
     * Update a generic website page's content & SEO fields by slug.
     */
    public function update(Request $request, string $slug): RedirectResponse|JsonResponse
    {
        if ($slug === 'contact-us') {
            return $this->updateContactUs($request);
        }
        if ($slug === 'gallery') {
            return $this->updateGallery($request);
        }

        $page = Page::getOrCreateBySlug($slug);

        $validated = $request->validate([
            'title' => ['nullable', 'string', 'max:255'],
            'is_active' => ['nullable', 'boolean'],
            'top_bar_Heading' => ['required', 'string', 'max:255'],
            'top_bar_sub_heading' => ['nullable', 'string', 'max:255'],
            'top_bar_description' => ['nullable', 'string', 'max:2000'],

            // SEO Fields
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'meta_keywords' => ['nullable', 'string', 'max:1000'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'robots' => ['nullable', 'string', 'max:100'],
        ], [
            'top_bar_Heading.required' => 'The page heading / hero title is required.',
        ]);

        $sections = is_array($page->sections) ? $page->sections : [];
        $sections['top_bar_Heading'] = $validated['top_bar_Heading'];
        $sections['top_bar_sub_heading'] = $validated['top_bar_sub_heading'] ?? '';
        $sections['top_bar_description'] = $validated['top_bar_description'] ?? '';

        if (! empty($validated['title'])) {
            $page->title = trim($validated['title']);
        }
        if (isset($validated['is_active'])) {
            $page->is_active = (bool) $validated['is_active'];
        }

        $page->sections = $sections;
        $this->applySeoToPage($page, $validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "{$page->title} page content and SEO updated successfully.",
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->back()->with('success', "{$page->title} page content and SEO updated successfully.");
    }

    /**
     * Show the editor for the About Us page.
     */
    public function aboutUs(Request $request): Response|JsonResponse
    {
        return $this->edit($request, 'about-us');
    }

    /**
     * Update the About Us page fields and SEO.
     */
    public function updateAboutUs(Request $request): RedirectResponse|JsonResponse
    {
        return $this->update($request, 'about-us');
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
     * Update the Contact Us page fields and SEO information.
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

            // SEO Information Section
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'meta_keywords' => ['nullable', 'string', 'max:1000'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'robots' => ['nullable', 'string', 'max:100'],
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

        $page->sections = $sections;
        $this->applySeoToPage($page, $validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Contact Us page content and SEO updated successfully.',
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->back()->with('success', 'Contact Us page content and SEO updated successfully.');
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
     * Update the Gallery page fields and SEO information.
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

            // SEO Information Section
            'meta_title' => ['nullable', 'string', 'max:255'],
            'meta_description' => ['nullable', 'string', 'max:1000'],
            'meta_keywords' => ['nullable', 'string', 'max:1000'],
            'canonical_url' => ['nullable', 'string', 'max:255'],
            'og_title' => ['nullable', 'string', 'max:255'],
            'og_description' => ['nullable', 'string', 'max:1000'],
            'og_image' => ['nullable', 'string', 'max:500'],
            'robots' => ['nullable', 'string', 'max:100'],
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
            $slug = ! empty($cat['id']) ? Str::slug($cat['id']) : Str::slug($name);
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

        $page->sections = $sections;
        $this->applySeoToPage($page, $validated);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Gallery page content and SEO updated successfully.',
                'data' => $page->fresh(),
            ]);
        }

        return redirect()->back()->with('success', 'Gallery page content and SEO updated successfully.');
    }

    /**
     * Apply and persist SEO fields on a Page record.
     *
     * @param  array<string, mixed>  $data
     */
    protected function applySeoToPage(Page $page, array $data): void
    {
        if (array_key_exists('meta_title', $data)) {
            $page->meta_title = $data['meta_title'] ?: $page->meta_title;
        }
        if (array_key_exists('meta_description', $data)) {
            $page->meta_description = $data['meta_description'] ?? $page->meta_description;
        }
        if (array_key_exists('meta_keywords', $data)) {
            $page->meta_keywords = $data['meta_keywords'] ?? null;
        }
        if (array_key_exists('canonical_url', $data)) {
            $page->canonical_url = $data['canonical_url'] ?? null;
        }
        if (array_key_exists('og_title', $data)) {
            $page->og_title = $data['og_title'] ?? null;
        }
        if (array_key_exists('og_description', $data)) {
            $page->og_description = $data['og_description'] ?? null;
        }
        if (array_key_exists('og_image', $data)) {
            $page->og_image = $data['og_image'] ?? null;
        }
        if (array_key_exists('robots', $data)) {
            $page->robots = ! empty($data['robots']) ? $data['robots'] : 'index, follow';
        }

        $sections = is_array($page->sections) ? $page->sections : [];
        $sections['seo'] = [
            'meta_title' => $page->meta_title,
            'meta_description' => $page->meta_description,
            'meta_keywords' => $page->meta_keywords,
            'canonical_url' => $page->canonical_url,
            'og_title' => $page->og_title,
            'og_description' => $page->og_description,
            'og_image' => $page->og_image,
            'robots' => $page->robots ?: 'index, follow',
        ];
        $page->sections = $sections;
        $page->save();
    }
}

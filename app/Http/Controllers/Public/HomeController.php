<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\ContactQuery;
use App\Models\DietPreference;
use App\Models\Occasion;
use App\Models\Page;
use App\Models\Product;
use App\Models\SeasonalMithai;
use Illuminate\Foundation\Application;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public Dayal Sweets storefront landing page.
     */
    public function index(): Response
    {
        $products = Product::with(['category', 'variations'])
            ->latest('id')
            ->get()
            ->map(function (Product $product) {
                $hasVariations = $product->variations->isNotEmpty();
                $minPrice = $product->min_price ?? (float) ($product->product_selling_price ?? $product->product_price ?? 0);

                $price = $hasVariations
                    ? 'From ₹'.number_format((float) $minPrice, 2)
                    : (float) ($product->product_selling_price ?? $product->product_price ?? 0);

                $image = $product->product_image;
                if ($image && ! str_starts_with($image, 'http') && ! str_starts_with($image, '/')) {
                    $image = '/storage/'.$image;
                }
                if (! $image) {
                    $image = '/uploads/2026/07/kaaju-katli.png';
                }

                $catName = $product->category?->category_name ?? 'Sweets';
                $catSlug = $product->category?->category_slug ?? Str::slug($catName);

                $variations = $product->variations->map(fn ($v) => [
                    'id' => $v->id,
                    'label' => $v->variation_name,
                    'price' => (float) ($v->selling_price ?? $v->price ?? 0),
                ])->values()->all();

                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'category' => strtoupper($catName),
                    'categorySlug' => $catSlug,
                    'slug' => Str::slug($product->product_name),
                    'badge' => 'BEST SELLER',
                    'description' => $product->product_description,
                    'image' => $image,
                    'price' => $price,
                    'rating' => (float) ($product->rating ?? 4.9),
                    'ratingCount' => (int) ($product->rating_count ?? 12),
                    'variations' => $variations,
                ];
            });

        $categories = Category::orderBy('category_name')
            ->get()
            ->map(fn (Category $cat) => [
                'id' => $cat->id,
                'name' => $cat->category_name,
                'slug' => $cat->category_slug ?? Str::slug($cat->category_name),
                'image' => $cat->category_image,
                'description' => $cat->category_description,
            ]);

        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    /**
     * Display the Dayal Sweets About Us page.
     */
    public function about(): Response
    {
        return Inertia::render('About', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Contact Us page.
     */
    public function contact(): Response
    {
        return Inertia::render('ContactUs', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'page' => Page::getOrCreateContactUs(),
        ]);
    }

    /**
     * Handle public Contact Us form submission.
     */
    public function submitContact(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'regex:/^[0-9]{10}$/'],
            'email' => ['required', 'email', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'requirements' => ['required', 'string', 'max:5000'],
        ], [
            'name.required' => 'Please enter your name.',
            'phone.required' => 'Please enter your mobile number.',
            'phone.regex' => 'The mobile number must be exactly 10 digits (e.g. 9999999999).',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'subject.required' => 'Please enter a subject.',
            'requirements.required' => 'Please tell us about your requirements.',
        ]);

        $query = ContactQuery::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'email' => $validated['email'],
            'subject' => $validated['subject'],
            'requirements' => $validated['requirements'],
            'message' => $validated['requirements'],
            'status' => 'unread',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Thank you! Your message has been received. Our team will contact you shortly.',
                'data' => $query,
            ]);
        }

        return back()->with('success', 'Thank you! Your message has been received. Our team will contact you shortly.');
    }

    /**
     * Display the Dayal Sweets Shop page with dynamic products from the database.
     */
    public function shop(): Response
    {
        $products = Product::with(['category', 'variations', 'seasonalMithai', 'occasion', 'dietPreference', 'tag', 'tags'])
            ->latest('id')
            ->get()
            ->map(function (Product $product) {
                $hasVariations = $product->variations->isNotEmpty();
                $minPrice = $product->min_price ?? (float) ($product->product_selling_price ?? $product->product_price ?? 0);

                $price = $hasVariations
                    ? 'From ₹'.number_format((float) $minPrice, 2)
                    : (float) ($product->product_selling_price ?? $product->product_price ?? 0);

                $image = $product->product_image;
                if ($image && ! str_starts_with($image, 'http') && ! str_starts_with($image, '/')) {
                    $image = '/storage/'.$image;
                }
                if (! $image) {
                    $image = '/uploads/2026/07/kaaju-katli.png';
                }

                $catName = $product->category?->category_name ?? 'Sweets';
                $catSlug = $product->category?->category_slug ?? Str::slug($catName);

                $variations = $product->variations->map(fn ($v) => [
                    'id' => $v->id,
                    'label' => $v->variation_name,
                    'price' => (float) ($v->selling_price ?? $v->price ?? 0),
                ])->values()->all();

                $seasonalName = $product->seasonalMithai?->category_name;
                $occasionName = $product->occasion?->category_name;
                $dietName = $product->dietPreference?->category_name;
                $tagNames = $product->tags->pluck('product_tag_name')->values()->all();

                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'category' => strtoupper($catName),
                    'categorySlug' => $catSlug,
                    'slug' => Str::slug($product->product_name),
                    'badge' => strtoupper($catName),
                    'description' => $product->product_description,
                    'image' => $image,
                    'price' => $price,
                    'min_price' => (float) $minPrice,
                    'max_price' => (float) ($product->max_price ?? $minPrice),
                    'rating' => 4.9,
                    'ratingCount' => 24,
                    'seasonal' => $seasonalName,
                    'seasonalSlug' => $product->seasonalMithai?->category_slug,
                    'occasion' => $occasionName,
                    'occasionSlug' => $product->occasion?->category_slug,
                    'diet' => $dietName ?? 'Vegetarian',
                    'dietSlug' => $product->dietPreference?->category_slug,
                    'primaryTag' => $product->tag?->product_tag_name,
                    'tags' => array_values(array_unique(array_filter(array_merge([$catName, $seasonalName, $occasionName, $dietName], $tagNames)))),
                    'variations' => $variations,
                ];
            });

        $categories = Category::withCount('products')
            ->orderBy('category_name')
            ->get()
            ->map(fn (Category $cat) => [
                'id' => $cat->id,
                'name' => $cat->category_name,
                'slug' => $cat->category_slug ?? Str::slug($cat->category_name),
                'count' => $cat->products_count,
            ]);

        $seasonalTags = SeasonalMithai::orderBy('id')
            ->get()
            ->map(fn (SeasonalMithai $item) => [
                'id' => $item->id,
                'name' => $item->category_name,
                'slug' => $item->category_slug,
            ]);

        $occasionTags = Occasion::orderBy('id')
            ->get()
            ->map(fn (Occasion $item) => [
                'id' => $item->id,
                'name' => $item->category_name,
                'slug' => $item->category_slug,
            ]);

        $dietTags = DietPreference::orderBy('id')
            ->get()
            ->map(fn (DietPreference $item) => [
                'id' => $item->id,
                'name' => $item->category_name,
                'slug' => $item->category_slug,
            ]);

        return Inertia::render('Shop', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'products' => $products,
            'categories' => $categories,
            'seasonalTags' => $seasonalTags,
            'occasionTags' => $occasionTags,
            'dietTags' => $dietTags,
        ]);
    }

    /**
     * Display the Dayal Sweets Cart page.
     */
    public function cart(): Response
    {
        return Inertia::render('Cart', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Checkout page.
     */
    public function checkout(): Response
    {
        return Inertia::render('Checkout', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'razorpayKey' => config('services.razorpay.key', env('RAZORPAY_API_KEY', '')),
        ]);
    }

    /**
     * Display the Dayal Sweets Gallery page.
     */
    public function gallery(): Response
    {
        return Inertia::render('Gallery', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'page' => Page::getOrCreateGallery(),
        ]);
    }

    /**
     * Display the Dayal Sweets Gifting page.
     */
    public function gifting(): Response
    {
        return Inertia::render('Gifting', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Dining page.
     */
    public function dining(): Response
    {
        return Inertia::render('Dining', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Privacy Policy page.
     */
    public function privacyPolicy(): Response
    {
        return Inertia::render('PrivacyPolicy', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Refund and Returns Policy page.
     */
    public function refundReturns(): Response
    {
        return Inertia::render('RefundReturns', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Franchise page.
     */
    public function franchise(): Response
    {
        return Inertia::render('Franchise', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Single Product page.
     */
    public function product(?string $slug = 'office-tea-combo'): Response
    {
        $cleanSlug = $slug ? trim($slug, '/') : 'office-tea-combo';

        $dbProduct = null;
        $formattedName = str_replace('-', ' ', $cleanSlug);
        $found = Product::with(['category', 'variations.attributeValue'])
            ->where(function ($query) use ($formattedName, $cleanSlug) {
                $query->where('product_name', 'like', $formattedName)
                    ->orWhere('product_name', 'like', '%'.$formattedName.'%')
                    ->orWhereRaw('LOWER(product_name) = ?', [strtolower($formattedName)]);
                if (is_numeric($cleanSlug)) {
                    $query->orWhere('id', (int) $cleanSlug);
                }
            })
            ->first();

        if ($found) {
            $image = $found->product_image ?: $found->product_image_url;
            $galleries = ! empty($found->product_gallaries) ? $found->product_gallaries : ($found->product_gallaries_urls ?: []);
            if ($image && ! in_array($image, $galleries, true)) {
                array_unshift($galleries, $image);
            }

            $variations = $found->variations->map(fn ($v) => [
                'label' => $v->variation_name ?: ($v->attributeValue?->value ?? ($v->weight_value ? "{$v->weight_value}{$v->weight_unit}" : 'Standard')),
                'price' => (float) ($v->selling_price ?: $v->price ?: 0),
            ])->values()->toArray();

            $basePrice = (float) ($found->product_selling_price ?: $found->product_price ?: ($variations[0]['price'] ?? 150));
            $originalPrice = $found->product_price && (float) $found->product_price > $basePrice ? (float) $found->product_price : null;

            $catName = $found->category?->category_name;
            if (! $catName || strcasecmp($catName, 'uncategorized') === 0) {
                if (stripos($found->product_name, 'hamper') !== false) {
                    $catName = 'Gift hampers';
                } elseif (stripos($found->product_name, 'namkeen') !== false || stripos($found->product_name, 'mixture') !== false) {
                    $catName = 'Namkeen';
                } elseif (stripos($found->product_name, 'brownie') !== false || stripos($found->product_name, 'cake') !== false) {
                    $catName = 'Bakery';
                } elseif (stripos($found->product_name, 'combo') !== false) {
                    $catName = 'Combo';
                } else {
                    $catName = 'Sweets';
                }
            }
            $catSlug = $found->category?->category_slug ?? Str::slug($catName);

            $dbProduct = [
                'id' => $found->id,
                'name' => $found->product_name,
                'category' => strtoupper($catName),
                'categorySlug' => $catSlug,
                'slug' => $cleanSlug,
                'description' => $found->product_description,
                'fullDescription' => $found->product_description,
                'image' => $image,
                'gallery' => $galleries,
                'price' => $basePrice,
                'originalPrice' => $originalPrice,
                'inStock' => ($found->total_stock ?? $found->product_qty ?? 1) > 0,
                'variations' => $variations,
            ];
        }

        return Inertia::render('Product/Show', [
            'slug' => $cleanSlug,
            'product' => $dbProduct,
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}

<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\DietPreference;
use App\Models\Occasion;
use App\Models\Product;
use App\Models\SeasonalMithai;
use Illuminate\Foundation\Application;
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
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
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
        ]);
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

            $dbProduct = [
                'id' => $found->id,
                'name' => $found->product_name,
                'category' => strtoupper($found->category?->category_name ?? 'UNCATEGORIZED'),
                'categorySlug' => $found->category?->category_slug ?? 'uncategorized',
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

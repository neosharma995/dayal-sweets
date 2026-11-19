<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Page extends Model
{
    use HasFactory;

    protected $fillable = [
        'slug',
        'title',
        'sections',
        'is_active',
        'meta_title',
        'meta_description',
        'meta_keywords',
        'canonical_url',
        'og_title',
        'og_description',
        'og_image',
        'robots',
    ];

    protected $casts = [
        'sections' => 'array',
        'is_active' => 'boolean',
    ];

    /**
     * Default data for Contact Us page.
     * Contains only the exact dynamic fields requested:
     * - Top Bar: top_bar_Heading, top_bar_sub_heading, top_bar_description
     * - Contact Information: emails[], phones[], opening_hours
     */
    public static function getContactUsDefaults(): array
    {
        return [
            'top_bar_Heading' => 'CONTACT US',
            'top_bar_sub_heading' => "We'd Love to Hear From You!",
            'top_bar_description' => "Have a query, feedback, or a special request? We're here to help and make your experience with Dayal Sweets even better.",
            'emails' => ['info@dayalsweets.com'],
            'phones' => ['+91 98765 43210'],
            'opening_hours' => 'Mon-Sun ( 07:00 AM - 12:00 AM )',
        ];
    }

    /**
     * Find or create the Contact Us page record with defaults.
     */
    public static function getOrCreateContactUs(): self
    {
        $page = static::firstOrCreate(
            ['slug' => 'contact-us'],
            [
                'title' => 'Contact Us',
                'sections' => static::getContactUsDefaults(),
                'is_active' => true,
                'meta_title' => 'Contact Us - Dayal Sweets',
                'meta_description' => "We'd Love to Hear From You! Have a query, feedback, or a special request? Contact Dayal Sweets.",
            ]
        );

        // Migrate older structure if present so it always conforms to the simple keys
        $sections = $page->sections ?? [];
        if (! isset($sections['top_bar_Heading']) && isset($sections['top_bar']['title'])) {
            $sections['top_bar_Heading'] = $sections['top_bar']['title'];
            $sections['top_bar_sub_heading'] = $sections['top_bar']['subtitle'] ?? '';
            $sections['top_bar_description'] = $sections['top_bar']['description'] ?? '';
        }
        if (! isset($sections['emails']) && isset($sections['contact_info']['emails'])) {
            $sections['emails'] = array_map(function ($item) {
                return is_array($item) ? ($item['email'] ?? '') : (string) $item;
            }, $sections['contact_info']['emails']);
        }
        if (! isset($sections['phones']) && isset($sections['contact_info']['phones'])) {
            $sections['phones'] = array_map(function ($item) {
                return is_array($item) ? ($item['phone'] ?? '') : (string) $item;
            }, $sections['contact_info']['phones']);
        }
        if (! isset($sections['opening_hours']) && isset($sections['contact_info']['hours'][0])) {
            $h = $sections['contact_info']['hours'][0];
            $sections['opening_hours'] = is_array($h) ? "{$h['days']} ( {$h['time']} )" : (string) $h;
        }

        // Fill defaults if empty
        $defaults = static::getContactUsDefaults();
        foreach ($defaults as $k => $v) {
            if (! isset($sections[$k])) {
                $sections[$k] = $v;
            }
        }

        $page->sections = $sections;
        $page->save();

        return $page;
    }

    /**
     * Default data for Header & Footer settings.
     * Contains:
     * - Header: header_logo
     * - Footer Bar: sub_heading, heading, description, phone_number, image, items [heading, para]
     * - Footer: footer_logo, footer_description, certified_groups, social_links [name, link], copyright_description
     */
    public static function getHeaderFooterDefaults(): array
    {
        return [
            // Header Settings
            'header_logo' => '/uploads/2026/07/Frame-51-2-e1789985433447.png',

            // Footer Bar / CTA Section
            'footer_bar' => [
                'sub_heading' => 'craving something sweet',
                'heading' => 'Order your favorites Anytime, Anywhere',
                'description' => "From our kitchen to your doorstep,\nwe make every order special.",
                'phone_number' => '+91 98765 43210',
                'image' => '/uploads/2026/07/25a75be7cdf9333748b57b1e795b01d57a04548a.webp',
                'items' => [
                    ['heading' => '100% SECURE', 'para' => 'Safe & Secure Payments', 'icon' => 'Vector-3.svg'],
                    ['heading' => 'LIVE TRACKING', 'para' => 'Real-time Updates', 'icon' => 'Icon-1.svg'],
                    ['heading' => 'FAST DELIVERY', 'para' => 'On Time, Every Time', 'icon' => 'Icon-2.svg'],
                    ['heading' => 'PREMIUM QUALITY', 'para' => 'Handcrafted with Love & Purity', 'icon' => 'Vector-4.svg'],
                ],
            ],

            // Footer Main Settings
            'footer_logo' => '/uploads/2026/07/Frame-51-1-1.png',
            'footer_description' => "Crafting India's most loved sweet moments since 1962. Pure ingredients, authentic recipes, and a legacy of taste.",
            'certified_groups' => [
                '/uploads/2026/07/kindpng_2513820-1.png',
                '/uploads/2026/07/Asset-1-2-1.png',
            ],
            'social_links' => [
                ['name' => 'Instagram', 'link' => 'https://www.instagram.com/dayalsweets/'],
                ['name' => 'Facebook', 'link' => 'https://www.facebook.com/dayalsweets/'],
                ['name' => 'YouTube', 'link' => 'https://www.youtube.com/results?search_query=Dayal+Sweets'],
            ],
            'copyright_description' => '© 2026 Dayal Sweets. All rights reserved.',
        ];
    }

    /**
     * Find or create the Header & Footer page record with defaults.
     */
    public static function getOrCreateHeaderFooter(): self
    {
        $page = static::firstOrCreate(
            ['slug' => 'header-footer'],
            [
                'title' => 'Header & Footer',
                'sections' => static::getHeaderFooterDefaults(),
                'is_active' => true,
                'meta_title' => 'Header & Footer Settings - Dayal Sweets',
                'meta_description' => 'Manage Header Logo, Footer Bar CTA, Footer Logo, Bio, Certificates, Social Links and Copyright.',
            ]
        );

        $sections = $page->sections ?? [];
        $defaults = static::getHeaderFooterDefaults();

        // Ensure all required default keys exist
        $dirty = false;
        foreach ($defaults as $key => $value) {
            if (! isset($sections[$key])) {
                $sections[$key] = $value;
                $dirty = true;
            }
        }

        // Auto-update social links if they still point to generic root URLs
        if (isset($sections['social_links']) && is_array($sections['social_links'])) {
            foreach ($sections['social_links'] as &$sLink) {
                if (($sLink['name'] ?? '') === 'Instagram' && ($sLink['link'] === 'https://www.instagram.com/' || empty($sLink['link']))) {
                    $sLink['link'] = 'https://www.instagram.com/dayalsweets/';
                    $dirty = true;
                }
                if (($sLink['name'] ?? '') === 'Facebook' && ($sLink['link'] === 'https://www.facebook.com/' || empty($sLink['link']))) {
                    $sLink['link'] = 'https://www.facebook.com/dayalsweets/';
                    $dirty = true;
                }
                if (($sLink['name'] ?? '') === 'YouTube' && ($sLink['link'] === 'https://www.youtube.com/' || empty($sLink['link']))) {
                    $sLink['link'] = 'https://www.youtube.com/results?search_query=Dayal+Sweets';
                    $dirty = true;
                }
            }
            unset($sLink);
        }

        if ($dirty) {
            $page->sections = $sections;
            $page->save();
        }

        return $page;
    }

    /**
     * Default data for Gallery page.
     * Contains:
     * - Top Bar: top_bar_Heading, top_bar_sub_heading, top_bar_description
     * - Categories: gallery categories with id and name
     * - Images: gallery items with id, name, image, and category
     */
    public static function getGalleryDefaults(): array
    {
        return [
            'top_bar_Heading' => 'OUR GALLERY',
            'top_bar_sub_heading' => 'Every Picture Tells a Sweet Story',
            'top_bar_description' => 'Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs.',
            'categories' => [
                ['id' => 'corporate', 'name' => 'Corporate'],
                ['id' => 'customers', 'name' => 'Customers'],
                ['id' => 'dining', 'name' => 'Dining'],
                ['id' => 'events', 'name' => 'Events'],
                ['id' => 'festival', 'name' => 'Festival'],
                ['id' => 'food', 'name' => 'Food'],
                ['id' => 'kitchen', 'name' => 'Kitchen'],
                ['id' => 'restaurant', 'name' => 'Restaurant'],
                ['id' => 'snacks', 'name' => 'Snacks'],
                ['id' => 'sweets', 'name' => 'Sweets'],
            ],
            'images' => [
                [
                    'id' => 1,
                    'name' => 'Family Dining',
                    'image' => '/uploads/2026/08/Family-Dining.png',
                    'category' => 'dining',
                ],
                [
                    'id' => 2,
                    'name' => 'Private Dining',
                    'image' => '/uploads/2026/08/Private-Dining.png',
                    'category' => 'dining',
                ],
                [
                    'id' => 3,
                    'name' => 'Live Kitchen',
                    'image' => '/uploads/2026/08/Live-Kitchen.png',
                    'category' => 'dining',
                    'categories' => ['dining', 'kitchen', 'restaurant'],
                ],
                [
                    'id' => 4,
                    'name' => 'Corporate Dining',
                    'image' => '/uploads/2026/08/Corporate-Dining.png',
                    'category' => 'dining',
                    'categories' => ['dining', 'corporate'],
                ],
                [
                    'id' => 5,
                    'name' => 'Outdoor Seating',
                    'image' => '/uploads/2026/08/Outdoor-Seating.png',
                    'category' => 'dining',
                ],
                [
                    'id' => 6,
                    'name' => 'Diwali',
                    'image' => '/uploads/2026/08/Diwali-Collection.jpg',
                    'category' => 'festival',
                ],
                [
                    'id' => 7,
                    'name' => 'Holi',
                    'image' => '/uploads/2026/08/Holi.png',
                    'category' => 'festival',
                ],
                [
                    'id' => 8,
                    'name' => 'Raksha Bandhan',
                    'image' => '/uploads/2026/08/Raksha-Bandhan.jpg',
                    'category' => 'festival',
                ],
                [
                    'id' => 9,
                    'name' => 'Christmas',
                    'image' => '/uploads/2026/08/Christmas.jpg',
                    'category' => 'festival',
                ],
                [
                    'id' => 10,
                    'name' => 'Navratri',
                    'image' => '/uploads/2026/08/Navratri.jpg',
                    'category' => 'festival',
                ],
                [
                    'id' => 11,
                    'name' => 'Marwadi ladoo',
                    'image' => '/uploads/2026/07/Marwadi-ladoo.avif',
                    'category' => 'sweets',
                ],
                [
                    'id' => 12,
                    'name' => 'Kaju Katli',
                    'image' => '/uploads/2026/07/thaal.png',
                    'category' => 'sweets',
                ],
                [
                    'id' => 13,
                    'name' => 'Himachali Special',
                    'image' => '/uploads/2026/08/Himachali-Special-1.png',
                    'category' => 'food',
                ],
                [
                    'id' => 14,
                    'name' => 'North Indian',
                    'image' => '/uploads/2026/08/North-Indian-1.png',
                    'category' => 'food',
                ],
                [
                    'id' => 15,
                    'name' => 'Snacks',
                    'image' => '/uploads/2026/08/Snacks-Collection.png',
                    'category' => 'snacks',
                ],
                [
                    'id' => 16,
                    'name' => 'Veg Patty',
                    'image' => '/uploads/2026/07/Veg-Patty-1-scaled.jpg',
                    'category' => 'snacks',
                ],
                [
                    'id' => 17,
                    'name' => 'Planning a Large Celebration',
                    'image' => '/uploads/2026/08/Planning-a-Large-Celebration.png',
                    'category' => 'events',
                ],
                [
                    'id' => 18,
                    'name' => 'Kitchen Preparation',
                    'image' => '/uploads/2026/08/Kitchen.png',
                    'category' => 'kitchen',
                ],
                [
                    'id' => 19,
                    'name' => 'Restaurant Ambience',
                    'image' => '/uploads/2026/08/Book-Your-Table.png',
                    'category' => 'restaurant',
                ],
                [
                    'id' => 20,
                    'name' => 'Gift Hamper',
                    'image' => '/uploads/2026/08/Gift-Hamper-img.png',
                    'category' => 'customers',
                ],
            ],
        ];
    }

    /**
     * Find or create the Gallery page record with defaults.
     */
    public static function getOrCreateGallery(): self
    {
        return static::firstOrCreate(
            ['slug' => 'gallery'],
            [
                'title' => 'Gallery',
                'sections' => static::getGalleryDefaults(),
                'is_active' => true,
                'meta_title' => 'Our Gallery | Dayal Sweets',
                'meta_description' => 'Explore Dayal Sweets moments - Authentic Indian, Himachali, Chinese, South Indian, and fresh sweets crafted with love.',
                'meta_keywords' => 'Dayal Sweets gallery, sweet shop photos, dining ambience, festival hampers gallery',
                'robots' => 'index, follow',
            ]
        );
    }

    /**
     * Definitions for all public website pages and their default content & SEO.
     *
     * @return array<string, array<string, mixed>>
     */
    public static function getWebsitePageDefinitions(): array
    {
        return [
            'home' => [
                'title' => 'Home',
                'public_url' => '/',
                'sections' => [
                    'top_bar_Heading' => 'DAYAL SWEETS',
                    'top_bar_sub_heading' => "Crafting India's Most Loved Sweet Moments Since 1962",
                    'top_bar_description' => 'Order authentic handmade Indian sweets, pure desi ghee mithai, namkeen, bakery treats, and festive gift hampers online.',
                ],
                'meta_title' => 'Dayal Sweets | Authentic Indian Mithai, Snacks, Dining & Gifting Since 1962',
                'meta_description' => 'Order authentic handmade Indian sweets, pure desi ghee mithai, namkeen, bakery treats, and festive gift hampers online from Dayal Sweets.',
                'meta_keywords' => 'Dayal Sweets, Indian sweets online, desi ghee mithai, kaju katli, gift hampers, restaurant dining',
                'og_title' => 'Dayal Sweets | Authentic Indian Mithai & Dining Since 1962',
                'og_description' => 'Order authentic handmade Indian sweets, pure desi ghee mithai, namkeen, bakery treats, and festive gift hampers online from Dayal Sweets.',
                'og_image' => '/uploads/2026/08/Hero-Banner.png',
                'robots' => 'index, follow',
            ],
            'shop' => [
                'title' => 'Shop',
                'public_url' => '/shop',
                'sections' => [
                    'top_bar_Heading' => 'OUR SWEET SHOP',
                    'top_bar_sub_heading' => 'Freshly Handcrafted Mithai, Namkeen & Bakery',
                    'top_bar_description' => 'Explore our signature collection of pure desi ghee sweets, savory namkeen, festive hampers, and combos delivered fresh to your doorstep.',
                ],
                'meta_title' => 'Shop Authentic Sweets, Namkeen & Gift Boxes | Dayal Sweets',
                'meta_description' => 'Browse and order fresh handmade Indian sweets, namkeen, dry fruits, bakery items, and festive combos online with fast delivery from Dayal Sweets.',
                'meta_keywords' => 'buy sweets online, Dayal Sweets shop, mithai catalog, order sweets, Indian namkeen, festive combos',
                'og_title' => 'Shop Authentic Sweets, Namkeen & Gift Boxes | Dayal Sweets',
                'og_description' => 'Browse and order fresh handmade Indian sweets, namkeen, dry fruits, bakery items, and festive combos online.',
                'og_image' => '/uploads/2026/07/thaal.png',
                'robots' => 'index, follow',
            ],
            'about-us' => [
                'title' => 'About Us',
                'public_url' => '/about-us',
                'sections' => [
                    'top_bar_Heading' => 'ABOUT DAYAL',
                    'top_bar_sub_heading' => 'Crafting Sweet Traditions Since 1962',
                    'top_bar_description' => 'Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity.',
                ],
                'meta_title' => 'About Us | Dayal Sweets - Crafting Sweet Traditions Since 1962',
                'meta_description' => 'Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity. Crafting sweet traditions since 1962.',
                'meta_keywords' => 'About Dayal Sweets, Dayal Sweets history, Indian sweet shop legacy, pure desi ghee mithai since 1962',
                'og_title' => 'About Us | Dayal Sweets',
                'og_description' => 'Over six decades of crafting authentic Indian sweets with premium ingredients, age-old recipes and a promise of purity.',
                'og_image' => '/uploads/2026/08/Family-Dining.png',
                'robots' => 'index, follow',
            ],
            'contact-us' => [
                'title' => 'Contact Us',
                'public_url' => '/contact-us',
                'sections' => static::getContactUsDefaults(),
                'meta_title' => 'Contact Us - Dayal Sweets',
                'meta_description' => "We'd Love to Hear From You! Have a query, feedback, or a special request? Contact Dayal Sweets.",
                'meta_keywords' => 'Contact Dayal Sweets, Dayal Sweets phone number, Dayal Sweets email, store outlets contact',
                'og_title' => 'Contact Us - Dayal Sweets',
                'og_description' => "We'd Love to Hear From You! Have a query, feedback, or a special request? Contact Dayal Sweets.",
                'og_image' => '/uploads/2026/08/Book-Your-Table.png',
                'robots' => 'index, follow',
            ],
            'gallery' => [
                'title' => 'Gallery',
                'public_url' => '/gallery',
                'sections' => static::getGalleryDefaults(),
                'meta_title' => 'Our Gallery | Dayal Sweets',
                'meta_description' => 'Explore Dayal Sweets moments - Authentic Indian, Himachali, Chinese, South Indian, and fresh sweets crafted with love.',
                'meta_keywords' => 'Dayal Sweets gallery, sweet shop photos, dining ambience, festival hampers gallery',
                'og_title' => 'Our Gallery | Dayal Sweets',
                'og_description' => 'Explore Dayal Sweets moments - Authentic Indian, Himachali, Chinese, South Indian, and fresh sweets crafted with love.',
                'og_image' => '/uploads/2026/08/Family-Dining.png',
                'robots' => 'index, follow',
            ],
            'gifting' => [
                'title' => 'Gifting',
                'public_url' => '/gifting',
                'sections' => [
                    'top_bar_Heading' => 'GIFTING',
                    'top_bar_sub_heading' => 'Make Every Occasion Unforgettable',
                    'top_bar_description' => 'Share the joy of every celebration with beautifully crafted mithai boxes, luxury hampers, dry fruit collections, and personalized gifting experiences.',
                ],
                'meta_title' => 'Gifting | Dayal Sweets - Luxury Hampers & Festive Sweet Boxes',
                'meta_description' => 'Share the joy of every celebration with beautifully crafted mithai boxes, luxury hampers, dry fruit collections, and personalized gifting experiences from Dayal Sweets.',
                'meta_keywords' => 'corporate gifting sweets, wedding mithai boxes, Diwali gift hampers, Dayal Sweets gifting',
                'og_title' => 'Gifting | Dayal Sweets',
                'og_description' => 'Share the joy of every celebration with beautifully crafted mithai boxes, luxury hampers, dry fruit collections, and personalized gifting experiences.',
                'og_image' => '/uploads/2026/08/Gift-Hamper-img.png',
                'robots' => 'index, follow',
            ],
            'dining' => [
                'title' => 'Dining',
                'public_url' => '/dining',
                'sections' => [
                    'top_bar_Heading' => 'DINING',
                    'top_bar_sub_heading' => 'Where Flavors Meet Warm Hospitality',
                    'top_bar_description' => 'Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs.',
                ],
                'meta_title' => 'Dining | Dayal Sweets - Family Restaurant & Table Reservations',
                'meta_description' => 'Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs at Dayal Sweets.',
                'meta_keywords' => 'Dayal Sweets dining, family restaurant, book a table, QR table ordering, Himachali food',
                'og_title' => 'Dining | Dayal Sweets',
                'og_description' => 'Enjoy authentic Indian, Himachali, Chinese, South Indian, and Fast Food prepared fresh every day by our experienced chefs.',
                'og_image' => '/uploads/2026/08/Book-Your-Table.png',
                'robots' => 'index, follow',
            ],
            'franchise' => [
                'title' => 'Franchise',
                'public_url' => '/franchise',
                'sections' => [
                    'top_bar_Heading' => 'FRANCHISE',
                    'top_bar_sub_heading' => 'Grow With a Trusted Legacy',
                    'top_bar_description' => 'Partner with Dayal Sweets and bring our rich culinary heritage and premium sweets to your city.',
                ],
                'meta_title' => 'Franchise | Dayal Sweets - Partner With Our Trusted Legacy',
                'meta_description' => 'Partner with Dayal Sweets and bring our rich culinary heritage and premium sweets to your city. High returns, end-to-end support, and a trusted legacy.',
                'meta_keywords' => 'Dayal Sweets franchise, sweet shop franchise India, restaurant franchise opportunity',
                'og_title' => 'Franchise | Dayal Sweets',
                'og_description' => 'Partner with Dayal Sweets and bring our rich culinary heritage and premium sweets to your city.',
                'og_image' => '/uploads/2026/08/Corporate-Dining.png',
                'robots' => 'index, follow',
            ],
            'testimonials' => [
                'title' => 'Testimonials',
                'public_url' => '/testimonials',
                'sections' => [
                    'top_bar_Heading' => 'TESTIMONIALS',
                    'top_bar_sub_heading' => 'Stories of Sweetness & Trust',
                    'top_bar_description' => 'Discover why generations of families trust Dayal Sweets for their everyday cravings and grandest celebrations.',
                ],
                'meta_title' => 'Customer Testimonials & Reviews | Dayal Sweets',
                'meta_description' => 'Read real customer reviews and testimonials about Dayal Sweets authentic mithai, dining hospitality, and festive gifting hampers.',
                'meta_keywords' => 'Dayal Sweets reviews, customer testimonials, sweet shop ratings',
                'og_title' => 'Customer Testimonials & Reviews | Dayal Sweets',
                'og_description' => 'Read real customer reviews and testimonials about Dayal Sweets authentic mithai, dining hospitality, and festive gifting.',
                'og_image' => '/uploads/2026/08/Family-Dining.png',
                'robots' => 'index, follow',
            ],
            'privacy-policy' => [
                'title' => 'Privacy Policy',
                'public_url' => '/privacy-policy',
                'sections' => [
                    'top_bar_Heading' => 'PRIVACY POLICY',
                    'top_bar_sub_heading' => 'Your Privacy Matters to Us',
                    'top_bar_description' => 'Learn how Dayal Sweets collects, uses and protects your personal information when you visit our website or use our services.',
                ],
                'meta_title' => 'Privacy Policy | Dayal Sweets',
                'meta_description' => 'Learn how Dayal Sweets collects, uses and protects your personal information when you visit our website or use our services.',
                'meta_keywords' => 'Dayal Sweets privacy policy, data protection, customer privacy',
                'og_title' => 'Privacy Policy | Dayal Sweets',
                'og_description' => 'Learn how Dayal Sweets collects, uses and protects your personal information when you visit our website or use our services.',
                'og_image' => '',
                'robots' => 'index, follow',
            ],
            'refund-returns' => [
                'title' => 'Refund & Returns Policy',
                'public_url' => '/refund-returns',
                'sections' => [
                    'top_bar_Heading' => 'REFUND & RETURNS',
                    'top_bar_sub_heading' => 'Your Satisfaction Matters to Us',
                    'top_bar_description' => 'Learn about our refund, cancellation and returns process for orders placed with Dayal Sweets.',
                ],
                'meta_title' => 'Refund and Returns Policy | Dayal Sweets',
                'meta_description' => 'Learn about our refund, cancellation and returns process for orders placed with Dayal Sweets.',
                'meta_keywords' => 'Dayal Sweets refund policy, return policy, order cancellation',
                'og_title' => 'Refund and Returns Policy | Dayal Sweets',
                'og_description' => 'Learn about our refund, cancellation and returns process for orders placed with Dayal Sweets.',
                'og_image' => '',
                'robots' => 'index, follow',
            ],
        ];
    }

    /**
     * Ensure all public website pages exist in the database with default content & SEO.
     */
    public static function ensureAllWebsitePagesExist(): void
    {
        static::getOrCreateContactUs();
        static::getOrCreateGallery();

        foreach (static::getWebsitePageDefinitions() as $slug => $def) {
            $page = static::firstOrCreate(
                ['slug' => $slug],
                [
                    'title' => $def['title'],
                    'sections' => $def['sections'],
                    'is_active' => true,
                    'meta_title' => $def['meta_title'],
                    'meta_description' => $def['meta_description'],
                    'meta_keywords' => $def['meta_keywords'] ?? null,
                    'og_title' => $def['og_title'] ?? $def['meta_title'],
                    'og_description' => $def['og_description'] ?? $def['meta_description'],
                    'og_image' => $def['og_image'] ?? null,
                    'robots' => $def['robots'] ?? 'index, follow',
                ]
            );

            // Backfill missing SEO fields on older existing records
            $dirty = false;
            if (empty($page->meta_title) && ! empty($def['meta_title'])) {
                $page->meta_title = $def['meta_title'];
                $dirty = true;
            }
            if (empty($page->meta_description) && ! empty($def['meta_description'])) {
                $page->meta_description = $def['meta_description'];
                $dirty = true;
            }
            if (empty($page->meta_keywords) && ! empty($def['meta_keywords'])) {
                $page->meta_keywords = $def['meta_keywords'];
                $dirty = true;
            }
            if (empty($page->og_title) && ! empty($def['og_title'])) {
                $page->og_title = $def['og_title'];
                $dirty = true;
            }
            if (empty($page->og_description) && ! empty($def['og_description'])) {
                $page->og_description = $def['og_description'];
                $dirty = true;
            }
            if (empty($page->robots)) {
                $page->robots = 'index, follow';
                $dirty = true;
            }

            if ($dirty) {
                $page->save();
            }
        }
    }

    /**
     * Find or create any website page by slug.
     */
    public static function getOrCreateBySlug(string $slug): self
    {
        if ($slug === 'contact-us') {
            return static::getOrCreateContactUs();
        }
        if ($slug === 'gallery') {
            return static::getOrCreateGallery();
        }
        if ($slug === 'header-footer') {
            return static::getOrCreateHeaderFooter();
        }

        $definitions = static::getWebsitePageDefinitions();
        $def = $definitions[$slug] ?? [
            'title' => ucwords(str_replace('-', ' ', $slug)),
            'sections' => [
                'top_bar_Heading' => strtoupper(str_replace('-', ' ', $slug)),
                'top_bar_sub_heading' => 'Dayal Sweets',
                'top_bar_description' => '',
            ],
            'meta_title' => ucwords(str_replace('-', ' ', $slug)).' | Dayal Sweets',
            'meta_description' => 'Dayal Sweets - Crafting Sweet Traditions Since 1962.',
            'meta_keywords' => 'Dayal Sweets',
            'robots' => 'index, follow',
        ];

        $page = static::firstOrCreate(
            ['slug' => $slug],
            [
                'title' => $def['title'],
                'sections' => $def['sections'],
                'is_active' => true,
                'meta_title' => $def['meta_title'],
                'meta_description' => $def['meta_description'],
                'meta_keywords' => $def['meta_keywords'] ?? null,
                'og_title' => $def['og_title'] ?? $def['meta_title'],
                'og_description' => $def['og_description'] ?? $def['meta_description'],
                'og_image' => $def['og_image'] ?? null,
                'robots' => $def['robots'] ?? 'index, follow',
            ]
        );

        // Backfill missing SEO fields if needed
        $dirty = false;
        if (empty($page->meta_title) && ! empty($def['meta_title'])) {
            $page->meta_title = $def['meta_title'];
            $dirty = true;
        }
        if (empty($page->meta_description) && ! empty($def['meta_description'])) {
            $page->meta_description = $def['meta_description'];
            $dirty = true;
        }
        if (empty($page->robots)) {
            $page->robots = 'index, follow';
            $dirty = true;
        }
        if ($dirty) {
            $page->save();
        }

        return $page;
    }

    /**
     * Find or create the About Us page record.
     */
    public static function getOrCreateAboutUs(): self
    {
        return static::getOrCreateBySlug('about-us');
    }
}


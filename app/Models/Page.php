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
            ]
        );
    }
}


<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminPageTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(UserRole::Admin->value);
    }

    public function test_guest_cannot_access_admin_pages(): void
    {
        $response = $this->get('/admin/pages');
        $response->assertRedirect('/login');

        $response = $this->get('/admin/pages/contact-us');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_view_pages_index(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/pages');
        $response->assertOk();
        $response->assertInertia(fn ($assert) => $assert
            ->component('Admin/Pages/Index')
            ->has('pages', 2)
        );
    }

    public function test_admin_can_view_contact_us_editor(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/pages/contact-us');
        $response->assertOk();
    }

    public function test_admin_can_update_contact_us_fields(): void
    {
        $payload = [
            'top_bar_Heading' => 'REACH OUT TO DAYAL SWEETS',
            'top_bar_sub_heading' => 'Tradition of Pure Taste & Service',
            'top_bar_description' => 'Feel free to contact us for bulk orders, wedding gifting, or party inquiries.',
            'emails' => [
                'support@dayalsweets.com',
                'corporate@dayalsweets.com',
            ],
            'phones' => [
                '+91 98765 43210',
                '+91 98765 43211',
            ],
            'opening_hours' => 'Mon-Sun ( 07:00 AM - 12:00 AM )',
        ];

        $response = $this->actingAs($this->admin)->post('/admin/pages/contact-us', $payload);
        $response->assertRedirect('/admin/pages/contact-us');

        $page = Page::where('slug', 'contact-us')->first();
        $this->assertNotNull($page);
        $this->assertEquals('REACH OUT TO DAYAL SWEETS', $page->sections['top_bar_Heading']);
        $this->assertEquals('Tradition of Pure Taste & Service', $page->sections['top_bar_sub_heading']);
        $this->assertEquals('Feel free to contact us for bulk orders, wedding gifting, or party inquiries.', $page->sections['top_bar_description']);

        // Check email[] repeater
        $this->assertCount(2, $page->sections['emails']);
        $this->assertEquals('support@dayalsweets.com', $page->sections['emails'][0]);
        $this->assertEquals('corporate@dayalsweets.com', $page->sections['emails'][1]);

        // Check phone[] repeater
        $this->assertCount(2, $page->sections['phones']);
        $this->assertEquals('+91 98765 43210', $page->sections['phones'][0]);
        $this->assertEquals('+91 98765 43211', $page->sections['phones'][1]);

        // Check opening hours
        $this->assertEquals('Mon-Sun ( 07:00 AM - 12:00 AM )', $page->sections['opening_hours']);
    }

    public function test_public_contact_us_page_loads_dynamic_content_and_keeps_full_design(): void
    {
        $page = Page::getOrCreateContactUs();
        $page->update([
            'sections' => [
                'top_bar_Heading' => 'CUSTOM CONTACT BANNER',
                'top_bar_sub_heading' => 'Live Storefront Subtitle',
                'top_bar_description' => 'Test dynamic description rendered from database.',
                'emails' => ['hello@dayalsweets.com', 'orders@dayalsweets.com'],
                'phones' => ['+91 99999 88888'],
                'opening_hours' => 'Mon-Sun ( 08:00 AM - 11:00 PM )',
            ],
        ]);

        $response = $this->get('/contact-us');
        $response->assertOk();
        $response->assertInertia(fn ($assert) => $assert
            ->component('ContactUs')
            ->has('page')
            ->where('page.sections.top_bar_Heading', 'CUSTOM CONTACT BANNER')
            ->where('page.sections.emails.0', 'hello@dayalsweets.com')
        );
    }

    public function test_admin_can_view_gallery_editor(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/pages/gallery');
        $response->assertOk();
    }

    public function test_admin_can_update_gallery_fields_categories_and_images(): void
    {
        $payload = [
            'top_bar_Heading' => 'DAYAL SWEETS PHOTO GALLERY',
            'top_bar_sub_heading' => 'A Glimpse of Authentic Flavours',
            'top_bar_description' => 'Explore the moments that make Dayal Sweets Himachal’s favorite.',
            'categories' => [
                ['id' => 'dining', 'name' => 'Fine Dining'],
                ['id' => 'kitchen', 'name' => 'Chef Kitchen'],
            ],
            'images' => [
                [
                    'id' => 1,
                    'name' => 'Royal Dining Room',
                    'category' => 'dining',
                    'image' => '/uploads/2026/08/Family-Dining.png',
                ],
                [
                    'id' => 2,
                    'name' => 'Live Tandoor Station',
                    'category' => 'kitchen',
                    'image' => '/uploads/2026/08/Live-Kitchen.png',
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post('/admin/pages/gallery', $payload);
        $response->assertRedirect('/admin/pages/gallery');

        $page = Page::where('slug', 'gallery')->first();
        $this->assertNotNull($page);
        $this->assertEquals('DAYAL SWEETS PHOTO GALLERY', $page->sections['top_bar_Heading']);
        $this->assertEquals('A Glimpse of Authentic Flavours', $page->sections['top_bar_sub_heading']);

        // Check categories
        $this->assertCount(2, $page->sections['categories']);
        $this->assertEquals('Fine Dining', $page->sections['categories'][0]['name']);
        $this->assertEquals('Chef Kitchen', $page->sections['categories'][1]['name']);

        // Check images
        $this->assertCount(2, $page->sections['images']);
        $this->assertEquals('Royal Dining Room', $page->sections['images'][0]['name']);
        $this->assertEquals('dining', $page->sections['images'][0]['category']);
        $this->assertEquals('Live Tandoor Station', $page->sections['images'][1]['name']);
        $this->assertEquals('kitchen', $page->sections['images'][1]['category']);
    }

    public function test_public_gallery_page_loads_dynamic_content_and_keeps_full_design(): void
    {
        $page = Page::getOrCreateGallery();
        $page->update([
            'sections' => [
                'top_bar_Heading' => 'LIVE DYNAMIC GALLERY',
                'top_bar_sub_heading' => 'Storefront Dynamic Subtitle',
                'top_bar_description' => 'Test dynamic description rendered on public gallery.',
                'categories' => [
                    ['id' => 'sweets', 'name' => 'Pure Sweets'],
                ],
                'images' => [
                    [
                        'id' => 1,
                        'name' => 'Kaju Katli Showcase',
                        'title' => 'Kaju Katli Showcase',
                        'category' => 'sweets',
                        'categories' => ['sweets'],
                        'image' => '/uploads/2026/07/thaal.png',
                    ],
                ],
            ],
        ]);

        $response = $this->get('/gallery');
        $response->assertOk();
        $response->assertInertia(fn ($assert) => $assert
            ->component('Gallery')
            ->has('page')
            ->where('page.sections.top_bar_Heading', 'LIVE DYNAMIC GALLERY')
            ->where('page.sections.categories.0.name', 'Pure Sweets')
            ->where('page.sections.images.0.name', 'Kaju Katli Showcase')
        );
    }

    public function test_newly_created_categories_and_images_are_saved_in_descending_order_on_top(): void
    {
        $payload = [
            'top_bar_Heading' => 'DESCENDING GALLERY TEST',
            'top_bar_sub_heading' => 'Newest First',
            'top_bar_description' => 'Testing newest categories and images at index 0',
            'categories' => [
                ['id' => 'brand-new-cat', 'name' => 'Brand New Category (Top)'],
                ['id' => 'older-cat', 'name' => 'Older Category (Bottom)'],
            ],
            'images' => [
                [
                    'id' => 9999,
                    'name' => 'Brand New Photo (Top)',
                    'category' => 'brand-new-cat',
                    'image' => '/uploads/2026/08/Family-Dining.png',
                ],
                [
                    'id' => 1000,
                    'name' => 'Older Photo (Bottom)',
                    'category' => 'older-cat',
                    'image' => '/uploads/2026/08/Private-Dining.png',
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)->post('/admin/pages/gallery', $payload);
        $response->assertRedirect('/admin/pages/gallery');

        // Check public storefront renders newest at index 0
        $public = $this->get('/gallery');
        $public->assertOk();
        $public->assertInertia(fn ($assert) => $assert
            ->component('Gallery')
            ->where('page.sections.categories.0.name', 'Brand New Category (Top)')
            ->where('page.sections.categories.1.name', 'Older Category (Bottom)')
            ->where('page.sections.images.0.name', 'Brand New Photo (Top)')
            ->where('page.sections.images.1.name', 'Older Photo (Bottom)')
        );
    }

    public function test_admin_ajax_instant_save_reflects_immediately_on_public_gallery(): void
    {
        $payload = [
            'top_bar_Heading' => 'INSTANT SAVED GALLERY',
            'top_bar_sub_heading' => 'Instant Subtitle',
            'top_bar_description' => 'Instant dynamic description',
            'categories' => [
                ['id' => 'special-mithai', 'name' => 'Special Mithai'],
                ['id' => 'dining', 'name' => 'Dining'],
            ],
            'images' => [
                [
                    'id' => 8888,
                    'name' => 'Pista Burfi Instant',
                    'category' => 'special-mithai',
                    'image' => '/uploads/2026/08/Family-Dining.png',
                ],
                [
                    'id' => 8887,
                    'name' => 'Gulab Jamun Instant',
                    'category' => 'special-mithai',
                    'image' => '/uploads/2026/08/Private-Dining.png',
                ],
            ],
        ];

        // Simulate AJAX request from Gallery.jsx instant save
        $response = $this->actingAs($this->admin)->postJson('/admin/pages/gallery', $payload);
        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'message' => 'Gallery page content updated successfully.',
        ]);

        // Immediately fetch public gallery storefront
        $public = $this->get('/gallery');
        $public->assertOk();
        $public->assertInertia(fn ($assert) => $assert
            ->component('Gallery')
            ->where('page.sections.top_bar_Heading', 'INSTANT SAVED GALLERY')
            ->where('page.sections.categories.0.name', 'Special Mithai')
            ->where('page.sections.images.0.name', 'Pista Burfi Instant')
            ->where('page.sections.images.0.category', 'special-mithai')
        );
    }
}


<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Page;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminHeaderFooterTest extends TestCase
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

    public function test_guest_cannot_access_header_footer_page(): void
    {
        $response = $this->get('/admin/header-footer');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_view_header_footer_editor(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/header-footer');
        $response->assertOk();
        $response->assertInertia(fn ($assert) => $assert
            ->component('Admin/HeaderFooter/Index')
            ->has('settings')
            ->has('page')
            ->where('page.slug', 'header-footer')
        );
    }

    public function test_admin_can_update_header_and_footer_settings(): void
    {
        $payload = [
            'header_logo' => '/uploads/custom-header-logo.png',
            'footer_bar' => [
                'sub_heading' => 'craving authentic sweets',
                'heading' => 'Order pure joy at home',
                'description' => 'Fast delivery straight from our kitchen.',
                'phone_number' => '+91 99999 88888',
                'image' => '/uploads/custom-cta.webp',
                'items' => [
                    ['heading' => 'FRESH INGREDIENTS', 'para' => '100% Desi Ghee'],
                    ['heading' => 'EXPRESS DELIVERY', 'para' => 'Within 45 Minutes'],
                ],
            ],
            'footer_logo' => '/uploads/custom-footer-logo.png',
            'footer_description' => 'Serving joy and royal sweetness since 1962.',
            'certified_groups' => [
                '/uploads/badge-iso.png',
                '/uploads/badge-fssai.png',
            ],
            'social_links' => [
                ['name' => 'Instagram', 'link' => 'https://instagram.com/dayalsweetsofficial'],
                ['name' => 'Facebook', 'link' => 'https://facebook.com/dayalsweets'],
            ],
            'copyright_description' => '© 2026 Dayal Sweets Pvt Ltd. All rights reserved.',
        ];

        $response = $this->actingAs($this->admin)->post('/admin/header-footer', $payload);
        $response->assertRedirect('/admin/header-footer');

        $page = Page::where('slug', 'header-footer')->first();
        $this->assertNotNull($page);

        // Verify header_logo
        $this->assertEquals('/uploads/custom-header-logo.png', $page->sections['header_logo']);

        // Verify footer_bar
        $this->assertEquals('craving authentic sweets', $page->sections['footer_bar']['sub_heading']);
        $this->assertEquals('Order pure joy at home', $page->sections['footer_bar']['heading']);
        $this->assertEquals('Fast delivery straight from our kitchen.', $page->sections['footer_bar']['description']);
        $this->assertEquals('+91 99999 88888', $page->sections['footer_bar']['phone_number']);
        $this->assertEquals('/uploads/custom-cta.webp', $page->sections['footer_bar']['image']);
        $this->assertCount(2, $page->sections['footer_bar']['items']);
        $this->assertEquals('FRESH INGREDIENTS', $page->sections['footer_bar']['items'][0]['heading']);

        // Verify footer main
        $this->assertEquals('/uploads/custom-footer-logo.png', $page->sections['footer_logo']);
        $this->assertEquals('Serving joy and royal sweetness since 1962.', $page->sections['footer_description']);
        $this->assertCount(2, $page->sections['certified_groups']);
        $this->assertEquals('/uploads/badge-iso.png', $page->sections['certified_groups'][0]);
        $this->assertCount(2, $page->sections['social_links']);
        $this->assertEquals('Instagram', $page->sections['social_links'][0]['name']);
        $this->assertEquals('© 2026 Dayal Sweets Pvt Ltd. All rights reserved.', $page->sections['copyright_description']);
    }

    public function test_admin_can_upload_image_for_header_footer(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('custom_logo.png', 300, 100);

        $response = $this->actingAs($this->admin)->postJson('/admin/header-footer/upload-image', [
            'image_file' => $file,
        ]);

        $response->assertOk()
            ->assertJson([
                'success' => true,
            ]);

        $url = $response->json('url');
        $this->assertStringStartsWith('/storage/header-footer/', $url);

        $relativePath = str_replace('/storage/', '', $url);
        Storage::disk('public')->assertExists($relativePath);
    }

    public function test_storefront_receives_header_footer_via_inertia_share(): void
    {
        Page::getOrCreateHeaderFooter();

        $response = $this->get('/');
        $response->assertOk();
        $response->assertInertia(fn ($assert) => $assert
            ->has('headerFooter')
            ->has('headerFooter.header_logo')
            ->has('headerFooter.footer_bar')
            ->has('headerFooter.footer_logo')
            ->has('headerFooter.certified_groups')
            ->has('headerFooter.social_links')
            ->has('headerFooter.copyright_description')
        );
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserPermission;
use App\Enums\UserRole;
use App\Models\Page;
use App\Models\User;
use Database\Seeders\RoleAndPermissionSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class PageSeoAndAdminPermissionsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(RoleAndPermissionSeeder::class);
    }

    public function test_admin_has_all_system_permissions_including_pages_and_seo(): void
    {
        $adminRole = Role::findByName(UserRole::Admin->value, 'web');
        $assigned = $adminRole->permissions->pluck('name')->all();

        foreach (UserPermission::adminPermissions() as $perm) {
            $this->assertContains($perm, $assigned, "Admin role is missing permission: {$perm}");
        }

        $this->assertContains('manage pages', $assigned);
        $this->assertContains('manage seo', $assigned);
        $this->assertContains('manage header footer', $assigned);
    }

    public function test_admin_can_list_all_website_pages_and_update_page_seo_and_fetch_on_frontend(): void
    {
        $admin = User::where('email', 'admin@dayalsweets.com')->firstOrFail();

        // 1. Open Admin Pages Index (ensures all website pages are created)
        $indexRes = $this->actingAs($admin)->getJson(route('admin.pages.index'));
        $indexRes->assertOk()->assertJsonPath('success', true);

        $expectedSlugs = [
            'home',
            'shop',
            'about-us',
            'contact-us',
            'gallery',
            'gifting',
            'dining',
            'franchise',
            'testimonials',
            'privacy-policy',
            'refund-returns',
        ];

        foreach ($expectedSlugs as $slug) {
            $this->assertDatabaseHas('pages', ['slug' => $slug]);
        }

        // 2. Open Dedicated Pages SEO Information screen
        $seoIndexRes = $this->actingAs($admin)->getJson(route('admin.pages.seo'));
        $seoIndexRes->assertOk()->assertJsonPath('success', true);

        // 3. Update SEO for About Us page via SEO endpoint
        $aboutPage = Page::where('slug', 'about-us')->firstOrFail();
        $updateSeoRes = $this->actingAs($admin)->postJson(route('admin.pages.seo.update', $aboutPage->id), [
            'meta_title' => 'Custom About Us SEO Title | Dayal Sweets Heritage',
            'meta_description' => 'Custom SEO meta description for About Us page tested from Admin.',
            'meta_keywords' => 'dayal heritage, 1962 sweets, pure desi ghee',
            'canonical_url' => 'https://dayalsweets.com/about-us',
            'og_title' => 'Dayal Sweets Heritage Story',
            'og_description' => 'Social share description for About Us.',
            'og_image' => '/uploads/2026/08/Family-Dining.png',
            'robots' => 'index, follow',
        ]);

        $updateSeoRes->assertOk()->assertJsonPath('success', true);

        $aboutPage->refresh();
        $this->assertSame('Custom About Us SEO Title | Dayal Sweets Heritage', $aboutPage->meta_title);
        $this->assertSame('Custom SEO meta description for About Us page tested from Admin.', $aboutPage->meta_description);
        $this->assertSame('dayal heritage, 1962 sweets, pure desi ghee', $aboutPage->meta_keywords);

        // 4. Fetch frontend /about-us page and verify SEO metadata is rendered in HTML
        $frontRes = $this->get('/about-us');
        $frontRes->assertOk();
        $frontRes->assertSee('Custom About Us SEO Title | Dayal Sweets Heritage', false);
        $frontRes->assertSee('Custom SEO meta description for About Us page tested from Admin.', false);

        // 5. Update Contact Us content + SEO together and verify on /contact-us
        $this->actingAs($admin)->postJson(route('admin.pages.contact-us.update'), [
            'top_bar_Heading' => 'CONTACT DAYAL SWEETS',
            'top_bar_sub_heading' => 'Reach Out Anytime',
            'top_bar_description' => 'Updated contact hero description.',
            'emails' => ['support@dayalsweets.com'],
            'phones' => ['+91 98765 43210'],
            'opening_hours' => 'Mon-Sun ( 08:00 AM - 11:00 PM )',
            'meta_title' => 'Reach Dayal Sweets Support | Official Contact Page',
            'meta_description' => 'Official contact page meta description for Dayal Sweets.',
            'meta_keywords' => 'contact dayal sweets, support phone',
            'robots' => 'index, follow',
        ])->assertOk();

        $contactFront = $this->get('/contact-us');
        $contactFront->assertOk();
        $contactFront->assertSee('Reach Dayal Sweets Support | Official Contact Page', false);
        $contactFront->assertSee('Official contact page meta description for Dayal Sweets.', false);
    }

    public function test_editor_and_staff_use_unified_admin_dashboard_and_permission_based_routes(): void
    {
        $editor = User::where('email', 'editor@dayalsweets.com')->firstOrFail();

        // Editor uses the same unified admin.dashboard route
        $this->assertSame('admin.dashboard', $editor->dashboardRoute());

        // Legacy /editor/dashboard redirects to unified /admin/dashboard
        $this->actingAs($editor)->get('/editor/dashboard')->assertRedirect(route('admin.dashboard'));

        // Editor can access unified /admin/dashboard and their permitted sections
        $this->actingAs($editor)->get(route('admin.dashboard'))->assertOk();
        $this->actingAs($editor)->get(route('admin.pages.index'))->assertOk();
        $this->actingAs($editor)->get(route('admin.pages.seo'))->assertOk();
        $this->actingAs($editor)->get(route('admin.header-footer.index'))->assertOk();

        // Editor is blocked from routes they do not have permission for
        $this->actingAs($editor)->get(route('admin.orders.index'))->assertForbidden();
        $this->actingAs($editor)->get(route('admin.products.index'))->assertForbidden();
        $this->actingAs($editor)->get(route('admin.roles.index'))->assertForbidden();
    }
}

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

    public function test_admin_and_customer_roles_are_permanently_locked_from_modification(): void
    {
        $admin = User::where('email', 'admin@dayalsweets.com')->firstOrFail();
        $adminRole = Role::findByName(UserRole::Admin->value, 'web');
        $customerRole = Role::findByName(UserRole::Customer->value, 'web');

        // Customer has zero admin permissions
        $this->assertCount(0, $customerRole->permissions);

        // Admin cannot edit or delete admin or customer roles
        $this->actingAs($admin)->put(route('admin.roles.update', $adminRole->id), [
            'permissions' => ['manage orders'],
        ])->assertForbidden();

        $this->actingAs($admin)->put(route('admin.roles.update', $customerRole->id), [
            'permissions' => ['manage orders'],
        ])->assertForbidden();

        $this->actingAs($admin)->delete(route('admin.roles.destroy', $adminRole->id))->assertForbidden();
        $this->actingAs($admin)->delete(route('admin.roles.destroy', $customerRole->id))->assertForbidden();
    }

    public function test_administrator_staff_account_is_permanently_locked_from_role_change_and_deletion(): void
    {
        $admin = User::where('email', 'admin@dayalsweets.com')->firstOrFail();

        // Create a staff manager with 'manage staff' permission
        $managerRole = Role::create(['name' => 'staff_manager', 'guard_name' => 'web']);
        $managerRole->syncPermissions(['manage staff']);

        $manager = User::factory()->create(['email' => 'manager@dayalsweets.com']);
        $manager->assignRole($managerRole);

        // Neither the admin nor another staff manager can change the admin's role or delete the admin account
        $this->actingAs($admin)->put(route('admin.users.update-role', $admin->id), [
            'role' => UserRole::Editor->value,
        ])->assertForbidden();

        $this->actingAs($admin)->delete(route('admin.users.destroy', $admin->id))->assertForbidden();

        $this->actingAs($manager)->put(route('admin.users.update-role', $admin->id), [
            'role' => UserRole::Editor->value,
        ])->assertForbidden();

        $this->actingAs($manager)->delete(route('admin.users.destroy', $admin->id))->assertForbidden();

        // Admin user still exists and still has the admin role
        $this->assertDatabaseHas('users', ['id' => $admin->id]);
        $this->assertTrue($admin->fresh()->hasRole(UserRole::Admin->value));
    }

    public function test_staff_creation_rejects_admin_customer_and_nonexistent_roles(): void
    {
        $admin = User::where('email', 'admin@dayalsweets.com')->firstOrFail();

        foreach (['admin', 'customer', 'made_up_hacker_role'] as $badRole) {
            $this->actingAs($admin)->post(route('admin.users.store'), [
                'name' => 'Test User',
                'email' => "bad_{$badRole}@dayalsweets.com",
                'password' => 'Password123!',
                'password_confirmation' => 'Password123!',
                'role' => $badRole,
            ])->assertSessionHasErrors('role');
        }
    }

    public function test_cod_checkout_enforces_authoritative_database_product_price(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $product = \App\Models\Product::create([
            'product_name' => 'Royal Kaju Katli Box',
            'product_slug' => 'royal-kaju-katli-box',
            'product_description' => 'Pure cashew fudge',
            'product_price' => 900.00,
            'product_selling_price' => 850.00,
            'product_qty' => 25,
        ]);

        // Attempt to tamper item price to 1.00
        $res = $this->actingAs($customer)->postJson('/checkout/place-cod-order', [
            'customer_name' => 'Test Buyer',
            'customer_email' => 'buyer@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => '123 Main St',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'shipping_cost' => 0,
            'items' => [
                [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'price' => 1.00,
                    'quantity' => 2,
                ],
            ],
        ]);

        $res->assertOk()->assertJsonPath('success', true);
        $this->assertDatabaseHas('orders', [
            'id' => $res->json('order_id'),
            'subtotal' => 1700.00,
            'total_amount' => 1700.00,
        ]);
    }
}

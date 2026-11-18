<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserPermission;
use App\Enums\UserRole;
use App\Models\Coupon;
use App\Models\Outlet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CouponAndRoleManagementTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;
    protected User $editor;
    protected User $customer;
    protected Outlet $outletAmb;
    protected Outlet $outletUna;

    protected function setUp(): void
    {
        parent::setUp();

        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // 1. Create permissions
        foreach (UserPermission::values() as $permissionName) {
            \Spatie\Permission\Models\Permission::firstOrCreate(['name' => $permissionName, 'guard_name' => 'web']);
        }

        // Setup Spatie Roles
        $adminRole = Role::firstOrCreate(['name' => UserRole::Admin->value, 'guard_name' => 'web']);
        $adminRole->syncPermissions(UserPermission::adminPermissions());

        $editorRole = Role::firstOrCreate(['name' => UserRole::Editor->value, 'guard_name' => 'web']);
        $editorRole->syncPermissions(UserPermission::editorPermissions());

        $customerRole = Role::firstOrCreate(['name' => UserRole::Customer->value, 'guard_name' => 'web']);
        $customerRole->syncPermissions(UserPermission::customerPermissions());

        // Setup Users
        $this->admin = User::factory()->create(['name' => 'Admin User', 'email' => 'admin@test.com']);
        $this->admin->assignRole($adminRole);

        $this->editor = User::factory()->create(['name' => 'Editor User', 'email' => 'editor@test.com']);
        $this->editor->assignRole($editorRole);

        $this->customer = User::factory()->create(['name' => 'Customer User', 'email' => 'customer@test.com']);
        $this->customer->assignRole($customerRole);

        // Setup Outlets
        $this->outletAmb = Outlet::create([
            'name' => 'Dayal Sweets Amb',
            'slug' => 'amb',
            'city' => 'Amb',
            'state' => 'Himachal Pradesh',
            'address' => 'Main Bazaar Amb',
            'pincode' => '177203',
            'is_active' => true,
        ]);

        $this->outletUna = Outlet::create([
            'name' => 'Dayal Sweets Una',
            'slug' => 'una',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'address' => 'Bus Stand Una',
            'pincode' => '174303',
            'is_active' => true,
        ]);
    }

    public function test_admin_can_view_users_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.users.index'));
        $response->assertOk();
    }

    public function test_staff_list_excludes_customer_role(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.users.index'));
        $response->assertOk();

        // Customer role user must not appear in staff management
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Admin/Users/Index')
            ->has('users.data')
            ->where('users.data', fn ($users) => collect($users)->every(fn ($u) => $u['role'] !== UserRole::Customer->value))
        );
    }

    public function test_admin_can_view_customers_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.customers.index'));
        $response->assertOk();
        $response->assertInertia(fn (\Inertia\Testing\AssertableInertia $page) => $page
            ->component('Admin/Customers/Index')
            ->has('customers.data')
            ->where('stats.total_customers', fn ($count) => $count >= 1)
        );
    }

    public function test_admin_can_create_new_staff_member(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.users.store'), [
            'name' => 'Kavita Sharma',
            'email' => 'kavita@dayalsweets.com',
            'password' => 'secret1234',
            'password_confirmation' => 'secret1234',
            'role' => UserRole::Editor->value,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', ['email' => 'kavita@dayalsweets.com']);

        $kavita = User::where('email', 'kavita@dayalsweets.com')->first();
        $this->assertNotNull($kavita);
        $this->assertTrue($kavita->hasRole(UserRole::Editor->value));
    }

    public function test_admin_can_delete_staff_member(): void
    {
        $staff = User::factory()->create(['name' => 'Temp Staff', 'email' => 'tempstaff@test.com']);
        $staff->assignRole(UserRole::Editor->value);

        $response = $this->actingAs($this->admin)->delete(route('admin.users.destroy', $staff->id));
        $response->assertRedirect();
        $this->assertDatabaseMissing('users', ['id' => $staff->id]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $response = $this->actingAs($this->admin)->delete(route('admin.users.destroy', $this->admin->id));
        $response->assertRedirect();
        $response->assertSessionHas('error');
        $this->assertDatabaseHas('users', ['id' => $this->admin->id]);
    }

    public function test_customer_cannot_access_admin_portal(): void
    {
        $response = $this->actingAs($this->customer)->get(route('admin.dashboard'));
        $response->assertForbidden();
    }

    public function test_admin_can_change_customer_to_editor(): void
    {
        $response = $this->actingAs($this->admin)->put(route('admin.users.update-role', $this->customer->id), [
            'role' => UserRole::Editor->value,
        ]);

        $response->assertRedirect();
        $this->customer->refresh();
        $this->assertTrue($this->customer->hasRole(UserRole::Editor->value));
    }

    public function test_admin_cannot_demote_themselves(): void
    {
        $response = $this->actingAs($this->admin)->put(route('admin.users.update-role', $this->admin->id), [
            'role' => UserRole::Customer->value,
        ]);

        $response->assertSessionHas('error');
        $this->admin->refresh();
        $this->assertTrue($this->admin->hasRole(UserRole::Admin->value));
    }

    public function test_editor_can_access_editor_dashboard(): void
    {
        $response = $this->actingAs($this->editor)->get(route('editor.dashboard'));
        $response->assertOk();
    }

    public function test_editor_cannot_access_admin_orders(): void
    {
        $response = $this->actingAs($this->editor)->get(route('admin.orders.index'));
        $response->assertForbidden();
    }

    public function test_admin_can_view_coupons_list(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.coupons.index'));
        $response->assertOk();
    }

    public function test_admin_can_create_global_coupon(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.coupons.store'), [
            'code' => 'GLOBAL10',
            'description' => '10% off everywhere',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'is_global' => true,
            'min_order_amount' => 500,
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('coupons', [
            'code' => 'GLOBAL10',
            'is_global' => true,
            'discount_value' => 10,
        ]);
    }

    public function test_admin_can_create_outlet_specific_coupon(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.coupons.store'), [
            'code' => 'AMBEXCLUSIVE',
            'description' => 'Amb exclusive coupon',
            'discount_type' => 'fixed',
            'discount_value' => 50,
            'is_global' => false,
            'outlet_ids' => [$this->outletAmb->id],
            'is_active' => true,
        ]);

        $response->assertRedirect();
        $coupon = Coupon::where('code', 'AMBEXCLUSIVE')->first();
        $this->assertNotNull($coupon);
        $this->assertFalse($coupon->is_global);
        $this->assertTrue($coupon->isValidForOutlet($this->outletAmb->id));
        $this->assertFalse($coupon->isValidForOutlet($this->outletUna->id));
    }

    public function test_admin_can_bulk_activate_and_delete_coupons(): void
    {
        $c1 = Coupon::create(['code' => 'BULK1', 'discount_type' => 'percentage', 'discount_value' => 5, 'is_global' => true, 'is_active' => false]);
        $c2 = Coupon::create(['code' => 'BULK2', 'discount_type' => 'percentage', 'discount_value' => 5, 'is_global' => true, 'is_active' => false]);

        $response = $this->actingAs($this->admin)->post(route('admin.coupons.bulk-action'), [
            'action' => 'activate',
            'coupon_ids' => [$c1->id, $c2->id],
        ]);
        $response->assertRedirect();
        $this->assertTrue($c1->fresh()->is_active);
        $this->assertTrue($c2->fresh()->is_active);

        // Bulk delete
        $delResponse = $this->actingAs($this->admin)->post(route('admin.coupons.bulk-action'), [
            'action' => 'delete',
            'coupon_ids' => [$c1->id, $c2->id],
        ]);
        $delResponse->assertRedirect();
        $this->assertDatabaseMissing('coupons', ['id' => $c1->id]);
        $this->assertDatabaseMissing('coupons', ['id' => $c2->id]);
    }

    public function test_admin_can_generate_bulk_coupons(): void
    {
        $response = $this->actingAs($this->admin)->post(route('admin.coupons.generate-bulk'), [
            'prefix' => 'DIWALI',
            'count' => 5,
            'discount_type' => 'percentage',
            'discount_value' => 15,
            'is_global' => true,
        ]);

        $response->assertRedirect();
        $this->assertEquals(5, Coupon::where('code', 'like', 'DIWALI-%')->count());
    }

    public function test_public_coupon_apply_api_validates_global_and_outlet_coupons(): void
    {
        $global = Coupon::create([
            'code' => 'SAVE10',
            'discount_type' => 'percentage',
            'discount_value' => 10,
            'min_order_amount' => 500,
            'is_global' => true,
            'is_active' => true,
        ]);

        $ambOnly = Coupon::create([
            'code' => 'AMBONLY',
            'discount_type' => 'fixed',
            'discount_value' => 100,
            'is_global' => false,
            'outlet_id' => $this->outletAmb->id,
            'is_active' => true,
        ]);

        // 1. Valid Global Coupon
        $res1 = $this->postJson(route('api.coupon.apply'), [
            'code' => 'SAVE10',
            'subtotal' => 1000,
            'outlet_id' => $this->outletUna->id,
        ]);
        $res1->assertOk();
        $res1->assertJson([
            'success' => true,
            'discount' => 100,
            'final_total' => 900,
        ]);

        // 2. Reject Global Coupon if below min order
        $res2 = $this->postJson(route('api.coupon.apply'), [
            'code' => 'SAVE10',
            'subtotal' => 300,
        ]);
        $res2->assertStatus(422);

        // 3. Outlet-specific Coupon matches correct outlet
        $res3 = $this->postJson(route('api.coupon.apply'), [
            'code' => 'AMBONLY',
            'subtotal' => 500,
            'outlet_id' => $this->outletAmb->id,
        ]);
        $res3->assertOk();
        $res3->assertJson([
            'success' => true,
            'discount' => 100,
            'final_total' => 400,
        ]);

        // 4. Outlet-specific Coupon rejects mismatched outlet
        $res4 = $this->postJson(route('api.coupon.apply'), [
            'code' => 'AMBONLY',
            'subtotal' => 500,
            'outlet_id' => $this->outletUna->id,
        ]);
        $res4->assertStatus(422);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RoleAndDashboardTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (UserRole::values() as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }

    public function test_public_home_page_is_rendered(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
    }

    public function test_admin_login_screen_can_be_rendered(): void
    {
        $response = $this->get('/admin/login');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page->component('Admin/Auth/Login'));
    }

    public function test_admin_can_authenticate_via_single_login_and_redirects_to_admin_dashboard(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->post('/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($admin);
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_customer_can_authenticate_via_single_login_and_redirects_to_customer_dashboard(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $response = $this->post('/login', [
            'email' => $customer->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($customer);
        $response->assertRedirect(route('customer.dashboard', absolute: false));
    }

    public function test_admin_can_authenticate_via_admin_login(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->post('/admin/login', [
            'email' => $admin->email,
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($admin);
        $response->assertRedirect(route('admin.dashboard', absolute: false));
    }

    public function test_customer_cannot_authenticate_via_admin_login(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $response = $this->post('/admin/login', [
            'email' => $customer->email,
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response->assertSessionHasErrors('email');
    }

    public function test_admin_can_logout_via_admin_logout(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->actingAs($admin)->post('/admin/logout');

        $this->assertGuest();
        $response->assertRedirect(route('admin.login'));
    }

    public function test_admin_can_access_admin_dashboard(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->actingAs($admin)->get('/admin/dashboard');
        $response->assertStatus(200);
    }

    public function test_customer_cannot_access_admin_dashboard(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $response = $this->actingAs($customer)->get('/admin/dashboard');
        $response->assertStatus(403);
    }

    public function test_customer_can_access_customer_dashboard(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $response = $this->actingAs($customer)->get('/customer/dashboard');
        $response->assertStatus(200);
    }

    public function test_admin_cannot_access_customer_dashboard(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->actingAs($admin)->get('/customer/dashboard');
        $response->assertStatus(403);
    }

    public function test_generic_dashboard_route_redirects_admin_to_admin_dashboard(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->actingAs($admin)->get('/dashboard');
        $response->assertRedirect(route('admin.dashboard'));
    }

    public function test_generic_dashboard_route_redirects_customer_to_customer_dashboard(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $response = $this->actingAs($customer)->get('/dashboard');
        $response->assertRedirect(route('customer.dashboard'));
    }

    public function test_generic_my_account_route_redirects_admin_to_admin_account(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $response = $this->actingAs($admin)->get('/my-account');
        $response->assertRedirect(route('admin.account'));
    }

    public function test_generic_my_account_route_redirects_customer_to_customer_account(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $response = $this->actingAs($customer)->get('/my-account');
        $response->assertRedirect(route('customer.account'));
    }

    public function test_admin_can_access_and_update_admin_account(): void
    {
        $admin = User::factory()->create();
        $admin->assignRole(UserRole::Admin->value);

        $this->actingAs($admin)->get('/admin/account')->assertStatus(200);

        $profileResponse = $this->actingAs($admin)->patch('/admin/account/profile', [
            'name' => 'Updated Admin Name',
            'email' => 'updated.admin@dayalsweets.com',
        ]);
        $profileResponse->assertSessionHasNoErrors();
        $this->assertSame('Updated Admin Name', $admin->fresh()->name);
        $this->assertNull($admin->fresh()->email_verified_at);

        $passwordResponse = $this->actingAs($admin)->put('/admin/account/password', [
            'current_password' => 'password',
            'password' => 'new-secure-password',
            'password_confirmation' => 'new-secure-password',
        ]);
        $passwordResponse->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('new-secure-password', $admin->fresh()->password));
    }

    public function test_customer_can_access_and_update_customer_account(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $this->actingAs($customer)->get('/customer/account')->assertStatus(200);

        $profileResponse = $this->actingAs($customer)->patch('/customer/account/profile', [
            'name' => 'Updated Customer Name',
            'email' => 'updated.customer@dayalsweets.com',
        ]);
        $profileResponse->assertSessionHasNoErrors();
        $this->assertSame('Updated Customer Name', $customer->fresh()->name);
        $this->assertNull($customer->fresh()->email_verified_at);

        $passwordResponse = $this->actingAs($customer)->put('/customer/account/password', [
            'current_password' => 'password',
            'password' => 'new-customer-password',
            'password_confirmation' => 'new-customer-password',
        ]);
        $passwordResponse->assertSessionHasNoErrors();
        $this->assertTrue(Hash::check('new-customer-password', $customer->fresh()->password));
    }
}

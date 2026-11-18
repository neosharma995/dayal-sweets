<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Models\DiningQuery;
use App\Models\Outlet;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class DiningQueryTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private Outlet $outlet;

    protected function setUp(): void
    {
        parent::setUp();

        Role::firstOrCreate(['name' => 'admin']);
        Role::firstOrCreate(['name' => 'customer']);

        $this->admin = User::factory()->create([
            'email' => 'admin@dayalsweets.com',
        ]);
        $this->admin->assignRole('admin');

        $this->outlet = Outlet::create([
            'name' => 'Amb Central',
            'slug' => 'amb-central',
            'address' => 'VPO Amb, Main Bazaar',
            'city' => 'Amb',
            'state' => 'Himachal Pradesh',
            'pincode' => '177203',
            'is_active' => true,
        ]);
    }

    public function test_guest_can_submit_dining_reservation_via_post_dining(): void
    {
        $response = $this->postJson('/dining', [
            'name' => 'Vikas Sharma',
            'phone' => '9816012345',
            'email' => 'vikas.sharma@example.com',
            'persons' => 4,
            'message' => 'Need a quiet corner table for family dinner.',
            'outlet_id' => $this->outlet->id,
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('dining_queries', [
            'name' => 'Vikas Sharma',
            'phone' => '9816012345',
            'email' => 'vikas.sharma@example.com',
            'guests' => 4,
            'status' => 'pending',
            'outlet_id' => $this->outlet->id,
        ]);
    }

    public function test_guest_can_submit_dining_reservation_via_post_dinning_alias(): void
    {
        $response = $this->postJson('/dinning', [
            'name' => 'Neha Verma',
            'phone' => '9816099999',
            'email' => 'neha.verma@example.com',
            'guests' => 2,
            'message' => 'Anniversary table decoration please.',
        ]);

        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('dining_queries', [
            'name' => 'Neha Verma',
            'guests' => 2,
            'status' => 'pending',
        ]);
    }

    public function test_dining_submission_requires_name_phone_and_email(): void
    {
        $response = $this->postJson('/dining', [
            'name' => '',
            'phone' => '',
            'email' => 'invalid-email',
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'phone', 'email']);
    }

    public function test_dining_submission_sanitizes_and_accepts_formatted_phone(): void
    {
        $response = $this->postJson('/dining', [
            'name' => 'Karan Singh',
            'phone' => '+91 98160-54321',
            'email' => 'karan@example.com',
            'persons' => 3,
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('dining_queries', [
            'name' => 'Karan Singh',
            'phone' => '9816054321',
            'guests' => 3,
        ]);
    }

    public function test_dining_submission_rejects_invalid_guests_count(): void
    {
        $response = $this->postJson('/dining', [
            'name' => 'Suman Sharma',
            'phone' => '9816012345',
            'email' => 'suman@example.com',
            'persons' => 999,
        ]);

        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['persons']);
    }

    public function test_admin_can_view_dining_queries_list(): void
    {
        DiningQuery::create([
            'name' => 'Rahul Kapoor',
            'phone' => '9816055555',
            'email' => 'rahul@example.com',
            'guests' => 6,
            'status' => 'pending',
            'outlet_id' => $this->outlet->id,
        ]);

        $response = $this->actingAs($this->admin)->get(route('admin.dining-queries.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/DiningQueries/Index')
            ->has('queries.data', 1)
            ->has('counts')
        );
    }

    public function test_admin_can_update_dining_query_status_and_notes(): void
    {
        $query = DiningQuery::create([
            'name' => 'Sunil Gupta',
            'phone' => '9816044444',
            'email' => 'sunil@example.com',
            'guests' => 3,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->patchJson(route('admin.dining-queries.update-status', $query->id), [
            'status' => 'confirmed',
            'admin_notes' => 'Confirmed table 5 for 8 PM.',
        ]);

        $response->assertOk();
        $this->assertDatabaseHas('dining_queries', [
            'id' => $query->id,
            'status' => 'confirmed',
            'admin_notes' => 'Confirmed table 5 for 8 PM.',
        ]);
    }

    public function test_admin_can_delete_dining_query(): void
    {
        $query = DiningQuery::create([
            'name' => 'Temporary Query',
            'phone' => '9816011111',
            'email' => 'temp@example.com',
            'guests' => 1,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.dining-queries.destroy', $query->id));

        $response->assertRedirect();
        $this->assertDatabaseMissing('dining_queries', [
            'id' => $query->id,
        ]);
    }

    public function test_guest_cannot_access_admin_dining_queries(): void
    {
        $response = $this->get(route('admin.dining-queries.index'));
        $response->assertRedirect('/login');
    }
}

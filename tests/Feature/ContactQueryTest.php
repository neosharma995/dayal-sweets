<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\ContactQuery;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ContactQueryTest extends TestCase
{
    use RefreshDatabase;

    protected User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(UserRole::Admin->value);
    }

    public function test_guest_cannot_access_admin_contact_queries(): void
    {
        $response = $this->get('/admin/contact-queries');
        $response->assertRedirect('/login');
    }

    public function test_public_user_can_submit_contact_form_and_save_to_database(): void
    {
        $payload = [
            'name' => 'Rajesh Sharma',
            'phone' => '9999999999',
            'email' => 'rajesh.sharma@example.com',
            'subject' => 'Bulk Wedding Sweets Inquiry',
            'requirements' => 'We need 500 gift hampers of Kaju Katli and Marwadi Ladoo for a wedding in Shimla.',
        ];

        $response = $this->postJson('/contact-us', $payload);
        $response->assertOk();
        $response->assertJson([
            'success' => true,
        ]);

        $this->assertDatabaseHas('contact_queries', [
            'name' => 'Rajesh Sharma',
            'phone' => '9999999999',
            'email' => 'rajesh.sharma@example.com',
            'subject' => 'Bulk Wedding Sweets Inquiry',
            'status' => 'unread',
        ]);
    }

    public function test_contact_form_validates_ten_digit_phone_number(): void
    {
        // Less than 10 digits
        $res1 = $this->postJson('/contact-us', [
            'name' => 'Test User',
            'phone' => '9816012',
            'email' => 'test@example.com',
            'subject' => 'Test',
            'requirements' => 'Testing requirements',
        ]);
        $res1->assertStatus(422);
        $res1->assertJsonValidationErrors(['phone']);

        // More than 10 digits
        $res2 = $this->postJson('/contact-us', [
            'name' => 'Test User',
            'phone' => '999999999999',
            'email' => 'test@example.com',
            'subject' => 'Test',
            'requirements' => 'Testing requirements',
        ]);
        $res2->assertStatus(422);
        $res2->assertJsonValidationErrors(['phone']);

        // Non-digits
        $res3 = $this->postJson('/contact-us', [
            'name' => 'Test User',
            'phone' => '99999abcde',
            'email' => 'test@example.com',
            'subject' => 'Test',
            'requirements' => 'Testing requirements',
        ]);
        $res3->assertStatus(422);
        $res3->assertJsonValidationErrors(['phone']);

        // Exactly 10 digits (e.g. 9999999999) succeeds
        $res4 = $this->postJson('/contact-us', [
            'name' => 'Test User',
            'phone' => '9999999999',
            'email' => 'test@example.com',
            'subject' => 'Test',
            'requirements' => 'Testing requirements',
        ]);
        $res4->assertOk();
    }

    public function test_contact_form_validates_required_fields(): void
    {
        $response = $this->postJson('/contact-us', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'phone', 'email', 'subject', 'requirements']);
    }

    public function test_admin_can_view_contact_queries_in_descending_order_with_pagination(): void
    {
        // Create 20 queries with specific timing
        for ($i = 1; $i <= 20; $i++) {
            ContactQuery::create([
                'name' => "Customer {$i}",
                'phone' => "+91 98000 {$i}",
                'email' => "customer{$i}@example.com",
                'subject' => "Subject {$i}",
                'requirements' => "Requirements details {$i}",
                'status' => $i % 3 === 0 ? 'read' : 'unread',
            ]);
        }

        $response = $this->actingAs($this->admin)->get('/admin/contact-queries?per_page=10');
        $response->assertOk();
        $response->assertInertia(fn ($assert) => $assert
            ->component('Admin/ContactQueries/Index')
            ->has('queries.data', 10)
            ->where('queries.total', 20)
            ->where('queries.data.0.name', 'Customer 20') // Latest on top (descending order)
            ->where('queries.data.1.name', 'Customer 19')
            ->where('queries.data.9.name', 'Customer 11')
        );
    }

    public function test_admin_can_view_query_details_and_status_changes_to_read(): void
    {
        $query = ContactQuery::create([
            'name' => 'Amit Kumar',
            'phone' => '+91 99999 11111',
            'email' => 'amit@example.com',
            'subject' => 'Corporate Gift Hampers',
            'requirements' => 'Need 100 boxes for Diwali corporate gifts.',
            'status' => 'unread',
        ]);

        $this->assertEquals('unread', $query->status);

        $response = $this->actingAs($this->admin)->getJson("/admin/contact-queries/{$query->id}");
        $response->assertOk();
        $response->assertJson([
            'success' => true,
            'data' => [
                'id' => $query->id,
                'status' => 'read',
            ],
        ]);

        $this->assertEquals('read', $query->fresh()->status);
    }

    public function test_admin_can_update_query_status_to_replied(): void
    {
        $query = ContactQuery::create([
            'name' => 'Sunil Verma',
            'phone' => '+91 98888 22222',
            'email' => 'sunil@example.com',
            'subject' => 'Bulk Order Inquiry',
            'requirements' => 'Inquiry for sweet boxes.',
            'status' => 'unread',
        ]);

        $response = $this->actingAs($this->admin)->patchJson("/admin/contact-queries/{$query->id}/status", [
            'status' => 'replied',
            'admin_notes' => 'Quotation sent via email.',
        ]);

        $response->assertOk();
        $this->assertEquals('replied', $query->fresh()->status);
        $this->assertEquals('Quotation sent via email.', $query->fresh()->admin_notes);
    }

    public function test_admin_can_delete_contact_query(): void
    {
        $query = ContactQuery::create([
            'name' => 'Spam Bot',
            'phone' => '1234567890',
            'email' => 'spam@bot.com',
            'subject' => 'Spam Message',
            'requirements' => 'Buy cheap links.',
            'status' => 'unread',
        ]);

        $response = $this->actingAs($this->admin)->deleteJson("/admin/contact-queries/{$query->id}");
        $response->assertOk();

        $this->assertDatabaseMissing('contact_queries', [
            'id' => $query->id,
        ]);
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\ProductAttribute;
use App\Models\ProductAttributeValue;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminAttributeTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected User $customerUser;

    protected function setUp(): void
    {
        parent::setUp();

        // Ensure roles exist
        foreach (UserRole::values() as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        // Create Admin User
        $this->adminUser = User::factory()->create([
            'name' => 'Admin Attribute Tester',
            'email' => 'admin_attr_'.uniqid().'@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->adminUser->assignRole(UserRole::Admin->value);

        // Create Customer User
        $this->customerUser = User::factory()->create([
            'name' => 'Customer Attribute Tester',
            'email' => 'customer_attr_'.uniqid().'@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->customerUser->assignRole(UserRole::Customer->value);
    }

    /**
     * Unauthenticated guest is redirected to login.
     */
    public function test_guest_cannot_access_attributes(): void
    {
        $response = $this->get('/admin/attributes');
        $response->assertRedirect('/login');
    }

    /**
     * Customer role receives 403 Forbidden.
     */
    public function test_customer_cannot_access_attributes(): void
    {
        $response = $this->actingAs($this->customerUser)->get('/admin/attributes');
        $response->assertStatus(403);
    }

    /**
     * Admin can view attributes index (Inertia and JSON).
     */
    public function test_admin_can_view_attributes_index(): void
    {
        ProductAttribute::create([
            'name' => 'Weight',
            'slug' => 'weight',
            'description' => 'Weight pack sizes',
        ]);

        $jsonResponse = $this->actingAs($this->adminUser)->getJson('/admin/attributes');
        $jsonResponse->assertStatus(200)
            ->assertJson([
                'success' => true,
            ])
            ->assertJsonStructure([
                'success',
                'data',
            ]);

        $inertiaResponse = $this->actingAs($this->adminUser)->get('/admin/attributes');
        $inertiaResponse->assertStatus(200);
    }

    /**
     * Admin can view attribute create page.
     */
    public function test_admin_can_view_create_attribute_page(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/attributes/create');
        $response->assertStatus(200);
    }

    /**
     * Admin can create attribute with initial values.
     */
    public function test_admin_can_create_attribute_with_values(): void
    {
        $payload = [
            'name' => 'Packaging Type',
            'description' => 'Packaging styles for sweets and savouries',
            'values' => [
                ['value' => 'Standard Box'],
                ['value' => 'Royal Tin Box'],
                ['value' => 'Velvet Gift Box'],
            ],
        ];

        $response = $this->actingAs($this->adminUser)->postJson('/admin/attributes', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Attribute created successfully.',
                'data' => [
                    'name' => 'Packaging Type',
                    'slug' => 'packaging-type',
                ],
            ]);

        $this->assertDatabaseHas('product_attributes', [
            'name' => 'Packaging Type',
            'slug' => 'packaging-type',
        ]);

        $this->assertDatabaseHas('product_attribute_values', [
            'value' => 'Standard Box',
            'slug' => 'standard-box',
        ]);
        $this->assertDatabaseHas('product_attribute_values', [
            'value' => 'Royal Tin Box',
            'slug' => 'royal-tin-box',
        ]);
    }

    /**
     * Admin can submit create attribute form and redirects to index.
     */
    public function test_admin_can_submit_create_attribute_form_and_redirects(): void
    {
        $payload = [
            'name' => 'Box Sizes',
            'slug' => 'box-sizes',
            'description' => 'Sizes of boxes',
            'values' => [
                ['value' => 'Small'],
                ['value' => 'Medium'],
                ['value' => 'Large'],
            ],
        ];

        $response = $this->actingAs($this->adminUser)
            ->post('/admin/attributes', $payload);

        $response->assertRedirect('/admin/attributes');
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('product_attributes', [
            'name' => 'Box Sizes',
            'slug' => 'box-sizes',
        ]);
        $this->assertDatabaseHas('product_attribute_values', [
            'value' => 'Small',
        ]);
    }

    /**
     * Admin can view single attribute and edit page.
     */
    public function test_admin_can_view_attribute_and_edit_page(): void
    {
        $attr = ProductAttribute::create([
            'name' => 'Flavors',
            'slug' => 'flavors',
        ]);
        $attr->values()->create(['value' => 'Kesar Pista', 'slug' => 'kesar-pista']);

        $showResponse = $this->actingAs($this->adminUser)->get("/admin/attributes/{$attr->id}");
        $showResponse->assertStatus(200);

        $editResponse = $this->actingAs($this->adminUser)->get("/admin/attributes/{$attr->id}/edit");
        $editResponse->assertStatus(200);
    }

    /**
     * Admin can update attribute and sync its values.
     */
    public function test_admin_can_update_attribute_and_values(): void
    {
        $attr = ProductAttribute::create([
            'name' => 'Original Name',
            'slug' => 'original-name',
        ]);
        $v1 = $attr->values()->create(['value' => 'Old Value 1', 'slug' => 'old-value-1']);

        $updatePayload = [
            'name' => 'Updated Name',
            'description' => 'Updated Description',
            'values' => [
                ['id' => $v1->id, 'value' => 'Updated Value 1'],
                ['value' => 'Brand New Value 2'],
            ],
        ];

        $response = $this->actingAs($this->adminUser)->putJson("/admin/attributes/{$attr->id}", $updatePayload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Attribute updated successfully.',
            ]);

        $this->assertDatabaseHas('product_attributes', [
            'id' => $attr->id,
            'name' => 'Updated Name',
        ]);

        $this->assertDatabaseHas('product_attribute_values', [
            'id' => $v1->id,
            'value' => 'Updated Value 1',
        ]);

        $this->assertDatabaseHas('product_attribute_values', [
            'attribute_id' => $attr->id,
            'value' => 'Brand New Value 2',
        ]);
    }

    /**
     * Admin can delete an attribute.
     */
    public function test_admin_can_delete_attribute(): void
    {
        $attr = ProductAttribute::create([
            'name' => 'To Be Deleted',
            'slug' => 'to-be-deleted',
        ]);
        $attr->values()->create(['value' => 'Val To Delete', 'slug' => 'val-to-delete']);

        $response = $this->actingAs($this->adminUser)->deleteJson("/admin/attributes/{$attr->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => "Attribute 'To Be Deleted' deleted successfully.",
            ]);

        $this->assertDatabaseMissing('product_attributes', [
            'id' => $attr->id,
        ]);
        $this->assertDatabaseMissing('product_attribute_values', [
            'attribute_id' => $attr->id,
        ]);
    }
}

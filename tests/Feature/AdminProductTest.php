<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Outlet;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminProductTest extends TestCase
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
            'name' => 'Admin Tester',
            'email' => 'admin_test_'.uniqid().'@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->adminUser->assignRole(UserRole::Admin->value);

        // Create Customer User
        $this->customerUser = User::factory()->create([
            'name' => 'Customer Tester',
            'email' => 'customer_test_'.uniqid().'@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->customerUser->assignRole(UserRole::Customer->value);
    }

    /**
     * Unauthenticated users cannot access admin products routes.
     */
    public function test_guest_cannot_access_admin_products(): void
    {
        $response = $this->get('/admin/products');
        $response->assertRedirect('/login');
    }

    /**
     * Customer role users cannot access admin products routes (403).
     */
    public function test_customer_cannot_access_admin_products(): void
    {
        $response = $this->actingAs($this->customerUser)->get('/admin/products');
        $response->assertStatus(403);
    }

    /**
     * Admin can get all products (get_all).
     */
    public function test_admin_can_get_all_products(): void
    {
        Product::create([
            'product_name' => 'Admin Test Sweet 1',
            'product_price' => 500.00,
            'product_selling_price' => 450.00,
            'product_qty' => 1,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->getJson('/admin/products');

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Products retrieved successfully.',
            ])
            ->assertJsonStructure([
                'success',
                'message',
                'count',
                'data',
            ]);

        // Explicit get-all alias
        $aliasResponse = $this->actingAs($this->adminUser)
            ->getJson('/admin/products/get-all');

        $aliasResponse->assertStatus(200)
            ->assertJson(['success' => true]);

        // Also test Inertia page rendering
        $pageResponse = $this->actingAs($this->adminUser)
            ->get('/admin/products');

        $pageResponse->assertStatus(200);
    }

    /**
     * Admin can view create product page.
     */
    public function test_admin_can_view_create_product_page(): void
    {
        $response = $this->actingAs($this->adminUser)
            ->get('/admin/products/create');

        $response->assertStatus(200);
    }

    /**
     * Admin can view edit product page.
     */
    public function test_admin_can_view_edit_product_page(): void
    {
        $product = Product::create([
            'product_name' => 'Barfi to Edit',
            'product_price' => 300.00,
            'product_selling_price' => 280.00,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get("/admin/products/{$product->id}/edit");

        $response->assertStatus(200);
    }

    /**
     * Admin can view single product by ID (getbyid).
     */
    public function test_admin_can_get_product_by_id(): void
    {
        $product = Product::create([
            'product_name' => 'Kaju Roll Special',
            'product_description' => 'Nutty roll wrapped in pure silver leaf',
            'product_price' => 600.00,
            'product_selling_price' => 550.00,
            'product_qty' => 4,
            'product_gallaries' => ['https://dayalsweets.com/roll.jpg'],
            'product_details' => ['Net Wt: 500g', 'Desi Ghee'],
        ]);
        $product->variations()->create([
            'variation_name' => '500g Box',
            'price' => 600.00,
            'selling_price' => 550.00,
            'product_qty' => 4,
            'is_default' => true,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->getJson("/admin/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'data' => [
                    'id' => $product->id,
                    'product_name' => 'Kaju Roll Special',
                    'min_price' => 550.00,
                    'total_stock' => 4,
                ],
            ]);

        // Explicit get/{id} alias
        $aliasResponse = $this->actingAs($this->adminUser)
            ->getJson("/admin/products/get/{$product->id}");

        $aliasResponse->assertStatus(200)
            ->assertJson(['success' => true]);
    }

    /**
     * Admin can create product with schema fields (create).
     */
    public function test_admin_can_create_product(): void
    {
        $payload = [
            'product_name' => 'Desi Ghee Motichoor Laddu',
            'product_description' => 'Pure desi ghee roasted besan laddu.',
            'product_price' => 480.00,
            'product_selling_price' => 430.00,
            'product_image' => 'https://dayalsweets.com/images/motichoor.jpg',
            'product_gallaries' => [
                'https://dayalsweets.com/images/laddu-open.jpg',
                'https://dayalsweets.com/images/laddu-box.jpg',
            ],
            'product_details' => [
                'Shelf Life: 20 Days',
                'Ingredients: Gram flour, Desi Ghee, Sugar, Cardamom',
                '100% Vegetarian',
            ],
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/admin/products', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'success' => true,
                'message' => 'Product created successfully.',
                'data' => [
                    'product_name' => 'Desi Ghee Motichoor Laddu',
                    'min_price' => 430.00,
                    'total_stock' => 1,
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'product_name' => 'Desi Ghee Motichoor Laddu',
            'product_price' => 480.00,
            'product_selling_price' => 430.00,
            'product_qty' => 1,
        ]);
    }

    /**
     * Admin can update a product (update).
     */
    public function test_admin_can_update_product(): void
    {
        $product = Product::create([
            'product_name' => 'Old Laddu Name',
            'product_price' => 300.00,
            'product_selling_price' => 280.00,
            'product_qty' => 1,
        ]);

        $updatePayload = [
            'product_name' => 'Updated Premium Laddu',
            'product_price' => 350.00,
            'product_selling_price' => 320.00,
            'product_qty' => 12,
            'product_details' => ['Fresh Sugar-Free Batch'],
        ];

        $response = $this->actingAs($this->adminUser)
            ->putJson("/admin/products/{$product->id}", $updatePayload);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product updated successfully.',
                'data' => [
                    'product_name' => 'Updated Premium Laddu',
                    'min_price' => 320.00,
                    'total_stock' => 12,
                ],
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'product_name' => 'Updated Premium Laddu',
            'product_price' => 350.00,
            'product_selling_price' => 320.00,
            'product_qty' => 12,
        ]);
    }

    /**
     * Admin can delete a product (delete).
     */
    public function test_admin_can_delete_product(): void
    {
        $product = Product::create([
            'product_name' => 'Product to be Deleted',
            'product_price' => 200.00,
            'product_selling_price' => 180.00,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->deleteJson("/admin/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Product deleted successfully.',
            ]);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    /**
     * Admin can upload image file during create and it is cleaned on delete.
     */
    public function test_admin_can_upload_and_delete_image(): void
    {
        Storage::fake('public');

        $file = UploadedFile::fake()->image('mithai_box.jpg', 500, 500);

        $payload = [
            'product_name' => 'Festive Mithai Hamper',
            'product_price' => 1200.00,
            'product_selling_price' => 1100.00,
            'product_image' => $file,
        ];

        $response = $this->actingAs($this->adminUser)
            ->post('/admin/products', $payload);

        $response->assertStatus(302); // Standard web redirect for non-json request
        $product = Product::where('product_name', 'Festive Mithai Hamper')->first();
        $this->assertNotNull($product);
        $this->assertNotNull($product->product_image);

        Storage::disk('public')->assertExists($product->product_image);

        // Delete product
        $deleteResponse = $this->actingAs($this->adminUser)
            ->delete("/admin/products/{$product->id}");

        $deleteResponse->assertStatus(302);
        Storage::disk('public')->assertMissing($product->product_image);
    }

    /**
     * Admin can create a product with inline variations.
     */
    public function test_admin_can_create_product_with_inline_variations(): void
    {
        $payload = [
            'product_name' => 'Royal Assorted Kaju Pack',
            'product_price' => 500.00,
            'product_selling_price' => 450.00,
            'product_qty' => 10,
            'variations' => [
                [
                    'variation_name' => '250g Box',
                    'price' => 260.00,
                    'selling_price' => 240.00,
                    'product_qty' => 20,
                    'weight_value' => 250,
                    'weight_unit' => 'g',
                    'sku' => 'RAK-250G',
                    'is_default' => false,
                ],
                [
                    'variation_name' => '500g Box',
                    'price' => 500.00,
                    'selling_price' => 450.00,
                    'product_qty' => 30,
                    'weight_value' => 500,
                    'weight_unit' => 'g',
                    'sku' => 'RAK-500G',
                    'is_default' => true,
                ],
            ],
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/admin/products', $payload);

        $response->assertStatus(201);
        $productId = $response->json('data.id');

        $this->assertDatabaseHas('products', [
            'id' => $productId,
            'product_name' => 'Royal Assorted Kaju Pack',
        ]);

        $this->assertDatabaseHas('product_variations', [
            'product_id' => $productId,
            'variation_name' => '250g Box',
            'selling_price' => 240.00,
            'is_default' => false,
        ]);

        $this->assertDatabaseHas('product_variations', [
            'product_id' => $productId,
            'variation_name' => '500g Box',
            'selling_price' => 450.00,
            'is_default' => true,
        ]);
    }

    /**
     * Admin can update a product and sync its inline variations.
     */
    public function test_admin_can_update_product_and_sync_inline_variations(): void
    {
        $product = Product::create([
            'product_name' => 'Dry Fruit Laddu',
            'product_price' => 400.00,
            'product_selling_price' => 380.00,
            'product_qty' => 5,
        ]);

        $v1 = $product->variations()->create([
            'variation_name' => 'Old 250g Pack',
            'price' => 220.00,
            'selling_price' => 200.00,
            'product_qty' => 15,
            'is_default' => true,
        ]);

        $vToDelete = $product->variations()->create([
            'variation_name' => 'Obsolete 100g Pack',
            'price' => 100.00,
            'selling_price' => 90.00,
            'product_qty' => 5,
            'is_default' => false,
        ]);

        $updatePayload = [
            'product_name' => 'Dry Fruit Laddu Premium',
            'variations' => [
                [
                    'id' => $v1->id,
                    'variation_name' => 'Updated 250g Pack',
                    'price' => 240.00,
                    'selling_price' => 220.00,
                    'product_qty' => 25,
                    'is_default' => false,
                ],
                [
                    'variation_name' => 'New 1kg Festive Pack',
                    'price' => 800.00,
                    'selling_price' => 750.00,
                    'product_qty' => 10,
                    'is_default' => true,
                ],
            ],
        ];

        $response = $this->actingAs($this->adminUser)
            ->putJson("/admin/products/{$product->id}", $updatePayload);

        $response->assertStatus(200);

        // v1 updated
        $this->assertDatabaseHas('product_variations', [
            'id' => $v1->id,
            'variation_name' => 'Updated 250g Pack',
            'selling_price' => 220.00,
        ]);

        // new variation created
        $this->assertDatabaseHas('product_variations', [
            'product_id' => $product->id,
            'variation_name' => 'New 1kg Festive Pack',
            'is_default' => true,
        ]);

        // vToDelete removed
        $this->assertDatabaseMissing('product_variations', [
            'id' => $vToDelete->id,
        ]);
    }

    /**
     * Admin can create and update product with assigned outlets.
     */
    public function test_admin_can_create_and_sync_product_outlets(): void
    {
        $outlet1 = Outlet::create([
            'name' => 'Outlet Alpha',
            'slug' => 'outlet-alpha',
            'address' => 'Alpha Address',
            'status' => 'active',
        ]);
        $outlet2 = Outlet::create([
            'name' => 'Outlet Beta',
            'slug' => 'outlet-beta',
            'address' => 'Beta Address',
            'status' => 'active',
        ]);

        $payload = [
            'product_name' => 'Kaju Katli Special',
            'product_price' => 500.00,
            'product_selling_price' => 450.00,
            'outlet_ids' => [$outlet1->id, $outlet2->id],
        ];

        $response = $this->actingAs($this->adminUser)->postJson('/admin/products', $payload);
        $response->assertStatus(201);

        $productId = $response->json('data.id');
        $product = Product::with('outlets')->findOrFail($productId);
        $this->assertCount(2, $product->outlets);
        $this->assertTrue($product->outlets->contains('id', $outlet1->id));
        $this->assertTrue($product->outlets->contains('id', $outlet2->id));

        // Test update can sync outlets
        $updatePayload = [
            'product_name' => 'Kaju Katli Special Updated',
            'product_price' => 500.00,
            'product_selling_price' => 450.00,
            'outlet_ids' => [$outlet1->id], // Remove outlet2
        ];
        $updateResponse = $this->actingAs($this->adminUser)->putJson("/admin/products/{$product->id}", $updatePayload);
        $updateResponse->assertStatus(200);

        $product->refresh();
        $this->assertCount(1, $product->outlets);
        $this->assertTrue($product->outlets->contains('id', $outlet1->id));
        $this->assertFalse($product->outlets->contains('id', $outlet2->id));
    }
}

<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class AdminCategoryTest extends TestCase
{
    use DatabaseTransactions;

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
            'name' => 'Admin Category Tester',
            'email' => 'admin_cat_test_'.uniqid().'@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->adminUser->assignRole(UserRole::Admin->value);

        // Create Customer User
        $this->customerUser = User::factory()->create([
            'name' => 'Customer Category Tester',
            'email' => 'customer_cat_test_'.uniqid().'@dayalsweets.com',
            'email_verified_at' => now(),
        ]);
        $this->customerUser->assignRole(UserRole::Customer->value);
    }

    /**
     * Guest cannot access category admin routes.
     */
    public function test_guest_cannot_access_admin_categories(): void
    {
        $response = $this->get('/admin/categories');
        $response->assertRedirect('/login');
    }

    /**
     * Customer role cannot access admin categories (403).
     */
    public function test_customer_cannot_access_admin_categories(): void
    {
        $response = $this->actingAs($this->customerUser)->get('/admin/categories');
        $response->assertStatus(403);
    }

    /**
     * Admin can view category index page and fetch get_all JSON.
     */
    public function test_admin_can_get_all_categories(): void
    {
        $category = Category::create([
            'category_name' => 'Kaju Sweets '.uniqid(),
            'category_slug' => 'kaju-sweets-'.uniqid(),
            'category_description' => 'Fine cashews and royal silver foil',
        ]);

        // Web Inertia request
        $webResponse = $this->actingAs($this->adminUser)->get('/admin/categories');
        $webResponse->assertStatus(200);

        // JSON / API-style request on web route
        $jsonResponse = $this->actingAs($this->adminUser)->getJson('/admin/categories');
        $jsonResponse->assertStatus(200)
            ->assertJsonPath('success', true);

        // Alias route: admin/categories/get_all
        $aliasResponse = $this->actingAs($this->adminUser)->get('/admin/categories/get_all');
        $aliasResponse->assertStatus(200);
    }

    /**
     * Admin can see category create form.
     */
    public function test_admin_can_view_create_category_form(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/categories/create');
        $response->assertStatus(200);
    }

    /**
     * Admin can store a new category with auto-generated slug.
     */
    public function test_admin_can_create_category_with_auto_slug(): void
    {
        Storage::fake('public');

        $fakeImage = UploadedFile::fake()->image('category_banner.jpg', 600, 400);

        $payload = [
            'category_name' => 'Artisanal Barfi Collection',
            'category_description' => 'Slow cooked rich milk confections',
            'category_image' => $fakeImage,
        ];

        $response = $this->actingAs($this->adminUser)
            ->post('/admin/categories', $payload);

        $response->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('product_categories', [
            'category_name' => 'Artisanal Barfi Collection',
            'category_slug' => 'artisanal-barfi-collection',
            'category_description' => 'Slow cooked rich milk confections',
        ]);

        $category = Category::where('category_name', 'Artisanal Barfi Collection')->first();
        $this->assertNotNull($category->category_image);
        Storage::disk('public')->assertExists($category->category_image);
    }

    /**
     * Admin can store a category via JSON and receive json response.
     */
    public function test_admin_can_store_category_via_json(): void
    {
        $payload = [
            'category_name' => 'Desi Ghee Laddus',
            'category_slug' => 'desi-ghee-laddus-special',
            'category_description' => 'Traditional bespoke motichoor and besan laddus',
        ];

        $response = $this->actingAs($this->adminUser)
            ->postJson('/admin/categories', $payload);

        $response->assertStatus(201)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.category_name', 'Desi Ghee Laddus')
            ->assertJsonPath('data.category_slug', 'desi-ghee-laddus-special');
    }

    /**
     * Admin can view category by id (getbyid) with 10 associated products.
     */
    public function test_admin_can_get_category_by_id_with_demo_10_products(): void
    {
        $category = Category::create([
            'category_name' => 'Royal Heritage Mithai',
            'category_slug' => 'royal-heritage-mithai-'.uniqid(),
            'category_description' => 'Top shelf festive sweets',
        ]);

        // Create 10 demo products linked to this category
        for ($i = 1; $i <= 10; $i++) {
            Product::create([
                'category_id' => $category->id,
                'product_name' => "Heritage Sweet Item {$i}",
                'product_price' => 600.00,
                'product_selling_price' => 550.00,
                'product_qty' => $i * 5,
                'product_description' => "Item {$i} description in Royal Heritage",
                'product_details' => ['Pure Ghee', 'Saffron Infused'],
            ]);
        }

        // Web request
        $response = $this->actingAs($this->adminUser)
            ->get("/admin/categories/{$category->id}");
        $response->assertStatus(200);

        // JSON / getbyid route
        $jsonResponse = $this->actingAs($this->adminUser)
            ->getJson("/admin/categories/{$category->id}");

        $jsonResponse->assertStatus(200)
            ->assertJsonPath('success', true)
            ->assertJsonPath('data.id', $category->id)
            ->assertJsonPath('data.category_name', 'Royal Heritage Mithai');

        $data = $jsonResponse->json('data');
        $this->assertCount(10, $data['products']);
    }

    /**
     * Admin can see category edit form.
     */
    public function test_admin_can_view_edit_category_form(): void
    {
        $category = Category::create([
            'category_name' => 'Peda Varieties',
            'category_slug' => 'peda-varieties-'.uniqid(),
            'category_description' => 'Mathura and Malai peda',
        ]);

        $response = $this->actingAs($this->adminUser)
            ->get("/admin/categories/{$category->id}/edit");
        $response->assertStatus(200);
    }

    /**
     * Admin can update category details.
     */
    public function test_admin_can_update_category(): void
    {
        $category = Category::create([
            'category_name' => 'Original Name',
            'category_slug' => 'original-name-'.uniqid(),
            'category_description' => 'Old description',
        ]);

        $updatePayload = [
            'category_name' => 'Updated Name',
            'category_slug' => 'updated-unique-slug-'.uniqid(),
            'category_description' => 'Brand new updated description',
        ];

        $response = $this->actingAs($this->adminUser)
            ->put("/admin/categories/{$category->id}", $updatePayload);

        $response->assertRedirect('/admin/categories');

        $this->assertDatabaseHas('product_categories', [
            'id' => $category->id,
            'category_name' => 'Updated Name',
            'category_description' => 'Brand new updated description',
        ]);
    }

    /**
     * Admin can delete a category, and associated products have category_id set to null (nullOnDelete).
     */
    public function test_admin_can_delete_category_and_products_foreign_key_becomes_null(): void
    {
        $category = Category::create([
            'category_name' => 'Category To Delete',
            'category_slug' => 'category-to-delete-'.uniqid(),
        ]);

        $product = Product::create([
            'category_id' => $category->id,
            'product_name' => 'Sweet Linked To Cat',
            'product_price' => 300,
            'product_selling_price' => 280,
            'product_qty' => 10,
        ]);

        $response = $this->actingAs($this->adminUser)
            ->delete("/admin/categories/{$category->id}");

        $response->assertRedirect('/admin/categories');

        $this->assertDatabaseMissing('product_categories', [
            'id' => $category->id,
        ]);

        // Product should remain intact with category_id set to null
        $product->refresh();
        $this->assertNull($product->category_id);
    }
}

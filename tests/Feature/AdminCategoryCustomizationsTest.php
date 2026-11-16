<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\DietPreference;
use App\Models\Occasion;
use App\Models\Product;
use App\Models\ProductTag;
use App\Models\SeasonalMithai;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminCategoryCustomizationsTest extends TestCase
{
    use RefreshDatabase;

    protected User $adminUser;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (UserRole::values() as $role) {
            \Spatie\Permission\Models\Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }

        $this->adminUser = User::factory()->create([
            'email_verified_at' => now(),
        ]);
        $this->adminUser->assignRole(UserRole::Admin->value);
    }

    public function test_admin_can_view_product_create_page_with_all_category_props(): void
    {
        Category::create(['category_name' => 'Sweets & Mithai']);
        SeasonalMithai::create(['category_name' => 'Diwali']);
        Occasion::create(['category_name' => 'Wedding']);
        DietPreference::create(['category_name' => 'Sugar Free']);
        ProductTag::create(['product_tag_name' => 'Bestseller']);

        $response = $this->actingAs($this->adminUser)->get('/admin/products/create');

        $response->assertStatus(200);
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Products/Create')
            ->has('categories', 1)
            ->has('seasonalMithais', 1)
            ->has('occasions', 1)
            ->has('dietPreferences', 1)
            ->has('tags', 1)
        );
    }

    public function test_admin_can_create_product_with_separate_categories_and_tags(): void
    {
        $category = Category::create(['category_name' => 'Sweets & Mithai']);
        $season = SeasonalMithai::create(['category_name' => 'Diwali']);
        $occasion = Occasion::create(['category_name' => 'Wedding']);
        $diet = DietPreference::create(['category_name' => 'Sugar Free']);
        $tag1 = ProductTag::create(['product_tag_name' => 'Bestseller']);
        $tag2 = ProductTag::create(['product_tag_name' => 'Pure Desi Ghee']);

        $payload = [
            'category_id' => $category->id,
            'seasonal_mithai_id' => $season->id,
            'occasion_id' => $occasion->id,
            'diet_preference_id' => $diet->id,
            'tag_ids' => [$tag1->id, $tag2->id],
            'product_name' => 'Kaju Katli Special',
            'product_description' => 'Fine silver leaf kaju katli',
            'product_price' => 500,
            'product_selling_price' => 450,
            'product_qty' => 20,
        ];

        $response = $this->actingAs($this->adminUser)->post('/admin/products', $payload);

        $response->assertStatus(302);
        $this->assertDatabaseHas('products', [
            'product_name' => 'Kaju Katli Special',
            'category_id' => $category->id,
            'seasonal_mithai_id' => $season->id,
            'occasion_id' => $occasion->id,
            'diet_preference_id' => $diet->id,
            'product_tag_id' => $tag1->id,
        ]);

        $created = Product::where('product_name', 'Kaju Katli Special')->firstOrFail();
        $this->assertCount(2, $created->tags);
        $this->assertTrue($created->tags->pluck('id')->contains($tag1->id));
        $this->assertTrue($created->tags->pluck('id')->contains($tag2->id));
    }

    public function test_admin_can_update_product_separate_categories_and_tags(): void
    {
        $category = Category::create(['category_name' => 'Sweets & Mithai']);
        $season = SeasonalMithai::create(['category_name' => 'Holi']);
        $occasion = Occasion::create(['category_name' => 'Festival']);
        $diet = DietPreference::create(['category_name' => 'Low Sugar']);
        $tag = ProductTag::create(['product_tag_name' => 'Heritage Recipe']);

        $product = Product::create([
            'category_id' => $category->id,
            'product_name' => 'Gujiya',
            'product_price' => 400,
            'product_selling_price' => 380,
            'product_qty' => 10,
        ]);

        $updatePayload = [
            'category_id' => $category->id,
            'seasonal_mithai_id' => $season->id,
            'occasion_id' => $occasion->id,
            'diet_preference_id' => $diet->id,
            'product_tag_id' => $tag->id,
            'tag_ids' => [$tag->id],
            'product_name' => 'Special Mawa Gujiya',
            'product_price' => 420,
            'product_selling_price' => 400,
            'product_qty' => 15,
        ];

        $response = $this->actingAs($this->adminUser)->put("/admin/products/{$product->id}", $updatePayload);

        $response->assertStatus(302);
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'product_name' => 'Special Mawa Gujiya',
            'seasonal_mithai_id' => $season->id,
            'occasion_id' => $occasion->id,
            'diet_preference_id' => $diet->id,
            'product_tag_id' => $tag->id,
        ]);

        $product->refresh();
        $this->assertCount(1, $product->tags);
        $this->assertEquals('Heritage Recipe', $product->tags->first()->product_tag_name);
    }

    public function test_admin_can_crud_product_tags(): void
    {
        $response = $this->actingAs($this->adminUser)->get('/admin/product-tags');
        $response->assertStatus(200);

        $createResponse = $this->actingAs($this->adminUser)->post('/admin/product-tags', [
            'product_tag_name' => 'Chef Choice',
            'product_tag_description' => 'Selected by head chef',
        ]);
        $createResponse->assertStatus(302);

        $this->assertDatabaseHas('product_tags', [
            'product_tag_name' => 'Chef Choice',
            'product_tag_slug' => 'chef-choice',
        ]);

        $tag = ProductTag::where('product_tag_name', 'Chef Choice')->firstOrFail();

        $updateResponse = $this->actingAs($this->adminUser)->put("/admin/product-tags/{$tag->id}", [
            'product_tag_name' => 'Master Chef Choice',
            'product_tag_description' => 'Updated desc',
        ]);
        $updateResponse->assertStatus(302);
        $this->assertDatabaseHas('product_tags', [
            'id' => $tag->id,
            'product_tag_name' => 'Master Chef Choice',
        ]);

        $deleteResponse = $this->actingAs($this->adminUser)->delete("/admin/product-tags/{$tag->id}");
        $deleteResponse->assertStatus(302);
        $this->assertDatabaseMissing('product_tags', ['id' => $tag->id]);
    }
}

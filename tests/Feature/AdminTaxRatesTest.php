<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Category;
use App\Models\Product;
use App\Models\TaxRate;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTaxRatesTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(UserRole::Admin->value);
    }

    public function test_guest_cannot_access_taxes(): void
    {
        $response = $this->get('/admin/taxes');
        $response->assertRedirect('/login');
    }

    public function test_admin_can_view_taxes_index(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/taxes');
        $response->assertOk();
    }

    public function test_admin_can_get_all_taxes_via_json(): void
    {
        $response = $this->actingAs($this->admin)->getJson('/admin/taxes/get-all');

        $response->assertOk()
            ->assertJsonPath('success', true);
    }

    public function test_admin_can_view_create_tax_page(): void
    {
        $response = $this->actingAs($this->admin)->get('/admin/taxes/create');
        $response->assertOk();
    }

    public function test_admin_can_create_tax_rate(): void
    {
        $payload = [
            'name' => 'Custom Bakery GST',
            'code' => 'GST-CUSTOM',
            'rate' => 12.50,
            'type' => 'percent',
            'tax_class' => 'standard',
            'description' => 'Custom test tax class',
            'is_active' => true,
            'is_compound' => false,
            'apply_to_shipping' => true,
            'priority' => 1,
        ];

        $response = $this->actingAs($this->admin)->post('/admin/taxes', $payload);
        $response->assertRedirect('/admin/taxes');

        $this->assertDatabaseHas('tax_rates', [
            'code' => 'GST-CUSTOM',
            'rate' => 12.50,
        ]);
    }

    public function test_admin_can_update_tax_rate(): void
    {
        $rate = TaxRate::create([
            'name' => 'Old Rate',
            'code' => 'GST-OLD',
            'rate' => 5.00,
            'type' => 'percent',
            'tax_class' => 'standard',
            'is_active' => true,
        ]);

        $payload = [
            'name' => 'Updated Rate',
            'code' => 'GST-OLD',
            'rate' => 6.00,
            'type' => 'percent',
            'tax_class' => 'reduced_rate',
            'is_active' => false,
        ];

        $response = $this->actingAs($this->admin)->put("/admin/taxes/{$rate->id}", $payload);
        $response->assertRedirect('/admin/taxes');

        $this->assertDatabaseHas('tax_rates', [
            'id' => $rate->id,
            'name' => 'Updated Rate',
            'rate' => 6.00,
            'is_active' => false,
        ]);
    }

    public function test_admin_can_delete_tax_rate(): void
    {
        $rate = TaxRate::create([
            'name' => 'Delete Me',
            'code' => 'GST-DEL',
            'rate' => 28.00,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->delete("/admin/taxes/{$rate->id}");
        $response->assertRedirect('/admin/taxes');

        $this->assertDatabaseMissing('tax_rates', ['id' => $rate->id]);
    }

    public function test_tax_calculation_on_product(): void
    {
        $tax18 = TaxRate::where('code', 'GST-18')->first();
        $this->assertNotNull($tax18);

        $category = Category::first();

        // Create product with 18% tax and price 1000
        $product = Product::create([
            'category_id' => $category->id,
            'tax_rate_id' => $tax18->id,
            'tax_status' => 'taxable',
            'product_name' => 'Premium Gift Box',
            'product_price' => 1200.00,
            'product_selling_price' => 1000.00,
            'product_qty' => 10,
        ]);

        // Base price = 1000.00, tax 18% = 180.00, price with tax = 1180.00
        $this->assertEquals(180.00, $product->tax_amount);
        $this->assertEquals(1180.00, $product->price_with_tax);

        // Product with tax_status = 'none' should have 0 tax
        $product->update(['tax_status' => 'none']);
        $product = $product->fresh();
        $this->assertEquals(0.00, $product->tax_amount);
        $this->assertEquals(1000.00, $product->price_with_tax);
    }
}

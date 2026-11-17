<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class ProductReviewTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        foreach (UserRole::values() as $role) {
            Role::firstOrCreate(['name' => $role, 'guard_name' => 'web']);
        }
    }

    private function createProduct(array $attributes = []): Product
    {
        return Product::create(array_merge([
            'product_name' => 'Kaju Katli Special',
            'product_price' => 500.00,
            'product_selling_price' => 450.00,
            'rating' => 5.00,
            'rating_count' => 0,
        ], $attributes));
    }

    private function createOrderForCustomer(User $customer, Product $product, string $status = 'delivered'): Order
    {
        $order = Order::create([
            'user_id' => $customer->id,
            'customer_name' => $customer->name,
            'customer_email' => $customer->email,
            'customer_phone' => '9876543210',
            'shipping_address' => 'Civil Lines',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'subtotal' => 450,
            'total_amount' => 450,
            'payment_method' => 'cod',
            'payment_status' => 'paid',
            'delivery_status' => $status,
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'product_name' => $product->product_name,
            'variation_name' => '500g',
            'unit_price' => 450,
            'quantity' => 1,
            'subtotal' => 450,
            'total' => 450,
        ]);

        return $order;
    }

    public function test_guest_cannot_submit_product_review(): void
    {
        $product = $this->createProduct();

        $response = $this->post('/customer/reviews', [
            'product_id' => $product->id,
            'rating' => 5,
            'review' => 'Delicious!',
        ]);

        $response->assertRedirect('/login');
    }

    public function test_customer_cannot_rate_product_before_delivery(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $product = $this->createProduct();

        // Order is still pending / out for delivery
        $this->createOrderForCustomer($customer, $product, 'pending');

        $response = $this->actingAs($customer)->post('/customer/reviews', [
            'product_id' => $product->id,
            'rating' => 5,
            'review' => 'Excited to try!',
        ]);

        $response->assertSessionHasErrors('rating');
        $this->assertDatabaseMissing('product_reviews', [
            'product_id' => $product->id,
            'user_id' => $customer->id,
        ]);
    }

    public function test_customer_can_submit_rating_and_review_after_delivery(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $product = $this->createProduct();
        $this->createOrderForCustomer($customer, $product, 'delivered');

        $response = $this->actingAs($customer)->post('/customer/reviews', [
            'product_id' => $product->id,
            'rating' => 4,
            'review' => 'Pure desi ghee taste, very fresh!',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('product_reviews', [
            'product_id' => $product->id,
            'user_id' => $customer->id,
            'rating' => 4,
            'review' => 'Pure desi ghee taste, very fresh!',
            'is_verified_purchase' => true,
        ]);

        $freshProduct = $product->fresh();
        $this->assertEquals(4.00, (float) $freshProduct->rating);
        $this->assertEquals(1, $freshProduct->rating_count);
    }

    public function test_review_submission_marks_verified_purchase_if_ordered(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $product = $this->createProduct();
        $order = $this->createOrderForCustomer($customer, $product, 'delivered');

        $response = $this->actingAs($customer)->post('/customer/reviews', [
            'product_id' => $product->id,
            'order_id' => $order->id,
            'rating' => 5,
            'review' => 'Best Kaju Katli in town!',
        ]);

        $response->assertSessionHas('success');

        $review = ProductReview::where('product_id', $product->id)->where('user_id', $customer->id)->first();
        $this->assertNotNull($review);
        $this->assertTrue((bool) $review->is_verified_purchase);
    }

    public function test_subsequent_review_updates_existing_review_and_recalculates_average(): void
    {
        $customer1 = User::factory()->create();
        $customer1->assignRole(UserRole::Customer->value);

        $customer2 = User::factory()->create();
        $customer2->assignRole(UserRole::Customer->value);

        $product = $this->createProduct();
        $this->createOrderForCustomer($customer1, $product, 'delivered');
        $this->createOrderForCustomer($customer2, $product, 'delivered');

        // Customer 1 rates 5
        $this->actingAs($customer1)->post('/customer/reviews', [
            'product_id' => $product->id,
            'rating' => 5,
            'review' => 'Top notch!',
        ]);

        // Customer 2 rates 3
        $this->actingAs($customer2)->post('/customer/reviews', [
            'product_id' => $product->id,
            'rating' => 3,
            'review' => 'Average sweetness.',
        ]);

        $freshProduct = $product->fresh();
        // (5 + 3) / 2 = 4.00
        $this->assertEquals(4.00, (float) $freshProduct->rating);
        $this->assertEquals(2, $freshProduct->rating_count);

        // Customer 2 updates rating to 5
        $this->actingAs($customer2)->post('/customer/reviews', [
            'product_id' => $product->id,
            'rating' => 5,
            'review' => 'Tried again warm, loved it!',
        ]);

        $updatedProduct = $product->fresh();
        // (5 + 5) / 2 = 5.00
        $this->assertEquals(5.00, (float) $updatedProduct->rating);
        $this->assertEquals(2, $updatedProduct->rating_count);
    }

    public function test_review_succeeds_when_order_item_initially_had_null_product_id(): void
    {
        $customer = User::factory()->create();
        $customer->assignRole(UserRole::Customer->value);

        $product = $this->createProduct(['product_name' => 'Artisan Chocolate Brownie Box']);

        $order = Order::create([
            'user_id' => $customer->id,
            'customer_name' => $customer->name,
            'customer_email' => $customer->email,
            'customer_phone' => '9876543210',
            'shipping_address' => 'Civil Lines',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'subtotal' => 300,
            'total_amount' => 350,
            'payment_method' => 'razorpay',
            'payment_status' => 'paid',
            'delivery_status' => 'delivered',
        ]);

        // Simulating legacy or external checkout where product_id was NULL on OrderItem
        $item = OrderItem::create([
            'order_id' => $order->id,
            'product_id' => null,
            'product_name' => 'Artisan Chocolate Brownie Box - Single Piece 80g',
            'unit_price' => 150,
            'quantity' => 2,
            'subtotal' => 300,
            'total' => 300,
        ]);

        $response = $this->actingAs($customer)->post('/customer/reviews', [
            'product_id' => $product->id,
            'order_id' => $order->id,
            'rating' => 5,
            'review' => 'Superb brownies, very rich!',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('product_reviews', [
            'product_id' => $product->id,
            'user_id' => $customer->id,
            'rating' => 5,
        ]);

        // Order item should now be automatically linked to product_id
        $this->assertEquals($product->id, $item->fresh()->product_id);
    }
}

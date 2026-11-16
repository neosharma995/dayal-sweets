<?php

declare(strict_types=1);

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\RazorpayService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderAndRazorpayTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $customer;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seed();

        $this->admin = User::factory()->create();
        $this->admin->assignRole(UserRole::Admin->value);

        $this->customer = User::factory()->create([
            'name' => 'Gurpreet Singh',
            'email' => 'gurpreet@example.com',
        ]);
        $this->customer->assignRole(UserRole::Customer->value);
    }

    public function test_guest_cannot_create_razorpay_order(): void
    {
        $response = $this->postJson('/checkout/create-razorpay-order', [
            'customer_name' => 'Guest User',
            'customer_email' => 'guest@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Mall Road',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'items' => [
                ['name' => 'Kaju Katli', 'price' => 500, 'quantity' => 1],
            ],
        ]);

        $response->assertUnauthorized();
    }

    public function test_authenticated_customer_can_create_razorpay_order(): void
    {
        $payload = [
            'customer_name' => 'Gurpreet Singh',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'House 42, Civil Lines',
            'apartment' => 'Suite 1',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'shipping_method_title' => 'Express Kitchen Dispatch',
            'shipping_cost' => 50,
            'items' => [
                [
                    'name' => 'Pure Desi Ghee Besan Laddu',
                    'price' => 350,
                    'quantity' => 2,
                    'variationLabel' => '1kg Box',
                ],
            ],
        ];

        $response = $this->actingAs($this->customer)
            ->postJson('/checkout/create-razorpay-order', $payload);

        $response->assertOk()
            ->assertJsonPath('success', true)
            ->assertJsonStructure([
                'success',
                'order_id',
                'order_number',
                'razorpay_order_id',
                'amount',
                'currency',
            ]);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh',
            'city' => 'Una',
            'delivery_status' => 'pending',
            'payment_status' => 'pending',
            'payment_method' => 'razorpay',
            'total_amount' => 750, // (350 * 2) + 50
        ]);

        $orderId = $response->json('order_id');
        $this->assertDatabaseHas('order_items', [
            'order_id' => $orderId,
            'product_name' => 'Pure Desi Ghee Besan Laddu',
            'quantity' => 2,
        ]);
    }

    public function test_payment_verification_updates_order_to_paid(): void
    {
        $order = Order::create([
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Civil Lines',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'subtotal' => 700,
            'total_amount' => 700,
            'payment_method' => 'razorpay',
            'payment_status' => 'pending',
            'delivery_status' => 'pending',
            'razorpay_order_id' => 'order_test_12345',
        ]);

        $secret = config('services.razorpay.secret', 'b6aFOf8O1MI0jatA8upm15UQ');
        $signature = hash_hmac('sha256', 'order_test_12345|pay_test_99999', $secret);

        $response = $this->actingAs($this->customer)
            ->postJson('/checkout/verify-payment', [
                'order_id' => $order->id,
                'razorpay_order_id' => 'order_test_12345',
                'razorpay_payment_id' => 'pay_test_99999',
                'razorpay_signature' => $signature,
            ]);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $order->refresh();
        $this->assertEquals('paid', $order->payment_status);
        $this->assertNotNull($order->paid_at);
        $this->assertEquals('pay_test_99999', $order->razorpay_payment_id);
    }

    public function test_customer_can_place_cod_order(): void
    {
        $payload = [
            'customer_name' => 'Gurpreet Singh',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Near Gurudwara',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'shipping_cost' => 0,
            'items' => [
                [
                    'name' => 'Kaju Katli Special',
                    'price' => 450,
                    'quantity' => 1,
                ],
            ],
        ];

        $response = $this->actingAs($this->customer)
            ->postJson('/checkout/place-cod-order', $payload);

        $response->assertOk()
            ->assertJsonPath('success', true);

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->customer->id,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'delivery_status' => 'pending',
            'total_amount' => 450,
        ]);
    }

    public function test_customer_dashboard_and_account_show_purchased_records(): void
    {
        $order = Order::create([
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Civil Lines',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'subtotal' => 600,
            'total_amount' => 600,
            'payment_method' => 'razorpay',
            'payment_status' => 'paid',
            'delivery_status' => 'shipping',
        ]);

        OrderItem::create([
            'order_id' => $order->id,
            'product_name' => 'Desi Ghee Motichoor Laddu',
            'unit_price' => 300,
            'quantity' => 2,
            'subtotal' => 600,
            'total' => 600,
        ]);

        // Customer Dashboard
        $dashResponse = $this->actingAs($this->customer)
            ->get('/customer/dashboard');

        $dashResponse->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Customer/Dashboard')
                ->where('activeOrder.order_id', $order->order_number)
                ->where('activeOrder.delivery_status', 'shipping')
                ->has('recentPastOrders', 1)
            );

        // Customer Account Orders
        $accResponse = $this->actingAs($this->customer)
            ->get('/customer/account');

        $accResponse->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Customer/Account')
                ->has('orderHistory', 1)
                ->where('orderHistory.0.order_id', $order->order_number)
            );
    }

    public function test_admin_can_view_orders_list(): void
    {
        $order = Order::create([
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Civil Lines',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'subtotal' => 500,
            'total_amount' => 500,
            'payment_method' => 'razorpay',
            'payment_status' => 'paid',
            'delivery_status' => 'pending',
        ]);

        $response = $this->actingAs($this->admin)->get('/admin/orders');

        $response->assertOk()
            ->assertInertia(fn ($page) => $page
                ->component('Admin/Orders/Index')
                ->has('orders.data', 1)
                ->where('counts.pending', 1)
            );
    }

    public function test_admin_can_update_order_status_through_pending_shipping_delivered(): void
    {
        $order = Order::create([
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Civil Lines',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'subtotal' => 500,
            'total_amount' => 500,
            'payment_method' => 'cod',
            'payment_status' => 'pending',
            'delivery_status' => 'pending',
        ]);

        // Step 1: Update to shipping
        $resp1 = $this->actingAs($this->admin)
            ->patch("/admin/orders/{$order->id}/status", [
                'delivery_status' => 'shipping',
            ]);

        $resp1->assertRedirect();
        $order->refresh();
        $this->assertEquals('shipping', $order->delivery_status);
        $this->assertNotNull($order->shipped_at);

        // Step 2: Update to delivered and paid
        $resp2 = $this->actingAs($this->admin)
            ->patch("/admin/orders/{$order->id}/status", [
                'delivery_status' => 'delivered',
                'payment_status' => 'paid',
            ]);

        $resp2->assertRedirect();
        $order->refresh();
        $this->assertEquals('delivered', $order->delivery_status);
        $this->assertEquals('paid', $order->payment_status);
        $this->assertNotNull($order->delivered_at);
        $this->assertNotNull($order->paid_at);
    }

    public function test_admin_can_manually_create_order(): void
    {
        $payload = [
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh (Admin Order)',
            'customer_email' => 'gurpreet@example.com',
            'customer_phone' => '9876543210',
            'shipping_address' => 'Main Market, Shop 4',
            'city' => 'Una',
            'state' => 'Himachal Pradesh',
            'pincode' => '174303',
            'shipping_cost' => 0,
            'payment_method' => 'cash',
            'payment_status' => 'paid',
            'delivery_status' => 'delivered',
            'items' => [
                [
                    'product_name' => 'Royal Gulab Jamun Matka',
                    'unit_price' => 400,
                    'quantity' => 2,
                ],
            ],
        ];

        $response = $this->actingAs($this->admin)
            ->post('/admin/orders', $payload);

        $response->assertRedirect('/admin/orders');

        $this->assertDatabaseHas('orders', [
            'user_id' => $this->customer->id,
            'customer_name' => 'Gurpreet Singh (Admin Order)',
            'payment_method' => 'cash',
            'payment_status' => 'paid',
            'delivery_status' => 'delivered',
            'total_amount' => 800,
        ]);
    }
}

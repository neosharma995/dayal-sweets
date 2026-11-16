<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariation;
use App\Services\RazorpayService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CheckoutController extends Controller
{
    public function __construct(
        protected RazorpayService $razorpayService
    ) {}

    /**
     * Create Razorpay Order and store pending order in DB.
     */
    public function createRazorpayOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:25'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'apartment' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'pincode' => ['required', 'string', 'max:20'],
            'shipping_method_title' => ['nullable', 'string', 'max:100'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'order_notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.id' => ['nullable'],
            'items.*.variationId' => ['nullable'],
            'items.*.variationLabel' => ['nullable', 'string'],
            'items.*.image' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $shippingCost = (float) ($validated['shipping_cost'] ?? 0);

        try {
            return DB::transaction(function () use ($validated, $user, $shippingCost) {
                // Calculate subtotal from items
                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $subtotal += ((float) $item['price']) * ((int) $item['quantity']);
                }

                $taxAmount = 0; // Tax can be included or calculated
                $totalAmount = $subtotal + $shippingCost + $taxAmount;

                // Create local Order
                $order = Order::create([
                    'user_id' => $user->id,
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'shipping_address' => $validated['shipping_address'],
                    'apartment' => $validated['apartment'] ?? null,
                    'city' => $validated['city'],
                    'state' => $validated['state'],
                    'pincode' => $validated['pincode'],
                    'shipping_method_title' => $validated['shipping_method_title'] ?? 'Standard Delivery',
                    'shipping_cost' => $shippingCost,
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'currency' => 'INR',
                    'payment_method' => 'razorpay',
                    'payment_status' => 'pending',
                    'delivery_status' => 'pending',
                    'order_notes' => $validated['order_notes'] ?? null,
                ]);

                // Create Order Items
                foreach ($validated['items'] as $item) {
                    $itemPrice = (float) $item['price'];
                    $itemQty = (int) $item['quantity'];
                    $itemTotal = $itemPrice * $itemQty;

                    $productId = is_numeric($item['id'] ?? null) ? (int) $item['id'] : null;
                    if ($productId && !Product::where('id', $productId)->exists()) {
                        $productId = null;
                    }

                    $variationId = is_numeric($item['variationId'] ?? null) ? (int) $item['variationId'] : null;
                    if ($variationId && !ProductVariation::where('id', $variationId)->exists()) {
                        $variationId = null;
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $productId,
                        'product_variation_id' => $variationId,
                        'product_name' => $item['name'],
                        'variation_name' => $item['variationLabel'] ?? null,
                        'unit_price' => $itemPrice,
                        'quantity' => $itemQty,
                        'tax_rate_percent' => 0,
                        'tax_amount' => 0,
                        'subtotal' => $itemTotal,
                        'total' => $itemTotal,
                        'product_image' => $item['image'] ?? null,
                    ]);
                }

                // Call Razorpay API to generate order
                $razorpayOrder = $this->razorpayService->createOrder(
                    $totalAmount,
                    $order->order_number,
                    [
                        'order_id' => (string) $order->id,
                        'customer_id' => (string) $user->id,
                    ]
                );

                $order->update([
                    'razorpay_order_id' => $razorpayOrder['id'],
                ]);

                return response()->json([
                    'success' => true,
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'razorpay_order_id' => $razorpayOrder['id'],
                    'amount' => $razorpayOrder['amount'],
                    'currency' => $razorpayOrder['currency'] ?? 'INR',
                    'key' => $this->razorpayService->getKeyId(),
                    'customer' => [
                        'name' => $order->customer_name,
                        'email' => $order->customer_email,
                        'contact' => $order->customer_phone,
                    ],
                ]);
            });
        } catch (Exception $e) {
            Log::error('Checkout Razorpay Order Creation Error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Unable to initialize online payment: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Verify payment signature from Razorpay.
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['required', 'integer'],
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
        ]);

        $order = Order::where('id', $validated['order_id'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found.',
            ], 404);
        }

        $isValid = $this->razorpayService->verifySignature(
            $validated['razorpay_order_id'],
            $validated['razorpay_payment_id'],
            $validated['razorpay_signature']
        );

        if (!$isValid) {
            $order->update([
                'payment_status' => 'failed',
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Payment signature verification failed. Please contact support.',
            ], 422);
        }

        $order->update([
            'payment_status' => 'paid',
            'delivery_status' => 'pending',
            'razorpay_order_id' => $validated['razorpay_order_id'],
            'razorpay_payment_id' => $validated['razorpay_payment_id'],
            'razorpay_signature' => $validated['razorpay_signature'],
            'paid_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Payment verified successfully! Your order has been placed.',
            'order_number' => $order->order_number,
            'order_id' => $order->id,
        ]);
    }

    /**
     * Place order with Cash on Delivery (COD).
     */
    public function placeCodOrder(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:25'],
            'shipping_address' => ['required', 'string', 'max:500'],
            'apartment' => ['nullable', 'string', 'max:255'],
            'city' => ['required', 'string', 'max:100'],
            'state' => ['required', 'string', 'max:100'],
            'pincode' => ['required', 'string', 'max:20'],
            'shipping_method_title' => ['nullable', 'string', 'max:100'],
            'shipping_cost' => ['nullable', 'numeric', 'min:0'],
            'order_notes' => ['nullable', 'string', 'max:1000'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.name' => ['required', 'string', 'max:255'],
            'items.*.price' => ['required', 'numeric', 'min:0'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.id' => ['nullable'],
            'items.*.variationId' => ['nullable'],
            'items.*.variationLabel' => ['nullable', 'string'],
            'items.*.image' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        $shippingCost = (float) ($validated['shipping_cost'] ?? 0);

        try {
            return DB::transaction(function () use ($validated, $user, $shippingCost) {
                $subtotal = 0;
                foreach ($validated['items'] as $item) {
                    $subtotal += ((float) $item['price']) * ((int) $item['quantity']);
                }

                $taxAmount = 0;
                $totalAmount = $subtotal + $shippingCost + $taxAmount;

                $order = Order::create([
                    'user_id' => $user->id,
                    'customer_name' => $validated['customer_name'],
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                    'shipping_address' => $validated['shipping_address'],
                    'apartment' => $validated['apartment'] ?? null,
                    'city' => $validated['city'],
                    'state' => $validated['state'],
                    'pincode' => $validated['pincode'],
                    'shipping_method_title' => $validated['shipping_method_title'] ?? 'Standard Delivery',
                    'shipping_cost' => $shippingCost,
                    'subtotal' => $subtotal,
                    'tax_amount' => $taxAmount,
                    'total_amount' => $totalAmount,
                    'currency' => 'INR',
                    'payment_method' => 'cod',
                    'payment_status' => 'pending',
                    'delivery_status' => 'pending',
                    'order_notes' => $validated['order_notes'] ?? null,
                ]);

                foreach ($validated['items'] as $item) {
                    $itemPrice = (float) $item['price'];
                    $itemQty = (int) $item['quantity'];
                    $itemTotal = $itemPrice * $itemQty;

                    $productId = is_numeric($item['id'] ?? null) ? (int) $item['id'] : null;
                    if ($productId && !Product::where('id', $productId)->exists()) {
                        $productId = null;
                    }

                    $variationId = is_numeric($item['variationId'] ?? null) ? (int) $item['variationId'] : null;
                    if ($variationId && !ProductVariation::where('id', $variationId)->exists()) {
                        $variationId = null;
                    }

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $productId,
                        'product_variation_id' => $variationId,
                        'product_name' => $item['name'],
                        'variation_name' => $item['variationLabel'] ?? null,
                        'unit_price' => $itemPrice,
                        'quantity' => $itemQty,
                        'tax_rate_percent' => 0,
                        'tax_amount' => 0,
                        'subtotal' => $itemTotal,
                        'total' => $itemTotal,
                        'product_image' => $item['image'] ?? null,
                    ]);
                }

                return response()->json([
                    'success' => true,
                    'message' => 'Order placed successfully with Cash on Delivery!',
                    'order_number' => $order->order_number,
                    'order_id' => $order->id,
                ]);
            });
        } catch (Exception $e) {
            Log::error('Checkout COD Error: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'success' => false,
                'message' => 'Unable to place order: ' . $e->getMessage(),
            ], 500);
        }
    }
}

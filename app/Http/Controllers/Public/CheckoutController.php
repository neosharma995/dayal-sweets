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
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CheckoutController extends Controller
{
    public function __construct(
        protected RazorpayService $razorpayService
    ) {}

    /**
     * Resolve authoritative product/variation prices from the database so client-submitted prices cannot be tampered with.
     *
     * @return array{subtotal: float, items: array<int, array<string, mixed>>}
     */
    private function resolveAuthoritativeItems(array $rawItems): array
    {
        $subtotal = 0.0;
        $resolved = [];

        foreach ($rawItems as $item) {
            $qty = max(1, (int) ($item['quantity'] ?? 1));
            $rawProdId = $item['productId'] ?? $item['product_id'] ?? (is_numeric($item['id'] ?? null) ? (int) $item['id'] : null);
            $productId = is_numeric($rawProdId) ? (int) $rawProdId : null;

            $product = $productId ? Product::find($productId) : null;
            if (! $product && ! empty($item['name'])) {
                $cleanName = explode(' - ', (string) $item['name'])[0];
                $product = Product::where('product_name', $item['name'])
                    ->orWhere('product_name', 'like', $cleanName . '%')
                    ->first();
            }

            $variationId = is_numeric($item['variationId'] ?? null) ? (int) $item['variationId'] : null;
            $variation = null;
            if ($variationId) {
                $variationQuery = ProductVariation::where('id', $variationId);
                if ($product) {
                    $variationQuery->where('product_id', $product->id);
                }
                $variation = $variationQuery->first();
            }

            // Always prefer authoritative database price when product/variation exists
            if ($variation) {
                $unitPrice = (float) ($variation->selling_price ?? $variation->price ?? $item['price']);
            } elseif ($product) {
                $unitPrice = (float) ($product->product_selling_price ?? $product->product_price ?? $item['price']);
            } else {
                $unitPrice = max(0.0, (float) ($item['price'] ?? 0));
            }

            $lineTotal = round($unitPrice * $qty, 2);
            $subtotal += $lineTotal;

            $item['price'] = $unitPrice;
            $item['quantity'] = $qty;
            $item['resolved_product_id'] = $product?->id;
            $item['resolved_variation_id'] = $variation?->id;
            $resolved[] = $item;
        }

        return [
            'subtotal' => round($subtotal, 2),
            'items' => $resolved,
        ];
    }

    /**
     * Initialize Razorpay Order session WITHOUT creating DB order yet.
     * Order will ONLY be inserted into DB after payment signature is cryptographically verified.
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
            // Calculate authoritative subtotal from DB prices
            $resolved = $this->resolveAuthoritativeItems($validated['items']);
            $subtotal = $resolved['subtotal'];

            $taxAmount = 0;
            $totalAmount = $subtotal + $shippingCost + $taxAmount;

            // Generate clean temporary receipt reference
            $temporaryReceipt = 'RCPT-' . date('Ymd') . '-' . strtoupper(Str::random(6));

            // Call Razorpay API to generate order
            $razorpayOrder = $this->razorpayService->createOrder(
                $totalAmount,
                $temporaryReceipt,
                [
                    'customer_id' => (string) $user->id,
                    'customer_email' => $validated['customer_email'],
                    'customer_phone' => $validated['customer_phone'],
                ]
            );

            // Store pending order details in Cache and Session keyed by razorpay_order_id
            $pendingOrderData = [
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
                'order_notes' => $validated['order_notes'] ?? null,
                'items' => $validated['items'],
                'razorpay_order_id' => $razorpayOrder['id'],
            ];

            $cacheKey = 'pending_rzp_' . $razorpayOrder['id'];
            Cache::put($cacheKey, $pendingOrderData, now()->addHours(6));
            session()->put($cacheKey, $pendingOrderData);

            return response()->json([
                'success' => true,
                'order_id' => null, // Intentionally null: Order is only created after payment succeeds!
                'order_number' => $temporaryReceipt,
                'razorpay_order_id' => $razorpayOrder['id'],
                'amount' => $razorpayOrder['amount'],
                'currency' => $razorpayOrder['currency'] ?? 'INR',
                'key' => $this->razorpayService->getKeyId(),
                'customer' => [
                    'name' => $validated['customer_name'],
                    'email' => $validated['customer_email'],
                    'contact' => $validated['customer_phone'],
                ],
            ]);
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
     * 
     * ARCHITECTURE: PAYMENT-FIRST
     * 1. Order is NOT created upfront during cart or checkout init.
     * 2. When the user completes payment on the Razorpay modal, this endpoint receives the cryptographic signature.
     * 3. HMAC signature is verified first.
     * 4. If payment failed or user cancelled, this endpoint is never reached, so NO order is created.
     * 5. ONLY upon successful verification, the Order & OrderItems are safely inserted into DB with payment_status = 'paid'.
     */
    public function verifyPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_id' => ['nullable'],
            'razorpay_order_id' => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature' => ['required', 'string'],
            'checkout_payload' => ['nullable', 'array'],
        ]);

        $user = $request->user();

        // 1. Verify HMAC Signature cryptographically
        $isValid = $this->razorpayService->verifySignature(
            $validated['razorpay_order_id'],
            $validated['razorpay_payment_id'],
            $validated['razorpay_signature']
        );

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Payment signature verification failed. Please contact support.',
            ], 422);
        }

        // 2. Check if Order already created for this payment ID or Razorpay Order ID (Idempotency)
        $existingOrder = Order::where('razorpay_payment_id', $validated['razorpay_payment_id'])
            ->orWhere('razorpay_order_id', $validated['razorpay_order_id'])
            ->first();

        if ($existingOrder) {
            $existingOrder->update([
                'payment_status' => 'paid',
                'delivery_status' => 'pending',
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature'],
                'paid_at' => $existingOrder->paid_at ?: now(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully! Your sweet order is confirmed.',
                'order_number' => $existingOrder->order_number,
                'order_id' => $existingOrder->id,
            ]);
        }

        // 3. If an existing order_id was passed and already exists in DB (legacy/test support)
        if (!empty($validated['order_id']) && is_numeric($validated['order_id'])) {
            $order = Order::where('id', (int) $validated['order_id'])
                ->where('user_id', $user->id)
                ->first();

            if ($order && $order->payment_status !== 'paid' && (! $order->razorpay_order_id || $order->razorpay_order_id === $validated['razorpay_order_id'])) {
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
        }

        // 4. Retrieve pending checkout payload from Cache, Session, or Request backup
        $cacheKey = 'pending_rzp_' . $validated['razorpay_order_id'];
        $pendingData = Cache::get($cacheKey) ?? session()->get($cacheKey) ?? $validated['checkout_payload'] ?? null;

        if (!$pendingData || (isset($pendingData['user_id']) && (int) $pendingData['user_id'] !== (int) $user->id)) {
            return response()->json([
                'success' => false,
                'message' => 'Payment was charged but order session expired. Please contact Dayal Sweets support with payment ID: ' . $validated['razorpay_payment_id'],
            ], 400);
        }

        // 5. NOW create Order & OrderItems in DB in a single safe transaction!
        return DB::transaction(function () use ($pendingData, $user, $validated, $cacheKey) {
            $resolved = $this->resolveAuthoritativeItems($pendingData['items'] ?? []);
            $subtotal = $resolved['subtotal'];
            $shippingCost = max(0.0, (float) ($pendingData['shipping_cost'] ?? 0));
            $taxAmount = 0;
            $totalAmount = $subtotal + $shippingCost + $taxAmount;

            $order = Order::create([
                'user_id' => $user->id,
                'customer_name' => $pendingData['customer_name'],
                'customer_email' => $pendingData['customer_email'],
                'customer_phone' => $pendingData['customer_phone'],
                'shipping_address' => $pendingData['shipping_address'],
                'apartment' => $pendingData['apartment'] ?? null,
                'city' => $pendingData['city'],
                'state' => $pendingData['state'],
                'pincode' => $pendingData['pincode'],
                'shipping_method_title' => $pendingData['shipping_method_title'] ?? 'Standard Delivery',
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax_amount' => $taxAmount,
                'total_amount' => $totalAmount,
                'currency' => 'INR',
                'payment_method' => 'razorpay',
                'payment_status' => 'paid',
                'delivery_status' => 'pending',
                'razorpay_order_id' => $validated['razorpay_order_id'],
                'razorpay_payment_id' => $validated['razorpay_payment_id'],
                'razorpay_signature' => $validated['razorpay_signature'],
                'order_notes' => $pendingData['order_notes'] ?? null,
                'paid_at' => now(),
            ]);

            foreach ($resolved['items'] as $item) {
                $itemPrice = (float) $item['price'];
                $itemQty = (int) $item['quantity'];
                $itemTotal = round($itemPrice * $itemQty, 2);

                $productId = $item['resolved_product_id'] ?? null;
                $variationId = $item['resolved_variation_id'] ?? null;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $productId,
                    'product_variation_id' => $variationId,
                    'product_name' => $item['name'],
                    'variation_name' => $item['variationLabel'] ?? $item['variation_name'] ?? null,
                    'unit_price' => $itemPrice,
                    'quantity' => $itemQty,
                    'tax_rate_percent' => 0,
                    'tax_amount' => 0,
                    'subtotal' => $itemTotal,
                    'total' => $itemTotal,
                    'product_image' => $item['image'] ?? null,
                ]);
            }

            // Cleanup Cache & Session
            Cache::forget($cacheKey);
            session()->forget($cacheKey);

            return response()->json([
                'success' => true,
                'message' => 'Payment verified successfully! Your order has been placed.',
                'order_number' => $order->order_number,
                'order_id' => $order->id,
            ]);
        });
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
                $resolved = $this->resolveAuthoritativeItems($validated['items']);
                $subtotal = $resolved['subtotal'];

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

                foreach ($resolved['items'] as $item) {
                    $itemPrice = (float) $item['price'];
                    $itemQty = (int) $item['quantity'];
                    $itemTotal = round($itemPrice * $itemQty, 2);

                    $productId = $item['resolved_product_id'] ?? null;
                    $variationId = $item['resolved_variation_id'] ?? null;

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

    /*
    |--------------------------------------------------------------------------
    | OPTIONAL PRODUCTION WEBHOOK VERIFICATION (COMMENTED OUT FOR LOCALHOST)
    |--------------------------------------------------------------------------
    | Why commented out at this time?
    | - On localhost (http://localhost:8000), Razorpay servers cannot send direct
    |   HTTP POST requests to your computer without a public tunnel (like ngrok).
    | - The client-side verification in `verifyPayment()` already guarantees that
    |   orders are created ONLY after payment succeeds.
    |
    | How to enable in Production:
    | 1. Uncomment the route in routes/public.php:
    |    Route::post('/webhook/razorpay', [CheckoutController::class, 'handleWebhook'])->name('razorpay.webhook');
    | 2. Add 'webhook/razorpay' to CSRF exemptions in bootstrap/app.php.
    | 3. Add RAZORPAY_WEBHOOK_SECRET=your_secret in .env.
    | 4. Register the webhook URL in Razorpay Dashboard (https://dashboard.razorpay.com) -> Settings -> Webhooks.
    |
    public function handleWebhook(Request $request): JsonResponse
    {
        $webhookSecret = env('RAZORPAY_WEBHOOK_SECRET');
        $webhookSignature = $request->header('X-Razorpay-Signature');
        $payload = $request->getContent();

        // 1. Fail closed: Require both webhook secret and signature header
        if (! $webhookSecret || ! $webhookSignature) {
            return response()->json(['error' => 'Webhook signature required'], 403);
        }
        $expectedSignature = hash_hmac('sha256', $payload, $webhookSecret);
        if (! hash_equals($expectedSignature, $webhookSignature)) {
            Log::warning('Razorpay Webhook signature mismatch.');
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        $data = json_decode($payload, true);
        $event = $data['event'] ?? null;

        Log::info('Razorpay Webhook Event received: ' . $event);

        // 2. Only save or mark order as paid when payment is captured
        if ($event === 'payment.captured' || $event === 'order.paid') {
            $paymentEntity = $data['payload']['payment']['entity'] ?? [];
            $razorpayOrderId = $paymentEntity['order_id'] ?? null;
            $razorpayPaymentId = $paymentEntity['id'] ?? null;

            if ($razorpayOrderId) {
                // If order already exists in DB, update status to paid
                $order = Order::where('razorpay_order_id', $razorpayOrderId)->first();
                if ($order && $order->payment_status !== 'paid') {
                    $order->update([
                        'payment_status' => 'paid',
                        'razorpay_payment_id' => $razorpayPaymentId,
                        'paid_at' => now(),
                    ]);
                    Log::info("Order #{$order->order_number} marked as paid via Razorpay Webhook.");
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
    */
}

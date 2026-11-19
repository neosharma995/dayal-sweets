<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OutletTable;
use App\Models\Product;
use App\Models\ProductVariation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TableOrderController extends Controller
{
    /**
     * Display the dedicated Dine-In Table Ordering Panel when a user scans a table QR code.
     */
    public function show(Request $request, string $token): Response
    {
        $table = OutletTable::with('outlet')->where('qr_token', $token)->firstOrFail();
        $outlet = $table->outlet;

        // Query products offered by this table's outlet
        $productQuery = Product::with(['category', 'variations']);

        $hasOutletProducts = $outlet && $outlet->products()->wherePivot('is_available', true)->exists();
        if ($hasOutletProducts) {
            $productQuery->whereHas('outlets', function ($q) use ($outlet) {
                $q->where('outlets.id', $outlet->id)
                    ->where('outlet_products.is_available', true);
            });
        }

        $products = $productQuery
            ->latest('id')
            ->get()
            ->map(function (Product $product) {
                $image = $product->product_image;
                if ($image && ! str_starts_with($image, 'http') && ! str_starts_with($image, '/')) {
                    $image = '/storage/' . $image;
                }
                if (! $image) {
                    $image = '/uploads/2026/07/kaaju-katli.png';
                }

                $catName = $product->category?->category_name ?? 'Sweets';
                $catSlug = $product->category?->category_slug ?? Str::slug($catName);

                $variations = $product->variations->map(fn ($v) => [
                    'id' => $v->id,
                    'label' => $v->variation_name,
                    'price' => (float) ($v->selling_price ?? $v->price ?? 0),
                ])->values()->all();

                $basePrice = (float) ($product->product_selling_price ?? $product->product_price ?? ($variations[0]['price'] ?? 0));

                return [
                    'id' => $product->id,
                    'name' => $product->product_name,
                    'category' => $catName,
                    'categorySlug' => $catSlug,
                    'description' => $product->product_description,
                    'image' => $image,
                    'price' => $basePrice,
                    'regularPrice' => (float) ($product->product_price ?? $basePrice),
                    'rating' => (float) ($product->rating ?? 4.9),
                    'variations' => $variations,
                ];
            });

        $categories = Category::orderBy('category_name')
            ->get()
            ->map(fn (Category $cat) => [
                'id' => $cat->id,
                'name' => $cat->category_name,
                'slug' => $cat->category_slug ?? Str::slug($cat->category_name),
            ]);

        // Load active orders placed from this table in the visitor's session
        $sessionOrderIds = (array) $request->session()->get('table_order_ids_' . $table->id, []);
        $recentTableOrders = [];
        if (! empty($sessionOrderIds)) {
            $recentTableOrders = Order::with('items')
                ->where('outlet_table_id', $table->id)
                ->whereIn('id', $sessionOrderIds)
                ->latest('id')
                ->take(5)
                ->get()
                ->map(fn (Order $o) => [
                    'id' => $o->id,
                    'order_number' => $o->order_number,
                    'total_amount' => (float) $o->total_amount,
                    'delivery_status' => $o->delivery_status,
                    'payment_status' => $o->payment_status,
                    'payment_method' => $o->payment_method,
                    'customer_name' => $o->customer_name,
                    'guests_count' => $o->guests_count,
                    'placed_at' => $o->created_at?->format('h:i A'),
                    'items' => $o->items->map(fn ($i) => [
                        'id' => $i->id,
                        'name' => $i->product_name,
                        'variation' => $i->variation_name,
                        'quantity' => (int) $i->quantity,
                        'unit_price' => (float) $i->unit_price,
                        'total' => (float) $i->total,
                    ])->all(),
                ])->all();
        }

        return Inertia::render('Public/TableOrder', [
            'table' => [
                'id' => $table->id,
                'table_number' => $table->table_number,
                'name' => $table->name,
                'capacity' => $table->capacity,
                'location' => $table->location,
                'status' => $table->status,
                'is_active' => $table->is_active,
                'qr_token' => $table->qr_token,
                'notes' => $table->notes,
            ],
            'outlet' => [
                'id' => $outlet?->id,
                'name' => $outlet?->name ?? 'Dayal Sweets Outlet',
                'city' => $outlet?->city ?? 'Himachal Pradesh',
                'address' => $outlet?->address,
                'phone' => $outlet?->phone,
                'timings' => $outlet?->timings,
            ],
            'products' => $products,
            'categories' => $categories,
            'recentOrders' => $recentTableOrders,
        ]);
    }

    /**
     * Receive and place a direct Dine-In Table Order from the QR scanner panel.
     */
    public function placeOrder(Request $request, string $token): JsonResponse|RedirectResponse
    {
        $table = OutletTable::with('outlet')->where('qr_token', $token)->firstOrFail();

        if (! $table->is_active || $table->status === 'inactive') {
            return response()->json([
                'success' => false,
                'message' => 'This table is currently inactive for ordering. Please ask our staff for assistance.',
            ], 422);
        }

        $validated = $request->validate([
            'customer_name' => ['nullable', 'string', 'max:120'],
            'customer_phone' => ['nullable', 'string', 'max:25'],
            'guests_count' => ['nullable', 'integer', 'min:1', 'max:100'],
            'order_notes' => ['nullable', 'string', 'max:1000'],
            'payment_method' => ['nullable', 'string', 'in:pay_at_counter,cash,upi'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.variation_id' => ['nullable', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $outlet = $table->outlet;
        $user = $request->user();
        if (! $user) {
            $user = \App\Models\User::firstOrCreate(
                ['email' => 'dinein@dayalsweets.com'],
                [
                    'name' => 'Dine-In Table Guest',
                    'password' => bcrypt(Str::random(16)),
                    'email_verified_at' => now(),
                ]
            );
        }
        $customerName = ! empty(trim((string) ($validated['customer_name'] ?? '')))
            ? trim((string) $validated['customer_name'])
            : ($request->user()?->name ?: "Table {$table->table_number} Guest");
        $customerPhone = ! empty(trim((string) ($validated['customer_phone'] ?? '')))
            ? trim((string) $validated['customer_phone'])
            : 'Dine-In Guest';
        $guestsCount = (int) ($validated['guests_count'] ?? $table->capacity);
        $paymentMethod = $validated['payment_method'] ?? 'pay_at_counter';

        $hasOutletProducts = $outlet && $outlet->products()->wherePivot('is_available', true)->exists();

        // Build authoritative line items from database prices (scoped to outlet when configured)
        $resolvedItems = [];
        $subtotal = 0.0;

        foreach ($validated['items'] as $rawItem) {
            $productQuery = Product::where('id', (int) $rawItem['product_id']);
            if ($hasOutletProducts) {
                $productQuery->whereHas('outlets', function ($q) use ($outlet) {
                    $q->where('outlets.id', $outlet->id)
                        ->where('outlet_products.is_available', true);
                });
            }
            $product = $productQuery->firstOrFail();
            $variation = null;

            if (! empty($rawItem['variation_id'])) {
                $variation = ProductVariation::where('product_id', $product->id)
                    ->where('id', (int) $rawItem['variation_id'])
                    ->first();
            }

            $unitPrice = $variation
                ? (float) ($variation->selling_price ?? $variation->price ?? 0)
                : (float) ($product->product_selling_price ?? $product->product_price ?? 0);

            $qty = (int) $rawItem['quantity'];
            $lineTotal = round($unitPrice * $qty, 2);
            $subtotal += $lineTotal;

            $image = $product->product_image;
            if ($image && ! str_starts_with($image, 'http') && ! str_starts_with($image, '/')) {
                $image = '/storage/' . $image;
            }

            $resolvedItems[] = [
                'product_id' => $product->id,
                'product_variation_id' => $variation?->id,
                'product_name' => $product->product_name,
                'variation_name' => $variation?->variation_name,
                'unit_price' => $unitPrice,
                'quantity' => $qty,
                'subtotal' => $lineTotal,
                'total' => $lineTotal,
                'product_image' => $image,
            ];
        }

        $order = DB::transaction(function () use (
            $table,
            $outlet,
            $user,
            $customerName,
            $customerPhone,
            $guestsCount,
            $paymentMethod,
            $subtotal,
            $validated,
            $resolvedItems
        ) {
            $createdOrder = Order::create([
                'user_id' => $user?->id,
                'outlet_id' => $table->outlet_id,
                'order_type' => 'dine_in',
                'outlet_table_id' => $table->id,
                'table_number' => $table->table_number,
                'table_location' => $table->location,
                'guests_count' => $guestsCount,
                'customer_name' => $customerName,
                'customer_email' => $user?->email ?? 'dinein@dayalsweets.com',
                'customer_phone' => $customerPhone,
                'shipping_address' => "Dine-In • {$table->name} ({$table->table_number}) • {$table->location}",
                'apartment' => $table->location,
                'city' => $outlet?->city ?: 'Outlet Dine-In',
                'state' => $outlet?->state ?: 'Himachal Pradesh',
                'pincode' => $outlet?->pincode ?: '174303',
                'shipping_method_title' => "Dine-In Table Service ({$table->table_number} • {$table->location})",
                'shipping_cost' => 0,
                'subtotal' => $subtotal,
                'tax_amount' => 0,
                'total_amount' => $subtotal,
                'currency' => 'INR',
                'payment_method' => $paymentMethod === 'pay_at_counter' ? 'cod' : $paymentMethod,
                'payment_status' => 'pending',
                'delivery_status' => 'pending',
                'order_notes' => $validated['order_notes'] ?? null,
            ]);

            foreach ($resolvedItems as $itemData) {
                OrderItem::create(array_merge($itemData, [
                    'order_id' => $createdOrder->id,
                    'tax_rate_percent' => 0,
                    'tax_amount' => 0,
                ]));
            }

            // Mark table as occupied when an order is placed
            if ($table->status === 'available') {
                $table->update(['status' => 'occupied']);
            }

            return $createdOrder->load('items');
        });

        // Track order in visitor's session for live status viewing
        $existingIds = (array) $request->session()->get('table_order_ids_' . $table->id, []);
        array_unshift($existingIds, $order->id);
        $request->session()->put('table_order_ids_' . $table->id, array_values(array_unique($existingIds)));

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => "Order #{$order->order_number} sent directly to {$outlet?->name} kitchen for {$table->name}!",
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => (float) $order->total_amount,
                    'delivery_status' => $order->delivery_status,
                    'payment_status' => $order->payment_status,
                    'customer_name' => $order->customer_name,
                    'guests_count' => $order->guests_count,
                    'placed_at' => $order->created_at?->format('h:i A'),
                    'items' => $order->items->map(fn ($i) => [
                        'id' => $i->id,
                        'name' => $i->product_name,
                        'variation' => $i->variation_name,
                        'quantity' => (int) $i->quantity,
                        'unit_price' => (float) $i->unit_price,
                        'total' => (float) $i->total,
                    ])->all(),
                ],
            ], 201);
        }

        return redirect()
            ->route('table.order.show', $table->qr_token)
            ->with('success', "Order #{$order->order_number} sent directly to the kitchen for {$table->name}!");
    }
}

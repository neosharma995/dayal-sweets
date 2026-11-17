<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ProductReviewController extends Controller
{
    /**
     * Store or update a customer's product review and rating.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'review' => ['nullable', 'string', 'max:1000'],
            'order_id' => ['nullable', 'integer', 'exists:orders,id'],
        ]);

        $productId = (int) $validated['product_id'];
        $product = Product::find($productId);

        // 1. Check if user bought this product directly and it has been delivered
        $hasDeliveredOrder = OrderItem::where('product_id', $productId)
            ->whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('delivery_status', 'delivered');
            })
            ->exists();

        // 2. If order_id was provided, verify that the order is delivered and contains this product
        if (!$hasDeliveredOrder && !empty($validated['order_id'])) {
            $order = Order::where('id', $validated['order_id'])
                ->where('user_id', $user->id)
                ->where('delivery_status', 'delivered')
                ->first();

            if ($order) {
                $matchingItem = $order->items->first(function ($it) use ($productId, $product) {
                    if ((int) $it->product_id === $productId) return true;
                    if ($product && str_contains(strtolower((string) $it->product_name), strtolower((string) $product->product_name))) return true;
                    return false;
                });

                if ($matchingItem) {
                    $hasDeliveredOrder = true;
                    if (!$matchingItem->product_id) {
                        $matchingItem->update(['product_id' => $productId]);
                    }
                }
            }
        }

        // 3. Fallback: match by product name in any of user's delivered orders
        if (!$hasDeliveredOrder && $product) {
            $matchingItem = OrderItem::whereHas('order', function ($query) use ($user) {
                $query->where('user_id', $user->id)
                    ->where('delivery_status', 'delivered');
            })
            ->where('product_name', 'LIKE', '%' . $product->product_name . '%')
            ->first();

            if ($matchingItem) {
                $hasDeliveredOrder = true;
                if (!$matchingItem->product_id) {
                    $matchingItem->update(['product_id' => $productId]);
                }
            }
        }

        if (!$hasDeliveredOrder) {
            return back()->withErrors([
                'rating' => 'You can only rate and review this product once your order has been delivered.',
            ]);
        }

        $productReview = ProductReview::updateOrCreate(
            [
                'product_id' => $validated['product_id'],
                'user_id' => $user->id,
            ],
            [
                'order_id' => $validated['order_id'] ?? null,
                'rating' => $validated['rating'],
                'review' => $validated['review'] ?? null,
                'is_verified_purchase' => true,
                'status' => 'approved',
            ]
        );

        // Recalculate average rating and review count on the product table
        ProductReview::recalculateForProduct((int) $validated['product_id']);

        return back()->with('success', 'Thank you! Your rating and review have been submitted.');
    }
}

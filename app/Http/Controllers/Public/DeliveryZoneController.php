<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Services\DeliveryZoneService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class DeliveryZoneController extends Controller
{
    public function __construct(
        protected DeliveryZoneService $deliveryZoneService
    ) {}

    /**
     * Check if a pincode is serviceable and store it in session.
     */
    public function check(Request $request): JsonResponse|RedirectResponse
    {
        $validated = $request->validate([
            'pincode' => ['required', 'string', 'max:10'],
        ]);

        $result = $this->deliveryZoneService->verifyPincode($validated['pincode']);

        if ($result['serviceable']) {
            $outletIds = $result['outlet_ids'];

            $availableProductIds = \App\Models\Product::whereHas('outlets', function ($q) use ($outletIds) {
                $q->whereIn('outlets.id', $outletIds)->where('outlet_products.is_available', true);
            })->pluck('id')->map(fn ($id) => (int) $id)->all();

            $result['available_product_ids'] = $availableProductIds;

            $request->session()->put([
                'customer_pincode' => $result['pincode'],
                'serviceable_outlet_ids' => $outletIds,
                'serviceable_outlets' => $result['outlets'],
                'is_pincode_verified' => true,
                'pincode_message' => $result['message'],
            ]);

            // Prune cart items not available in the newly selected outlet(s)
            $cart = $request->session()->get('cart', []);
            if (! empty($cart) && is_array($cart)) {
                $filteredCart = array_values(array_filter($cart, function ($item) use ($availableProductIds) {
                    $pId = (int) ($item['productId'] ?? $item['product_id'] ?? $item['id'] ?? 0);
                    return in_array($pId, $availableProductIds, true);
                }));

                $request->session()->put('cart', $filteredCart);
                $result['cart'] = $filteredCart;
                $result['cart_count'] = array_sum(array_column($filteredCart, 'quantity'));
            } else {
                $result['cart'] = [];
                $result['cart_count'] = 0;
            }
        }

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json($result);
        }

        if (! $result['serviceable']) {
            return back()->with('error', $result['message']);
        }

        return back()->with('success', $result['message']);
    }

    /**
     * Get the current delivery session status.
     */
    public function current(Request $request): JsonResponse
    {
        $pincode = $request->session()->get('customer_pincode');
        $isVerified = (bool) $request->session()->get('is_pincode_verified', false);
        $outletIds = $request->session()->get('serviceable_outlet_ids', []);
        $outlets = $request->session()->get('serviceable_outlets', []);
        $message = $request->session()->get('pincode_message');

        return response()->json([
            'pincode' => $pincode,
            'is_serviceable' => $isVerified && ! empty($outletIds),
            'outlet_ids' => $outletIds,
            'outlets' => $outlets,
            'message' => $message,
        ]);
    }

    /**
     * Clear the delivery pincode session.
     */
    public function clear(Request $request): JsonResponse|RedirectResponse
    {
        $request->session()->forget([
            'customer_pincode',
            'serviceable_outlet_ids',
            'serviceable_outlets',
            'is_pincode_verified',
            'pincode_message',
        ]);

        if ($request->wantsJson() || $request->ajax()) {
            return response()->json([
                'success' => true,
                'message' => 'Delivery location cleared.',
            ]);
        }

        return back()->with('success', 'Delivery location cleared.');
    }
}

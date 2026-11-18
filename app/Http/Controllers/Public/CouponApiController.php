<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CouponApiController extends Controller
{
    /**
     * Validate and apply a coupon code for checkout/cart.
     */
    public function apply(Request $request): JsonResponse
    {
        $code = strtoupper(trim((string) $request->input('code', '')));
        $subtotal = (float) $request->input('subtotal', 0);
        $outletId = $request->input('outlet_id') ? (int) $request->input('outlet_id') : (int) $request->session()->get('active_outlet_id');
        $email = $request->input('email');
        $user = $request->user();

        if ($code === '') {
            return response()->json([
                'success' => false,
                'message' => 'Please enter a coupon code.',
            ], 422);
        }

        $coupon = Coupon::with(['outlet', 'outlets'])->where('code', $code)->first();

        if (! $coupon) {
            return response()->json([
                'success' => false,
                'message' => "Coupon code '{$code}' is invalid.",
            ], 404);
        }

        $validation = $coupon->validateForCart(
            subtotal: $subtotal,
            outletId: $outletId ?: null,
            userId: $user?->id,
            email: $email ?: $user?->email
        );

        if (! $validation['valid']) {
            return response()->json([
                'success' => false,
                'message' => $validation['message'],
            ], 422);
        }

        $discount = $coupon->calculateDiscount($subtotal);
        $finalTotal = max(0, round($subtotal - $discount, 2));

        return response()->json([
            'success' => true,
            'message' => $validation['message'],
            'discount' => $discount,
            'final_total' => $finalTotal,
            'coupon' => [
                'id' => $coupon->id,
                'code' => $coupon->code,
                'description' => $coupon->description,
                'discount_type' => $coupon->discount_type,
                'discount_value' => $coupon->discount_value,
                'is_global' => $coupon->is_global,
                'outlet_name' => $coupon->is_global ? 'All Outlets (Global)' : ($coupon->outlet?->name ?? 'Selected Outlets'),
            ],
        ]);
    }
}

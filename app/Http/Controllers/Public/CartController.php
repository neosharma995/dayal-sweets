<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Retrieve the current cart from the session.
     */
    public function get(Request $request): JsonResponse
    {
        $cart = $request->session()->get('cart', []);

        return response()->json([
            'success' => true,
            'cart' => is_array($cart) ? $cart : [],
            'count' => is_array($cart) ? array_sum(array_column($cart, 'quantity')) : 0,
            'sessionId' => $request->session()->getId(),
        ]);
    }

    /**
     * Synchronize the client cart into the server session.
     * Works identically for guests and authenticated customers.
     */
    public function sync(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'cart' => ['present', 'array'],
            'cart.*.id' => ['required', 'string'],
            'cart.*.productId' => ['required'],
            'cart.*.name' => ['required', 'string'],
            'cart.*.price' => ['required', 'numeric'],
            'cart.*.quantity' => ['required', 'integer', 'min:1'],
            'cart.*.image' => ['nullable', 'string'],
            'cart.*.slug' => ['nullable', 'string'],
            'cart.*.variation' => ['nullable'],
            'cart.*.variationLabel' => ['nullable', 'string'],
        ]);

        $cart = $validated['cart'];

        $request->session()->put('cart', $cart);

        return response()->json([
            'success' => true,
            'cart' => $cart,
            'count' => array_sum(array_column($cart, 'quantity')),
            'sessionId' => $request->session()->getId(),
        ]);
    }

    /**
     * Clear all items from the session cart.
     */
    public function clear(Request $request): JsonResponse
    {
        $request->session()->forget('cart');

        return response()->json([
            'success' => true,
            'cart' => [],
            'count' => 0,
            'sessionId' => $request->session()->getId(),
        ]);
    }
}

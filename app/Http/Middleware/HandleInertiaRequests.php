<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'roles' => $user->getRoleNames()->values()->all(),
                    'permissions' => $user->getAllPermissions()->pluck('name')->values()->all(),
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
            'headerFooter' => fn () => \App\Models\Page::getOrCreateHeaderFooter()->sections,
            'outlets' => fn () => \App\Models\Outlet::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(['id', 'name', 'city', 'state', 'status']),
            'activeOutletId' => fn () => $request->session()->get('active_outlet_id', $request->query('outlet_id')),
            'activeOutlet' => function () use ($request) {
                $id = $request->session()->get('active_outlet_id', $request->query('outlet_id'));
                return $id ? \App\Models\Outlet::find($id) : null;
            },
            'paginationLimit' => (int) env('PAGINATION_LIMIT', 20),
            'cart' => fn () => $request->session()->get('cart', []),
            'sessionToken' => fn () => $request->session()->getId(),
            'pincodeSession' => fn () => [
                'pincode' => $request->session()->get('customer_pincode'),
                'isServiceable' => (bool) $request->session()->get('is_pincode_verified', false),
                'outletIds' => $request->session()->get('serviceable_outlet_ids', []),
                'outlets' => $request->session()->get('serviceable_outlets', []),
                'message' => $request->session()->get('pincode_message'),
            ],
        ];
    }
}

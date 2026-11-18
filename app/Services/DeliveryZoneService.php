<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Outlet;
use App\Models\Product;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Collection;

class DeliveryZoneService
{
    /**
     * Validate whether a string is a valid 6-digit Indian PIN code.
     */
    public function isValidPincode(?string $pincode): bool
    {
        if (empty($pincode)) {
            return false;
        }

        return (bool) preg_match('/^[1-9][0-9]{5}$/', trim($pincode));
    }

    /**
     * Check if a given pincode matches a zone's postcode pattern.
     * Supports:
     * - Exact 6-digit code: "177203"
     * - Numerical ranges: "140001...160071" or "140001-160071"
     * - Wildcard / prefix: "177203..." or "177*"
     */
    public function matchesZonePostcodes(?string $zonePostcodes, string $pincode): bool
    {
        if (empty($zonePostcodes)) {
            return false;
        }

        $pincode = trim($pincode);
        $entries = preg_split('/[\r\n,;]+/', $zonePostcodes);

        if (! is_array($entries)) {
            return false;
        }

        foreach ($entries as $rawEntry) {
            $entry = trim($rawEntry);
            if ($entry === '') {
                continue;
            }

            // 1. Range syntax: 140001...160071 or 140001-160071
            if (preg_match('/^(\d{6})\s*(?:\.\.\.|-)\s*(\d{6})$/', $entry, $matches)) {
                $min = (int) $matches[1];
                $max = (int) $matches[2];
                $pinVal = (int) $pincode;
                if ($pinVal >= $min && $pinVal <= $max) {
                    return true;
                }

                continue;
            }

            // 2. Wildcard or prefix syntax: 177203... or 177*
            if (str_ends_with($entry, '...') || str_ends_with($entry, '*')) {
                $prefix = rtrim(rtrim($entry, '.'), '*');
                if ($prefix !== '' && str_starts_with($pincode, $prefix)) {
                    return true;
                }

                continue;
            }

            // 3. Exact match
            if ($entry === $pincode) {
                return true;
            }
        }

        return false;
    }

    /**
     * Find all active outlets that deliver to the specified PIN code.
     *
     * @return Collection<int, Outlet>
     */
    public function getServiceableOutlets(string $pincode): Collection
    {
        $pincode = trim($pincode);
        if (! $this->isValidPincode($pincode)) {
            return collect();
        }

        $activeOutlets = Outlet::query()
            ->where('is_active', true)
            ->where('status', 'active')
            ->where('is_coming_soon', false)
            ->with(['shippingZones' => function ($q) {
                $q->where('is_active', true)->orderBy('sort_order');
            }])
            ->orderBy('sort_order')
            ->get();

        return $activeOutlets->filter(function (Outlet $outlet) use ($pincode) {
            // Check direct outlet pincode match
            if (! empty($outlet->pincode) && trim((string) $outlet->pincode) === $pincode) {
                return true;
            }

            // Check active shipping zones of this outlet
            foreach ($outlet->shippingZones as $zone) {
                if ($this->matchesZonePostcodes($zone->zone_postcodes, $pincode)) {
                    return true;
                }
            }

            return false;
        })->values();
    }

    /**
     * Determine if a given PIN code is serviceable by any active outlet.
     */
    public function isPincodeServiceable(string $pincode): bool
    {
        return $this->getServiceableOutlets($pincode)->isNotEmpty();
    }

    /**
     * Scope a product query to only include products available in the specified outlets.
     */
    public function filterProductsByOutlets(Builder $query, Collection|array $outletIds): Builder
    {
        $ids = $outletIds instanceof Collection ? $outletIds->pluck('id')->all() : (array) $outletIds;
        $ids = array_filter(array_map('intval', $ids));

        if (empty($ids)) {
            // No serviceable outlets: return empty result
            return $query->whereRaw('1 = 0');
        }

        return $query->whereHas('outlets', function (Builder $q) use ($ids) {
            $q->whereIn('outlets.id', $ids)
                ->where('outlet_products.is_available', true);
        });
    }

    /**
     * Verify a pincode and format a full response payload for the frontend/session.
     *
     * @return array<string, mixed>
     */
    public function verifyPincode(string $pincode): array
    {
        $cleanPin = trim($pincode);

        if (! $this->isValidPincode($cleanPin)) {
            return [
                'success' => false,
                'serviceable' => false,
                'pincode' => $cleanPin,
                'message' => 'Please enter a valid 6-digit Indian PIN code (e.g. 177203, 174303).',
                'outlets' => [],
            ];
        }

        $outlets = $this->getServiceableOutlets($cleanPin);

        if ($outlets->isEmpty()) {
            return [
                'success' => false,
                'serviceable' => false,
                'pincode' => $cleanPin,
                'message' => "We currently do not offer delivery to PIN code {$cleanPin}. Please check back soon or try another delivery address.",
                'outlets' => [],
            ];
        }

        $outletDetails = $outlets->map(fn (Outlet $outlet) => [
            'id' => $outlet->id,
            'name' => $outlet->name,
            'subtitle' => $outlet->subtitle,
            'city' => $outlet->city,
            'address' => $outlet->address,
            'pincode' => $outlet->pincode,
            'phone' => $outlet->phone,
            'timings' => $outlet->timings,
        ])->all();

        $outletNames = $outlets->pluck('name')->join(', ', ' & ');

        return [
            'success' => true,
            'serviceable' => true,
            'pincode' => $cleanPin,
            'message' => "Delivery available to {$cleanPin} via {$outletNames} outlet.",
            'outlets' => $outletDetails,
            'outlet_ids' => $outlets->pluck('id')->all(),
        ];
    }
}

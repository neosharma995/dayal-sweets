<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Outlet;
use App\Models\OutletTable;
use Illuminate\Database\Seeder;

class OutletTablesDemoSeeder extends Seeder
{
    public function run(): void
    {
        $outlets = Outlet::where('is_active', true)->orderBy('id')->get();

        $sampleTablesPerOutlet = [
            [
                'table_number' => 'T-01',
                'name' => 'Table T-01',
                'capacity' => 2,
                'location' => 'Ground Floor',
                'status' => 'available',
                'notes' => 'Two-seater window table near entrance',
            ],
            [
                'table_number' => 'T-02',
                'name' => 'Table T-02',
                'capacity' => 4,
                'location' => 'Main Dining Hall',
                'status' => 'available',
                'notes' => 'Standard family 4-seater booth',
            ],
            [
                'table_number' => 'T-03',
                'name' => 'Table T-03',
                'capacity' => 6,
                'location' => 'First Floor (AC Hall)',
                'status' => 'available',
                'notes' => 'Large 6-person group dining table',
            ],
            [
                'table_number' => 'VIP-01',
                'name' => 'Royal Family Booth VIP-01',
                'capacity' => 8,
                'location' => 'Family Cabin / VIP Lounge',
                'status' => 'available',
                'notes' => 'Private family celebration table for 8 guests',
            ],
        ];

        foreach ($outlets as $outlet) {
            if ($outlet->is_coming_soon || $outlet->status === 'coming_soon') {
                continue;
            }

            foreach ($sampleTablesPerOutlet as $idx => $tblData) {
                $existing = OutletTable::where('outlet_id', $outlet->id)
                    ->where('table_number', $tblData['table_number'])
                    ->first();

                if (! $existing) {
                    OutletTable::create([
                        'outlet_id' => $outlet->id,
                        'table_number' => $tblData['table_number'],
                        'name' => $tblData['name'],
                        'capacity' => $tblData['capacity'],
                        'location' => $tblData['location'],
                        'qr_token' => 'tbl-' . $outlet->id . '-' . strtolower($tblData['table_number']),
                        'status' => $tblData['status'],
                        'is_active' => true,
                        'notes' => $tblData['notes'],
                        'sort_order' => $idx + 1,
                    ]);
                }
            }
        }
    }
}

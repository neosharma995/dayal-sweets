<?php

declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Outlet;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $outlets = [
            [
                'name' => 'Amb',
                'slug' => 'amb',
                'subtitle' => 'Main Bazaar',
                'address' => 'VPO Amb, Main Bazaar, Tehsil Amb, Distt. Una, Himachal Pradesh 177203',
                'city' => 'Amb',
                'state' => 'Himachal Pradesh',
                'pincode' => '177203',
                'phone' => '+91 80627 57395',
                'phone_raw' => '+918062757395',
                'whatsapp' => '+91 80627 57395',
                'whatsapp_raw' => '918062757395',
                'timings' => 'Mon - Sun: 8:00 AM - 9:30 PM',
                'image' => '/uploads/2026/08/Amb-Outlet.png',
                'map_url' => 'https://maps.google.com/?q=Dayal+Sweets+Amb+Himachal+Pradesh',
                'status' => 'active',
                'is_active' => true,
                'is_coming_soon' => false,
                'expected_opening' => null,
                'sort_order' => 1,
            ],
            [
                'name' => 'Hamirpur',
                'slug' => 'hamirpur',
                'subtitle' => 'Gandhi Chowk',
                'address' => 'Dayal Sweets- Gandhi Chowk, NH-70, Pratap Nagar, Hamirpur, Himachal Pradesh 177005',
                'city' => 'Hamirpur',
                'state' => 'Himachal Pradesh',
                'pincode' => '177005',
                'phone' => '+91 80627 57395',
                'phone_raw' => '+918062757395',
                'whatsapp' => '+91 80627 57395',
                'whatsapp_raw' => '918062757395',
                'timings' => 'Mon - Sun: 8:00 AM - 10:00 PM',
                'image' => '/uploads/2026/08/Hamirpur-Outlet.png',
                'map_url' => 'https://maps.app.goo.gl/NP2CS4WAhi5xYh546',
                'status' => 'active',
                'is_active' => true,
                'is_coming_soon' => false,
                'expected_opening' => null,
                'sort_order' => 2,
            ],
            [
                'name' => 'Una',
                'slug' => 'una',
                'subtitle' => 'Nangal Road',
                'address' => 'Dayal Sweets-Nangal Road, Una, Durga Colony, Himachal Pradesh 174303',
                'city' => 'Una',
                'state' => 'Himachal Pradesh',
                'pincode' => '174303',
                'phone' => '+91 80627 57395',
                'phone_raw' => '+918062757395',
                'whatsapp' => '+91 80627 57395',
                'whatsapp_raw' => '918062757395',
                'timings' => 'Mon - Sun: 8:00 AM - 10:00 PM',
                'image' => '/uploads/2026/08/Nangal-Road-Una-Outlet.png',
                'map_url' => 'https://maps.app.goo.gl/NWcR3Mdg264m6SnY7',
                'status' => 'active',
                'is_active' => true,
                'is_coming_soon' => false,
                'expected_opening' => null,
                'sort_order' => 3,
            ],
            [
                'name' => 'Una (Bus Stand)',
                'slug' => 'una-bus-stand',
                'subtitle' => 'Opp. Bus Stand',
                'address' => 'Dayal Sweets- Una - Hamirpur Rd, opp. Bus Stand, Una, Himachal Pradesh 174303',
                'city' => 'Una',
                'state' => 'Himachal Pradesh',
                'pincode' => '174303',
                'phone' => '+91 80627 57395',
                'phone_raw' => '+918062757395',
                'whatsapp' => '+91 80627 57395',
                'whatsapp_raw' => '918062757395',
                'timings' => 'Mon - Sun: 8:00 AM - 10:00 PM',
                'image' => '/uploads/2026/07/About-Outlet.png',
                'map_url' => 'https://maps.app.goo.gl/etQYvcQMNKH1KekE8',
                'status' => 'active',
                'is_active' => true,
                'is_coming_soon' => false,
                'expected_opening' => null,
                'sort_order' => 4,
            ],
            [
                'name' => 'Palampur',
                'slug' => 'palampur',
                'subtitle' => 'Opening Soon',
                'address' => 'Main Market, Palampur, Kangra, Himachal Pradesh 176061',
                'city' => 'Palampur',
                'state' => 'Himachal Pradesh',
                'pincode' => '176061',
                'phone' => '+91 80627 57395',
                'phone_raw' => '+918062757395',
                'whatsapp' => '+91 80627 57395',
                'whatsapp_raw' => '918062757395',
                'timings' => 'Coming Soon',
                'image' => '/uploads/2026/09/palampoor-stor.png',
                'map_url' => null,
                'status' => 'coming_soon',
                'is_active' => true,
                'is_coming_soon' => true,
                'expected_opening' => 'Expected Opening Coming Soon',
                'sort_order' => 5,
            ],
        ];

        foreach ($outlets as $data) {
            Outlet::updateOrCreate(
                ['slug' => $data['slug']],
                $data
            );
        }
    }
}

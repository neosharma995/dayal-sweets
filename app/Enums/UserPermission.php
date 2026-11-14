<?php

declare(strict_types=1);

namespace App\Enums;

enum UserPermission: string
{
    // Admin permissions
    case ManageProducts = 'manage products';
    case ManageOrders = 'manage orders';
    case ManageCategories = 'manage categories';
    case ManageCustomers = 'manage customers';
    case ViewSalesReports = 'view sales reports';
    case ManageStoreSettings = 'manage store settings';

    // Customer permissions
    case ViewProducts = 'view products';
    case PlaceOrders = 'place orders';
    case ManageProfile = 'manage profile';
    case ViewOwnOrders = 'view own orders';

    /**
     * @return list<string>
     */
    public static function adminPermissions(): array
    {
        return self::values();
    }

    /**
     * @return list<string>
     */
    public static function customerPermissions(): array
    {
        return [
            self::ViewProducts->value,
            self::PlaceOrders->value,
            self::ManageProfile->value,
            self::ViewOwnOrders->value,
        ];
    }

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}

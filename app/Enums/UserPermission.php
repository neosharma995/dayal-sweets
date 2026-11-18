<?php

declare(strict_types=1);

namespace App\Enums;

enum UserPermission: string
{
    // Administrative Staff Permissions
    case ManageOrders = 'manage orders';
    case ManageProducts = 'manage products';
    case ManageCustomers = 'manage customers';
    case ManageCoupons = 'manage coupons';
    case ManageOutlets = 'manage outlets';
    case ManageTaxes = 'manage taxes';
    case ManageQueries = 'manage queries';
    case ManageStaff = 'manage staff';
    case ManageRoles = 'manage roles';
    case ManageStoreSettings = 'manage store settings';

    // Website & Branding Permissions (Editor & Admin)
    case ManagePages = 'manage pages';
    case ManageHeaderFooter = 'manage header footer';

    // Customer Frontend Capabilities (Non-Administrative)
    case ViewProducts = 'view products';
    case PlaceOrders = 'place orders';
    case ManageProfile = 'manage profile';
    case ViewOwnOrders = 'view own orders';

    /**
     * @return list<string>
     */
    public static function adminPermissions(): array
    {
        return [
            self::ManageOrders->value,
            self::ManageProducts->value,
            self::ManageCustomers->value,
            self::ManageCoupons->value,
            self::ManageOutlets->value,
            self::ManageTaxes->value,
            self::ManageQueries->value,
            self::ManageStaff->value,
            self::ManageRoles->value,
            self::ManageStoreSettings->value,
            self::ManagePages->value,
            self::ManageHeaderFooter->value,
            self::ViewProducts->value,
            self::PlaceOrders->value,
            self::ManageProfile->value,
            self::ViewOwnOrders->value,
        ];
    }

    /**
     * @return list<string>
     */
    public static function editorPermissions(): array
    {
        return [
            self::ManagePages->value,
            self::ManageHeaderFooter->value,
        ];
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
    public static function staffPermissions(): array
    {
        return [
            self::ManageOrders->value,
            self::ManageProducts->value,
            self::ManageCustomers->value,
            self::ManageCoupons->value,
            self::ManageOutlets->value,
            self::ManageTaxes->value,
            self::ManageQueries->value,
            self::ManageStaff->value,
            self::ManageRoles->value,
            self::ManageStoreSettings->value,
            self::ManagePages->value,
            self::ManageHeaderFooter->value,
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

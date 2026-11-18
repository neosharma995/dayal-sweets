<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ContactQueryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\DietPreferenceController;
use App\Http\Controllers\Admin\DiningQueryController;
use App\Http\Controllers\Admin\HeaderFooterController;
use App\Http\Controllers\Admin\OccasionController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\OutletController;
use App\Http\Controllers\Admin\OutletTableController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Admin\ProductAttributeController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProductTagController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\SeasonalMithaiController;
use App\Http\Controllers\Admin\ShippingZoneController;
use App\Http\Controllers\Admin\TaxRateController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

// Admin Guest Authentication Routes
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');
});

// Admin Protected Portal Routes
Route::middleware(['auth', 'verified', 'staff'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/account', [AccountController::class, 'index'])->name('account');
    Route::patch('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::put('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Order Management Web Routes (CRUD, Tracking & Status Workflow)
    Route::middleware('role_or_permission:admin|manage orders')->prefix('orders')->name('orders.')->group(function () {
        Route::get('/', [OrderController::class, 'index'])->name('index');
        Route::get('/create', [OrderController::class, 'create'])->name('create');
        Route::post('/', [OrderController::class, 'store'])->name('store');
        Route::get('/{order}', [OrderController::class, 'show'])->name('show');
        Route::patch('/{order}/status', [OrderController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{order}', [OrderController::class, 'destroy'])->name('destroy');
    });

    // Product Management Web Routes (CRUD)
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/get-all', [ProductController::class, 'index'])->name('getAll');
        Route::get('/get_all', [ProductController::class, 'index'])->name('getAllUnderscore');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::post('/create', [ProductController::class, 'store'])->name('storeAlias');
        Route::get('/get/{product}', [ProductController::class, 'show'])->name('getById');
        Route::get('/get_by_id/{product}', [ProductController::class, 'show'])->name('getByIdUnderscore');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{product}', [ProductController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/delete/{product}', [ProductController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });

    // Category Management Web Routes (CRUD)
    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::get('/get-all', [CategoryController::class, 'index'])->name('getAll');
        Route::get('/get_all', [CategoryController::class, 'index'])->name('getAllUnderscore');
        Route::get('/create', [CategoryController::class, 'create'])->name('create');
        Route::post('/', [CategoryController::class, 'store'])->name('store');
        Route::post('/create', [CategoryController::class, 'store'])->name('storeAlias');
        Route::get('/get/{category}', [CategoryController::class, 'show'])->name('getById');
        Route::get('/get_by_id/{category}', [CategoryController::class, 'show'])->name('getByIdUnderscore');
        Route::get('/{category}/edit', [CategoryController::class, 'edit'])->name('edit');
        Route::get('/{category}', [CategoryController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{category}', [CategoryController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{category}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/delete/{category}', [CategoryController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{category}', [CategoryController::class, 'destroy'])->name('destroy');
    });

    // Product Attributes Web Routes (CRUD)
    Route::prefix('attributes')->name('attributes.')->group(function () {
        Route::get('/', [ProductAttributeController::class, 'index'])->name('index');
        Route::get('/get-all', [ProductAttributeController::class, 'index'])->name('getAll');
        Route::get('/get_all', [ProductAttributeController::class, 'index'])->name('getAllUnderscore');
        Route::get('/create', [ProductAttributeController::class, 'create'])->name('create');
        Route::post('/', [ProductAttributeController::class, 'store'])->name('store');
        Route::post('/create', [ProductAttributeController::class, 'store'])->name('storeAlias');
        Route::get('/get/{attribute}', [ProductAttributeController::class, 'show'])->name('getById');
        Route::get('/get_by_id/{attribute}', [ProductAttributeController::class, 'show'])->name('getByIdUnderscore');
        Route::get('/{attribute}/edit', [ProductAttributeController::class, 'edit'])->name('edit');
        Route::get('/{attribute}', [ProductAttributeController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{attribute}', [ProductAttributeController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{attribute}', [ProductAttributeController::class, 'update'])->name('update');
        Route::delete('/delete/{attribute}', [ProductAttributeController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{attribute}', [ProductAttributeController::class, 'destroy'])->name('destroy');
    });

    // Seasonal Mithai Management Routes
    Route::prefix('seasonal-mithais')->name('seasonal-mithais.')->group(function () {
        Route::get('/', [SeasonalMithaiController::class, 'index'])->name('index');
        Route::get('/create', [SeasonalMithaiController::class, 'create'])->name('create');
        Route::post('/', [SeasonalMithaiController::class, 'store'])->name('store');
        Route::get('/{seasonalMithai}/edit', [SeasonalMithaiController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch', 'post'], '/update/{seasonalMithai}', [SeasonalMithaiController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{seasonalMithai}', [SeasonalMithaiController::class, 'update'])->name('update');
        Route::delete('/{seasonalMithai}', [SeasonalMithaiController::class, 'destroy'])->name('destroy');
    });

    // Occasion Management Routes
    Route::prefix('occasions')->name('occasions.')->group(function () {
        Route::get('/', [OccasionController::class, 'index'])->name('index');
        Route::get('/create', [OccasionController::class, 'create'])->name('create');
        Route::post('/', [OccasionController::class, 'store'])->name('store');
        Route::get('/{occasion}/edit', [OccasionController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch', 'post'], '/update/{occasion}', [OccasionController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{occasion}', [OccasionController::class, 'update'])->name('update');
        Route::delete('/{occasion}', [OccasionController::class, 'destroy'])->name('destroy');
    });

    // Diet Preference Management Routes
    Route::prefix('diet-preferences')->name('diet-preferences.')->group(function () {
        Route::get('/', [DietPreferenceController::class, 'index'])->name('index');
        Route::get('/create', [DietPreferenceController::class, 'create'])->name('create');
        Route::post('/', [DietPreferenceController::class, 'store'])->name('store');
        Route::get('/{dietPreference}/edit', [DietPreferenceController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch', 'post'], '/update/{dietPreference}', [DietPreferenceController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{dietPreference}', [DietPreferenceController::class, 'update'])->name('update');
        Route::delete('/{dietPreference}', [DietPreferenceController::class, 'destroy'])->name('destroy');
    });

    // Product Tag Management Routes
    Route::prefix('product-tags')->name('product-tags.')->group(function () {
        Route::get('/', [ProductTagController::class, 'index'])->name('index');
        Route::get('/create', [ProductTagController::class, 'create'])->name('create');
        Route::post('/', [ProductTagController::class, 'store'])->name('store');
        Route::get('/{productTag}/edit', [ProductTagController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch', 'post'], '/update/{productTag}', [ProductTagController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{productTag}', [ProductTagController::class, 'update'])->name('update');
        Route::delete('/{productTag}', [ProductTagController::class, 'destroy'])->name('destroy');
    });

    // Shipping Zone Management Web Routes (CRUD - WooCommerce Style)
    Route::prefix('shipping-zones')->name('shipping-zones.')->group(function () {
        Route::get('/', [ShippingZoneController::class, 'index'])->name('index');
        Route::get('/get-all', [ShippingZoneController::class, 'index'])->name('getAll');
        Route::get('/get_all', [ShippingZoneController::class, 'index'])->name('getAllUnderscore');
        Route::get('/create', [ShippingZoneController::class, 'create'])->name('create');
        Route::post('/', [ShippingZoneController::class, 'store'])->name('store');
        Route::post('/create', [ShippingZoneController::class, 'store'])->name('storeAlias');
        Route::get('/get/{shippingZone}', [ShippingZoneController::class, 'show'])->name('getById');
        Route::get('/get_by_id/{shippingZone}', [ShippingZoneController::class, 'show'])->name('getByIdUnderscore');
        Route::get('/{shippingZone}/edit', [ShippingZoneController::class, 'edit'])->name('edit');
        Route::get('/{shippingZone}', [ShippingZoneController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{shippingZone}', [ShippingZoneController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{shippingZone}', [ShippingZoneController::class, 'update'])->name('update');
        Route::patch('/{shippingZone}/toggle', [ShippingZoneController::class, 'toggleActive'])->name('toggle');
        Route::delete('/delete/{shippingZone}', [ShippingZoneController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{shippingZone}', [ShippingZoneController::class, 'destroy'])->name('destroy');
    });

    // Tax Rates Management Web Routes (CRUD - WooCommerce Style)
    Route::prefix('taxes')->name('taxes.')->group(function () {
        Route::get('/', [TaxRateController::class, 'index'])->name('index');
        Route::get('/get-all', [TaxRateController::class, 'index'])->name('getAll');
        Route::get('/get_all', [TaxRateController::class, 'index'])->name('getAllUnderscore');
        Route::get('/create', [TaxRateController::class, 'create'])->name('create');
        Route::post('/', [TaxRateController::class, 'store'])->name('store');
        Route::post('/create', [TaxRateController::class, 'store'])->name('storeAlias');
        Route::get('/get/{tax}', [TaxRateController::class, 'show'])->name('getById');
        Route::get('/get_by_id/{tax}', [TaxRateController::class, 'show'])->name('getByIdUnderscore');
        Route::get('/{tax}/edit', [TaxRateController::class, 'edit'])->name('edit');
        Route::get('/{tax}', [TaxRateController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{tax}', [TaxRateController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{tax}', [TaxRateController::class, 'update'])->name('update');
        Route::patch('/{tax}/toggle', [TaxRateController::class, 'toggleActive'])->name('toggle');
        Route::delete('/delete/{tax}', [TaxRateController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{tax}', [TaxRateController::class, 'destroy'])->name('destroy');
    });

    // Outlet Management Web Routes (CRUD, Status & Outlet Shipping Zones)
    Route::prefix('outlets')->name('outlets.')->group(function () {
        Route::post('/switch-context', [OutletController::class, 'switchContext'])->name('switch-context');
        Route::post('/clear-context', [OutletController::class, 'clearContext'])->name('clear-context');

        Route::get('/', [OutletController::class, 'index'])->name('index');
        Route::get('/get-all', [OutletController::class, 'index'])->name('getAll');
        Route::get('/get_all', [OutletController::class, 'index'])->name('getAllUnderscore');
        Route::get('/create', [OutletController::class, 'create'])->name('create');
        Route::post('/', [OutletController::class, 'store'])->name('store');
        Route::post('/create', [OutletController::class, 'store'])->name('storeAlias');
        Route::get('/get/{outlet}', [OutletController::class, 'show'])->name('getById');
        Route::get('/get_by_id/{outlet}', [OutletController::class, 'show'])->name('getByIdUnderscore');
        Route::get('/{outlet}/edit', [OutletController::class, 'edit'])->name('edit');
        Route::get('/{outlet}', [OutletController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{outlet}', [OutletController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{outlet}', [OutletController::class, 'update'])->name('update');
        Route::patch('/{outlet}/toggle', [OutletController::class, 'toggleActive'])->name('toggle');
        Route::delete('/delete/{outlet}', [OutletController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{outlet}', [OutletController::class, 'destroy'])->name('destroy');

        // Products management inside an Outlet
        Route::post('/{outlet}/products/sync', [OutletController::class, 'syncProducts'])->name('products.sync');
        Route::delete('/{outlet}/products/{product}', [OutletController::class, 'detachProduct'])->name('products.detach');
        Route::patch('/{outlet}/products/{product}/pivot', [OutletController::class, 'updateProductPivot'])->name('products.update-pivot');

        // Shipping Zones managed inside each Outlet
        Route::prefix('{outlet}/shipping-zones')->name('shipping-zones.')->group(function () {
            Route::get('/', [ShippingZoneController::class, 'index'])->name('index');
            Route::get('/create', [ShippingZoneController::class, 'create'])->name('create');
            Route::post('/', [ShippingZoneController::class, 'store'])->name('store');
            Route::get('/{shippingZone}/edit', [ShippingZoneController::class, 'edit'])->name('edit');
            Route::get('/{shippingZone}', [ShippingZoneController::class, 'show'])->name('show');
            Route::match(['put', 'patch', 'post'], '/update/{shippingZone}', [ShippingZoneController::class, 'update'])->name('updateAlias');
            Route::match(['put', 'patch'], '/{shippingZone}', [ShippingZoneController::class, 'update'])->name('update');
            Route::patch('/{shippingZone}/toggle', [ShippingZoneController::class, 'toggleActive'])->name('toggle');
            Route::delete('/delete/{shippingZone}', [ShippingZoneController::class, 'destroy'])->name('deleteAlias');
            Route::delete('/{shippingZone}', [ShippingZoneController::class, 'destroy'])->name('destroy');
        });
    });

    // Dining Tables & QR Scanners Management Routes
    Route::prefix('tables')->name('tables.')->group(function () {
        Route::get('/', [OutletTableController::class, 'index'])->name('index');
        Route::get('/create', [OutletTableController::class, 'create'])->name('create');
        Route::post('/', [OutletTableController::class, 'store'])->name('store');
        Route::get('/scanners', [OutletTableController::class, 'scanners'])->name('scanners');
        Route::get('/{table}/edit', [OutletTableController::class, 'edit'])->name('edit');
        Route::match(['put', 'patch', 'post'], '/{table}', [OutletTableController::class, 'update'])->name('update');
        Route::patch('/{table}/status', [OutletTableController::class, 'updateStatus'])->name('update-status');
        Route::post('/{table}/regenerate-qr', [OutletTableController::class, 'regenerateQr'])->name('regenerate-qr');
        Route::delete('/{table}', [OutletTableController::class, 'destroy'])->name('destroy');
    });

    // Dynamic Pages Management Web Routes
    Route::prefix('pages')->name('pages.')->group(function () {
        Route::get('/', [PageController::class, 'index'])->name('index');
        Route::get('/contact-us', [PageController::class, 'contactUs'])->name('contact-us');
        Route::match(['put', 'patch', 'post'], '/contact-us', [PageController::class, 'updateContactUs'])->name('contact-us.update');
        Route::get('/gallery', [PageController::class, 'gallery'])->name('gallery');
        Route::match(['put', 'patch', 'post'], '/gallery', [PageController::class, 'updateGallery'])->name('gallery.update');
        Route::post('/gallery/upload-image', [PageController::class, 'uploadGalleryImage'])->name('gallery.upload-image');
    });

    // Standalone Header & Footer Management Web Routes
    Route::prefix('header-footer')->name('header-footer.')->group(function () {
        Route::get('/', [HeaderFooterController::class, 'index'])->name('index');
        Route::match(['put', 'patch', 'post'], '/', [HeaderFooterController::class, 'update'])->name('update');
        Route::post('/upload-image', [HeaderFooterController::class, 'uploadImage'])->name('upload-image');
    });

    // Customer Contact Queries Management Web Routes
    Route::prefix('contact-queries')->name('contact-queries.')->group(function () {
        Route::get('/', [ContactQueryController::class, 'index'])->name('index');
        Route::get('/{query}', [ContactQueryController::class, 'show'])->name('show');
        Route::patch('/{query}/status', [ContactQueryController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{query}', [ContactQueryController::class, 'destroy'])->name('destroy');
    });

    // Customer Dining Queries / Table Reservations Web Routes
    Route::prefix('dining-queries')->name('dining-queries.')->group(function () {
        Route::get('/', [DiningQueryController::class, 'index'])->name('index');
        Route::get('/{query}', [DiningQueryController::class, 'show'])->name('show');
        Route::patch('/{query}/status', [DiningQueryController::class, 'updateStatus'])->name('update-status');
        Route::delete('/{query}', [DiningQueryController::class, 'destroy'])->name('destroy');
    });

    // Discount Coupons & Outlet Rules Web Routes
    Route::middleware('role_or_permission:admin|manage coupons')->group(function () {
        Route::post('coupons/bulk-action', [CouponController::class, 'bulkAction'])->name('coupons.bulk-action');
        Route::post('coupons/generate-bulk', [CouponController::class, 'generateBulk'])->name('coupons.generate-bulk');
        Route::patch('coupons/{coupon}/toggle-status', [CouponController::class, 'toggleStatus'])->name('coupons.toggle-status');
        Route::resource('coupons', CouponController::class);
    });

    // Roles & Granular Permissions Management Web Routes
    Route::middleware('role_or_permission:admin|manage roles')->resource('roles', RoleController::class)->except(['show']);

    // Registered Customers Directory Web Routes
    Route::middleware('role_or_permission:admin|manage customers')->resource('customers', CustomerController::class)->only(['index']);

    // Staff Members & Direct Creation Web Routes
    Route::middleware('role_or_permission:admin|manage staff')->prefix('users')->name('users.')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('index');
        Route::post('/', [UserController::class, 'store'])->name('store');
        Route::put('/{user}/role', [UserController::class, 'updateRole'])->name('update-role');
        Route::delete('/{user}', [UserController::class, 'destroy'])->name('destroy');
    });
});

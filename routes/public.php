<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\AccountController;
use App\Http\Controllers\Public\CartController;
use App\Http\Controllers\Public\CheckoutController;
use App\Http\Controllers\Public\DashboardController;
use App\Http\Controllers\Public\DeliveryZoneController;
use App\Http\Controllers\Public\HomeController;
use App\Http\Controllers\Public\ProductReviewController;
use App\Http\Controllers\Public\TestimonialController;
use Illuminate\Support\Facades\Route;

// Public Storefront
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [HomeController::class, 'shop'])->name('shop');
Route::get('/cart', [HomeController::class, 'cart'])->name('cart');
Route::get('/checkout', [HomeController::class, 'checkout'])->name('checkout');

// Pincode & Delivery Serviceability
Route::post('/pincode/check', [DeliveryZoneController::class, 'check'])->name('pincode.check');
Route::get('/pincode/current', [DeliveryZoneController::class, 'current'])->name('pincode.current');
Route::post('/pincode/clear', [DeliveryZoneController::class, 'clear'])->name('pincode.clear');

// Session-Backed Cart Operations (For Guest and Authenticated Users)
Route::get('/cart/items', [CartController::class, 'get'])->name('cart.get');
Route::post('/cart/sync', [CartController::class, 'sync'])->name('cart.sync');
Route::post('/cart/clear', [CartController::class, 'clear'])->name('cart.clear');

// Authenticated Checkout Actions (User must be logged in to create orders)
Route::middleware('auth')->prefix('checkout')->name('checkout.')->group(function () {
    Route::post('/create-razorpay-order', [CheckoutController::class, 'createRazorpayOrder'])->name('razorpay.create');
    Route::post('/verify-payment', [CheckoutController::class, 'verifyPayment'])->name('razorpay.verify');
    Route::post('/place-cod-order', [CheckoutController::class, 'placeCodOrder'])->name('cod.place');
});

// Production Webhook Route (Commented out for local testing - enable on live server):
// Route::post('/webhook/razorpay', [CheckoutController::class, 'handleWebhook'])->name('razorpay.webhook');
Route::get('/about-us', [HomeController::class, 'about'])->name('about-us');
Route::get('/contact-us', [HomeController::class, 'contact'])->name('contact');
Route::post('/contact-us', [HomeController::class, 'submitContact'])->name('contact.submit');
Route::post('/contact-us/submit', [HomeController::class, 'submitContact'])->name('contact.submit.alias');
Route::get('/gallery', [HomeController::class, 'gallery'])->name('gallery');
Route::get('/gifting', [HomeController::class, 'gifting'])->name('gifting');
Route::get('/dining', [HomeController::class, 'dining'])->name('dining');
Route::get('/dinning', [HomeController::class, 'dining'])->name('dinning');
Route::get('/privacy-policy', [HomeController::class, 'privacyPolicy'])->name('privacy-policy');
Route::get('/refund-returns', [HomeController::class, 'refundReturns'])->name('refund-returns');
Route::get('/refund-and-returns-policy', [HomeController::class, 'refundReturns'])->name('refund-returns.alias');
Route::get('/franchise', [HomeController::class, 'franchise'])->name('franchise');
Route::get('/testimonials', [TestimonialController::class, 'index'])->name('testimonials');
Route::get('/testimonials/', [TestimonialController::class, 'index'])->name('testimonials.slash');
Route::get('/reviews', [TestimonialController::class, 'index'])->name('reviews');
Route::get('/reviews/', [TestimonialController::class, 'index'])->name('reviews.slash');
Route::post('/testimonials', [TestimonialController::class, 'store'])->middleware('auth')->name('testimonials.store');
Route::get('/product/{slug?}', [HomeController::class, 'product'])->name('product.show');
Route::get('/api/outlets', function () {
    return response()->json([
        'success' => true,
        'data' => \App\Models\Outlet::where('is_active', true)->orderBy('sort_order')->orderBy('id')->get(),
    ]);
})->name('api.outlets');

// Authenticated Smart Role Dispatchers
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'redirect'])->name('dashboard');
    Route::get('/my-account', [AccountController::class, 'redirect'])->name('my-account');
});

// Customer Portal Routes
Route::middleware(['auth', 'verified', 'role:'.UserRole::Customer->value])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/orders', [DashboardController::class, 'orders'])->name('orders');
    Route::get('/purchased-items', [DashboardController::class, 'purchasedSweets'])->name('purchased-items');
    Route::get('/purchased-sweets', [DashboardController::class, 'purchasedSweets'])->name('purchased-sweets');
    Route::get('/products', [DashboardController::class, 'purchasedSweets'])->name('products');
    Route::get('/addresses', [DashboardController::class, 'addresses'])->name('addresses');
    Route::get('/account', [AccountController::class, 'index'])->name('account');
    Route::patch('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::put('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::post('/reviews', [ProductReviewController::class, 'store'])->name('reviews.store');
});

// General Profile Management (Fallback / Shared)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

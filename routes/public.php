<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\AccountController;
use App\Http\Controllers\Public\CheckoutController;
use App\Http\Controllers\Public\DashboardController;
use App\Http\Controllers\Public\HomeController;
use Illuminate\Support\Facades\Route;

// Public Storefront
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/shop', [HomeController::class, 'shop'])->name('shop');
Route::get('/cart', [HomeController::class, 'cart'])->name('cart');
Route::get('/checkout', [HomeController::class, 'checkout'])->name('checkout');

// Authenticated Checkout Actions (User must be logged in to create orders)
Route::middleware('auth')->prefix('checkout')->name('checkout.')->group(function () {
    Route::post('/create-razorpay-order', [CheckoutController::class, 'createRazorpayOrder'])->name('razorpay.create');
    Route::post('/verify-payment', [CheckoutController::class, 'verifyPayment'])->name('razorpay.verify');
    Route::post('/place-cod-order', [CheckoutController::class, 'placeCodOrder'])->name('cod.place');
});
Route::get('/about-us', [HomeController::class, 'about'])->name('about-us');
Route::get('/contact-us', [HomeController::class, 'contact'])->name('contact');
Route::get('/gallery', [HomeController::class, 'gallery'])->name('gallery');
Route::get('/gifting', [HomeController::class, 'gifting'])->name('gifting');
Route::get('/dining', [HomeController::class, 'dining'])->name('dining');
Route::get('/dinning', [HomeController::class, 'dining'])->name('dinning');
Route::get('/product/{slug?}', [HomeController::class, 'product'])->name('product.show');

// Authenticated Smart Role Dispatchers
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'redirect'])->name('dashboard');
    Route::get('/my-account', [AccountController::class, 'redirect'])->name('my-account');
});

// Customer Portal Routes
Route::middleware(['auth', 'verified', 'role:'.UserRole::Customer->value])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/account', [AccountController::class, 'index'])->name('account');
    Route::patch('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::put('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
});

// General Profile Management (Fallback / Shared)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

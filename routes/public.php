<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Public\AccountController;
use App\Http\Controllers\Public\DashboardController;
use App\Http\Controllers\Public\HomeController;
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;

// Public Storefront
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/about-us', fn () => Inertia::render('About'))->name('about-us');

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

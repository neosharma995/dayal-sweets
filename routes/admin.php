<?php

declare(strict_types=1);

use App\Enums\UserRole;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProductController;
use Illuminate\Support\Facades\Route;

// Admin Guest Authentication Routes
Route::middleware('guest')->prefix('admin')->name('admin.')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store'])->name('login.store');
});

// Admin Protected Portal Routes
Route::middleware(['auth', 'verified', 'role:'.UserRole::Admin->value])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/account', [AccountController::class, 'index'])->name('account');
    Route::patch('/account/profile', [AccountController::class, 'updateProfile'])->name('account.profile');
    Route::put('/account/password', [AccountController::class, 'updatePassword'])->name('account.password');
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Product Management Web Routes (CRUD)
    Route::prefix('products')->name('products.')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('index');
        Route::get('/get-all', [ProductController::class, 'index'])->name('getAll');
        Route::get('/create', [ProductController::class, 'create'])->name('create');
        Route::post('/', [ProductController::class, 'store'])->name('store');
        Route::post('/create', [ProductController::class, 'store'])->name('storeAlias');
        Route::get('/get/{product}', [ProductController::class, 'show'])->name('getById');
        Route::get('/{product}/edit', [ProductController::class, 'edit'])->name('edit');
        Route::get('/{product}', [ProductController::class, 'show'])->name('show');
        Route::match(['put', 'patch', 'post'], '/update/{product}', [ProductController::class, 'update'])->name('updateAlias');
        Route::match(['put', 'patch'], '/{product}', [ProductController::class, 'update'])->name('update');
        Route::delete('/delete/{product}', [ProductController::class, 'destroy'])->name('deleteAlias');
        Route::delete('/{product}', [ProductController::class, 'destroy'])->name('destroy');
    });
});

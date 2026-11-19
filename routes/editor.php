<?php

declare(strict_types=1);

use Illuminate\Support\Facades\Route;

// All administrative and editor users share the unified /admin portal based on permissions.
Route::middleware(['auth', 'verified', 'staff'])
    ->prefix('editor')
    ->name('editor.')
    ->group(function () {
        Route::get('/dashboard', fn () => redirect()->route('admin.dashboard'))->name('dashboard');

        Route::prefix('pages')->name('pages.')->group(function () {
            Route::get('/', fn () => redirect()->route('admin.pages.index'))->name('index');
            Route::get('/seo', fn () => redirect()->route('admin.pages.seo'))->name('seo');
            Route::get('/about-us', fn () => redirect()->route('admin.pages.about-us'))->name('about-us');
            Route::get('/contact-us', fn () => redirect()->route('admin.pages.contact-us'))->name('contact-us');
            Route::get('/gallery', fn () => redirect()->route('admin.pages.gallery'))->name('gallery');
            Route::get('/edit/{slug}', fn (string $slug) => redirect()->route('admin.pages.edit', $slug))->name('edit');
        });

        Route::prefix('header-footer')->name('header-footer.')->group(function () {
            Route::get('/', fn () => redirect()->route('admin.header-footer.index'))->name('index');
        });
    });

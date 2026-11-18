<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\HeaderFooterController;
use App\Http\Controllers\Admin\PageController;
use App\Http\Controllers\Editor\EditorDashboardController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:editor|admin'])
    ->prefix('editor')
    ->name('editor.')
    ->group(function () {
        Route::get('/dashboard', [EditorDashboardController::class, 'index'])->name('dashboard');

        // Dedicated Pages Editing Routes for Editor
        Route::prefix('pages')->name('pages.')->group(function () {
            Route::get('/', [PageController::class, 'index'])->name('index');
            Route::get('/about-us', [PageController::class, 'aboutUs'])->name('about-us');
            Route::match(['put', 'patch', 'post'], '/about-us', [PageController::class, 'updateAboutUs'])->name('about-us.update');
            Route::get('/contact-us', [PageController::class, 'contactUs'])->name('contact-us');
            Route::match(['put', 'patch', 'post'], '/contact-us', [PageController::class, 'updateContactUs'])->name('contact-us.update');
            Route::get('/gallery', [PageController::class, 'gallery'])->name('gallery');
            Route::match(['put', 'patch', 'post'], '/gallery', [PageController::class, 'updateGallery'])->name('gallery.update');
            Route::post('/gallery/upload-image', [PageController::class, 'uploadGalleryImage'])->name('gallery.upload-image');
        });

        // Dedicated Header & Footer Editing Routes for Editor
        Route::prefix('header-footer')->name('header-footer.')->group(function () {
            Route::get('/', [HeaderFooterController::class, 'index'])->name('index');
            Route::match(['put', 'patch', 'post'], '/', [HeaderFooterController::class, 'update'])->name('update');
            Route::post('/upload-image', [HeaderFooterController::class, 'uploadImage'])->name('upload-image');
        });
    });

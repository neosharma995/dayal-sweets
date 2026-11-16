<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    /**
     * Display the public Dayal Sweets storefront landing page.
     */
    public function index(): Response
    {
        return Inertia::render('Welcome', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
            'laravelVersion' => Application::VERSION,
            'phpVersion' => PHP_VERSION,
        ]);
    }

    /**
     * Display the Dayal Sweets About Us page.
     */
    public function about(): Response
    {
        return Inertia::render('About', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Contact Us page.
     */
    public function contact(): Response
    {
        return Inertia::render('ContactUs', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Shop page.
     */
    public function shop(): Response
    {
        return Inertia::render('Shop', [
     * Display the Dayal Sweets Gallery page.
     */
    public function gallery(): Response
    {
        return Inertia::render('Gallery', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }

    /**
     * Display the Dayal Sweets Gifting page.
     */
    public function gifting(): Response
    {
        return Inertia::render('Gifting', [
            'canLogin' => Route::has('login'),
            'canRegister' => Route::has('register'),
        ]);
    }
}

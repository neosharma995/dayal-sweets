<?php

declare(strict_types=1);

namespace App\Http\Controllers\Editor;

use App\Http\Controllers\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EditorDashboardController extends Controller
{
    /**
     * Display the Editor overview dashboard.
     */
    public function index(Request $request): Response
    {
        $pages = Page::where('slug', '!=', 'header-footer')
            ->select('id', 'title', 'slug', 'updated_at')
            ->get();
        $headerFooter = Page::getOrCreateHeaderFooter();

        $stats = [
            'total_pages' => $pages->count(),
            'last_page_updated' => $pages->sortByDesc('updated_at')->first()?->updated_at?->diffForHumans() ?? 'Never',
            'header_footer_updated' => $headerFooter?->updated_at?->diffForHumans() ?? 'Never',
        ];

        return Inertia::render('Editor/Dashboard', [
            'stats' => $stats,
            'pages' => $pages,
            'headerFooter' => $headerFooter,
        ]);
    }
}

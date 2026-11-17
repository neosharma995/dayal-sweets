<?php

declare(strict_types=1);

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    /**
     * Display the Dayal Sweets Testimonials page.
     */
    public function index(Request $request): Response
    {
        $all = Testimonial::where('status', 'published')->get();
        $total = $all->count();
        $sum = $all->sum('rating');
        $average = $total > 0 ? round($sum / $total, 1) : 0.0;

        $breakdown = [
            5 => 0,
            4 => 0,
            3 => 0,
            2 => 0,
            1 => 0,
        ];

        foreach ($all as $item) {
            $r = max(1, min(5, (int) $item->rating));
            $breakdown[$r]++;
        }

        $breakdownMax = max(1, max($breakdown));

        $stats = [
            'total' => $total,
            'average' => $average,
            'breakdown' => $breakdown,
            'breakdown_max' => $breakdownMax,
        ];

        $sort = (string) $request->query('sort', 'recent');
        $query = Testimonial::where('status', 'published');

        if ($sort === 'rating') {
            $query->orderByDesc('rating')->orderByDesc('created_at');
        } elseif ($sort === 'lowest') {
            $query->orderBy('rating')->orderByDesc('created_at');
        } else {
            $query->orderByDesc('created_at');
        }

        $user = $request->user();
        $hasSubmitted = false;
        if ($user) {
            $hasSubmitted = Testimonial::where('user_id', $user->id)->exists();
        }

        $testimonials = $query->get()->map(function (Testimonial $t) {
            $diff = $t->created_at ? $t->created_at->diffForHumans([
                'parts' => 1,
                'short' => false,
                'syntax' => \Carbon\CarbonInterface::DIFF_RELATIVE_TO_NOW,
            ]) : 'recently';

            return [
                'id' => $t->id,
                'name' => $t->name,
                'rating' => (int) $t->rating,
                'content' => $t->content,
                'avatar' => $t->avatar,
                'avatar_bg' => $t->avatar_bg,
                'time_ago' => $diff,
                'created_at' => $t->created_at?->toIso8601String(),
            ];
        });

        return Inertia::render('Testimonials', [
            'stats' => $stats,
            'testimonials' => $testimonials,
            'currentSort' => $sort,
            'hasSubmitted' => $hasSubmitted,
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                ] : null,
            ],
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
            ],
        ]);
    }

    /**
     * Store a new testimonial submission from an authenticated user.
     */
    public function store(Request $request): RedirectResponse
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login', ['redirect' => '/testimonials']);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'content' => ['required', 'string', 'min:5', 'max:2500'],
        ]);

        $existing = Testimonial::where('user_id', $user->id)->first();

        if ($existing) {
            $existing->update([
                'name' => $validated['name'],
                'rating' => $validated['rating'],
                'content' => $validated['content'],
                'status' => 'published',
            ]);
        } else {
            Testimonial::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'rating' => $validated['rating'],
                'content' => $validated['content'],
                'avatar' => null,
                'avatar_bg' => null,
                'status' => 'published',
            ]);
        }

        return redirect()->back()->with('success', 'Thank you! Your testimonial has been submitted successfully.');
    }
}

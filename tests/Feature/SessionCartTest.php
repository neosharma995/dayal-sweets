<?php

declare(strict_types=1);

namespace Tests\Feature;

use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Tests\TestCase;

class SessionCartTest extends TestCase
{
    use DatabaseTransactions;

    protected function setUp(): void
    {
        parent::setUp();
        $this->withoutMiddleware([
            ValidateCsrfToken::class,
        ]);
    }

    public function test_guest_starts_with_empty_cart(): void
    {
        $response = $this->get(route('cart.get'));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'cart' => [],
                'count' => 0,
            ]);
    }

    public function test_cart_can_be_synchronized_into_session(): void
    {
        $payload = [
            'cart' => [
                [
                    'id' => '1-default',
                    'productId' => 1,
                    'name' => 'Royal Kaju Katli',
                    'price' => 450.00,
                    'quantity' => 2,
                    'image' => '/uploads/kaaju.png',
                    'slug' => 'royal-kaju-katli',
                    'variation' => null,
                    'variationLabel' => null,
                ],
            ],
        ];

        $response = $this->postJson(route('cart.sync'), $payload);

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'count' => 2,
            ]);

        $this->assertEquals($payload['cart'], session('cart'));
    }

    public function test_cart_can_be_cleared_from_session(): void
    {
        session([
            'cart' => [
                ['id' => '1', 'name' => 'Sample Item', 'price' => 100, 'quantity' => 1],
            ],
        ]);

        $response = $this->postJson(route('cart.clear'));

        $response->assertOk()
            ->assertJson([
                'success' => true,
                'cart' => [],
                'count' => 0,
            ]);

        $this->assertNull(session('cart'));
    }

    public function test_storefront_shares_cart_via_inertia(): void
    {
        $item = [
            'id' => '5-standard',
            'productId' => 5,
            'name' => 'Festive Hamper',
            'price' => 1500,
            'quantity' => 1,
            'image' => null,
            'slug' => 'festive-hamper',
            'variation' => null,
            'variationLabel' => null,
        ];

        $response = $this->withSession([
            'cart' => [$item],
        ])->get(route('home'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('cart', 1)
            ->where('cart.0.name', 'Festive Hamper')
        );
    }
}

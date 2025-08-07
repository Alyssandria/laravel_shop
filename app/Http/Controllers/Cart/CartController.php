<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CartController extends Controller
{
    public function addCart(Request $request, int $productID)
    {
        $user = $request->user();

        $cart = $user->cart()->firstOrCreate([
            'user_id' =>  $user->id
        ]);

        if ($existing = $cart->cartItems()->where('product_id', $productID)->first()) {
            $existing->increment('quantity');
        } else {
            $cart->cartItems()->create([
                'product_id' => $productID,
                'quantity' => 1
            ]);
        }

        return response()->json($cart->cartItems()->where('product_id', $productID)->first());
    }

    public function getCart(Request $request)
    {
        $user = $request->user();
        $cartItems = $user->cart()->first()->cartItems()->get();

        // GET PRODUCT QUANTITY BY ORDER
        $itemQuantity = [];
        foreach ($cartItems->toArray() as $product) {
            $itemQuantity[] = $product['quantity'];
        }

        // FETCH ALL PRODUCT IN CART BASED ON ID
        $responses = Http::pool(function (Pool $pool) use ($cartItems) {
            return $cartItems->map(function ($item) use ($pool) {
                return ($pool->get('https://dummyjson.com/products/' . $item['product_id']));
            })->toArray();
        });

        $products = []; // PUT SUCCESSFUL REQUESTS TO ARRAY
        foreach ($responses as $index => $response) {
            if ($response->successful()) {

                $products[] = [
                    "product" => $response->json(),
                    "quantity" => $itemQuantity[$index]
                ];

            } else {
                // REQUEST FAILURE HANDLER
                logger()->warning('Request failed: ' . $response->status());
            }
        }

        return Inertia::render('shop/cart', ['products' => $products]);
    }
}

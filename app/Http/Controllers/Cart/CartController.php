<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use App\Services\PaypalService;
use App\Services\ProductService;
use Illuminate\Http\Client\Pool;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class CartController extends Controller
{
    public function addItem(Request $request, int $productID)
    {
        $user = $request->user();

        $cart = $user->cart()->firstOrCreate([
            'user_id' => $user->id,
        ]);

        if ($existing = $cart->cartItems()->where('product_id', $productID)->first()) {
            $existing->increment('quantity');
        } else {
            $cart->cartItems()->create([
                'product_id' => $productID,
                'quantity' => 1,
            ]);
        }

        return response()->json($cart->cartItems()->where('product_id', $productID)->first());
    }

    public function removeItem(Request $request, CartService $carts,int $productId)
    {
        $userCart = $request->user()->cart()->first();

        if ($product = $userCart->cartItems()->where('product_id', $productId)->first()) {
            $product->delete();
        } else {
            //CANNOT FIND PRODUCT OR SOMETHING ELSE WENT WRONG
            logger()->warning('Request failed: ' . 'Failure to find product');
        }

        $products = $carts->getCartItems($request);

        return response()->json(['products' => $products]);
    }

    public function getItems(ProductService $products, CartService $carts, Request $request)
    {
        $products = $products->getProducts($carts->getCartItems($request));
        return response()->json(['products' => $products->map(fn($product) => ['product' => $product])->values()]);
    }

    public function getCart()
    {
        return Inertia::render('shop/cart');
    }

    public function getCheckout(PaypalService $paypal, CartService $carts, Request $request)
    {
        $products = $carts->getCartItems($request, $request->query('ids'));

        $items = array_map(function ($item) {
            $product = $item['product'];

            return [
                'name' => $product['title'],
                'quantity' => $item['quantity'],
                'sku' => $product['id'],
                'unit_amount' => [
                    'currency_code' => 'USD',
                    'value' => round($product['price'] - $product['price'] * ($product['discountPercentage'] / 100), 2),
                ],
            ];
        }, $products);

        return $paypal->handlePayment($items);
    }
}

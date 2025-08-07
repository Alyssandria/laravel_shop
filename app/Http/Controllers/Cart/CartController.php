<?php

namespace App\Http\Controllers\Cart;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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
}

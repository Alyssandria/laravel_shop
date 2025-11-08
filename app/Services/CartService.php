<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CartService
{
    /**
     * @return array|array<int,array>
     * @param string|mixed[] $ids
     */
    public function getCartItems(Request $request, string|array $ids = null): Collection
    {
        $user = $request->user();
        $userCart = $user->cart()->first();

        if(!$userCart) {
            return [];
        }

        $userCartItems = $userCart->cartItems();

        if($ids == null || $ids == "all") {
            return $cartItems = $userCartItems->get()->mapWithKeys(function ($item) {
                return [$item['id'] => $item];
            });
        }

        return $userCartItems->whereIn('id', $ids)->get()->mapWithKeys(function ($item) {
            return [$item['id'] => $item];
        });
    }
}

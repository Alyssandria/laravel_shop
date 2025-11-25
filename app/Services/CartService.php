<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class CartService
{
    /**
     * @return Collection
     * @param string|mixed[] $ids
     */
    public function getCartItems(Request $request, string|array|null $ids = null)
    {
        $user = $request->user();
        $userCart = $user->cart()->first();

        if (!$userCart) {
            return collect();
        }

        $userCartItems = $userCart->cartItems();

        if ($ids == null || $ids == 'all') {
            $cartItems = $userCartItems->get()->mapWithKeys(function ($item) {
                return [$item['id'] => $item];
            });

            return $cartItems;
        }

        return $userCartItems
            ->whereIn('id', $ids)
            ->get()
            ->mapWithKeys(function ($item) {
                return [$item['id'] => $item];
            });
    }
}

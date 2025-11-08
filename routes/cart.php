<?php

use App\Http\Controllers\Cart\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'getCart'])->name('cart');
    Route::get('/cart-items', [CartController::class, 'getItems'])->name('cart.items');
    Route::delete('/cart/remove/{productId}', [CartController::class, 'removeItem'])->name('cart.remove');
});

<?php

use App\Http\Controllers\Cart\CartController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/cart', [CartController::class, 'getCart'])->name('cart');
    Route::delete('/remove/{productId}', [CartController::class, 'remove'])->name('cart.remove');
});

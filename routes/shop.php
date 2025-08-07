<?php

use App\Http\Controllers\Cart\CartController;
use App\Http\Controllers\Shop\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/shop', [ShopController::class, 'index'])
    ->name('shop');

Route::middleware('auth')->group(function () {
    Route::post('/cart/{productID}', [CartController::class, 'addCart'])
        ->name('cart.add');
});

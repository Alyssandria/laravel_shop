<?php

use App\Http\Cart\Controller\CartController;
use App\Http\Controllers\Shop\ShopController;
use Illuminate\Support\Facades\Route;

Route::get('/shop', [ShopController::class, 'index'])
    ->name('shop');

Route::middleware('auth')->group(function () {
    Route::get('/cart/{productID}', [CartController::class, 'addCart'])
        ->name('cart.add');
});

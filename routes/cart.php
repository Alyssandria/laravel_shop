<?php

use App\Http\Controllers\Cart\CartController;
use Illuminate\Support\Facades\Route;

Route::get('/cart', [CartController::class, 'getCart'])
    ->name('cart')->middleware('auth');

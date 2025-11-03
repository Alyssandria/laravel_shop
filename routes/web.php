<?php

use App\Services\PaypalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (PaypalService $paypal) {
    return $paypal->handlePayment();
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/paypal/return', function (PaypalService $paypal, Request $request) {

    $orderBody = [
        'id' => $request->query('token')
    ];
    $paypal->captureOrder($orderBody);
})->name('paypal.return');

require __DIR__ . '/cart.php';
require __DIR__ . '/shop.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

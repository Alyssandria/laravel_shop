<?php

use App\Http\Controllers\Cart\CartController;
use App\Services\PaypalService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function (Request $request) {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

Route::get('/paypal/checkout', [CartController::class, 'getCheckout'])->name('paypal.checkout');

Route::get('/paypal/return', function (PaypalService $paypal, Request $request) {
    $orderBody = [
        'id' => $request->query('token'),
    ];

    $capturedOrder = $paypal->captureOrder($orderBody);
    $capturedOrderTotal = floatval($capturedOrder['purchase_units'][0]['amount']['value']);

    DB::transaction(function () use ($request, $capturedOrder, $capturedOrderTotal) {
        $user = $request->user();
        $order = $user->order()->create(['user_id' => $user->id, 'total' => $capturedOrderTotal]);

        foreach ($capturedOrder['purchase_units'][0]['items'] as $item) {
            $order->orderItems()->create([
                'product_id' => $item['sku'],
                'price' => $item['unit_amount']['value'],
                'quantity' => $item['quantity'],
            ]);
        }

        return response()->json(['error' => 'Order creation failed']);
    });

    dd($capturedOrder, 'captured order uploaded to database');
})->name('paypal.return');

require __DIR__ . '/cart.php';
require __DIR__ . '/shop.php';
require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

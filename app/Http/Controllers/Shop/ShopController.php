<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;

class ShopController extends Controller
{
    public function index()
    {
        $products = Http::get('https://dummyjson.com/products')->json()['products'];
        return Inertia::render('shop/shop', compact('products'));
    }
}

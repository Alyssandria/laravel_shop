<?php

namespace App\Services;

use Illuminate\Http\Client\Pool;
use Illuminate\Support\Facades\Http;

class ProductService {
    /**
     * @return void
     * @param mixed $data
     */
    public function getProducts($data) {
        $responses = Http::pool(function (Pool $pool) use ($data) {
            return $data
                ->map(function ($item) use ($pool) {
                    return $pool->get('https://dummyjson.com/products/' . $item['product_id']);
                })
                ->toArray();
        });

        $products = collect(); // PUT SUCCESSFUL REQUESTS TO ARRAY
        foreach ($responses as $index => $response) {
            if ($response->successful()) {
                $product = $response->json();
                $products[$product['id']] = $product;
            } else {
            }
        }

        return $products;
    }
}

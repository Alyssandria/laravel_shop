<?php

namespace App\Services;

use PaypalServerSdkLib\Authentication\ClientCredentialsAuthCredentialsBuilder;
use PaypalServerSdkLib\Environment;
use PaypalServerSdkLib\Models\Builders\AmountBreakdownBuilder;
use PaypalServerSdkLib\Models\Builders\AmountWithBreakdownBuilder;
use PaypalServerSdkLib\Models\Builders\ItemBuilder;
use PaypalServerSdkLib\Models\Builders\MoneyBuilder;
use PaypalServerSdkLib\Models\Builders\OrderApplicationContextBuilder;
use PaypalServerSdkLib\Models\Builders\OrderRequestBuilder;
use PaypalServerSdkLib\Models\Builders\PurchaseUnitRequestBuilder;
use PaypalServerSdkLib\PaypalServerSdkClient;
use PaypalServerSdkLib\PaypalServerSdkClientBuilder;


class PaypalService
{
    protected PaypalServerSdkClient $client;

    public function __construct()
    {

        $this->client = PaypalServerSdkClientBuilder::init()
            ->clientCredentialsAuthCredentials(
                ClientCredentialsAuthCredentialsBuilder::init(
                    config('paypal.sandbox.client_id'),
                    config('paypal.sandbox.client_secret'),
                )
            )
            ->environment(Environment::SANDBOX)
            ->build();
    }

    protected function createOrder()
    {
        $orderBody = [
            'body' => [
                "intent" => "CAPTURE",
                "payment_source" => [
                    "paypal" => [
                        "experience_context" => [
                            "payment_method_preference" => "IMMEDIATE_PAYMENT_REQUIRED",
                            "landing_page" => "LOGIN",
                            "shipping_preference" => "GET_FROM_FILE",
                            "user_action" => "PAY_NOW",
                            "return_url" => route('paypal.return'),
                        ],
                    ],
                ],
                "purchase_units" => [
                    [
                        "invoice_id" => "90210",
                        "amount" => [
                            "currency_code" => "USD",
                            "value" => "230.00",
                            "breakdown" => [
                                "item_total" => [
                                    "currency_code" => "USD",
                                    "value" => "220.00",
                                ],
                                "shipping" => [
                                    "currency_code" => "USD",
                                    "value" => "10.00",
                                ],
                            ],
                        ],
                        "items" => [
                            [
                                "name" => "T-Shirt",
                                "description" => "Super Fresh Shirt",
                                "unit_amount" => [
                                    "currency_code" => "USD",
                                    "value" => "20.00",
                                ],
                                "quantity" => "1",
                                "category" => "PHYSICAL_GOODS",
                                "sku" => "sku01",
                                "image_url" => "https://example.com/static/images/items/1/tshirt_green.jpg",
                                "url" => "https://example.com/url-to-the-item-being-purchased-1",
                                "upc" => [
                                    "type" => "UPC-A",
                                    "code" => "123456789012",
                                ],
                            ],
                            [
                                "name" => "Shoes",
                                "description" => "Running, Size 10.5",
                                "sku" => "sku02",
                                "unit_amount" => [
                                    "currency_code" => "USD",
                                    "value" => "100.00",
                                ],
                                "quantity" => "2",
                                "category" => "PHYSICAL_GOODS",
                                "image_url" => "https://example.com/static/images/items/1/shoes_running.jpg",
                                "url" => "https://example.com/url-to-the-item-being-purchased-2",
                                "upc" => [
                                    "type" => "UPC-A",
                                    "code" => "987654321012",
                                ],
                            ],
                        ],
                    ],
                ],
            ]
        ];

        $apiResponse = $this->client->getOrdersController()->createOrder($orderBody);

        return (json_decode($apiResponse->getBody(), true));
    }

    public function handlePayment()
    {
        $order = $this->createOrder();

        foreach ($order['links'] as $link) {
            if ($link['rel'] == 'payer-action') {
                return redirect($link['href']);
            }
        }
    }

    public function captureOrder(array $body)
    {
        $response = $this->client->getOrdersController()->captureOrder($body);
        dd(json_decode($response->getBody(), true));
    }
}

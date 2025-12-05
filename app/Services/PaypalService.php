<?php

namespace App\Services;

use PaypalServerSdkLib\Authentication\ClientCredentialsAuthCredentialsBuilder;
use PaypalServerSdkLib\Environment;
use PaypalServerSdkLib\PaypalServerSdkClient;
use PaypalServerSdkLib\PaypalServerSdkClientBuilder;

class PaypalService
{
    protected PaypalServerSdkClient $client;

    public function __construct()
    {
        $this->client = PaypalServerSdkClientBuilder::init()
            ->clientCredentialsAuthCredentials(
                ClientCredentialsAuthCredentialsBuilder::init(config('paypal.sandbox.client_id'), config('paypal.sandbox.client_secret')),
            )
            ->environment(Environment::SANDBOX)
            ->build();
    }

    protected function createOrder(array $items)
    {
        $amountValue = 0;
        foreach ($items as $item) {
            $amountValue += $item['unit_amount']['value'] * $item['quantity'];
        }

        $orderBody = [
            'body' => [
                'intent' => 'CAPTURE',
                'payment_source' => [
                    'paypal' => [
                        'experience_context' => [
                            'payment_method_preference' => 'IMMEDIATE_PAYMENT_REQUIRED',
                            'landing_page' => 'LOGIN',
                            'shipping_preference' => 'GET_FROM_FILE',
                            'user_action' => 'PAY_NOW',
                            'return_url' => route('paypal.return'),
                        ],
                    ],
                ],
                'purchase_units' => [
                    [
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => (string) $amountValue,
                            'breakdown' => [
                                'item_total' => [
                                    'currency_code' => 'USD',
                                    'value' => (string) $amountValue,
                                ],
                            ],
                        ],
                        'items' => $items,
                    ],
                ],
            ],
        ];

        $apiResponse = $this->client->getOrdersController()->createOrder($orderBody);

        return json_decode($apiResponse->getBody(), true);
    }

    public function handlePayment(array $items)
    {
        $order = $this->createOrder($items);

        foreach ($order['links'] as $link) {
            if ($link['rel'] == 'payer-action') {
                return redirect($link['href']);
            }
        }
    }

    public function captureOrder(array $body)
    {
        $response = $this->client->getOrdersController()->captureOrder($body);

        $json = json_decode($response->getBody(), true);

        $test = $this->client->getOrdersController()->getOrder([
            'id' => $json['id'],
        ]);

        dd(json_decode($test->getBody(), true));
    }
}

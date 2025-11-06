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
                ClientCredentialsAuthCredentialsBuilder::init(config('paypal.sandbox.client_id'), config('paypal.sandbox.client_secret')),
            )
            ->environment(Environment::SANDBOX)
            ->build();
    }

    protected function createOrder(array $items)
    {
        $amountValue = 0;
        foreach ($items as $item) {
            $amountValue += $item['unit_amount']['value'];
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
                        'invoice_id' => '90210',
                        'amount' => [
                            'currency_code' => 'USD',
                            'value' => (string) $amountValue,
                            'breakdown' => [
                                'item_total' => [
                                    'currency_code' => 'USD',
                                    'value' => (string) $amountValue,
                                ],
                                'shipping' => [
                                    'currency_code' => 'USD',
                                    'value' => '0.00',
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
        dd(json_decode($response->getBody(), true));
    }
}

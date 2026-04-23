<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\StripeReservationPaymentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use UnexpectedValueException;

class StripeWebhookController extends Controller
{
    public function __construct(
        private readonly StripeReservationPaymentService $stripePaymentService,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $secret = config('services.stripe.webhook_secret');

        if (!$secret) {
            return response()->json([
                'message' => 'Stripe webhook secret is not configured.',
            ], 500);
        }

        try {
            $event = Webhook::constructEvent(
                $request->getContent(),
                (string) $request->header('Stripe-Signature'),
                $secret,
            );
        } catch (UnexpectedValueException|SignatureVerificationException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 400);
        }

        $this->stripePaymentService->handleWebhook($event);

        return response()->json([
            'message' => 'Webhook received successfully.',
        ]);
    }
}

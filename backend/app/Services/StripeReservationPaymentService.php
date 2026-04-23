<?php

namespace App\Services;

use App\Models\Reservation;
use Carbon\Carbon;
use DomainException;
use Illuminate\Support\Facades\DB;
use Stripe\Checkout\Session;
use Stripe\Event;
use Stripe\PaymentIntent;
use Stripe\StripeClient;

class StripeReservationPaymentService
{
    public function createCheckoutSession(Reservation $reservation): Session
    {
        $secretKey = config('services.stripe.secret');

        if (!$secretKey) {
            throw new DomainException('Stripe secret key is not configured.');
        }

        $reservation->loadMissing('terrain');

        $stripe = new StripeClient($secretKey);
        $amount = $this->calculateAmount($reservation);

        $session = $stripe->checkout->sessions->create([
            'mode' => 'payment',
            'success_url' => config('services.stripe.success_url'),
            'cancel_url' => config('services.stripe.cancel_url'),
            'payment_method_types' => ['card'],
            'line_items' => [[
                'quantity' => 1,
                'price_data' => [
                    'currency' => strtolower(config('services.stripe.currency', 'MAD')),
                    'unit_amount' => $amount,
                    'product_data' => [
                        'name' => $reservation->terrain->name,
                        'description' => sprintf(
                            'Reservation %s from %s to %s',
                            $reservation->date->format('Y-m-d'),
                            $reservation->start_time,
                            $reservation->end_time,
                        ),
                    ],
                ],
            ]],
            'metadata' => [
                'reservation_id' => (string) $reservation->id,
            ],
            'payment_intent_data' => [
                'metadata' => [
                    'reservation_id' => (string) $reservation->id,
                ],
            ],
        ]);

        $reservation->update([
            'status' => Reservation::STATUS_PENDING_PAYMENT,
            'stripe_session_id' => $session->id,
            'stripe_payment_intent_id' => is_string($session->payment_intent) ? $session->payment_intent : null,
        ]);

        return $session;
    }

    public function handleWebhook(Event $event): void
    {
        if ($event->type === 'checkout.session.completed') {
            $this->handleCheckoutCompleted($event->data->object);

            return;
        }

        if ($event->type === 'checkout.session.expired') {
            $this->handleCheckoutExpired($event->data->object);

            return;
        }

        if ($event->type === 'payment_intent.payment_failed') {
            $this->handlePaymentIntentFailed($event->data->object);
        }
    }

    private function handleCheckoutCompleted(Session $session): void
    {
        $reservation = Reservation::where('stripe_session_id', $session->id)->first();

        if (!$reservation) {
            return;
        }

        $reservation->update([
            'status' => Reservation::STATUS_CONFIRMED,
            'stripe_payment_intent_id' => is_string($session->payment_intent) ? $session->payment_intent : $reservation->stripe_payment_intent_id,
            'confirmed_at' => now(),
        ]);
    }

    private function handleCheckoutExpired(Session $session): void
    {
        $reservation = Reservation::where('stripe_session_id', $session->id)->first();

        if (!$reservation || $reservation->status === Reservation::STATUS_CONFIRMED) {
            return;
        }

        $reservation->update([
            'status' => Reservation::STATUS_EXPIRED,
        ]);
    }

    private function handlePaymentIntentFailed(PaymentIntent $paymentIntent): void
    {
        $reservationId = $paymentIntent->metadata->reservation_id ?? null;

        $reservation = Reservation::query()
            ->where('stripe_payment_intent_id', $paymentIntent->id)
            ->when($reservationId, fn ($query) => $query->orWhereKey((int) $reservationId))
            ->first();

        if (!$reservation || $reservation->status === Reservation::STATUS_CONFIRMED) {
            return;
        }

        $reservation->update([
            'status' => Reservation::STATUS_PAYMENT_FAILED,
        ]);
    }

    private function calculateAmount(Reservation $reservation): int
    {
        $start = Carbon::createFromFormat('H:i:s', $reservation->start_time);
        $end = Carbon::createFromFormat('H:i:s', $reservation->end_time);
        $minutes = $end->diffInMinutes($start);

        if ($minutes <= 0) {
            throw new DomainException('Invalid reservation duration.');
        }

        return (int) round((((float) $reservation->terrain->hour_price * $minutes) / 60) * 100);
    }
}

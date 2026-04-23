<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->string('status')->default('pending_payment')->after('end_time');
            $table->string('stripe_session_id')->nullable()->unique()->after('status');
            $table->string('stripe_payment_intent_id')->nullable()->unique()->after('stripe_session_id');
            $table->timestamp('confirmed_at')->nullable()->after('stripe_payment_intent_id');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn([
                'status',
                'stripe_session_id',
                'stripe_payment_intent_id',
                'confirmed_at',
            ]);
        });
    }
};

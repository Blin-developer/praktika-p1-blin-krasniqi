<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('business_reviews', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->unsignedTinyInteger('rating')->comment('Vlerësimi nga 1 deri në 5');
            $table->text('comment')->nullable()->comment('Komenti apo përshtypja e qytetarit');
            $table->timestamps();

            // Një përdorues mund të bëjë vetëm 1 vlerësim për çdo biznes (mund ta përditësojë)
            $table->unique(['business_id', 'user_id']);
            $table->index('rating');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_reviews');
    }
};


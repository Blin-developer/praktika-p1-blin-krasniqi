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
        Schema::create('advertisements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained('categories')->nullOnDelete();
            $table->string('title', 150);
            $table->text('description')->nullable();
            $table->string('image_url', 500)->nullable();
            $table->string('cta_text', 60)->default('Shiko biznesin');
            $table->string('cta_url', 500)->nullable();
            $table->string('position', 50)->default('homepage_featured'); // homepage_featured, sponsored_businesses, category_promotion, sidebar_banner
            $table->string('status', 20)->default('active'); // draft, scheduled, active, expired, disabled
            $table->timestamp('start_at')->nullable();
            $table->timestamp('end_at')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('priority')->default(0);
            $table->unsignedBigInteger('impressions')->default(0);
            $table->unsignedBigInteger('clicks')->default(0);
            $table->timestamps();

            // Indekse për kërkime të shpejta
            $table->index(['position', 'is_active', 'status']);
            $table->index(['start_at', 'end_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('advertisements');
    }
};

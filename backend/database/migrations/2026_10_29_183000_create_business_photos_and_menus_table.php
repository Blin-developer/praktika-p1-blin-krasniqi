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
        // Tabela e Galerisë së Fotove të Biznesit
        Schema::create('business_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('image_url', 1000);
            $table->string('caption', 255)->nullable();
            $table->boolean('is_primary')->default(false);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['business_id', 'sort_order']);
        });

        // Tabela e Menysë Digjitale për Gastronominë dhe Shërbimet
        Schema::create('business_menu_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->string('menu_category', 100)->default('Pjatat Kryesore');
            $table->string('name', 150);
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->string('currency', 10)->default('EUR');
            $table->string('image_url', 1000)->nullable();
            $table->boolean('is_vegetarian')->default(false);
            $table->boolean('is_popular')->default(false);
            $table->boolean('is_available')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();

            $table->index(['business_id', 'menu_category', 'sort_order']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_menu_items');
        Schema::dropIfExists('business_photos');
    }
};

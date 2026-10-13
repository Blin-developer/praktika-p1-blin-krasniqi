<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('businesses', function (Blueprint $table) {
            $table->id();
            $table->string('name', 150);
            $table->string('slug', 180)->unique();
            $table->foreignId('category_id')->constrained('categories')->restrictOnDelete();
            $table->foreignId('settlement_id')->constrained('settlements')->restrictOnDelete();
            $table->text('description')->nullable();
            $table->string('short_description', 255)->nullable();
            $table->string('address', 255)->nullable();
            $table->string('phone', 50)->nullable();
            $table->string('email', 100)->nullable();
            $table->string('website', 255)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('longitude', 11, 8)->nullable();
            $table->string('logo_path', 255)->nullable();
            // MariaDB 10.4.32 supports ENUM
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->boolean('is_featured')->default(false);
            // MariaDB 10.4 supports JSON columns (stored as longtext with CHECK)
            $table->text('opening_hours')->nullable()->comment('JSON: weekly opening hours');
            $table->timestamps();

            $table->index('status');
            $table->index('category_id');
            $table->index('settlement_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('businesses');
    }
};

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
        // Shto owner_id në tabelën e bizneseve nëse nuk ekziston
        if (! Schema::hasColumn('businesses', 'owner_id')) {
            Schema::table('businesses', function (Blueprint $table) {
                $table->foreignId('owner_id')
                    ->nullable()
                    ->after('settlement_id')
                    ->constrained('users')
                    ->nullOnDelete();
            });
        }

        // Krijimi i tabelës së kërkesave për pronësi
        Schema::create('business_claims', function (Blueprint $table) {
            $table->id();
            $table->foreignId('business_id')->constrained('businesses')->cascadeOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->string('full_name');
            $table->string('phone');
            $table->string('email');
            $table->string('business_role')->default('Pronar'); // Pronar, Drejtor, Menaxher, Përfaqësues
            $table->text('verification_notes')->nullable(); // NUI, certifikatë regjistrimi, shënime
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->text('admin_notes')->nullable();
            $table->foreignId('reviewed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamps();

            $table->index(['business_id', 'status']);
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('business_claims');

        if (Schema::hasColumn('businesses', 'owner_id')) {
            Schema::table('businesses', function (Blueprint $table) {
                $table->dropForeign(['owner_id']);
                $table->dropColumn('owner_id');
            });
        }
    }
};


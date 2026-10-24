<?php

namespace Database\Seeders;

use App\Models\Advertisement;
use App\Models\Business;
use App\Models\Category;
use Illuminate\Database\Seeder;

class AdvertisementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Nëse tashmë ka reklama, mos dubliko
        if (Advertisement::count() > 0) {
            return;
        }

        $published = Business::published()->get();

        if ($published->isEmpty()) {
            return;
        }

        $biz1 = $published->firstWhere('slug', 'restorant-shpella-e-gadimes') ?? $published->first();
        $biz2 = $published->firstWhere('slug', 'avicena-ks-shpk') ?? $published->skip(1)->first();
        $biz3 = $published->firstWhere('slug', 'city-taxi-lipjan') ?? $published->skip(2)->first();
        $biz4 = $published->firstWhere('slug', 'green-garden') ?? $published->skip(3)->first();

        // 1. Homepage Featured Banner
        if ($biz1) {
            Advertisement::create([
                'business_id' => $biz1->id,
                'category_id' => $biz1->category_id,
                'title' => 'Përjetoni Shijen Tradicionale në Lipjan',
                'description' => 'Ambient fantastik, ushqime të freskëta tradicionale dhe mikpritje e ngrohtë familjare.',
                'image_url' => 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
                'cta_text' => 'Eksploro Menynë',
                'cta_url' => null,
                'position' => 'homepage_featured',
                'status' => 'active',
                'start_at' => now()->subDays(2),
                'end_at' => now()->addDays(30),
                'is_active' => true,
                'priority' => 10,
                'impressions' => 142,
                'clicks' => 28,
            ]);
        }

        // 2. Sponsored Business Highlight
        if ($biz2) {
            Advertisement::create([
                'business_id' => $biz2->id,
                'category_id' => $biz2->category_id,
                'title' => 'Analiza Laboratorike me Pajisje Moderne',
                'description' => 'Shërbim i shpejtë, staf profesional dhe saktësi maksimale e rezultateve mjekësore.',
                'image_url' => 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
                'cta_text' => 'Shiko Shërbimet',
                'cta_url' => null,
                'position' => 'sponsored_businesses',
                'status' => 'active',
                'start_at' => now()->subDay(),
                'end_at' => now()->addDays(20),
                'is_active' => true,
                'priority' => 5,
                'impressions' => 96,
                'clicks' => 19,
            ]);
        }

        // 3. Sidebar Banner
        if ($biz3) {
            Advertisement::create([
                'business_id' => $biz3->id,
                'category_id' => $biz3->category_id,
                'title' => 'Transport i Sigurt 24/7 në Komunën e Lipjanit',
                'description' => 'Arritje në kohë, vetura komode dhe çmime fikse e korrekte për çdo destinacion.',
                'image_url' => 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
                'cta_text' => 'Kontakto Tani',
                'cta_url' => null,
                'position' => 'sidebar_banner',
                'status' => 'active',
                'start_at' => now()->subDays(5),
                'end_at' => now()->addDays(15),
                'is_active' => true,
                'priority' => 3,
                'impressions' => 84,
                'clicks' => 15,
            ]);
        }

        // 4. Category Promotion
        if ($biz4) {
            Advertisement::create([
                'business_id' => $biz4->id,
                'category_id' => $biz4->category_id,
                'title' => 'Kopshtari dhe Mirëmbajtje Profesionale e Ambientit',
                'description' => 'Projektim kopshtesh, bimë dekorative dhe sisteme ujitjeje moderne për shtëpinë tuaj.',
                'image_url' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=800&q=80',
                'cta_text' => 'Mëso Më Shumë',
                'cta_url' => null,
                'position' => 'category_promotion',
                'status' => 'active',
                'start_at' => now()->subDay(),
                'end_at' => now()->addDays(25),
                'is_active' => true,
                'priority' => 2,
                'impressions' => 67,
                'clicks' => 11,
            ]);
        }
    }
}

<?php

namespace Tests\Feature;

use App\Models\Advertisement;
use App\Models\Business;
use App\Models\Category;
use App\Models\Settlement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdvertisementApiTest extends TestCase
{
    use RefreshDatabase;

    private function createAdminUser(): User
    {
        return User::factory()->create([
            'is_admin' => true,
        ]);
    }

    private function createRegularUser(): User
    {
        return User::factory()->create([
            'is_admin' => false,
        ]);
    }

    private function createPublishedBusiness(): Business
    {
        $category = Category::create([
            'name' => 'Gastronomi Test',
            'slug' => 'gastronomi-test',
        ]);

        $settlement = Settlement::create([
            'name' => 'Lipjan Qendër Test',
            'slug' => 'lipjan-qender-test',
            'postal_code' => '14000',
        ]);

        return Business::create([
            'name' => 'Restorant Prizreni',
            'slug' => 'restorant-prizreni',
            'category_id' => $category->id,
            'settlement_id' => $settlement->id,
            'status' => 'published',
        ]);
    }

    private function createDraftBusiness(): Business
    {
        $category = Category::first() ?? Category::create([
            'name' => 'Kategori Test',
            'slug' => 'kategori-test',
        ]);

        $settlement = Settlement::first() ?? Settlement::create([
            'name' => 'Vendbanim Test',
            'slug' => 'vendbanim-test',
            'postal_code' => '14000',
        ]);

        return Business::create([
            'name' => 'Biznes Draft Test',
            'slug' => 'biznes-draft-test',
            'category_id' => $category->id,
            'settlement_id' => $settlement->id,
            'status' => 'draft',
        ]);
    }

    /**
     * Reklama aktive shfaqet në endpoint-in publik.
     */
    public function test_active_ad_is_visible_publicly(): void
    {
        $business = $this->createPublishedBusiness();

        Advertisement::create([
            'business_id' => $business->id,
            'title' => 'Ofertë Speciale Dimërore',
            'description' => 'Zbritje 20% për të gjitha porositë në Lipjan.',
            'position' => 'homepage_featured',
            'status' => 'active',
            'is_active' => true,
            'start_at' => now()->subDay(),
            'end_at' => now()->addDays(5),
        ]);

        $response = $this->getJson('/api/v1/advertisements');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.title', 'Ofertë Speciale Dimërore');
    }

    /**
     * Reklama me status draft nuk shfaqet publikisht.
     */
    public function test_draft_ad_is_not_visible_publicly(): void
    {
        $business = $this->createPublishedBusiness();

        Advertisement::create([
            'business_id' => $business->id,
            'title' => 'Reklamë në përgatitje',
            'position' => 'homepage_featured',
            'status' => 'draft',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/advertisements');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /**
     * Reklama me status disabled ose is_active=false nuk shfaqet publikisht.
     */
    public function test_disabled_ad_is_not_visible_publicly(): void
    {
        $business = $this->createPublishedBusiness();

        Advertisement::create([
            'business_id' => $business->id,
            'title' => 'Reklamë e Çaktivizuar',
            'position' => 'homepage_featured',
            'status' => 'disabled',
            'is_active' => false,
        ]);

        $response = $this->getJson('/api/v1/advertisements');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /**
     * Reklama e planifikuar për në të ardhmen (scheduled) nuk shfaqet sot.
     */
    public function test_future_scheduled_ad_is_not_visible_publicly(): void
    {
        $business = $this->createPublishedBusiness();

        Advertisement::create([
            'business_id' => $business->id,
            'title' => 'Promovim Pranveror',
            'position' => 'homepage_featured',
            'status' => 'scheduled',
            'is_active' => true,
            'start_at' => now()->addDays(2),
            'end_at' => now()->addDays(10),
        ]);

        $response = $this->getJson('/api/v1/advertisements');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /**
     * Reklama e skaduar (end_at në të kaluarën) nuk shfaqet publikisht.
     */
    public function test_expired_ad_is_not_visible_publicly(): void
    {
        $business = $this->createPublishedBusiness();

        Advertisement::create([
            'business_id' => $business->id,
            'title' => 'Ofertë e kaluar',
            'position' => 'homepage_featured',
            'status' => 'active',
            'is_active' => true,
            'start_at' => now()->subDays(10),
            'end_at' => now()->subDay(),
        ]);

        $response = $this->getJson('/api/v1/advertisements');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /**
     * Reklama e lidhur me një biznes draft nuk shfaqet publikisht.
     */
    public function test_ad_for_draft_business_is_not_visible_publicly(): void
    {
        $draftBusiness = $this->createDraftBusiness();

        Advertisement::create([
            'business_id' => $draftBusiness->id,
            'title' => 'Reklamë për biznes të papublikuar',
            'position' => 'homepage_featured',
            'status' => 'active',
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/v1/advertisements');

        $response->assertStatus(200)
            ->assertJsonCount(0, 'data');
    }

    /**
     * Data e përfundimit para datës së fillimit refuzohet me 422.
     */
    public function test_ad_end_date_before_start_date_is_rejected(): void
    {
        $admin = $this->createAdminUser();
        $business = $this->createPublishedBusiness();

        $response = $this->actingAs($admin)
            ->postJson('/api/v1/admin/advertisements', [
                'business_id' => $business->id,
                'title' => 'Datat e gabuara',
                'position' => 'homepage_featured',
                'status' => 'active',
                'start_at' => '2026-12-10 10:00:00',
                'end_at' => '2026-12-05 10:00:00',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['end_at']);
    }

    /**
     * Përdoruesi jo-administrator refuzohet nga menaxhimi i reklamave (403).
     */
    public function test_regular_user_cannot_manage_advertisements(): void
    {
        $regularUser = $this->createRegularUser();
        $business = $this->createPublishedBusiness();

        $response = $this->actingAs($regularUser)
            ->postJson('/api/v1/admin/advertisements', [
                'business_id' => $business->id,
                'title' => 'Tentim i paautorizuar',
                'position' => 'homepage_featured',
                'status' => 'active',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Administratori mund të krijojë, ndryshojë, çaktivizojë dhe fshijë një reklamë.
     */
    public function test_admin_can_crud_advertisement(): void
    {
        $admin = $this->createAdminUser();
        $business = $this->createPublishedBusiness();

        // 1. Create
        $createRes = $this->actingAs($admin)
            ->postJson('/api/v1/admin/advertisements', [
                'business_id' => $business->id,
                'title' => 'Pica Falas çdo të premte',
                'description' => 'Vizitoni restorantin tonë në qendër të Lipjanit.',
                'position' => 'sponsored_businesses',
                'status' => 'active',
                'cta_text' => 'Porosit tani',
                'is_active' => true,
            ]);

        $createRes->assertStatus(201)
            ->assertJsonPath('data.title', 'Pica Falas çdo të premte');

        $adId = $createRes->json('data.id');

        // 2. Update
        $updateRes = $this->actingAs($admin)
            ->putJson("/api/v1/admin/advertisements/{$adId}", [
                'business_id' => $business->id,
                'title' => 'Pica Falas çdo të Shtunë',
                'position' => 'sponsored_businesses',
                'status' => 'active',
            ]);

        $updateRes->assertStatus(200)
            ->assertJsonPath('data.title', 'Pica Falas çdo të Shtunë');

        // 3. Toggle (Deactivate)
        $toggleRes = $this->actingAs($admin)
            ->patchJson("/api/v1/admin/advertisements/{$adId}/toggle", [
                'is_active' => false,
            ]);

        $toggleRes->assertStatus(200)
            ->assertJsonPath('data.is_active', false);

        // 4. Delete
        $deleteRes = $this->actingAs($admin)
            ->deleteJson("/api/v1/admin/advertisements/{$adId}");

        $deleteRes->assertStatus(200);

        $this->assertDatabaseMissing('advertisements', ['id' => $adId]);
    }

    /**
     * Klikimi i reklamës regjistrohet realisht në bazën e të dhënave.
     */
    public function test_tracking_ad_click_increments_counter(): void
    {
        $business = $this->createPublishedBusiness();

        $ad = Advertisement::create([
            'business_id' => $business->id,
            'title' => 'Kliko këtu për ofertë',
            'position' => 'homepage_featured',
            'status' => 'active',
            'is_active' => true,
            'clicks' => 0,
        ]);

        $response = $this->postJson("/api/v1/advertisements/{$ad->id}/click");

        $response->assertStatus(200)
            ->assertJson(['status' => 'success', 'clicks' => 1]);

        $this->assertDatabaseHas('advertisements', [
            'id' => $ad->id,
            'clicks' => 1,
        ]);
    }
}

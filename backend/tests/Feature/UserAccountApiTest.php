<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Category;
use App\Models\Settlement;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class UserAccountApiTest extends TestCase
{
    use RefreshDatabase;

    private function createPublishedBusiness(): Business
    {
        $category = Category::create([
            'name' => 'Auto & Transport',
            'slug' => 'auto-transport',
        ]);

        $settlement = Settlement::create([
            'name' => 'Lipjan Qendër',
            'slug' => 'lipjan-qender',
            'postal_code' => '14000',
        ]);

        return Business::create([
            'name' => 'Autoservis Lipjani',
            'slug' => 'autoservis-lipjani',
            'category_id' => $category->id,
            'settlement_id' => $settlement->id,
            'status' => 'published',
        ]);
    }

    /**
     * Regjistrimi publik i suksesshëm kthen 201 dhe token Sanctum.
     * Përdoruesi ka is_admin = false.
     */
    public function test_user_can_register_successfully(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Agim Krasniqi',
            'email' => 'agim@lipjani.test',
            'password' => 'secret12345',
            'password_confirmation' => 'secret12345',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'token',
                'user' => ['id', 'name', 'email', 'is_admin'],
            ])
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'name' => 'Agim Krasniqi',
                    'email' => 'agim@lipjani.test',
                    'is_admin' => false,
                ],
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'agim@lipjani.test',
            'is_admin' => false,
        ]);
    }

    /**
     * Regjistrimi me email ekzistues refuzohet me 422.
     */
    public function test_duplicate_email_registration_is_rejected(): void
    {
        User::factory()->create(['email' => 'ekzistues@lipjani.test']);

        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Përdorues i Ri',
            'email' => 'ekzistues@lipjani.test',
            'password' => 'secret12345',
            'password_confirmation' => 'secret12345',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Fjalëkalimi më pak se 8 karaktere ose mospërputhja e konfirmimit refuzohet.
     */
    public function test_short_password_or_unconfirmed_is_rejected(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Test User',
            'email' => 'test@lipjani.test',
            'password' => 'shkurt',
            'password_confirmation' => 'tjeter',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }

    /**
     * Përdoruesi i thjeshtë nuk mund ta bëjë veten admin përmes regjistrimit (mass-assignment protection).
     */
    public function test_user_cannot_register_as_admin(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Hacker User',
            'email' => 'hacker@lipjani.test',
            'password' => 'secret12345',
            'password_confirmation' => 'secret12345',
            'is_admin' => true,
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('users', [
            'email' => 'hacker@lipjani.test',
            'is_admin' => false,
        ]);
    }

    /**
     * Përdoruesi i zakonshëm mund të kyçet në portalin e përdoruesve me userLogin.
     */
    public function test_regular_user_can_login_via_user_portal(): void
    {
        $user = User::factory()->create([
            'email' => 'perdorues@lipjani.test',
            'password' => Hash::make('password123'),
            'is_admin' => false,
        ]);

        $response = $this->postJson('/api/v1/auth/user-login', [
            'email' => 'perdorues@lipjani.test',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['status', 'token', 'user'])
            ->assertJson(['status' => 'success']);
    }

    /**
     * Përdoruesi mund të përditësojë emrin dhe të dhënat e profilit personal.
     */
    public function test_user_can_update_own_profile(): void
    {
        $user = User::factory()->create([
            'name' => 'Emri Fillestar',
            'email' => 'fillestar@lipjani.test',
            'is_admin' => false,
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/v1/auth/profile', [
                'name' => 'Emri i Ri i Ndryshuar',
                'email' => 'fillestar@lipjani.test',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.name', 'Emri i Ri i Ndryshuar');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Emri i Ri i Ndryshuar',
        ]);
    }

    /**
     * Përdoruesi mund të ndryshojë fjalëkalimin e vet duke dhënë fjalëkalimin aktual.
     */
    public function test_user_can_change_password(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('oldpassword123'),
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/v1/auth/password', [
                'current_password' => 'oldpassword123',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);

        $user->refresh();
        $this->assertTrue(Hash::check('newpassword123', $user->password));
    }

    /**
     * Ndryshimi i fjalëkalimit me fjalëkalim aktual të gabuar refuzohet.
     */
    public function test_change_password_with_wrong_current_password_fails(): void
    {
        $user = User::factory()->create([
            'password' => Hash::make('correctpass123'),
        ]);

        $response = $this->actingAs($user)
            ->putJson('/api/v1/auth/password', [
                'current_password' => 'wrongpass123',
                'password' => 'newpassword123',
                'password_confirmation' => 'newpassword123',
            ]);

        $response->assertStatus(422);
    }

    /**
     * Përdoruesi mund të ruajë (favorite), listojë dhe heqë një biznes nga lista e tij.
     */
    public function test_user_can_toggle_and_list_favorite_businesses(): void
    {
        $user = User::factory()->create(['is_admin' => false]);
        $business = $this->createPublishedBusiness();

        // 1. Add favorite
        $toggleRes1 = $this->actingAs($user)
            ->postJson("/api/v1/user/favorites/{$business->id}");

        $toggleRes1->assertStatus(200)
            ->assertJson(['status' => 'success', 'is_saved' => true]);

        $this->assertDatabaseHas('user_favorites', [
            'user_id' => $user->id,
            'business_id' => $business->id,
        ]);

        // 2. List favorites
        $listRes = $this->actingAs($user)
            ->getJson('/api/v1/user/favorites');

        $listRes->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.id', $business->id);

        // 3. Remove favorite (toggle off)
        $toggleRes2 = $this->actingAs($user)
            ->postJson("/api/v1/user/favorites/{$business->id}");

        $toggleRes2->assertStatus(200)
            ->assertJson(['status' => 'success', 'is_saved' => false]);

        $this->assertDatabaseMissing('user_favorites', [
            'user_id' => $user->id,
            'business_id' => $business->id,
        ]);
    }
}

<?php

namespace Tests\Feature;

use App\Models\Business;
use App\Models\Category;
use App\Models\Service;
use App\Models\Settlement;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AdminBusinessApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (config('database.default') === 'sqlite') {
            $this->artisan('migrate');
            $this->artisan('db:seed', ['--class' => 'CatalogSeeder']);
        }
    }

    /**
     * Ndihmës për të krijuar një administrator dhe kthyer token-in e tij.
     */
    protected function authenticateAdmin(): array
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin_test@lipjani.local'],
            [
                'name' => 'Admin Test',
                'password' => Hash::make('secret123'),
                'is_admin' => true,
            ]
        );

        $token = $admin->createToken('admin-test-token')->plainTextToken;

        return [$admin, $token];
    }

    /**
     * Ndihmës për të krijuar një përdorues jo-admin dhe kthyer token-in e tij.
     */
    protected function authenticateRegularUser(): array
    {
        $user = User::firstOrCreate(
            ['email' => 'regular_user@lipjani.local'],
            [
                'name' => 'User Test',
                'password' => Hash::make('secret123'),
                'is_admin' => false,
            ]
        );

        $token = $user->createToken('user-test-token')->plainTextToken;

        return [$user, $token];
    }

    /**
     * 1. Qasja në rrugët administrative pa token refuzohet me 401 Unauthorized.
     */
    public function test_guest_cannot_access_admin_businesses(): void
    {
        $response = $this->getJson('/api/v1/admin/businesses');
        $response->assertStatus(401);

        $responsePost = $this->postJson('/api/v1/admin/businesses', []);
        $responsePost->assertStatus(401);
    }

    /**
     * 2. Përdoruesi jo-administrator refuzohet me 403 Forbidden.
     */
    public function test_non_admin_user_is_forbidden_from_admin_businesses(): void
    {
        [, $token] = $this->authenticateRegularUser();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/businesses');

        $response->assertStatus(403);
    }

    /**
     * 3. Administratori mund të listojë të gjitha bizneset (përfshirë draft dhe archived).
     */
    public function test_admin_can_list_all_businesses_with_pagination_and_counts(): void
    {
        [, $token] = $this->authenticateAdmin();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/businesses?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'status',
                        'category',
                        'settlement',
                        'services',
                    ],
                ],
                'counts' => ['all', 'published', 'draft', 'archived'],
                'meta' => ['current_page', 'last_page', 'total'],
            ]);

        $this->assertGreaterThanOrEqual(30, $response->json('counts.all'));
        $this->assertGreaterThanOrEqual(4, $response->json('counts.draft'));
        $this->assertGreaterThanOrEqual(4, $response->json('counts.archived'));
    }

    /**
     * 4. Filtrimi sipas statusit funksionon siç pritet.
     */
    public function test_admin_can_filter_businesses_by_status(): void
    {
        [, $token] = $this->authenticateAdmin();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/businesses?status=draft');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertNotEmpty($data);
        foreach ($data as $item) {
            $this->assertEquals('draft', $item['status']);
        }
    }

    /**
     * 5. Kërkimi sipas fjalës kyçe funksionon.
     */
    public function test_admin_can_search_businesses(): void
    {
        [, $token] = $this->authenticateAdmin();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/businesses?search=Centrum');

        $response->assertStatus(200);
        $data = $response->json('data');

        $this->assertNotEmpty($data);
        $this->assertStringContainsString('Centrum', $data[0]['name']);
    }

    /**
     * 6. Administratori mund të marrë detajet e një biznesi sipas ID-së.
     */
    public function test_admin_can_get_single_business(): void
    {
        [, $token] = $this->authenticateAdmin();

        $business = Business::first();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/businesses/' . $business->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $business->id,
                    'name' => $business->name,
                ],
            ]);
    }

    /**
     * 7. Administratori mund të krijojë një biznes të ri me të gjitha fushat.
     */
    public function test_admin_can_create_business(): void
    {
        [, $token] = $this->authenticateAdmin();

        $category = Category::first();
        $settlement = Settlement::first();
        $serviceIds = Service::take(2)->pluck('id')->toArray();

        $payload = [
            'name' => 'Auto Mekanika Lipjani Test ' . rand(100, 999),
            'category_id' => $category->id,
            'settlement_id' => $settlement->id,
            'short_description' => 'Servis profesional për makina.',
            'description' => 'Diagnostifikim i avancuar, ndërrim vaji dhe pjesë origjinale.',
            'address' => 'Zona Industriale, Lipjan',
            'phone' => '+383 49 111 222',
            'email' => 'mekanika@lipjanitest.local',
            'website' => 'https://automekanika.test',
            'latitude' => 42.5211,
            'longitude' => 21.1255,
            'status' => 'draft',
            'is_featured' => true,
            'services' => $serviceIds,
        ];

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/businesses', $payload);

        $response->assertStatus(201)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'name' => $payload['name'],
                    'status' => 'draft',
                    'is_featured' => true,
                    'category_id' => $category->id,
                    'settlement_id' => $settlement->id,
                ],
            ]);

        $newBusinessId = $response->json('data.id');
        $this->assertDatabaseHas('businesses', ['id' => $newBusinessId, 'name' => $payload['name']]);
        $this->assertDatabaseHas('business_service', ['business_id' => $newBusinessId, 'service_id' => $serviceIds[0]]);
    }

    /**
     * 8. Krijimi dështon nëse mungojnë fushat e kërkuara ose janë të pavlefshme.
     */
    public function test_admin_create_business_validation_errors(): void
    {
        [, $token] = $this->authenticateAdmin();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/admin/businesses', [
                'name' => '',
                'category_id' => 999999, // inekzistente
                'settlement_id' => 999999, // inekzistente
                'email' => 'jo-adrese-email-valide',
                'website' => 'not an url',
                'status' => 'status-i-pavlefshem',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['name', 'category_id', 'settlement_id', 'email', 'website', 'status']);
    }

    /**
     * 9. Administratori mund të editojë një biznes ekzistues.
     */
    public function test_admin_can_update_business(): void
    {
        [, $token] = $this->authenticateAdmin();

        $business = Business::first();

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->putJson('/api/v1/admin/businesses/' . $business->id, [
                'name' => 'Emri i Ndryshuar Test',
                'category_id' => $business->category_id,
                'settlement_id' => $business->settlement_id,
                'status' => 'published',
                'phone' => '+383 44 999 888',
                'services' => [],
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $business->id,
                    'name' => 'Emri i Ndryshuar Test',
                    'phone' => '+383 44 999 888',
                ],
            ]);

        $this->assertDatabaseHas('businesses', [
            'id' => $business->id,
            'name' => 'Emri i Ndryshuar Test',
        ]);
    }

    /**
     * 10. Administratori mund të ndryshojë me shpejtësi statusin e një biznesi.
     */
    public function test_admin_can_update_business_status(): void
    {
        [, $token] = $this->authenticateAdmin();

        $business = Business::where('status', 'draft')->first() ?: Business::first();

        // Draft -> Published
        $response1 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/businesses/{$business->id}/status", [
                'status' => 'published',
            ]);

        $response1->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $business->id,
                    'status' => 'published',
                ],
            ]);

        // Published -> Archived
        $response2 = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->patchJson("/api/v1/admin/businesses/{$business->id}/status", [
                'status' => 'archived',
            ]);

        $response2->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'id' => $business->id,
                    'status' => 'archived',
                ],
            ]);
    }

    /**
     * 11. Administratori mund të fshijë një biznes.
     */
    public function test_admin_can_delete_business(): void
    {
        [, $token] = $this->authenticateAdmin();

        $category = Category::first();
        $settlement = Settlement::first();

        $business = Business::create([
            'name' => 'Biznes per fshirje ' . rand(100, 999),
            'slug' => 'biznes-per-fshirje-' . rand(100, 999),
            'category_id' => $category->id,
            'settlement_id' => $settlement->id,
            'status' => 'draft',
        ]);

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->deleteJson('/api/v1/admin/businesses/' . $business->id);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $this->assertDatabaseMissing('businesses', ['id' => $business->id]);
    }

    /**
     * 12. Endpoint-i i shërbimeve /api/v1/services kthen shërbimet.
     */
    public function test_can_list_services(): void
    {
        $response = $this->getJson('/api/v1/services');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'count',
                'data' => [
                    '*' => ['id', 'name', 'slug'],
                ],
            ]);
    }
}

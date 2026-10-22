<?php

namespace Tests\Feature;

use Tests\TestCase;

class BusinessApiTest extends TestCase
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
     * Teston shërbimin health check të API-së.
     */
    public function test_api_health_check_returns_ok(): void
    {
        $response = $this->getJson('/api/health');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
            ]);
    }

    /**
     * Teston marrjen e listës së bizneseve nga baza e të dhënave.
     */
    public function test_can_list_published_businesses(): void
    {
        $response = $this->getJson('/api/v1/businesses');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'count',
                'data' => [
                    '*' => [
                        'id',
                        'name',
                        'slug',
                        'status',
                        'category' => ['id', 'name', 'slug'],
                        'settlement' => ['id', 'name', 'slug'],
                        'services',
                    ],
                ],
            ]);
    }

    /**
     * Teston marrjen e një biznesi specifik sipas slug-ut.
     */
    public function test_can_get_single_business_by_slug(): void
    {
        $response = $this->getJson('/api/v1/businesses/centrum');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'slug' => 'centrum',
                ],
            ]);
    }

    /**
     * Teston kthimin e gabimit 404 kur biznesi nuk ekziston.
     */
    public function test_returns_404_for_non_existing_business(): void
    {
        $response = $this->getJson('/api/v1/businesses/biznes-inekzistent');

        $response->assertStatus(404)
            ->assertJson([
                'status' => 'error',
            ]);
    }

    /**
     * Teston marrjen e kategorive dhe vendbanimeve.
     */
    public function test_can_list_categories_and_settlements(): void
    {
        $categoriesResponse = $this->getJson('/api/v1/categories');
        $categoriesResponse->assertStatus(200)
            ->assertJsonStructure(['status', 'data']);

        $settlementsResponse = $this->getJson('/api/v1/settlements');
        $settlementsResponse->assertStatus(200)
            ->assertJsonStructure(['status', 'data']);
    }

    /**
     * Teston kërkimin me emër të plotë.
     */
    public function test_can_search_by_exact_name(): void
    {
        $response = $this->getJson('/api/v1/businesses?search=' . urlencode('Centrum'));
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertEquals('centrum', $data[0]['slug']);
    }

    /**
     * Teston kërkimin me pjesë të emrit (substring).
     */
    public function test_can_search_by_partial_name(): void
    {
        $response = $this->getJson('/api/v1/businesses?search=Palma');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        $this->assertTrue(collect($data)->contains(fn ($b) => str_contains($b['name'], 'Palma')));
    }

    /**
     * Teston kërkimin me shkronja të vogla / të mëdha (case-insensitive).
     */
    public function test_can_search_case_insensitive(): void
    {
        $responseLower = $this->getJson('/api/v1/businesses?search=centrum');
        $responseUpper = $this->getJson('/api/v1/businesses?search=CENTRUM');

        $responseLower->assertStatus(200);
        $responseUpper->assertStatus(200);

        $this->assertNotEmpty($responseLower->json('data'));
        $this->assertNotEmpty($responseUpper->json('data'));
        $this->assertEquals(count($responseLower->json('data')), count($responseUpper->json('data')));
    }

    /**
     * Teston kërkimin me shërbim (p.sh. "Wi-Fi" ose "Parking").
     */
    public function test_can_search_by_service(): void
    {
        $response = $this->getJson('/api/v1/businesses?search=Parking');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $biz) {
            $hasParking = collect($biz['services'])->contains(fn ($s) => str_contains(strtolower($s['name']), 'parking') || str_contains($s['slug'], 'parking'))
                || str_contains(strtolower($biz['name']), 'parking')
                || str_contains(strtolower($biz['description']), 'parking')
                || str_contains(strtolower($biz['short_description']), 'parking');
            $this->assertTrue($hasParking);
        }
    }

    /**
     * Teston kërkimin pa rezultate.
     */
    public function test_search_with_no_results_returns_empty_array(): void
    {
        $response = $this->getJson('/api/v1/businesses?search=TekstInekzistent12345XYZ');
        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'count' => 0,
                'data' => [],
            ]);
    }

    /**
     * Teston filtrin sipas kategorisë.
     */
    public function test_can_filter_by_category(): void
    {
        $response = $this->getJson('/api/v1/businesses?category=gastronomi');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $biz) {
            $this->assertEquals('gastronomi', $biz['category']['slug']);
        }
    }

    /**
     * Teston filtrin sipas vendbanimit.
     */
    public function test_can_filter_by_settlement(): void
    {
        $response = $this->getJson('/api/v1/businesses?settlement=gadime-e-ulet');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $biz) {
            $this->assertEquals('gadime-e-ulet', $biz['settlement']['slug']);
        }
    }

    /**
     * Teston filtrin sipas shërbimit.
     */
    public function test_can_filter_by_service_slug(): void
    {
        $response = $this->getJson('/api/v1/businesses?service=terace-verore');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $biz) {
            $serviceSlugs = collect($biz['services'])->pluck('slug')->all();
            $this->assertContains('terace-verore', $serviceSlugs);
        }
    }

    /**
     * Teston filtrin sipas uebfaqes (me uebfaqe / pa uebfaqe).
     */
    public function test_can_filter_by_website(): void
    {
        $withWeb = $this->getJson('/api/v1/businesses?website=yes');
        $withWeb->assertStatus(200);
        foreach ($withWeb->json('data') as $biz) {
            $this->assertNotEmpty($biz['website']);
        }

        $withoutWeb = $this->getJson('/api/v1/businesses?website=no');
        $withoutWeb->assertStatus(200);
        foreach ($withoutWeb->json('data') as $biz) {
            $this->assertEmpty($biz['website']);
        }
    }

    /**
     * Teston filtrin sipas orarit të punës (me orar / pa orar).
     */
    public function test_can_filter_by_schedule(): void
    {
        $withSched = $this->getJson('/api/v1/businesses?schedule=yes');
        $withSched->assertStatus(200);
        foreach ($withSched->json('data') as $biz) {
            $this->assertNotNull($biz['opening_hours']);
        }

        $withoutSched = $this->getJson('/api/v1/businesses?schedule=no');
        $withoutSched->assertStatus(200);
        foreach ($withoutSched->json('data') as $biz) {
            $this->assertNull($biz['opening_hours']);
        }
    }

    /**
     * Teston kombinimin e disa filtrave njëkohësisht.
     */
    public function test_can_combine_multiple_filters(): void
    {
        $response = $this->getJson('/api/v1/businesses?category=gastronomi&settlement=lipjan-qender&service=terace-verore&website=yes');
        $response->assertStatus(200);
        $data = $response->json('data');
        $this->assertNotEmpty($data);
        foreach ($data as $biz) {
            $this->assertEquals('gastronomi', $biz['category']['slug']);
            $this->assertEquals('lipjan-qender', $biz['settlement']['slug']);
            $this->assertNotEmpty($biz['website']);
            $serviceSlugs = collect($biz['services'])->pluck('slug')->all();
            $this->assertContains('terace-verore', $serviceSlugs);
        }
    }
}


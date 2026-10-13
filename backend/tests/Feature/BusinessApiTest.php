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
        $response = $this->getJson('/api/v1/businesses/restorant-shpella-e-gadimes');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'data' => [
                    'slug' => 'restorant-shpella-e-gadimes',
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
}

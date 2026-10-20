<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class AuthApiTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        if (config('database.default') === 'sqlite') {
            $this->artisan('migrate');
        }
    }

    /**
     * Ndihmës për të krijuar një administrator testues.
     */
    protected function createAdminUser(array $attributes = []): User
    {
        return User::create(array_merge([
            'name' => 'Administrator Test',
            'email' => 'admin@test.local',
            'password' => Hash::make('secret123'),
            'is_admin' => true,
        ], $attributes));
    }

    /**
     * Ndihmës për të krijuar një përdorues të thjeshtë jo-administrator.
     */
    protected function createRegularUser(array $attributes = []): User
    {
        return User::create(array_merge([
            'name' => 'Perdorues Test',
            'email' => 'user@test.local',
            'password' => Hash::make('secret123'),
            'is_admin' => false,
        ], $attributes));
    }

    /**
     * 1. Login me credentials të sakta → sukses dhe kthim i token-it.
     */
    public function test_login_with_correct_credentials_returns_token_and_user_data(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'secret123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'token',
                'token_type',
                'user' => [
                    'id',
                    'name',
                    'email',
                    'is_admin',
                ],
            ])
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                    'is_admin' => true,
                ],
            ]);

        $this->assertNotEmpty($response->json('token'));
    }

    /**
     * 2. Login me password të gabuar → refuzohet me 401.
     */
    public function test_login_with_wrong_password_is_rejected(): void
    {
        $admin = $this->createAdminUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'fjalekalimi-gabuar',
        ]);

        $response->assertStatus(401)
            ->assertJson([
                'status' => 'error',
                'message' => 'Kredencialet e dhëna nuk janë të sakta.',
            ]);
    }

    /**
     * 3. Login pa të dhënat e nevojshme → validation error (422).
     */
    public function test_login_without_required_fields_returns_validation_error(): void
    {
        $response = $this->postJson('/api/v1/auth/login', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email', 'password']);
    }

    /**
     * 4. /api/v1/auth/me pa autentikim → 401 Unauthorized.
     */
    public function test_auth_me_without_authentication_returns_401(): void
    {
        $response = $this->getJson('/api/v1/auth/me');

        $response->assertStatus(401);
    }

    /**
     * 5. /api/v1/admin/test pa autentikim → 401 Unauthorized.
     */
    public function test_admin_test_without_authentication_returns_401(): void
    {
        $response = $this->getJson('/api/v1/admin/test');

        $response->assertStatus(401);
    }

    /**
     * 6. /api/v1/admin/test me autentikim valid të administratorit → 200 OK.
     */
    public function test_admin_test_with_valid_authentication_returns_200(): void
    {
        $admin = $this->createAdminUser();

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'secret123',
        ]);

        $token = $loginResponse->json('token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/admin/test');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'ok',
                'user' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                    'is_admin' => true,
                ],
            ]);
    }

    /**
     * 7. /api/v1/auth/me me autentikim valid kthen administratorin aktual.
     */
    public function test_auth_me_with_valid_token_returns_admin_profile(): void
    {
        $admin = $this->createAdminUser();

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'secret123',
        ]);

        $token = $loginResponse->json('token');

        $response = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/auth/me');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'user' => [
                    'id' => $admin->id,
                    'email' => $admin->email,
                    'is_admin' => true,
                ],
            ]);
    }

    /**
     * 8. Logout funksionon dhe invalidon token-in aktual.
     */
    public function test_logout_invalidates_current_access_token(): void
    {
        $admin = $this->createAdminUser();

        $loginResponse = $this->postJson('/api/v1/auth/login', [
            'email' => $admin->email,
            'password' => 'secret123',
        ]);

        $token = $loginResponse->json('token');

        // Logout
        $logoutResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->postJson('/api/v1/auth/logout');

        $logoutResponse->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Shkyçja u krye me sukses.',
            ]);

        $this->assertDatabaseCount('personal_access_tokens', 0);

        // Pastro guard-in e memorizuar në nivel të procesit të testit për kërkesën e re
        $this->app['auth']->forgetGuards();

        // Kërkesa pasardhëse me të njëjtin token refuzohet
        $meResponse = $this->withHeader('Authorization', 'Bearer ' . $token)
            ->getJson('/api/v1/auth/me');

        $meResponse->assertStatus(401);
    }

    /**
     * 9. Përdoruesi jo-administrator nuk mund të kyçet si administrator.
     */
    public function test_non_admin_user_cannot_login_to_admin(): void
    {
        $regularUser = $this->createRegularUser();

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => $regularUser->email,
            'password' => 'secret123',
        ]);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Qasja e paautorizuar. Vetëm administratorët mund të kyçen.',
            ]);
    }

    /**
     * 10. Seeder-i AdminUserSeeder krijon administratorin me sukses.
     */
    public function test_admin_user_seeder_creates_admin_user(): void
    {
        $this->artisan('db:seed', ['--class' => 'AdminUserSeeder']);

        $this->assertDatabaseHas('users', [
            'email' => env('ADMIN_EMAIL', 'admin@lipjani.test'),
            'is_admin' => true,
        ]);
    }
}

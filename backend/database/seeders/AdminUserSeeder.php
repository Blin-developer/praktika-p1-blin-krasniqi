<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Krijon përdoruesin administrator për mjedisin lokal të zhvillimit (development only).
     */
    public function run(): void
    {
        $adminEmail = env('ADMIN_EMAIL', 'admin@lipjani.test');
        $adminPassword = env('ADMIN_PASSWORD', 'admin12345');
        $adminName = env('ADMIN_NAME', 'Administrator Lipjan');

        User::updateOrCreate(
            ['email' => $adminEmail],
            [
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'is_admin' => true,
                'email_verified_at' => now(),
            ]
        );
    }
}

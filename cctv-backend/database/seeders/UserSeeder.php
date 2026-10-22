<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Account Admin IT
        User::create([
            'name' => 'Admin IT HOMM',
            'username' => 'aithomm',
            'email' => 'admin@saranam.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'department' => 'IT Department',
        ]);

        // Account Staff Security
        User::create([
            'name' => 'I Ketut Patroli',
            'username' => 'ikpatroli',
            'email' => 'security@saranam.com',
            'password' => Hash::make('password123'),
            'role' => 'staff',
            'department' => 'Security Team',
        ]);
    }
}
<?php

namespace Database\Seeders;

use App\Models\CCTV;
use Illuminate\Database\Seeder;

class CCTVSeeder extends Seeder
{
    public function run(): void
    {
        CCTV::create([
            'code' => 'CAM-MB-01',
            'location' => 'Main Lobby & Receptionist',
            'floor' => 'GF',
            'camera_type' => 'Dome 4MP',
            'ip_address' => '192.168.10.11',
            'status' => 'normal',
            'last_checked' => now(),
        ]);

        CCTV::create([
            'code' => 'CAM-MB-02',
            'location' => 'Main Restaurant Area',
            'floor' => 'GF',
            'camera_type' => 'Bullet 4MP',
            'ip_address' => '192.168.10.12',
            'status' => 'broken',
            'damage_notes' => 'Gambar mati total / No Signal',
            'follow_up_plan' => 'Cek kabel FO & Adaptor Power',
            'last_checked' => now(),
        ]);
    }
}
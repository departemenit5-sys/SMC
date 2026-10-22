<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CCTV extends Model
{
    use HasFactory;

    protected $table = 'cctvs';

    protected $fillable = [
        'code',
        'area',
        'location',
        'floor',
        'camera_type',
        'ip_address',
        'status',
        'damage_notes',
        'follow_up_plan',
        'last_checked',
    ];

    public function tickets()
    {
        return $this->hasMany(MaintenanceTicket::class, 'cctv_id');
    }
}
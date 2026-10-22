<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceTicket extends Model
{
    use HasFactory;

    protected $fillable = [
        'cctv_id',
        'issue_type',
        'description',
        'photo_path',
        'reporter_name',
        'reported_at',
        'action_taken',
        'status',
    ];

    public function cctv()
    {
        return $this->belongsTo(CCTV::class, 'cctv_id');
    }
}
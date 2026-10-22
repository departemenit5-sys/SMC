<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cctvs', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // Contoh: CAM-MB-01
            $table->string('location');      // Contoh: Main Building
            $table->string('floor')->default('GF');
            $table->string('camera_type')->nullable();
            $table->string('ip_address')->nullable();
            $table->enum('status', ['normal', 'broken', 'maintenance', 'offline'])->default('normal');
            $table->text('damage_notes')->nullable();
            $table->text('follow_up_plan')->nullable();
            $table->date('last_checked')->nullable();
            $table->timestamps();
        });
    }   

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('c_c_t_v_s');
    }
};

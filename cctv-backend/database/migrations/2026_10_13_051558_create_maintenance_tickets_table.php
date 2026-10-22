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
        Schema::create('maintenance_tickets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cctv_id')->constrained('cctvs')->onDelete('cascade');
            $table->string('issue_type');
            $table->text('description');
            $table->string('photo_path')->nullable(); // Foto bukti max 2MB
            $table->string('reporter_name');
            $table->date('reported_at');
            $table->text('action_taken')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'resolved'])->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('maintenance_tickets');
    }
};

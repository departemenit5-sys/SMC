<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CCTV;
use Illuminate\Http\Request;

class CCTVController extends Controller
{
    /**
     * Menampilkan semua daftar CCTV.
     */
    public function index()
    {
        return response()->json(CCTV::latest()->get(), 200);
    }

    /**
     * Menyimpan data CCTV baru ke database.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:cctvs,code',
            'area' => 'required|string|max:255',           // Area/Gedung Utama (misal: Main Building, HOH, Villa Area)
            'location' => 'required|string|max:255',       // Spesifik Lokasi/Titik Manual (misal: Front Office Counter)
            'floor' => 'nullable|string|max:100',          // Lantai
            'camera_type' => 'nullable|string|max:100',     // Jenis Kamera (PTZ, Dome, Bullet)
            'ip_address' => 'nullable|string|max:45',
            'status' => 'required|in:normal,broken,maintenance,offline',
            'damage_notes' => 'nullable|string',          // Keterangan Rusak
            'follow_up_plan' => 'nullable|string',        // Rencana Tindak Lanjut
            'last_checked' => 'nullable|date',
        ]);

        // Jika last_checked tidak diisi, set otomatis ke tanggal hari ini
        if (empty($validated['last_checked'])) {
            $validated['last_checked'] = now()->format('Y-m-d');
        }

        $cctv = CCTV::create($validated);

        return response()->json([
            'message' => 'Data CCTV berhasil ditambahkan',
            'data' => $cctv
        ], 201);
    }

    /**
     * Menampilkan detail satu data CCTV berdasarkan ID.
     */
    public function show($id)
    {
        $cctv = CCTV::findOrFail($id);
        return response()->json($cctv, 200);
    }

    /**
     * Memperbarui data CCTV yang sudah ada.
     */
    public function update(Request $request, $id)
    {
        $cctv = CCTV::findOrFail($id);

        $validated = $request->validate([
            'code' => 'sometimes|string|max:255|unique:cctvs,code,' . $id,
            'area' => 'sometimes|string|max:255',
            'location' => 'sometimes|string|max:255',
            'floor' => 'nullable|string|max:100',
            'camera_type' => 'nullable|string|max:100',
            'ip_address' => 'nullable|string|max:45',
            'status' => 'nullable|in:normal,broken,maintenance,offline',
            'damage_notes' => 'nullable|string',
            'follow_up_plan' => 'nullable|string',
            'last_checked' => 'nullable|date',
        ]);

        $cctv->update($validated);

        return response()->json([
            'message' => 'Data CCTV berhasil diperbarui',
            'data' => $cctv
        ], 200);
    }

    /**
     * Menghapus data CCTV dari database.
     */
    public function destroy($id)
    {
        CCTV::destroy($id);

        return response()->json([
            'message' => 'Data CCTV berhasil dihapus'
        ], 200);
    }
}
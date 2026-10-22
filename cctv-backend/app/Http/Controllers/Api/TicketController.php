<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceTicket;
use App\Models\CCTV;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = MaintenanceTicket::with('cctv')->latest()->get();
        return response()->json($tickets, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cctv_id' => 'required|exists:cctvs,id',
            'issue_type' => 'required|string',
            'description' => 'required|string',
            'reporter_name' => 'required|string',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048',
        ]);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('tickets_proof', 'public');
        }

        $ticket = MaintenanceTicket::create([
            'cctv_id' => $request->cctv_id,
            'issue_type' => $request->issue_type,
            'description' => $request->description,
            'reporter_name' => $request->reporter_name,
            'reported_at' => now()->format('Y-m-d'),
            'photo_path' => $photoPath,
            'status' => 'pending',
        ]);

        // Otomatis ubah status CCTV menjadi 'broken' & update keterangan rusak
        CCTV::where('id', $request->cctv_id)->update([
            'status' => 'broken',
            'damage_notes' => $request->issue_type . ': ' . $request->description,
            'last_checked' => now()->format('Y-m-d'),
        ]);

        return response()->json(['message' => 'Laporan berhasil dibuat', 'data' => $ticket], 201);
    }

    public function update(Request $request, $id)
    {
        $ticket = MaintenanceTicket::findOrFail($id);
        $ticket->update($request->only(['action_taken', 'status']));

        // Jika tiket diselesaikan (resolved), kembalikan status CCTV ke normal & bersihkan catatan rusak
        if ($request->status === 'resolved') {
            CCTV::where('id', $ticket->cctv_id)->update([
                'status' => 'normal',
                'damage_notes' => null,
                'follow_up_plan' => $request->action_taken ?? 'Selesai diperbaiki',
                'last_checked' => now()->format('Y-m-d'),
            ]);
        }

        return response()->json(['message' => 'Status tiket berhasil diperbarui', 'data' => $ticket], 200);
    }
}
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str; // <-- Wajib di-import agar tidak error 500

class UserController extends Controller
{
    public function index()
    {
        return response()->json(User::latest()->get(), 200);
    }

    /**
     * Helper untuk membuat smart-username dari nama lengkap
     * Contoh: "I Ketut Patroli" -> "ikpatroli"
     */
    private function generateSmartUsername(string $fullName): string
    {
        $cleaned = preg_replace('/[^a-zA-Z0-9\s]/', '', strtolower(trim($fullName)));
        $words = array_values(array_filter(explode(' ', $cleaned)));

        if (empty($words)) {
            return 'user_' . Str::random(5);
        }

        if (count($words) === 1) {
            $baseUsername = $words[0];
        } else {
            $lastName = array_pop($words);
            $initials = '';
            foreach ($words as $w) {
                $initials .= substr($w, 0, 1);
            }
            $baseUsername = $initials . $lastName;
        }

        // Cek jika username sudah terpakai di database
        $finalUsername = $baseUsername;
        $counter = 1;
        while (User::where('username', $finalUsername)->exists()) {
            $finalUsername = $baseUsername . $counter;
            $counter++;
        }

        return $finalUsername;
    }

    public function store(Request $request)
    {
        // Auto-generate username jika tidak diisi manual
        $username = $request->filled('username')
            ? Str::slug($request->username, '')
            : $this->generateSmartUsername($request->name);

        $request->merge(['username' => $username]);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users,username',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,staff',
            'department' => 'required|string',
        ]);

        $validated['password'] = Hash::make($validated['password']);

        $user = User::create($validated);
        return response()->json(['message' => 'User berhasil ditambahkan', 'data' => $user], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        if ($request->filled('username')) {
            $request->merge(['username' => Str::slug($request->username, '')]);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
            'email' => 'sometimes|string|email|max:255|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,staff',
            'department' => 'sometimes|string',
        ]);

        if ($request->filled('password')) {
            $validated['password'] = Hash::make($request->password);
        }

        $user->update($validated);
        return response()->json(['message' => 'Data user berhasil diperbarui', 'data' => $user], 200);
    }

    public function destroy($id)
    {
        User::destroy($id);
        return response()->json(['message' => 'User berhasil dihapus'], 200);
    }
}
// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Role } from '@/types/cctv';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Users, Plus, Edit2, Trash2, UserCheck, ShieldCheck, Mail, Loader2, KeyRound, User as UserIcon, Sparkles } from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // State Modal Pop-up (Buka/Tutup)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | number | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<Role>('staff');
  const [department, setDepartment] = useState('Security Team');

  // Fetch Data User dari Backend Laravel
  const loadUsersData = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Gagal memuat data user dari server Laravel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsersData();
  }, []);

  // Helper Auto Generate Smart-Username ("I Ketut Patroli" -> "ikpatroli")
  const generateSmartUsername = (fullName: string) => {
    const cleaned = fullName.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '');
    const words = cleaned.split(/\s+/).filter(Boolean);

    if (words.length === 0) return '';
    if (words.length === 1) return words[0];

    const lastName = words.pop();
    const initials = words.map((w) => w[0]).join('');
    return `${initials}${lastName}`;
  };

  // Handler Real-time saat Nama Lengkap Diketik
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    if (!isEditing) {
      setUsername(generateSmartUsername(val));
    }
  };

  // Reset Form Input
  const resetForm = () => {
    setIsEditing(null);
    setName('');
    setUsername('');
    setEmail('');
    setPassword('');
    setRole('staff');
    setDepartment('Security Team');
  };

  // Handler Buka Modal Tambah User Baru
  const handleOpenAddModal = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Handler Buka Modal Edit User
  const handleOpenEditModal = (user: any) => {
    setIsEditing(user.id);
    setName(user.name);
    setUsername(user.username || '');
    setEmail(user.email || '');
    setPassword(''); // Kosongkan password saat edit, diisi hanya jika ingin di-reset
    setRole(user.role || 'staff');
    setDepartment(user.department || 'Security Team');
    setIsDialogOpen(true);
  };

  // Handler Simpan Data (Create / Update via Laravel API)
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Alamat Email wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: any = {
        name,
        username: username || generateSmartUsername(name),
        email,
        role,
        department,
      };

      if (password) {
        payload.password = password;
      }

      if (isEditing) {
        await updateUser(Number(isEditing), payload);
      } else {
        if (!password) {
          alert('Password wajib diisi untuk pembuatan akun baru!');
          setIsSubmitting(false);
          return;
        }
        await createUser(payload);
      }

      await loadUsersData(); // Reload data dari Laravel
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      console.error('Error Save User:', error);
      alert(error.message || 'Gagal menyimpan data akun user. Pastikan Email dan Username belum pernah terdaftar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler Hapus User via Laravel API
  const handleDelete = async (id: number | string) => {
    if (confirm('Apakah Anda yakin ingin menghapus akun user ini dari database?')) {
      try {
        await deleteUser(Number(id));
        await loadUsersData();
      } catch (error: any) {
        alert(error.message || 'Gagal menghapus akun user dari server.');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Halaman & Tombol Tambah User */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Management User & Pengguna</h1>
          <p className="text-slate-500 text-xs mt-1">
            Kelola akun akses staff security dan administrator IT portal CCTV.
          </p>
        </div>

        {/* Tombol pemicu Pop-Up Form */}
        <Button onClick={handleOpenAddModal} className="bg-purple-600 hover:bg-purple-700 text-white gap-2 text-xs font-semibold">
          <Plus className="w-4 h-4" /> Tambah User Baru
        </Button>
      </div>

      {/* Tabel Data User (Full Width) */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" /> Daftar Akun Terdaftar ({users.length} Akun)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center p-8 gap-2 text-slate-500 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Memuat daftar akun dari database Laravel...</span>
              </div>
            ) : users.length === 0 ? (
              <p className="text-sm text-slate-500 italic p-4 text-center">Belum ada akun terdaftar.</p>
            ) : (
              users.map((u) => (
                <div
                  key={u.id}
                  className="p-4 border rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white hover:bg-slate-50 transition shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {u.role === 'admin' ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <UserCheck className="w-5 h-5" />
                      )}
                    </div>

                    <div className="overflow-hidden">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-800">{u.name}</span>
                        <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                          @{u.username || 'user'}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        {u.department || 'Security Team'} • Terdaftar: {u.created_at ? new Date(u.created_at).toLocaleDateString('id-ID') : '-'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Badge
                      className={
                        u.role === 'admin'
                          ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                          : 'bg-blue-100 text-blue-700 hover:bg-blue-100'
                      }
                    >
                      {(u.role || 'STAFF').toUpperCase()}
                    </Badge>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-slate-200"
                      onClick={() => handleOpenEditModal(u)}
                    >
                      <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 hover:bg-slate-200"
                      onClick={() => handleDelete(u.id)}
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* MODAL POP-UP FORM DIALOG (TAMBAH / EDIT USER) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Akun User' : 'Tambah Akun User Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Isi rincian informasi pengguna di bawah ini. Username login akan di-generate otomatis dari nama.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveUser} className="space-y-3.5 py-2">
            <div>
              <Label className="text-xs font-semibold">Nama Lengkap</Label>
              <Input
                placeholder="misal: I Ketut Patroli"
                className="text-xs mt-1"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Username (Akses Login Auto-Generated)</span>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => setUsername(generateSmartUsername(name))}
                    className="text-[10px] text-purple-600 hover:underline flex items-center gap-0.5"
                  >
                    <Sparkles className="w-3 h-3" /> Auto Generate
                  </button>
                )}
              </Label>
              <div className="relative mt-1">
                <Input
                  placeholder="misal: ikpatroli"
                  className="text-xs pr-8 font-semibold text-purple-700 bg-purple-50/50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Alamat Email (Wajib)</Label>
              <Input
                type="email"
                placeholder="misal: ketut.security@saranam.com"
                className="text-xs mt-1"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Password Login</span>
                {isEditing && <span className="text-[10px] text-slate-400 font-normal">(Kosongkan jika tidak diubah)</span>}
              </Label>
              <div className="relative mt-1">
                <Input
                  type="password"
                  placeholder={isEditing ? '••••••••' : 'Masukkan password (min. 6 karakter)...'}
                  className="text-xs pr-8"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!isEditing}
                />
                <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Role Hak Akses</Label>
                <select
                  className="w-full p-2 border rounded-md text-xs mt-1 bg-white font-medium"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                >
                  <option value="staff">Staff Security</option>
                  <option value="admin">Admin IT</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold">Departemen</Label>
                <Input
                  placeholder="misal: Security Team"
                  className="text-xs mt-1"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>
            </div>

            <DialogFooter className="pt-4 flex gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit" size="sm" disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold">
                {isSubmitting ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : isEditing ? (
                  'Simpan Perubahan'
                ) : (
                  'Tambah User'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
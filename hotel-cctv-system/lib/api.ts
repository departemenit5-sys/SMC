// lib/api.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.110.67/api';
const STORAGE_URL = process.env.NEXT_PUBLIC_STORAGE_URL || 'http://192.168.110.67/storage';

/**
 * Helper untuk mendapatkan URL lengkap foto bukti kerusakan
 */
export const getPhotoUrl = (path: string | null) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${STORAGE_URL}/${path}`;
};

// ==========================================
// 1. SERVICES CCTV MASTER DATA
// ==========================================

export async function getCCTVs() {
  try {
    const res = await fetch(`${API_BASE_URL}/cctvs`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `Gagal mengambil data CCTV (Status: ${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.error('API Error [getCCTVs]:', error);
    throw error;
  }
}

export async function createCCTV(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/cctvs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Gagal menambah unit CCTV');
    }
    return res.json();
  } catch (error) {
    console.error('API Error [createCCTV]:', error);
    throw error;
  }
}

export async function updateCCTV(id: number | string, data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/cctvs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Gagal memperbarui data CCTV');
    }
    return res.json();
  } catch (error) {
    console.error('API Error [updateCCTV]:', error);
    throw error;
  }
}

export async function deleteCCTV(id: number | string) {
  try {
    const res = await fetch(`${API_BASE_URL}/cctvs/${id}`, {
      method: 'DELETE',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Gagal menghapus unit CCTV');
    }
    return res.json();
  } catch (error) {
    console.error('API Error [deleteCCTV]:', error);
    throw error;
  }
}

// ==========================================
// 2. SERVICES MAINTENANCE TICKETS
// ==========================================

export async function getTickets() {
  try {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || `Gagal mengambil data tiket (Status: ${res.status})`);
    }
    return res.json();
  } catch (error) {
    console.error('API Error [getTickets]:', error);
    throw error;
  }
}

export async function createTicket(formData: FormData) {
  try {
    const res = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' }, // FormData otomatis set Content-Type multipart
      body: formData,
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Gagal mengirim laporan tiket');
    }
    return res.json();
  } catch (error) {
    console.error('API Error [createTicket]:', error);
    throw error;
  }
}

export async function updateTicket(
  id: number | string,
  data: { status?: string; action_taken?: string }
) {
  try {
    const res = await fetch(`${API_BASE_URL}/tickets/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(errorData?.message || 'Gagal memperbarui tiket');
    }
    return res.json();
  } catch (error) {
    console.error('API Error [updateTicket]:', error);
    throw error;
  }
}

// ==========================================
// 3. SERVICES USER MANAGEMENT
// ==========================================

export async function getUsers() {
  const res = await fetch(`${API_BASE_URL}/users`, {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal mengambil data user');
  return res.json();
}

export async function createUser(data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) {
      const message = result?.message || (result?.errors ? Object.values(result.errors).flat().join(', ') : 'Gagal menambah user baru');
      throw new Error(message);
    }
    return result;
  } catch (error) {
    console.error('API Error [createUser]:', error);
    throw error;
  }
}

export async function updateUser(id: number | string, data: any) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(data),
    });
    const result = await res.json().catch(() => null);
    if (!res.ok) {
      const message = result?.message || (result?.errors ? Object.values(result.errors).flat().join(', ') : 'Gagal memperbarui data user');
      throw new Error(message);
    }
    return result;
  } catch (error) {
    console.error('API Error [updateUser]:', error);
    throw error;
  }
}

export async function deleteUser(id: number | string) {
  const res = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' },
  });
  if (!res.ok) throw new Error('Gagal menghapus user');
  return res.json();
}

export async function loginApi(credentials: { username: string; password: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      throw new Error(result?.message || 'Gagal masuk ke sistem. Periksa kredensial Anda.');
    }

    return result;
  } catch (error) {
    console.error('API Error [loginApi]:', error);
    throw error;
  }
}
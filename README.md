
```markdown
# 📹 CCTV Management System - HOMM Saranam Baturiti

Sistem Manajemen, Pemantauan, dan Pelaporan Kerusakan CCTV berbasis Web untuk **HOMM Saranam Baturiti**. Proyek ini dirancang untuk memudahkan tim IT dan Security dalam mengelola infrastruktur pemantauan area properti secara efisien.

---

## 🚀 Fitur Utama

- **Role-Based Access Control (RBAC):**
  - **Admin (IT Department):** Akses ke dashboard analitik, pengelolaan data unit CCTV, manajemen pengguna, dan riwayat laporan perbaikan.
  - **Staff (Security / Operational):** Akses ke *Live Monitoring* status kamera dan Form Pelaporan Kerusakan / Maintenance.
- **Secure Authentication:**
  - Sesi login yang aman dan terproteksi secara otomatis demi menjaga kerahasiaan data internal hotel.
- **Dynamic Browser Titles:**
  - Judul tab browser dan deskripsi halaman berganti secara dinamis sesuai dengan modul yang sedang dibuka.
- **Responsive & Clean UI:**
  - Antarmuka modern dan responsif yang nyaman digunakan di perangkat desktop, tablet, maupun *mobile*.
- **Print-Friendly Layout:**
  - Layout yang dioptimalkan untuk mencetak laporan kerja atau tiket perbaikan tanpa menyertakan elemen navigasi menu.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js (App Router, TypeScript)
- **Styling:** Tailwind CSS, Shadcn UI
- **Icons:** Lucide React

### Backend
- **Framework:** Laravel REST API
- **Web Server:** Nginx (LEMP Stack)
- **Database:** MariaDB / MySQL

---

## ⚙️ Cara Instalasi & Menjalankan Proyek

### 1. Prasyarat System
- Node.js (v18.x atau versi terbaru)
- npm / pnpm / yarn
- Backend API Laravel yang sudah berjalan

### 2. Cloning Repositori
```bash
git clone [https://github.com/username/cctv-homm-saranam.git](https://github.com/username/cctv-homm-saranam.git)
cd cctv-homm-saranam

```

### 3. Instalasi Dependensi

```bash
npm install

```

### 4. Konfigurasi Environment Variable

Buat file `.env.local` di folder utama proyek dan sesuaikan URL API backend:

```env
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api-url/api

```

### 5. Menjalankan Server Development

```bash
npm run dev

```

Buka browser dan akses `http://localhost:3000`.

---

## 👥 Pengembang

* **IT Department - HOMM Saranam Baturiti**
* Designed & Developed by **I Made Suka Astawa**

---

© 2026 HOMM Saranam Baturiti • All Rights Reserved.

```

```
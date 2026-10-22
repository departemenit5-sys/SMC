// app/admin/dashboard/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { TicketStatus } from '@/types/cctv';
import { getCCTVs, getTickets, updateTicket, getPhotoUrl } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Wrench,
  CheckCircle,
  Image as ImageIcon,
  Video,
  Power,
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle2,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [cctvs, setCCTVs] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionNotes, setActionNotes] = useState<{ [key: string]: string }>({});

  // Fetch Data CCTV & Tiket dari Backend Laravel
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [cctvData, ticketData] = await Promise.all([getCCTVs(), getTickets()]);
      setCCTVs(cctvData);
      setTickets(ticketData);
    } catch (error) {
      console.error('Gagal mengambil data dari API Laravel:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Handler Update Status & Catatan Perbaikan Tiket ke Database Laravel
  const handleUpdateTicketStatus = async (ticketId: number | string, newStatus: TicketStatus) => {
    try {
      const actionText = actionNotes[ticketId];
      await updateTicket(Number(ticketId), {
        status: newStatus,
        ...(actionText ? { action_taken: actionText } : {}),
      });

      // Refresh data agar statistik dan UI ter-update dari database
      fetchDashboardData();
    } catch (error) {
      alert('Gagal memperbarui status tiket ke server.');
    }
  };

  // Perhitungan Ringkas Angka Indikator Utama dari Data API
  const totalKeseluruhan = cctvs.length;
  const totalHidup = cctvs.filter((c) => c.status === 'normal').length;
  const totalMati = cctvs.filter((c) => c.status !== 'normal').length;
  const butuhPenanganan = tickets.filter((t) => t.status === 'pending').length;
  const progresPerbaikan = tickets.filter((t) => t.status === 'in_progress').length;
  const totalSelesaiDiperbaiki = tickets.filter((t) => t.status === 'resolved').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Monitoring CCTV</h1>
        <p className="text-slate-500 text-xs mt-1">
          Pemantauan real-time kondisi unit CCTV dan progres penanganan perbaikan.
        </p>
      </div>

      {/* CARD STATISTIK RINGKAS INDIKATOR UTAMA (6 COLUMN GRID) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Keseluruhan */}
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-1 pt-4 px-3">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Total Unit</span>
              <Video className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="text-2xl font-bold text-slate-900">{totalKeseluruhan}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Semua Titik CCTV</p>
          </CardContent>
        </Card>

        {/* Kondisi Hidup */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-green-500">
          <CardHeader className="pb-1 pt-4 px-3">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Kondisi Hidup</span>
              <Power className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="text-2xl font-bold text-green-600">{totalHidup}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Normal / Operasional</p>
          </CardContent>
        </Card>

        {/* Kondisi Mati */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-red-500">
          <CardHeader className="pb-1 pt-4 px-3">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Kondisi Mati</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="text-2xl font-bold text-red-600">{totalMati}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Rusak / Offline</p>
          </CardContent>
        </Card>

        {/* Butuh Penanganan */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-amber-500">
          <CardHeader className="pb-1 pt-4 px-3">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Penanganan</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="text-2xl font-bold text-amber-600">{butuhPenanganan}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Laporan Baru (Pending)</p>
          </CardContent>
        </Card>

        {/* Progres Perbaikan */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-purple-500">
          <CardHeader className="pb-1 pt-4 px-3">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Progres</span>
              <Activity className="w-4 h-4 text-purple-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="text-2xl font-bold text-purple-600">{progresPerbaikan}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Dalam Perbaikan IT</p>
          </CardContent>
        </Card>

        {/* Total Perbaikan Selesai */}
        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-blue-500">
          <CardHeader className="pb-1 pt-4 px-3">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Total Perbaikan</span>
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-4">
            <div className="text-2xl font-bold text-blue-600">{totalSelesaiDiperbaiki}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Selesai Ditangani</p>
          </CardContent>
        </Card>
      </div>

      {/* DAFTAR TIKET PELAPORAN MASUK */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Wrench className="w-5 h-5 text-purple-600" />
            Daftar Tiket Pelaporan Masuk & Update Progres
          </CardTitle>
          <CardDescription className="text-xs">
            Kelola tiket kerusakan dari staff dan perbarui catatan perbaikan teknis.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center p-8 gap-2 text-slate-500 text-xs font-medium">
                <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                <span>Memuat data dashboard dari Laravel...</span>
              </div>
            ) : tickets.length === 0 ? (
              <p className="text-sm text-slate-500 italic">Belum ada laporan kerusakan masuk.</p>
            ) : (
              tickets.map((t) => {
                const photoSrc = t.photo_path
                  ? getPhotoUrl(t.photo_path)
                  : t.photoUrl;

                return (
                  <div
                    key={t.id}
                    className="p-4 border rounded-lg bg-white space-y-3 shadow-sm hover:border-slate-300 transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 border-b pb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{t.cctv?.code || t.cctvCode}</span>
                          <span className="text-sm text-slate-500">({t.cctv?.location || t.location})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          Dilaporkan oleh:{' '}
                          <span className="font-medium text-slate-700">
                            {t.reporter_name || t.reporterName}
                          </span>{' '}
                          pada {t.reported_at || t.reportedAt}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-xs font-bold text-slate-600">Status Progres:</Label>
                        <select
                          className="p-1.5 border rounded-md text-xs bg-slate-50 font-semibold cursor-pointer focus:bg-white"
                          value={t.status}
                          onChange={(e) =>
                            handleUpdateTicketStatus(t.id, e.target.value as TicketStatus)
                          }
                        >
                          <option value="pending">PENDING (Butuh Penanganan)</option>
                          <option value="in_progress">IN PROGRESS (Progres Perbaikan)</option>
                          <option value="resolved">RESOLVED (Selesai)</option>
                        </select>
                      </div>
                    </div>

                    <div className="text-xs text-slate-700">
                      <p className="font-semibold text-red-600">{t.issue_type || t.issueType}</p>
                      <p className="mt-1 bg-slate-50 p-2 rounded border text-slate-600 font-mono">
                        "{t.description}"
                      </p>
                    </div>

                    {photoSrc && (
                      <a
                        href={photoSrc}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 flex items-center gap-1 hover:underline font-medium"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Lihat Lampiran Foto Bukti</span>
                        <ExternalLink className="w-3 h-3 ml-0.5" />
                      </a>
                    )}

                    <div className="pt-1 space-y-1">
                      <Label className="text-xs font-medium text-slate-600">
                        Catatan Perbaikan / Komponen yang Diperlukan:
                      </Label>
                      <Input
                        placeholder="misal: Ganti adaptor 12V / Krimping RJ45..."
                        className="text-xs h-8"
                        value={actionNotes[t.id] ?? (t.action_taken || t.actionTaken || '')}
                        onChange={(e) => setActionNotes({ ...actionNotes, [t.id]: e.target.value })}
                        onBlur={() => {
                          if (actionNotes[t.id] !== undefined) {
                            handleUpdateTicketStatus(t.id, t.status);
                          }
                        }}
                      />
                    </div>

                    {t.status === 'resolved' && (
                      <div className="text-xs text-green-700 bg-green-50 p-2 rounded flex items-center gap-1 font-medium">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Selesai diperbaiki</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
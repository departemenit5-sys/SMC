'use client';

import { useState, useEffect } from 'react';
import { CCTVStatus } from '@/types/cctv';
import { getCCTVs, createCCTV, updateCCTV, deleteCCTV } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Plus,
  Edit2,
  Trash2,
  Database,
  Search,
  X,
  FileSpreadsheet,
  Printer,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  RefreshCw,
  Layers,
  Loader2,
  Building,
  MapPin,
} from 'lucide-react';

interface AlertNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

// Konfigurasi Area/Gedung Utama & Prefix Kode CCTV
const AREA_CONFIG: { [key: string]: { prefix: string; floors: string[] } } = {
  'Main Building': { prefix: 'CAM-MB', floors: ['GF', 'LT1', 'LT2', 'LT3'] },
  'HWA': { prefix: 'CAM-HWA', floors: ['GF', 'LT2'] },
  'HWB': { prefix: 'CAM-HWB', floors: ['GF', 'LT2', 'LT3', 'Rooftop'] },
  'Caffe Toya': { prefix: 'CAM-CT', floors: ['GF'] },
  'Villa': { prefix: 'CAM-VIL', floors: ['GF', 'LT2'] },
  'Kitchen Samiya': { prefix: 'CAM-KS', floors: ['GF'] },
  'Outdoor': { prefix: 'CAM-OUT', floors: ['GF'] },
};

export default function MasterCCTVPage() {
  const [cctvs, setCCTVs] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [adminName, setAdminName] = useState('Admin IT');
  const [currentDate, setCurrentDate] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAreaFilter, setSelectedAreaFilter] = useState('ALL');

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState<string | number | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string | number; code: string } | null>(null);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const [topAlert, setTopAlert] = useState<AlertNotification | null>(null);

  // Form State
  const [code, setCode] = useState('');
  const [area, setArea] = useState('Main Building');
  const [location, setLocation] = useState('');
  const [floor, setFloor] = useState('GF');
  const [cameraType, setCameraType] = useState('Dome 4MP');
  const [ipAddress, setIpAddress] = useState('');
  const [status, setStatus] = useState<CCTVStatus>('normal');
  const [damageNotes, setDamageNotes] = useState('');
  const [followUpPlan, setFollowUpPlan] = useState('');

  const triggerTopAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setTopAlert({ type, message });
    setTimeout(() => {
      setTopAlert(null);
    }, 4000);
  };

  // Fetch Data Master CCTV dari Backend Laravel
  const loadMasterData = async () => {
    try {
      setLoading(true);
      const data = await getCCTVs();
      setCCTVs(data);
    } catch {
      triggerTopAlert('error', 'Gagal memuat data CCTV dari server Laravel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setAdminName(savedName);

    loadMasterData();

    const today = new Date();
    const formattedDate = today.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setCurrentDate(formattedDate);
  }, []);

  // Helper Auto Generate Kode CCTV Berdasarkan Area
  const generateCodeForArea = (selectedArea: string, currentList: any[] = cctvs) => {
    if (!selectedArea) return 'CAM-01';
    const config = AREA_CONFIG[selectedArea] || { prefix: 'CAM-LOC' };
    const prefix = config.prefix;
    const matchingCount = currentList.filter((item) => item.code && item.code.startsWith(prefix)).length;
    return `${prefix}-${String(matchingCount + 1).padStart(2, '0')}`;
  };

  const handleSelectArea = (selectedArea: string) => {
    setArea(selectedArea);
    const availableFloors = AREA_CONFIG[selectedArea]?.floors || ['GF'];
    setFloor(availableFloors[0]);

    if (!isEditing) {
      setCode(generateCodeForArea(selectedArea));
    }
  };

  // Filter Data berdasarkan Search Query & Filter Tab Area
  const filteredCCTVs = cctvs.filter((item) => {
    const query = searchQuery.toLowerCase().trim();
    const itemArea = item.area || 'Main Building';
    const camera_type = item.camera_type || item.cameraType || '';
    const ip_address = item.ip_address || item.ipAddress || '';
    const damage_notes = item.damage_notes || item.damageNotes || '';
    const follow_up_plan = item.follow_up_plan || item.followUpPlan || '';

    const matchesSearch =
      item.code.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      itemArea.toLowerCase().includes(query) ||
      (item.floor && item.floor.toLowerCase().includes(query)) ||
      camera_type.toLowerCase().includes(query) ||
      ip_address.toLowerCase().includes(query) ||
      damage_notes.toLowerCase().includes(query) ||
      follow_up_plan.toLowerCase().includes(query);

    const matchesAreaTab = selectedAreaFilter === 'ALL' || itemArea === selectedAreaFilter;

    return matchesSearch && matchesAreaTab;
  });

  const handleExportExcel = () => {
    try {
      const headers = [
        'Kode CCTV',
        'Area / Gedung',
        'Spesifik Lokasi',
        'Lantai / Level',
        'Tipe Kamera',
        'IP Address',
        'Status',
        'Keterangan Rusak',
        'Rencana Tindak Lanjut',
        'Terakhir Diperiksa',
      ];
      const rows = filteredCCTVs.map((item) => [
        `"${item.code}"`,
        `"${item.area || 'Main Building'}"`,
        `"${item.location}"`,
        `"${item.floor || 'GF'}"`,
        `"${item.camera_type || item.cameraType}"`,
        `"${item.ip_address || item.ipAddress}"`,
        `"${item.status.toUpperCase()}"`,
        `"${item.damage_notes || item.damageNotes || '-'}"`,
        `"${item.follow_up_plan || item.followUpPlan || '-'}"`,
        `"${item.last_checked || item.lastChecked || '-'}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Master_Data_CCTV_Homm_Saranam_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerTopAlert('success', 'Laporan Excel (.CSV) berhasil diunduh ke perangkat Anda.');
    } catch {
      triggerTopAlert('error', 'Gagal mengunduh laporan Excel.');
    }
  };

  const handleExportPDF = () => {
    triggerTopAlert('info', 'Mempersiapkan dokumen cetak HOMM Saranam Baturiti...');
    window.print();
  };

  const resetForm = () => {
    setIsEditing(null);
    setArea('Main Building');
    setLocation('');
    setFloor('GF');
    setCode('');
    setCameraType('Dome 4MP');
    setIpAddress('');
    setStatus('normal');
    setDamageNotes('');
    setFollowUpPlan('');
  };

  const handleOpenAddModal = () => {
    resetForm();
    setCode(generateCodeForArea('Main Building'));
    setIsDialogOpen(true);
  };

  const handleOpenEditModal = (cctv: any) => {
    setIsEditing(cctv.id);
    setCode(cctv.code);
    setArea(cctv.area || 'Main Building');
    setLocation(cctv.location);
    setFloor(cctv.floor || 'GF');
    setCameraType(cctv.camera_type || cctv.cameraType || '');
    setIpAddress(cctv.ip_address || cctv.ipAddress || '');
    setStatus(cctv.status);
    setDamageNotes(cctv.damage_notes || cctv.damageNotes || '');
    setFollowUpPlan(cctv.follow_up_plan || cctv.followUpPlan || '');
    setIsDialogOpen(true);
  };

  // Simpan/Update Data ke Database Laravel via API
  const handleSaveCCTV = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!location.trim()) {
      triggerTopAlert('error', 'Spesifik lokasi unit CCTV wajib diisi!');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        code: code || generateCodeForArea(area),
        area,
        location,
        floor,
        camera_type: cameraType,
        ip_address: ipAddress,
        status,
        damage_notes: damageNotes,
        follow_up_plan: followUpPlan,
      };

      if (isEditing) {
        await updateCCTV(Number(isEditing), payload);
        triggerTopAlert('success', `Berhasil! Data unit CCTV ${code} telah diperbarui.`);
      } else {
        await createCCTV(payload);
        triggerTopAlert('success', `Berhasil! Unit CCTV ${payload.code} baru tersimpan.`);
      }

      await loadMasterData();
      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      triggerTopAlert('error', error.message || 'Gagal menyimpan data CCTV ke server Laravel.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Hapus Data CCTV dari Database Laravel via API
  const confirmDelete = async () => {
    if (deleteTarget) {
      try {
        await deleteCCTV(Number(deleteTarget.id));
        triggerTopAlert('success', `Unit CCTV ${deleteTarget.code} berhasil dihapus!`);
        await loadMasterData();
      } catch {
        triggerTopAlert('error', `Gagal menghapus unit CCTV ${deleteTarget.code} dari server.`);
      } finally {
        setDeleteTarget(null);
      }
    }
  };

  const confirmResetData = async () => {
    try {
      await loadMasterData();
      triggerTopAlert('info', 'Data Master CCTV telah disinkronkan.');
    } catch {
      triggerTopAlert('error', 'Gagal menyinkronkan data.');
    } finally {
      setIsResetDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 relative max-w-full overflow-hidden">
      {topAlert && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4 print:hidden">
          <div
            className={`p-3 sm:p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold ${
              topAlert.type === 'success'
                ? 'bg-green-600 border-green-700 text-white shadow-green-200'
                : topAlert.type === 'error'
                ? 'bg-red-600 border-red-700 text-white shadow-red-200'
                : 'bg-blue-600 border-blue-700 text-white shadow-blue-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {topAlert.type === 'success' && <CheckCircle2 className="w-4 h-4 text-white shrink-0" />}
              {topAlert.type === 'error' && <AlertTriangle className="w-4 h-4 text-white shrink-0" />}
              {topAlert.type === 'info' && <Info className="w-4 h-4 text-white shrink-0" />}
              <span>{topAlert.message}</span>
            </div>

            <button onClick={() => setTopAlert(null)} className="text-white/80 hover:text-white p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Header Utama Layar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Master Data Unit CCTV</h1>
          <p className="text-slate-500 text-xs mt-1">
            HOMM Saranam Baturiti — Kelola inventaris unit CCTV berdasarkan area, lokasi spesifik, tipe, dan IP address.
          </p>
        </div>

        {/* Action Button Group Mobile / Desktop Responsive */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full xl:w-auto shrink-0">
          <Button
            onClick={() => setIsResetDialogOpen(true)}
            variant="outline"
            className="h-9 text-xs font-medium text-slate-700 border-slate-300 hover:bg-slate-100 hover:text-slate-900 gap-1.5 shadow-2xs justify-center"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-600" />
            <span>Sync</span>
          </Button>

          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="h-9 text-xs font-medium border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1.5 shadow-2xs justify-center"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Export Excel</span>
          </Button>

          <Button
            onClick={handleExportPDF}
            variant="outline"
            className="h-9 text-xs font-medium border-purple-600 text-purple-700 hover:bg-purple-50 gap-1.5 shadow-2xs justify-center"
          >
            <Printer className="w-3.5 h-3.5 text-purple-600" />
            <span>Cetak / PDF</span>
          </Button>

          <Button
            onClick={handleOpenAddModal}
            className="h-9 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white gap-1.5 shadow-2xs justify-center col-span-2 sm:col-span-1"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Unit CCTV</span>
          </Button>
        </div>
      </div>

      {/* KOP LAPORAN CETAK MASTER DATA RESMI */}
      <div className="hidden print:block mb-6 border-b-2 border-black pb-4 text-black">
        <div className="flex items-center justify-between border-b border-black pb-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              <img src="/logo.png" alt="Homm Saranam Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold uppercase tracking-widest">HOMM SARANAM BATURITI</h2>
              <p className="text-[10px] uppercase font-semibold text-gray-700">A Banyan Group Escape • Tabanan, Bali</p>
            </div>
          </div>
          <div className="text-right text-[10px]">
            <p className="font-bold">IT DEPARTMENT & SECURITY MAINTENANCE</p>
            <p>Jl. Raya Baturiti, Baturiti, Tabanan, Bali 82191</p>
          </div>
        </div>

        <div className="text-center my-2">
          <h3 className="text-sm font-bold uppercase tracking-wide">LAPORAN MASTER DATA INVENTARIS PERANGKAT CCTV</h3>
        </div>

        <div className="mt-3 pt-2 border-t border-black text-xs grid grid-cols-2 gap-y-1">
          <div>
            <span className="font-semibold">Dicetak Oleh:</span> {adminName} (Administrator IT)
          </div>
          <div className="text-right">
            <span className="font-semibold">Tanggal Report:</span> {currentDate} WITA
          </div>
          <div>
            <span className="font-semibold">Total Perangkat:</span> {filteredCCTVs.length} Unit CCTV
          </div>
          <div className="text-right">
            <span className="font-semibold">Status Dokumen:</span> RESMI / AUDIT IT HOMM SARANAM
          </div>
        </div>
      </div>

      {/* FILTER AREA BADGES - Horizontal Scroll Smooth */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-200 print:hidden w-full">
        {['ALL', 'Main Building', 'HWA', 'HWB', 'Caffe Toya', 'Villa', 'Kitchen Samiya', 'Outdoor'].map((areaName) => (
          <Button
            key={areaName}
            variant={selectedAreaFilter === areaName ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedAreaFilter(areaName)}
            className={`text-xs shrink-0 rounded-lg h-8 px-3 ${
              selectedAreaFilter === areaName ? 'bg-purple-600 text-white' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {areaName === 'ALL' ? 'Semua Area' : areaName}
          </Button>
        ))}
      </div>

      {/* CARD KONTEN UTAMA TABEL */}
      <Card className="bg-white shadow-sm border-slate-200 overflow-hidden print:shadow-none print:border-none print:rounded-none print:bg-transparent">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 p-4 sm:p-6 print:hidden">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2 font-bold">
            <Database className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 shrink-0" />
            <span>Inventaris Perangkat CCTV ({filteredCCTVs.length} Dari {cctvs.length} Unit)</span>
          </CardTitle>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Cari kode, area, lokasi, IP..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-9 pr-8 text-xs bg-slate-50 border-slate-200 focus:bg-white transition h-9"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200">
            <table className="w-full min-w-212.5 text-xs text-left border-collapse border-b border-slate-200 print:border-black">
              <thead>
                <tr className="bg-slate-100 text-slate-800 print:bg-gray-200 print:text-black border-b border-slate-200 print:border-black font-bold uppercase text-[11px] print:text-[10px]">
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-center w-10">No</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-27.5">Kode CCTV</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-30">Area Utama</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-40">Lokasi & Lantai</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-27.5">Tipe Kamera</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-30">IP Address</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-center min-w-25">Status</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-35">Detail Kendala</th>
                  <th className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black min-w-35">Tindak Lanjut</th>
                  <th className="p-2.5 sm:p-3 text-center print:hidden w-20">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={10} className="p-8 text-center text-slate-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span>Memuat data dari database...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredCCTVs.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="p-6 text-center text-slate-500 italic">
                      Tidak ada data unit CCTV yang sesuai dengan pencarian "{searchQuery}".
                    </td>
                  </tr>
                ) : (
                  filteredCCTVs.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition border-b border-slate-200 print:border-black text-slate-800 print:text-black">
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-center font-medium">{index + 1}</td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black font-bold text-slate-900 print:text-black">{item.code}</td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black">
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-semibold text-[10px] whitespace-nowrap">
                          <Building className="w-3 h-3 mr-1 shrink-0" />
                          {item.area || 'Main Building'}
                        </Badge>
                      </td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black">
                        <div className="font-bold text-slate-800 print:text-black flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 print:hidden" />
                          <span>{item.location}</span>
                        </div>
                        <div className="text-[11px] text-purple-700 print:text-gray-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3 text-purple-600 print:hidden shrink-0" />
                          <span>Lantai: {item.floor || 'GF'}</span>
                        </div>
                      </td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-slate-700 print:text-black font-medium">{item.camera_type || item.cameraType}</td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black font-mono text-slate-700 print:text-black whitespace-nowrap">{item.ip_address || item.ipAddress || '-'}</td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-center">
                        <Badge
                          className={`text-[10px] uppercase font-bold whitespace-nowrap ${
                            item.status === 'normal'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100 print:bg-transparent print:text-black print:p-0'
                              : item.status === 'broken'
                              ? 'bg-red-100 text-red-700 hover:bg-red-100 print:bg-transparent print:text-black print:p-0'
                              : item.status === 'maintenance'
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-100 print:bg-transparent print:text-black print:p-0'
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-100 print:bg-transparent print:text-black print:p-0'
                          }`}
                        >
                          {item.status === 'normal'
                            ? 'NORMAL'
                            : item.status === 'broken'
                            ? 'RUSAK'
                            : item.status === 'maintenance'
                            ? 'MAINTENANCE'
                            : 'OFFLINE'}
                        </Badge>
                      </td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-slate-700 print:text-black">{item.damage_notes || item.damageNotes || '-'}</td>
                      <td className="p-2.5 sm:p-3 border-r border-slate-200 print:border-black text-slate-700 print:text-black">{item.follow_up_plan || item.followUpPlan || '-'}</td>
                      <td className="p-2.5 sm:p-3 text-center print:hidden">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-slate-200 rounded-md"
                            onClick={() => handleOpenEditModal(item)}
                          >
                            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 hover:bg-slate-200 rounded-md"
                            onClick={() => setDeleteTarget({ id: item.id, code: item.code })}
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-600" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="hidden print:grid grid-cols-2 gap-8 mt-12 text-xs text-black">
            <div className="text-center space-y-14">
              <p>Dilaporkan Oleh,</p>
              <p className="font-bold underline uppercase">( {adminName} )</p>
              <p className="text-[10px] -mt-12 text-gray-600">Admin IT HOMM Saranam Baturiti</p>
            </div>
            <div className="text-center space-y-14">
              <p>Disetujui Oleh,</p>
              <p className="font-bold underline uppercase">( ............................................ )</p>
              <p className="text-[10px] -mt-12 text-gray-600">Head of IT Department</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MODAL DIALOG KONFIRMASI HAPUS */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-white rounded-xl max-w-sm sm:max-w-md p-5 sm:p-6 w-[92vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <span>Konfirmasi Hapus Unit</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menghapus unit <strong className="text-slate-900">{deleteTarget?.code}</strong> dari inventaris HOMM Saranam Baturiti?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row gap-2 justify-end">
            <AlertDialogCancel className="text-xs h-9 m-0 w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white text-xs h-9 w-full sm:w-auto"
            >
              Ya, Hapus Unit
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL DIALOG KONFIRMASI SYNC */}
      <AlertDialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
        <AlertDialogContent className="bg-white rounded-xl max-w-sm sm:max-w-md p-5 sm:p-6 w-[92vw]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-purple-600 shrink-0" />
              <span>Sinkronkan Ulang Data Master</span>
            </AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600 mt-2">
              Apakah Anda yakin ingin menyinkronkan ulang seluruh data Master CCTV dengan database Laravel?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-4 flex flex-row gap-2 justify-end">
            <AlertDialogCancel className="text-xs h-9 m-0 w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmResetData}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xs h-9 w-full sm:w-auto"
            >
              Ya, Sinkronkan
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* MODAL POP-UP FORM DIALOG INPUT LENGKAP */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-lg bg-white p-5 sm:p-6 rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto w-[94vw]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-bold text-slate-900">
              {isEditing ? 'Edit Data CCTV' : 'Tambah Unit CCTV Baru'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Isi rincian inventaris HOMM Saranam Baturiti, area gedung, lokasi spesifik, lantai, tipe kamera, dan status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCCTV} className="space-y-3 sm:space-y-3.5 py-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Pilih Area / Gedung Utama</Label>
                <select
                  className="w-full p-2 border border-slate-300 rounded-md text-xs mt-1 bg-white font-bold text-purple-700 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  value={area}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleSelectArea(e.target.value)}
                  required
                >
                  {Object.keys(AREA_CONFIG).map((areaKey) => (
                    <option key={areaKey} value={areaKey}>
                      {areaKey} ({AREA_CONFIG[areaKey].prefix})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold flex items-center justify-between">
                  <span>Kode CCTV (Auto)</span>
                  {!isEditing && area && (
                    <button
                      type="button"
                      onClick={() => setCode(generateCodeForArea(area))}
                      className="text-[10px] text-purple-600 hover:underline flex items-center gap-0.5"
                    >
                      <Sparkles className="w-3 h-3" /> Auto
                    </button>
                  )}
                </Label>
                <Input
                  placeholder="misal: CAM-MB-01"
                  className="text-xs mt-1 font-bold text-purple-700 bg-purple-50/50 h-9"
                  value={code}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Spesifik Lokasi Area (Manual)</Label>
                <Input
                  placeholder="misal: Front Office / Lobby Bar"
                  className="text-xs mt-1 h-9"
                  value={location}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">Pilih Lantai / Level</Label>
                <select
                  className="w-full p-2 border border-slate-300 rounded-md text-xs mt-1 bg-white font-medium h-9 focus:outline-none focus:ring-1 focus:ring-purple-600"
                  value={floor}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFloor(e.target.value)}
                  required
                >
                  {(AREA_CONFIG[area]?.floors || ['GF']).map((fl) => (
                    <option key={fl} value={fl}>
                      Lantai: {fl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Tipe Kamera</Label>
                <Input
                  placeholder="misal: Dome 4MP / PTZ 360 / Bullet"
                  className="text-xs mt-1 h-9"
                  value={cameraType}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCameraType(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label className="text-xs font-semibold">IP Address Perangkat</Label>
                <Input
                  placeholder="misal: 192.168.10.25"
                  className="text-xs mt-1 font-mono h-9"
                  value={ipAddress}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setIpAddress(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <Label className="text-xs font-semibold">Status Keadaan</Label>
              <select
                className="w-full p-2 border border-slate-300 rounded-md text-xs mt-1 bg-white font-medium h-9 focus:outline-none focus:ring-1 focus:ring-purple-600"
                value={status}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as CCTVStatus)}
              >
                <option value="normal">Normal / Hidup</option>
                <option value="broken">Broken / Rusak</option>
                <option value="maintenance">In Maintenance</option>
                <option value="offline">Offline / Mati</option>
              </select>
            </div>

            <div>
              <Label className="text-xs font-semibold">Keterangan yang Rusak / Detail Kendala</Label>
              <Textarea
                placeholder="misal: Gambar no-signal, adaptor 12V mati total..."
                className="text-xs mt-1 h-16 min-h-15"
                value={damageNotes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDamageNotes(e.target.value)}
              />
            </div>

            <div>
              <Label className="text-xs font-semibold">Rencana Tindak Lanjut</Label>
              <Input
                placeholder="misal: Penggantian power supply & krimping ulang connector"
                className="text-xs mt-1 h-9"
                value={followUpPlan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFollowUpPlan(e.target.value)}
              />
            </div>

            <DialogFooter className="pt-3 flex flex-row gap-2 justify-end">
              <Button type="button" variant="outline" size="sm" className="h-9 text-xs" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-9 text-xs bg-purple-600 hover:bg-purple-700 text-white font-semibold"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Menyimpan...</span>
                  </div>
                ) : isEditing ? (
                  'Simpan Perubahan'
                ) : (
                  'Tambah Unit'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
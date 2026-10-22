// app/admin/reports/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getTickets } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import {
  Printer,
  FileSpreadsheet,
  FileCheck,
  Search,
  Layers,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar,
  Filter,
  Loader2,
} from 'lucide-react';

interface AlertNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

const MONTH_OPTIONS = [
  { value: 'all', label: 'Semua Bulan (Januari - Desember)' },
  { value: '01', label: 'Januari' },
  { value: '02', label: 'Februari' },
  { value: '03', label: 'Maret' },
  { value: '04', label: 'April' },
  { value: '05', label: 'Mei' },
  { value: '06', label: 'Juni' },
  { value: '07', label: 'Juli' },
  { value: '08', label: 'Agustus' },
  { value: '09', label: 'September' },
  { value: '10', label: 'Oktober' },
  { value: '11', label: 'November' },
  { value: '12', label: 'Desember' },
];

export default function MaintenanceReportsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filter Halaman Utama
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [filterYear, setFilterYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal Dialog Cetak State
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState<boolean>(false);
  const [printMonth, setPrintMonth] = useState<string>('all');
  const [printYear, setPrintYear] = useState<string>('all');

  const [adminName, setAdminName] = useState('Admin IT');
  const [currentDate, setCurrentDate] = useState('');
  const [topAlert, setTopAlert] = useState<AlertNotification | null>(null);

  const triggerTopAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setTopAlert({ type, message });
    setTimeout(() => {
      setTopAlert(null);
    }, 4000);
  };

  // Fetch Tiket dari Laravel Backend
  const fetchTicketsData = async () => {
    try {
      setLoading(true);
      const data = await getTickets();
      setTickets(data);
    } catch (error) {
      triggerTopAlert('error', 'Gagal memuat data laporan dari server Laravel.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setAdminName(savedName);

    fetchTicketsData();

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

  // Ekstrak pilihan tahun unik dari data tiket
  const availableYears = Array.from(
    new Set(
      tickets.map((t) => {
        const dateStr = t.reported_at || t.reportedAt;
        const year = dateStr?.split('-')[0];
        return year || new Date().getFullYear().toString();
      })
    )
  ).sort((a, b) => Number(b) - Number(a));

  // Filter Tiket untuk Tampilan Halaman
  const filteredTickets = tickets.filter((t) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

    const reportedAt = t.reported_at || t.reportedAt || '';
    const dateParts = reportedAt ? reportedAt.split('-') : [];
    const tYear = dateParts[0] || '';
    const tMonth = dateParts[1] || '';

    const matchesMonth = filterMonth === 'all' || tMonth === filterMonth;
    const matchesYear = filterYear === 'all' || tYear === filterYear;

    const cctvCode = t.cctv?.code || t.cctvCode || '';
    const location = t.cctv?.location || t.location || '';
    const floor = t.cctv?.floor || t.floor || '';
    const reporterName = t.reporter_name || t.reporterName || '';
    const issueType = t.issue_type || t.issueType || '';
    const actionTaken = t.action_taken || t.actionTaken || '';
    const description = t.description || '';

    const matchesQuery =
      cctvCode.toLowerCase().includes(query) ||
      location.toLowerCase().includes(query) ||
      floor.toLowerCase().includes(query) ||
      reporterName.toLowerCase().includes(query) ||
      issueType.toLowerCase().includes(query) ||
      actionTaken.toLowerCase().includes(query) ||
      description.toLowerCase().includes(query);

    return matchesStatus && matchesMonth && matchesYear && matchesQuery;
  });

  // Data Tiket Khusus yang disaring saat Cetak
  const printTickets = tickets.filter((t) => {
    const reportedAt = t.reported_at || t.reportedAt || '';
    const dateParts = reportedAt ? reportedAt.split('-') : [];
    const tYear = dateParts[0] || '';
    const tMonth = dateParts[1] || '';

    const matchesMonth = printMonth === 'all' || tMonth === printMonth;
    const matchesYear = printYear === 'all' || tYear === printYear;

    return matchesMonth && matchesYear;
  });

  const handleExportExcel = () => {
    try {
      const headers = [
        'ID Tiket',
        'Kode CCTV',
        'Lokasi Area',
        'Lantai',
        'Jenis Kendala',
        'Pelapor',
        'Tanggal Lapor',
        'Tindakan IT / Perbaikan',
        'Status Tiket',
      ];
      const rows = filteredTickets.map((t) => [
        `"${t.id}"`,
        `"${t.cctv?.code || t.cctvCode}"`,
        `"${t.cctv?.location || t.location}"`,
        `"${t.cctv?.floor || t.floor || 'GF'}"`,
        `"${t.issue_type || t.issueType}"`,
        `"${t.reporter_name || t.reporterName}"`,
        `"${t.reported_at || t.reportedAt}"`,
        `"${t.action_taken || t.actionTaken || '-'}"`,
        `"${t.status.toUpperCase()}"`,
      ]);

      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `Laporan_Maintenance_HOMM_Saranam_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      triggerTopAlert('success', 'Laporan Excel (.CSV) berhasil diunduh ke perangkat Anda.');
    } catch {
      triggerTopAlert('error', 'Gagal mengunduh laporan Excel.');
    }
  };

  const handleOpenPrintModal = () => {
    setPrintMonth(filterMonth);
    setPrintYear(filterYear);
    setIsPrintDialogOpen(true);
  };

  const handleExecutePrint = () => {
    setIsPrintDialogOpen(false);
    const selectedMonthLabel = MONTH_OPTIONS.find((m) => m.value === printMonth)?.label || 'Semua Bulan';
    const selectedYearLabel = printYear === 'all' ? 'Semua Tahun' : `Tahun ${printYear}`;

    triggerTopAlert(
      'info',
      `Mempersiapkan Dokumen Cetak Periode ${selectedMonthLabel} ${selectedYearLabel}...`
    );

    setTimeout(() => {
      window.print();
    }, 200);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setFilterStatus('all');
    setFilterMonth('all');
    setFilterYear('all');
  };

  const getPrintPeriodText = () => {
    const monthObj = MONTH_OPTIONS.find((m) => m.value === printMonth);
    const monthText = monthObj && monthObj.value !== 'all' ? monthObj.label : 'Semua Bulan';
    const yearText = printYear !== 'all' ? printYear : 'Semua Tahun';
    return `${monthText.toUpperCase()} ${yearText}`;
  };

  return (
    <div className="space-y-6 relative">
      {/* BANNER NOTIFIKASI MELAYANG */}
      {topAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4 print:hidden">
          <div
            className={`p-3.5 rounded-xl border shadow-xl flex items-center justify-between gap-3 text-xs font-semibold ${
              topAlert.type === 'success'
                ? 'bg-green-600 border-green-700 text-white shadow-green-200'
                : topAlert.type === 'error'
                ? 'bg-red-600 border-red-700 text-white shadow-red-200'
                : 'bg-blue-600 border-blue-700 text-white shadow-blue-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {topAlert.type === 'success' && <CheckCircle2 className="w-5 h-5 text-white shrink-0" />}
              {topAlert.type === 'error' && <AlertTriangle className="w-5 h-5 text-white shrink-0" />}
              {topAlert.type === 'info' && <Info className="w-5 h-5 text-white shrink-0" />}
              <span>{topAlert.message}</span>
            </div>

            <button onClick={() => setTopAlert(null)} className="text-white/80 hover:text-white p-1 rounded-md">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* HEADER HALAMAN & TOMBOL AKSI CETAK */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Maintenance & Perbaikan CCTV</h1>
          <p className="text-slate-500 text-xs mt-1">
            HOMM Saranam Baturiti — Rekapitulasi riwayat kerusakan, lokasi & lantai, penanganan teknis IT, dan status operasional.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <Button
            onClick={handleExportExcel}
            variant="outline"
            className="h-9 px-3.5 text-xs font-medium border-emerald-600 text-emerald-700 hover:bg-emerald-50 gap-1.5 shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Excel</span>
          </Button>

          <Button
            onClick={handleOpenPrintModal}
            className="h-9 px-4 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Laporan (PDF)</span>
          </Button>
        </div>
      </div>

      {/* PANEL FILTER LAYAR */}
      <Card className="bg-white shadow-sm border-slate-200 print:hidden">
        <CardContent className="pt-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                placeholder="Cari kode, lokasi, tindakan..."
                className="pl-9 pr-8 text-xs bg-slate-50 border-slate-200 focus:bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                className="w-full p-2 border border-slate-300 rounded-md text-xs bg-slate-50 font-medium focus:bg-white"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Semua Status Tiket</option>
                <option value="pending">Pending (Menunggu)</option>
                <option value="in_progress">Progres Perbaikan</option>
                <option value="resolved">Selesai (Resolved)</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                className="w-full p-2 border border-slate-300 rounded-md text-xs bg-slate-50 font-medium focus:bg-white"
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                className="w-full p-2 border border-slate-300 rounded-md text-xs bg-slate-50 font-medium focus:bg-white"
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
              >
                <option value="all">Semua Tahun</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(searchQuery || filterStatus !== 'all' || filterMonth !== 'all' || filterYear !== 'all') && (
            <div className="flex justify-end pt-1">
              <button
                onClick={resetFilters}
                className="text-[11px] text-purple-600 font-semibold hover:underline flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Reset Semua Filter
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* KOP CETAK PDF RESMI */}
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
          <h3 className="text-sm font-bold uppercase tracking-wide">LAPORAN REKAPITULASI TIKET PERBAIKAN & MAINTENANCE CCTV</h3>
          <p className="text-xs font-bold text-gray-800 uppercase mt-1">PERIODE: {getPrintPeriodText()}</p>
        </div>

        <div className="mt-3 pt-2 border-t border-black text-xs grid grid-cols-2 gap-y-1">
          <div>
            <span className="font-semibold">Dicetak Oleh:</span> {adminName} (Administrator IT)
          </div>
          <div className="text-right">
            <span className="font-semibold">Tanggal Report:</span> {currentDate} WITA
          </div>
          <div>
            <span className="font-semibold">Total Tiket Dicetak:</span> {printTickets.length} Tiket
          </div>
          <div className="text-right">
            <span className="font-semibold">Status Dokumen:</span> RESMI / IT AUDIT HOMM SARANAM
          </div>
        </div>
      </div>

      {/* TABEL DATA HASIL CETAK / TAMPILAN */}
      <Card className="bg-white shadow-sm border-slate-200 print:shadow-none print:border-none print:rounded-none">
        <CardHeader className="print:pb-2 border-b border-slate-100 print:border-none">
          <CardTitle className="text-base flex items-center gap-2 print:text-xs print:font-bold">
            <FileCheck className="w-5 h-5 text-purple-600 print:hidden" />
            <span className="print:hidden">Riwayat Laporan Tiket Maintenance ({filteredTickets.length} Data)</span>
            <span className="hidden print:inline">Riwayat Laporan Tiket Maintenance ({printTickets.length} Data)</span>
          </CardTitle>
          <CardDescription className="text-xs print:hidden">
            Daftar rekapitulasi audit perbaikan yang disaring berdasarkan kebutuhan audit IT HOMM Saranam Baturiti.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-4 p-0 md:p-6 print:p-0">
          <div className="overflow-x-auto">
            {/* TABEL PADA LAYAR UTAMA */}
            <table className="w-full text-xs text-left border-collapse border border-slate-200 print:hidden">
              <thead>
                <tr className="bg-slate-100 text-slate-800 border-b border-slate-200 font-bold uppercase text-[11px]">
                  <th className="p-2.5 border border-slate-200 text-center w-10">No</th>
                  <th className="p-2.5 border border-slate-200">Kode CCTV</th>
                  <th className="p-2.5 border border-slate-200">Lokasi Area & Lantai</th>
                  <th className="p-2.5 border border-slate-200">Jenis Kendala</th>
                  <th className="p-2.5 border border-slate-200">Pelapor</th>
                  <th className="p-2.5 border border-slate-200 text-center">Tanggal Lapor</th>
                  <th className="p-2.5 border border-slate-200">Tindakan IT / Perbaikan</th>
                  <th className="p-2.5 border border-slate-200 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-500 font-medium">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                        <span>Memuat data dari database Laravel...</span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-slate-500 italic">
                      Tidak ada data laporan maintenance yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((t, index) => (
                    <tr key={t.id} className="hover:bg-slate-50 transition border-b border-slate-200 text-slate-800">
                      <td className="p-2.5 border border-slate-200 text-center font-medium">{index + 1}</td>
                      <td className="p-2.5 border border-slate-200 font-bold text-slate-900">{t.cctv?.code || t.cctvCode}</td>
                      <td className="p-2.5 border border-slate-200">
                        <div className="font-bold text-slate-800">{t.cctv?.location || t.location}</div>
                        <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Layers className="w-3 h-3 text-purple-600" />
                          <span>Lantai: {t.cctv?.floor || t.floor || 'GF'}</span>
                        </div>
                      </td>
                      <td className="p-2.5 border border-slate-200 text-red-600 font-semibold">{t.issue_type || t.issueType}</td>
                      <td className="p-2.5 border border-slate-200 text-slate-700">{t.reporter_name || t.reporterName}</td>
                      <td className="p-2.5 border border-slate-200 text-center text-slate-600 font-mono whitespace-nowrap">{t.reported_at || t.reportedAt}</td>
                      <td className="p-2.5 border border-slate-200 text-slate-700">
                        {(t.action_taken || t.actionTaken) ? (
                          <span className="font-semibold text-slate-900">{t.action_taken || t.actionTaken}</span>
                        ) : (
                          <span className="text-slate-400 italic">Belum ada tindakan</span>
                        )}
                      </td>
                      <td className="p-2.5 border border-slate-200 text-center">
                        <Badge
                          className={
                            t.status === 'resolved'
                              ? 'bg-green-100 text-green-700 hover:bg-green-100'
                              : t.status === 'in_progress'
                              ? 'bg-purple-100 text-purple-700 hover:bg-purple-100'
                              : 'bg-amber-100 text-amber-700 hover:bg-amber-100'
                          }
                        >
                          {t.status === 'resolved'
                            ? 'SELESAI'
                            : t.status === 'in_progress'
                            ? 'PROGRES'
                            : 'PENDING'}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* TABEL KHUSUS TAMPILAN CETAK PDF (PRINT) */}
            <table className="hidden print:table w-full text-xs text-left border-collapse border border-black">
              <thead>
                <tr className="bg-gray-200 text-black border-b border-black font-bold uppercase text-[10px]">
                  <th className="p-2.5 border border-black text-center w-10">No</th>
                  <th className="p-2.5 border border-black">Kode CCTV</th>
                  <th className="p-2.5 border border-black">Lokasi Area & Lantai</th>
                  <th className="p-2.5 border border-black">Jenis Kendala</th>
                  <th className="p-2.5 border border-black">Pelapor</th>
                  <th className="p-2.5 border border-black text-center">Tanggal Lapor</th>
                  <th className="p-2.5 border border-black">Tindakan IT / Perbaikan</th>
                  <th className="p-2.5 border border-black text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black">
                {printTickets.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-6 text-center text-black italic">
                      Tidak ada data laporan maintenance pada periode yang dipilih.
                    </td>
                  </tr>
                ) : (
                  printTickets.map((t, index) => (
                    <tr key={t.id} className="border-b border-black text-black">
                      <td className="p-2.5 border border-black text-center font-medium">{index + 1}</td>
                      <td className="p-2.5 border border-black font-bold">{t.cctv?.code || t.cctvCode}</td>
                      <td className="p-2.5 border border-black">
                        <div className="font-bold">{t.cctv?.location || t.location}</div>
                        <div className="text-[11px] font-semibold">Lantai: {t.cctv?.floor || t.floor || 'GF'}</div>
                      </td>
                      <td className="p-2.5 border border-black font-semibold">{t.issue_type || t.issueType}</td>
                      <td className="p-2.5 border border-black">{t.reporter_name || t.reporterName}</td>
                      <td className="p-2.5 border border-black text-center font-mono whitespace-nowrap">{t.reported_at || t.reportedAt}</td>
                      <td className="p-2.5 border border-black">
                        {(t.action_taken || t.actionTaken) ? (
                          <span className="font-semibold">{t.action_taken || t.actionTaken}</span>
                        ) : (
                          <span className="italic">Belum ada tindakan</span>
                        )}
                      </td>
                      <td className="p-2.5 border border-black text-center font-bold">
                        {t.status === 'resolved'
                          ? 'SELESAI'
                          : t.status === 'in_progress'
                          ? 'PROGRES'
                          : 'PENDING'}
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

      {/* MODAL POP-UP PILIHAN BULAN DAN TAHUN SEBELUM CETAK PDF */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="sm:max-w-md bg-white p-6 rounded-xl shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Printer className="w-5 h-5 text-purple-600" />
              Pilih Periode Cetak Laporan PDF
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Tentukan bulan dan tahun rekapitulasi data yang ingin dicetak ke dokumen PDF / printer.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Pilih Bulan</Label>
              <select
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={printMonth}
                onChange={(e) => setPrintMonth(e.target.value)}
              >
                {MONTH_OPTIONS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Pilih Tahun</Label>
              <select
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={printYear}
                onChange={(e) => setPrintYear(e.target.value)}
              >
                <option value="all">Semua Tahun</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 font-medium">
              Jumlah Tiket Siap Cetak: <strong>{printTickets.length} Laporan</strong>
            </div>
          </div>

          <DialogFooter className="pt-2 flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsPrintDialogOpen(false)}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleExecutePrint}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs gap-1.5"
            >
              <Printer className="w-4 h-4" /> Cetak PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
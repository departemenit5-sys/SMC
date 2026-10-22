// app/staff/report/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { CCTV } from '@/types/cctv';
import { getCCTVs, createTicket } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Send,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Info,
  X,
  Camera,
  Layers,
  ChevronDown,
  Check,
  UploadCloud,
  ImageIcon,
  Trash2,
  Loader2,
} from 'lucide-react';

interface AlertNotification {
  type: 'success' | 'error' | 'info';
  message: string;
}

export default function StaffReportPage() {
  const [cctvs, setCCTVs] = useState<CCTV[]>([]);
  const [loadingCCTVs, setLoadingCCTVs] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [selectedCCTVId, setSelectedCCTVId] = useState('');
  const [issueType, setIssueType] = useState('Gambar No-Signal / Blank');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('');

  // File Foto State
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>('');
  const [photoFileSize, setPhotoFileSize] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Combobox State
  const [comboboxInput, setComboboxInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Notifikasi Melayang Atas
  const [topAlert, setTopAlert] = useState<AlertNotification | null>(null);

  const triggerTopAlert = (type: 'success' | 'error' | 'info', message: string) => {
    setTopAlert({ type, message });
    setTimeout(() => {
      setTopAlert(null);
    }, 4000);
  };

  // Fetch Data CCTV dari Database Laravel
  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setReporterName(savedName);

    const fetchCCTVData = async () => {
      try {
        const data = await getCCTVs();
        setCCTVs(data);
      } catch (error) {
        triggerTopAlert('error', 'Gagal memuat daftar CCTV dari server Laravel.');
      } finally {
        setLoadingCCTVs(false);
      }
    };

    fetchCCTVData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handler Pilihan Foto (Max 2MB)
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

    if (file.size > MAX_SIZE_BYTES) {
      triggerTopAlert(
        'error',
        `Ukuran file foto terlalu besar (${(file.size / (1024 * 1024)).toFixed(2)} MB). Maksimal 2MB!`
      );
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const sizeFormatted =
      file.size >= 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
        : `${(file.size / 1024).toFixed(0)} KB`;

    setPhotoFile(file);
    setPhotoFileName(file.name);
    setPhotoFileSize(sizeFormatted);

    // Buat URL pratinjau foto
    const objectUrl = URL.createObjectURL(file);
    setPhotoPreview(objectUrl);
  };

  const handleRemovePhoto = () => {
    if (photoPreview) URL.revokeObjectURL(photoPreview);
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoFileName('');
    setPhotoFileSize('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const filteredCCTVs = cctvs.filter((item) => {
    const query = comboboxInput.toLowerCase().trim();
    return (
      item.code.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      (item.floor && item.floor.toLowerCase().includes(query))
    );
  });

  const handleSelectCCTV = (item: CCTV) => {
    setSelectedCCTVId(String(item.id));
    setComboboxInput(`${item.code} — ${item.location} (${item.floor || 'GF'})`);
    setIsDropdownOpen(false);
  };

  // Submit Laporan ke Endpoint API Laravel
  const handleSubmitReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCCTVId) {
      triggerTopAlert('error', 'Pilih unit CCTV dari daftar terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);

    try {
      // Gunakan FormData untuk pengiriman data dan file
      const formData = new FormData();
      formData.append('cctv_id', selectedCCTVId);
      formData.append('issue_type', issueType);
      formData.append('description', description);
      formData.append('reporter_name', reporterName || 'Staff Security');

      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await createTicket(formData);

      // Reset Form State
      setSelectedCCTVId('');
      setComboboxInput('');
      setIssueType('Gambar No-Signal / Blank');
      setDescription('');
      handleRemovePhoto();

      triggerTopAlert('success', 'Laporan kendala berhasil dikirim ke database Laravel!');
    } catch (error) {
      triggerTopAlert('error', 'Gagal mengirim laporan ke server. Periksa koneksi backend.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCCTVObj = cctvs.find((item) => String(item.id) === selectedCCTVId);

  return (
    <div className="max-w-2xl mx-auto space-y-6 relative">
      {/* BANNER NOTIFIKASI MELAYANG */}
      {topAlert && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 transition-all duration-300 animate-in fade-in slide-in-from-top-4">
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

      {/* HEADER PAGE */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Form Lapor Kendala CCTV</h1>
        <p className="text-slate-500 text-xs mt-1">
          HOMM Saranam Baturiti — Laporkan perangkat CCTV yang mengalami masalah atau gangguan operasional ke Tim IT.
        </p>
      </div>

      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader className="border-b border-slate-100 pb-4">
          <CardTitle className="text-base flex items-center gap-2 text-slate-800">
            <AlertCircle className="w-5 h-5 text-purple-600" />
            Rincian Laporan Kerusakan
          </CardTitle>
          <CardDescription className="text-xs">
            Pilih unit CCTV, unggah foto bukti, dan jelaskan kendala secara rinci.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form onSubmit={handleSubmitReport} className="space-y-4">
            {/* 1. NAMA PELAPOR */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Nama Pelapor (Security / Staff)</Label>
              <Input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="Masukkan nama pelapor..."
                className="text-xs bg-slate-50 border-slate-200 font-semibold text-slate-800 focus:bg-white"
                required
              />
            </div>

            {/* 2. CUSTOM SEARCHABLE COMBOBOX */}
            <div className="space-y-1 relative" ref={dropdownRef}>
              <Label className="text-xs font-semibold text-slate-700">Pilih Unit CCTV Kendala</Label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder={loadingCCTVs ? 'Memuat daftar CCTV...' : 'Ketik kode atau lokasi CCTV (misal: CAM-MB-01)...'}
                  value={comboboxInput}
                  disabled={loadingCCTVs}
                  onFocus={() => setIsDropdownOpen(true)}
                  onChange={(e) => {
                    setComboboxInput(e.target.value);
                    setSelectedCCTVId('');
                    setIsDropdownOpen(true);
                  }}
                  className="text-xs bg-slate-50 border-slate-200 font-semibold text-slate-800 pr-10 focus:bg-white"
                  required
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>

              {isDropdownOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-56 overflow-y-auto py-1">
                  {filteredCCTVs.length === 0 ? (
                    <div className="p-3 text-xs text-slate-400 italic text-center">
                      Tidak ditemukan CCTV dengan kata kunci "{comboboxInput}"
                    </div>
                  ) : (
                    filteredCCTVs.map((item) => {
                      const isSelected = selectedCCTVId === String(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleSelectCCTV(item)}
                          className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-purple-50 transition ${
                            isSelected ? 'bg-purple-50 font-bold text-purple-700' : 'text-slate-700'
                          }`}
                        >
                          <div>
                            <span className="font-bold text-slate-900">{item.code}</span>
                            <span className="text-slate-500 ml-1.5">— {item.location} ({item.floor || 'GF'})</span>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-purple-600" />}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* HIGHLIGHT DETAIL UNIT TERPILIH */}
            {selectedCCTVObj && (
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs space-y-1 text-purple-900 animate-in fade-in">
                <div className="flex items-center gap-2 font-bold">
                  <Camera className="w-4 h-4 text-purple-600" />
                  <span>CCTV Terpilih: {selectedCCTVObj.code}</span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-purple-700 font-medium pl-6">
                  <span>Lokasi: {selectedCCTVObj.location}</span>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3 h-3" /> Lantai: {selectedCCTVObj.floor || 'GF'}
                  </span>
                  <span>IP: {selectedCCTVObj.ipAddress || '-'}</span>
                </div>
              </div>
            )}

            {/* 3. JENIS KENDALA */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Jenis Kendala / Kerusakan</Label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
                className="w-full p-2.5 border border-slate-300 rounded-lg text-xs bg-slate-50 font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                required
              >
                <option value="Gambar No-Signal / Blank">Gambar No-Signal / Blank</option>
                <option value="Lensa Buram / Pudar / Minyak">Lensa Buram / Pudar / Minyak</option>
                <option value="Kamera Mati Total (Power Off)">Kamera Mati Total (Power Off)</option>
                <option value="Posisi / Angle Bergeser">Posisi / Angle Bergeser</option>
                <option value="Arah PTZ / Infrared Bermasalah">Arah PTZ / Infrared Bermasalah</option>
                <option value="Kabel / Connector Longgar / Rusak">Kabel / Connector Longgar / Rusak</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* 4. UNGGAH FOTO BUKTI KENDALA (MAKSIMAL 2MB) */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Foto Bukti Kendala (Opsional)</span>
                <span className="text-[10px] text-slate-400 font-normal">Maksimal 2 MB (JPG/PNG)</span>
              </Label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/png, image/jpeg, image/jpg, image/webp"
                onChange={handlePhotoChange}
                className="hidden"
              />

              {!photoPreview ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-purple-400 bg-slate-50/70 hover:bg-purple-50/40 rounded-xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5"
                >
                  <div className="w-9 h-9 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Klik untuk memilih foto kerusakan
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Format gambar PNG, JPG, WEBP hingga batas 2 MB
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 border border-slate-300 overflow-hidden shrink-0">
                      <img
                        src={photoPreview}
                        alt="Bukti Kerusakan"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="overflow-hidden text-xs">
                      <div className="font-semibold text-slate-800 truncate flex items-center gap-1">
                        <ImageIcon className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span className="truncate">{photoFileName}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-medium mt-0.5">
                        Ukuran: {photoFileSize}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemovePhoto}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs shrink-0 h-8 px-2"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    <span>Hapus</span>
                  </Button>
                </div>
              )}
            </div>

            {/* 5. DESKRIPSI DETAIL */}
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-slate-700">Deskripsi / Catatan Tambahan</Label>
              <Textarea
                placeholder="Tuliskan gejala kendala lebih detail (misal: gambar bergaris sejak jam 08:00, atau adaptor berbunyi)..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs bg-slate-50 border-slate-200 focus:bg-white h-24"
                required
              />
            </div>

            {/* TOMBOL SUBMIT */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-10 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Mengirim Laporan...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Kirim Laporan Kerusakan</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
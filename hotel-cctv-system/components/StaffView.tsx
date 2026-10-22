// components/StaffView.tsx
'use client';

import { useState } from 'react';
import { CCTV, TicketReport } from '@/types/cctv';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, Upload, Image as ImageIcon } from 'lucide-react';

interface StaffViewProps {
  cctvs: CCTV[];
  tickets: TicketReport[];
  onSubmitReport: (newTicket: TicketReport, targetCCTVId: string) => void;
  defaultReporterName: string;
}

export default function StaffView({ cctvs, tickets, onSubmitReport, defaultReporterName }: StaffViewProps) {
  const [selectedCCTVId, setSelectedCCTVId] = useState('');
  const [reporterName, setReporterName] = useState(defaultReporterName);
  const [issueType, setIssueType] = useState('No Video / Display Matot');
  const [description, setDescription] = useState('');
  
  // State untuk Foto & Error Validasi
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Handler Pilihan File & Validasi Ukuran (Max 2MB)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      // 2 MB = 2 * 1024 * 1024 bytes
      const maxSizeBytes = 2 * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        setFileError('Ukuran file terlalu besar! Maksimal ukuran foto adalah 2 MB.');
        setSelectedFile(null);
        setPreviewUrl(null);
        e.target.value = ''; // Reset input
        return;
      }

      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (fileError) {
      alert('Harap perbaiki file lampiran sebelum mengirim laporan.');
      return;
    }

    const targetCCTV = cctvs.find((c) => c.id === selectedCCTVId);
    if (!targetCCTV) return;

    const newTicket: TicketReport = {
      id: `TCK-${Date.now().toString().slice(-4)}`,
      cctvId: targetCCTV.id,
      cctvCode: targetCCTV.code,
      location: targetCCTV.location,
      reporterName: reporterName || defaultReporterName,
      issueType,
      description,
      photoUrl: previewUrl || undefined, // URL preview foto
      status: 'pending',
      reportedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };

    onSubmitReport(newTicket, targetCCTV.id);

    // Reset Form
    setSelectedCCTVId('');
    setDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    alert('Laporan kerusakan beserta foto bukti berhasil dikirim ke Admin IT!');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-blue-600" /> Form Lapor CCTV Rusak
          </CardTitle>
          <CardDescription>Isi detail kendala saat patroli harian.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Pilih Titik CCTV</Label>
              <select
                className="w-full p-2 border rounded-md text-sm mt-1 bg-white"
                value={selectedCCTVId}
                onChange={(e) => setSelectedCCTVId(e.target.value)}
                required
              >
                <option value="">-- Pilih CCTV --</option>
                {cctvs.map((c) => (
                  <option key={c.id} value={c.id}>{c.code} - {c.location}</option>
                ))}
              </select>
            </div>

            <div>
              <Label>Nama Pelapor</Label>
              <Input
                placeholder="Nama & Shift (misal: Budi - Security Morning)"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                required
              />
            </div>

            <div>
              <Label>Jenis Kerusakan</Label>
              <select
                className="w-full p-2 border rounded-md text-sm mt-1 bg-white"
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="No Video / Display Matot">No Video / Display Matot</option>
                <option value="Gambar Blur / Berbayang">Gambar Blur / Berbayang</option>
                <option value="Arah Kamera Bergeser">Arah Kamera Bergeser</option>
                <option value="Night Vision / IR Mati">Night Vision / IR Mati</option>
              </select>
            </div>

            <div>
              <Label>Deskripsi Kendala</Label>
              <textarea
                className="w-full p-2 border rounded-md text-sm mt-1 bg-white h-20"
                placeholder="Jelaskan detail masalah..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Input File Foto Bukti */}
            <div className="space-y-1">
              <Label htmlFor="photo-upload">Upload Foto Bukti Kerusakan (Maks 2 MB)</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  id="photo-upload"
                  type="file"
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className="cursor-pointer text-xs"
                />
              </div>

              {/* Tampilkan Pesan Error jika file > 2MB */}
              {fileError && (
                <p className="text-xs text-red-600 font-medium mt-1">{fileError}</p>
              )}

              {/* Tampilkan Preview Gambar jika valid */}
              {previewUrl && !fileError && (
                <div className="mt-2 p-2 border rounded-lg bg-slate-50 flex items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="Preview Bukti"
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <div className="text-xs text-slate-600">
                    <p className="font-semibold">{selectedFile?.name}</p>
                    <p>{((selectedFile?.size || 0) / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              <Upload className="w-4 h-4 mr-2" /> Kirim Laporan Kerusakan
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Histori Laporan Terakhir */}
      <Card>
        <CardHeader>
          <CardTitle>Histori Laporan Terakhir</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {tickets.map((t) => (
            <div key={t.id} className="p-3 border rounded-lg bg-white space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm">{t.cctvCode}</span>
                <Badge variant={t.status === 'resolved' ? 'outline' : 'destructive'}>
                  {t.status.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-slate-600">{t.location}</div>
              <div className="text-xs font-medium text-red-600">{t.issueType}</div>

              {/* Lampiran Gambar di Histori */}
              {t.photoUrl && (
                <div className="flex items-center gap-2 text-xs text-blue-600 font-medium bg-blue-50 p-1.5 rounded">
                  <ImageIcon className="w-4 h-4" /> Ada lampiran foto bukti
                </div>
              )}

              <div className="text-xs text-slate-400">{t.reportedAt} oleh {t.reporterName}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
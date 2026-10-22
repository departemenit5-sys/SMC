// app/staff/monitoring/page.tsx
'use client';

import { useState } from 'react';
import { CCTV, TicketReport } from '@/types/cctv';
import { initialCCTVs, initialTickets } from '@/lib/mock-data';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Activity, Image as ImageIcon, CheckCircle, Clock, Wrench } from 'lucide-react';

export default function StaffMonitoringPage() {
  const [cctvs] = useState<CCTV[]>(initialCCTVs);
  const [tickets] = useState<TicketReport[]>(initialTickets);

  const totalCCTV = cctvs.length;
  const cctvHidup = cctvs.filter((c) => c.status === 'normal').length;
  const cctvMati = cctvs.filter((c) => c.status !== 'normal').length;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Monitoring Kondisi & Status Laporan</h1>
        <p className="text-slate-500 text-xs mt-1">
          Pantau status operasional CCTV serta perkembangan perbaikan tiket yang Anda laporkan.
        </p>
      </div>

      {/* Stat Cards Ringkas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm border-slate-200">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Total Unit CCTV</span>
              <Video className="w-4 h-4 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-slate-900">{totalCCTV}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Seluruh Area Hotel</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-green-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Kondisi Normal</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-green-600">{cctvHidup}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Berfungsi Normal</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-slate-200 border-t-2 border-t-red-500">
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-slate-500 flex items-center justify-between">
              <span>Kondisi Kendala/Mati</span>
              <Wrench className="w-4 h-4 text-red-500" />
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-2xl font-bold text-red-600">{cctvMati}</div>
            <p className="text-[10px] text-slate-400 mt-0.5">Perlu / Sedang Dikerjakan IT</p>
          </CardContent>
        </Card>
      </div>

      {/* Histori Status Tiket */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" /> Histori & Progres Laporan Anda
          </CardTitle>
          <CardDescription className="text-xs">
            Daftar perkembangan perbaikan teknis dari tim Admin IT.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {tickets.map((t) => (
              <div key={t.id} className="p-4 border rounded-lg bg-white space-y-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-sm">{t.cctvCode}</span>
                    <span className="text-xs text-slate-500">({t.location})</span>
                  </div>
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
                      ? 'SEDANG DIKERJAKAN'
                      : 'PENDING'}
                  </Badge>
                </div>

                <div className="text-xs font-semibold text-red-600">{t.issueType}</div>
                <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded border">
                  "{t.description}"
                </p>

                {t.photoUrl && (
                  <a
                    href={t.photoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-600 flex items-center gap-1 hover:underline font-medium pt-1"
                  >
                    <ImageIcon className="w-3.5 h-3.5" /> Lihat Bukti Lampiran Foto
                  </a>
                )}

                {t.actionTaken && (
                  <div className="text-xs bg-slate-100 text-slate-700 p-2 rounded mt-1 font-medium">
                    <span className="font-bold text-slate-900">Tindakan IT:</span> {t.actionTaken}
                  </div>
                )}

                <div className="text-[11px] text-slate-400 flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3" /> Dilaporkan pada {t.reportedAt} oleh {t.reporterName}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
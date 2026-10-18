import React, { useState } from 'react';
import { Users, CheckCircle, XCircle, Download, Search, X, Mail, Phone } from 'lucide-react';
import { GuestRSVP } from '../types';

interface AdminRSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  rsvps: GuestRSVP[];
  onClearRSVPs?: () => void;
}

export const AdminRSVPModal: React.FC<AdminRSVPModalProps> = ({ isOpen, onClose, rsvps }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'yes' | 'no'>('all');

  if (!isOpen) return null;

  const filtered = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.includes(searchTerm);
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && r.attending === filterStatus;
  });

  const confirmedCount = rsvps.filter((r) => r.attending === 'yes').reduce((sum, r) => sum + r.guestsCount, 0);
  const declinedCount = rsvps.filter((r) => r.attending === 'no').length;

  const exportToCSV = () => {
    const headers = ['Nombre Completo', 'Correo', 'Telefono', 'Asiste', 'Num Personas', 'Acompañantes', 'Notas', 'Fecha'];
    const rows = rsvps.map((r) => [
      `"${r.fullName}"`,
      `"${r.email}"`,
      `"${r.phone}"`,
      r.attending === 'yes' ? 'SI' : 'NO',
      r.guestsCount,
      `"${r.companionNames || ''}"`,
      `"${r.notes || ''}"`,
      `"${r.createdAt}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Confirmaciones_Boda_Oscar_y_Tatiana_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#faf7f0] rounded-3xl shadow-2xl border-2 border-[#d4af37]/60 overflow-hidden text-[#1e2820] my-8">
        {/* Header */}
        <div className="bg-[#122b1e] text-[#faf7f0] px-6 py-5 flex items-center justify-between border-b border-[#d4af37]/40">
          <div>
            <span className="text-[10px] font-cinzel text-[#d4af37] uppercase tracking-widest font-semibold block">
              Panel de Organización · Tatiana & Oscar
            </span>
            <h3 className="font-garamond text-2xl font-bold text-[#faf7f0]">
              Lista de Confirmaciones de Asistencia
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#e8decb] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 space-y-6">
          {/* Metrics Strip */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-white p-3.5 rounded-2xl border border-[#d8cdb8] shadow-sm">
              <span className="text-xs text-[#5f6c62] block font-cinzel uppercase">Total Respuestas</span>
              <span className="text-2xl font-bold text-[#122b1e] font-cinzel">{rsvps.length}</span>
            </div>
            <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 shadow-sm">
              <span className="text-xs text-emerald-800 block font-cinzel uppercase">Cupos Confirmados</span>
              <span className="text-2xl font-bold text-emerald-900 font-cinzel">{confirmedCount} personas</span>
            </div>
            <div className="bg-rose-50 p-3.5 rounded-2xl border border-rose-200 shadow-sm">
              <span className="text-xs text-rose-800 block font-cinzel uppercase">No Podrán Asistir</span>
              <span className="text-2xl font-bold text-rose-900 font-cinzel">{declinedCount}</span>
            </div>
          </div>

          {/* Search & Export Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#8a998e] absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Buscar por nombre, correo o celular..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#d8cdb8] bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e]"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filterStatus === 'all' ? 'bg-[#122b1e] text-white' : 'bg-[#e8decb] text-[#122b1e]'
                }`}
              >
                Todos ({rsvps.length})
              </button>
              <button
                onClick={() => setFilterStatus('yes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filterStatus === 'yes' ? 'bg-[#122b1e] text-white' : 'bg-[#e8decb] text-[#122b1e]'
                }`}
              >
                Asisten
              </button>
              <button
                onClick={() => setFilterStatus('no')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  filterStatus === 'no' ? 'bg-[#122b1e] text-white' : 'bg-[#e8decb] text-[#122b1e]'
                }`}
              >
                No asisten
              </button>

              <button
                onClick={exportToCSV}
                disabled={rsvps.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#d4af37] hover:bg-[#b8860b] text-[#122b1e] font-cinzel text-xs font-bold uppercase transition-all shadow disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar CSV</span>
              </button>
            </div>
          </div>

          {/* Table / Cards */}
          <div className="max-h-96 overflow-y-auto space-y-3 pr-1">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-[#738075] py-8 font-garamond italic">
                No hay registros que coincidan con la búsqueda.
              </p>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-4 rounded-xl border border-[#d8cdb8] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <strong className="text-sm text-[#122b1e] font-bold">{item.fullName}</strong>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          item.attending === 'yes'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border border-rose-300'
                        }`}
                      >
                        {item.attending === 'yes' ? `Asiste (${item.guestsCount} cupos)` : 'No asiste'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[#58645a]">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" /> {item.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {item.phone}
                      </span>
                      <span className="text-[#8e9c90]">Registrado: {item.createdAt}</span>
                    </div>

                    {item.companionNames && (
                      <p className="text-[#3e4a40]">
                        <strong>Acompañantes:</strong> {item.companionNames}
                      </p>
                    )}
                    {item.notes && (
                      <p className="text-[#3e4a40] italic">
                        <strong>Nota:</strong> "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-[#122b1e] text-[#faf7f0] text-xs font-cinzel uppercase tracking-widest font-semibold hover:bg-[#1a3d2b] transition-colors"
            >
              Cerrar Panel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

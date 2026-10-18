import React, { useState } from 'react';
import {
  Mail,
  CheckCircle,
  Send,
  X,
  Users,
  AlertCircle,
  Phone,
  User,
  Calendar,
  MessageSquare,
  Copy,
  Check,
  ExternalLink,
  Loader2,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GuestRSVP } from '../types';

interface RSVPModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRSVPSaved?: (rsvp: GuestRSVP) => void;
}

export const RSVPModal: React.FC<RSVPModalProps> = ({ isOpen, onClose, onRSVPSaved }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [attending, setAttending] = useState<'yes' | 'no'>('yes');
  const [guestsCount, setGuestsCount] = useState(1);
  const [companionNames, setCompanionNames] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [serverEmailSent, setServerEmailSent] = useState<boolean | null>(null);

  if (!isOpen) return null;

  const targetEmail = 'Tatianagiraldo071996@gmail.com';

  const generateMailtoSubject = () => {
    return `Confirmación Boda Oscar & Tatiana - ${fullName || 'Invitado'}`;
  };

  const generateMailtoBody = () => {
    return [
      `CONFIRMACIÓN DE ASISTENCIA · NUESTRA BODA`,
      `Oscar Londoño & Tatiana Giraldo`,
      `19 de Diciembre de 2026 · Parroquia San Francisco de Asís, San Francisco, Antioquia`,
      `----------------------------------------------------`,
      `Nombre del invitado: ${fullName}`,
      `Correo electrónico: ${email}`,
      `Teléfono / Celular: ${phone}`,
      `¿Asiste?: ${attending === 'yes' ? 'SÍ, CONFIRMO MI ASISTENCIA' : 'NO PODRÉ ASISTIR'}`,
      `Número de personas: ${attending === 'yes' ? guestsCount : 0}`,
      `Nombres de acompañantes: ${companionNames || 'Ninguno'}`,
      `Mensaje / Restricciones: ${notes || 'Ninguna'}`,
      `----------------------------------------------------`,
      `Enviado desde la invitación virtual oficial.`,
    ].join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return;

    setIsSubmitting(true);

    const newRSVP: GuestRSVP = {
      id: Date.now().toString(),
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      attending,
      guestsCount: attending === 'yes' ? guestsCount : 0,
      companionNames: companionNames.trim(),
      notes: notes.trim(),
      createdAt: new Date().toLocaleDateString('es-CO', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    // 1. Save to local storage for organizer panel
    try {
      const existing = localStorage.getItem('wedding_rsvps');
      const rsvpList: GuestRSVP[] = existing ? JSON.parse(existing) : [];
      rsvpList.unshift(newRSVP);
      localStorage.setItem('wedding_rsvps', JSON.stringify(rsvpList));
      if (onRSVPSaved) onRSVPSaved(newRSVP);
    } catch (err) {
      console.error('Error saving RSVP locally:', err);
    }

    // 2. Real HTTP POST to FormSubmit.co backend that delivers directly to Tatianagiraldo071996@gmail.com
    try {
      const response = await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          _subject: `Confirmación de Asistencia - Boda Oscar & Tatiana - ${fullName}`,
          _template: 'table',
          _captcha: 'false',
          'Nombre del Invitado': fullName,
          'Correo': email,
          'Teléfono / WhatsApp': phone,
          '¿Asiste a la boda?': attending === 'yes' ? 'SÍ, ASISTIRÁ' : 'NO ASISTIRÁ',
          'Número de cupos': attending === 'yes' ? guestsCount : 0,
          'Nombres de acompañantes': companionNames || 'Ninguno',
          'Mensaje o notas': notes || 'Sin notas adicionales',
          'Fecha de Registro': new Date().toLocaleString('es-CO'),
        }),
      });

      if (response.ok) {
        setServerEmailSent(true);
      } else {
        setServerEmailSent(false);
      }
    } catch (err) {
      console.warn('Backend email post attempt:', err);
      setServerEmailSent(false);
    } finally {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#122b1e', '#d4af37', '#e8decb', '#ffffff'],
      });
    } catch {}
  };

  const handleOpenGmailWeb = () => {
    const subject = encodeURIComponent(generateMailtoSubject());
    const body = encodeURIComponent(generateMailtoBody());
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${targetEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
  };

  const handleOpenNativeMail = () => {
    const subject = encodeURIComponent(generateMailtoSubject());
    const body = encodeURIComponent(generateMailtoBody());
    window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  const handleSendWhatsApp = () => {
    const waText = encodeURIComponent(
      `¡Hola Tatiana! Confirmo mi asistencia para la boda de Oscar Londoño y Tatiana Giraldo:\n\n` +
      `*Nombre:* ${fullName}\n` +
      `*Estado:* ${attending === 'yes' ? '✅ Sí asistiré' : '❌ No podré asistir'}\n` +
      `*Personas:* ${attending === 'yes' ? guestsCount : 0}\n` +
      (companionNames ? `*Acompañantes:* ${companionNames}\n` : '') +
      (notes ? `*Mensaje:* ${notes}\n` : '') +
      `*Teléfono:* ${phone}\n` +
      `*Correo:* ${email}`
    );
    window.open(`https://api.whatsapp.com/send?text=${waText}`, '_blank');
  };

  const handleCopySummary = () => {
    navigator.clipboard.writeText(generateMailtoBody());
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#faf7f0] rounded-3xl shadow-2xl border-2 border-[#d4af37]/60 overflow-hidden text-[#1e2820] my-8">
        {/* Header */}
        <div className="bg-[#122b1e] text-[#faf7f0] px-6 py-5 flex items-center justify-between border-b border-[#d4af37]/40">
          <div>
            <span className="text-[11px] font-cinzel text-[#d4af37] uppercase tracking-widest block font-semibold">
              R.S.V.P. · Confirma tu presencia
            </span>
            <h3 className="font-garamond text-2xl font-normal text-[#faf7f0]">
              Oscar Londoño & Tatiana Giraldo
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#e8decb] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Deadline & Email Notice */}
              <div className="p-3.5 rounded-xl bg-[#f0e9dc] border border-[#d4af37]/40 flex items-start gap-3 text-xs md:text-sm text-[#2c382f]">
                <Calendar className="w-5 h-5 text-[#122b1e] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-[#122b1e]">
                    Fecha límite para confirmar: <span className="text-[#a02222]">15 de diciembre de 2026</span>
                  </p>
                  <p className="text-xs text-[#5a665d] mt-0.5">
                    Las confirmaciones se envían directamente a: <strong>{targetEmail}</strong>
                  </p>
                </div>
              </div>

              {/* Attendance Selection */}
              <div>
                <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-2">
                  ¿Podrás acompañarnos? *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setAttending('yes')}
                    className={`py-3 px-4 rounded-xl border-2 text-xs md:text-sm font-medium transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      attending === 'yes'
                        ? 'border-[#122b1e] bg-[#122b1e] text-[#faf7f0] shadow-md'
                        : 'border-[#d4af37]/40 bg-white text-[#2c382f] hover:border-[#122b1e]'
                    }`}
                  >
                    <span className="font-semibold">¡Sí, con gusto asistiré!</span>
                    <span className="text-[11px] opacity-80">Celebraré con ustedes</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAttending('no')}
                    className={`py-3 px-4 rounded-xl border-2 text-xs md:text-sm font-medium transition-all text-center flex flex-col items-center justify-center gap-1 ${
                      attending === 'no'
                        ? 'border-[#a02222] bg-[#a02222] text-white shadow-md'
                        : 'border-[#d4af37]/40 bg-white text-[#2c382f] hover:border-[#a02222]'
                    }`}
                  >
                    <span className="font-semibold">No podré asistir</span>
                    <span className="text-[11px] opacity-80">Brindaré desde el corazón</span>
                  </button>
                </div>
              </div>

              {/* Name & Contact */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1.5">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#8a998e] absolute left-3 top-3.5" />
                    <input
                      type="text"
                      required
                      placeholder="Ej. Carlos Martínez"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e] text-[#1e2820]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1.5">
                    Teléfono / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#8a998e] absolute left-3 top-3.5" />
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +57 312 345 6789"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e] text-[#1e2820]"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1.5">
                  Correo Electrónico (para confirmar tu registro) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8a998e] absolute left-3 top-3.5" />
                  <input
                    type="email"
                    required
                    placeholder="tu-correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e] text-[#1e2820]"
                  />
                </div>
              </div>

              {/* Companions if Attending */}
              {attending === 'yes' && (
                <div className="space-y-4 pt-1 border-t border-[#e2d7c5]">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                    <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider md:col-span-2">
                      Total de personas que asistirán (incluyéndote):
                    </label>
                    <select
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(Number(e.target.value))}
                      className="w-full py-2.5 px-3 rounded-xl border border-[#d8cdb8] bg-white text-sm font-semibold text-[#122b1e] focus:outline-none focus:ring-2 focus:ring-[#122b1e]"
                    >
                      <option value={1}>1 persona (Solo yo)</option>
                      <option value={2}>2 personas (Con mi pareja)</option>
                      <option value={3}>3 personas (Familia)</option>
                      <option value={4}>4 personas</option>
                      <option value={5}>5 personas</option>
                    </select>
                  </div>

                  {guestsCount > 1 && (
                    <div>
                      <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1.5">
                        Nombres de tus acompañantes:
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Laura Gómez y Santiago Martínez"
                        value={companionNames}
                        onChange={(e) => setCompanionNames(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e]"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1.5">
                  Restricciones alimenticias o nota para los novios:
                </label>
                <textarea
                  rows={2}
                  placeholder="Ej. Opción vegetariana, felicitaciones o saludo especial..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] font-cinzel text-xs md:text-sm font-bold tracking-widest uppercase transition-all shadow-xl hover:shadow-2xl flex items-center justify-center gap-2 border border-[#d4af37] disabled:opacity-70 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#d4af37]" />
                      <span>Enviando confirmación...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-[#d4af37]" />
                      <span>Confirmar Asistencia a Tatianagiraldo071996@gmail.com</span>
                    </>
                  )}
                </button>
                <p className="text-center text-[11px] text-[#6b776d] mt-2 font-garamond italic">
                  Tu respuesta se envía directamente al correo de Tatiana Giraldo y se registra en la lista oficial de invitados.
                </p>
              </div>
            </form>
          ) : (
            /* Post-Submission Success Panel */
            <div className="text-center py-4 space-y-5">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#122b1e] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-xl">
                <CheckCircle className="w-9 h-9" />
              </div>

              <div>
                <h4 className="font-garamond text-3xl text-[#122b1e] font-semibold">
                  ¡Confirmación Registrada, {fullName}!
                </h4>
                <p className="font-garamond italic text-base text-[#4d5b50] max-w-md mx-auto mt-1.5">
                  {attending === 'yes'
                    ? 'Será un inmenso honor contar con tu presencia en nuestra unión matrimonial.'
                    : 'Agradecemos tu sincero aviso. Sabemos que nos acompañarás con tu corazón.'}
                </p>
              </div>

              {/* Status pill */}
              <div className="bg-[#f0e9dc] p-4 rounded-2xl border border-[#d4af37]/40 text-left text-xs md:text-sm space-y-1.5 text-[#242e26]">
                <div className="flex items-center justify-between">
                  <span><strong>Destinatario:</strong> {targetEmail}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                    Enviado
                  </span>
                </div>
                <p>
                  <strong>Estado:</strong>{' '}
                  <span className="font-semibold text-emerald-800">
                    {attending === 'yes' ? `Asistirá (${guestsCount} cupos)` : 'No asistirá'}
                  </span>
                </p>
                {companionNames && (
                  <p>
                    <strong>Acompañantes:</strong> {companionNames}
                  </p>
                )}
              </div>

              {/* Redundant options to guarantee Juanita receives it */}
              <div className="bg-white p-4 rounded-2xl border border-[#d8cdb8] space-y-3 text-left">
                <p className="text-xs text-[#38433a] font-medium text-center">
                  ¿Deseas asegurar la recepción enviando también una copia por Gmail o WhatsApp?
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    onClick={handleOpenGmailWeb}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#c5221f] hover:bg-[#a51c19] text-white text-xs font-semibold uppercase tracking-wider font-cinzel transition-all shadow"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Abrir en Gmail Web</span>
                  </button>

                  <button
                    onClick={handleSendWhatsApp}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider font-cinzel transition-all shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Enviar por WhatsApp</span>
                  </button>
                </div>

                <div className="flex justify-center gap-3 pt-1">
                  <button
                    onClick={handleOpenNativeMail}
                    className="text-xs text-[#122b1e] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Abrir en otra aplicación de correo</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                  <span className="text-[#c5baa6]">·</span>
                  <button
                    onClick={handleCopySummary}
                    className="text-xs text-[#122b1e] hover:underline flex items-center gap-1 font-medium"
                  >
                    {copiedSummary ? <Check className="w-3 h-3 text-emerald-700" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSummary ? '¡Copiado!' : 'Copiar resumen'}</span>
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <button
                  onClick={onClose}
                  className="px-8 py-2.5 rounded-full bg-[#122b1e] text-[#faf7f0] text-xs font-cinzel uppercase tracking-widest font-semibold hover:bg-[#1a3d2b] transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

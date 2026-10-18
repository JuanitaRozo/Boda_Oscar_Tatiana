import React, { useState } from 'react';
import { Globe, Copy, Check, Share2, Sparkles, X, Smartphone, Laptop, MessageCircle } from 'lucide-react';

interface PublishingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PublishingGuideModal: React.FC<PublishingGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedWhatsAppMsg, setCopiedWhatsAppMsg] = useState(false);

  if (!isOpen) return null;

  const currentAppUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentAppUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const whatsappMessage =
    `💍 *¡Nuestra Boda! Oscar Londoño & Tatiana Giraldo*\n\n` +
    `Con inmensa alegría queremos invitarte a celebrar nuestra unión matrimonial ante el altar.\n\n` +
    `🗓 *Fecha:* Sábado, 19 de Diciembre de 2026\n` +
    `⏰ *Hora:* 7:00 PM\n` +
    `📍 *Lugar:* Parroquia San Francisco de Asís, San Francisco, Antioquia\n` +
    `⏳ *Confirmación de asistencia hasta:* 15 de Diciembre de 2026\n\n` +
    `✨ *Abre nuestra invitación y confirma aquí:*\n` +
    `${currentAppUrl}`;

  const handleCopyWhatsAppMsg = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedWhatsAppMsg(true);
    setTimeout(() => setCopiedWhatsAppMsg(false), 2500);
  };

  const handleShareWhatsAppDirect = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#faf7f0] rounded-3xl shadow-2xl border-2 border-[#d4af37]/60 overflow-hidden text-[#1e2820] my-8">
        {/* Header */}
        <div className="bg-[#122b1e] text-[#faf7f0] px-6 py-5 flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <Globe className="w-5 h-5 text-[#d4af37]" />
            <div>
              <span className="text-[10px] font-cinzel text-[#d4af37] uppercase tracking-widest font-semibold block">
                Guía de Publicación Gratuita
              </span>
              <h3 className="font-garamond text-xl sm:text-2xl font-bold text-[#faf7f0]">
                Cómo Compartir tu Invitación 100% Gratis
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#e8decb] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Active URL Card */}
          <div className="bg-[#122b1e] text-[#faf7f0] p-5 rounded-2xl border border-[#d4af37]/50 shadow-md">
            <span className="text-xs uppercase font-cinzel tracking-wider text-[#d4af37] font-semibold block mb-1">
              Tu enlace web público listo para compartir:
            </span>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-2">
              <input
                type="text"
                readOnly
                value={currentAppUrl}
                className="flex-1 bg-[#0c1d14] px-3.5 py-2.5 rounded-xl border border-[#d4af37]/40 text-xs sm:text-sm text-[#faf7f0] font-mono focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#d4af37] hover:bg-[#b8860b] text-[#122b1e] font-cinzel text-xs font-bold uppercase transition-colors shrink-0"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-4 h-4 text-[#122b1e]" />
                    <span>¡Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#122b1e]" />
                    <span>Copiar Enlace</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#e8decb]/80 mt-2 font-garamond italic">
              Este enlace está activo y puede ser abierto en cualquier celular Android, iPhone, tablet o computador sin instalar nada.
            </p>
          </div>

          {/* Quick WhatsApp Send */}
          <div className="bg-[#f0e9dc] p-5 rounded-2xl border border-[#d8cdb8] space-y-3">
            <div className="flex items-center gap-2 text-[#122b1e]">
              <Share2 className="w-4 h-4 text-[#b8860b]" />
              <h4 className="font-cinzel text-xs uppercase font-bold tracking-wider">
                Compartir por WhatsApp a los Invitados
              </h4>
            </div>
            <p className="text-xs sm:text-sm text-[#3b483e]">
              Hemos redactado un mensaje elegante listo para enviar a tus contactos o grupos familiares con el enlace directo:
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                onClick={handleShareWhatsAppDirect}
                className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold uppercase tracking-wider font-cinzel transition-all shadow"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enviar por WhatsApp</span>
              </button>
              <button
                onClick={handleCopyWhatsAppMsg}
                className="inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#faf7f0] hover:bg-white text-[#122b1e] border border-[#d4af37]/60 text-xs font-semibold uppercase tracking-wider font-cinzel transition-all"
              >
                {copiedWhatsAppMsg ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    <span>¡Mensaje Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Options for free self-hosting */}
          <div className="space-y-4">
            <h4 className="font-cinzel text-xs uppercase font-bold tracking-wider text-[#122b1e]">
              Opciones de Hospedaje Web 100% Gratis para Siempre:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-4 rounded-xl border border-[#d8cdb8] space-y-1.5">
                <strong className="text-[#122b1e] text-sm block">1. Vercel o Netlify (Recomendado)</strong>
                <p className="text-[#4f5c52] leading-relaxed">
                  Conecta tu repositorio de GitHub o arrastra la carpeta <code>dist</code> generada por <code>npm run build</code>. Te da un enlace permanente HTTPS gratuito como <code>boda-oscar-tatiana.vercel.app</code>.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-[#d8cdb8] space-y-1.5">
                <strong className="text-[#122b1e] text-sm block">2. GitHub Pages</strong>
                <p className="text-[#4f5c52] leading-relaxed">
                  Totalmente gratis sin límite de tiempo. Sube el código a tu cuenta de GitHub y activa GitHub Pages en las opciones de configuración del repositorio.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#eef5f1] rounded-xl border border-[#cbe3d4] text-xs text-[#234230] flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#2d5a3e] shrink-0 mt-0.5" />
              <span>
                <strong>Adaptabilidad garantizada:</strong> El diseño está construido con diseño responsivo móvil (CSS Grid, Flexbox, fuentes escalables) para que luzca perfecto en pantallas de teléfonos de cualquier tamaño y en computadores de escritorio sin deformarse.
              </span>
            </div>
          </div>

          <div className="pt-2 text-center">
            <button
              onClick={onClose}
              className="px-8 py-2.5 rounded-full bg-[#122b1e] text-[#faf7f0] text-xs font-cinzel uppercase tracking-widest font-semibold hover:bg-[#1a3d2b] transition-colors"
            >
              Cerrar Guía
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

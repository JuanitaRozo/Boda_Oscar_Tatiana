import React, { useState } from 'react';
import {
  Heart,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Gift,
  Share2,
  Users,
  Sparkles,
} from 'lucide-react';

import { AudioPlayer, AudioPlayerRef } from './components/AudioPlayer';
import { OpeningCurtain } from './components/OpeningCurtain';
import { EnvelopeModal } from './components/EnvelopeModal';
import { Countdown } from './components/Countdown';
import { PhotoCarousel } from './components/PhotoCarousel';
import { RSVPModal } from './components/RSVPModal';
import { WishesSection } from './components/WishesSection';
import { LocationSection } from './components/LocationSection';
import { PublishingGuideModal } from './components/PublishingGuideModal';
import { AdminRSVPModal } from './components/AdminRSVPModal';
import { GuestRSVP } from './types';

import principalImg from './assets/images/principal.png';

export default function App() {
  const [isCurtainOpen, setIsCurtainOpen] = useState(false);
  const [isRSVPOpen, setIsRSVPOpen] = useState(false);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const [isPublishGuideOpen, setIsPublishGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const audioPlayerRef = React.useRef<AudioPlayerRef | null>(null);

  const handleOpenInvitation = () => {
    // Play the song immediately upon opening the invitation
    audioPlayerRef.current?.play();
    setIsCurtainOpen(true);
  };

  // Load RSVPs from storage
  const [rsvps, setRsvps] = useState<GuestRSVP[]>(() => {
    try {
      const stored = localStorage.getItem('wedding_rsvps');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const handleRSVPSaved = (newRSVP: GuestRSVP) => {
    setRsvps((prev) => [newRSVP, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#faf7f0] text-[#242e26] relative overflow-x-hidden">
      {/* Background Subtle Floral & Texture Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#d4af37_0.6px,transparent_0.6px)] [background-size:24px_24px] -z-10" />

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#122b1e]/95 backdrop-blur-md border-b border-[#d4af37]/30 text-[#faf7f0] transition-all">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <a href="#" className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#faf7f0] whitespace-nowrap shrink-0 flex items-center gap-2">
            <span className="text-[#d4af37]">NUESTRA BODA</span>
          </a>

          {/* Navigation Links (Without Itinerary or Dress Code) */}
          <nav className="hidden md:flex items-center gap-7 text-xs uppercase font-cinzel font-medium text-[#e8decb] tracking-wider">
            <a href="#historia" className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0">
              Galería de Fotos
            </a>
            <a href="#ubicacion" className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0">
              Ceremonia
            </a>
            <button
              onClick={() => setIsEnvelopeOpen(true)}
              className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer"
            >
              Lluvia de Sobres
            </button>
            <a href="#buenos-deseos" className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0">
              Buenos Deseos
            </a>
            <button
              onClick={() => setIsCurtainOpen(false)}
              className="hover:text-[#d4af37] transition-colors whitespace-nowrap shrink-0 text-left cursor-pointer flex items-center gap-1 text-[#d4af37]"
              title="Abrir sobre de nuevo con música"
            >
              <Sparkles className="w-3 h-3 text-[#d4af37]" />
              <span>Ver Sobre</span>
            </button>
          </nav>

          {/* Primary Action Button */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsRSVPOpen(true)}
              className="py-2 px-4 sm:px-5 rounded-full bg-[#d4af37] hover:bg-[#b8860b] text-[#122b1e] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg whitespace-nowrap shrink-0 cursor-pointer"
            >
              Confirmar Asistencia
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 px-4 overflow-hidden">
        {/* Soft emerald radial aura */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#2d5a3e]/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-5xl mx-auto">
          {/* Editorial Kicker */}
          <div className="text-center space-y-3 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#122b1e]/10 border border-[#d4af37]/50 text-[#122b1e]">
              <Sparkles className="w-3.5 h-3.5 text-[#b8860b]" />
              <span className="text-xs font-cinzel uppercase tracking-[0.2em] font-semibold text-[#122b1e]">
                Nuestra Boda
              </span>
            </div>

            <h1 className="font-garamond italic text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#122b1e] tracking-tight leading-none">
              Oscar Londoño
              <span className="block font-script text-3xl sm:text-5xl md:text-6xl text-[#b8860b] my-1 sm:my-2">
                &
              </span>
              Tatiana Giraldo
            </h1>

            <p className="font-garamond italic text-lg sm:text-2xl text-[#394a3e] max-w-2xl mx-auto leading-relaxed pt-2">
              "Te amaré hasta que la muerte nos separe... Entraremos a la iglesia para ser al fin tu dueño.
              Ese par de anillos para dos enamorados."
            </p>
          </div>

          {/* Hero Card & Real Couple Photo */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#122b1e] rounded-3xl p-6 sm:p-10 md:p-12 border-2 border-[#d4af37]/60 shadow-2xl text-[#faf7f0] relative overflow-hidden">
            {/* Subtle decorative gold frame corners */}
            <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-[#d4af37]/60 pointer-events-none" />
            <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#d4af37]/60 pointer-events-none" />

            {/* Couple Image (5 cols) */}
            <div className="md:col-span-5 relative">
              <div className="relative mx-auto max-w-xs md:max-w-none aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#d4af37] shadow-2xl group bg-[#0e2419]">
                <img
                  src={principalImg}
                  alt="Oscar Londoño y Tatiana Giraldo"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top sm:object-center transition-transform duration-500 group-hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex flex-col justify-end p-4 pointer-events-none">
                  <span className="text-xs font-garamond italic text-[#faf7f0]">
                    Oscar & Tatiana · Nuestra Boda
                  </span>
                  <span className="text-[10px] font-cinzel text-[#d4af37] font-semibold tracking-wider">
                    19 de Diciembre de 2026
                  </span>
                </div>
              </div>
            </div>

            {/* Wedding Key Details (7 cols) */}
            <div className="md:col-span-7 space-y-6 text-center md:text-left">
              <div className="space-y-1">
                <span className="text-xs font-cinzel uppercase tracking-[0.2em] text-[#d4af37] font-semibold block">
                  Invitación de Matrimonio
                </span>
                <h2 className="font-garamond text-3xl sm:text-4xl text-[#faf7f0] font-normal">
                  Tenemos el honor de invitarte a celebrar nuestra unión ante el altar
                </h2>
              </div>

              {/* Event Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#0e2419] p-4 rounded-xl border border-[#d4af37]/30">
                  <div className="flex items-center gap-2.5 text-[#d4af37] mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-xs font-cinzel uppercase tracking-wider font-semibold">
                      Fecha
                    </span>
                  </div>
                  <p className="font-garamond text-xl text-[#faf7f0] font-bold">
                    Sábado, 19 de Diciembre
                  </p>
                  <p className="text-xs text-[#e8decb]/80">Año 2026 · 7:00 PM</p>
                </div>

                <div className="bg-[#0e2419] p-4 rounded-xl border border-[#d4af37]/30">
                  <div className="flex items-center gap-2.5 text-[#d4af37] mb-1">
                    <MapPin className="w-4 h-4" />
                    <span className="text-xs font-cinzel uppercase tracking-wider font-semibold">
                      Lugar Sagrado
                    </span>
                  </div>
                  <p className="font-garamond text-xl text-[#faf7f0] font-bold">
                    Parroquia San Francisco de Asís
                  </p>
                  <p className="text-xs text-[#e8decb]/80">San Francisco, Antioquia, Colombia</p>
                </div>
              </div>

              {/* Confirmation Alert */}
              <div className="bg-[#faf7f0]/10 p-3.5 rounded-xl border border-[#d4af37]/40 text-xs sm:text-sm text-[#e8decb]">
                <span className="text-[#d4af37] font-semibold font-cinzel">Confirmación de asistencia:</span>{' '}
                Favor confirmar antes del <strong className="text-white underline">15 de Diciembre de 2026</strong>.
                Recepción directa a:{' '}
                <span className="font-mono text-white">Tatianagiraldo071996@gmail.com</span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button
                  onClick={() => setIsRSVPOpen(true)}
                  className="py-3 px-6 rounded-full bg-[#d4af37] hover:bg-[#b8860b] text-[#122b1e] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-105 cursor-pointer"
                >
                  Confirmar Mi Asistencia
                </button>

                <button
                  onClick={() => setIsEnvelopeOpen(true)}
                  className="py-3 px-5 rounded-full bg-[#1f4933] hover:bg-[#2d5a3e] text-[#faf7f0] border border-[#d4af37]/60 font-cinzel text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Gift className="w-4 h-4 text-[#d4af37]" />
                  <span>Lluvia de Sobres</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Countdown Section */}
      <Countdown />

      {/* Photo Carousel Section */}
      <div id="historia">
        <PhotoCarousel />
      </div>

      {/* Location Section */}
      <LocationSection />

      {/* Interactive Envelope Banner (Only Lluvia de Sobres, No Bank Details) */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4">
        <div className="bg-[#faf7f0] border-2 border-[#d4af37]/60 rounded-3xl p-6 sm:p-10 shadow-xl text-center space-y-4 relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#122b1e] border-2 border-[#d4af37] flex items-center justify-center text-[#d4af37] shadow-lg">
            <Gift className="w-8 h-8" />
          </div>

          <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#b8860b] font-semibold block">
            Detalle Especial
          </span>
          <h3 className="font-garamond italic text-3xl md:text-4xl text-[#122b1e]">
            Lluvia de Sobres
          </h3>
          <p className="font-garamond text-base md:text-lg text-[#394a3e] max-w-xl mx-auto leading-relaxed">
            Su compañía y bendición en este día es lo más importante para nosotros. Para quienes deseen acompañarnos con un presente para nuestro nuevo hogar, nuestra modalidad será lluvia de sobres en el buzón especial de la recepción.
          </p>

          <div className="pt-2">
            <button
              onClick={() => setIsEnvelopeOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] font-cinzel text-xs font-bold uppercase tracking-wider border border-[#d4af37] shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-[#d4af37]" />
              <span>Ver Detalle de Lluvia de Sobres</span>
            </button>
          </div>
        </div>
      </section>

      {/* Wishes Section & Downloadable PDF (Starting Clean/Empty) */}
      <WishesSection />

      {/* Final RSVP Callout Banner */}
      <section className="w-full max-w-4xl mx-auto py-12 px-4 mb-16">
        <div className="bg-gradient-to-br from-[#122b1e] via-[#1a3d2b] to-[#122b1e] rounded-3xl p-8 sm:p-12 text-[#faf7f0] text-center border-2 border-[#d4af37]/60 shadow-2xl space-y-6">
          <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37] font-semibold block">
            Esperamos Contar Contigo
          </span>
          <h3 className="font-garamond italic text-3xl sm:text-5xl text-[#faf7f0]">
            ¿Nos acompañas en este gran día?
          </h3>
          <p className="font-garamond text-base sm:text-lg text-[#e8decb] max-w-xl mx-auto">
            Por favor confirma tu presencia antes del <strong>15 de Diciembre de 2026</strong>. Las confirmaciones se envían a <strong>Tatianagiraldo071996@gmail.com</strong>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => setIsRSVPOpen(true)}
              className="py-3.5 px-8 rounded-full bg-[#d4af37] hover:bg-[#b8860b] text-[#122b1e] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:scale-105 cursor-pointer"
            >
              Confirmar Asistencia Ahora
            </button>

            <button
              onClick={() => setIsPublishGuideOpen(true)}
              className="py-3.5 px-6 rounded-full bg-white/10 hover:bg-white/20 text-[#faf7f0] border border-[#d4af37]/50 font-cinzel text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#d4af37]" />
              <span>Cómo Compartir Gratis</span>
            </button>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="bg-[#0c1d14] text-[#e8decb] border-t border-[#d4af37]/30 py-12 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <h4 className="font-cinzel text-lg tracking-widest text-[#faf7f0] font-bold">
            OSCAR & TATIANA
          </h4>
          <p className="font-garamond italic text-base text-[#d4af37]">
            "Hasta que la muerte nos separe · 19 de Diciembre de 2026"
          </p>
          <p className="text-xs text-[#8a998e] max-w-md mx-auto">
            Parroquia San Francisco de Asís · San Francisco, Antioquia, Colombia.
            Confirmaciones a: <span className="text-[#e8decb]">Tatianagiraldo071996@gmail.com</span>
          </p>

          {/* Quick Organizer Tools Link */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-cinzel text-[#d4af37]">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="hover:underline flex items-center gap-1.5 opacity-80 hover:opacity-100 cursor-pointer"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Panel de Asistencias ({rsvps.length})</span>
            </button>
            <span className="text-[#8a998e]">·</span>
            <button
              onClick={() => setIsPublishGuideOpen(true)}
              className="hover:underline flex items-center gap-1.5 opacity-80 hover:opacity-100 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enlace y Compartir</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Floating Audio Player with Ref Control */}
      <AudioPlayer ref={audioPlayerRef} />

      {/* Opening Envelope Curtain with Audio Activation */}
      {!isCurtainOpen && (
        <OpeningCurtain onOpen={handleOpenInvitation} />
      )}

      {/* Modals */}
      <RSVPModal
        isOpen={isRSVPOpen}
        onClose={() => setIsRSVPOpen(false)}
        onRSVPSaved={handleRSVPSaved}
      />

      <EnvelopeModal
        isOpen={isEnvelopeOpen}
        onClose={() => setIsEnvelopeOpen(false)}
      />

      <PublishingGuideModal
        isOpen={isPublishGuideOpen}
        onClose={() => setIsPublishGuideOpen(false)}
      />

      <AdminRSVPModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        rsvps={rsvps}
      />
    </div>
  );
}

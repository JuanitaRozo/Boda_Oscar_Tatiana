import React, { useState } from 'react';
import confetti from 'canvas-confetti';

interface OpeningCurtainProps {
  onOpen: () => void;
}

export const OpeningCurtain: React.FC<OpeningCurtainProps> = ({ onOpen }) => {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    // 1. Trigger audio play IMMEDIATELY in the user gesture callstack
    onOpen();

    // 2. Start curtain fade out animation
    setIsOpening(true);

    // 3. Throw celebratory wedding confetti
    try {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#122b1e', '#d4af37', '#e8decb', '#ffffff'],
      });
    } catch {}
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-[#08140e] via-[#122b1e] to-[#0a1b12] text-[#faf7f0] transition-all duration-700 ${
        isOpening ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Gold Sparkle Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:28px_28px]" />

      {/* Decorative Outer Frame */}
      <div className="relative max-w-md w-full bg-[#122b1e]/95 backdrop-blur-md rounded-3xl p-8 sm:p-10 border-2 border-[#d4af37]/70 shadow-[0_20px_60px_rgba(0,0,0,0.8)] text-center space-y-6">
        {/* Gold Corner Accents */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#d4af37]/70 pointer-events-none" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#d4af37]/70 pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#d4af37]/70 pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#d4af37]/70 pointer-events-none" />

        {/* Monogram Seal */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#122b1e] to-[#1f4933] border-2 border-[#d4af37] shadow-xl flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border border-dashed border-[#d4af37]/60 flex items-center justify-center">
            <span className="font-cinzel text-xl font-bold text-[#d4af37] tracking-widest">
              O & T
            </span>
          </div>
        </div>

        {/* Header Kicker */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-cinzel text-[#d4af37] uppercase tracking-[0.25em] font-semibold block">
            Invitación de Matrimonio
          </span>
          <h1 className="font-garamond italic text-3xl sm:text-4xl text-[#faf7f0] leading-tight">
            Oscar Londoño
            <span className="block font-script text-2xl sm:text-3xl text-[#d4af37] my-0.5">
              &
            </span>
            Tatiana Giraldo
          </h1>
          <p className="font-garamond italic text-xs sm:text-sm text-[#e8decb]/90 pt-1">
            Sábado, 19 de Diciembre de 2026 · 7:00 PM
          </p>
          <p className="text-xs text-[#d4af37] font-cinzel">
            Parroquia San Francisco de Asís
          </p>
        </div>

        {/* Music Hint Quote */}
        <div className="py-2.5 px-4 rounded-xl bg-white/5 border border-[#d4af37]/30">
          <p className="font-garamond italic text-xs text-[#d4af37]">
            "Ese par de anillos con nuestros nombres grabados..."
          </p>
        </div>

        {/* Big Open Invitation Button */}
        <div className="pt-2">
          <button
            onClick={handleOpenClick}
            className="w-full py-4 px-6 rounded-full bg-gradient-to-r from-[#d4af37] via-[#f3e5ab] to-[#b8860b] hover:from-[#b8860b] hover:to-[#996515] text-[#122b1e] font-cinzel text-xs sm:text-sm font-bold uppercase tracking-widest transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center cursor-pointer border border-white/50 animate-pulse"
          >
            <span>Abrir invitación</span>
          </button>

          <p className="text-[11px] text-[#e8decb]/70 mt-3 font-garamond italic">
            Toca el botón para ingresar
          </p>
        </div>
      </div>
    </div>
  );
};

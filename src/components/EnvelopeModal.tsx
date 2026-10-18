import React from 'react';
import { Mail, X, Gift, Heart } from 'lucide-react';

interface EnvelopeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EnvelopeModal: React.FC<EnvelopeModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#faf7f0] rounded-3xl shadow-2xl border-2 border-[#d4af37]/60 overflow-hidden text-[#1e2820]">
        {/* Top Header Bar */}
        <div className="bg-[#122b1e] text-[#faf7f0] px-6 py-4 flex items-center justify-between border-b border-[#d4af37]/30">
          <div className="flex items-center gap-2.5">
            <Gift className="w-5 h-5 text-[#d4af37]" />
            <h3 className="font-cinzel text-base tracking-wider uppercase font-bold text-[#faf7f0]">
              Lluvia de Sobres
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#e8decb] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 md:p-8 space-y-6 text-center">
          {/* Visual Envelope Graphic */}
          <div className="relative mx-auto max-w-xs bg-[#f4ede0] border border-[#d4af37]/40 rounded-2xl p-6 shadow-inner">
            {/* Stamp seal */}
            <div className="w-16 h-16 mx-auto -mt-2 mb-3 rounded-full bg-gradient-to-br from-[#122b1e] to-[#1f4933] border-2 border-[#d4af37] shadow-lg flex items-center justify-center text-[#d4af37] font-cinzel text-base font-bold tracking-widest">
              O & T
            </div>
            <p className="font-garamond italic text-xl text-[#122b1e]">
              "Nuestro mejor regalo es tu grata presencia"
            </p>
          </div>

          {/* Explanation Text */}
          <div className="space-y-4">
            <p className="text-base text-[#38433a] leading-relaxed font-garamond text-lg">
              Para nosotros, su compañía, amor y bendición en este día tan soñado es el regalo más valioso e importante.
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#122b1e] text-[#d4af37] font-cinzel text-sm font-semibold tracking-wide border border-[#d4af37]/60 shadow-md">
              <Mail className="w-4 h-4 text-[#d4af37]" />
              <span>Lluvia de Sobres</span>
            </div>

            <p className="text-sm text-[#4e5b51] leading-relaxed max-w-md mx-auto">
              Si desean tener un presente o detalle con nosotros para el inicio de nuestro nuevo hogar, contaremos con un sobre y buzón especial en la recepción el día de la boda.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-full bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] font-cinzel text-xs font-semibold tracking-wider uppercase transition-colors shadow-md hover:shadow-lg border border-[#d4af37]"
            >
              Comprendido, ¡Muchas Gracias!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

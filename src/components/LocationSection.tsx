import React from 'react';
import { MapPin, Navigation, Car, ExternalLink, Compass } from 'lucide-react';
import churchImage from '../assets/images/parroquia.jpg';

export const LocationSection: React.FC = () => {
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=Parroquia+San+Francisco+de+Asis+San+Francisco+Antioquia';
  const wazeUrl = 'https://waze.com/ul?q=Parroquia+San+Francisco+de+Asis+San+Francisco+Antioquia';

  return (
    <section id="ubicacion" className="w-full max-w-5xl mx-auto py-16 px-4">
      <div className="text-center mb-10">
        <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Lugar de la Ceremonia
        </span>
        <h3 className="font-garamond italic text-3xl md:text-5xl text-[#122b1e] mt-1">
          Parroquia San Francisco de Asís
        </h3>
        <p className="font-garamond text-base md:text-lg text-[#47574b] max-w-xl mx-auto mt-2 italic">
          San Francisco, Antioquia, Colombia · Parque Principal
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#faf7f0] rounded-3xl overflow-hidden border-2 border-[#d4af37]/40 shadow-xl">
        {/* Church Image (6 cols) */}
        <div className="lg:col-span-6 relative h-72 lg:h-[420px] overflow-hidden">
          <img
            src={churchImage}
            alt="Parroquia San Francisco de Asís"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-6">
            <div className="text-white">
              <span className="text-xs uppercase tracking-widest text-[#d4af37] font-cinzel font-semibold">
                San Francisco, Antioquia
              </span>
              <h4 className="font-garamond text-2xl font-bold text-[#faf7f0]">
                Parroquia San Francisco de Asís
              </h4>
            </div>
          </div>
        </div>

        {/* Details & Map Action (6 cols) */}
        <div className="lg:col-span-6 p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[#122b1e]">
              <MapPin className="w-5 h-5 text-[#b8860b]" />
              <span className="font-cinzel text-sm uppercase tracking-wider font-bold">
                Dirección y Referencia
              </span>
            </div>
            <p className="text-sm md:text-base text-[#38433a] leading-relaxed">
              La ceremonia religiosa se oficiará en el templo principal de San Francisco, ubicado en el marco de la plaza central. Es un templo colonial hermoso y lleno de calidez.
            </p>
          </div>

          <div className="bg-[#f0e9dc] p-4 rounded-2xl border border-[#d8cdb8] space-y-2.5 text-xs sm:text-sm text-[#273229]">
            <div className="flex items-start gap-2.5">
              <Car className="w-4 h-4 text-[#122b1e] shrink-0 mt-0.5" />
              <div>
                <strong>Cómo Llegar desde Medellín / Rionegro:</strong>
                <p className="text-[#556257] mt-0.5">
                  Tomar la autopista Medellín-Bogotá hacia el oriente antioqueño, desviando por la entrada principal hacia el municipio de San Francisco.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#d8cdb8]">
              <Compass className="w-4 h-4 text-[#122b1e] shrink-0 mt-0.5" />
              <div>
                <strong>Recomendación de llegada:</strong>
                <p className="text-[#556257] mt-0.5">
                  Sugerimos llegar con 20 minutos de anticipación (6:40 pm) para tomar asiento con serenidad y disponerse a compartir la bendición matrimonial.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons for Maps */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-lg border border-[#d4af37]"
            >
              <Navigation className="w-4 h-4 text-[#d4af37]" />
              <span>Abrir en Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>

            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#faf7f0] hover:bg-[#f4ede0] text-[#122b1e] font-cinzel text-xs font-bold uppercase tracking-wider transition-all border border-[#d4af37] shadow-sm hover:shadow"
            >
              <Car className="w-4 h-4 text-[#122b1e]" />
              <span>Navegar con Waze</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

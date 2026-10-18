import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, Pause, Play } from 'lucide-react';
import { CarouselPhoto } from '../types';

import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.jpg';
import image3 from '../assets/images/image3.jpg';
import principalImg from '../assets/images/principal.png';
import parroquiaImg from '../assets/images/parroquia.jpg';

const photos: CarouselPhoto[] = [
  {
    id: '1',
    src: image3,
    title: 'Juntos en el Camino',
    description: 'Cada viaje, sonrisa y momento compartido nos trajo hasta este gran sueño.',
  },
  {
    id: '2',
    src: image1,
    title: 'Cómplices de Vida',
    description: 'Risas cómplices y un amor sincero que crece cada día con la bendición de Dios.',
  },
  {
    id: '3',
    src: image2,
    title: 'Un Amor para Siempre',
    description: 'Ese abrazo cálido, sincero y protector que promete acompañarnos toda la vida.',
  },
  {
    id: '4',
    src: principalImg,
    title: 'Oscar & Tatiana · Nuestra Boda',
    description: 'Nuestra promesa de amor eterno ante Dios y nuestros seres queridos.',
  },
  {
    id: '5',
    src: parroquiaImg,
    title: 'Parroquia San Francisco de Asís',
    description: 'El sagrado altar donde recibiremos el sacramento en San Francisco, Antioquia.',
  },
];

export const PhotoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<CarouselPhoto | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isAutoplay && !lightboxImage) {
      timerRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % photos.length);
      }, 5000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, lightboxImage]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Nuestros Momentos
        </span>
        <h3 className="font-garamond italic text-3xl md:text-5xl text-[#122b1e] mt-1">
          Galería de Oscar & Tatiana
        </h3>
        <p className="font-garamond text-base md:text-lg text-[#47574b] max-w-xl mx-auto mt-2 italic">
          Instantes de complicidad, risas y amor que nos conducen al día más feliz de nuestras vidas.
        </p>
      </div>

      {/* Main Carousel Card with Uniform Invitation Frame */}
      <div className="relative rounded-3xl overflow-hidden bg-[#122b1e] border-2 border-[#d4af37]/60 shadow-2xl">
        <div className="relative h-[440px] sm:h-[520px] md:h-[580px] w-full overflow-hidden bg-[#08140e] flex items-center justify-center p-2 sm:p-4">
          {/* Ambient Blurred Background (fills frame smoothly without letterbox harshness) */}
          <img
            key={`blur-${currentIndex}`}
            src={photos[currentIndex].src}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover blur-2xl opacity-30 scale-110 pointer-events-none transition-all duration-700"
          />

          {/* Sharp Foreground Photo (Guaranteed 100% Uncut and Centered) */}
          <img
            key={`main-${currentIndex}`}
            src={photos[currentIndex].src}
            alt={photos[currentIndex].title}
            referrerPolicy="no-referrer"
            className="relative z-10 max-h-full max-w-full w-auto h-auto object-contain mx-auto rounded-xl shadow-2xl transition-all duration-500 ease-out"
          />

          {/* Discreet Scrim for Caption Readability */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 sm:p-6 z-20 flex flex-col justify-end text-white pointer-events-none">
            <span className="text-[10px] sm:text-[11px] font-cinzel text-[#d4af37] tracking-widest uppercase font-semibold">
              Foto {currentIndex + 1} de {photos.length}
            </span>
            <h4 className="font-garamond text-xl sm:text-2xl md:text-3xl text-[#faf7f0] font-normal mt-0.5 leading-tight">
              {photos[currentIndex].title}
            </h4>
            <p className="font-garamond italic text-xs sm:text-sm md:text-base text-[#e8decb]/90 max-w-2xl mt-0.5">
              "{photos[currentIndex].description}"
            </p>
          </div>

          {/* Zoom Lightbox Trigger */}
          <button
            onClick={() => setLightboxImage(photos[currentIndex])}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-[#122b1e] text-white border border-[#d4af37]/60 backdrop-blur-sm transition-all cursor-pointer shadow-lg hover:scale-105"
            title="Ver imagen en tamaño completo"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-[#122b1e] text-[#faf7f0] border border-[#d4af37]/60 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
            title="Foto anterior"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/50 hover:bg-[#122b1e] text-[#faf7f0] border border-[#d4af37]/60 backdrop-blur-sm transition-all hover:scale-105 cursor-pointer shadow-xl"
            title="Siguiente foto"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Thumbnail & Autoplay Bar */}
        <div className="bg-[#0e2218] p-3 sm:p-4 border-t border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-3">
          {/* Thumbnails */}
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            {photos.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  currentIndex === idx
                    ? 'border-[#d4af37] ring-2 ring-[#d4af37]/50 scale-105 opacity-100'
                    : 'border-white/20 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top sm:object-center"
                />
              </button>
            ))}
          </div>

          {/* Autoplay Toggle */}
          <button
            onClick={() => setIsAutoplay(!isAutoplay)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1a3827] hover:bg-[#254f37] text-xs text-[#faf7f0] font-cinzel transition-colors border border-[#d4af37]/40 cursor-pointer shadow-sm"
          >
            {isAutoplay ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Reproducir</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImage.src}
              alt={lightboxImage.title}
              referrerPolicy="no-referrer"
              className="max-h-[75vh] w-auto max-w-full rounded-2xl border-2 border-[#d4af37]/60 shadow-2xl object-contain"
            />
            <div className="text-center mt-3 text-white">
              <h5 className="font-garamond text-2xl text-[#faf7f0]">{lightboxImage.title}</h5>
              <p className="font-garamond italic text-sm text-[#e8decb]">{lightboxImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

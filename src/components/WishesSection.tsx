import React, { useState, useEffect } from 'react';
import { Heart, Send, User, Sparkles, Download, PenTool, Trash2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { WeddingWish } from '../types';
import { exportWishesToPDF } from '../utils/pdfGenerator';

const STORAGE_KEY = 'wedding_wishes_final';

export const WishesSection: React.FC = () => {
  // Clear any legacy test messages immediately on initial mount
  const [wishes, setWishes] = useState<WeddingWish[]>(() => {
    try {
      localStorage.removeItem('wedding_wishes');
      localStorage.removeItem('wedding_wishes_real');
      localStorage.removeItem('wedding_wishes_test');

      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Error reading wedding wishes:', e);
    }
    // Clean initial state as requested: "no pongas aun ningun deseo porque nadie ha escrito nada aun"
    return [];
  });

  const [author, setAuthor] = useState('');
  const [relationship, setRelationship] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
    } catch (e) {
      console.error('Error saving wedding wishes:', e);
    }
  }, [wishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !message.trim()) return;

    const newWish: WeddingWish = {
      id: Date.now().toString(),
      author: author.trim(),
      relationship: relationship.trim() || 'Familiar / Amigo',
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('es-CO', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    setWishes((prev) => [newWish, ...prev]);
    setAuthor('');
    setRelationship('');
    setMessage('');
    setIsSuccess(true);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#122b1e', '#d4af37', '#e8decb'],
      });
    } catch {}

    setTimeout(() => setIsSuccess(false), 4000);
  };

  const handleDownloadPDF = () => {
    exportWishesToPDF(wishes);
  };

  const handleClearAllWishes = () => {
    setWishes([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('wedding_wishes');
      localStorage.removeItem('wedding_wishes_real');
    } catch {}
    setShowClearConfirm(false);
  };

  return (
    <section id="buenos-deseos" className="w-full max-w-5xl mx-auto py-16 px-4">
      {/* Title */}
      <div className="text-center mb-10">
        <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Libro de Recuerdos
        </span>
        <h3 className="font-garamond italic text-3xl md:text-5xl text-[#122b1e] mt-1">
          Buenos Deseos para los Novios
        </h3>
        <p className="font-garamond text-base md:text-lg text-[#47574b] max-w-2xl mx-auto mt-2 italic">
          Dejen aquí sus palabras de cariño, bendiciones y consejos para Oscar & Tatiana. Al finalizar el día de la boda, los novios podrán descargar todas las dedicatorias en un hermoso PDF decorativo.
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] border-2 border-[#d4af37] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#d4af37]" />
            <span>Descargar Libro en PDF Decorado ({wishes.length})</span>
          </button>

          {wishes.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-red-50 hover:bg-red-100 text-red-800 border border-red-300 font-cinzel text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              title="Limpiar mensajes de prueba"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-600" />
              <span>Limpiar Mensajes de Prueba</span>
            </button>
          )}
        </div>

        {/* Clear Confirmation Prompt */}
        {showClearConfirm && (
          <div className="mt-4 p-4 max-w-md mx-auto bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-2">
            <p className="text-xs text-amber-900 font-medium">
              ¿Deseas vaciar todos los mensajes de prueba del libro de deseos?
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={handleClearAllWishes}
                className="px-4 py-1.5 rounded-lg bg-red-700 text-white text-xs font-semibold hover:bg-red-800 cursor-pointer"
              >
                Sí, limpiar ahora
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1.5 rounded-lg bg-gray-200 text-gray-800 text-xs font-semibold hover:bg-gray-300 cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#faf7f0] rounded-3xl p-6 sm:p-7 border-2 border-[#d4af37]/50 shadow-xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            <h4 className="font-cinzel text-sm uppercase tracking-wider font-bold text-[#122b1e]">
              Escribir una Dedicatoria
            </h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1">
                Tu Nombre y Apellido *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8a998e] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Carolina Gómez"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e] text-[#1e2820]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1">
                Parentesco o Ciudad
              </label>
              <input
                type="text"
                placeholder="Ej. Prima de la Novia / Medellín"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e] text-[#1e2820]"
              />
            </div>

            <div>
              <label className="block text-xs font-cinzel uppercase font-semibold text-[#122b1e] tracking-wider mb-1">
                Tus Palabras de Bendición *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Escribe tu dedicatoria especial para Oscar y Tatiana..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#d8cdb8] bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#122b1e] text-[#1e2820]"
              />
            </div>

            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-medium text-center">
                ✨ ¡Tu deseo se agregó al libro con mucho amor!
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] font-cinzel text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 border border-[#d4af37] cursor-pointer"
            >
              <Heart className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
              <span>Publicar en el Libro de Deseos</span>
            </button>
          </form>
        </div>

        {/* Wishes List Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4 max-h-[620px] overflow-y-auto pr-1">
          {wishes.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-dashed border-[#d4af37]/40 text-center space-y-3 shadow-sm">
              <div className="w-14 h-14 mx-auto rounded-full bg-[#faf7f0] border-2 border-[#d4af37] flex items-center justify-center text-[#122b1e] shadow-md">
                <PenTool className="w-7 h-7 text-[#b8860b]" />
              </div>
              <h5 className="font-garamond text-2xl md:text-3xl font-semibold text-[#122b1e]">
                Aún no hay dedicatorias escritas
              </h5>
              <p className="font-garamond italic text-sm md:text-base text-[#647266] max-w-md mx-auto leading-relaxed">
                El libro de recuerdos se encuentra listo y limpio para los invitados. Sé la primera persona en escribir unas hermosas palabras de bendición para Oscar y Tatiana en este libro virtual.
              </p>
            </div>
          ) : (
            wishes.map((w) => (
              <div
                key={w.id}
                className="relative bg-white rounded-2xl p-5 border border-[#e2d8c6] shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#122b1e] rounded-l-2xl" />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-garamond text-lg font-bold text-[#122b1e]">
                      {w.author}
                    </h5>
                    {w.relationship && (
                      <span className="text-xs font-cinzel uppercase tracking-wider text-[#a3792c]">
                        {w.relationship}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#859288] shrink-0 font-medium">
                    {w.createdAt}
                  </span>
                </div>
                <p className="font-garamond italic text-sm md:text-base text-[#39463c] mt-2.5 leading-relaxed">
                  "{w.message}"
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

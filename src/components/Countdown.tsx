import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Download } from 'lucide-react';

export const Countdown: React.FC = () => {
  // Wedding target: Dec 19, 2026 19:00:00 GMT-0500 (Colombia Time)
  const targetDate = new Date('2026-12-19T19:00:00-05:00').getTime();

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPassed: false,
  });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPassed: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPassed: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleGoogleCalendar = () => {
    const title = encodeURIComponent('Nuestra Boda · Oscar Londoño & Tatiana Giraldo');
    const details = encodeURIComponent(
      'Celebración del matrimonio de Oscar y Tatiana.\nParroquia San Francisco de Asís, San Francisco, Antioquia, Colombia.\nHora: 7:00 PM.'
    );
    const location = encodeURIComponent('Parroquia San Francisco de Asís, San Francisco, Antioquia, Colombia');
    // 20261219T190000 to 20261220T030000 in UTC (Colombia is UTC-5 -> 19:00 COT is 00:00 UTC next day, so 20261220T000000Z)
    const dates = '20261220T000000Z/20261220T080000Z';
    const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dates}&details=${details}&location=${location}`;
    window.open(gCalUrl, '_blank');
  };

  const handleDownloadICS = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Oscar y Tatiana//Nuestra Boda//ES',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'SUMMARY:Nuestra Boda · Oscar Londoño y Tatiana Giraldo',
      'DESCRIPTION:Celebración del matrimonio de Oscar Londoño y Tatiana Giraldo en la Parroquia San Francisco de Asís, San Francisco, Antioquia.',
      'LOCATION:Parroquia San Francisco de Asís, San Francisco, Antioquia, Colombia',
      'DTSTART:20261220T000000Z',
      'DTEND:20261220T080000Z',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Boda_Oscar_y_Tatiana.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      <div className="text-center mb-6">
        <span className="text-xs font-cinzel uppercase tracking-[0.25em] text-[#d4af37] font-semibold">
          Cuenta Regresiva
        </span>
        <h3 className="font-garamond italic text-3xl md:text-4xl text-[#122b1e] mt-1">
          Falta muy poco para el gran día
        </h3>
      </div>

      {/* Counter Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 max-w-2xl mx-auto">
        {[
          { label: 'Días', value: timeLeft.days },
          { label: 'Horas', value: timeLeft.hours },
          { label: 'Minutos', value: timeLeft.minutes },
          { label: 'Segundos', value: timeLeft.seconds },
        ].map((item, idx) => (
          <div
            key={idx}
            className="bg-[#122b1e] rounded-xl sm:rounded-2xl p-3 sm:p-5 border border-[#d4af37]/40 shadow-xl text-center transform transition-transform hover:-translate-y-1"
          >
            <div className="font-cinzel text-2xl sm:text-4xl md:text-5xl font-bold text-[#faf7f0] tabular-nums tracking-tight">
              {String(item.value).padStart(2, '0')}
            </div>
            <div className="text-[10px] sm:text-xs font-medium tracking-widest uppercase text-[#d4af37] mt-1 sm:mt-2">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      {/* Calendar buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8">
        <button
          onClick={handleGoogleCalendar}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#faf7f0] hover:bg-[#f4ede0] text-[#122b1e] border border-[#d4af37] text-xs font-semibold uppercase tracking-wider font-cinzel transition-all shadow-sm hover:shadow"
        >
          <Calendar className="w-4 h-4 text-[#d4af37]" />
          <span>Guardar en Google Calendar</span>
        </button>

        <button
          onClick={handleDownloadICS}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#122b1e] hover:bg-[#1a3d2b] text-[#faf7f0] border border-[#d4af37]/60 text-xs font-semibold uppercase tracking-wider font-cinzel transition-all shadow-md hover:shadow-lg"
        >
          <Download className="w-4 h-4 text-[#d4af37]" />
          <span>Descargar Evento (.ics / Apple)</span>
        </button>
      </div>
    </div>
  );
};

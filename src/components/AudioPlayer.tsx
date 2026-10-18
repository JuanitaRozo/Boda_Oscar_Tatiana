import React, { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music, Upload, ChevronUp, ChevronDown, Video, RefreshCw, CheckCircle2 } from 'lucide-react';

export interface AudioPlayerRef {
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
  isPlaying: boolean;
}

interface AudioPlayerProps {
  onAutoPlayAttempt?: () => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const DB_NAME = 'WeddingAudioDB';
const STORE_NAME = 'audioStore';

function getStoredAudio(): Promise<Blob | null> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const getReq = store.get('customSong');
        getReq.onsuccess = () => resolve(getReq.result || null);
        getReq.onerror = () => resolve(null);
      };
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function storeAudio(blob: Blob): Promise<void> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore(STORE_NAME);
      };
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(blob, 'customSong');
        tx.oncomplete = () => resolve();
        tx.onerror = () => resolve();
      };
      request.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

function clearStoredAudio(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, 1);
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete('customSong');
        tx.oncomplete = () => resolve();
      };
    } catch {
      resolve();
    }
  });
}

export const AudioPlayer = forwardRef<AudioPlayerRef, AudioPlayerProps>((_, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [activeSource, setActiveSource] = useState<'youtube' | 'local'>('youtube');
  const [trackTitle, setTrackTitle] = useState('Par de Anillos');
  const [artistName, setArtistName] = useState('Grupo Viento y Sol');
  const [hasCustomLocalAudio, setHasCustomLocalAudio] = useState(false);
  const [hasUserStarted, setHasUserStarted] = useState(false);
  const [uploadNotification, setUploadNotification] = useState<string | null>(null);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);
  const ytPlayerRef = useRef<any>(null);
  const isYtReadyRef = useRef<boolean>(false);
  const pendingPlayRef = useRef<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // 1. Check for stored audio in IndexedDB on mount
  useEffect(() => {
    getStoredAudio().then((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0.8;
        localAudioRef.current = audio;
        setHasCustomLocalAudio(true);
        setActiveSource('local');
        setTrackTitle('Par de Anillos (Archivo MP3)');
      }
    });
  }, []);

  // 2. Initialize YouTube Iframe API for Grupo Viento y Sol - Par de Anillos (-L84SW0yrbI)
  useEffect(() => {
    const initYT = () => {
      if (window.YT && window.YT.Player && !ytPlayerRef.current) {
        try {
          ytPlayerRef.current = new window.YT.Player('yt-wedding-audio-frame', {
            height: '200',
            width: '100%',
            videoId: '-L84SW0yrbI',
            playerVars: {
              autoplay: 0,
              controls: 1,
              loop: 1,
              playlist: '-L84SW0yrbI',
              playsinline: 1,
              rel: 0,
              modestbranding: 1,
            },
            events: {
              onReady: (event: any) => {
                isYtReadyRef.current = true;
                event.target.setVolume(85);
                if (pendingPlayRef.current) {
                  event.target.playVideo();
                  pendingPlayRef.current = false;
                  setIsPlaying(true);
                  setHasUserStarted(true);
                }
              },
              onStateChange: (event: any) => {
                // YT.PlayerState.PLAYING is 1, PAUSED is 2, ENDED is 0
                if (event.data === 1) {
                  setIsPlaying(true);
                  setHasUserStarted(true);
                } else if (event.data === 2 || event.data === 0) {
                  setIsPlaying(false);
                }
              },
            },
          });
        } catch (err) {
          console.error('Error creating YT player:', err);
        }
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = initYT;
    } else {
      initYT();
    }

    return () => {
      try {
        ytPlayerRef.current?.destroy();
      } catch {}
    };
  }, []);

  // 3. Play / Pause Control
  const playAudio = async () => {
    setHasUserStarted(true);

    if (activeSource === 'local' && localAudioRef.current) {
      try {
        await localAudioRef.current.play();
        setIsPlaying(true);
        return;
      } catch (err) {
        console.log('Local audio play error, falling back to YouTube:', err);
      }
    }

    // Default or fallback to YouTube
    if (isYtReadyRef.current && ytPlayerRef.current?.playVideo) {
      try {
        ytPlayerRef.current.playVideo();
        setIsPlaying(true);
      } catch (err) {
        console.error('YouTube playVideo failed:', err);
      }
    } else {
      pendingPlayRef.current = true;
    }
  };

  const pauseAudio = () => {
    if (activeSource === 'local' && localAudioRef.current) {
      localAudioRef.current.pause();
    }
    if (isYtReadyRef.current && ytPlayerRef.current?.pauseVideo) {
      ytPlayerRef.current.pauseVideo();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  useImperativeHandle(ref, () => ({
    play: playAudio,
    pause: pauseAudio,
    toggle: togglePlay,
    get isPlaying() {
      return isPlaying;
    },
  }));

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    if (activeSource === 'local' && localAudioRef.current) {
      localAudioRef.current.muted = nextMuted;
    }
    if (isYtReadyRef.current && ytPlayerRef.current) {
      if (nextMuted) {
        ytPlayerRef.current.mute();
      } else {
        ytPlayerRef.current.unMute();
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Pause current YouTube player
        if (ytPlayerRef.current?.pauseVideo) {
          ytPlayerRef.current.pauseVideo();
        }

        await storeAudio(file);
        const url = URL.createObjectURL(file);
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0.85;

        audio.onplay = () => setIsPlaying(true);
        audio.onpause = () => setIsPlaying(false);

        localAudioRef.current = audio;
        setHasCustomLocalAudio(true);
        setActiveSource('local');
        setTrackTitle(file.name.replace(/\.[^/.]+$/, ''));
        setArtistName('Grupo Viento y Sol');

        await audio.play();
        setIsPlaying(true);
        setHasUserStarted(true);

        setUploadNotification('¡Archivo MP3 cargado y guardado exitosamente!');
        setTimeout(() => setUploadNotification(null), 4000);
      } catch (err) {
        console.error('Failed to load local audio:', err);
      }
    }
  };

  const switchToYouTube = () => {
    if (localAudioRef.current) {
      localAudioRef.current.pause();
    }
    clearStoredAudio();
    setHasCustomLocalAudio(false);
    setActiveSource('youtube');
    setTrackTitle('Par de Anillos');
    setArtistName('Grupo Viento y Sol');
    if (isYtReadyRef.current && ytPlayerRef.current) {
      ytPlayerRef.current.playVideo();
      setIsPlaying(true);
    }
  };

  return (
    <>
      {/* Hidden / Visible YouTube Iframe Container */}
      <div
        className={
          showVideo
            ? 'fixed bottom-24 right-5 z-50 w-80 sm:w-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-[#d4af37] bg-black transition-all'
            : 'fixed -bottom-40 -right-40 w-10 h-10 opacity-0 pointer-events-none'
        }
      >
        {showVideo && (
          <div className="bg-[#122b1e] px-3 py-2 flex items-center justify-between border-b border-[#d4af37]/40 text-xs text-[#faf7f0]">
            <span className="font-cinzel text-[#d4af37] font-semibold flex items-center gap-1.5">
              <Video className="w-3.5 h-3.5" /> Video Musical Oficial
            </span>
            <button
              onClick={() => setShowVideo(false)}
              className="text-[#e8decb] hover:text-[#d4af37] text-xs px-2 py-0.5 rounded cursor-pointer"
            >
              Minimizar
            </button>
          </div>
        )}
        <div id="yt-wedding-audio-frame" className="w-full h-48 bg-black"></div>
      </div>

      {/* Floating Audio Controller */}
      <div className="fixed bottom-5 right-5 z-50">
        <div className="bg-[#122b1e]/95 backdrop-blur-md text-[#faf7f0] border border-[#d4af37]/60 rounded-2xl shadow-2xl p-2.5 transition-all duration-300 max-w-xs md:max-w-sm">
          <div className="flex items-center gap-3">
            {/* Spinning Golden Vinyl Ring Button */}
            <button
              onClick={togglePlay}
              title={isPlaying ? 'Pausar música' : 'Reproducir música'}
              className="relative w-11 h-11 rounded-full bg-gradient-to-tr from-[#0a1811] via-[#1f4933] to-[#2d5a3e] border-2 border-[#d4af37] flex items-center justify-center shrink-0 shadow-md group cursor-pointer overflow-hidden"
            >
              <div
                className={`absolute inset-0 rounded-full border border-dashed border-[#d4af37]/70 ${
                  isPlaying ? 'animate-spin-slow' : ''
                }`}
              />
              {isPlaying ? (
                <Pause className="w-4 h-4 text-[#d4af37] relative z-10" />
              ) : (
                <Play className="w-4 h-4 text-[#d4af37] relative z-10 translate-x-0.5" />
              )}
            </button>

            {/* Song Info */}
            <div className="min-w-0 flex-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-[#d4af37] font-cinzel font-semibold">
                  Canción de los novios
                </span>
                {isPlaying && (
                  <span className="flex gap-0.5 items-end h-2.5">
                    <span className="w-0.5 h-2.5 bg-[#d4af37] animate-pulse"></span>
                    <span className="w-0.5 h-1.5 bg-[#d4af37] animate-pulse delay-75"></span>
                    <span className="w-0.5 h-3 bg-[#d4af37] animate-pulse delay-150"></span>
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[#faf7f0] truncate">{trackTitle}</p>
              <p className="text-[11px] text-[#d4af37]/90 truncate font-garamond italic">
                {artistName} · "Ese par de anillos..."
              </p>
            </div>

            {/* Right Action Icons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={toggleMute}
                className="p-1.5 text-[#e8decb] hover:text-[#d4af37] transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                title={isMuted ? 'Activar sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-[#e8decb] hover:text-[#d4af37] transition-colors rounded-lg hover:bg-white/10 cursor-pointer"
                title="Ver letra y opciones"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Expanded Drawer for lyrics, video toggle and custom MP3 */}
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-[#d4af37]/30 text-xs text-[#faf7f0] space-y-2.5">
              {uploadNotification && (
                <div className="flex items-center gap-2 bg-[#2e6844] text-[#faf7f0] px-2.5 py-1.5 rounded-lg text-xs font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#9ff0ba]" />
                  <span>{uploadNotification}</span>
                </div>
              )}

              {/* Lyrics Card */}
              <div className="bg-[#0c1d14] rounded-xl p-3 border border-[#1f4933] space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] text-[#d4af37] font-cinzel uppercase font-semibold">
                    Letra: Par de Anillos
                  </p>
                  <span className="text-[10px] text-[#a1b4a6]">Grupo Viento y Sol</span>
                </div>
                <p className="font-garamond italic text-[#f4ede0] leading-relaxed text-xs">
                  «Te amaré hasta que la muerte nos separe... Entraremos a la iglesia para ser al fin tu dueño.
                  Llevarás vestido blanco y flores entre tus manos... Ese par de anillos con nuestros nombres grabados.»
                </p>
              </div>

              {/* Source & Video Controls */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  onClick={() => setShowVideo(!showVideo)}
                  className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1f4933] hover:bg-[#2d5a3e] text-[#faf7f0] text-[11px] rounded-lg transition-colors border border-[#d4af37]/40"
                >
                  <Video className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>{showVideo ? 'Ocultar video' : 'Ver video musical'}</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <label
                    htmlFor="wedding-music-upload"
                    className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#122b1e] hover:bg-[#1a3d2b] text-[#d4af37] text-[11px] rounded-lg transition-colors border border-[#d4af37]/40"
                    title="Cargar tu propio archivo MP3"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Cargar MP3</span>
                  </label>
                  <input
                    id="wedding-music-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {hasCustomLocalAudio && (
                    <button
                      onClick={switchToYouTube}
                      className="p-1.5 text-[#e8decb] hover:text-[#d4af37] rounded-lg border border-[#d4af37]/30"
                      title="Volver a versión original de YouTube"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gentle First-Time Audio Invitation Toast if not started */}
        {!hasUserStarted && !isPlaying && (
          <button
            onClick={togglePlay}
            className="cursor-pointer absolute -top-12 right-0 bg-[#faf7f0] text-[#122b1e] border border-[#d4af37] shadow-xl text-xs py-1.5 px-3 rounded-full flex items-center gap-2 animate-bounce whitespace-nowrap"
          >
            <Music className="w-3.5 h-3.5 text-[#d4af37]" />
            <span className="font-medium">Toca aquí para escuchar «Par de Anillos»</span>
          </button>
        )}
      </div>
    </>
  );
});

AudioPlayer.displayName = 'AudioPlayer';

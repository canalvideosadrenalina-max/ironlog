"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const router = useRouter();
  const introAudioRef = useRef<HTMLAudioElement>(null);
  const ambientAudioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioStartedRef = useRef(false);
  const [isMuted, setIsMuted] = useState(false);

  const syncMuted = (muted: boolean) => {
    if (introAudioRef.current) introAudioRef.current.muted = muted;
    if (ambientAudioRef.current) ambientAudioRef.current.muted = muted;
  };

  const startAudios = () => {
    if (audioStartedRef.current) return;

    introAudioRef.current?.play().catch(() => {});
    ambientAudioRef.current?.play().catch(() => {});
    audioStartedRef.current = true;
  };

  useEffect(() => {
    if (ambientAudioRef.current) {
      ambientAudioRef.current.volume = 0.4;
    }
  }, []);

  useEffect(() => {
    syncMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    const handleFirstInteraction = () => startAudios();

    document.addEventListener("click", handleFirstInteraction, { once: true });
    document.addEventListener("touchstart", handleFirstInteraction, {
      once: true,
    });

    return () => {
      document.removeEventListener("click", handleFirstInteraction);
      document.removeEventListener("touchstart", handleFirstInteraction);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    syncMuted(nextMuted);
    startAudios();
  };

  return (
    <>
      <style>{`
        @keyframes logo-impact {
          from {
            transform: scale(1.5);
            opacity: 0.85;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes flash-orange {
          0% {
            opacity: 0.55;
          }
          100% {
            opacity: 0;
          }
        }

        @keyframes glow-pulse {
          0%, 100% {
            text-shadow: 0 0 12px rgba(255, 107, 0, 0.25);
          }
          50% {
            text-shadow: 0 0 30px #FF6B00;
          }
        }

        @keyframes slogan-fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes button-slide-up {
          from {
            opacity: 0;
            transform: translateY(28px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .logo-impact {
          animation: logo-impact 0.5s ease-out forwards;
        }

        .logo-glow {
          animation: glow-pulse 2s ease-in-out infinite;
          animation-delay: 0.5s;
        }

        .flash-orange {
          animation: flash-orange 0.3s ease-out forwards;
        }

        .slogan-enter {
          opacity: 0;
          animation: slogan-fade-in 0.6s ease-out forwards;
          animation-delay: 0.6s;
        }

        .subtitle-enter {
          opacity: 0;
          animation: slogan-fade-in 0.6s ease-out forwards;
          animation-delay: 0.8s;
        }

        .button-enter {
          opacity: 0;
          animation: button-slide-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          animation-delay: 1s;
        }
      `}</style>

      <audio ref={introAudioRef} src="/videos/intro.mp4" preload="auto" />
      <audio ref={ambientAudioRef} src="/audio/ambient.mp3" loop preload="auto" />

      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Ativar som" : "Desativar som"}
        className="fixed right-4 top-4 z-30 flex h-11 w-11 items-center justify-center rounded-full border border-iron-primary bg-iron-secondary text-lg transition-opacity hover:opacity-90 active:scale-95"
      >
        {isMuted ? "🔇" : "🔊"}
      </button>

      <footer
        className="fixed bottom-4 left-0 z-20 tracking-widest text-iron-primary opacity-70"
        style={{
          fontSize: "10px",
          textAlign: "center",
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          padding: "0 16px",
        }}
      >
        Criado por Romualdo Barcelos | CYNIX Technology | Brasil
      </footer>

      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-iron-bg px-6">
        <video
          ref={videoRef}
          src="/videos/intro.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => videoRef.current?.pause()}
          className="pointer-events-none absolute z-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        />

        {/* Textura de grade metálica */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 107, 0, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 107, 0, 0.08) 1px, transparent 1px),
              linear-gradient(rgba(42, 42, 42, 0.6) 1px, transparent 1px),
              linear-gradient(90deg, rgba(42, 42, 42, 0.6) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
          }}
          aria-hidden="true"
        />

        {/* Flash laranja no impacto */}
        <div
          className="flash-orange pointer-events-none absolute inset-0 z-[1] bg-[#FF6B00]"
          aria-hidden="true"
        />

        {/* Vinheta industrial */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-transparent via-transparent to-black/60"
          aria-hidden="true"
        />

        {/* Logo IRONLOG de fundo */}
        <div
          className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center"
          aria-hidden="true"
        >
          <p
            className="select-none text-center font-black uppercase leading-none tracking-tighter text-white/10"
            style={{ fontSize: "15vw" }}
          >
            IRON
            <span className="text-iron-primary/10">LOG</span>
          </p>
        </div>

        {/* Header — logo marca */}
        <h1 className="logo-impact logo-glow fixed left-1/2 top-6 z-10 -translate-x-1/2 font-black uppercase leading-none tracking-tighter">
          <span className="text-[2rem] text-white">IRON</span>
          <span className="text-[2rem] text-iron-primary">LOG</span>
        </h1>

        {/* Centro — slogan e CTA */}
        <div className="relative z-10 flex w-full max-w-5xl flex-col items-center px-6 text-center">
          <h2 className="slogan-enter logo-glow font-black uppercase leading-tight tracking-tight text-[4rem] text-white">
            Forje seu limite
          </h2>

          <p className="subtitle-enter mt-4 text-[1rem] font-semibold text-iron-primary">
            Inicie seu treino agora
          </p>

          <button
            type="button"
            onClick={() => router.push("/auth")}
            className="button-enter group relative mt-8 w-full overflow-hidden border-2 border-iron-primary bg-iron-primary px-10 py-4 text-sm font-black uppercase tracking-widest text-black transition-all duration-200 hover:bg-transparent hover:text-iron-primary active:scale-95 sm:mt-10 sm:w-auto"
          >
            <span className="relative z-10">Começar treino</span>
            <span
              className="absolute inset-0 -translate-x-full bg-white/10 transition-transform duration-300 group-hover:translate-x-0"
              aria-hidden="true"
            />
          </button>
        </div>
      </main>
    </>
  );
}

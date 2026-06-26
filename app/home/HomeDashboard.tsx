"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import BottomNav from "@/components/BottomNav";
import AcademyBanner from "@/components/AcademyBanner";
import {
  SHEET_ORDER,
  WORKOUT_SHEETS,
  formatVolumeKg,
  formatWorkoutDate,
  getFirstName,
  getTimeGreeting,
  getTodayWorkout,
  type LastWorkoutSummary,
  type WorkoutSheetId,
} from "@/lib/workouts";

type HomeDashboardProps = {
  userName: string;
  streakDays: number;
  lastWorkout: LastWorkoutSummary;
};

const CARD_BORDER = "border border-[rgba(255,107,0,0.4)]";

function CardTopAccent() {
  return <div className="absolute inset-x-0 top-0 h-1 bg-[#FF6B00]" aria-hidden="true" />;
}

function StandardCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${CARD_BORDER} bg-[rgba(255,255,255,0.08)] ${className}`}
    >
      <CardTopAccent />
      {children}
    </div>
  );
}

const SHEET_MUSCLE_ICONS: Record<WorkoutSheetId, React.ReactNode> = {
  A: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 11h14M8 11v6M16 11v6M8 17h8" />
    </>
  ),
  B: (
    <>
      <path d="M6 8c2-2 10-2 12 0M6 16c2 2 10 2 12 0" />
      <path d="M12 8v8" />
      <path d="M9 12h6" />
    </>
  ),
  C: (
    <>
      <path d="M9 6v12M15 6v12" />
      <path d="M7 10h10M7 18h10" />
      <path d="M12 6V4" />
    </>
  ),
  D: (
    <>
      <path d="M12 4v16M8 8h8M7 14h10" />
    </>
  ),
  E: (
    <>
      <path d="M6 14h12M8 10h8M10 6h4" />
      <circle cx="12" cy="16" r="2" />
    </>
  ),
  F: (
    <>
      <path d="M4 12h16M12 4v16" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
};

function MuscleIcon({ sheetId, className }: { sheetId: WorkoutSheetId; className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {SHEET_MUSCLE_ICONS[sheetId]}
    </svg>
  );
}

function FlameIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c0 4-4 5-4 9a4 4 0 1 0 8 0c0-2-1-3-2-5 1 1 2 2 2 4 2-2 2-4 0-6-2-1-4-2-4-2z" />
    </svg>
  );
}

export default function HomeDashboard({
  userName,
  streakDays,
  lastWorkout,
}: HomeDashboardProps) {
  const router = useRouter();
  const today = new Date();
  const todayWorkout = getTodayWorkout(today);
  const isRestDay = todayWorkout === "REST";
  const todaySheetId = isRestDay ? null : todayWorkout;
  const [selectedSheetId, setSelectedSheetId] = useState<WorkoutSheetId>(
    isRestDay ? "A" : todayWorkout,
  );

  const todaySheet = todaySheetId ? WORKOUT_SHEETS[todaySheetId] : null;
  const lastSheet = WORKOUT_SHEETS[lastWorkout.sheetId];
  const greeting = getTimeGreeting(today);
  const firstName = getFirstName(userName);

  const startWorkout = () => {
    if (isRestDay) return;
    router.push(`/treino?ficha=${todaySheetId ?? selectedSheetId}`);
  };

  return (
    <>
      <style>{`
        @keyframes flame-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.12); opacity: 0.9; }
        }

        .flame-animate {
          animation: flame-pulse 1.5s ease-in-out infinite;
        }

        .page-gradient {
          background: linear-gradient(135deg, #1C1C3E 0%, #2D1B4E 50%, #1A0A00 100%);
        }

        .noise-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          opacity: 0.06;
          mix-blend-mode: overlay;
        }
      `}</style>

      <div className="relative min-h-screen page-gradient">
        <div className="noise-texture pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

        <main className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 pb-28 pt-8">
          {/* TOPO */}
          <header>
            <h1 className="text-[1.75rem] font-black leading-tight text-white">
              {greeting}, {firstName}{" "}
              <span className="inline-block" aria-hidden="true">
                💪
              </span>
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-sm font-normal text-[#C8B8E8]">
              <p className="capitalize">{formatWorkoutDate(today)}</p>
              <span className="text-[#8A7AAA]" aria-hidden="true">
                ·
              </span>
              <p className="flex items-center gap-1.5">
                <FlameIcon className="flame-animate h-4 w-4 text-[#FF6B00]" />
                <span>
                  <span className="font-bold text-[#FF6B00]">{streakDays}</span>{" "}
                  {streakDays === 1 ? "dia seguido" : "dias seguidos"}
                </span>
              </p>
            </div>
          </header>

          {/* CARD TREINO DE HOJE */}
          <section className="mt-8">
            <div
              className={`overflow-hidden rounded-2xl p-6 shadow-[0_12px_40px_rgba(255,107,0,0.35)] ${
                isRestDay
                  ? "bg-gradient-to-br from-[#2D1B4E] to-[#1C1C3E] border border-[rgba(255,255,255,0.15)]"
                  : "bg-gradient-to-br from-[#FF6B00] to-[#CC4400]"
              }`}
            >
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-white/90">
                Treino de hoje
              </p>

              {isRestDay ? (
                <>
                  <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white">
                    Descanso
                  </h2>
                  <p className="mt-2 text-sm font-normal text-white/85">
                    Domingo — recuperação e descanso total
                  </p>
                  <p className="mt-5 text-sm font-normal text-[#C8B8E8]">
                    Amanhã volta a Ficha A — Peito + Tríceps
                  </p>
                </>
              ) : (
                <>
                  <h2 className="mt-3 text-4xl font-black uppercase tracking-tight text-white">
                    {todaySheet!.label}
                  </h2>
                  <AcademyBanner />
                  <p className="mt-2 text-sm font-normal text-white/85">{todaySheet!.focus}</p>
                  <p className="mt-1 text-xs font-semibold uppercase text-white/70">
                    {todaySheet!.weekday}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {todaySheet!.exercises.slice(0, 3).map((exercise) => (
                      <li
                        key={exercise}
                        className="flex items-center gap-2.5 text-sm font-normal text-white"
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-white"
                          aria-hidden="true"
                        />
                        {exercise}
                      </li>
                    ))}
                    {todaySheet!.exercises.length > 3 && (
                      <li className="flex items-center gap-2.5 pl-4 text-sm font-normal text-white/90">
                        +{todaySheet!.exercises.length - 3} exercícios
                      </li>
                    )}
                  </ul>

                  <button
                    type="button"
                    onClick={startWorkout}
                    className="mt-7 w-full rounded-xl bg-white py-4 text-sm font-black uppercase tracking-widest text-[#FF6B00] transition-transform active:scale-[0.98]"
                  >
                    Iniciar treino
                  </button>
                </>
              )}
            </div>
          </section>

          {/* FICHAS A–F */}
          <section className="mt-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8B8E8]">
              Suas fichas
            </h3>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {SHEET_ORDER.map((id) => {
                const sheet = WORKOUT_SHEETS[id];
                const isToday = id === todaySheetId;
                const isSelected = id === selectedSheetId;

                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedSheetId(id)}
                    className={`relative flex flex-col items-start overflow-hidden rounded-2xl border p-3.5 text-left transition-all active:scale-[0.97] ${
                      isSelected
                        ? "border-[#FF6B00] bg-[#FF6B00] shadow-[0_8px_24px_rgba(255,107,0,0.35)]"
                        : "border-[rgba(255,107,0,0.4)] bg-[rgba(255,255,255,0.1)]"
                    }`}
                  >
                    {!isSelected && <CardTopAccent />}

                    {isToday && (
                      <span
                        className={`absolute right-2 top-3 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wide ${
                          isSelected
                            ? "bg-white/20 text-white"
                            : "bg-[#FF6B00] text-white"
                        }`}
                      >
                        Hoje
                      </span>
                    )}

                    <MuscleIcon
                      sheetId={id}
                      className={`mb-2 h-7 w-7 ${isSelected ? "text-white" : "text-[#FF6B00]"}`}
                    />
                    <p
                      className={`text-3xl font-black ${isSelected ? "text-white" : "text-[#FF6B00]"}`}
                    >
                      {id}
                    </p>
                    <AcademyBanner />
                    <p
                      className={`mt-1 text-[10px] font-normal uppercase leading-tight tracking-wide ${
                        isSelected ? "text-white/85" : "text-[#C8B8E8]"
                      }`}
                    >
                      {sheet.shortFocus}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ÚLTIMO TREINO */}
          <section className="mt-8">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-[#C8B8E8]">
              Último treino
            </h3>
            <StandardCard className="mt-4 p-5">
              <div className="flex items-start gap-3 pt-1">
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[rgba(255,107,0,0.2)] text-xl"
                  aria-hidden="true"
                >
                  🏆
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-black uppercase text-white">{lastSheet.label}</p>
                    <AcademyBanner />
                    <span className="shrink-0 text-[10px] font-bold uppercase text-[#FF6B00]">
                      {lastSheet.focus.split(" · ")[0]}
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-normal text-[#A898C8]">{lastWorkout.date}</p>
                </div>
              </div>

              <div className="mt-5 flex gap-8 border-t border-[rgba(255,107,0,0.25)] pt-4">
                <div>
                  <p className="text-[10px] font-normal uppercase tracking-wider text-[#A898C8]">
                    Duração
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#FF6B00]">
                    {lastWorkout.durationMinutes} min
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-normal uppercase tracking-wider text-[#A898C8]">
                    Volume
                  </p>
                  <p className="mt-1 text-lg font-bold text-[#FF6B00]">
                    {formatVolumeKg(lastWorkout.totalVolumeKg)}
                  </p>
                </div>
              </div>
            </StandardCard>
          </section>
        </main>

        <BottomNav />
      </div>
    </>
  );
}

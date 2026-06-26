"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  WORKOUT_EXERCISES,
  calculateTotalVolume,
  countCompletedSets,
  countTotalSets,
  createInitialExerciseLogs,
  getSheetHeaderTitle,
  type WorkoutExerciseLog,
  type WorkoutSheetId,
} from "@/lib/workouts";

const REST_SECONDS = 60;

const EXERCISE_IMAGES: Record<string, { src: string; alt: string }> = {
  "Puxada frontal": {
    src: "/exercises/back/back_puxada-frontal_916.png",
    alt: "Puxada Frontal",
  },
};

type WorkoutSessionProps = {
  sheetId: WorkoutSheetId;
};

function MusclePlaceholder() {
  return (
    <svg
      className="h-16 w-16 text-white/90"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8c2-2 10-2 12 0M6 16c2 2 10 2 12 0" />
      <path d="M12 8v8" />
      <path d="M9 12h6" />
    </svg>
  );
}

function ExerciseImageArea({ exerciseName }: { exerciseName: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = EXERCISE_IMAGES[exerciseName];

  useEffect(() => {
    setImageFailed(false);
  }, [exerciseName]);

  const showPlaceholder = !image || imageFailed;

  return (
    <div className="flex h-full w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#FF6B00] to-[#CC4400]">
      {!showPlaceholder ? (
        <img
          src={image.src}
          alt={image.alt}
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top center" }}
          onError={() => setImageFailed(true)}
        />
      ) : (
        <MusclePlaceholder />
      )}
    </div>
  );
}

function playRestCompleteFeedback() {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate([120, 60, 120]);
  }

  try {
    const ctx = new AudioContext();
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = 880;
    gain.gain.value = 0.08;
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.2);
    void ctx.close();
  } catch {
    // Audio opcional — ignorar se bloqueado pelo browser
  }
}

function formatTimer(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export default function WorkoutSession({ sheetId }: WorkoutSessionProps) {
  const router = useRouter();
  const startedAtRef = useRef(Date.now());
  const [exerciseLogs, setExerciseLogs] = useState<WorkoutExerciseLog[]>(() =>
    createInitialExerciseLogs(sheetId),
  );
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [restSecondsLeft, setRestSecondsLeft] = useState(0);
  const [restActive, setRestActive] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const [error, setError] = useState("");

  const exercises = WORKOUT_EXERCISES[sheetId];
  const currentExercise = exercises[currentExerciseIndex]!;
  const currentLog = exerciseLogs[currentExerciseIndex]!;
  const totalExercises = exercises.length;
  const isLastExercise = currentExerciseIndex === totalExercises - 1;

  const allCurrentSetsDone = currentLog.series.every((s) => s.concluida);
  const completedSets = countCompletedSets(exerciseLogs);
  const totalSets = countTotalSets(exerciseLogs);
  const progressPercent = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

  const startRestTimer = useCallback(() => {
    setRestSecondsLeft(REST_SECONDS);
    setRestActive(true);
  }, []);

  const skipRest = useCallback(() => {
    setRestActive(false);
    setRestSecondsLeft(0);
  }, []);

  useEffect(() => {
    if (!restActive) return;

    const interval = setInterval(() => {
      setRestSecondsLeft((prev) => {
        if (prev <= 1) {
          setRestActive(false);
          playRestCompleteFeedback();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [restActive]);

  const updateWeight = (setIndex: number, value: string) => {
    const parsed = value === "" ? 0 : Number.parseFloat(value);
    const carga = Number.isFinite(parsed) ? Math.max(0, parsed) : 0;

    setExerciseLogs((prev) =>
      prev.map((exercise, exIndex) => {
        if (exIndex !== currentExerciseIndex) return exercise;
        return {
          ...exercise,
          series: exercise.series.map((set, idx) =>
            idx === setIndex ? { ...set, carga_kg: carga } : set,
          ),
        };
      }),
    );
  };

  const completeSet = (setIndex: number) => {
    const set = currentLog.series[setIndex];
    if (!set || set.concluida) return;

    setExerciseLogs((prev) =>
      prev.map((exercise, exIndex) => {
        if (exIndex !== currentExerciseIndex) return exercise;
        return {
          ...exercise,
          series: exercise.series.map((s, idx) =>
            idx === setIndex ? { ...s, concluida: true } : s,
          ),
        };
      }),
    );

    startRestTimer();
  };

  const goNextExercise = () => {
    skipRest();
    setCurrentExerciseIndex((prev) => Math.min(prev + 1, totalExercises - 1));
  };

  const finishWorkout = async () => {
    setFinishing(true);
    setError("");

    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - startedAtRef.current) / 60000),
    );
    const volumeTotal = calculateTotalVolume(exerciseLogs);

    try {
      const res = await fetch("/api/workouts/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ficha: sheetId,
          duracao: durationMinutes,
          exercicios: exerciseLogs,
          volume_total_kg: volumeTotal,
        }),
      });

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        setError(data.error ?? "Erro ao salvar treino");
        return;
      }

      router.push("/home");
    } catch {
      setError("Erro de conexão ao salvar treino");
    } finally {
      setFinishing(false);
    }
  };

  const headerTitle = useMemo(() => getSheetHeaderTitle(sheetId), [sheetId]);

  return (
    <div className="relative mx-auto flex h-screen w-full max-w-[430px] flex-col page-gradient">
      <div className="noise-texture pointer-events-none absolute inset-0 z-0" aria-hidden="true" />

      {/* HEADER fixo */}
      <header className="fixed left-1/2 top-0 z-20 w-full max-w-[430px] -translate-x-1/2 bg-[rgba(28,28,62,0.98)] px-4 pb-3 pt-4">
        <div className="grid grid-cols-[40px_1fr_72px] items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/home")}
            aria-label="Encerrar treino"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[rgba(255,107,0,0.4)] bg-[rgba(255,255,255,0.08)] text-xl text-white active:opacity-80"
          >
            ✕
          </button>

          <h1 className="truncate text-center text-[11px] font-black uppercase tracking-wide text-white">
            {headerTitle}
          </h1>

          <p className="text-right text-[9px] font-bold leading-tight text-[#C8B8E8]">
            Exercício {currentExerciseIndex + 1} de {totalExercises}
          </p>
        </div>

        <div className="mt-1 px-4">
          <img
            src="/academia/studio-training.jpg"
            alt="Estúdio Training Academia"
            className="rounded-lg"
            style={{ width: "100%", height: "100px", objectFit: "cover" }}
          />
        </div>

        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[rgba(255,255,255,0.1)]">
          <div
            className="h-full rounded-full bg-[#FF6B00] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Conteúdo scrollável */}
      <main
        className={`relative z-10 flex-1 overflow-y-auto pt-[192px] ${
          allCurrentSetsDone ? "pb-[80px]" : "pb-4"
        }`}
      >
        {/* Imagem à direita | título + tabela à esquerda */}
        <div className="flex min-h-[280px] flex-row">
          <div className="relative z-10 flex w-[58%] flex-col px-3 py-3">
            <h2 className="text-lg font-black uppercase leading-tight tracking-tight text-white">
              {currentExercise.name}
            </h2>
            <p className="mt-1 text-[0.75rem] font-bold uppercase tracking-wide text-[#FF6B00]">
              {currentExercise.muscleGroup}
            </p>

            <section className="mt-3 overflow-hidden rounded-xl border border-[rgba(255,107,0,0.4)] bg-[rgba(255,255,255,0.08)]">
              <div className="h-1 bg-[#FF6B00]" aria-hidden="true" />

              <div className="grid grid-cols-[28px_28px_1fr_40px] items-center gap-1 border-b border-[rgba(255,107,0,0.2)] px-2 py-2 text-[0.65rem] font-black uppercase tracking-wide text-[#C8B8E8]">
                <span>Série</span>
                <span>Reps</span>
                <span className="text-center">Carga</span>
                <span className="text-center">✓</span>
              </div>

              {currentLog.series.map((set, setIndex) => (
                <div
                  key={set.serie}
                  className={`grid grid-cols-[28px_28px_1fr_40px] items-center gap-1 border-b border-[rgba(255,107,0,0.12)] px-2 py-2 last:border-b-0 ${
                    set.concluida ? "bg-[rgba(255,107,0,0.15)]" : ""
                  }`}
                >
                  <span className="text-sm font-bold text-white">{set.serie}</span>
                  <span className="text-sm font-bold text-white">{set.reps}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    step={0.5}
                    value={set.carga_kg === 0 ? "" : set.carga_kg}
                    disabled={set.concluida}
                    onChange={(e) => updateWeight(setIndex, e.target.value)}
                    placeholder="0"
                    className="h-10 w-full rounded-lg border border-[rgba(255,107,0,0.35)] bg-[rgba(255,255,255,0.06)] text-center text-base font-bold text-white outline-none placeholder:text-[#8A7AAA] focus:border-[#FF6B00] disabled:opacity-60"
                  />
                  <button
                    type="button"
                    disabled={set.concluida}
                    onClick={() => completeSet(setIndex)}
                    aria-label={`Concluir série ${set.serie}`}
                    className={`flex h-10 min-h-[40px] w-10 min-w-[40px] items-center justify-center rounded-lg border text-sm font-black transition-all active:scale-95 disabled:cursor-default ${
                      set.concluida
                        ? "border-[#00C851] bg-[rgba(0,200,81,0.2)] text-[#00C851]"
                        : "border-[#FF6B00] bg-[#FF6B00] text-white"
                    }`}
                  >
                    ✓
                  </button>
                </div>
              ))}
            </section>
          </div>

          <div className="relative z-0 h-full min-h-[280px] w-[42%] shrink-0 overflow-hidden">
            <ExerciseImageArea exerciseName={currentExercise.name} />
          </div>
        </div>

        {restActive && (
          <section className="mx-4 mt-4 overflow-hidden rounded-2xl border border-[rgba(255,107,0,0.4)] bg-[rgba(255,255,255,0.08)] p-4 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C8B8E8]">
              Descanso
            </p>
            <p className="timer-pulse mt-2 text-4xl font-black tabular-nums text-[#FF6B00]">
              {formatTimer(restSecondsLeft)}
            </p>
            <button
              type="button"
              onClick={skipRest}
              className="mt-3 text-xs font-bold uppercase tracking-wide text-[#C8B8E8] underline-offset-4 active:text-white"
            >
              Pular descanso
            </button>
          </section>
        )}

        {error && <p className="mt-3 px-4 text-center text-sm text-red-400">{error}</p>}
      </main>

      {/* Botão fixo no fundo */}
      {allCurrentSetsDone && (
        <footer className="fixed bottom-0 left-1/2 z-20 w-full max-w-[430px] -translate-x-1/2 border-t border-[rgba(255,107,0,0.2)] bg-[rgba(28,28,62,0.98)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {!isLastExercise ? (
            <button
              type="button"
              onClick={goNextExercise}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#CC4400] text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(255,107,0,0.4)] active:scale-[0.98]"
            >
              Próximo exercício →
            </button>
          ) : (
            <button
              type="button"
              onClick={finishWorkout}
              disabled={finishing}
              className="h-14 w-full rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#CC4400] text-sm font-black uppercase tracking-widest text-white shadow-[0_4px_20px_rgba(255,107,0,0.4)] active:scale-[0.98] disabled:opacity-60"
            >
              {finishing ? "Salvando..." : "Finalizar treino 🏆"}
            </button>
          )}
        </footer>
      )}
    </div>
  );
}

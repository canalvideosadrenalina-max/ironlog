export type WorkoutSheetId = "A" | "B" | "C" | "D" | "E" | "F";

export type TodayWorkout = WorkoutSheetId | "REST";

export type ExerciseDefinition = {
  name: string;
  muscleGroup: string;
  sets: number;
  reps: number;
};

export type WorkoutSheet = {
  id: WorkoutSheetId;
  label: string;
  focus: string;
  shortFocus: string;
  weekday: string;
  exercises: string[];
};

export const WORKOUT_EXERCISES: Record<WorkoutSheetId, ExerciseDefinition[]> = {
  A: [
    { name: "Supino reto com barra", muscleGroup: "Peito", sets: 4, reps: 12 },
    { name: "Supino inclinado com halteres", muscleGroup: "Peito", sets: 3, reps: 12 },
    { name: "Crucifixo reto", muscleGroup: "Peito", sets: 3, reps: 15 },
    { name: "Cross over", muscleGroup: "Peito", sets: 3, reps: 15 },
    { name: "Tríceps pulley", muscleGroup: "Tríceps", sets: 4, reps: 12 },
    { name: "Tríceps testa", muscleGroup: "Tríceps", sets: 3, reps: 12 },
    { name: "Mergulho no banco", muscleGroup: "Tríceps", sets: 3, reps: 15 },
  ],
  B: [
    { name: "Puxada frontal", muscleGroup: "Costas · Bíceps", sets: 4, reps: 12 },
    { name: "Remada curvada", muscleGroup: "Costas · Bíceps", sets: 4, reps: 12 },
    { name: "Remada unilateral", muscleGroup: "Costas · Bíceps", sets: 3, reps: 12 },
    { name: "Pulldown", muscleGroup: "Costas", sets: 3, reps: 12 },
    { name: "Rosca direta", muscleGroup: "Bíceps", sets: 4, reps: 12 },
    { name: "Rosca alternada", muscleGroup: "Bíceps", sets: 3, reps: 12 },
    { name: "Rosca martelo", muscleGroup: "Bíceps · Antebraço", sets: 3, reps: 12 },
  ],
  C: [
    { name: "Agachamento livre", muscleGroup: "Quadríceps · Glúteos", sets: 4, reps: 12 },
    { name: "Leg press 45°", muscleGroup: "Quadríceps · Glúteos", sets: 4, reps: 15 },
    { name: "Cadeira extensora", muscleGroup: "Quadríceps", sets: 3, reps: 15 },
    { name: "Cadeira flexora", muscleGroup: "Posterior", sets: 3, reps: 15 },
    { name: "Stiff", muscleGroup: "Posterior · Glúteos", sets: 3, reps: 12 },
    { name: "Panturrilha em pé", muscleGroup: "Panturrilha", sets: 4, reps: 20 },
    { name: "Abdução de quadril", muscleGroup: "Glúteos", sets: 3, reps: 15 },
  ],
  D: [
    { name: "Desenvolvimento militar", muscleGroup: "Ombros", sets: 4, reps: 12 },
    { name: "Elevação lateral", muscleGroup: "Ombros", sets: 4, reps: 15 },
    { name: "Elevação frontal", muscleGroup: "Ombros", sets: 3, reps: 15 },
    { name: "Remada alta", muscleGroup: "Ombros · Trapézio", sets: 3, reps: 12 },
    { name: "Encolhimento com barra", muscleGroup: "Trapézio", sets: 4, reps: 12 },
    { name: "Face pull", muscleGroup: "Ombros · Costas", sets: 3, reps: 15 },
    { name: "Arnold press", muscleGroup: "Ombros", sets: 3, reps: 12 },
  ],
  E: [
    { name: "Abdominal crunch", muscleGroup: "Abdômen", sets: 4, reps: 20 },
    { name: "Abdominal oblíquo", muscleGroup: "Abdômen · Oblíquos", sets: 3, reps: 20 },
    { name: "Prancha", muscleGroup: "Core", sets: 3, reps: 60 },
    { name: "Abdominal infra", muscleGroup: "Abdômen", sets: 3, reps: 20 },
    { name: "Elevação de pernas", muscleGroup: "Abdômen", sets: 3, reps: 15 },
    { name: "Bicicleta abdominal", muscleGroup: "Abdômen · Oblíquos", sets: 3, reps: 30 },
    { name: "Esteira ou bicicleta", muscleGroup: "Cardio", sets: 1, reps: 20 },
  ],
  F: [
    { name: "Supino reto leve", muscleGroup: "Peito", sets: 3, reps: 15 },
    { name: "Puxada frontal leve", muscleGroup: "Costas", sets: 3, reps: 15 },
    { name: "Agachamento leve", muscleGroup: "Pernas", sets: 3, reps: 15 },
    { name: "Desenvolvimento leve", muscleGroup: "Ombros", sets: 3, reps: 15 },
    { name: "Abdominal", muscleGroup: "Abdômen", sets: 3, reps: 20 },
    { name: "Alongamento geral", muscleGroup: "Mobilidade", sets: 1, reps: 10 },
  ],
};

export const WORKOUT_SHEETS: Record<WorkoutSheetId, WorkoutSheet> = {
  A: {
    id: "A",
    label: "Ficha A",
    focus: "Peito · Tríceps",
    shortFocus: "PEITO",
    weekday: "Segunda",
    exercises: WORKOUT_EXERCISES.A.map((e) => e.name),
  },
  B: {
    id: "B",
    label: "Ficha B",
    focus: "Costas · Bíceps",
    shortFocus: "COSTAS",
    weekday: "Terça",
    exercises: WORKOUT_EXERCISES.B.map((e) => e.name),
  },
  C: {
    id: "C",
    label: "Ficha C",
    focus: "Pernas completas",
    shortFocus: "PERNAS",
    weekday: "Quarta",
    exercises: WORKOUT_EXERCISES.C.map((e) => e.name),
  },
  D: {
    id: "D",
    label: "Ficha D",
    focus: "Ombros · Trapézio",
    shortFocus: "OMBROS",
    weekday: "Quinta",
    exercises: WORKOUT_EXERCISES.D.map((e) => e.name),
  },
  E: {
    id: "E",
    label: "Ficha E",
    focus: "Abdômen · Cardio",
    shortFocus: "ABDÔMEN",
    weekday: "Sexta",
    exercises: WORKOUT_EXERCISES.E.map((e) => e.name),
  },
  F: {
    id: "F",
    label: "Ficha F",
    focus: "Revisão geral",
    shortFocus: "REVISÃO",
    weekday: "Sábado",
    exercises: WORKOUT_EXERCISES.F.map((e) => e.name),
  },
};

export const SHEET_ORDER: WorkoutSheetId[] = ["A", "B", "C", "D", "E", "F"];

/** Segunda=A … Sábado=F, Domingo=descanso */
const WEEKDAY_TO_SHEET: Record<number, TodayWorkout> = {
  0: "REST",
  1: "A",
  2: "B",
  3: "C",
  4: "D",
  5: "E",
  6: "F",
};

export function getTodayWorkout(date = new Date()): TodayWorkout {
  return WEEKDAY_TO_SHEET[date.getDay()]!;
}

export function getTodaySheetId(date = new Date()): WorkoutSheetId {
  const today = getTodayWorkout(date);
  return today === "REST" ? "A" : today;
}

export function isRestDay(date = new Date()): boolean {
  return getTodayWorkout(date) === "REST";
}

export function getSheetHeaderTitle(sheetId: WorkoutSheetId): string {
  const sheet = WORKOUT_SHEETS[sheetId];
  return `${sheet.label.toUpperCase()} — ${sheet.shortFocus}`;
}

export type WorkoutSetLog = {
  serie: number;
  reps: number;
  carga_kg: number;
  concluida: boolean;
};

export type WorkoutExerciseLog = {
  nome: string;
  grupo_muscular: string;
  series: WorkoutSetLog[];
};

export function calculateTotalVolume(exercises: WorkoutExerciseLog[]): number {
  return exercises.reduce((total, exercise) => {
    return (
      total +
      exercise.series.reduce((setTotal, set) => {
        if (!set.concluida) return setTotal;
        return setTotal + set.reps * set.carga_kg;
      }, 0)
    );
  }, 0);
}

export function createInitialExerciseLogs(sheetId: WorkoutSheetId): WorkoutExerciseLog[] {
  return WORKOUT_EXERCISES[sheetId].map((exercise) => ({
    nome: exercise.name,
    grupo_muscular: exercise.muscleGroup,
    series: Array.from({ length: exercise.sets }, (_, index) => ({
      serie: index + 1,
      reps: exercise.reps,
      carga_kg: 0,
      concluida: false,
    })),
  }));
}

export function countCompletedSets(exercises: WorkoutExerciseLog[]): number {
  return exercises.reduce(
    (total, exercise) => total + exercise.series.filter((s) => s.concluida).length,
    0,
  );
}

export function countTotalSets(exercises: WorkoutExerciseLog[]): number {
  return exercises.reduce((total, exercise) => total + exercise.series.length, 0);
}

export type LastWorkoutSummary = {
  sheetId: WorkoutSheetId;
  date: string;
  durationMinutes: number;
  totalVolumeKg: number;
};

export function formatWorkoutDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

export function formatShortDate(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatVolumeKg(kg: number): string {
  return `${new Intl.NumberFormat("pt-BR").format(kg)} kg`;
}

export function getTimeGreeting(date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
}

export function getFirstName(fullName: string): string {
  return fullName.trim().split(/\s+/)[0] || "Atleta";
}

/** Placeholder até persistência de treinos no Supabase */
export function getDemoHomeStats(): { streakDays: number; lastWorkout: LastWorkoutSummary } {
  const lastDate = new Date();
  lastDate.setDate(lastDate.getDate() - 2);

  return {
    streakDays: 12,
    lastWorkout: {
      sheetId: "B",
      date: formatShortDate(lastDate),
      durationMinutes: 58,
      totalVolumeKg: 12450,
    },
  };
}

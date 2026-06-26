import WorkoutSession from "./WorkoutSession";
import { WORKOUT_SHEETS, getTodayWorkout, type WorkoutSheetId } from "@/lib/workouts";

type TreinoPageProps = {
  searchParams: { ficha?: string };
};

export default function TreinoPage({ searchParams }: TreinoPageProps) {
  const today = getTodayWorkout();
  const defaultFicha = today === "REST" ? "A" : today;
  const rawFicha = searchParams.ficha?.toUpperCase() ?? defaultFicha;
  const fichaId = (rawFicha in WORKOUT_SHEETS ? rawFicha : defaultFicha) as WorkoutSheetId;

  return <WorkoutSession sheetId={fichaId} />;
}

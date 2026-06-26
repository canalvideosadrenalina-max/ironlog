import { getDemoHomeStats } from "@/lib/workouts";
import HomeDashboard from "./HomeDashboard";

export default function HomePage() {
  const { streakDays, lastWorkout } = getDemoHomeStats();

  return (
    <HomeDashboard
      userName="Romualdo"
      streakDays={streakDays}
      lastWorkout={lastWorkout}
    />
  );
}

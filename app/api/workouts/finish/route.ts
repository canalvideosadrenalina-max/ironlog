import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-tokens";
import { createAdminClient } from "@/lib/supabase-admin";
import type { WorkoutExerciseLog, WorkoutSheetId } from "@/lib/workouts";

type FinishWorkoutBody = {
  ficha?: WorkoutSheetId;
  duracao?: number;
  exercicios?: WorkoutExerciseLog[];
  volume_total_kg?: number;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FinishWorkoutBody;

    const ficha = body.ficha;
    const duracao = body.duracao;
    const exercicios = body.exercicios;
    const volumeTotalKg = body.volume_total_kg;

    if (!ficha || !["A", "B", "C", "D", "E", "F"].includes(ficha)) {
      return NextResponse.json({ error: "Ficha inválida" }, { status: 400 });
    }

    if (typeof duracao !== "number" || duracao < 1) {
      return NextResponse.json({ error: "Duração inválida" }, { status: 400 });
    }

    if (!Array.isArray(exercicios) || exercicios.length === 0) {
      return NextResponse.json({ error: "Exercícios inválidos" }, { status: 400 });
    }

    if (typeof volumeTotalKg !== "number" || volumeTotalKg < 0) {
      return NextResponse.json({ error: "Volume inválido" }, { status: 400 });
    }

    const session = cookies().get(SESSION_COOKIE)?.value;
    const payload = session ? verifySessionToken(session) : null;

    const supabase = createAdminClient();
    const { data: workout, error } = await supabase
      .from("ironlog_workouts")
      .insert({
        user_id: payload?.userId ?? null,
        ficha,
        duracao: Math.round(duracao),
        exercicios,
        volume_total_kg: volumeTotalKg,
      })
      .select("id, ficha, data, duracao, volume_total_kg")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message ?? "Erro ao salvar treino" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, workout });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

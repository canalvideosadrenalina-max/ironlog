import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked = local.length <= 2 ? `${local[0]}*` : `${local.slice(0, 2)}***`;
  return `${masked}@${domain}`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string };
    const email = (body.email ?? "").trim().toLowerCase();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Informe um email válido" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      email: maskEmail(email),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

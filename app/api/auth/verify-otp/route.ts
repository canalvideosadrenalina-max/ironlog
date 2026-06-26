import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
  createRegistrationToken,
  createSessionToken,
} from "@/lib/auth-tokens";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; code?: string };
    const email = (body.email ?? "").trim().toLowerCase();
    const token = (body.code ?? "").replace(/\D/g, "");

    if (!email || token.length !== 6) {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const authUserId = data.user?.id;
    if (!authUserId) {
      return NextResponse.json({ error: "Falha na autenticação" }, { status: 500 });
    }

    const { data: user, error: userError } = await supabase
      .from("ironlog_users")
      .select("id, email, name")
      .eq("id", authUserId)
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (user) {
      const sessionToken = createSessionToken(user.id, user.email ?? email);
      const response = NextResponse.json({
        ok: true,
        exists: true,
        user: { id: user.id, name: user.name },
      });

      response.cookies.set(SESSION_COOKIE, sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: SESSION_MAX_AGE_SEC,
        path: "/",
      });

      return response;
    }

    const registrationToken = createRegistrationToken(email, authUserId);

    return NextResponse.json({
      ok: true,
      exists: false,
      registrationToken,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

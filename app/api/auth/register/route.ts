import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
  createSessionToken,
  verifyRegistrationToken,
} from "@/lib/auth-tokens";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      registrationToken?: string;
      name?: string;
      academia_nome?: string;
      academia_cidade?: string;
    };

    const registrationToken = body.registrationToken ?? "";
    const name = body.name?.trim() ?? "";

    if (!registrationToken) {
      return NextResponse.json({ error: "Sessão de cadastro inválida" }, { status: 401 });
    }

    if (name.length < 2) {
      return NextResponse.json({ error: "Informe seu nome completo" }, { status: 400 });
    }

    const registration = verifyRegistrationToken(registrationToken);
    if (!registration) {
      return NextResponse.json(
        { error: "Cadastro expirado. Verifique o código novamente." },
        { status: 401 }
      );
    }

    const supabase = createAdminClient();

    const { data: existing } = await supabase
      .from("ironlog_users")
      .select("id, email, name")
      .eq("id", registration.userId)
      .maybeSingle();

    if (existing) {
      const sessionToken = createSessionToken(existing.id, existing.email ?? registration.email);
      const response = NextResponse.json({
        ok: true,
        user: { id: existing.id, name: existing.name },
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

    const { data: user, error: insertError } = await supabase
      .from("ironlog_users")
      .insert({
        id: registration.userId,
        email: registration.email,
        name,
        academia_nome: body.academia_nome?.trim() || null,
        academia_cidade: body.academia_cidade?.trim() || null,
      })
      .select("id, email, name")
      .single();

    if (insertError || !user) {
      return NextResponse.json(
        { error: insertError?.message ?? "Erro ao criar usuário" },
        { status: 500 }
      );
    }

    const sessionToken = createSessionToken(user.id, user.email ?? registration.email);
    const response = NextResponse.json({
      ok: true,
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
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

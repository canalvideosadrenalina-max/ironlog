import { NextResponse } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SEC,
  createRegistrationToken,
  createSessionToken,
} from "@/lib/auth-tokens";
import { normalizePhone } from "@/lib/phone";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; code?: string };
    const phone = normalizePhone(body.phone ?? "");
    const code = (body.code ?? "").replace(/\D/g, "");

    if (!phone || code.length !== 6) {
      return NextResponse.json({ error: "Código inválido" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { data: otpRow, error: otpError } = await supabase
      .from("ironlog_otp_codes")
      .select("id, code, expires_at, verified")
      .eq("phone", phone)
      .eq("verified", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (otpError || !otpRow) {
      return NextResponse.json({ error: "Código não encontrado" }, { status: 404 });
    }

    if (new Date(otpRow.expires_at).getTime() < Date.now()) {
      return NextResponse.json({ error: "Código expirado. Reenvie." }, { status: 410 });
    }

    if (otpRow.code !== code) {
      return NextResponse.json({ error: "Código incorreto" }, { status: 401 });
    }

    await supabase
      .from("ironlog_otp_codes")
      .update({ verified: true })
      .eq("id", otpRow.id);

    const { data: user, error: userError } = await supabase
      .from("ironlog_users")
      .select("id, phone, name")
      .eq("phone", phone)
      .maybeSingle();

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    if (user) {
      const sessionToken = createSessionToken(user.id, user.phone);
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

    const registrationToken = createRegistrationToken(phone);

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

import { NextResponse } from "next/server";
import { generateOtpCode } from "@/lib/auth-tokens";
import { buildOtpMessage, sendWhatsAppMessage } from "@/lib/evolution";
import { isValidBrazilianPhone, maskPhone, normalizePhone } from "@/lib/phone";
import { createAdminClient } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = normalizePhone(body.phone ?? "");

    if (!isValidBrazilianPhone(phone)) {
      return NextResponse.json(
        { error: "Informe um celular válido: (99) 99999-9999" },
        { status: 400 }
      );
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString();
    const supabase = createAdminClient();

    await supabase.from("ironlog_otp_codes").delete().eq("phone", phone);

    const { error: insertError } = await supabase.from("ironlog_otp_codes").insert({
      phone,
      code,
      expires_at: expiresAt,
      verified: false,
    });

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    const whatsapp = await sendWhatsAppMessage(phone, buildOtpMessage(code));

    if (!whatsapp.ok) {
      return NextResponse.json(
        { error: whatsapp.error ?? "Falha ao enviar WhatsApp" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      ok: true,
      phone: maskPhone(phone),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

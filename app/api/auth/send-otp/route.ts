import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };

  const { error } = await supabase.auth.signInWithOtp({
    email: (email ?? "").trim().toLowerCase(),
    options: { shouldCreateUser: true },
  });

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ success: true });
}

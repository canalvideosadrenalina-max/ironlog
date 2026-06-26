import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-tokens";
import { createAdminClient } from "@/lib/supabase-admin";

export default async function PerfilPage() {
  const session = cookies().get(SESSION_COOKIE)?.value;
  const payload = session ? verifySessionToken(session) : null;

  if (!payload) {
    redirect("/auth");
  }

  const supabase = createAdminClient();
  const { data: user } = await supabase
    .from("ironlog_users")
    .select("name, academia_nome, academia_cidade")
    .eq("id", payload.userId)
    .maybeSingle();

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-iron-bg px-6 pb-28 pt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-iron-primary">Perfil</p>
        <h1 className="mt-2 text-2xl font-black uppercase text-white">
          {user?.name ?? "Atleta"}
        </h1>
        {(user?.academia_nome || user?.academia_cidade) && (
          <p className="mt-3 text-sm text-iron-secondary">
            {[user.academia_nome, user.academia_cidade].filter(Boolean).join(" · ")}
          </p>
        )}
      </main>
      <BottomNav />
    </>
  );
}

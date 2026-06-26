import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import BottomNav from "@/components/BottomNav";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth-tokens";

export default function HistoricoPage() {
  const session = cookies().get(SESSION_COOKIE)?.value;
  const payload = session ? verifySessionToken(session) : null;

  if (!payload) {
    redirect("/auth");
  }

  return (
    <>
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center bg-iron-bg px-6 pb-28 pt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-iron-primary">Histórico</p>
        <h1 className="mt-2 text-2xl font-black uppercase text-white">Seus treinos</h1>
        <p className="mt-4 text-sm text-iron-secondary">Em breve você verá todo o histórico aqui.</p>
      </main>
      <BottomNav />
    </>
  );
}

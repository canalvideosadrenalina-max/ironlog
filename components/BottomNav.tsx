"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavIconProps = {
  className?: string;
};

function HomeIcon({ className }: NavIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h5v-6h4v6h5V9.5" />
    </svg>
  );
}

function WorkoutIcon({ className }: NavIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6.5 6.5 3 10v4l3.5 3.5" />
      <path d="M17.5 6.5 21 10v4l-3.5 3.5" />
      <path d="M9 12h6" />
    </svg>
  );
}

function HistoryIcon({ className }: NavIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 3v5h5" />
      <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

function ProfileIcon({ className }: NavIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  );
}

const NAV_ITEMS = [
  { href: "/home", label: "Home", Icon: HomeIcon },
  { href: "/treino", label: "Treino", Icon: WorkoutIcon },
  { href: "/historico", label: "Histórico", Icon: HistoryIcon },
  { href: "/perfil", label: "Perfil", Icon: ProfileIcon },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-[rgba(255,107,0,0.35)] bg-[rgba(28,28,62,0.98)]">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={href}
              href={href}
              className={`flex min-w-0 flex-1 flex-col items-center gap-1.5 px-2 py-2 text-[10px] font-semibold uppercase tracking-wide transition-colors ${
                active ? "text-[#FF6B00]" : "text-[#8A7AAA] hover:text-[#C8B8E8]"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

import { Link, useRouterState } from "@tanstack/react-router";
import { FileText, Map, ShieldAlert, Newspaper, User, Siren } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/report", label: "報告する", icon: FileText },
  { to: "/incidents", label: "被害マップ", icon: Map },
  { to: "/", label: "AI危険エリア", icon: ShieldAlert },
  { to: "/feed", label: "フィード", icon: Newspaper },
  { to: "/profile", label: "プロフィール", icon: User },
] as const;

export function AppShell({
  children,
  fullBleed = false,
  title,
}: {
  children: ReactNode;
  fullBleed?: boolean;
  title?: string;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isEmergency = pathname === "/emergency";

  return (
    <div className="relative mx-auto flex min-h-screen w-full max-w-md flex-col bg-background text-foreground">
      {title && !fullBleed && (
        <header className="sticky top-0 z-30 border-b border-border/60 bg-background/95 px-4 py-3 backdrop-blur">
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
        </header>
      )}

      <main className={cn("flex-1", fullBleed ? "" : "pb-24")}>{children}</main>

      {/* Emergency FAB — hidden on emergency screen itself */}
      {!isEmergency && (
        <Link
          to="/emergency"
          aria-label="緊急"
          className="fixed bottom-24 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[oklch(0.58_0.24_25)] text-white shadow-[0_10px_30px_-8px_oklch(0.58_0.24_25/0.7)] ring-4 ring-white/70 transition-transform active:scale-95"
          style={{ right: "max(1rem, calc(50% - 14rem))" }}
        >
          <div className="flex flex-col items-center leading-none">
            <Siren className="h-5 w-5" />
            <span className="mt-0.5 text-[11px] font-bold">緊急</span>
          </div>
        </Link>
      )}

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-border/60 bg-background/95 backdrop-blur">
        <ul className="grid grid-cols-5">
          {TABS.map(({ to, label, icon: Icon }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium",
                    active ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
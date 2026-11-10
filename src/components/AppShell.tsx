import { Link, useLocation } from "@tanstack/react-router";
import { Home, Search, PlusCircle, CalendarClock, User } from "lucide-react";
import type { ReactNode } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const { t } = useI18n();
  const { pathname } = useLocation();
  const items = [
    { to: "/home", icon: Home, label: t("navHome") },
    { to: "/search", icon: Search, label: t("navSearch") },
    { to: "/publish", icon: PlusCircle, label: t("navPublish"), primary: true },
    { to: "/trips", icon: CalendarClock, label: t("navTrips") },
    { to: "/profile", icon: User, label: t("navProfile") },
  ] as const;
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-card/95 backdrop-blur">
      <div className="mx-auto flex max-w-md items-end justify-around px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {items.map((it) => {
          const active = pathname.startsWith(it.to);
          const Icon = it.icon;
          if ("primary" in it) {
            return (
              <Link key={it.to} to={it.to} className="-mt-6 flex flex-col items-center gap-1 text-[11px] font-medium text-primary">
                <span className="flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-primary text-primary-foreground shadow-elegant">
                  <Icon className="h-6 w-6" />
                </span>
                {it.label}
              </Link>
            );
          }
          return (
            <Link
              key={it.to}
              to={it.to}
              className={cn(
                "flex min-w-14 flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("h-5 w-5 transition-transform", active && "scale-110")} />
              {it.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function Page({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto min-h-screen max-w-md pb-28 animate-rise", className)}>{children}</div>;
}

export function PageHeader({ title, back, right }: { title: string; back?: boolean; right?: ReactNode }) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 bg-background/90 px-5 py-4 backdrop-blur">
      {back && (
        <button onClick={() => history.back()} className="rounded-full bg-card p-2 shadow-card" aria-label="Retour">
          <span className="block rtl:rotate-180">←</span>
        </button>
      )}
      <h1 className="flex-1 text-xl font-bold tracking-tight">{title}</h1>
      {right}
    </header>
  );
}

export function EmptyState({ icon, title, children }: { icon: ReactNode; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed bg-card/60 px-6 py-10 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-primary animate-float">{icon}</div>
      <p className="font-semibold">{title}</p>
      {children && <div className="mt-2 text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}

const statusTone: Record<string, string> = {
  verified: "bg-success/12 text-success",
  accepted: "bg-success/12 text-success",
  onboard: "bg-success/12 text-success",
  completed: "bg-accent text-primary",
  pending: "bg-warning/18 text-warning-foreground",
  rejected: "bg-destructive/10 text-destructive",
  cancelled: "bg-muted text-muted-foreground",
  expired: "bg-destructive/10 text-destructive",
  not_submitted: "bg-muted text-muted-foreground",
};

export function StatusPill({ status, label }: { status: string; label: string }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold", statusTone[status] ?? "bg-muted")}>
      {label}
    </span>
  );
}

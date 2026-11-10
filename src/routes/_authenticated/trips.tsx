import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Page, PageHeader, EmptyState, StatusPill } from "@/components/AppShell";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDA } from "@/lib/dz";
import { useI18n, type TKey } from "@/lib/i18n";
import { fmtDate } from "@/lib/rides";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/trips")({
  head: () => ({ meta: [{ title: "Mes trajets — Waslni" }, { name: "description", content: "Vos réservations et trajets publiés." }] }),
  component: Trips,
});

function Trips() {
  const { t, lang } = useI18n();
  const { user } = Route.useRouteContext();
  const [tab, setTab] = useState<"p" | "d">("p");
  const q = useQuery({
    queryKey: ["trips", user.id],
    queryFn: async () => {
      const [b, r] = await Promise.all([
        supabase.from("bookings").select("id, status, seats, rides!inner(id, from_city, to_city, departure_at, price_da)").eq("passenger_id", user.id).order("created_at", { ascending: false }),
        supabase.from("rides").select("*").eq("driver_id", user.id).order("departure_at", { ascending: false }),
      ]);
      return { bookings: b.data ?? [], rides: r.data ?? [] };
    },
  });
  return (
    <Page>
      <PageHeader title={t("navTrips")} />
      <div className="mx-5 mb-4 grid grid-cols-2 rounded-2xl bg-muted p-1 text-sm font-semibold">
        {(["p", "d"] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={cn("rounded-xl py-2.5 transition-all", tab === k ? "bg-card text-primary shadow-card" : "text-muted-foreground")}>
            {k === "p" ? t("asPassenger") : t("asDriver")}
          </button>
        ))}
      </div>
      <div className="space-y-3 px-5">
        {q.isLoading ? [0, 1].map((i) => <Skeleton key={i} className="h-20 rounded-3xl" />) : tab === "p" ? (
          q.data?.bookings.length ? q.data.bookings.map((b) => (
            <Row key={b.id} id={b.rides.id} title={`${b.rides.from_city} → ${b.rides.to_city}`} sub={`${fmtDate(b.rides.departure_at, lang)} · ${formatDA(b.rides.price_da * b.seats)}`}
              pill={<StatusPill status={b.status} label={t(`b_${b.status}` as TKey)} />} />
          )) : <EmptyState icon={<CalendarClock />} title={t("nothingYet")}><Link to="/search" search={{}} className="font-semibold text-primary">{t("search")}</Link></EmptyState>
        ) : q.data?.rides.length ? q.data.rides.map((r) => (
          <Row key={r.id} id={r.id} title={`${r.from_city} → ${r.to_city}`} sub={`${fmtDate(r.departure_at, lang)} · ${formatDA(r.price_da)}`}
            pill={<StatusPill status={r.status === "scheduled" ? "accepted" : r.status} label={r.status === "scheduled" ? "Prévu" : r.status === "completed" ? t("b_completed") : t("b_cancelled")} />} />
        )) : <EmptyState icon={<Car />} title={t("nothingYet")}><Link to="/publish" className="font-semibold text-primary">{t("publishRide")}</Link></EmptyState>}
      </div>
    </Page>
  );
}

function Row({ id, title, sub, pill }: { id: string; title: string; sub: string; pill: React.ReactNode }) {
  return (
    <Link to="/ride/$id" params={{ id }} className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card animate-rise">
      <div className="flex-1"><p className="font-bold">{title}</p><p className="text-xs text-muted-foreground">{sub}</p></div>
      {pill}
    </Link>
  );
}

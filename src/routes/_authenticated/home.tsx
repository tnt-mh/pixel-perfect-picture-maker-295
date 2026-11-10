import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowRight, CalendarDays, Clock, Search, Users, Car } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Page, EmptyState, StatusPill } from "@/components/AppShell";
import { CitySelect } from "@/components/CitySelect";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";
import { Skeleton } from "@/components/ui/skeleton";
import { POPULAR } from "@/lib/dz";
import { useI18n, type TKey } from "@/lib/i18n";
import { fmtDate } from "@/lib/rides";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({ meta: [{ title: "Accueil — Waslni" }, { name: "description", content: "Trouvez votre prochain trajet en covoiturage." }] }),
  component: Home,
});

function Home() {
  const { t, lang } = useI18n();
  const { user } = Route.useRouteContext();
  const nav = useNavigate();
  const [s, setS] = useState({ from: "", to: "", date: "", seats: 1 });

  const profile = useQuery({
    queryKey: ["profile", user.id],
    queryFn: async () => (await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle()).data,
  });
  const recent = useQuery({
    queryKey: ["recent", user.id],
    queryFn: async () => (await supabase.from("recent_searches").select("*").order("created_at", { ascending: false }).limit(4)).data ?? [],
  });
  const upcoming = useQuery({
    queryKey: ["my-bookings-upcoming", user.id],
    queryFn: async () =>
      (await supabase.from("bookings").select("id, status, rides!inner(id, from_city, to_city, departure_at)")
        .eq("passenger_id", user.id).in("status", ["pending", "accepted"]).gte("rides.departure_at", new Date().toISOString()).limit(3)).data ?? [],
  });

  const go = (from: string, to: string) => nav({ to: "/search", search: { from, to, date: s.date || undefined, seats: s.seats } });
  const first = profile.data?.full_name?.split(" ")[0];

  return (
    <Page className="pb-32">
      <div className="rounded-b-[2.5rem] bg-gradient-hero px-5 pb-24 pt-8 text-primary-foreground">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary-foreground/75">{t("hello")} 👋</p>
            <p className="text-2xl font-extrabold">{first || "Waslni"}</p>
          </div>
          <LogoMark className="text-primary-foreground/15" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">{t("whereTo")}</h1>
      </div>

      <form
        onSubmit={(e) => { e.preventDefault(); go(s.from, s.to); }}
        className="-mt-16 mx-5 space-y-2.5 rounded-3xl bg-card p-4 shadow-elegant"
      >
        <CitySelect value={s.from} onChange={(v) => setS({ ...s, from: v })} placeholder={t("from")} />
        <CitySelect value={s.to} onChange={(v) => setS({ ...s, to: v })} placeholder={t("to")} />
        <div className="grid grid-cols-2 gap-2.5">
          <label className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-3">
            <CalendarDays className="h-5 w-5 text-primary" />
            <input type="date" aria-label={t("date")} value={s.date} onChange={(e) => setS({ ...s, date: e.target.value })} className="w-full bg-transparent text-sm outline-none" />
          </label>
          <label className="flex items-center gap-2 rounded-2xl bg-muted px-3 py-3">
            <Users className="h-5 w-5 text-primary" />
            <select aria-label={t("passengers")} value={s.seats} onChange={(e) => setS({ ...s, seats: +e.target.value })} className="w-full bg-transparent text-sm outline-none">
              {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n} {t("passengers").toLowerCase()}</option>)}
            </select>
          </label>
        </div>
        <Button type="submit" variant="hero" size="xl" className="w-full"><Search /> {t("search")}</Button>
      </form>

      <section className="mt-8 px-5">
        <h2 className="mb-3 font-bold">{t("upcoming")}</h2>
        {upcoming.isLoading ? <Skeleton className="h-20 rounded-3xl" /> : upcoming.data?.length ? (
          <div className="space-y-2.5">
            {upcoming.data.map((b) => (
              <Link key={b.id} to="/ride/$id" params={{ id: b.rides.id }} className="flex items-center gap-3 rounded-2xl bg-card p-4 shadow-card">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary"><Car className="h-5 w-5" /></div>
                <div className="flex-1">
                  <p className="font-semibold">{b.rides.from_city} → {b.rides.to_city}</p>
                  <p className="text-xs text-muted-foreground">{fmtDate(b.rides.departure_at, lang)}</p>
                </div>
                <StatusPill status={b.status} label={t(`b_${b.status}` as TKey)} />
              </Link>
            ))}
          </div>
        ) : <EmptyState icon={<CalendarDays />} title={t("nothingYet")} />}
      </section>

      {!!recent.data?.length && (
        <section className="mt-8 px-5">
          <h2 className="mb-3 font-bold">{t("recent")}</h2>
          <div className="flex flex-wrap gap-2">
            {recent.data.map((r) => (
              <button key={r.id} onClick={() => go(r.from_city, r.to_city)} className="flex items-center gap-1.5 rounded-full bg-card px-3.5 py-2 text-sm font-medium shadow-card">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {r.from_city} → {r.to_city}
              </button>
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 px-5">
        <h2 className="mb-3 font-bold">{t("popular")}</h2>
        <div className="-mx-5 flex gap-3 overflow-x-auto px-5 pb-2">
          {POPULAR.map((p) => (
            <button key={p.from + p.to} onClick={() => go(p.from, p.to)} className="min-w-44 rounded-3xl bg-gradient-primary p-4 text-start text-primary-foreground shadow-elegant">
              <p className="text-xs text-primary-foreground/70">{p.from}</p>
              <p className="flex items-center gap-1 text-lg font-bold">{p.to} <ArrowRight className="h-4 w-4 rtl:rotate-180" /></p>
            </button>
          ))}
        </div>
      </section>
    </Page>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { SearchX, SlidersHorizontal } from "lucide-react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Page, PageHeader, EmptyState } from "@/components/AppShell";
import { CitySelect } from "@/components/CitySelect";
import { RideCard } from "@/components/RideCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useI18n } from "@/lib/i18n";
import { attachDrivers } from "@/lib/rides";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/search")({
  validateSearch: z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    date: z.string().optional(),
    seats: z.number().optional(),
  }),
  head: () => ({ meta: [{ title: "Rechercher un trajet — Waslni" }, { name: "description", content: "Trajets disponibles entre les wilayas." }] }),
  component: SearchPage,
});

type Sort = "time" | "price";

function SearchPage() {
  const sp = Route.useSearch();
  const nav = Route.useNavigate();
  const { t } = useI18n();
  const { user } = Route.useRouteContext();
  const [sort, setSort] = useState<Sort>("time");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const seats = sp.seats ?? 1;

  useEffect(() => {
    if (sp.from && sp.to) supabase.from("recent_searches").insert({ user_id: user.id, from_city: sp.from, to_city: sp.to }).then(() => {});
  }, [sp.from, sp.to, user.id]);

  const q = useQuery({
    queryKey: ["search", sp.from, sp.to, sp.date],
    queryFn: async () => {
      let query = supabase.from("rides").select("*").eq("status", "scheduled").gte("departure_at", new Date().toISOString());
      if (sp.from) query = query.eq("from_city", sp.from);
      if (sp.to) query = query.eq("to_city", sp.to);
      if (sp.date) {
        const start = new Date(sp.date + "T00:00:00");
        const end = new Date(start); end.setDate(end.getDate() + 1);
        query = query.gte("departure_at", start.toISOString()).lt("departure_at", end.toISOString());
      }
      const { data, error } = await query.order("departure_at").limit(50);
      if (error) throw error;
      const withDrivers = await attachDrivers(data ?? []);
      const booked = await Promise.all(withDrivers.map((r) => supabase.rpc("seats_booked", { _ride: r.id })));
      return withDrivers.map((r, i) => ({ ...r, left: r.seats_total - (booked[i].data ?? 0) }));
    },
  });

  const list = (q.data ?? [])
    .filter((r) => r.left >= seats && (!verifiedOnly || r.verified))
    .sort((a, b) => (sort === "price" ? a.price_da - b.price_da : a.departure_at.localeCompare(b.departure_at)));

  return (
    <Page>
      <PageHeader title={t("results")} />
      <div className="space-y-2.5 px-5">
        <CitySelect value={sp.from ?? ""} onChange={(v) => nav({ search: { ...sp, from: v || undefined } })} placeholder={t("from")} />
        <CitySelect value={sp.to ?? ""} onChange={(v) => nav({ search: { ...sp, to: v || undefined } })} placeholder={t("to")} />
        <div className="flex items-center gap-2 overflow-x-auto pt-1 text-sm">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" />
          {(["time", "price"] as Sort[]).map((k) => (
            <Chip key={k} active={sort === k} onClick={() => setSort(k)}>{k === "time" ? "Plus tôt" : "Moins cher"}</Chip>
          ))}
          <Chip active={verifiedOnly} onClick={() => setVerifiedOnly(!verifiedOnly)}>{t("verified")}</Chip>
        </div>
      </div>
      <div className="mt-4 space-y-3 px-5">
        {q.isLoading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-36 rounded-3xl" />) :
          list.length ? list.map((r) => <RideCard key={r.id} ride={r} driver={r.driver} verified={r.verified} seatsLeft={r.left} />) :
          <EmptyState icon={<SearchX />} title={t("noResults")} />}
      </div>
    </Page>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className={cn("shrink-0 rounded-full px-3.5 py-1.5 font-medium transition-colors", active ? "bg-primary text-primary-foreground" : "bg-card shadow-card")}>
      {children}
    </button>
  );
}

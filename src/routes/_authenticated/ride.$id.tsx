import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Car, Flag, MapPin, Minus, Phone, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Page, PageHeader, StatusPill } from "@/components/AppShell";
import { Avatar } from "@/components/RideCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDA, PREFERENCES } from "@/lib/dz";
import { useI18n, type TKey } from "@/lib/i18n";
import { fmtDate } from "@/lib/rides";

export const Route = createFileRoute("/_authenticated/ride/$id")({
  head: () => ({ meta: [{ title: "Détails du trajet — Waslni" }, { name: "description", content: "Itinéraire, conducteur et réservation." }] }),
  component: RidePage,
});

function RidePage() {
  const { id } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { t, lang } = useI18n();
  const qc = useQueryClient();
  const [seats, setSeats] = useState(1);

  const q = useQuery({
    queryKey: ["ride", id],
    queryFn: async () => {
      const { data: ride, error } = await supabase.from("rides").select("*").eq("id", id).single();
      if (error) throw error;
      const [driver, ver, vehicle, booked, bookings] = await Promise.all([
        supabase.from("profiles").select("full_name, avatar_url, phone").eq("id", ride.driver_id).maybeSingle(),
        supabase.from("driver_verification").select("status").eq("user_id", ride.driver_id).maybeSingle(),
        ride.vehicle_id ? supabase.from("vehicles").select("*").eq("id", ride.vehicle_id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.rpc("seats_booked", { _ride: id }),
        supabase.from("bookings").select("*").eq("ride_id", id).order("created_at"),
      ]);
      const pids = (bookings.data ?? []).map((b) => b.passenger_id);
      const passengers = pids.length ? (await supabase.from("profiles").select("id, full_name, avatar_url, phone").in("id", pids)).data ?? [] : [];
      return { ride, driver: driver.data, verified: ver.data?.status === "verified", vehicle: vehicle.data, left: ride.seats_total - (booked.data ?? 0), bookings: bookings.data ?? [], passengers };
    },
  });

  const refresh = () => { qc.invalidateQueries({ queryKey: ["ride", id] }); qc.invalidateQueries({ queryKey: ["trips"] }); };
  const book = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("bookings").insert({ ride_id: id, passenger_id: user.id, seats });
      if (error) throw error;
    },
    onSuccess: () => { toast.success(t("bookSent")); refresh(); },
    onError: (e) => toast.error(e.message),
  });
  const setBooking = useMutation({
    mutationFn: async ({ bid, status }: { bid: string; status: "accepted" | "rejected" | "onboard" | "cancelled" | "completed" }) => {
      const { error } = await supabase.from("bookings").update({ status }).eq("id", bid);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (e) => toast.error(e.message),
  });
  const setRide = useMutation({
    mutationFn: async (status: "completed" | "cancelled") => {
      const { error } = await supabase.from("rides").update({ status }).eq("id", id);
      if (error) throw error;
      if (status === "completed") await supabase.from("bookings").update({ status: "completed" }).eq("ride_id", id).in("status", ["onboard", "accepted"]);
    },
    onSuccess: refresh,
    onError: (e) => toast.error(e.message),
  });

  if (q.isLoading || !q.data) return <Page><PageHeader title={t("rideDetails")} back /><div className="space-y-3 px-5"><Skeleton className="h-40 rounded-3xl" /><Skeleton className="h-24 rounded-3xl" /></div></Page>;
  const { ride, driver, verified, vehicle, left, bookings, passengers } = q.data;
  const isDriver = ride.driver_id === user.id;
  const mine = bookings.find((b) => b.passenger_id === user.id && b.status !== "cancelled");
  const live = ride.status === "scheduled" || ride.status === "in_progress";

  return (
    <Page className="pb-40">
      <PageHeader title={t("rideDetails")} back right={ride.status !== "scheduled" ? <StatusPill status={ride.status === "completed" ? "completed" : "cancelled"} label={ride.status} /> : undefined} />
      <div className="space-y-4 px-5">
        <div className="rounded-3xl bg-gradient-hero p-5 text-primary-foreground shadow-elegant">
          <p className="text-sm text-primary-foreground/75">{fmtDate(ride.departure_at, lang)}</p>
          <div className="mt-4 space-y-3">
            <Stop label={ride.from_city} sub={ride.pickup_point} />
            {ride.stops.map((s) => <Stop key={s} label={s} small />)}
            <Stop label={ride.to_city} sub={ride.dropoff_point} end />
          </div>
          <div className="mt-5 flex items-end justify-between border-t border-primary-foreground/15 pt-4">
            <div><p className="text-3xl font-extrabold">{formatDA(ride.price_da)}</p><p className="text-xs text-primary-foreground/70">{t("perSeat")}</p></div>
            <p className="text-sm font-semibold">{left} {t("seatsLeft")}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-3xl bg-card p-4 shadow-card">
          <Avatar name={driver?.full_name ?? "?"} url={driver?.avatar_url} size={48} />
          <div className="flex-1">
            <p className="flex items-center gap-1.5 font-bold">{driver?.full_name || t("driver")} {verified && <BadgeCheck className="h-4 w-4 text-primary" />}</p>
            {vehicle && <p className="flex items-center gap-1 text-sm text-muted-foreground"><Car className="h-3.5 w-3.5" /> {vehicle.brand} {vehicle.model} · {vehicle.color}</p>}
          </div>
          {mine?.status === "accepted" && driver?.phone && <a href={`tel:${driver.phone}`} className="rounded-full bg-accent p-3 text-primary" aria-label={t("phone")}><Phone className="h-4 w-4" /></a>}
        </div>

        {!!ride.preferences.length && (
          <div className="rounded-3xl bg-card p-4 shadow-card">
            <p className="mb-2 text-sm font-bold">{t("prefs")}</p>
            <div className="flex flex-wrap gap-2">
              {ride.preferences.map((p) => <span key={p} className="rounded-full bg-accent px-3 py-1 text-xs font-medium text-primary">{PREFERENCES.find((x) => x.key === p)?.fr ?? p}</span>)}
            </div>
          </div>
        )}

        {isDriver && (
          <div className="rounded-3xl bg-card p-4 shadow-card">
            <p className="mb-3 font-bold">{t("passengers")} ({bookings.filter((b) => b.status !== "cancelled").length})</p>
            {!bookings.length && <p className="text-sm text-muted-foreground">{t("nothingYet")}</p>}
            <div className="space-y-3">
              {bookings.map((b) => {
                const p = passengers.find((x) => x.id === b.passenger_id);
                return (
                  <div key={b.id} className="rounded-2xl bg-muted p-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={p?.full_name ?? "?"} url={p?.avatar_url} />
                      <div className="flex-1"><p className="text-sm font-semibold">{p?.full_name || "Passager"}</p><p className="text-xs text-muted-foreground">{b.seats} place(s)</p></div>
                      <StatusPill status={b.status} label={t(`b_${b.status}` as TKey)} />
                    </div>
                    {live && (
                      <div className="mt-3 flex gap-2">
                        {b.status === "pending" && <>
                          <Button size="sm" variant="success" onClick={() => setBooking.mutate({ bid: b.id, status: "accepted" })}>{t("accept")}</Button>
                          <Button size="sm" variant="outline" onClick={() => setBooking.mutate({ bid: b.id, status: "rejected" })}>{t("reject")}</Button>
                        </>}
                        {b.status === "accepted" && <Button size="sm" variant="soft" onClick={() => setBooking.mutate({ bid: b.id, status: "onboard" })}>{t("markOnboard")}</Button>}
                        {p?.phone && b.status !== "rejected" && <Button size="sm" variant="ghost" asChild><a href={`tel:${p.phone}`}><Phone /> {t("phone")}</a></Button>}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-24 z-30 mx-auto max-w-md px-5">
        {isDriver ? live && (
          <div className="flex gap-2">
            <Button variant="hero" size="xl" className="flex-1" onClick={() => setRide.mutate("completed")}><Flag /> {t("completeRide")}</Button>
            <Button variant="outline" size="xl" onClick={() => confirm(t("cancelRide") + " ?") && setRide.mutate("cancelled")}>{t("cancel")}</Button>
          </div>
        ) : mine ? (
          <div className="flex items-center justify-between rounded-2xl bg-card p-4 shadow-elegant">
            <div><p className="text-xs text-muted-foreground">{t("bookingStatus")}</p><StatusPill status={mine.status} label={t(`b_${mine.status}` as TKey)} /></div>
            {(mine.status === "pending" || mine.status === "accepted") && <Button variant="outline" onClick={() => setBooking.mutate({ bid: mine.id, status: "cancelled" })}>{t("cancel")}</Button>}
          </div>
        ) : live && left > 0 && (
          <div className="flex items-center gap-3 rounded-2xl bg-card p-3 shadow-elegant">
            <div className="flex items-center gap-2">
              <Button size="icon" variant="soft" onClick={() => setSeats(Math.max(1, seats - 1))} aria-label="-"><Minus /></Button>
              <span className="w-5 text-center font-bold">{seats}</span>
              <Button size="icon" variant="soft" onClick={() => setSeats(Math.min(left, seats + 1))} aria-label="+"><Plus /></Button>
            </div>
            <Button variant="hero" size="xl" className="flex-1" disabled={book.isPending} onClick={() => book.mutate()}>
              {t("book")} · {formatDA(ride.price_da * seats)}
            </Button>
          </div>
        )}
      </div>
    </Page>
  );
}

function Stop({ label, sub, end, small }: { label: string; sub?: string | null; end?: boolean; small?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <MapPin className={small ? "mt-0.5 h-4 w-4 opacity-60" : end ? "mt-0.5 h-5 w-5" : "mt-0.5 h-5 w-5 opacity-80"} />
      <div><p className={small ? "text-sm" : "text-lg font-bold"}>{label}</p>{sub && <p className="text-xs text-primary-foreground/70">{sub}</p>}</div>
    </div>
  );
}

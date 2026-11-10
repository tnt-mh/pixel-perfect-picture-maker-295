import { supabase } from "@/integrations/supabase/client";

export type RideRow = {
  id: string; driver_id: string; from_city: string; to_city: string; departure_at: string;
  seats_total: number; price_da: number; preferences: string[]; stops: string[];
  pickup_point: string | null; dropoff_point: string | null; status: string; vehicle_id: string | null;
};

export async function attachDrivers<T extends { driver_id: string }>(rides: T[]) {
  const ids = [...new Set(rides.map((r) => r.driver_id))];
  if (!ids.length) return rides.map((r) => ({ ...r, driver: null as null | { full_name: string; avatar_url: string | null }, verified: false }));
  const [{ data: profs }, { data: vers }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, avatar_url").in("id", ids),
    supabase.from("driver_verification").select("user_id, status").in("user_id", ids),
  ]);
  return rides.map((r) => ({
    ...r,
    driver: profs?.find((p) => p.id === r.driver_id) ?? null,
    verified: vers?.find((v) => v.user_id === r.driver_id)?.status === "verified",
  }));
}

export async function seatsLeft(ride: { id: string; seats_total: number }) {
  const { data } = await supabase.rpc("seats_booked", { _ride: ride.id });
  return ride.seats_total - (data ?? 0);
}

export const fmtDate = (iso: string, lang: string) =>
  new Date(iso).toLocaleString(lang === "ar" ? "ar-DZ" : lang === "en" ? "en-GB" : "fr-FR", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

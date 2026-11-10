import { Link } from "@tanstack/react-router";
import { BadgeCheck, Users } from "lucide-react";
import { formatDA } from "@/lib/dz";
import { fmtDate } from "@/lib/rides";
import { useI18n } from "@/lib/i18n";

type Props = {
  ride: { id: string; from_city: string; to_city: string; departure_at: string; price_da: number; seats_total: number };
  driver?: { full_name: string; avatar_url: string | null } | null;
  verified?: boolean;
  seatsLeft?: number;
};

export function RideCard({ ride, driver, verified, seatsLeft }: Props) {
  const { t, lang } = useI18n();
  const d = new Date(ride.departure_at);
  return (
    <Link to="/ride/$id" params={{ id: ride.id }} className="block rounded-3xl bg-card p-4 shadow-card transition-transform active:scale-[0.99] animate-rise">
      <div className="flex items-start justify-between gap-3">
        <div className="flex gap-3">
          <div className="flex flex-col items-center pt-1">
            <span className="h-2.5 w-2.5 rounded-full border-2 border-primary" />
            <span className="my-1 h-8 w-px bg-border" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          </div>
          <div className="space-y-4">
            <div><p className="font-bold">{ride.from_city}</p><p className="text-xs text-muted-foreground">{fmtDate(ride.departure_at, lang)}</p></div>
            <p className="font-bold">{ride.to_city}</p>
          </div>
        </div>
        <div className="text-end">
          <p className="text-lg font-extrabold text-primary">{formatDA(ride.price_da)}</p>
          <p className="text-[11px] text-muted-foreground">{t("perSeat")}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t pt-3">
        <div className="flex items-center gap-2">
          <Avatar name={driver?.full_name ?? "?"} url={driver?.avatar_url} />
          <span className="text-sm font-semibold">{driver?.full_name || t("driver")}</span>
          {verified && <BadgeCheck className="h-4 w-4 text-primary" aria-label={t("verified")} />}
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3.5 w-3.5" /> {seatsLeft ?? ride.seats_total} {t("seatsLeft")}
        </span>
      </div>
      <span className="sr-only">{d.toISOString()}</span>
    </Link>
  );
}

export function Avatar({ name, url, size = 32 }: { name: string; url?: string | null | undefined; size?: number }) {
  const initials = name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return url ? (
    <img src={url} alt="" style={{ width: size, height: size }} className="rounded-full object-cover" />
  ) : (
    <span style={{ width: size, height: size }} className="flex items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">{initials || "?"}</span>
  );
}

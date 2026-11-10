import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Wallet, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type TKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Comment ça marche — Waslni" },
      { name: "description", content: "Découvrez comment Waslni relie conducteurs et passagers en Algérie." },
      { property: "og:title", content: "Comment ça marche — Waslni" },
      { property: "og:description", content: "Trouvez un trajet, partagez les frais, voyagez en confiance." },
    ],
  }),
  component: Onboarding,
});

const slides: { icon: typeof Search; t: TKey; d: TKey }[] = [
  { icon: Search, t: "ob1t", d: "ob1d" },
  { icon: Wallet, t: "ob2t", d: "ob2d" },
  { icon: ShieldCheck, t: "ob3t", d: "ob3d" },
];

function Onboarding() {
  const { t } = useI18n();
  const [i, setI] = useState(0);
  const nav = useNavigate();
  const S = slides[i] ?? slides[0]!;
  const last = i === slides.length - 1;
  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
      <div className="flex justify-end">
        <Link to="/auth" search={{ mode: "signup" }} className="text-sm font-semibold text-muted-foreground">{t("skip")}</Link>
      </div>
      <div key={i} className="flex flex-1 flex-col items-center justify-center text-center animate-rise">
        <div className="relative mb-10">
          <div className="absolute inset-0 scale-150 rounded-full bg-accent blur-2xl" />
          <div className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-gradient-primary text-primary-foreground shadow-elegant animate-float">
            <S.icon className="h-14 w-14" />
          </div>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight">{t(S.t)}</h1>
        <p className="mt-3 max-w-xs text-muted-foreground">{t(S.d)}</p>
      </div>
      <div className="mb-6 flex justify-center gap-2">
        {slides.map((_, k) => (
          <span key={k} className={cn("h-2 rounded-full transition-all", k === i ? "w-8 bg-primary" : "w-2 bg-border")} />
        ))}
      </div>
      <Button variant="hero" size="xl" className="w-full" onClick={() => (last ? nav({ to: "/auth", search: { mode: "signup" } }) : setI(i + 1))}>
        {last ? t("start") : t("next")}
      </Button>
    </div>
  );
}

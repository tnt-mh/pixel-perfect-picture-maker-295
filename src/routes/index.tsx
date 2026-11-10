import { createFileRoute, Link } from "@tanstack/react-router";
import { Car, ShieldCheck, Wallet } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Waslni — Le covoiturage rendu facile en Algérie" },
      { name: "description", content: "Trouvez un trajet ou partagez vos places libres avec des conducteurs vérifiés partout en Algérie." },
      { property: "og:title", content: "Waslni — Le covoiturage rendu facile" },
      { property: "og:description", content: "Covoiturage sûr et abordable entre les 58 wilayas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t, lang, setLang } = useI18n();
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-hero text-primary-foreground">
      <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <Logo light />
          <div className="flex rounded-full bg-primary-foreground/10 p-1 text-xs font-semibold">
            {LANGS.map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code)}
                className={cn("rounded-full px-2.5 py-1 transition-colors", lang === l.code ? "bg-primary-foreground text-primary" : "text-primary-foreground/80")}
              >
                {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-16 flex-1">
          <div className="relative mx-auto h-56 w-full">
            <svg viewBox="0 0 320 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d="M-10 170 C 80 120, 120 190, 200 120 S 300 60, 340 40" fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="34" strokeLinecap="round" />
              <path d="M-10 170 C 80 120, 120 190, 200 120 S 300 60, 340 40" fill="none" stroke="currentColor" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="8 10" />
            </svg>
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 animate-drive">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground text-primary shadow-elegant">
                <Car className="h-8 w-8" />
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight">{t("slogan")}</h1>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2 rounded-2xl bg-primary-foreground/10 p-3"><ShieldCheck className="h-5 w-5" /> {t("verified")}</div>
            <div className="flex items-center gap-2 rounded-2xl bg-primary-foreground/10 p-3"><Wallet className="h-5 w-5" /> DA</div>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <Button asChild variant="secondary" size="xl" className="w-full">
            <Link to="/onboarding">{t("start")}</Link>
          </Button>
          <Button asChild variant="glass" size="xl" className="w-full">
            <Link to="/auth" search={{ mode: "login" }}>{t("login")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

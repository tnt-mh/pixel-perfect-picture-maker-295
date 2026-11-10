import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Page, PageHeader } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { LANGS, useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({ meta: [{ title: "Mon profil — Waslni" }, { name: "description", content: "Profil et paramètres." }] }),
  component: Profile,
});

function Profile() {
  const { t, lang, setLang } = useI18n();
  const { user } = Route.useRouteContext();
  const qc = useQueryClient();
  const nav = useNavigate();
  async function out() {
    await qc.cancelQueries(); qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", search: { mode: "login" }, replace: true });
  }
  return (
    <Page>
      <PageHeader title={t("navProfile")} />
      <div className="space-y-4 px-5">
        <div className="rounded-3xl bg-card p-4 shadow-card"><p className="font-semibold">{user.email}</p></div>
        <div className="rounded-3xl bg-card p-4 shadow-card">
          <p className="mb-2 text-sm font-bold">{t("language")}</p>
          <div className="flex gap-2">
            {LANGS.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={cn("rounded-full px-3 py-1.5 text-sm", lang === l.code ? "bg-primary text-primary-foreground" : "bg-muted")}>{l.label}</button>
            ))}
          </div>
        </div>
        <Button variant="outline" className="w-full" onClick={out}>{t("logout")}</Button>
      </div>
    </Page>
  );
}

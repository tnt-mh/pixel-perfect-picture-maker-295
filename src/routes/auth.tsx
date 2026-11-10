import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/lib/i18n";
import { normalizeDzPhone } from "@/lib/dz";

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ mode: z.enum(["login", "signup"]).default("login") }),
  head: () => ({
    meta: [
      { title: "Connexion — Waslni" },
      { name: "description", content: "Connectez-vous ou créez votre compte Waslni." },
      { property: "og:title", content: "Connexion — Waslni" },
      { property: "og:description", content: "Rejoignez la communauté de covoiturage Waslni." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { mode } = Route.useSearch();
  const { t, lang } = useI18n();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [f, setF] = useState({ name: "", phone: "", email: "", password: "" });
  const signup = mode === "signup";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (signup) {
        const phone = normalizeDzPhone(f.phone);
        if (!phone) throw new Error("Numéro algérien invalide (ex. 0555 12 34 56)");
        if (f.password.length < 8) throw new Error("8 caractères minimum");
        const { error } = await supabase.auth.signUp({
          email: f.email,
          password: f.password,
          options: { emailRedirectTo: window.location.origin + "/home", data: { full_name: f.name, phone, language: lang } },
        });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email: f.email, password: f.password });
        if (error) throw error;
        nav({ to: "/home" });
      }
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col px-6 py-8 animate-rise">
      <Link to="/"><Logo /></Link>
      <h1 className="mt-10 text-3xl font-extrabold tracking-tight">{signup ? t("signup") : t("login")}</h1>
      <p className="mt-1 text-muted-foreground">{t("slogan")}</p>

      {sent ? (
        <div className="mt-8 rounded-3xl bg-accent p-6 text-center font-medium text-primary">{t("checkEmail")}</div>
      ) : (
        <form onSubmit={submit} className="mt-8 space-y-4">
          {signup && (
            <>
              <Field label={t("fullName")}>
                <Input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="h-12 rounded-xl" />
              </Field>
              <Field label={t("phone")}>
                <div className="flex gap-2">
                  <span className="flex h-12 items-center rounded-xl bg-muted px-3 text-sm font-semibold" dir="ltr">🇩🇿 +213</span>
                  <Input required inputMode="tel" placeholder="555 12 34 56" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className="h-12 rounded-xl" dir="ltr" />
                </div>
              </Field>
            </>
          )}
          <Field label={t("email")}>
            <Input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className="h-12 rounded-xl" dir="ltr" />
          </Field>
          <Field label={t("password")}>
            <Input required type="password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className="h-12 rounded-xl" dir="ltr" />
          </Field>
          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={busy}>
            {busy ? "…" : signup ? t("signup") : t("login")}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {signup ? t("haveAccount") : t("noAccount")}{" "}
        <Link to="/auth" search={{ mode: signup ? "login" : "signup" }} className="font-semibold text-primary">
          {signup ? t("login") : t("signup")}
        </Link>
      </p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-semibold">{label}</Label>
      {children}
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldAlert } from "lucide-react";
import { Page, PageHeader, EmptyState } from "@/components/AppShell";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/_authenticated/publish")({
  head: () => ({ meta: [{ title: "Publier un trajet — Waslni" }, { name: "description", content: "Proposez vos places libres." }] }),
  component: Publish,
});

function Publish() {
  const { t } = useI18n();
  return (
    <Page>
      <PageHeader title={t("publishRide")} />
      <div className="px-5">
        <EmptyState icon={<ShieldAlert />} title={t("mustVerify")}>
          <p>{t("legalWarning")}</p>
          <Link to="/profile" className="mt-3 inline-block font-semibold text-primary">{t("goVerify")}</Link>
        </EmptyState>
      </div>
    </Page>
  );
}

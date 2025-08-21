import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function LoginPage() {
  const { t } = useTranslation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [params] = useSearchParams();
  const from = params.get("from") || "/dashboard/home";

  const fakeLogin = () => {
    // ⚠️ placeholder : on branchera sur l’API plus tard
    setAuth({ id: "demo", email: "demo@walletwiz.app" }, "demo-token");
    window.location.href = from; // simple redirection
  };

  const expired = params.get("reason") === "expired";

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">{t("auth.login")}</h1>
      <p className="text-sm text-muted-foreground">
        {expired ? t("auth.sessionExpired") : t("app.welcome")}
      </p>
      <Button onClick={fakeLogin}>{t("auth.login")}</Button>
    </div>
  );
}
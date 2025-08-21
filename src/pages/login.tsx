import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "react-router-dom";

export default function LoginPage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const [params] = useSearchParams();
  const from = params.get("from") || "/dashboard/home";

  const fakeLogin = () => {
    // ⚠️ placeholder : on branchera sur l’API plus tard
    setAuth({ id: "demo", email: "demo@walletwiz.app" }, "demo-token");
    window.location.href = from; // simple redirection
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Connexion</h1>
      <p className="text-sm text-muted-foreground">
        {params.get("reason") === "expired" ? "Session expirée, merci de vous reconnecter." : "Merci de vous connecter pour accéder à votre tableau de bord."}
      </p>
      <Button onClick={fakeLogin}>Se connecter (placeholder)</Button>
    </div>
  );
}
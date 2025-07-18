import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuthService } from "@/lib/service/auth.service";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { Logo } from "../specifics/Logo";

export default function LoginForm() {
  //* Hooks
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { login } = useAuthService();

  //* State management
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  //* Handlers
  // 🔹 Gestion de la connexion
  const handleLogin = async () => {
    setLoading(true);
    const { data, error } = await login({ email, password });
    setLoading(false);

    if (error) {
      toast.error(error);
    } else if (data) {
      console.log("➡️ login response:", data);
      setAuth(data.user, data.accessToken);
      toast.success("Connexion réussie !");
      navigate("/dashboard/profile");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12 px-4 space-y-6">
      <div className="text-center">
        <Logo />
        <h1>WalletWiz</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Accède à ton tableau de bord
        </p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </Button>
      </div>
      <p className="text-sm text-center text-muted-foreground mt-4">
        Pas encore de compte ?{" "}
        <Link
          to="/auth/register"
          className="text-primary underline hover:opacity-80"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useAuthService } from "@/lib/service/auth.service";
import { toast } from 'sonner'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  //* Hooks
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const { login } = useAuthService();

  //* State management
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  //* Handlers
  // 🔹 Gestion de la connexion
    const handleLogin = async () => {
    setLoading(true)
    const { data, error } = await login({ email, password })
    setLoading(false)

    if (error) {
      toast.error(error)
    } else if (data) {
      console.log('➡️ login response:', data)
      setAuth(data.user, data.accessToken)
      toast.success('Connexion réussie !')
      navigate('/dashboard/profile')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-12 px-4 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">WalletWiz</h1>
        <p className="text-muted-foreground text-sm mt-1">Accède à ton tableau de bord</p>
      </div>

      <div className="space-y-4">
        <Input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="w-full"
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? 'Connexion...' : 'Se connecter'}
        </Button>
      </div>
    </div>
  );
}

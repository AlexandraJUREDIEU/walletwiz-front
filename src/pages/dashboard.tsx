import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Bienvenue sur WalletWiz 👋</h1>
      {user && <p className="text-gray-600">Connecté en tant que : {user.email}</p>}
      <Button onClick={logout} variant="destructive">
        Se déconnecter
      </Button>
    </div>
  )
}

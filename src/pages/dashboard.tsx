import { useAuthStore } from "@/stores/authStore";

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);

  return (
    <div className="min-h-full flex flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Bienvenue sur WalletWiz 👋</h1>
      {user && <p className="text-gray-600">Connecté en tant que : {user.email}</p>}
    </div>
  )
}

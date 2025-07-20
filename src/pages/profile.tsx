import { ProfileForm } from "@/components/forms/ProfileForm"

export default function ProfilePage() {
  return (
    <div className="p-2 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">👤 Mon Profil</h1>
      <p className="text-muted-foreground mb-6">Gérez vos informations personnelles et vos préférences</p>
      <ProfileForm />
    </div>
  )
}
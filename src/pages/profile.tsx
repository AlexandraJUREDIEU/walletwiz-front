import { ProfileForm } from "@/components/forms/ProfileForm"

export default function ProfilePage() {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">👤 My Profile</h1>
      <p className="text-muted-foreground mb-6">Manage your personal information and preferences</p>
      <ProfileForm />
    </div>
  )
}
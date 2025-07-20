import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/stores/profileStore";
import { useAuthStore } from "@/stores/authStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import type { Profile } from "@/types/profile";

export const ProfileForm = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const { profile, setProfile, clearProfile } = useProfileStore();
  const { user } = useAuthStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    status: "single",
    avatarUrl: "",
  });

  useEffect(() => {
    if (profile) {
      console.log("[Hydration] Loading profile:", profile);
      setFormData({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        email: profile.email,
        status: profile.status,
        avatarUrl: profile.avatarUrl ?? "",
      });
    } else if (user?.email) {
      setFormData((prev) => ({ ...prev, email: user.email }));
    }
  }, [profile, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProfile: Profile = {
      id: profile?.id ?? crypto.randomUUID(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      status: formData.status as Profile["status"],
      avatarUrl: formData.avatarUrl,
    };
    setProfile(newProfile);
    console.log("Submitted profile:", newProfile);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3000 * 1024) {
      // 3 Mo
      alert("Image trop volumineuse. Veuillez choisir un fichier de moins de 3 Mo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto w-full">
      {/* AVATAR */}
      <div className="flex items-center gap-4">
        <div
          className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-muted overflow-hidden border hover:opacity-80 transition cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          {formData.avatarUrl ? (
            <img
              src={formData.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Ajouter
            </div>
          )}
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            className="hidden"
            onChange={handleAvatarChange}
          />
          <p className="text-xs text-muted-foreground">
            Cliquez l’image pour modifier <br />
            (JPG/PNG - max 3 Mo)
          </p>
        </div>
      </div>

      {/* NAME */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input
            id="firstName"
            placeholder="Alexandra"
            value={formData.firstName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, firstName: e.target.value }))
            }
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="lastName">Nom</Label>
          <Input
            id="lastName"
            placeholder="Juredieu"
            value={formData.lastName}
            onChange={(e) =>
              setFormData((p) => ({ ...p, lastName: e.target.value }))
            }
          />
        </div>
      </div>

      {/* EMAIL */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          readOnly
          className="cursor-not-allowed opacity-70"
        />
      </div>

      {/* STATUS */}
      <div className="space-y-2">
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData((p) => ({ ...p, status: value as any }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Célibataire</SelectItem>
            <SelectItem value="in couple">En couple</SelectItem>
            <SelectItem value="married">Marié(e)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* BOUTONS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pt-2">
        <Button type="submit" className="w-full sm:w-auto">
          {profile ? "Mettre à jour" : "Créer mon profil"}
        </Button>
        {profile && (
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              if (
                window.confirm("Voulez-vous vraiment supprimer votre profil ?")
              ) {
                clearProfile();
              }
            }}
            className="w-full sm:w-auto"
          >
            Supprimer
          </Button>
        )}
      </div>
    </form>
  );
};

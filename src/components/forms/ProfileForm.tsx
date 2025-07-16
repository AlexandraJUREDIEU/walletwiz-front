import { useEffect, useRef, useState } from "react";
import { useProfileStore } from "@/stores/profileStore";
import { useAuthStore } from '@/stores/authStore'
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
    name: "",
    email: "",
    status: "single",
    avatarUrl: "",
  });



  useEffect(() => {
    if (profile) {
      console.log('[Hydration] Loading profile:', profile);
      setFormData({
        name: profile.name,
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
      name: formData.name,
      email: formData.email,
      status: formData.status as Profile["status"],
      avatarUrl: formData.avatarUrl,
    };
    setProfile(newProfile);
    console.log("Submitted profile:", newProfile);
  };

const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (file.size > 3000 * 1024) { // 3 Mo
    alert("Image too large. Please choose a file under 3MB.")
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    const base64 = reader.result as string
    setFormData((prev) => ({ ...prev, avatarUrl: base64 }))
  }
  reader.readAsDataURL(file)
}

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-1 text-center">
        <div className="flex justify-center">
          <div
            className="w-24 h-24 rounded-full bg-muted overflow-hidden border hover:opacity-80 transition cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {formData.avatarUrl ? (
              <img
                src={formData.avatarUrl}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Add
              </div>
            )}
          </div>
        </div>
        <input
          type="file"
          accept="image/*"
          ref={fileRef}
          className="hidden"
          onChange={handleAvatarChange}
        />
        <p className="text-sm text-muted-foreground">
          Click the avatar to upload<br/>
          Max 3MB. JPG/PNG recommended.
        </p>
      </div>

      <div>
        <Label htmlFor="name" className="pb-2">Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="email" className="pb-2">Email</Label>
        <Input
          id="email"
          value={formData.email}
          readOnly
          className="cursor-not-allowed opacity-80"
        />
      </div>

      <div>
        <Label htmlFor="status" className="pb-2">Status</Label>
        <Select
          value={formData.status ?? "single"}
          onValueChange={(value) =>
            setFormData((p) => ({ ...p, status: value as Profile["status"] }))
          }
        >
          <SelectTrigger>
             <SelectValue placeholder={profile?.status ?? "Select a status"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="in couple">In couple</SelectItem>
            <SelectItem value="married">Married</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="w-full" >
          {profile ? "Update" : "Create"}
        </Button>
        {profile && (
          <Button
            variant="destructive"
            type="button"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete your profile?")
              ) {
                clearProfile();
              }
            }}
          >
            Delete
          </Button>
        )}
      </div>
    </form>
  );
};

import { useRef, useState } from 'react';
import { useProfileStore } from '@/stores/profileStore';
import { useAuthStore } from '@/stores/authStore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { useUserService } from '@/lib/service/user.service';
import type { Profile } from '@/types/profile';

export const ProfileForm = () => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  // * Stores
  const { user } = useAuthStore();
  const { profile, setProfile, clearProfile } = useProfileStore();
  const { updateUser } = useUserService();

  // * State to manage form data
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    status: Profile['status'];
    avatarUrl: string;
  }>({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    email: profile?.email || user?.email || '',
    status: profile?.status || 'single',
    avatarUrl: profile?.avatarUrl || '',
  });

  // * Handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('Image trop volumineuse. Max 3 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFormData((prev) => ({ ...prev, avatarUrl: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = user?.id ?? '';
    console.log('🚀 ~ handleSubmit ~ user.id:', id);
    const data: Partial<typeof formData> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      status: formData.status,
    };
    const { error } = await updateUser(data, id);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Profil mis à jour avec succès ✅');
      setProfile({ ...profile, ...formData, id: profile?.id ?? '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
      <div className="space-y-1 text-center">
        <div className="flex justify-center">
          <div
            className="w-24 h-24 rounded-full bg-muted overflow-hidden border hover:opacity-80 transition cursor-pointer"
            onClick={() => fileRef.current?.click()}
          >
            {formData.avatarUrl ? (
              <img src={formData.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Ajouter
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
          Cliquez sur l’avatar pour le changer
          <br />
          Max 3 Mo. JPG/PNG recommandé.
        </p>
      </div>

      <div>
        <Label htmlFor="firstName">Prénom</Label>
        <Input
          id="firstName"
          value={formData.firstName}
          onChange={(e) => setFormData((p) => ({ ...p, firstName: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="lastName">Nom</Label>
        <Input
          id="lastName"
          value={formData.lastName}
          onChange={(e) => setFormData((p) => ({ ...p, lastName: e.target.value }))}
        />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={formData.email}
          readOnly
          className="cursor-not-allowed opacity-80"
        />
      </div>

      <div>
        <Label htmlFor="status">Statut</Label>
        <Select
          value={formData.status}
          onValueChange={(value) =>
            setFormData((p) => ({ ...p, status: value as Profile['status'] }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={profile?.status || 'Sélectionnez un statut'} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Célibataire</SelectItem>
            <SelectItem value="in couple">En couple</SelectItem>
            <SelectItem value="married">Marié(e)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className={profile ? 'w-1/2' : 'w-full'}>
          {profile ? 'Mettre à jour' : 'Créer'}
        </Button>
        {profile && (
          <Button
            className="w-1/2"
            variant="destructive"
            type="button"
            onClick={() => {
              if (window.confirm('Voulez-vous vraiment supprimer votre profil ?')) {
                clearProfile();
              }
            }}
          >
            Supprimer
          </Button>
        )}
      </div>
    </form>
  );
};

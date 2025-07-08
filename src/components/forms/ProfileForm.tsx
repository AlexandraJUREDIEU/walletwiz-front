import { useState } from 'react'
import { useProfileStore } from '@/stores/profileStore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'

export const ProfileForm = () => {
  const { profile, setProfile, updateProfile } = useProfileStore()
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    status: profile?.status || 'single',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newProfile = {
      id: profile?.id ?? crypto.randomUUID(),
      ...formData,
    }
    setProfile(newProfile)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input id="name" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" value={formData.email} onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))} />
      </div>

      <div>
        <Label htmlFor="status">Status</Label>
        <Select value={formData.status} onValueChange={(value) => setFormData((p) => ({ ...p, status: value as any }))}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="single">Single</SelectItem>
            <SelectItem value="in couple">In couple</SelectItem>
            <SelectItem value="married">Married</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit">Save</Button>
    </form>
  )
}
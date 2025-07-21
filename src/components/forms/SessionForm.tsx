import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from "sonner";
import { useSessionService } from "@/lib/service/session.service";
import { useSessionStore } from '@/stores/sessionStore'

type Props = {
  onCreated?: () => void
}
export function CreateSessionForm({ onCreated }: Props) {
  const { createSession } = useSessionService();
  const [name, setName] = useState('')
  const setCurrentSession = useSessionStore((s) => s.setCurrentSession)

  const handleCreateSession = async () => {
    console.log('Creating session with name:', name)
    const { data, error } = await createSession({ name });

    if (error) {
      toast.error(error);
    } else if (data) {
      toast.success(`Session "${data.name}" créée avec succès !`);
      setCurrentSession(data);
      setName(''); // Reset the name input
      onCreated?.(); // Call the callback if provided
    }

    
  }

  return (
    <div className="w-full max-w-md mx-auto m-4 space-y-4">
      <h2 className="text-lg font-semibold text-center">Créer une nouvelle session</h2>
        
        <div className="flex w-full max-w-sm items-center gap-2">
        <Input
            placeholder="Nom de la session"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
        />
        <Button onClick={handleCreateSession}>Créer</Button>
        </div>
        
    </div>
  )
}
import { useState } from 'react'
import { useBankStore } from '@/stores/bankStore'
import { useMemberStore } from '@/stores/memberStore' // supposé déjà existant
import type { BankAccount } from '@/types/banks'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  initialData?: BankAccount
  onSubmitCallback?: () => void
}

export function BankForm({ initialData, onSubmitCallback }: Props) {
  const isEdit = !!initialData
  const { addBank, updateBank } = useBankStore()
  const { members } = useMemberStore()

  const [name, setName] = useState(initialData?.name || '')
  const [bankName, setBankName] = useState(initialData?.bankName || '')
  const [memberIds, setMemberIds] = useState<string[]>(
    initialData?.memberIds || []
  )

  const toggleMember = (id: string) => {
    setMemberIds((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleSubmit = () => {
    const data = { name, bankName, memberIds }
    if (isEdit) {
      updateBank(initialData!.id, data)
    } else {
      addBank(data)
    }
    onSubmitCallback?.()
    setName('')
    setBankName('')
    setMemberIds([])
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="pb-2">Nom du compte</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label className="pb-2">Banque</Label>
        <Input value={bankName} onChange={(e) => setBankName(e.target.value)} />
      </div>
      <div>
        <Label className="pb-2">Membres rattachés</Label>
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <label key={m.id} className="flex items-center gap-2">
              <Checkbox
                checked={memberIds.includes(m.id)}
                onCheckedChange={() => toggleMember(m.id)}
              />
              {m.firstName} {m.lastName}
            </label>
          ))}
        </div>
      </div>
      <Button onClick={handleSubmit}>
        {isEdit ? 'Modifier' : 'Ajouter'} le compte
      </Button>
    </div>
  )
}
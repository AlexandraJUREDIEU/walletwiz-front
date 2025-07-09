import { useBankStore } from '@/stores/bankStore'
import { BankForm } from '@/components/forms/BankForm'
import { useState } from 'react'
import type { BankAccount } from '@/types/banks'
import { Button } from '@/components/ui/button'

export default function BanksPage() {
  const { banks, deleteBank } = useBankStore()
  const [editing, setEditing] = useState<BankAccount | null>(null)

  return (
    <div className="p-4 space-y-8">
      <h1 className="text-xl font-bold">Comptes bancaires</h1>

      <BankForm
        initialData={editing || undefined}
        onSubmitCallback={() => setEditing(null)}
      />

      <div className="space-y-4">
        {banks.map((bank) => (
          <div key={bank.id} className="p-4 border rounded flex justify-between">
            <div>
              <p className="font-semibold">{bank.name}</p>
              <p className="text-sm text-muted-foreground">{bank.bankName}</p>
              <p className="text-xs text-muted-foreground">
                {bank.memberIds.length > 1 ? 'Compte joint' : 'Individuel'}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setEditing(bank)}>
                Modifier
              </Button>
              <Button variant="destructive" onClick={() => deleteBank(bank.id)}>
                Supprimer
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
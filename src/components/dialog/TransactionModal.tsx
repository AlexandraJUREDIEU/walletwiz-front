import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Button
} from '@/components/ui/button'
import {
  Input
} from '@/components/ui/input'
import {
  Label
} from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { useTransactionStore } from '@/stores/transactionStore'
import type { TransactionType, TransactionCategory } from '@/types/transactions'

type Props = {
  open: boolean
  onClose: () => void
  currentBudgetMonth: string
  bankAccounts: { id: string; name: string }[] // Tu peux adapter
}

export const TransactionModal = ({
  open,
  onClose,
  currentBudgetMonth,
  bankAccounts,
}: Props) => {
  const addTransaction = useTransactionStore((s) => s.addTransaction)

  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState<TransactionCategory>('vital')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [bankAccountId, setBankAccountId] = useState(bankAccounts[0]?.id ?? '')

  const handleClose = () => {
      onClose()
      resetForm()
 }

  const handleSubmit = () => {
    if (!label || !amount || !date || !bankAccountId) return

    addTransaction({
      label,
      amount: Number(amount),
      type,
      category,
      date: date.toISOString(),
      bankAccountId,
      budgetMonth: currentBudgetMonth,
    })

    handleClose()

  }

  const resetForm = () => {
    setLabel('')
    setAmount('')
    setType('expense')
    setCategory('vital')
    setDate(new Date())
    setBankAccountId(bankAccounts[0]?.id ?? '')
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Label</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>

          <div>
            <Label>Montant</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <Label>Type</Label>
            <Select value={type} onValueChange={(val) => setType(val as TransactionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">Dépense</SelectItem>
                <SelectItem value="income">Revenu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Catégorie</Label>
            <Select
              value={category}
              onValueChange={(val) => setCategory(val as TransactionCategory)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vital">Vital</SelectItem>
                <SelectItem value="car">Voiture</SelectItem>
                <SelectItem value="leisure">Loisirs</SelectItem>
                <SelectItem value="savings">Épargne</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Date</Label>
            <Calendar mode="single" selected={date} onSelect={setDate} />
          </div>

          <div>
            <Label>Compte</Label>
            <Select
              value={bankAccountId}
              onValueChange={(val) => setBankAccountId(val)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {bankAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Valider</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
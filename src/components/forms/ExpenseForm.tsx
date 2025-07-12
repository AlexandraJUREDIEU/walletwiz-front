import { useForm } from "react-hook-form";
import { useExpenseStore } from "@/stores/expenseStore";
import { useMemberStore } from "@/stores/memberStore";
import { useBankStore } from "@/stores/bankStore";
import type { ExpenseCategory, ExpenseFrequency } from "@/types/expenses";
import type { BankAccount } from "@/types/banks";
import type { Member } from "@/types/members";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

type FormValues = {
  label: string;
  amount: number;
  dueDay: number;
  frequency: ExpenseFrequency;
  category: ExpenseCategory;
  memberIds: string[];
  bankId: string;
};

const defaultValues: FormValues = {
  label: "",
  amount: 0,
  dueDay: 1,
  frequency: "monthly",
  category: "other",
  memberIds: [],
  bankId: "",
};

export function ExpenseForm({
  onSuccess,
}: {
  onSuccess?: (shouldClose: boolean) => void;
}) {
  const { register, handleSubmit, reset, setValue, watch } =
    useForm<FormValues>({ defaultValues });
  const addExpense = useExpenseStore((s) => s.addExpense);

  const members = useMemberStore((s) => s.members);
  const banks = useBankStore((s) => s.banks);
  const memberIds = watch("memberIds");

  const submit = (data: FormValues, shouldClose: boolean) => {
    addExpense(data);
    toast.success(`Charge "${data.label}" ajoutée avec succès`);
    reset();
    if (onSuccess) onSuccess(shouldClose);
  };

  const toggleMember = (id: string) => {
    const isSelected = memberIds.includes(id);
    const updated = isSelected
      ? memberIds.filter((m) => m !== id)
      : [...memberIds, id];
    setValue("memberIds", updated);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
      <div>
        <Label className="pb-2">Label</Label>
        <Input {...register("label")} />
      </div>

      <div>
        <Label className="pb-2">Amount (€)</Label>
        <Input
          type="number"
          step="0.01"
          {...register("amount", { valueAsNumber: true })}
        />
      </div>

      <div>
        <Label className="pb-2">Due Day (1-31)</Label>
        <Input
          type="number"
          min="1"
          max="31"
          {...register("dueDay", { valueAsNumber: true })}
        />
      </div>

      <div>
        <Label className="pb-2">Frequency</Label>
        <Select
          onValueChange={(val) =>
            setValue("frequency", val as ExpenseFrequency)
          }
          defaultValue="monthly"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="monthly">Mensuelle</SelectItem>
            <SelectItem value="quarterly">Trimestrielle</SelectItem>
            <SelectItem value="yearly">Annuelle</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="pb-2">Category</Label>
        <Select
          onValueChange={(val) => setValue("category", val as ExpenseCategory)}
          defaultValue="other"
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="housing">Logement</SelectItem>
            <SelectItem value="utilities">Charges</SelectItem>
            <SelectItem value="subscriptions">Abonnements</SelectItem>
            <SelectItem value="insurance">Assurance</SelectItem>
            <SelectItem value="transport">Transport</SelectItem>
            <SelectItem value="other">Autre</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="pb-2">Members</Label>
        <div className="flex flex-wrap gap-2">
          {members.map((member: Member) => (
            <label key={member.id} className="flex items-center gap-2">
              <Checkbox
                checked={memberIds.includes(member.id)}
                onCheckedChange={() => toggleMember(member.id)}
              />
              {member.firstName}
            </label>
          ))}
        </div>
      </div>

      <div>
        <Label className="pb-2">Bank</Label>
        <Select
          onValueChange={(val) => setValue("bankId", val)}
          defaultValue=""
        >
          <SelectTrigger>
            <SelectValue placeholder="Select bank" />
          </SelectTrigger>
          <SelectContent>
            {banks.map((bank: BankAccount) => (
              <SelectItem key={bank.id} value={bank.id}>
                {bank.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button
          variant="outline"
          type="button"
          onClick={() => handleSubmit((d) => submit(d, false))()}
        >
          Ajouter & continuer
        </Button>
        <Button
          type="button"
          onClick={() => handleSubmit((d) => submit(d, true))()}
        >
          Ajouter
        </Button>
      </div>
    </form>
  );
}

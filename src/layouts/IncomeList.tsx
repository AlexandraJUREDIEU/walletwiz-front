import { useIncomeStore } from "@/stores/incomeStore";
import { useMemberStore } from "@/stores/memberStore";
import { useBankStore } from "@/stores/bankStore";
import { Button } from "@/components/ui/button";
import type { Income } from "@/types/incomes";
import { DialogEditIncome } from "@/components/dialog/DialogEditIncome";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useState } from "react";

export const IncomesList = () => {
  const incomes = useIncomeStore((s) => s.incomes);
  const deleteIncome = useIncomeStore((s) => s.deleteIncome);
  const [confirmOpen, setConfirmOpen] = useState<string | null>(null);
  const members = useMemberStore((s) => s.members);
  const banks = useBankStore((s) => s.banks);

  const getMemberName = (id: string) =>
    id === "self"
      ? "Moi"
      : members.find((m) => m.id === id)?.firstName || "Inconnu";

  const getBankName = (id: string) =>
    banks.find((b) => b.id === id)?.name || "Compte inconnu";

  return (
    <div className="space-y-2">
      {incomes.length === 0 && (
        <p className="text-muted-foreground">Aucun revenu renseigné.</p>
      )}

      {incomes.map((income: Income) => (
        <div
          key={income.id}
          className="flex justify-between items-center border p-3 rounded-md"
        >
          <div>
            <p className="font-semibold">{income.label}</p>
            <p className="text-sm text-muted-foreground">
              {income.amount.toFixed(2)} € - chaque mois le {income.day}
              <br />
              Affecté à : <strong>{getMemberName(income.memberId)}</strong>
              {" • "}
              Compte : <strong>{getBankName(income.bankId)}</strong>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DialogEditIncome income={income} />
            <Dialog
              open={confirmOpen === income.id}
              onOpenChange={(isOpen) =>
                setConfirmOpen(isOpen ? income.id : null)
              }
            >
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Supprimer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <p>
                  Confirmer la suppression du revenu{" "}
                  <strong>{income.label}</strong> ?
                </p>
                <div className="mt-4 flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setConfirmOpen(null)}>
                    Annuler
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      deleteIncome(income.id);
                      toast.success("Revenu supprimé avec succès");
                      setConfirmOpen(null);
                    }}
                  >
                    Confirmer
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ))}
    </div>
  );
};

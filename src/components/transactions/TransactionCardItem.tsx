import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2 } from "lucide-react";
import type { Transaction } from "@/types";

type Props = {
  tx: Transaction;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onToggleCleared: (tx: Transaction) => void;
  fmt: (n: number | string) => string;
};

export default function TransactionCardItem({ tx, onEdit, onDelete, onToggleCleared, fmt }: Props) {
  const isOut = tx.type === "OUTFLOW";
  const tone = isOut ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400";
  return (
    <Card>
      <CardContent className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{tx.label}</div>
            <div className="text-xs text-muted-foreground">{tx.date}</div>
            <div className="mt-1 text-xs text-muted-foreground truncate">
              {tx.bankAccountId}{tx.memberId ? ` • ${tx.memberId}` : ""}
            </div>
          </div>
          <div className={`text-base font-semibold whitespace-nowrap ${tone}`}>
            {fmt(tx.amount)}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {tx.category && <Badge variant="outline">{tx.category}</Badge>}
            {tx.isCleared && <Badge variant="secondary">Cleared</Badge>}
          </div>
          <div className="flex items-center gap-2">
            <Switch aria-label={`Toggle cleared: ${tx.label}`} checked={!!tx.isCleared} onCheckedChange={() => onToggleCleared(tx)} />
            <Button size="icon" variant="outline" onClick={() => onEdit(tx)}><Pencil className="h-4 w-4" /></Button>
            <Button size="icon" variant="destructive" onClick={() => onDelete(tx)}><Trash2 className="h-4 w-4" /></Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

import { useBankStore } from '@/stores/bankStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wallet } from 'lucide-react';

export default function BankSummary() {
  const { banks } = useBankStore();

  if (banks.length === 0) {
    return (
      <div className="p-4 bg-muted rounded-lg text-sm text-muted-foreground">
        Aucun compte bancaire renseigné pour le moment.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Comptes bancaires</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {banks.map((bank) => (
          <Card key={bank.id}>
            <CardContent className="p-4 flex items-start gap-4">
              <div className="mt-1">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{bank.name}</p>
                <p className="text-xs text-muted-foreground">{bank.bankName}</p>
                <div className="mt-2">
                  <Badge variant={bank.memberIds.length > 1 ? 'secondary' : 'outline'}>
                    {bank.memberIds.length > 1 ? 'Compte joint' : 'Compte perso'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

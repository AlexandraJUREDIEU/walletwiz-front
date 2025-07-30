import { useEffect, useState } from 'react';
import { banks, type AddBankPayload, type BankList } from '@/types/banks';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMemberService } from '@/lib/service/member.service';
import type { Member } from '@/types/members';
import { useSessionStore } from '@/stores/sessionStore';
import { useBankService } from '@/lib/service/bank.service';
type MemberWithSelected = Member & { selected?: boolean };

export function BankForm() {
  // * Recuperation de l'ID de session depuis le store
    const currentSession = useSessionStore((s) => s.currentSession);
    
  // * State pour les membres
  const [name, setName] = useState('');
  const [bankName, setBankName] = useState('');
  const [members, setMembers] = useState<MemberWithSelected[]>([]);
  const { getMembersBySession } = useMemberService();
  const { addBank } = useBankService();
  const session = currentSession;
  
  // * Callbacks
  const MembersList = async (sessionId: string) => {
    const { data, error } = await getMembersBySession(sessionId);
    if (error) {
      console.error('Error fetching members:', error);
    } else if (data) {
      const membersWithSelected = data.map((m: Member) => ({
      ...m,
      selected: false,
    }));
    setMembers(membersWithSelected);
    }
    return data;
  };

  
  // * Handlers
const handleSubmit = async () => {
  const membersId : string[] = members
    .filter(m => m.selected)
    .map(m => m.id);

  const formData: AddBankPayload = {
    name,
    bankName,
    members: membersId,
  };
  
  const { error } = await addBank(formData);
  if (error) {
    console.error('Error adding bank account:', error);
  } else {
    console.log('Bank account added successfully:', formData);
    setName('');
    setBankName('');
    setMembers([]);
  }
};

  const toggleMember = (memberId: string) => {
  setMembers((prevMembers) =>
    prevMembers.map((m) =>
      m.id === memberId
        ? { ...m, selected: !m.selected }
        : m
    )
  );
};

  useEffect(() => {
    MembersList(session?.id || '');
  }, [session?.id]);

  return (
    <div className="space-y-4">
      <div>
        <Label className="pb-2">Nom du compte</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label className="pb-2">Banque</Label>
        <Select
          value={bankName}
          onValueChange={(setBankName)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selectionner une banque" />
          </SelectTrigger>
          <SelectContent>
            {banks.map((bank: BankList[number]) => (
              <SelectItem key={bank.value} value={bank.value}>
                <img src={bank.logo} alt={bank.label} width="16" />
                {bank.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label className="pb-2">Membres rattachés</Label>
        <div className="flex flex-col gap-2">
          {members.map((m) => (
            <label key={m.id} className="flex items-center gap-2">
              <Checkbox
                checked={m.selected}
                onCheckedChange={() => toggleMember(m.id)}
              />
              {(m.firstName || m.lastName)
                  ? `${m.firstName ?? ''} ${m.lastName ?? ''}`.trim()
                  : m.email}
            </label>
          ))}
        </div>
      </div>
      <Button onClick={handleSubmit}>Ajouter un compte</Button>
    </div>
  );
}

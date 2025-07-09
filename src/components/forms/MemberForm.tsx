import { useForm } from 'react-hook-form';
import { useMemberStore } from '@/stores/memberStore';
import type { Member, MemberRole } from '@/types/members';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect } from 'react';

type FormValues = {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: MemberRole;
  isReal: boolean;
};

type FormProps = {
  defaultValues?: Member;
  onSubmitCallback?: () => void;
};

export function MemberForm({ defaultValues, onSubmitCallback }: FormProps) {
  const { addMember, updateMember } = useMemberStore();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'adult',
      isReal: true,
    },
  });

  const isEdit = !!defaultValues;

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const isReal = watch('isReal');

  const onSubmit = (data: FormValues) => {
    if (isEdit && defaultValues?.id) {
      updateMember(defaultValues.id, data);
    } else {
      addMember(data);
    }

    reset();
    onSubmitCallback?.();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="First Name" {...register('firstName', { required: true })} />
        <Input placeholder="Last Name" {...register('lastName', { required: true })} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="w-full">
          <Label>Role</Label>
          <Select
            value={watch('role')}
            onValueChange={(value: MemberRole) => setValue('role', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="owner">Owner</SelectItem>
              <SelectItem value="adult">Adult</SelectItem>
              <SelectItem value="child">Child</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 pt-6">
          <Label htmlFor="isReal">Is Real</Label>
          <Switch
            id="isReal"
            checked={isReal}
            onCheckedChange={(value) => setValue('isReal', value)}
          />
        </div>
      </div>

      {isReal && (
        <Input
          placeholder="Email (optional)"
          type="email"
          {...register('email')}
        />
      )}

      <Button type="submit">
        {isEdit ? 'Modifier le membre' : 'Ajouter le membre'}
      </Button>
    </form>
  );
}
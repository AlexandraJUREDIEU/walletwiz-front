import { useForm } from "react-hook-form";
import { useMemberStore } from "@/stores/memberStore";
import type { MemberRole } from "@/types/members";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type FormValues = {
  firstName: string;
  lastName: string;
  email?: string;
  role: MemberRole;
  isReal: boolean;
};

export function MemberForm() {
  const { addMember } = useMemberStore();
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<FormValues>({
      defaultValues: {
        isReal: true,
        role: "adult",
      },
    });

  const isReal = watch("isReal");

  const onSubmit = (data: FormValues) => {
    addMember(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input placeholder="First Name" {...register("firstName")} />
        <Input placeholder="Last Name" {...register("lastName")} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          value={watch("role")}
          onValueChange={(value) => setValue("role", value as MemberRole)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rôle" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="owner">Owner</SelectItem>
            <SelectItem value="adult">Adult</SelectItem>
            <SelectItem value="child">Child</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Label>Is Real</Label>
          <Switch {...register("isReal")} />
        </div>
      </div>

      {isReal && (
        <Input
          placeholder="Email (optional)"
          type="email"
          {...register("email")}
        />
      )}

      <Button type="submit">Add Member</Button>
    </form>
  );
}

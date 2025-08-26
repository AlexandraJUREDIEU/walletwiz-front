import type { Member } from "@/types";
import { useApi } from "../api/useApi";

//* DTO attendu par le backend */
export type InviteMemberDto = {
    sessionId: string;
    userId?: string; // si on invite un user existant
    name?: string; // si on invite un utilisateur fictif
    invitedEmail?: string; // si on invite un utilisateur par email
    role: Member["role"];
};

export type UpdateMemberDto = {
    name?: string;
    role?: Member["role"];
}

//* Response attendu par le frontend */
export type GetInviteResponse = {
    id: string;
    sessionId: string;
    invitedEmail: string;
    invitationStatus: "PENDING" | "ACCEPTED" | "DECLINED";
    invitedAt: string;
    acceptedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    session: {
        id: string;
        name: string;
    };
};


export function useMembersService() {
  const { get, post, patch, del } = useApi();

  const listBySession = (sessionId: string) =>
    get<Member[]>(`/members/session/${sessionId}`);

  const invite = (dto: InviteMemberDto) =>
    post<Member>("/members", dto); // retourne un Member (PENDING) potentiellement avec inviteToken. :contentReference[oaicite:1]{index=1}

  const update = (memberId: string, data: UpdateMemberDto) =>
    patch<Member>(`/members/${memberId}`, data); // ex: rename placeholder. :contentReference[oaicite:2]{index=2}

  const changeRole = (memberId: string, role: Member["role"]) =>
    patch<Member>(`/members/${memberId}/role`, { role }); // OWNER/COLLABORATOR/VIEWER. :contentReference[oaicite:3]{index=3}

  const revokeInvite = (memberId: string) =>
    del<void>(`/members/invite/${memberId}`); // annule une invitation PENDING. :contentReference[oaicite:4]{index=4}

  const remove = (memberId: string) =>
    del<void>(`/members/${memberId}`); // retire un membre ACCEPTED. :contentReference[oaicite:5]{index=5}

  const getInvite = (inviteToken: string) =>
    get<GetInviteResponse>(`/members/invite/${inviteToken}`); // lecture d’une invitation (publique). :contentReference[oaicite:6]{index=6}

  const acceptInvite = (inviteToken: string) =>
    post<void>(`/members/accept/${inviteToken}`, {}); // acceptation (publique). :contentReference[oaicite:7]{index=7}

  return {
    listBySession,
    invite,
    update,
    changeRole,
    revokeInvite,
    remove,
    getInvite,
    acceptInvite,
  };
}

export function makeInviteLink(token: string) {
  try {
    const origin = window?.location?.origin ?? "";
    return `${origin}/invite/${token}`;
  } catch {
    return `/invite/${token}`;
  }
}
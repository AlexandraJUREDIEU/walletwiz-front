import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSessionStore } from "@/stores/sessionStore";
import { useMembersService, makeInviteLink } from "@/lib/service/member.service";
import type { Member } from "@/types";
import { useAuthStore } from "@/stores/authStore";

export function useMembers() {
  const { currentSessionId, membersBySession: map, setMembers } = useSessionStore();
  const userIdSelf = useAuthStore?.getState?.().user?.id as string | undefined;

  // 🔹 Hooks de service appelés AU TOP-LEVEL (Rules of Hooks)
  const svc = useMembersService();

  // 🔹 Références STABLES aux fonctions de service (évite deps instables)
  const listBySessionRef   = useRef(svc.listBySession);
  const inviteRef          = useRef(svc.invite);
  const updateRef          = useRef(svc.update);
  const changeRoleRef      = useRef(svc.changeRole);
  const revokeInviteRef    = useRef(svc.revokeInvite);
  const removeRef          = useRef(svc.remove);
  const getInviteRef       = useRef(svc.getInvite);
  const acceptInviteRef    = useRef(svc.acceptInvite);

  useEffect(() => {
    listBySessionRef.current = svc.listBySession;
    inviteRef.current        = svc.invite;
    updateRef.current        = svc.update;
    changeRoleRef.current    = svc.changeRole;
    revokeInviteRef.current  = svc.revokeInvite;
    removeRef.current        = svc.remove;
    getInviteRef.current     = svc.getInvite;
    acceptInviteRef.current  = svc.acceptInvite;
  }, [svc]);

  const [loading, setLoading] = useState(false);
  const inFlightRef = useRef(false);

  const members = useMemo<Member[]>(() => {
    return currentSessionId ? map[currentSessionId] ?? [] : [];
  }, [map, currentSessionId]);

  const refresh = useCallback(
    async (sessionId?: string) => {
      const sid = sessionId ?? currentSessionId;
      if (!sid) return;
      if (inFlightRef.current) return; // StrictMode guard
      inFlightRef.current = true;
      setLoading(true);
      try {
        const list = await listBySessionRef.current(sid);
        setMembers(sid, list);
      } finally {
        setLoading(false);
        inFlightRef.current = false;
      }
    },
    [currentSessionId, setMembers]
  );

  useEffect(() => {
    void refresh(); // mount + changement de session
  }, [refresh]);

  // ---------- Guards “dernier OWNER” ----------
  function ensureNotDroppingLastOwner(targetMemberId: string, newRole?: Member["role"]) {
    const owners = members.filter(
      (m) => m.role === "OWNER" && m.invitationStatus === "ACCEPTED"
    );
    const isTargetOwnerAccepted = owners.some((m) => m.id === targetMemberId);
    const ownersCount = owners.length;

    const removingOwner = isTargetOwnerAccepted && newRole === undefined;            // remove
    const demotingOwner = isTargetOwnerAccepted && newRole && newRole !== "OWNER";  // change role

    if ((removingOwner || demotingOwner) && ownersCount <= 1) {
      throw new Error("lastOwner");
    }
    if (userIdSelf) {
      const me = members.find((m) => m.id === targetMemberId);
      if (me?.userId === userIdSelf && (removingOwner || demotingOwner) && ownersCount <= 1) {
        throw new Error("selfLastOwner");
      }
    }
  }

  // ---------- Actions haut-niveau pour l’UI ----------
  async function inviteExisting(userId: string, role: Member["role"]) {
    if (!currentSessionId) return;
    const created = await inviteRef.current({ sessionId: currentSessionId, userId, role });
    await refresh();
    return created.inviteToken ? makeInviteLink(created.inviteToken) : undefined;
  }

  async function invitePlaceholder(name: string, role: Member["role"]) {
    if (!currentSessionId) return;
    await inviteRef.current({ sessionId: currentSessionId, name, role });
    await refresh();
  }

  async function inviteWithLink(role: Member["role"], invitedEmail?: string) {
    if (!currentSessionId) return;
    const created = await inviteRef.current({ sessionId: currentSessionId, role, invitedEmail });
    await refresh();
    return created.inviteToken ? makeInviteLink(created.inviteToken) : undefined;
  }

  async function renameMember(memberId: string, name: string) {
    await updateRef.current(memberId, { name });
    await refresh();
  }

  async function changeMemberRole(memberId: string, role: Member["role"]) {
    ensureNotDroppingLastOwner(memberId, role);
    await changeRoleRef.current(memberId, role);
    await refresh();
  }

  async function revokeMemberInvite(memberId: string) {
    await revokeInviteRef.current(memberId);
    await refresh();
  }

  async function removeMember(memberId: string) {
    ensureNotDroppingLastOwner(memberId);
    await removeRef.current(memberId);
    await refresh();
  }

  async function readInvite(token: string) {
    return getInviteRef.current(token);
  }

  async function acceptInviteToken(token: string) {
    await acceptInviteRef.current(token);
    // Ensuite: refresh des sessions côté App + route vers /dashboard/home (à faire dans la page publique)
  }

  return {
    currentSessionId,
    members,
    loading,
    refresh,
    inviteExisting,
    invitePlaceholder,
    inviteWithLink,
    renameMember,
    changeMemberRole,
    revokeMemberInvite,
    removeMember,
    readInvite,
    acceptInviteToken,
  };
}

/**
 * Zustand store for managing UI loading state.
 *
 * Ce store gère un compteur `pendingCount` qui représente le nombre d'opérations asynchrones en cours.
 * - `startLoading` incrémente le compteur pour indiquer le début d'un chargement.
 * - `stopLoading` décrémente le compteur (sans jamais descendre en dessous de zéro) pour indiquer la fin d'un chargement.
 * - `isLoading` retourne `true` si au moins une opération est en cours, sinon `false`.
 *
 * Utile pour afficher des indicateurs de chargement globaux dans l'interface utilisateur.
 */
import { create } from "zustand";

type UiState = {
  pendingCount: number;
  startLoading: () => void;
  stopLoading: () => void;
  isLoading: () => boolean;
};

export const useUiStore = create<UiState>()((set, get) => ({
  pendingCount: 0,
  startLoading: () => set({ pendingCount: get().pendingCount + 1 }),
  stopLoading: () =>
    set({ pendingCount: Math.max(0, get().pendingCount - 1) }),
  isLoading: () => get().pendingCount > 0,
}));
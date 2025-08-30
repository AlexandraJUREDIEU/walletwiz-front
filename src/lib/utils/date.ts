/**
 * Utilitaire de gestion des dates
 * Permet de récupérer des plages de dates
 * @type {DateRange}  
 * @param now La date actuelle
 * @returns La plage de dates du mois en cours 
 */

export type DateRange = { from: string; to: string };

export function getCurrentMonthRange(now = new Date()): DateRange {
  const y = now.getFullYear();
  const m = now.getMonth();
  const from = new Date(y, m, 1);
  const to = new Date(y, m + 1, 0);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return { from: iso(from), to: iso(to) };
}

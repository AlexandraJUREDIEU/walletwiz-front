/**
 * Utilitaire pour formatter les nombres
 * @param value Le nombre à formater
 * @returns Le nombre formaté
 */

export function formatCurrencyEUR(value: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2,
  }).format(value);
}

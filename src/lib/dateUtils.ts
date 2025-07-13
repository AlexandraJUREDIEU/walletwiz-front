import dayjs from "./dayjs"

export function getMonthKey(date: Date = new Date()): string {
  return dayjs(date).format("YYYY-MM")
}

export function getNextMonthKey(date: Date = new Date()): string {
  return dayjs(date).add(1, "month").format("YYYY-MM")
}

export function getMonthLabel(monthKey: string): string {
  return dayjs(`${monthKey}-01`).format("MMMM YYYY")
}

export function isCurrentMonth(monthKey: string): boolean {
  return getMonthKey() === monthKey
}

export function isNextMonth(monthKey: string): boolean {
  return getNextMonthKey() === monthKey
}
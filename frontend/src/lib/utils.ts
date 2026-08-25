import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(salary: { min: number; max: number; currency: string; period?: string } | undefined): string {
  if (!salary) return 'Competitive';
  const minK = Math.round(salary.min / 1000);
  const maxK = Math.round(salary.max / 1000);
  const symbol = salary.currency === 'PHP' ? '₱' : '$';
  const period = salary.period ? `/${salary.period}` : '/mo';
  return `${symbol}${minK}k – ${symbol}${maxK}k${period}`;
}

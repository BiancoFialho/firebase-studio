import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculates the Frequency Rate (Taxa de Frequência - TF).
 * TF = (Number of accidents with lost time * 1,000,000) / Total hours worked
 * @param numberOfAccidents Number of accidents with lost time.
 * @param totalHoursWorked Total hours worked by employees in the period.
 * @returns The Frequency Rate, or null if inputs are invalid.
 */
export function calculateFrequencyRate(numberOfAccidents: number, totalHoursWorked: number): number | null {
  if (totalHoursWorked <= 0 || numberOfAccidents < 0) {
    return null; // Avoid division by zero or invalid inputs
  }
  return (numberOfAccidents * 1_000_000) / totalHoursWorked;
}

/**
 * Calculates the Severity Rate (Taxa de Gravidade - TG).
 * TG = (Total lost days * 1,000,000) / Total hours worked
 * @param totalLostDays Total number of days lost due to accidents.
 * @param totalHoursWorked Total hours worked by employees in the period.
 * @returns The Severity Rate, or null if inputs are invalid.
 */
export function calculateSeverityRate(totalLostDays: number, totalHoursWorked: number): number | null {
  if (totalHoursWorked <= 0 || totalLostDays < 0) {
    return null; // Avoid division by zero or invalid inputs
  }
  return (totalLostDays * 1_000_000) / totalHoursWorked;
}

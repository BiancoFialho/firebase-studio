// src/lib/types.ts
import type {
    Prisma,
    Employee as PrismaEmployee,
    TrainingRecord as PrismaTrainingRecord,
    PpeRecord as PrismaPpeRecord,
    AsoRecord as PrismaAsoRecord,
    ChemicalRecord as PrismaChemicalRecord,
    JsaRecord as PrismaJsaRecord,
    RiskItem as PrismaRiskItem,
    CipaMeeting as PrismaCipaMeeting,
    CipaAction as PrismaCipaAction,
    PreventiveAction as PrismaPreventiveAction,
    DocumentRecord as PrismaDocumentRecord,
    DocumentAction as PrismaDocumentAction,
    LawsuitRecord as PrismaLawsuitRecord,
    AccidentRecord as PrismaAccidentRecord,
    OccupationalDiseaseRecord as PrismaOccupationalDiseaseRecord,
} from '@prisma/client';

// --- Re-export Prisma types or create custom types based on them ---

// Use Prisma types directly for models that don't need frontend-specific additions yet
export type Employee = PrismaEmployee;
export type TrainingRecord = PrismaTrainingRecord & { employeeName?: string | null }; // Add potential denormalized fields if needed
export type PpeRecord = PrismaPpeRecord & { employeeName?: string | null };
export type AsoRecord = PrismaAsoRecord & { employeeName?: string | null };
export type ChemicalRecord = PrismaChemicalRecord;
export type JsaRecord = PrismaJsaRecord & { risks: RiskItem[] }; // Include related risks
export type RiskItem = PrismaRiskItem;
export type CipaMeetingRecord = PrismaCipaMeeting & { actionsDefined: CipaAction[] }; // Include related actions
export type CipaAction = PrismaCipaAction;
export type PreventiveAction = PrismaPreventiveAction;
export type DocumentRecord = PrismaDocumentRecord & { relatedActions: DocumentAction[] }; // Include related actions
export type DocumentAction = PrismaDocumentAction;
export type LawsuitRecord = PrismaLawsuitRecord;
export type AccidentRecord = PrismaAccidentRecord & { employeeName?: string | null }; // Use Prisma type, add optional name
export type OccupationalDiseaseRecord = PrismaOccupationalDiseaseRecord & { employeeName?: string | null };


// --- Keep Enums (if not directly using Prisma Enums on client, or for clarity) ---
// You can often import Enums directly from @prisma/client where needed
// Example: import { AccidentType } from '@prisma/client';

// Enum types (can be replaced by importing from @prisma/client in components)
export type {
    AsoExamType,
    AsoResult,
    ChemicalUnit,
    JsaStatus,
    CipaMeetingStatus,
    ActionStatus,
    PreventiveActionCategory,
    PreventiveActionFrequency,
    DocumentType,
    DocumentStatus,
    LawsuitStatus,
    AccidentType,
    AccidentCause,
    InvestigationStatus,
} from '@prisma/client';


// --- Statistics Type ---
// Keep this custom type as it aggregates data
export interface StatisticsData {
    totalHoursWorked: number;
    numberOfAccidents: number;
    totalDaysLost: number;
    tf?: number; // Taxa de Frequência
    tg?: number; // Taxa de Gravidade
    period: string; // e.g., "2024", "2024-Q3", "Julho 2024"
    fatalAccidents: number;
    activeLawsuits?: number; // Optional KPI
    cipaMeetingsHeld?: number; // Optional KPI
    occupationalDiseases?: number; // Optional KPI
}

// Type for simplified Employee used in dropdowns
export type EmployeeSelectItem = Pick<PrismaEmployee, 'id' | 'name'>;

    
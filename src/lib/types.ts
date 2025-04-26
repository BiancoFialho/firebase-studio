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
    // Import Enums directly from Prisma Client where they are defined
    // If Prisma generates enums as types (depends on generator config), import them.
    // Otherwise, use string types and potentially define TypeScript enums/union types here.
    // Assuming Prisma Client exports these:
    TrainingRecordStatus, // Example if defined by Prisma
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


// --- Re-export Prisma types or create custom types based on them ---

// Use Prisma types directly for models
export type Employee = PrismaEmployee;
export type TrainingRecord = PrismaTrainingRecord & { employeeName?: string | null, trainingTypeName?: string | null };
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


// --- Export Prisma Enums directly for type safety ---
// This allows using the defined enums from Prisma throughout the application.
// If using SQLite where enums are mapped to strings, these exports provide the valid string values.
export {
    // TrainingRecordStatus, // Assuming this exists in Prisma Client
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
};

// Define TypeScript enums/types if Prisma doesn't export them or for stricter control
// Example for TrainingRecordStatus if not exported by Prisma:
export enum TrainingStatus {
    Valido = "Valido",
    Vencido = "Vencido",
    Proximo_ao_Vencimento = "Proximo_ao_Vencimento",
}
// You would then use TrainingStatus in your component logic instead of string directly.


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

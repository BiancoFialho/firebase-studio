// src/lib/types.ts
import type {
    Prisma,
    Employee as PrismaEmployee,
    TrainingType as PrismaTrainingType, // Added TrainingType
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
    // Enums are now mapped to strings in SQLite, so we rely on string types
    // Or define TS enums if needed for validation/consistency in the frontend
} from '@prisma/client';


// --- Re-export Prisma types or create custom types based on them ---

// Use Prisma types directly for models
export type Employee = PrismaEmployee;
export type TrainingType = PrismaTrainingType; // Export TrainingType
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


// Define TypeScript enums/union types for fields previously using Prisma enums,
// as SQLite maps enums to strings. This helps maintain type safety in the frontend.
export type TrainingRecordStatus = "Valido" | "Vencido" | "Proximo_ao_Vencimento";
export type AsoExamType = "Admissional" | "Periodico" | "Demissional" | "Mudanca_de_Risco" | "Retorno_ao_Trabalho";
export type AsoResult = "Apto" | "Inapto" | "Apto_com_Restricoes";
export type ChemicalUnit = "kg" | "L" | "g" | "mL" | "unid";
export type JsaStatus = "Ativo" | "Em_Revisao" | "Arquivado";
export type CipaMeetingStatus = "Agendada" | "Realizada" | "Cancelada";
export type ActionStatus = "Pendente" | "Em_Andamento" | "Concluida" | "Atrasada";
export type PreventiveActionCategory = "Inspecao" | "Treinamento" | "Manutencao" | "EPI" | "Procedimento" | "Outro";
export type PreventiveActionFrequency = "Diaria" | "Semanal" | "Mensal" | "Trimestral" | "Semestral" | "Anual" | "Unica";
export type DocumentType = "PGR" | "PCMSO" | "PCA" | "Laudo_Ergonomico" | "Laudo_Insalubridade" | "Laudo_Periculosidade" | "Outro";
export type DocumentStatus = "Valido" | "Proximo_ao_Vencimento" | "Vencido" | "Em_Revisao";
export type LawsuitStatus = "Em_Andamento" | "Acordo" | "Finalizado_Favoravel" | "Finalizado_Desfavoravel";
export type AccidentType = "Leve" | "Grave" | "Fatal" | "Tipico" | "Trajeto";
export type AccidentCause = "Queda" | "Choque_Eletrico" | "Impacto" | "Corte" | "Projecao_Particulas" | "Quimico" | "Ergonomico" | "Biologico" | "Outro";
export type InvestigationStatus = "Pendente" | "Em_Andamento" | "Concluida";


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

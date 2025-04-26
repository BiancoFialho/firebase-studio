// src/lib/types.ts
import type { Prisma } from '@prisma/client'; // Import Prisma types if needed

// Existing types (assuming they might exist or be added later)
export interface Employee {
  id: string;
  name: string;
  department: string;
  // other employee details
}

export interface TrainingRecord {
  id: string;
  employeeName: string;
  trainingType: string;
  trainingDate: Date;
  expiryDate?: Date;
  status: 'Válido' | 'Vencido' | 'Próximo ao Vencimento';
  attendanceListUrl?: string; // Added: Link to attendance list
  certificateUrl?: string; // Added: Link to certificate
}

export interface PpeRecord {
  id: string;
  employeeName: string;
  ppeType: string;
  deliveryDate: Date;
  caNumber?: string;
  quantity: number;
  returnDate?: Date;
  status: 'Em uso' | 'Devolvido' | 'Descartado';
}

export interface AsoRecord {
  id: string;
  employeeName: string;
  examType: 'Admissional' | 'Periódico' | 'Demissional' | 'Mudança de Risco' | 'Retorno ao Trabalho';
  examDate: Date;
  expiryDate: Date;
  result: 'Apto' | 'Inapto' | 'Apto com Restrições';
  status: 'Válido' | 'Vencido' | 'Próximo ao Vencimento';
  attachmentUrl?: string;
}

export interface ChemicalRecord {
  id: string;
  productName: string;
  casNumber?: string;
  location: string;
  quantity: number;
  unit: 'kg' | 'L' | 'g' | 'mL' | 'unid.';
  sdsUrl?: string;
  lastUpdated: Date;
}

export interface JsaRecord {
  id: string;
  taskName: string;
  department: string;
  analysisDate: Date;
  reviewDate?: Date;
  status: 'Ativo' | 'Em Revisão' | 'Arquivado';
  attachmentUrl?: string;
  risks: { id: string; description: string; controls: string }[];
}


// Using Prisma types for consistency (assuming Prisma schema is defined)
export type AccidentRecord = Prisma.AccidentRecord; // Use Prisma-generated type

export interface OccupationalDiseaseRecord {
  id: string;
  employeeName: string;
  diseaseType: string; // e.g., LER/DORT, Perda Auditiva, Dermatose
  cid10Code: string;
  diagnosisDate: Date;
  relatedTask?: string; // Task associated with the disease
  medicalReportUrl?: string;
  daysOff: number;
  status: 'Ativo' | 'Recuperado' | 'Afastado'; // Current status
  pcmsoLink?: string; // Placeholder for PCMSO integration link/ID
}

export interface LawsuitRecord {
    id: string;
    processNumber: string;
    plaintiff: string; // Employee name or other party
    subject: string; // e.g., Insalubridade, Falta de EPI, Acidente
    status: 'Em Andamento' | 'Acordo' | 'Finalizado - Favorável' | 'Finalizado - Desfavorável';
    filingDate: Date;
    hearingDate?: Date;
    estimatedCost?: number;
    finalCost?: number;
    lawyer?: string;
    details: string;
    relatedNRs?: string[]; // e.g., ['NR-6', 'NR-15']
}

export interface CipaMeetingRecord {
    id: string;
    date: Date;
    participants: string[]; // List of employee names or IDs
    agenda: string; // Topics discussed
    minutesUrl?: string; // Link to digital minutes
    actionsDefined: { id: string; description: string; responsible: string; deadline?: Date; status: 'Pendente' | 'Em Andamento' | 'Concluída' }[]; // Added ID to actions
    status: 'Agendada' | 'Realizada' | 'Cancelada';
}

export interface PreventiveAction {
    id: string;
    description: string;
    category: 'Inspeção' | 'Treinamento' | 'Manutenção' | 'EPI' | 'Procedimento' | 'Outro';
    responsible: string; // Department or employee name
    frequency?: 'Diária' | 'Semanal' | 'Mensal' | 'Trimestral' | 'Semestral' | 'Anual' | 'Única';
    dueDate?: Date; // For unique actions
    lastCompletedDate?: Date;
    status: 'Pendente' | 'Em Andamento' | 'Concluída' | 'Atrasada';
    evidenceUrl?: string; // Link to evidence of completion
}

// Type for Document Management
export type DocumentType = 'PGR' | 'PCMSO' | 'PCA' | 'Laudo Ergonômico' | 'Laudo Insalubridade' | 'Laudo Periculosidade' | 'Outro';
export type DocumentStatus = 'Válido' | 'Vencido' | 'Próximo ao Vencimento' | 'Em Revisão';

export interface DocumentRecord {
    id: string;
    documentType: DocumentType;
    title: string; // e.g., "PGR Nery Mecatrônica 2024"
    issueDate: Date;
    expiryDate: Date; // Expiration or next review date
    responsible: string; // e.g., "SESMT", "Eng. Bianco"
    status: DocumentStatus;
    attachmentUrl?: string; // Link to the actual document
    relatedActions: { id: string; description: string; responsible: string; deadline?: Date; status: 'Pendente' | 'Em Andamento' | 'Concluída' }[]; // Simplified action tracking
}


// For Statistics calculation
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

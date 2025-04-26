// src/lib/types.ts

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


// New types for the requested modules

export type AccidentType = 'Leve' | 'Grave' | 'Fatal' | 'Trajeto' | 'Típico';
export type AccidentCause = 'Queda' | 'Choque Elétrico' | 'Impacto' | 'Corte' | 'Projeção Partículas' | 'Químico' | 'Ergonômico' | 'Biológico' | 'Outro';

export interface AccidentRecord {
  id: string;
  date: Date;
  time?: string; // Optional time
  employeeName: string; // Or link to Employee object
  department: string;
  location: string; // Specific area
  type: AccidentType;
  cause: AccidentCause;
  causeDetails?: string; // Description if 'Outro' or more detail
  daysOff: number; // Days of absence
  description: string; // Detailed description of the event
  cid10Code?: string; // Optional: For related illness/injury
  catIssued: boolean; // Comunicação de Acidente de Trabalho issued?
  investigationStatus: 'Pendente' | 'Em Andamento' | 'Concluída';
  reportUrl?: string; // Link to investigation report
}

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

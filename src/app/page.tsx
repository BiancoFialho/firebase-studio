
// src/app/page.tsx
'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { HardHat, ShieldCheck, Stethoscope, AlertTriangle, CheckCircle, Clock, Activity, Bug, Scale, Users, TrendingUp, TrendingDown, Calculator, Landmark, Target, FileCheck2, ListChecks } from 'lucide-react'; // Added ListChecks
import type { AccidentRecord, OccupationalDiseaseRecord, LawsuitRecord, CipaMeetingRecord, StatisticsData, PreventiveAction } from '@/lib/types';
import { calculateFrequencyRate, calculateSeverityRate } from '@/lib/utils';
import { PieChart, Pie, Cell } from 'recharts';
import { LineChart, Line } from 'recharts';
import Link from 'next/link'; // Import Link
import { Button } from '@/components/ui/button'; // Import Button

// --- Mock Data - Replace with actual data fetching and processing ---
// Assume this data comes from respective pages or a central service

const mockAccidents: AccidentRecord[] = [
    { id: 'acc1', date: new Date(2024, 0, 15), employeeName: 'Carlos Pereira', department: 'Produção', location: 'Máquina XPTO', type: 'Leve', cause: 'Corte', daysOff: 2, description: 'Corte superficial no dedo ao manusear peça.', catIssued: true, investigationStatus: 'Concluida' },
    { id: 'acc3', date: new Date(2024, 4, 20), time: '10:30', employeeName: 'João Silva', department: 'Manutenção', location: 'Painel Elétrico Z', type: 'Grave', cause: 'Choque_Eletrico', daysOff: 15, description: 'Contato acidental com fiação exposta durante manutenção.', catIssued: true, investigationStatus: 'Em_Andamento', cid10Code: 'T75.4' },
    { id: 'acc5', date: new Date(2024, 6, 10), employeeName: 'Ana Costa', department: 'Logística', location: 'Empilhadeira 2', type: 'Leve', cause: 'Impacto', daysOff: 0, description: 'Colisão leve com prateleira.', catIssued: false, investigationStatus: 'Concluida' },
    { id: 'acc6', date: new Date(2024, 7, 10), employeeName: 'Ana Costa', department: 'Logística', location: 'Empilhadeira 2', type: 'Leve', cause: 'Impacto', daysOff: 0, description: 'Colisão leve com prateleira.', catIssued: false, investigationStatus: 'Concluida' },
    { id: 'acc7', date: new Date(2024, 7, 10), employeeName: 'Ana Costa', department: 'Logística', location: 'Empilhadeira 2', type: 'Leve', cause: 'Corte', daysOff: 0, description: 'Colisão leve com prateleira.', catIssued: false, investigationStatus: 'Concluida' },
    // Add more relevant accidents for the current period (e.g., 2024)
];
const mockDiseases: OccupationalDiseaseRecord[] = [
    { id: 'dis1', employeeName: 'Maria Oliveira', diseaseType: 'LER/DORT', cid10Code: 'M77.1', diagnosisDate: new Date(2023, 9, 10), relatedTask: 'Digitação', daysOff: 30, status: 'Afastado', medicalReportUrl: 'https://example.com/report/ler-maria' },
    { id: 'dis3', employeeName: 'Ana Costa', diseaseType: 'Dermatose Ocupacional', cid10Code: 'L23.5', diagnosisDate: new Date(2024, 5, 5), relatedTask: 'Manuseio de Químicos', daysOff: 7, status: 'Recuperado' },
];
const mockLawsuits: LawsuitRecord[] = [
    { id: 'law1', processNumber: '0012345-67.2024.5.15.0001', plaintiff: 'João Silva', subject: 'Insalubridade - Ruído', status: 'Em_Andamento', filingDate: new Date(2024, 1, 10), hearingDate: new Date(2024, 8, 15), estimatedCost: 15000, details: 'Reclama adicional de insalubridade por exposição a ruído acima dos limites na linha de produção X.', relatedNRs: ['NR-15'] },
    { id: 'law2', processNumber: '0098765-43.2023.5.15.0002', plaintiff: 'Maria Oliveira', subject: 'Acidente de Trabalho - Falta de EPI', status: 'Acordo', filingDate: new Date(2023, 5, 20), finalCost: 8000, details: 'Acordo realizado referente a acidente ocorrido por suposta falta de luvas adequadas.', relatedNRs: ['NR-6'] },
];
const mockCipaMeetings: CipaMeetingRecord[] = [
    { id: 'cipa1', date: new Date(2024, 6, 10), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira'], agenda: 'Discussão sobre EPIs, análise de incidente leve.', status: 'Realizada', actionsDefined: [{ id: 'act1', description: 'Verificar validade dos protetores auriculares', responsible: 'Almoxarifado', deadline: new Date(2024, 6, 17), status: 'Concluida' }] },
    { id: 'cipa2', date: new Date(2024, 5, 12), participants: ['João Silva', 'Maria Oliveira', 'Ana Costa'], agenda: 'Planejamento SIPAT, riscos ergonômicos.', status: 'Realizada', minutesUrl: 'https://example.com/cipa/ata-junho', actionsDefined: [{ id: 'act2', description: 'Contratar palestra sobre ergonomia', responsible: 'RH', deadline: new Date(2024, 7, 1), status: 'Em_Andamento' }] },
    { id: 'cipa3', date: new Date(2024, 7, 14), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira', 'Ana Costa', 'Pedro Santos'], agenda: 'Próxima reunião ordinária.', status: 'Agendada', actionsDefined: [] },
];
const mockHoursWorked = 500000; // Example HHT for the period (e.g., YTD 2024)
const NATIONAL_TF_AVERAGE = 14.3; // Example national average TF (adjust per industry/year)
const NATIONAL_FATALITIES_2022 = 2538; // National data (example)
const NATIONAL_ACCIDENTS_2022 = 612920; // National data (example)
const COMPANY_TF_TARGET = 15; // Company specific target for TF
const mockPreventiveActions: PreventiveAction[] = [
  { id: 'pa1', description: 'Verificar validade dos protetores auriculares', category: 'EPI', responsible: 'Almoxarifado', dueDate: new Date(2024, 6, 17), status: 'Concluida', lastCompletedDate: new Date(2024, 6, 10) },
  { id: 'pa2', description: 'Contratar palestra sobre ergonomia', category: 'Treinamento', responsible: 'RH', dueDate: new Date(2024, 7, 1), status: 'Em_Andamento', lastCompletedDate: new Date(2024, 5, 12) },
  { id: 'pa3', description: 'Revisar os extintores de incêndio.', category: 'Inspeção', responsible: 'Segurança', dueDate: new Date(2024, 8, 1), status: 'Em_Andamento', lastCompletedDate: new Date(2024, 7, 1) },
  { id: 'pa4', description: 'Verificar validade do treinamento de NR-35.', category: 'Treinamento', responsible: 'Segurança', dueDate: new Date(2024, 5, 17), status: 'Concluida', lastCompletedDate: new Date(2024, 5, 10) },
  { id: 'pa5', description: 'Criar um laudo ergonômico.', category: 'Documento', responsible: 'Segurança', dueDate: new Date(2023, 12, 17), status: 'Concluida', lastCompletedDate: new Date(2023, 11, 10) },
  { id: 'pa6', description: 'Manutenção da empilhadeira', category: 'Manutenção', responsible: 'Manutenção', dueDate: new Date(2023, 11, 17), status: 'Atrasada', lastCompletedDate: new Date(2023, 11, 10) },
  { id: 'pa7', description: 'Treinamento de brigada de incendio', category: 'Treinamento', responsible: 'Segurança', dueDate: new Date(2024, 1, 17), status: 'Concluida', lastCompletedDate: new Date(2023, 12, 10) },
];

// Mock Compliance Data (from action-plan page)
interface ComplianceItem {
    nr: string;
    description: string;
    status: 'Conforme' | 'Requer Atenção' | 'Não Conforme' | 'Não Aplicável';
    details: string;
    lastCheck?: Date;
    evidenceUrl?: string;
}

const complianceStatus: ComplianceItem[] = [
    { nr: 'NR-6', description: 'Equipamento de Proteção Individual - EPI', status: 'Conforme', details: 'Fichas de EPI atualizadas, CA válidos para EPIs em uso.', lastCheck: new Date(2024, 6, 1), evidenceUrl: '/docs/epi-check.pdf' },
    { nr: 'NR-7', description: 'Programa de Controle Médico de Saúde Ocupacional - PCMSO', status: 'Conforme', details: 'ASOs em dia, programa implementado e coordenado por médico responsável.', lastCheck: new Date(2024, 5, 20)},
    { nr: 'NR-9', description: 'Avaliação e Controle das Exposições Ocupacionais a Agentes Físicos, Químicos e Biológicos (PGR)', status: 'Requer Atenção', details: 'Revisão anual do PGR pendente (prazo: 30/08/2024). Inventário de Riscos atualizado.', lastCheck: new Date(2023, 8, 15) },
    { nr: 'NR-15', description: 'Atividades e Operações Insalubres', status: 'Conforme', details: 'Laudos de insalubridade (ruído, químicos) atualizados. Medidas de controle implementadas.', lastCheck: new Date(2024, 4, 10), evidenceUrl: '/docs/laudo-insalubridade.pdf' },
    { nr: 'NR-17', description: 'Ergonomia', status: 'Requer Atenção', details: 'Análise Ergonômica do Trabalho (AET) da linha de montagem desatualizada.', lastCheck: new Date(2023, 1, 5) },
    { nr: 'NR-35', description: 'Trabalho em Altura', status: 'Conforme', details: 'Treinamentos válidos, procedimentos de permissão de trabalho (PT) em uso, equipamentos inspecionados.', lastCheck: new Date(2024, 6, 5) },
];


// --- Chart Configurations ---
const trainingsData = [// Example data, fetch from trainings page/service
    { month: 'Jan', count: 12 }, { month: 'Fev', count: 18 }, { month: 'Mar', count: 15 },
    { month: 'Abr', count: 22 }, { month: 'Mai', count: 19 }, { month: 'Jun', count: 25 },
];
const asoStatusData = [ // Example data, fetch from asos page/service
  { name: 'Válido', value: 95, fill: "hsl(var(--chart-1))" },
  { name: 'Próximo Venc.', value: 3, fill: "hsl(var(--chart-2))" },
  { name: 'Vencido', value: 2, fill: "hsl(var(--destructive))" },
];


const trainingsChartConfig = { count: { label: "Treinamentos", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
const asoChartConfig = {
    value: { label: "Quantidade" }, Válido: { label: "Válido", color: "hsl(var(--chart-1))" },
    "Próximo Venc.": { label: "Próximo Venc.", color: "hsl(var(--chart-2))" }, Vencido: { label: "Vencido", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;
const incidentChartConfig = { incidents: { label: "Acidentes", color: "hsl(var(--destructive))" } } satisfies ChartConfig;


export default function HomePage() {
  // Calculate Statistics - Moved inside the component
  const calculatedStats = useMemo((): StatisticsData => {
      const currentYear = new Date().getFullYear();
      // Filter data for the current year for KPIs (adjust period as needed)
      const periodAccidents = mockAccidents.filter(a => a.date.getFullYear() === currentYear);
      const numberOfAccidents = periodAccidents.length;
      const accidentsWithLostTime = periodAccidents.filter(a => a.daysOff > 0).length;
      const totalDaysLost = periodAccidents.reduce((sum, acc) => sum + acc.daysOff, 0);
      const fatalAccidents = periodAccidents.filter(a => a.type === 'Fatal').length;

      const tf = calculateFrequencyRate(accidentsWithLostTime, mockHoursWorked);
      const tg = calculateSeverityRate(totalDaysLost, mockHoursWorked);

      // Calculate common accident types
      const commonAccidentTypes = periodAccidents.reduce((acc, curr) => {
        acc[curr.cause] = (acc[curr.cause] || 0) + 1;
            return acc;
        }, {} as { [key: string]: number });

        // Calculate CIPA meeting status counts
        const cipaMeetingsStatus = mockCipaMeetings.reduce((acc, curr) => {
            if (curr.status === 'Agendada') {
                acc.Agendada = (acc.Agendada || 0) + 1; // Fix property name
            } else if (curr.status === 'Realizada') {
                acc.Realizada = (acc.Realizada || 0) + 1;
            } else if (curr.status === 'Cancelada') {
                acc.Cancelada = (acc.Cancelada || 0) + 1;
            }
            return acc;
        }, {} as { Agendada?: number; Realizada?: number; Cancelada?: number });

        // Calculate overdue and completed preventive actions
        const preventiveActionsOverdue = mockPreventiveActions.filter(a => a.status === 'Atrasada').length;
        const preventiveActionsCompletedCurrentYear = mockPreventiveActions.filter(pa => {
          const currentYear = new Date().getFullYear();
            return pa.status === 'Concluida' && pa.lastCompletedDate?.getFullYear() === currentYear // Use lastCompletedDate
        }).length;


      return {
        totalHoursWorked: mockHoursWorked,
        numberOfAccidents,
        totalDaysLost,
        tf,
        tg,
        period: `Ano ${currentYear}`, // Example period label
        fatalAccidents: fatalAccidents,
        // Optional: Add these if needed for display, fetching mock data
        commonAccidentTypes,
          activeLawsuits: mockLawsuits.filter(l => l.status === 'Em_Andamento').length,
            cipaMeetingsHeld: mockCipaMeetings.filter(m => m.status === 'Realizada' && m.date.getFullYear() === currentYear).length,
            occupationalDiseases: mockDiseases.filter(d => d.diagnosisDate.getFullYear() === currentYear).length,
            cipaMeetingsStatus,
            preventiveActionsOverdue,
        preventiveActionsCompleted: preventiveActionsCompletedCurrentYear


      };
  }, []); // Removed dependencies as they are mock data defined outside

  // Prepare incident trend data inside the component or move outside if static
  const incidentTrendData = useMemo(() => [
      { month: 'Jan', incidents: mockAccidents.filter(a => a.date.getMonth() === 0 && a.date.getFullYear() === new Date().getFullYear()).length },
      { month: 'Fev', incidents: mockAccidents.filter(a => a.date.getMonth() === 1 && a.date.getFullYear() === new Date().getFullYear()).length },
      { month: 'Mar', incidents: mockAccidents.filter(a => a.date.getMonth() === 2 && a.date.getFullYear() === new Date().getFullYear()).length },
      { month: 'Abr', incidents: mockAccidents.filter(a => a.date.getMonth() === 3 && a.date.getFullYear() === new Date().getFullYear()).length },
      { month: 'Mai', incidents: mockAccidents.filter(a => a.date.getMonth() === 4 && a.date.getFullYear() === new Date().getFullYear()).length },
      { month: 'Jun', incidents: mockAccidents.filter(a => a.date.getMonth() === 5 && a.date.getFullYear() === new Date().getFullYear()).length },
      // Add more months as needed or make dynamic
  ], []); // Removed dependency as mockAccidents is defined outside

  // Calculate comparisons for KPIs
  const tfComparison = calculatedStats.tf !== null && calculatedStats.tf > NATIONAL_TF_AVERAGE ? 'Acima da média BR' : 'Abaixo/Igual média BR';
  const tfComparisonColor = calculatedStats.tf !== null && calculatedStats.tf > NATIONAL_TF_AVERAGE ? 'text-destructive' : 'text-green-600';
  const tfTargetComparison = calculatedStats.tf !== null && calculatedStats.tf > COMPANY_TF_TARGET ? 'Acima da Meta' : 'Abaixo/Igual à Meta';
  const tfTargetComparisonColor = calculatedStats.tf !== null && calculatedStats.tf > COMPANY_TF_TARGET ? 'text-destructive' : 'text-green-600';

  const getComplianceBadgeVariant = (status: ComplianceItem['status']): "default" | "secondary" | "destructive" | "outline" => {
       if (status === 'Conforme') return 'default'; // Green/Primary
       if (status === 'Requer Atenção') return 'secondary'; // Orange/Yellow
       if (status === 'Não Conforme') return 'destructive'; // Red
       return 'outline'; // Grey for Not Applicable
   };

   const overdueActions = mockPreventiveActions.filter(a => a.status === 'Atrasada');
   const upcomingActions = mockPreventiveActions.filter(a => a.status === 'Pendente' || a.status === 'Em_Andamento');


  return (
    // Adjusted main container spacing
    <div className="space-y-8 xl:space-y-10">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard BI - Indicadores Chave (KPIs)</h1>
      <p className="text-muted-foreground">
        Análise visual dos indicadores chave de Segurança, Saúde e Meio Ambiente ({calculatedStats.period}).
      </p>

      {/* --- KPI Row --- Adjusted grid for responsiveness */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
         <Card className="bg-card border-l-4 border-destructive">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Acidentes no Período</CardTitle>
             <Activity className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.numberOfAccidents}</div>
             <p className="text-xs text-muted-foreground">
                 ({NATIONAL_ACCIDENTS_2022.toLocaleString('pt-BR')} no Brasil em 2022)
             </p>
           </CardContent>
         </Card>
         <Card className="bg-card border-l-4 border-destructive">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Óbitos</CardTitle>
             <Bug className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className={`text-2xl font-bold ${calculatedStats.fatalAccidents > 0 ? 'text-destructive' : 'text-green-600'}`}>
                 {calculatedStats.fatalAccidents}
             </div>
             <p className="text-xs text-muted-foreground">
                (Meta: 0 / {NATIONAL_FATALITIES_2022.toLocaleString('pt-BR')} óbitos no BR em 2022)
             </p>
           </CardContent>
         </Card>
        <Card className={`bg-card border-l-4 ${calculatedStats.tf !== null && calculatedStats.tf > COMPANY_TF_TARGET ? 'border-destructive' : 'border-green-600'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Frequência (TF)</CardTitle>
             <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedStats.tf?.toFixed(2) ?? 'N/A'}</div>
            <p className={`text-xs ${tfTargetComparisonColor}`}>
                 {tfTargetComparison} ({COMPANY_TF_TARGET})
            </p>
            <p className={`text-xs ${tfComparisonColor}`}>
                 {tfComparison} (Média BR: {NATIONAL_TF_AVERAGE.toFixed(1)})
            </p>
          </CardContent>
        </Card>
         <Card className="bg-card border-l-4 border-orange-500">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Dias Perdidos</CardTitle>
             <TrendingDown className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.totalDaysLost}</div>
             <p className="text-xs text-muted-foreground">TG: {calculatedStats.tg?.toFixed(2) ?? 'N/A'}</p>
             <p className="text-xs text-muted-foreground">Total de dias de afastamento</p>
           </CardContent>
         </Card>
         <Card className="bg-card border-l-4 border-blue-500">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Ações Trabalhistas Ativas</CardTitle>
             <Landmark className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.activeLawsuits}</div>
              <p className="text-xs text-muted-foreground">Processos em andamento</p>
           </CardContent>
         </Card>
          <Card className="bg-card border-l-4 border-blue-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reuniões CIPA</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-lg font-bold">Agendadas: {calculatedStats.cipaMeetingsStatus?.Agendada ?? '0'}</div>
                  <div className="text-lg font-bold">Realizadas: {calculatedStats.cipaMeetingsStatus?.Realizada ?? '0'}</div>
                  <div className="text-lg font-bold">Canceladas: {calculatedStats.cipaMeetingsStatus?.Cancelada ?? '0'}</div>
              </CardContent>
          </Card>
          <Card className="bg-card border-l-4 border-orange-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ações Prev. Atrasadas</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{calculatedStats.preventiveActionsOverdue}</div>
                   <p className="text-xs text-muted-foreground">Ações preventivas pendentes</p>
              </CardContent>
          </Card>
          <Card className="bg-card border-l-4 border-green-500">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ações Prev. Concluídas</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{calculatedStats.preventiveActionsCompleted}</div>
                   <p className="text-xs text-muted-foreground">No ano atual</p>
              </CardContent>
          </Card>
      </div>

      {/* --- Charts and Tables Row --- Adjusted grid for better spacing */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3 xl:gap-8">

          {/* Accident Trend Chart */}
          <Card className="xl:col-span-2">
              <CardHeader>
                  <CardTitle>Tendência de Acidentes</CardTitle>
                  <CardDescription>Número de acidentes registrados por mês ({calculatedStats.period}).</CardDescription>
              </CardHeader>
              <CardContent>
                  <ChartContainer config={incidentChartConfig} className="h-[300px] w-full">
                      <LineChart data={incidentTrendData} margin={{ left: 12, right: 12 }} accessibilityLayer>
                          <CartesianGrid vertical={false} />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} />
                          <YAxis allowDecimals={false} />
                          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                          <ChartLegend content={<ChartLegendContent />} />
                          <Line dataKey="incidents" type="monotone" stroke="var(--color-incidents)" strokeWidth={2} dot={true} />
                      </LineChart>
                  </ChartContainer>
              </CardContent>
          </Card>

          {/* ASO Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Status dos ASOs</CardTitle>
              <CardDescription>Distribuição percentual dos ASOs por status (exemplo).</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center pb-0 pt-4">
               <ChartContainer config={asoChartConfig} className="mx-auto aspect-square h-[250px]">
                 <PieChart>
                    <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                   <Pie data={asoStatusData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                       {asoStatusData.map((entry, index) => ( <Cell key={`cell-${index}`} fill={entry.fill} /> ))}
                   </Pie>
                    <ChartLegend content={<ChartLegendContent nameKey="name" className="flex -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />} />
                 </PieChart>
               </ChartContainer>
            </CardContent>
          </Card>


         {/* Action Plan / Compliance Table */}
         <Card className="xl:col-span-3">
             <CardHeader>
                 <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                         <FileCheck2 className="w-5 h-5"/>
                         <CardTitle>Plano de Ação / Conformidade NR</CardTitle>
                     </div>
                      <Button size="sm" variant="outline" asChild>
                           <Link href="/action-plan">Ver Plano Completo</Link>
                      </Button>
                 </div>
                 <CardDescription>Status de conformidade e ações pendentes recentes.</CardDescription>
             </CardHeader>
             <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>NR</TableHead>
                                  <TableHead>Descrição</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Detalhes/Observações</TableHead>
                                  <TableHead>Última Verificação</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {complianceStatus.slice(0, 5).map((item) => ( // Show only first 5 for brevity
                                  <TableRow key={item.nr}>
                                      <TableCell className="font-medium">{item.nr}</TableCell>
                                      <TableCell>{item.description}</TableCell>
                                      <TableCell>
                                          <Badge variant={getComplianceBadgeVariant(item.status)}>{item.status}</Badge>
                                      </TableCell>
                                      <TableCell className="max-w-xs truncate">{item.details}</TableCell>
                                      <TableCell>{item.lastCheck?.toLocaleDateString('pt-BR') || '-'}</TableCell>
                                  </TableRow>
                              ))}
                               <TableRow>
                                   <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-3">
                                       <Link href="/action-plan" className="hover:underline">Ver todos os itens de conformidade...</Link>
                                   </TableCell>
                               </TableRow>
                          </TableBody>
                      </Table>
                  </div>
             </CardContent>
          </Card>

          {/* Overdue Preventive Actions */}
         <Card className="lg:col-span-1 xl:col-span-2">
             <CardHeader>
                  <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                           <AlertTriangle className="w-5 h-5 text-destructive"/>
                           <CardTitle>Ações Preventivas Atrasadas</CardTitle>
                     </div>
                      <Button size="sm" variant="outline" asChild>
                           <Link href="/prevention">Ver Todas Ações</Link>
                      </Button>
                   </div>
                   <CardDescription>Ações preventivas que passaram do prazo.</CardDescription>
             </CardHeader>
             <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Descrição</TableHead>
                                  <TableHead>Responsável</TableHead>
                                  <TableHead>Prazo</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {overdueActions.length > 0 ? overdueActions.slice(0, 3).map((action) => (
                                  <TableRow key={action.id} className="bg-destructive/10">
                                      <TableCell className="font-medium max-w-xs truncate" title={action.description}>{action.description}</TableCell>
                                      <TableCell>{action.responsible}</TableCell>
                                      <TableCell>{action.dueDate?.toLocaleDateString('pt-BR') || 'N/A'}</TableCell>
                                  </TableRow>
                              )) : (
                                 <TableRow>
                                      <TableCell colSpan={3} className="h-20 text-center text-muted-foreground">Nenhuma ação atrasada. ✅</TableCell>
                                  </TableRow>
                              )}
                          </TableBody>
                      </Table>
                  </div>
             </CardContent>
         </Card>

          {/* Upcoming Preventive Actions */}
         <Card className="lg:col-span-1 xl:col-span-1">
             <CardHeader>
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                          <ListChecks className="w-5 h-5"/>
                          <CardTitle>Próximas Ações Prev.</CardTitle>
                      </div>
                   </div>
                  <CardDescription>Ações preventivas pendentes ou em andamento.</CardDescription>
             </CardHeader>
             <CardContent>
                   <div className="border rounded-lg overflow-hidden">
                       <Table>
                           <TableHeader>
                               <TableRow>
                                   <TableHead>Descrição</TableHead>
                                   <TableHead>Prazo</TableHead>
                               </TableRow>
                           </TableHeader>
                           <TableBody>
                               {upcomingActions.length > 0 ? upcomingActions.slice(0, 3).map((action) => (
                                   <TableRow key={action.id}>
                                       <TableCell className="font-medium max-w-xs truncate" title={action.description}>{action.description}</TableCell>
                                       <TableCell>{action.dueDate?.toLocaleDateString('pt-BR') || action.frequency || 'N/A'}</TableCell>
                                   </TableRow>
                               )) : (
                                  <TableRow>
                                      <TableCell colSpan={2} className="h-20 text-center text-muted-foreground">Nenhuma ação pendente.</TableCell>
                                  </TableRow>
                               )}
                           </TableBody>
                       </Table>
                       {upcomingActions.length > 3 && (
                            <div className="text-center py-2">
                               <Button variant="link" size="sm" asChild>
                                  <Link href="/prevention">Ver mais...</Link>
                               </Button>
                           </div>
                       )}
                   </div>
             </CardContent>
         </Card>



      </div>


       {/* --- Footer Notes --- */}
       <p className="text-xs text-center text-muted-foreground pt-4">* Média nacional de TF pode variar por setor e ano. Valor exemplificativo.</p>

    </div>
  );
}

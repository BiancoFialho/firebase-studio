// src/app/dashboard/page.tsx
'use client';

import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { HardHat, ShieldCheck, Stethoscope, AlertTriangle, CheckCircle, Clock, Activity, Bug, Scale, Users, TrendingUp, TrendingDown, Calculator, Landmark, Target } from 'lucide-react'; // Added Target, Landmark
import type { AccidentRecord, OccupationalDiseaseRecord, LawsuitRecord, CipaMeetingRecord, StatisticsData } from '@/lib/types';
import { calculateFrequencyRate, calculateSeverityRate } from '@/lib/utils';

// --- Mock Data - Replace with actual data fetching and processing ---
// Assume this data comes from respective pages or a central service

const mockAccidents: AccidentRecord[] = [
  { id: 'acc1', date: new Date(2024, 0, 15), employeeName: 'Carlos Pereira', department: 'Produção', location: 'Máquina XPTO', type: 'Leve', cause: 'Corte', daysOff: 2, description: 'Corte superficial no dedo ao manusear peça.', catIssued: true, investigationStatus: 'Concluída' },
  { id: 'acc3', date: new Date(2024, 4, 20), time: '10:30', employeeName: 'João Silva', department: 'Manutenção', location: 'Painel Elétrico Z', type: 'Grave', cause: 'Choque Elétrico', daysOff: 15, description: 'Contato acidental com fiação exposta durante manutenção.', catIssued: true, investigationStatus: 'Em Andamento', cid10Code: 'T75.4' },
  { id: 'acc5', date: new Date(2024, 6, 10), employeeName: 'Ana Costa', department: 'Logística', location: 'Empilhadeira 2', type: 'Leve', cause: 'Impacto', daysOff: 0, description: 'Colisão leve com prateleira.', catIssued: false, investigationStatus: 'Concluída' },
  // Add more relevant accidents for the current period (e.g., 2024)
];
const mockDiseases: OccupationalDiseaseRecord[] = [
    { id: 'dis1', employeeName: 'Maria Oliveira', diseaseType: 'LER/DORT', cid10Code: 'M77.1', diagnosisDate: new Date(2023, 9, 10), relatedTask: 'Digitação', daysOff: 30, status: 'Afastado', medicalReportUrl: 'https://example.com/report/ler-maria' },
    { id: 'dis3', employeeName: 'Ana Costa', diseaseType: 'Dermatose Ocupacional', cid10Code: 'L23.5', diagnosisDate: new Date(2024, 5, 5), relatedTask: 'Manuseio de Químicos', daysOff: 7, status: 'Recuperado' },
];
const mockLawsuits: LawsuitRecord[] = [
    { id: 'law1', processNumber: '0012345-67.2024.5.15.0001', plaintiff: 'João Silva', subject: 'Insalubridade - Ruído', status: 'Em Andamento', filingDate: new Date(2024, 1, 10), hearingDate: new Date(2024, 8, 15), estimatedCost: 15000, details: 'Reclama adicional de insalubridade por exposição a ruído acima dos limites na linha de produção X.', relatedNRs: ['NR-15'] },
    { id: 'law2', processNumber: '0098765-43.2023.5.15.0002', plaintiff: 'Maria Oliveira', subject: 'Acidente de Trabalho - Falta de EPI', status: 'Acordo', filingDate: new Date(2023, 5, 20), finalCost: 8000, details: 'Acordo realizado referente a acidente ocorrido por suposta falta de luvas adequadas.', relatedNRs: ['NR-6'] },
];
const mockCipaMeetings: CipaMeetingRecord[] = [
    { id: 'cipa1', date: new Date(2024, 6, 10), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira'], agenda: 'Discussão sobre EPIs, análise de incidente leve.', status: 'Realizada', actionsDefined: [{ description: 'Verificar validade dos protetores auriculares', responsible: 'Almoxarifado', deadline: new Date(2024, 6, 17), status: 'Concluída' }] },
    { id: 'cipa2', date: new Date(2024, 5, 12), participants: ['João Silva', 'Maria Oliveira', 'Ana Costa'], agenda: 'Planejamento SIPAT, riscos ergonômicos.', status: 'Realizada', minutesUrl: 'https://example.com/cipa/ata-junho', actionsDefined: [{ description: 'Contratar palestra sobre ergonomia', responsible: 'RH', deadline: new Date(2024, 7, 1), status: 'Em Andamento' }] },
    { id: 'cipa3', date: new Date(2024, 7, 14), participants: [], agenda: 'Próxima reunião ordinária.', status: 'Agendada', actionsDefined: [] },
];
const mockHoursWorked = 500000; // Example HHT for the period (e.g., YTD 2024)
const NATIONAL_TF_AVERAGE = 14.3; // Example national average TF (adjust per industry/year)
const NATIONAL_FATALITIES_2022 = 2538; // National data (example)
const NATIONAL_ACCIDENTS_2022 = 612920; // National data (example)
const COMPANY_TF_TARGET = 15; // Company specific target for TF

// Calculate Statistics
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

    return {
      totalHoursWorked: mockHoursWorked,
      numberOfAccidents,
      totalDaysLost,
      tf,
      tg,
      period: `Ano ${currentYear}`, // Example period label
      fatalAccidents: fatalAccidents,
      activeLawsuits: mockLawsuits.filter(l => l.status === 'Em Andamento').length,
      cipaMeetingsHeld: mockCipaMeetings.filter(m => m.status === 'Realizada' && m.date.getFullYear() === currentYear).length,
      occupationalDiseases: mockDiseases.filter(d => d.diagnosisDate.getFullYear() === currentYear).length, // Example KPI
    };
}, [mockAccidents, mockDiseases, mockLawsuits, mockCipaMeetings, mockHoursWorked]);

// --- Chart Configurations ---
const trainingsData = [ // Example data, fetch from trainings page/service
  { month: 'Jan', count: 12 }, { month: 'Fev', count: 18 }, { month: 'Mar', count: 15 },
  { month: 'Abr', count: 22 }, { month: 'Mai', count: 19 }, { month: 'Jun', count: 25 },
];
const asoStatusData = [ // Example data, fetch from asos page/service
  { name: 'Válido', value: 95, fill: "hsl(var(--chart-1))" },
  { name: 'Próximo Venc.', value: 3, fill: "hsl(var(--chart-2))" },
  { name: 'Vencido', value: 2, fill: "hsl(var(--destructive))" },
];
const incidentTrendData = [ // Use calculated data
    { month: 'Jan', incidents: mockAccidents.filter(a => a.date.getMonth() === 0 && a.date.getFullYear() === calculatedStats.period.split(' ')[1]).length },
    { month: 'Fev', incidents: mockAccidents.filter(a => a.date.getMonth() === 1 && a.date.getFullYear() === calculatedStats.period.split(' ')[1]).length },
    { month: 'Mar', incidents: mockAccidents.filter(a => a.date.getMonth() === 2 && a.date.getFullYear() === calculatedStats.period.split(' ')[1]).length },
    { month: 'Abr', incidents: mockAccidents.filter(a => a.date.getMonth() === 3 && a.date.getFullYear() === calculatedStats.period.split(' ')[1]).length },
    { month: 'Mai', incidents: mockAccidents.filter(a => a.date.getMonth() === 4 && a.date.getFullYear() === calculatedStats.period.split(' ')[1]).length },
    { month: 'Jun', incidents: mockAccidents.filter(a => a.date.getMonth() === 5 && a.date.getFullYear() === calculatedStats.period.split(' ')[1]).length },
    // Add more months as needed or make dynamic
];

const trainingsChartConfig = { count: { label: "Treinamentos", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
const asoChartConfig = {
    value: { label: "Quantidade" }, Válido: { label: "Válido", color: "hsl(var(--chart-1))" },
    "Próximo Venc.": { label: "Próximo Venc.", color: "hsl(var(--chart-2))" }, Vencido: { label: "Vencido", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;
const incidentChartConfig = { incidents: { label: "Acidentes", color: "hsl(var(--destructive))" } } satisfies ChartConfig;


export default function DashboardPage() {
  // Calculate comparisons for KPIs
  const tfComparison = calculatedStats.tf !== null && calculatedStats.tf > NATIONAL_TF_AVERAGE ? 'Acima da média BR' : 'Abaixo/Igual média BR';
  const tfComparisonColor = calculatedStats.tf !== null && calculatedStats.tf > NATIONAL_TF_AVERAGE ? 'text-destructive' : 'text-green-600';
  const tfTargetComparison = calculatedStats.tf !== null && calculatedStats.tf > COMPANY_TF_TARGET ? 'Acima da Meta' : 'Abaixo/Igual à Meta';
  const tfTargetComparisonColor = calculatedStats.tf !== null && calculatedStats.tf > COMPANY_TF_TARGET ? 'text-destructive' : 'text-green-600';


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard BI - Indicadores Chave (KPIs)</h1>
      <p className="text-muted-foreground">
        Análise visual dos indicadores chave de Segurança, Saúde e Meio Ambiente ({calculatedStats.period}).
      </p>

      {/* --- KPI Row --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
             <Bug className="h-4 w-4 text-muted-foreground" /> {/* Changed icon */}
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
             <Target className="h-4 w-4 text-muted-foreground" /> {/* Changed icon */}
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
             <CardTitle className="text-sm font-medium">Dias Perdidos (TG)</CardTitle>
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
             <Landmark className="h-4 w-4 text-muted-foreground" /> {/* Changed icon */}
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.activeLawsuits}</div>
              <p className="text-xs text-muted-foreground">Processos em andamento</p>
           </CardContent>
         </Card>
          {/* Optional: Add more KPIs if needed */}
          {/*
            <Card> ... CIPA Meetings ... </Card>
            <Card> ... Occupational Diseases ... </Card>
           */}
      </div>

      {/* --- Charts Row --- */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Status dos ASOs</CardTitle>
            <CardDescription>Distribuição percentual dos ASOs por status (exemplo).</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-0">
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
      </div>

       {/* Optional: Add more charts like Trainings or PPE */}
       {/*
       <div className="grid gap-4 md:grid-cols-2">
         <Card> ... Trainings Chart ... </Card>
         <Card> ... PPE Chart ... </Card>
       </div>
       */}

       <p className="text-xs text-center text-muted-foreground pt-4">* Média nacional de TF pode variar por setor e ano. Valor exemplificativo.</p>

    </div>
  );
}

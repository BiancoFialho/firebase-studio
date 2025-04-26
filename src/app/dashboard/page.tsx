// src/app/dashboard/page.tsx
'use client';

import React, { useMemo } from 'react'; // Added useMemo
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'; // Renamed Tooltip to RechartsTooltip
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { HardHat, ShieldCheck, Stethoscope, AlertTriangle, CheckCircle, Clock, Activity, Bug, Scale, Users, TrendingUp, TrendingDown, Calculator } from 'lucide-react'; // Added new icons
import type { AccidentRecord, OccupationalDiseaseRecord, LawsuitRecord, CipaMeetingRecord, StatisticsData } from '@/lib/types'; // Import new types
import { calculateFrequencyRate, calculateSeverityRate } from '@/lib/utils'; // Import calculation utils


// --- Mock Data - Replace with actual data fetching and processing ---

// Existing Data
const trainingsData = [
  { month: 'Jan', count: 12 }, { month: 'Fev', count: 18 }, { month: 'Mar', count: 15 },
  { month: 'Abr', count: 22 }, { month: 'Mai', count: 19 }, { month: 'Jun', count: 25 },
];
const asoStatusData = [
  { name: 'Válido', value: 95, fill: "hsl(var(--chart-1))" },
  { name: 'Próximo Venc.', value: 3, fill: "hsl(var(--chart-2))" },
  { name: 'Vencido', value: 2, fill: "hsl(var(--destructive))" },
];
const ppeDistributionData = [
    { name: 'Capacete', value: 50, fill: "hsl(var(--chart-1))" }, { name: 'Luvas', value: 85, fill: "hsl(var(--chart-2))" },
    { name: 'Óculos', value: 60, fill: "hsl(var(--chart-3))" }, { name: 'Botas', value: 45, fill: "hsl(var(--chart-4))" },
    { name: 'Protetor Auricular', value: 70, fill: "hsl(var(--chart-5))" },
];

// New Mock Data for KPIs
const mockAccidents: AccidentRecord[] = [ // Assume this comes from statistics/page.tsx or a service
  { id: 'acc1', date: new Date(2024, 0, 15), employeeName: 'Carlos Pereira', department: 'Produção', location: 'Máquina XPTO', type: 'Leve', cause: 'Corte', daysOff: 2, description: 'Corte superficial no dedo ao manusear peça.', catIssued: true, investigationStatus: 'Concluída' },
  { id: 'acc3', date: new Date(2024, 4, 20), time: '10:30', employeeName: 'João Silva', department: 'Manutenção', location: 'Painel Elétrico Z', type: 'Grave', cause: 'Choque Elétrico', daysOff: 15, description: 'Contato acidental com fiação exposta durante manutenção.', catIssued: true, investigationStatus: 'Em Andamento', cid10Code: 'T75.4' },
  // Add more relevant accidents for the current period (e.g., 2024)
];
const mockDiseases: OccupationalDiseaseRecord[] = [ // Assume this comes from diseases/page.tsx or a service
    { id: 'dis1', employeeName: 'Maria Oliveira', diseaseType: 'LER/DORT', cid10Code: 'M77.1', diagnosisDate: new Date(2023, 9, 10), relatedTask: 'Digitação', daysOff: 30, status: 'Afastado', medicalReportUrl: 'https://example.com/report/ler-maria' },
    { id: 'dis3', employeeName: 'Ana Costa', diseaseType: 'Dermatose Ocupacional', cid10Code: 'L23.5', diagnosisDate: new Date(2024, 5, 5), relatedTask: 'Manuseio de Químicos', daysOff: 7, status: 'Recuperado' },
];
const mockLawsuits: LawsuitRecord[] = [ // Assume this comes from compliance/page.tsx or a service
    { id: 'law1', processNumber: '0012345-67.2024.5.15.0001', plaintiff: 'João Silva', subject: 'Insalubridade - Ruído', status: 'Em Andamento', filingDate: new Date(2024, 1, 10), hearingDate: new Date(2024, 8, 15), estimatedCost: 15000, details: 'Reclama adicional de insalubridade por exposição a ruído acima dos limites na linha de produção X.', relatedNRs: ['NR-15'] },
    { id: 'law2', processNumber: '0098765-43.2023.5.15.0002', plaintiff: 'Maria Oliveira', subject: 'Acidente de Trabalho - Falta de EPI', status: 'Acordo', filingDate: new Date(2023, 5, 20), finalCost: 8000, details: 'Acordo realizado referente a acidente ocorrido por suposta falta de luvas adequadas.', relatedNRs: ['NR-6'] },
];
const mockCipaMeetings: CipaMeetingRecord[] = [ // Assume this comes from prevention/page.tsx or a service
    { id: 'cipa1', date: new Date(2024, 6, 10), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira'], agenda: 'Discussão sobre EPIs, análise de incidente leve.', status: 'Realizada', actionsDefined: [{ description: 'Verificar validade dos protetores auriculares', responsible: 'Almoxarifado', deadline: new Date(2024, 6, 17), status: 'Concluída' }] },
    { id: 'cipa2', date: new Date(2024, 5, 12), participants: ['João Silva', 'Maria Oliveira', 'Ana Costa'], agenda: 'Planejamento SIPAT, riscos ergonômicos.', status: 'Realizada', minutesUrl: 'https://example.com/cipa/ata-junho', actionsDefined: [{ description: 'Contratar palestra sobre ergonomia', responsible: 'RH', deadline: new Date(2024, 7, 1), status: 'Em Andamento' }] },
    { id: 'cipa3', date: new Date(2024, 7, 14), participants: [], agenda: 'Próxima reunião ordinária.', status: 'Agendada', actionsDefined: [] },
];
const mockHoursWorked = 500000; // Example HHT for the period (e.g., YTD 2024)
const NATIONAL_TF_AVERAGE = 14.3; // Example national average


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
      fatalAccidents: fatalAccidents, // Add fatal count
      activeLawsuits: mockLawsuits.filter(l => l.status === 'Em Andamento').length,
      cipaMeetingsHeld: mockCipaMeetings.filter(m => m.status === 'Realizada' && m.date.getFullYear() === currentYear).length,
      occupationalDiseases: mockDiseases.filter(d => d.diagnosisDate.getFullYear() === currentYear).length, // Example KPI
    };
}, [mockAccidents, mockDiseases, mockLawsuits, mockCipaMeetings, mockHoursWorked]); // Add dependencies


// --- Chart Configurations ---
const trainingsChartConfig = { count: { label: "Treinamentos", color: "hsl(var(--chart-1))" } } satisfies ChartConfig;
const asoChartConfig = {
    value: { label: "Quantidade" }, Válido: { label: "Válido", color: "hsl(var(--chart-1))" },
    "Próximo Venc.": { label: "Próximo Venc.", color: "hsl(var(--chart-2))" }, Vencido: { label: "Vencido", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;
const ppeChartConfig = {
    value: { label: "Quantidade" }, Capacete: { label: "Capacete", color: "hsl(var(--chart-1))" }, Luvas: { label: "Luvas", color: "hsl(var(--chart-2))" },
    Óculos: { label: "Óculos", color: "hsl(var(--chart-3))" }, Botas: { label: "Botas", color: "hsl(var(--chart-4))" },
    "Protetor Auricular": { label: "Protetor Auricular", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;
// Simulate incident trend data if needed, or fetch from statistics
const incidentTrendData = [
    { month: 'Jan', incidents: mockAccidents.filter(a => a.date.getMonth() === 0 && a.date.getFullYear() === 2024).length },
    { month: 'Fev', incidents: mockAccidents.filter(a => a.date.getMonth() === 1 && a.date.getFullYear() === 2024).length },
    { month: 'Mar', incidents: mockAccidents.filter(a => a.date.getMonth() === 2 && a.date.getFullYear() === 2024).length },
    { month: 'Abr', incidents: mockAccidents.filter(a => a.date.getMonth() === 3 && a.date.getFullYear() === 2024).length },
    { month: 'Mai', incidents: mockAccidents.filter(a => a.date.getMonth() === 4 && a.date.getFullYear() === 2024).length },
    { month: 'Jun', incidents: mockAccidents.filter(a => a.date.getMonth() === 5 && a.date.getFullYear() === 2024).length },
];
const incidentChartConfig = { incidents: { label: "Acidentes", color: "hsl(var(--destructive))" } } satisfies ChartConfig;


export default function DashboardPage() {
  // Existing totals
  const totalTrainings = trainingsData.reduce((sum, item) => sum + item.count, 0);
  const totalAsos = asoStatusData.reduce((sum, item) => sum + item.value, 0);
  const totalPpe = ppeDistributionData.reduce((sum, item) => sum + item.value, 0);

  // Calculate comparison for TF
  const tfComparison = calculatedStats.tf !== null && calculatedStats.tf > NATIONAL_TF_AVERAGE ? 'Acima da média' : 'Abaixo/Igual à média';
  const tfComparisonColor = calculatedStats.tf !== null && calculatedStats.tf > NATIONAL_TF_AVERAGE ? 'text-destructive' : 'text-green-600';


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard BI - Indicadores Chave (KPIs)</h1>
      <p className="text-muted-foreground">
        Análise visual dos indicadores chave de Segurança, Saúde e Meio Ambiente ({calculatedStats.period}).
      </p>

      {/* --- KPI Row --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Acidentes no Período</CardTitle>
             <Activity className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.numberOfAccidents}</div>
             <p className="text-xs text-muted-foreground">
                {calculatedStats.fatalAccidents > 0 ? (
                    <span className="text-destructive">{calculatedStats.fatalAccidents} fatais</span>
                ) : (
                    <span className="text-green-600">0 óbitos</span>
                )}
             </p>
           </CardContent>
         </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Frequência (TF)</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculatedStats.tf?.toFixed(2) ?? 'N/A'}</div>
            <p className={`text-xs ${tfComparisonColor}`}>
                 {tfComparison} (Média BR*: {NATIONAL_TF_AVERAGE.toFixed(1)})
            </p>
          </CardContent>
        </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Taxa de Gravidade (TG)</CardTitle>
             <TrendingDown className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.tg?.toFixed(2) ?? 'N/A'}</div>
             <p className="text-xs text-muted-foreground">Dias Perdidos x 1M / HHT</p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Ações Trabalhistas Ativas</CardTitle>
             <Scale className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{calculatedStats.activeLawsuits}</div>
              <p className="text-xs text-muted-foreground">Processos em andamento</p>
           </CardContent>
         </Card>
         {/* Optional extra KPIs */}
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Doenças Ocup. Registradas</CardTitle>
               <Bug className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{calculatedStats.occupationalDiseases}</div>
               <p className="text-xs text-muted-foreground">No período</p>
             </CardContent>
           </Card>
           <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reuniões CIPA Realizadas</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{calculatedStats.cipaMeetingsHeld}</div>
                <p className="text-xs text-muted-foreground">No período (Meta: 12)</p>
              </CardContent>
            </Card>
             <Card>
               <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <CardTitle className="text-sm font-medium">Total de Treinamentos (Hist.)</CardTitle>
                 <HardHat className="h-4 w-4 text-muted-foreground" />
               </CardHeader>
               <CardContent>
                 <div className="text-2xl font-bold">{totalTrainings}</div>
                 <p className="text-xs text-muted-foreground">Desde o início</p>
               </CardContent>
             </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total EPIs Distribuídos (Hist.)</CardTitle>
                <ShieldCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalPpe}</div>
                <p className="text-xs text-muted-foreground">Itens em uso/devolvidos</p>
              </CardContent>
            </Card>
      </div>

      {/* --- Charts Row 1 --- */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Treinamentos Realizados por Mês</CardTitle>
            <CardDescription>Número de treinamentos nos últimos 6 meses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={trainingsChartConfig} className="h-[300px] w-full">
              <BarChart data={trainingsData} accessibilityLayer>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
                <YAxis />
                 <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                 <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="count" fill="var(--color-count)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status dos ASOs</CardTitle>
            <CardDescription>Distribuição percentual dos ASOs por status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center pb-0">
             <ChartContainer config={asoChartConfig} className="mx-auto aspect-square h-[250px]">
               <PieChart>
                  <ChartTooltip content={<ChartTooltipContent nameKey="name" hideLabel />} />
                 <Pie data={asoStatusData} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                     {asoStatusData.map((entry) => ( <Cell key={`cell-${entry.name}`} fill={entry.fill} /> ))}
                 </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" className="flex -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />} />
               </PieChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>

       {/* --- Charts Row 2 --- */}
      <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de EPIs</CardTitle>
              <CardDescription>Quantidade de cada tipo de EPI distribuído (histórico).</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={ppeChartConfig} className="h-[300px] w-full">
                <BarChart data={ppeDistributionData} layout="vertical" accessibilityLayer>
                   <CartesianGrid horizontal={false} />
                  <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} hide/>
                  <XAxis type="number" hide/>
                   <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel/>} />
                   <ChartLegend content={<ChartLegendContent />} />
                   <Bar dataKey="value" layout="vertical" radius={5}>
                      {ppeDistributionData.map((entry) => ( <Cell key={`cell-${entry.name}`} fill={entry.fill} /> ))}
                   </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

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
      </div>

       <p className="text-xs text-center text-muted-foreground pt-4">* Média nacional de TF pode variar por setor. Valor exemplificativo.</p>

    </div>
  );
}

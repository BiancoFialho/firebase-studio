// src/app/dashboard/page.tsx
'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { HardHat, ShieldCheck, Stethoscope, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

// Mock Data - Replace with actual data fetching and processing
const trainingsData = [
  { month: 'Jan', count: 12 },
  { month: 'Fev', count: 18 },
  { month: 'Mar', count: 15 },
  { month: 'Abr', count: 22 },
  { month: 'Mai', count: 19 },
  { month: 'Jun', count: 25 },
];

const asoStatusData = [
  { name: 'Válido', value: 95, fill: "hsl(var(--chart-1))" }, // Teal
  { name: 'Próximo Venc.', value: 3, fill: "hsl(var(--chart-2))" }, // Orange
  { name: 'Vencido', value: 2, fill: "hsl(var(--destructive))" }, // Destructive (Red)
];

const ppeDistributionData = [
    { name: 'Capacete', value: 50, fill: "hsl(var(--chart-1))" },
    { name: 'Luvas', value: 85, fill: "hsl(var(--chart-2))" },
    { name: 'Óculos', value: 60, fill: "hsl(var(--chart-3))" },
    { name: 'Botas', value: 45, fill: "hsl(var(--chart-4))" },
    { name: 'Protetor Auricular', value: 70, fill: "hsl(var(--chart-5))" },
];

const incidentTrendData = [
    { month: 'Jan', incidents: 0 },
    { month: 'Fev', incidents: 1 },
    { month: 'Mar', incidents: 0 },
    { month: 'Abr', incidents: 0 },
    { month: 'Mai', incidents: 2 },
    { month: 'Jun', incidents: 1 },
];

// Chart Configurations
const trainingsChartConfig = {
  count: {
    label: "Treinamentos",
    color: "hsl(var(--chart-1))", // Teal
  },
} satisfies ChartConfig;

const asoChartConfig = {
    value: {
        label: "Quantidade",
    },
    Válido: {
        label: "Válido",
        color: "hsl(var(--chart-1))",
    },
    "Próximo Venc.": {
        label: "Próximo Venc.",
        color: "hsl(var(--chart-2))",
    },
    Vencido: {
        label: "Vencido",
        color: "hsl(var(--destructive))",
    },
} satisfies ChartConfig;

const ppeChartConfig = {
    value: {
        label: "Quantidade",
    },
    Capacete: { label: "Capacete", color: "hsl(var(--chart-1))" },
    Luvas: { label: "Luvas", color: "hsl(var(--chart-2))" },
    Óculos: { label: "Óculos", color: "hsl(var(--chart-3))" },
    Botas: { label: "Botas", color: "hsl(var(--chart-4))" },
    "Protetor Auricular": { label: "Protetor Auricular", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig;


const incidentChartConfig = {
  incidents: {
    label: "Incidentes",
    color: "hsl(var(--destructive))", // Red for incidents
  },
} satisfies ChartConfig;


export default function DashboardPage() {

  const totalTrainings = trainingsData.reduce((sum, item) => sum + item.count, 0);
  const totalAsos = asoStatusData.reduce((sum, item) => sum + item.value, 0);
  const totalPpe = ppeDistributionData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard BI - SSMA</h1>
      <p className="text-muted-foreground">
        Análise visual dos indicadores chave de Segurança, Saúde e Meio Ambiente.
      </p>

      {/* Key Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Treinamentos (Últ. 6 Meses)</CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTrainings}</div>
            <p className="text-xs text-muted-foreground">Registros analisados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de ASOs Gerenciados</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAsos}</div>
             <p className="text-xs text-muted-foreground">Registros no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de EPIs Distribuídos</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPpe}</div>
            <p className="text-xs text-muted-foreground">Itens em uso ou devolvidos</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
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
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
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
                     {asoStatusData.map((entry) => (
                         <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                     ))}
                 </Pie>
                  <ChartLegend content={<ChartLegendContent nameKey="name" className="flex -translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center" />} />
               </PieChart>
             </ChartContainer>
          </CardContent>
        </Card>
      </div>

       {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição de EPIs</CardTitle>
              <CardDescription>Quantidade de cada tipo de EPI distribuído.</CardDescription>
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
                      {ppeDistributionData.map((entry) => (
                          <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                   </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
             <CardHeader>
               <CardTitle>Tendência de Incidentes</CardTitle>
               <CardDescription>Número de incidentes registrados por mês.</CardDescription>
             </CardHeader>
             <CardContent>
               <ChartContainer config={incidentChartConfig} className="h-[300px] w-full">
                 <LineChart data={incidentTrendData} margin={{ left: 12, right: 12 }} accessibilityLayer>
                   <CartesianGrid vertical={false} />
                   <XAxis
                     dataKey="month"
                     tickLine={false}
                     axisLine={false}
                     tickMargin={8}
                     tickFormatter={(value) => value.slice(0, 3)}
                   />
                   <YAxis allowDecimals={false} />
                   <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                    <ChartLegend content={<ChartLegendContent />} />
                   <Line
                     dataKey="incidents"
                     type="monotone"
                     stroke="var(--color-incidents)"
                     strokeWidth={2}
                     dot={true}
                   />
                 </LineChart>
               </ChartContainer>
             </CardContent>
           </Card>

      </div>

    </div>
  );
}

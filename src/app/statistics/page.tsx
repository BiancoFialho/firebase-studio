// src/app/statistics/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, TrendingUp, BarChartHorizontalBig, AlertCircle, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AccidentRecord, AccidentType, AccidentCause, StatisticsData } from '@/lib/types';
import { calculateFrequencyRate, calculateSeverityRate } from '@/lib/utils';

// Mock Data
const mockAccidents: AccidentRecord[] = [
  { id: 'acc1', date: new Date(2024, 0, 15), employeeName: 'Carlos Pereira', department: 'Produção', location: 'Máquina XPTO', type: 'Leve', cause: 'Corte', daysOff: 2, description: 'Corte superficial no dedo ao manusear peça.', catIssued: true, investigationStatus: 'Concluída' },
  { id: 'acc2', date: new Date(2024, 2, 5), employeeName: 'Ana Costa', department: 'Logística', location: 'Corredor B', type: 'Leve', cause: 'Queda', daysOff: 0, description: 'Escorregou em piso molhado sem sinalização.', catIssued: false, investigationStatus: 'Concluída' },
  { id: 'acc3', date: new Date(2024, 4, 20), time: '10:30', employeeName: 'João Silva', department: 'Manutenção', location: 'Painel Elétrico Z', type: 'Grave', cause: 'Choque Elétrico', daysOff: 15, description: 'Contato acidental com fiação exposta durante manutenção.', catIssued: true, investigationStatus: 'Em Andamento', cid10Code: 'T75.4' },
  { id: 'acc4', date: new Date(2024, 6, 1), employeeName: 'Maria Oliveira', department: 'Produção', location: 'Esteira 1', type: 'Leve', cause: 'Impacto', daysOff: 1, description: 'Pancada leve no braço por caixa.', catIssued: false, investigationStatus: 'Pendente' },
];

const mockHoursWorked = 500000; // Example total hours for the period (e.g., year 2024)

export default function StatisticsPage() {
  const [accidents, setAccidents] = useState<AccidentRecord[]>(mockAccidents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AccidentRecord | null>(null);
  const { toast } = useToast();

  // Form State
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState<AccidentType | ''>('');
  const [cause, setCause] = useState<AccidentCause | ''>('');
  const [causeDetails, setCauseDetails] = useState('');
  const [daysOff, setDaysOff] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [cid10Code, setCid10Code] = useState('');
  const [catIssued, setCatIssued] = useState(false);
  const [investigationStatus, setInvestigationStatus] = useState<AccidentRecord['investigationStatus']>('Pendente');
  const [reportUrl, setReportUrl] = useState('');
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(mockHoursWorked);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAccidents = accidents.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.cause.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setDate(new Date());
    setTime('');
    setEmployeeName('');
    setDepartment('');
    setLocation('');
    setType('');
    setCause('');
    setCauseDetails('');
    setDaysOff(0);
    setDescription('');
    setCid10Code('');
    setCatIssued(false);
    setInvestigationStatus('Pendente');
    setReportUrl('');
    setEditingRecord(null);
  };

  const handleOpenForm = (record: AccidentRecord | null = null) => {
    if (record) {
      setEditingRecord(record);
      setDate(record.date);
      setTime(record.time || '');
      setEmployeeName(record.employeeName);
      setDepartment(record.department);
      setLocation(record.location);
      setType(record.type);
      setCause(record.cause);
      setCauseDetails(record.causeDetails || '');
      setDaysOff(record.daysOff);
      setDescription(record.description);
      setCid10Code(record.cid10Code || '');
      setCatIssued(record.catIssued);
      setInvestigationStatus(record.investigationStatus);
      setReportUrl(record.reportUrl || '');
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!date || !employeeName || !department || !location || !type || !cause || description === '') {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (*).",
        variant: "destructive",
      });
      return;
    }

    const newRecord: AccidentRecord = {
      id: editingRecord ? editingRecord.id : `acc${Date.now()}`,
      date,
      time: time || undefined,
      employeeName,
      department,
      location,
      type,
      cause,
      causeDetails: causeDetails || undefined,
      daysOff,
      description,
      cid10Code: cid10Code || undefined,
      catIssued,
      investigationStatus,
      reportUrl: reportUrl || undefined,
    };

    if (editingRecord) {
      setAccidents(accidents.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({ title: "Sucesso", description: "Registro de acidente atualizado." });
    } else {
      setAccidents([newRecord, ...accidents]);
      toast({ title: "Sucesso", description: "Novo acidente registrado." });
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setAccidents(accidents.filter(r => r.id !== id));
    toast({ title: "Sucesso", description: "Registro de acidente excluído.", variant: "destructive" });
  };

  // --- Statistics Calculation ---
  const statistics = useMemo((): StatisticsData => {
    const periodAccidents = filteredAccidents; // Or filter by a specific period later
    const numberOfAccidents = periodAccidents.length;
    const accidentsWithLostTime = periodAccidents.filter(a => a.daysOff > 0).length;
    const totalDaysLost = periodAccidents.reduce((sum, acc) => sum + acc.daysOff, 0);

    const tf = calculateFrequencyRate(accidentsWithLostTime, totalHoursWorked);
    const tg = calculateSeverityRate(totalDaysLost, totalHoursWorked);

    return {
      totalHoursWorked,
      numberOfAccidents,
      totalDaysLost,
      tf,
      tg,
      period: "Período Atual" // Placeholder, can be dynamic
    };
  }, [filteredAccidents, totalHoursWorked]);

  // --- Chart Data Preparation ---
  const accidentsByType = useMemo(() => {
    const counts: { [key in AccidentType]?: number } = {};
    filteredAccidents.forEach(acc => {
      counts[acc.type] = (counts[acc.type] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [filteredAccidents]);

  const accidentsByCause = useMemo(() => {
    const counts: { [key in AccidentCause]?: number } = {};
    filteredAccidents.forEach(acc => {
      counts[acc.cause] = (counts[acc.cause] || 0) + 1;
    });
    // Get top 5 causes
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  }, [filteredAccidents]);


  // Chart Configs
  const typeChartConfig = {
    value: { label: "Quantidade" },
    Leve: { label: "Leve", color: "hsl(var(--chart-2))" },
    Grave: { label: "Grave", color: "hsl(var(--chart-3))" },
    Fatal: { label: "Fatal", color: "hsl(var(--destructive))" },
    Trajeto: { label: "Trajeto", color: "hsl(var(--chart-4))" },
    Típico: { label: "Típico", color: "hsl(var(--chart-5))" },
  } satisfies ChartConfig;

   const causeChartConfig = {
     value: { label: "Quantidade" },
     Queda: { label: "Queda", color: "hsl(var(--chart-1))" },
     'Choque Elétrico': { label: "Choque", color: "hsl(var(--chart-2))" },
     Impacto: { label: "Impacto", color: "hsl(var(--chart-3))" },
     Corte: { label: "Corte", color: "hsl(var(--chart-4))" },
     'Projeção Partículas': { label: "Projeção", color: "hsl(var(--chart-5))" },
     // Add other causes as needed
   } satisfies ChartConfig;


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Estatísticas de Acidentes</h1>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Total de Acidentes</CardTitle>
             <AlertCircle className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{statistics.numberOfAccidents}</div>
             <p className="text-xs text-muted-foreground">{statistics.period}</p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Dias Perdidos</CardTitle>
             <TrendingUp className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{statistics.totalDaysLost}</div>
              <p className="text-xs text-muted-foreground">Total no período</p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Taxa de Frequência (TF)</CardTitle>
             <Calculator className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{statistics.tf?.toFixed(2) ?? 'N/A'}</div>
             <p className="text-xs text-muted-foreground">Acidentes x 1M / HHT</p>
           </CardContent>
         </Card>
         <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Taxa de Gravidade (TG)</CardTitle>
             <Calculator className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{statistics.tg?.toFixed(2) ?? 'N/A'}</div>
             <p className="text-xs text-muted-foreground">Dias Perdidos x 1M / HHT</p>
           </CardContent>
         </Card>
          <Card className="md:col-span-2 lg:col-span-4">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium">Horas Homem Trabalhadas (HHT) no Período</CardTitle>
               <CardDescription>Valor base para cálculo das taxas.</CardDescription>
             </CardHeader>
             <CardContent className="flex items-center gap-2">
               <Input
                 type="number"
                 value={totalHoursWorked}
                 onChange={(e) => setTotalHoursWorked(Number(e.target.value) || 0)}
                 className="max-w-[200px]"
                 placeholder="Total de horas"
               />
                <span className="text-sm text-muted-foreground">horas</span>
                {/* Add button to save/update this value if needed */}
             </CardContent>
           </Card>
      </div>


       {/* Charts Row */}
       <div className="grid gap-4 md:grid-cols-2">
           <Card>
             <CardHeader>
               <CardTitle>Acidentes por Tipo</CardTitle>
               <CardDescription>Distribuição dos tipos de acidentes registrados.</CardDescription>
             </CardHeader>
             <CardContent>
               <ChartContainer config={typeChartConfig} className="h-[300px] w-full">
                  <BarChart data={accidentsByType} layout="vertical" accessibilityLayer>
                    <CartesianGrid horizontal={false}/>
                    <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} hide />
                    <XAxis type="number" hide />
                     <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" hideLabel />} />
                    <Legend content={({ payload }) => <ChartLegendContent payload={payload} nameKey="name" className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2" />} />
                     <Bar dataKey="value" layout="vertical" radius={5}>
                         {accidentsByType.map((entry) => (
                           <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                         ))}
                     </Bar>
                  </BarChart>
               </ChartContainer>
             </CardContent>
           </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Causas de Acidentes</CardTitle>
                <CardDescription>Principais causas dos acidentes registrados.</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={causeChartConfig} className="h-[300px] w-full">
                    <BarChart data={accidentsByCause} layout="vertical" accessibilityLayer>
                      <CartesianGrid horizontal={false}/>
                      <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={80} className="text-xs" />
                      <XAxis type="number" />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                       {/* <ChartLegend content={<ChartLegendContent nameKey="name"/>} /> */}
                       <Bar dataKey="value" layout="vertical" radius={4}>
                          {accidentsByCause.map((entry) => (
                             <Cell key={`cell-${entry.name}`} fill={`var(--color-${entry.name})`} />
                          ))}
                       </Bar>
                    </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
       </div>

      {/* Accidents Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-semibold">Registros de Acidentes</h2>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Acidente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRecord ? 'Editar Registro de Acidente' : 'Registrar Novo Acidente'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {/* Date */}
                   <div className="space-y-1">
                      <Label htmlFor="date">Data*</Label>
                      <DatePicker date={date} setDate={setDate} required />
                   </div>
                   {/* Time */}
                   <div className="space-y-1">
                      <Label htmlFor="time">Hora (Opcional)</Label>
                      <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                   </div>
                   {/* Employee Name */}
                   <div className="space-y-1">
                      <Label htmlFor="employeeName">Colaborador*</Label>
                      <Input id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />
                   </div>
                    {/* Department */}
                   <div className="space-y-1">
                      <Label htmlFor="department">Departamento*</Label>
                      <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                   </div>
                   {/* Location */}
                   <div className="space-y-1">
                      <Label htmlFor="location">Local Específico*</Label>
                      <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} required />
                   </div>
                   {/* Type */}
                   <div className="space-y-1">
                      <Label htmlFor="type">Tipo*</Label>
                      <Select value={type} onValueChange={(v: AccidentType) => setType(v)} required>
                         <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Leve">Leve</SelectItem>
                           <SelectItem value="Grave">Grave</SelectItem>
                           <SelectItem value="Fatal">Fatal</SelectItem>
                           <SelectItem value="Trajeto">Trajeto</SelectItem>
                           <SelectItem value="Típico">Típico</SelectItem>
                         </SelectContent>
                      </Select>
                   </div>
                   {/* Cause */}
                   <div className="space-y-1">
                      <Label htmlFor="cause">Causa*</Label>
                      <Select value={cause} onValueChange={(v: AccidentCause) => setCause(v)} required>
                           <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                           <SelectContent>
                               {Object.values(['Queda', 'Choque Elétrico', 'Impacto', 'Corte', 'Projeção Partículas', 'Químico', 'Ergonômico', 'Biológico', 'Outro'] as AccidentCause[]).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                           </SelectContent>
                      </Select>
                   </div>
                   {/* Cause Details */}
                   <div className="space-y-1 lg:col-span-2">
                      <Label htmlFor="causeDetails">Detalhes da Causa (se 'Outro')</Label>
                      <Input id="causeDetails" value={causeDetails} onChange={(e) => setCauseDetails(e.target.value)} />
                   </div>
                   {/* Days Off */}
                   <div className="space-y-1">
                      <Label htmlFor="daysOff">Dias de Afastamento*</Label>
                      <Input id="daysOff" type="number" min="0" value={daysOff} onChange={(e) => setDaysOff(Number(e.target.value) || 0)} required />
                   </div>
                   {/* CID-10 */}
                   <div className="space-y-1">
                      <Label htmlFor="cid10Code">CID-10 (Opcional)</Label>
                      <Input id="cid10Code" value={cid10Code} onChange={(e) => setCid10Code(e.target.value)} />
                   </div>
                    {/* Investigation Status */}
                    <div className="space-y-1">
                        <Label htmlFor="investigationStatus">Status Investigação*</Label>
                        <Select value={investigationStatus} onValueChange={(v: AccidentRecord['investigationStatus']) => setInvestigationStatus(v)} required>
                             <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                             <SelectContent>
                               <SelectItem value="Pendente">Pendente</SelectItem>
                               <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                               <SelectItem value="Concluída">Concluída</SelectItem>
                             </SelectContent>
                        </Select>
                     </div>
                     {/* Report URL */}
                    <div className="space-y-1">
                       <Label htmlFor="reportUrl">Link Relatório (Opcional)</Label>
                       <Input id="reportUrl" type="url" value={reportUrl} onChange={(e) => setReportUrl(e.target.value)} />
                    </div>
                     {/* CAT Issued */}
                    <div className="flex items-center space-x-2 pt-4">
                         <Checkbox id="catIssued" checked={catIssued} onCheckedChange={(checked) => setCatIssued(!!checked)} />
                         <Label htmlFor="catIssued">CAT Emitida?</Label>
                     </div>

                </div>
                {/* Description */}
                <div className="space-y-1 mt-4">
                   <Label htmlFor="description">Descrição Detalhada do Acidente*</Label>
                   <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required />
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancelar</Button>
                  </DialogClose>
                  <Button type="submit">{editingRecord ? 'Salvar Alterações' : 'Registrar'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por colaborador, tipo, causa..."
            className="pl-8 w-full sm:w-1/2 md:w-1/3"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Registros de acidentes de trabalho.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Colaborador</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Causa</TableHead>
                <TableHead>Dias Afast.</TableHead>
                <TableHead>CAT</TableHead>
                <TableHead>Investigação</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccidents.length > 0 ? (
                filteredAccidents.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.date.toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                        <Badge variant={record.type === 'Fatal' ? 'destructive' : record.type === 'Grave' ? 'secondary' : 'default'}>{record.type}</Badge>
                    </TableCell>
                    <TableCell>{record.cause}</TableCell>
                    <TableCell>{record.daysOff}</TableCell>
                    <TableCell>{record.catIssued ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>{record.investigationStatus}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(record)}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Excluir</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro do acidente de <span className="font-medium">{record.employeeName}</span> em {record.date.toLocaleDateString('pt-BR')}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="h-24 text-center">
                    Nenhum registro de acidente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
// Re-add Cell if needed, or remove this line
import { Cell } from 'recharts';

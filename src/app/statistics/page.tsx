// src/app/statistics/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Prisma, AccidentRecord as PrismaAccidentRecord, AccidentType, AccidentCause, InvestigationStatus } from '@prisma/client'; // Import Prisma types
import { calculateFrequencyRate, calculateSeverityRate } from '@/lib/utils';
import { format } from 'date-fns';
import { createAccident, getAccidents, updateAccident, deleteAccident } from '@/app/statistics/actions'; // Import server actions

// Extend Prisma type if needed, or use directly
type AccidentRecord = PrismaAccidentRecord;

// --- Form Validation Schema ---
const accidentSchema = z.object({
  id: z.string().optional(), // Optional for creation
  date: z.date({ required_error: "Data é obrigatória." }),
  time: z.string().optional(),
  employeeId: z.string().min(1, "Colaborador é obrigatório."), // Assuming IDs are stored
  employeeName: z.string().min(1, "Nome do colaborador é obrigatório."), // For display/selection
  department: z.string().min(1, "Departamento é obrigatório."),
  location: z.string().min(1, "Local é obrigatório."),
  type: z.nativeEnum(AccidentType, { errorMap: () => ({ message: "Tipo é obrigatório." }) }),
  cause: z.nativeEnum(AccidentCause, { errorMap: () => ({ message: "Causa é obrigatória." }) }),
  causeDetails: z.string().optional(),
  daysOff: z.number().min(0, "Dias de afastamento não pode ser negativo.").default(0),
  description: z.string().min(1, "Descrição é obrigatória."),
  cid10Code: z.string().optional(),
  catIssued: z.boolean().default(false),
  investigationStatus: z.nativeEnum(InvestigationStatus).default(InvestigationStatus.Pendente),
  reportUrl: z.string().optional(),
});

type AccidentFormData = z.infer<typeof accidentSchema>;


// Mock data for employees (replace with actual fetching)
const mockEmployees = [
    { id: 'emp1', name: 'João Silva' },
    { id: 'emp2', name: 'Maria Oliveira' },
    { id: 'emp3', name: 'Carlos Pereira' },
    { id: 'emp4', name: 'Ana Costa' },
    { id: 'emp5', name: 'Pedro Santos' },
];

// Mock total hours worked (replace with fetching or input)
const mockHoursWorked = 500000;

export default function StatisticsPage() {
  const [accidents, setAccidents] = useState<AccidentRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [totalHoursWorked, setTotalHoursWorked] = useState<number>(mockHoursWorked);


  const { register, handleSubmit, control, reset, setValue, formState: { errors } } = useForm<AccidentFormData>({
    resolver: zodResolver(accidentSchema),
    defaultValues: {
        date: new Date(),
        employeeId: '',
        employeeName: '',
        department: '',
        location: '',
        daysOff: 0,
        description: '',
        catIssued: false,
        investigationStatus: InvestigationStatus.Pendente,
        // type and cause will be set via Select dropdowns
    }
  });


  // --- Data Fetching ---
  useEffect(() => {
    const fetchAccidents = async () => {
      setIsLoading(true);
      try {
        const fetchedAccidents = await getAccidents();
        setAccidents(fetchedAccidents);
      } catch (error) {
        console.error("Error fetching accidents:", error);
        toast({ title: "Erro", description: "Não foi possível buscar os registros de acidentes.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccidents();
  }, [toast]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

   const filteredAccidents = useMemo(() => accidents.filter((record) =>
       record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) || // Use optional chaining
       record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.cause.toLowerCase().includes(searchTerm.toLowerCase())
   ), [accidents, searchTerm]);


  const handleOpenForm = (record: AccidentRecord | null = null) => {
    if (record) {
      setEditingRecordId(record.id);
      // Use setValue to populate the form fields correctly
      setValue('id', record.id);
      setValue('date', new Date(record.date)); // Ensure it's a Date object
      setValue('time', record.time || '');
      setValue('employeeId', record.employeeId || ''); // Handle potential null/undefined
      setValue('employeeName', record.employeeName || ''); // Populate name for display
      setValue('department', record.department);
      setValue('location', record.location);
      setValue('type', record.type);
      setValue('cause', record.cause);
      setValue('causeDetails', record.causeDetails || '');
      setValue('daysOff', record.daysOff);
      setValue('description', record.description);
      setValue('cid10Code', record.cid10Code || '');
      setValue('catIssued', record.catIssued);
      setValue('investigationStatus', record.investigationStatus);
      setValue('reportUrl', record.reportUrl || '');
    } else {
      setEditingRecordId(null);
      reset(); // Reset form to default values
      setValue('date', new Date()); // Ensure date is reset to today
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecordId(null);
    reset(); // Reset form fields
  };

  const onSubmit: SubmitHandler<AccidentFormData> = async (data) => {
    try {
      setIsLoading(true);
      let savedAccident: AccidentRecord;

      // Find selected employee name based on ID for saving
      const selectedEmployee = mockEmployees.find(emp => emp.id === data.employeeId);
       const employeeNameToSave = selectedEmployee ? selectedEmployee.name : data.employeeName; // Fallback if needed


       // Prepare data, ensuring correct types
      const dataToSave = {
           ...data,
           employeeName: employeeNameToSave, // Save the name
           daysOff: Number(data.daysOff) || 0, // Ensure daysOff is a number
       };


      if (editingRecordId) {
        // Update
        savedAccident = await updateAccident(editingRecordId, dataToSave);
        setAccidents(accidents.map(r => r.id === editingRecordId ? savedAccident : r));
        toast({ title: "Sucesso", description: "Registro de acidente atualizado." });
      } else {
        // Create
         const { id, ...createData } = dataToSave; // Remove id for creation
        savedAccident = await createAccident(createData);
        setAccidents([savedAccident, ...accidents]);
        toast({ title: "Sucesso", description: "Novo acidente registrado." });
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving accident:", error);
      toast({ title: "Erro", description: "Falha ao salvar o registro do acidente.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
     try {
       setIsLoading(true);
       await deleteAccident(id);
       setAccidents(accidents.filter(r => r.id !== id));
       toast({ title: "Sucesso", description: "Registro de acidente excluído.", variant: "destructive" });
     } catch (error) {
        console.error("Error deleting accident:", error);
        toast({ title: "Erro", description: "Falha ao excluir o registro do acidente.", variant: "destructive" });
     } finally {
        setIsLoading(false);
     }
  };

  // --- Statistics Calculation ---
   const statistics = useMemo((): any => { // Using 'any' temporarily
       const periodAccidents = filteredAccidents; // Use filtered accidents for consistency
       const numberOfAccidents = periodAccidents.length;
       const accidentsWithLostTime = periodAccidents.filter(a => a.daysOff > 0).length;
       const totalDaysLost = periodAccidents.reduce((sum, acc) => sum + acc.daysOff, 0);
       const fatalAccidents = periodAccidents.filter(a => a.type === AccidentType.Fatal).length;

       const tf = calculateFrequencyRate(accidentsWithLostTime, totalHoursWorked);
       const tg = calculateSeverityRate(totalDaysLost, totalHoursWorked);

       return {
         totalHoursWorked,
         numberOfAccidents,
         totalDaysLost,
         tf,
         tg,
         period: "Período Atual", // Placeholder
         fatalAccidents,
       };
   }, [filteredAccidents, totalHoursWorked]);


  // --- Chart Data Preparation ---
   const accidentsByType = useMemo(() => {
       const counts: { [key in AccidentType]: number } = { Leve: 0, Grave: 0, Fatal: 0, Trajeto: 0, Tipico: 0 };
       filteredAccidents.forEach(acc => {
         counts[acc.type] = (counts[acc.type] || 0) + 1;
       });
       return Object.entries(counts)
         .map(([name, value]) => ({ name: name as AccidentType, value })) // Cast name back to enum
         .filter(item => item.value > 0);
   }, [filteredAccidents]);

   const accidentsByCause = useMemo(() => {
       const counts: { [key in AccidentCause]?: number } = {};
       filteredAccidents.forEach(acc => {
         counts[acc.cause] = (counts[acc.cause] || 0) + 1;
       });
       return Object.entries(counts)
         .map(([name, value]) => ({ name: name as AccidentCause, value: value! })) // Assert value is not undefined
         .sort((a, b) => b.value - a.value)
         .slice(0, 5);
   }, [filteredAccidents]);


  // Chart Configs
   const typeChartConfig = {
       value: { label: "Quantidade" },
       [AccidentType.Leve]: { label: "Leve", color: "hsl(var(--chart-1))" },
       [AccidentType.Grave]: { label: "Grave", color: "hsl(var(--chart-2))" },
       [AccidentType.Fatal]: { label: "Fatal", color: "hsl(var(--destructive))" },
       [AccidentType.Trajeto]: { label: "Trajeto", color: "hsl(var(--chart-4))" },
       [AccidentType.Tipico]: { label: "Típico", color: "hsl(var(--chart-5))" },
   } satisfies ChartConfig;

    const causeChartConfig = {
      value: { label: "Quantidade" },
      [AccidentCause.Queda]: { label: "Queda", color: "hsl(var(--chart-1))" },
      [AccidentCause.Choque_Eletrico]: { label: "Choque Elétrico", color: "hsl(var(--chart-2))" },
      [AccidentCause.Impacto]: { label: "Impacto", color: "hsl(var(--chart-3))" },
      [AccidentCause.Corte]: { label: "Corte", color: "hsl(var(--chart-4))" },
      [AccidentCause.Projecao_Particulas]: { label: "Projeção Partículas", color: "hsl(var(--chart-5))" },
      [AccidentCause.Quimico]: { label: "Químico", color: "hsl(var(--chart-1))" },
      [AccidentCause.Ergonomico]: { label: "Ergonômico", color: "hsl(var(--chart-2))" },
      [AccidentCause.Biologico]: { label: "Biológico", color: "hsl(var(--chart-3))" },
      [AccidentCause.Outro]: { label: "Outro", color: "hsl(var(--chart-4))" },
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
              <p className="text-xs text-muted-foreground">
                  {statistics.fatalAccidents > 0 ? (
                     <span className="text-destructive">{statistics.fatalAccidents} fatais incluídos</span>
                  ) : (
                     <span className="text-green-600">Nenhum fatal</span>
                  )}
              </p>
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
              <p className="text-xs text-muted-foreground">Acidentes (com afast.) x 1M / HHT</p>
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
                <CardDescription>Valor base para cálculo das taxas. Ajuste conforme necessário.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Input
                  type="number"
                  value={totalHoursWorked}
                  onChange={(e) => setTotalHoursWorked(Number(e.target.value) || 0)}
                  className="max-w-[200px]"
                  placeholder="Total de horas"
                  disabled={isLoading} // Disable input while loading
                />
                 <span className="text-sm text-muted-foreground">horas</span>
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
                   <BarChart data={accidentsByType} layout="vertical" accessibilityLayer margin={{ right: 20 }}>
                     <CartesianGrid horizontal={false}/>
                     <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={80} className="text-xs" />
                     <XAxis type="number" />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                     <Legend content={({ payload }) => <ChartLegendContent payload={payload} nameKey="name" className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-2" />} />
                      <Bar dataKey="value" layout="vertical" radius={5}>
                          {accidentsByType.map((entry) => (
                            <Cell key={`cell-${entry.name}`} fill={typeChartConfig[entry.name]?.color ?? "hsl(var(--muted))"} />
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
                     <BarChart data={accidentsByCause} layout="vertical" accessibilityLayer margin={{ right: 20 }}>
                       <CartesianGrid horizontal={false}/>
                       <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} width={100} className="text-xs" />
                       <XAxis type="number" />
                       <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="value" layout="vertical" radius={4}>
                           {accidentsByCause.map((entry) => (
                              <Cell key={`cell-${entry.name}`} fill={causeChartConfig[entry.name]?.color ?? "hsl(var(--muted))"} />
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
                <DialogTitle>{editingRecordId ? 'Editar Registro de Acidente' : 'Registrar Novo Acidente'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {/* Date */}
                   <div className="space-y-1">
                      <Label htmlFor="date">Data*</Label>
                      <Controller
                          control={control}
                          name="date"
                          render={({ field }) => (
                             <DatePicker date={field.value} setDate={field.onChange} required />
                           )}
                      />
                       {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                   </div>
                   {/* Time */}
                   <div className="space-y-1">
                      <Label htmlFor="time">Hora (Opcional)</Label>
                      <Input id="time" type="time" {...register('time')} />
                   </div>
                   {/* Employee Name (Dropdown) */}
                   <div className="space-y-1">
                       <Label htmlFor="employeeId">Colaborador*</Label>
                        <Controller
                            control={control}
                            name="employeeId"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange} required>
                                     <SelectTrigger id="employeeId"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                     <SelectContent>
                                         {mockEmployees.map(emp => (
                                             <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                         ))}
                                     </SelectContent>
                                 </Select>
                            )}
                        />
                        {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId.message}</p>}
                   </div>
                    {/* Department */}
                   <div className="space-y-1">
                      <Label htmlFor="department">Departamento*</Label>
                      <Input id="department" {...register('department')} required />
                       {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
                   </div>
                   {/* Location */}
                   <div className="space-y-1">
                      <Label htmlFor="location">Local Específico*</Label>
                      <Input id="location" {...register('location')} required />
                       {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                   </div>
                   {/* Type */}
                   <div className="space-y-1">
                      <Label htmlFor="type">Tipo*</Label>
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} required>
                               <SelectTrigger id="type"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                               <SelectContent>
                                 {Object.values(AccidentType).map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                               </SelectContent>
                            </Select>
                        )}
                      />
                       {errors.type && <p className="text-xs text-destructive">{errors.type.message}</p>}
                   </div>
                   {/* Cause */}
                   <div className="space-y-1">
                      <Label htmlFor="cause">Causa Principal*</Label>
                      <Controller
                        control={control}
                        name="cause"
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange} required>
                             <SelectTrigger id="cause"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                             <SelectContent>
                                 {Object.values(AccidentCause).map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                             </SelectContent>
                          </Select>
                        )}
                      />
                       {errors.cause && <p className="text-xs text-destructive">{errors.cause.message}</p>}
                   </div>
                   {/* Cause Details */}
                   <div className="space-y-1 lg:col-span-2">
                      <Label htmlFor="causeDetails">Detalhes Adicionais da Causa</Label>
                      <Input id="causeDetails" {...register('causeDetails')} placeholder="Ex: Falta de EPI, condição insegura" />
                   </div>
                   {/* Days Off */}
                   <div className="space-y-1">
                       <Label htmlFor="daysOff">Dias de Afastamento*</Label>
                       <Input id="daysOff" type="number" min="0" {...register('daysOff', { valueAsNumber: true })} required />
                       {errors.daysOff && <p className="text-xs text-destructive">{errors.daysOff.message}</p>}
                   </div>
                   {/* CID-10 */}
                   <div className="space-y-1">
                      <Label htmlFor="cid10Code">CID-10 (se aplicável)</Label>
                      <Input id="cid10Code" {...register('cid10Code')} placeholder="Opcional" />
                   </div>
                    {/* Investigation Status */}
                    <div className="space-y-1">
                        <Label htmlFor="investigationStatus">Status Investigação*</Label>
                        <Controller
                            control={control}
                            name="investigationStatus"
                            render={({ field }) => (
                               <Select value={field.value} onValueChange={field.onChange} required>
                                   <SelectTrigger id="investigationStatus"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                   <SelectContent>
                                     {Object.values(InvestigationStatus).map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                                   </SelectContent>
                                </Select>
                            )}
                         />
                     </div>
                     {/* Report URL */}
                    <div className="space-y-1">
                       <Label htmlFor="reportUrl">Link Relatório Análise (Opcional)</Label>
                       <Input id="reportUrl" type="url" {...register('reportUrl')} placeholder="http://..." />
                    </div>
                     {/* CAT Issued */}
                    <div className="flex items-center space-x-2 pt-4 lg:col-span-3">
                        <Controller
                            control={control}
                            name="catIssued"
                            render={({ field }) => (
                               <Checkbox id="catIssued" checked={field.value} onCheckedChange={field.onChange} />
                            )}
                         />
                         <Label htmlFor="catIssued">Comunicação de Acidente de Trabalho (CAT) Emitida?</Label>
                     </div>

                </div>
                {/* Description */}
                <div className="space-y-1 mt-4">
                   <Label htmlFor="description">Descrição Detalhada do Acidente*</Label>
                   <Textarea id="description" {...register('description')} rows={4} required />
                   {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>{isLoading ? 'Salvando...' : editingRecordId ? 'Salvar Alterações' : 'Registrar'}</Button>
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
            disabled={isLoading}
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
              {isLoading ? (
                 <TableRow>
                     <TableCell colSpan={9} className="h-24 text-center">Carregando...</TableCell>
                 </TableRow>
              ) : filteredAccidents.length > 0 ? (
                filteredAccidents.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell> {/* Format date */}
                    <TableCell className="font-medium">{record.employeeName || record.employeeId}</TableCell> {/* Display name or ID */}
                    <TableCell>{record.department}</TableCell>
                    <TableCell>
                        <Badge variant={record.type === 'Fatal' ? 'destructive' : record.type === 'Grave' ? 'secondary' : 'default'}>{record.type}</Badge>
                    </TableCell>
                    <TableCell>{record.cause}</TableCell>
                    <TableCell>{record.daysOff}</TableCell>
                    <TableCell>{record.catIssued ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                         <Badge variant={record.investigationStatus === 'Concluida' ? 'default' : record.investigationStatus === 'Em_Andamento' ? 'secondary' : 'outline'}>
                             {record.investigationStatus.replace('_', ' ')} {/* Display status prettily */}
                         </Badge>
                    </TableCell>
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
                              Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro do acidente de <span className="font-medium">{record.employeeName || record.employeeId}</span> em {format(new Date(record.date), 'dd/MM/yyyy')}.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={isLoading}>
                                {isLoading ? 'Excluindo...' : 'Excluir'}
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

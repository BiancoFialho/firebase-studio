// src/app/statistics/page.tsx
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useForm, Controller, SubmitHandler, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, TrendingUp, AlertCircle, Calculator, Loader2 } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from 'recharts';
import { AccidentRecord as PrismaAccidentRecord } from '@prisma/client';
// Import string union types defined in lib/types.ts for frontend validation
import type { AccidentType, AccidentCause, InvestigationStatus, EmployeeSelectItem, } from '@/lib/types';
import { calculateFrequencyRate, calculateSeverityRate } from '@/lib/utils';
import { format } from 'date-fns';
import { createAccident, getAccidents, updateAccident, deleteAccident, getEmployees } from './actions'; // Import server actions

// Extend Prisma type if needed, or use directly
// type AccidentRecord = PrismaAccidentRecord;
type AccidentRecordWithEmployee = PrismaAccidentRecord & {
    employeeName?: string | null; // Prisma action will add this
};
// Use the simplified EmployeeSelectItem type for dropdown state
type EmployeeForSelect = EmployeeSelectItem;

// Define valid string values for enums based on schema (or import from lib/types)
const accidentTypes: AccidentType[] = ["Leve", "Grave", "Fatal", "Tipico", "Trajeto"];
const accidentCauses: AccidentCause[] = ["Queda", "Choque_Eletrico", "Impacto", "Corte", "Projecao_Particulas", "Quimico", "Ergonomico", "Biologico", "Outro"];
const investigationStatuses: InvestigationStatus[] = ["Pendente", "Em_Andamento", "Concluida"];

// --- Form Validation Schema ---
// Use zod enums based on the defined string arrays for type safety
const accidentSchema = z.object({
  id: z.string().optional(), // Optional for creation
  date: z.date({ required_error: "Data é obrigatória." }),
  time: z.string().optional(),
  employeeId: z.string().min(1, "Colaborador é obrigatório."), // Use ID for relation
  department: z.string().min(1, "Departamento é obrigatório."),
  location: z.string().min(1, "Local é obrigatório."),
  type: z.enum(accidentTypes, { errorMap: () => ({ message: "Tipo é obrigatório." }) }),
  cause: z.enum(accidentCauses, { errorMap: () => ({ message: "Causa é obrigatória." }) }),
  causeDetails: z.string().optional(),
  daysOff: z.coerce.number().min(0, "Dias de afastamento não pode ser negativo.").default(0), // Use coerce for number conversion
  description: z.string().min(1, "Descrição é obrigatória."),
  cid10Code: z.string().optional(),
  catIssued: z.boolean().default(false),
  investigationStatus: z.enum(investigationStatuses).default("Pendente"),
  reportUrl: z.string().optional(),
});

type AccidentFormData = z.infer<typeof accidentSchema>;

// Mock total hours worked (replace with fetching or input)
const mockHoursWorked = 500000;

export default function StatisticsPage() {
  const [accidents, setAccidents] = useState<AccidentRecordWithEmployee[]>([]);
  const [employees, setEmployees] = useState<EmployeeForSelect[]>([]); // State for employee dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecordId, setEditingRecordId] = useState<string | null>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // For form submission state
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting ID


  const { register, handleSubmit, control, reset, setValue, formState: { errors, isDirty } } = useForm<AccidentFormData>({
    resolver: zodResolver(accidentSchema),
    defaultValues: {
        date: new Date(),
        employeeId: '',
        department: '',
        location: '',
        type: undefined, // Explicitly set to undefined initially
        cause: undefined, // Explicitly set to undefined initially
        daysOff: 0,
        description: '',
        catIssued: false,
        investigationStatus: "Pendente", // Default string value
    }
  });

  // Access totalHoursWorked from the form state
  const totalHoursWorked = useWatch({ control, name: "totalHoursWorked", defaultValue: mockHoursWorked });


  // --- Data Fetching ---
  const fetchData = useCallback(async () => { // Renamed function
    setIsLoading(true);
    try {
      const [fetchedAccidents, fetchedEmployees] = await Promise.all([
        getAccidents(),
        getEmployees() // Fetch employees for the dropdown
      ]);
      setAccidents(fetchedAccidents);
      setEmployees(fetchedEmployees.map(emp => ({ id: emp.id, name: emp.name }))); // Map to simplified Employee type
    } catch (error: any) { // Catch specific error type if possible
      console.error("Error fetching data:", error);
      toast({
          title: "Erro ao Carregar Dados",
          description: error.message || "Não foi possível buscar os dados iniciais. Tente recarregar a página.",
          variant: "destructive",
          duration: 10000 // Longer duration for error messages
        });
      // Optionally set empty states or specific error states
      setAccidents([]);
      setEmployees([]);
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Fetch data on initial load


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

   const filteredAccidents = useMemo(() => accidents.filter((record) =>
       record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
       record.cause.toLowerCase().includes(searchTerm.toLowerCase())
   ), [accidents, searchTerm]);


  const handleOpenForm = (record: AccidentRecordWithEmployee | null = null) => {
    if (record) {
      setEditingRecordId(record.id);
      // Use reset to populate the form fields correctly
      reset({ // Use reset to ensure all fields are updated
        id: record.id,
        date: new Date(record.date), // Ensure it's a Date object
        time: record.time || undefined,
        employeeId: record.employeeId || '', // Use employeeId
        department: record.department,
        location: record.location,
        type: record.type as AccidentType, // Cast to the specific string union type
        cause: record.cause as AccidentCause, // Cast to the specific string union type
        causeDetails: record.causeDetails || undefined,
        daysOff: record.daysOff,
        description: record.description,
        cid10Code: record.cid10Code || undefined,
        catIssued: record.catIssued,
        investigationStatus: record.investigationStatus as InvestigationStatus, // Cast
        reportUrl: record.reportUrl || undefined,
      });
    } else {
      setEditingRecordId(null);
      reset({ // Reset form to default values for creation
            date: new Date(),
            employeeId: '',
            department: '',
            location: '',
            type: undefined, // Keep undefined for placeholder
            cause: undefined, // Keep undefined for placeholder
            daysOff: 0,
            description: '',
            catIssued: false,
            investigationStatus: "Pendente",
            time: undefined,
            causeDetails: undefined,
            cid10Code: undefined,
            reportUrl: undefined,
      });
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingRecordId(null);
    reset(); // Reset form fields
  };

  const onSubmit: SubmitHandler<AccidentFormData> = async (data) => {
    setIsSubmitting(true); // Indicate submission start
    try {
       // Prepare data for Prisma action (ensure correct types)
        const dataToSave = {
            date: data.date,
            time: data.time || null,
            employeeId: data.employeeId, // Pass employeeId directly
            department: data.department,
            location: data.location,
            type: data.type,
            cause: data.cause,
            causeDetails: data.causeDetails || null,
            daysOff: data.daysOff,
            description: data.description,
            cid10Code: data.cid10Code || null,
            catIssued: data.catIssued,
            investigationStatus: data.investigationStatus,
            reportUrl: data.reportUrl || null,
        };

      if (editingRecordId) {
        // Update requires ID in the payload for Prisma Unchecked types
        await updateAccident(editingRecordId, { ...dataToSave });
        toast({ title: "Sucesso", description: "Registro de acidente atualizado." });
      } else {
        // Create action expects data without ID
        await createAccident({ ...dataToSave });
        toast({ title: "Sucesso", description: "Novo acidente registrado." });
      }
      handleCloseForm();
      fetchData(); // Re-fetch data to show the new/updated record
    } catch (error: any) {
      console.error("Error saving accident:", error);
      toast({ title: "Erro ao Salvar", description: error.message || "Falha ao salvar o registro do acidente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false); // Indicate submission end
    }
  };

  const handleDelete = async (id: string) => {
     setIsDeleting(id); // Indicate which record is being deleted
     try {
       await deleteAccident(id);
       // Optimistic UI update (remove from local state)
       // setAccidents(accidents.filter(r => r.id !== id));
       toast({ title: "Sucesso", description: "Registro de acidente excluído.", variant: "destructive" });
       fetchData(); // Re-fetch data to confirm deletion from server
     } catch (error: any) {
        console.error("Error deleting accident:", error);
        toast({ title: "Erro ao Excluir", description: error.message || "Falha ao excluir o registro do acidente.", variant: "destructive" });
     } finally {
        setIsDeleting(null); // Reset deleting state
     }
  };

  // --- Statistics Calculation ---
   const statistics = useMemo(() => {
       const periodAccidents = filteredAccidents; // Use filtered accidents for consistency
       const numberOfAccidents = periodAccidents.length;
       const accidentsWithLostTime = periodAccidents.filter(a => a.daysOff > 0).length;
       const totalDaysLost = periodAccidents.reduce((sum, acc) => sum + acc.daysOff, 0);
       const fatalAccidents = periodAccidents.filter(a => a.type === "Fatal").length; // Use string value

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
       const counts: { [key in AccidentType]?: number } = {}; // Use string union type
       filteredAccidents.forEach(acc => {
           const typeKey = acc.type as AccidentType; // Cast to be sure
           counts[typeKey] = (counts[typeKey] || 0) + 1;
       });
       // Filter out entries with zero count
       return (Object.entries(counts) as [AccidentType, number][])
         .map(([name, value]) => ({ name: name.replace('_', ' '), value })) // Replace underscores for display
         .filter(item => item.value > 0);
   }, [filteredAccidents]);


   const accidentsByCause = useMemo(() => {
       const counts: { [key in AccidentCause]?: number } = {}; // Use string union type
       filteredAccidents.forEach(acc => {
         const causeKey = acc.cause as AccidentCause; // Cast
         counts[causeKey] = (counts[causeKey] || 0) + 1;
       });
       // Filter, sort, and take top 5
       return (Object.entries(counts) as [AccidentCause, number][])
         .map(([name, value]) => ({ name: name.replace('_', ' '), value: value! })) // Replace underscores
         .filter(item => item.value > 0)
         .sort((a, b) => b.value - a.value)
         .slice(0, 5);
   }, [filteredAccidents]);


  // Chart Configs - Use string keys corresponding to the enum values
   const typeChartConfig = {
       value: { label: "Quantidade" },
       Leve: { label: "Leve", color: "hsl(var(--chart-1))" },
       Grave: { label: "Grave", color: "hsl(var(--chart-2))" },
       Fatal: { label: "Fatal", color: "hsl(var(--destructive))" },
       Trajeto: { label: "Trajeto", color: "hsl(var(--chart-4))" },
       Tipico: { label: "Típico", color: "hsl(var(--chart-5))" },
   } satisfies ChartConfig;

    const causeChartConfig = {
      value: { label: "Quantidade" },
      Queda: { label: "Queda", color: "hsl(var(--chart-1))" },
      "Choque Eletrico": { label: "Choque Elétrico", color: "hsl(var(--chart-2))" }, // Match display name
      Impacto: { label: "Impacto", color: "hsl(var(--chart-3))" },
      Corte: { label: "Corte", color: "hsl(var(--chart-4))" },
      "Projecao Particulas": { label: "Projeção Partículas", color: "hsl(var(--chart-5))" }, // Match display name
      Quimico: { label: "Químico", color: "hsl(var(--chart-1))" },
      Ergonomico: { label: "Ergonômico", color: "hsl(var(--chart-2))" },
      Biologico: { label: "Biológico", color: "hsl(var(--chart-3))" },
      Outro: { label: "Outro", color: "hsl(var(--chart-4))" },
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
              <p className="text-xs text-muted-foreground">Acidentes (c/ afast.) x 1M / HHT</p>
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
                <CardDescription className='text-muted-foreground'>Valor base para cálculo das taxas. Ajuste conforme necessário.</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-2">
                <Input
                  type="number"
                  value={totalHoursWorked}
                  onChange={(e) => setTotalHoursWorked(Number(e.target.value) || 0)}
                  className="max-w-[200px]"
                  placeholder="Total de horas"
                  disabled={isLoading || isSubmitting} // Disable while loading or submitting
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
                     <XAxis type="number" allowDecimals={false} />
                      <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                      <Bar dataKey="value" layout="vertical" radius={5}>
                          {accidentsByType.map((entry) => (
                             <Cell key={`cell-${entry.name}`} fill={typeChartConfig[entry.name as keyof typeof typeChartConfig]?.color ?? "hsl(var(--muted))"} />
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
                       <XAxis type="number" allowDecimals={false}/>
                       <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                        <Bar dataKey="value" layout="vertical" radius={4}>
                           {accidentsByCause.map((entry) => (
                               // Use replace to match chart config key if spaces were introduced
                               <Cell key={`cell-${entry.name}`} fill={causeChartConfig[entry.name as keyof typeof causeChartConfig]?.color ?? "hsl(var(--muted))"} />
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
           {/* Dialog Form */}
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
               {/* Open Button */}
              <Button onClick={() => handleOpenForm()} disabled={isLoading || isSubmitting} size={"sm"} >
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Acidente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()}>
              <DialogHeader>
                <DialogTitle>{editingRecordId ? 'Editar Registro de Acidente' : 'Registrar Novo Acidente'}</DialogTitle>
              </DialogHeader>
              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {/* Date */}
                   <div className="space-y-1">
                      <Label htmlFor="date">Data*</Label>
                      <Controller
                          control={control}
                          name="date"
                          render={({ field }) => (
                             <DatePicker date={field.value} setDate={field.onChange} required disabled={isSubmitting}/>
                           )}
                      />
                       {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
                   </div>
                   {/* Time */}
                   <div className="space-y-1">
                      <Label htmlFor="time">Hora (Opcional)</Label>
                      <Input id="time" type="time" {...register('time')} disabled={isSubmitting}/>
                   </div>
                   {/* Employee Name (Dropdown) */}
                   <div className="space-y-1">
                       <Label htmlFor="employeeId">Colaborador*</Label>
                        <Controller
                            control={control}
                            name="employeeId"
                            render={({ field }) => (
                                <Select value={field.value} onValueChange={field.onChange} required disabled={isSubmitting || isLoading}>
                                     <SelectTrigger id="employeeId"><SelectValue placeholder={isLoading ? "Carregando..." : "Selecione..."} /></SelectTrigger>
                                     <SelectContent>
                                         {employees.map(emp => (
                                             <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                         ))}
                                         {employees.length === 0 && !isLoading && <SelectItem value="" disabled>Nenhum colaborador encontrado</SelectItem>}
                                     </SelectContent>
                                 </Select>
                            )}
                        />
                        {errors.employeeId && <p className="text-xs text-destructive">{errors.employeeId.message}</p>}
                   </div>
                    {/* Department */}
                   <div className="space-y-1">
                      <Label htmlFor="department">Departamento*</Label>
                      <Input id="department" {...register('department')} required disabled={isSubmitting}/>
                       {errors.department && <p className="text-xs text-destructive">{errors.department.message}</p>}
                   </div>
                   {/* Location */}
                   <div className="space-y-1">
                      <Label htmlFor="location">Local Específico*</Label>
                      <Input id="location" {...register('location')} required disabled={isSubmitting}/>
                       {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
                   </div>
                   {/* Type */}
                   <div className="space-y-1">
                      <Label htmlFor="type">Tipo*</Label>
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange} required disabled={isSubmitting}>
                               <SelectTrigger id="type"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                               <SelectContent>
                                 {accidentTypes.map(t => <SelectItem key={t} value={t}>{t.replace('_', ' ')}</SelectItem>)}
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
                          <Select value={field.value} onValueChange={field.onChange} required disabled={isSubmitting}>
                             <SelectTrigger id="cause"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                             <SelectContent>
                                 {accidentCauses.map(c => <SelectItem key={c} value={c}>{c.replace('_', ' ')}</SelectItem>)}
                             </SelectContent>
                          </Select>
                        )}
                      />
                       {errors.cause && <p className="text-xs text-destructive">{errors.cause.message}</p>}
                   </div>
                   {/* Cause Details */}
                   <div className="space-y-1 lg:col-span-2">
                      <Label htmlFor="causeDetails">Detalhes Adicionais da Causa</Label>
                      <Input id="causeDetails" {...register('causeDetails')} placeholder="Ex: Falta de EPI, condição insegura" disabled={isSubmitting}/>
                   </div>
                   {/* Days Off */}
                   <div className="space-y-1">
                       <Label htmlFor="daysOff">Dias de Afastamento*</Label>
                       <Input id="daysOff" type="number" min="0" {...register('daysOff')} required disabled={isSubmitting}/>
                       {errors.daysOff && <p className="text-xs text-destructive">{errors.daysOff.message}</p>}
                   </div>
                   {/* CID-10 */}
                   <div className="space-y-1">
                      <Label htmlFor="cid10Code">CID-10 (se aplicável)</Label>
                      <Input id="cid10Code" {...register('cid10Code')} placeholder="Opcional" disabled={isSubmitting}/>
                   </div>
                    {/* Investigation Status */}
                    <div className="space-y-1">
                        <Label htmlFor="investigationStatus">Status Investigação*</Label>
                        <Controller
                            control={control}
                            name="investigationStatus"
                            render={({ field }) => (
                               <Select value={field.value} onValueChange={field.onChange} required disabled={isSubmitting}>
                                   <SelectTrigger id="investigationStatus"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                   <SelectContent>
                                     {investigationStatuses.map(s => <SelectItem key={s} value={s}>{s.replace('_', ' ')}</SelectItem>)}
                                   </SelectContent>
                                </Select>
                            )}
                         />
                         {errors.investigationStatus && <p className="text-xs text-destructive">{errors.investigationStatus.message}</p>}
                     </div>
                     {/* Report URL */}
                    <div className="space-y-1">
                       <Label htmlFor="reportUrl">Link Relatório Análise (Opcional)</Label>
                       <Input id="reportUrl" type="url" {...register('reportUrl')} placeholder="http://..." disabled={isSubmitting}/>
                    </div>
                     {/* CAT Issued */}
                    <div className="flex items-center space-x-2 pt-4 lg:col-span-3">
                        <Controller
                            control={control}
                            name="catIssued"
                            render={({ field }) => (
                               <Checkbox id="catIssued" checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                            )}
                         />
                         <Label htmlFor="catIssued">Comunicação de Acidente de Trabalho (CAT) Emitida?</Label>
                     </div>

                </div>
                {/* Description */}
                <div className="space-y-1 mt-4">
                   <Label htmlFor="description">Descrição Detalhada do Acidente*</Label>
                   <Textarea id="description" {...register('description')} rows={4} required disabled={isSubmitting}/>
                   {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
                </div>
                <DialogFooter className="mt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>Cancelar</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isSubmitting || !isDirty}> {/* Disable if submitting or form hasn't changed */}
                    {isSubmitting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                        ) : editingRecordId ? 'Salvar Alterações' : 'Registrar'
                    }
                  </Button>
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
                     <TableCell colSpan={9} className="h-24 text-center">
                         <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                         Carregando...
                     </TableCell>
                 </TableRow>
              ) : filteredAccidents.length > 0 ? (
                filteredAccidents.map((record) => (
                  <TableRow key={record.id} className={isDeleting === record.id ? 'opacity-50' : ''}>
                    <TableCell>{format(new Date(record.date), 'dd/MM/yyyy')}</TableCell>
                    <TableCell className="font-medium">{record.employeeName ?? 'N/A'}</TableCell>
                     <TableCell>{record.department}</TableCell>
                    <TableCell>
                        <Badge variant={record.type === "Fatal" ? 'destructive' : record.type === "Grave" ? 'secondary' : 'default'}>{record.type.replace('_', ' ')}</Badge>
                    </TableCell>
                    <TableCell>{record.cause.replace('_', ' ')}</TableCell>
                    <TableCell>{record.daysOff}</TableCell>
                    <TableCell>{record.catIssued ? 'Sim' : 'Não'}</TableCell>
                    <TableCell>
                         <Badge variant={record.investigationStatus === "Concluida" ? 'default' : record.investigationStatus === "Em_Andamento" ? 'secondary' : 'outline'}>
                             {record.investigationStatus.replace('_', ' ')}
                         </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(record)} disabled={isSubmitting || !!isDeleting}>
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Editar</span>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isSubmitting || !!isDeleting}>
                            {isDeleting === record.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
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
                            <AlertDialogCancel disabled={!!isDeleting}>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(record.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={!!isDeleting}>
                                {isDeleting === record.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                {isDeleting === record.id ? 'Excluindo...' : 'Excluir'}
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

// src/app/diseases/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Import Input from your components
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Import Table components
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog'; // Import Dialog components
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'; // Import Select components
import { DatePicker } from '@/components/date-picker'; // Import DatePicker
import { PlusCircle, Search, Edit, Trash2, FileText, LinkIcon, AlertTriangle } from 'lucide-react'; // Import Icons
import { useToast } from '@/hooks/use-toast'; // Import useToast hook
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components
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

import type { OccupationalDiseaseRecord } from '@/lib/types';

// Mock Data
const mockDiseases: OccupationalDiseaseRecord[] = [
  { id: 'dis1', employeeName: 'Maria Oliveira', diseaseType: 'LER/DORT', cid10Code: 'M77.1', diagnosisDate: new Date(2023, 9, 10), relatedTask: 'Digitação', daysOff: 30, status: 'Afastado', medicalReportUrl: 'https://example.com/report/ler-maria', pcmsoLink: 'pcmso-record-456' },
  { id: 'dis2', employeeName: 'Carlos Pereira', diseaseType: 'Perda Auditiva (PAIR)', cid10Code: 'H91.0', diagnosisDate: new Date(2024, 1, 25), relatedTask: 'Operação de Máquina Ruídosa', daysOff: 0, status: 'Ativo', pcmsoLink: 'pcmso-record-123' },
  { id: 'dis3', employeeName: 'Ana Costa', diseaseType: 'Dermatose Ocupacional', cid10Code: 'L23.5', diagnosisDate: new Date(2024, 5, 5), relatedTask: 'Manuseio de Químicos', daysOff: 7, status: 'Recuperado' },
  { id: 'dis4', employeeName: 'Pedro Santos', diseaseType: 'LER/DORT', cid10Code: 'M54.2', diagnosisDate: new Date(2024, 3, 12), relatedTask: 'Montagem', daysOff: 60, status: 'Afastado' },
];

// Example National Average (Placeholder)
const NATIONAL_AVERAGE_ABSENCE_RATE = 2.5; // Example: 2.5% absence rate due to occupational diseases

export default function DiseasesPage() {
  const [diseases, setDiseases] = useState<OccupationalDiseaseRecord[]>(mockDiseases);
  const [searchTerm, setSearchTerm] = useState(''); // For search functionality
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<OccupationalDiseaseRecord | null>(null);
  const { toast } = useToast();

  // Form State
  const [employeeName, setEmployeeName] = useState('');
  const [diseaseType, setDiseaseType] = useState('');
  const [cid10Code, setCid10Code] = useState('');
  const [diagnosisDate, setDiagnosisDate] = useState<Date | undefined>(new Date());
  const [relatedTask, setRelatedTask] = useState('');
  const [medicalReportUrl, setMedicalReportUrl] = useState('');
  const [daysOff, setDaysOff] = useState<number>(0);
  const [status, setStatus] = useState<OccupationalDiseaseRecord['status']>('Ativo');
  const [pcmsoLink, setPcmsoLink] = useState('');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value); // Update search term on input change
  };

  // Filter diseases based on the search term

  // Calculate statistics
  const averageDaysOff = useMemo(() => {
    const diseasesWithDaysOff = filteredDiseases.filter(d => d.daysOff > 0);
    if (diseasesWithDaysOff.length === 0) return 0;
    const totalDays = diseasesWithDaysOff.reduce((sum, d) => sum + d.daysOff, 0);
    return totalDays / diseasesWithDaysOff.length;
  }, [filteredDiseases]);

  const absenceRate = useMemo(() => {
    const afastadosCount = filteredDiseases.filter(d => d.status === 'Afastado').length;
    const totalEmployeesMock = 50;
    if (totalEmployeesMock === 0) return 0;
    return (afastadosCount / totalEmployeesMock) * 100;
  }, [filteredDiseases]);

  const filteredDiseases = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return diseases.filter((record) =>
      record.employeeName.toLowerCase().includes(lowerCaseSearchTerm) ||
      record.diseaseType.toLowerCase().includes(lowerCaseSearchTerm) ||
      record.cid10Code.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [diseases, searchTerm]);

  // Check if the absence rate is high
  const isAbsenceRateHigh = absenceRate > NATIONAL_AVERAGE_ABSENCE_RATE;


  const resetForm = () => {
    setEmployeeName('');
    setDiseaseType('');
    setCid10Code('');
    setDiagnosisDate(new Date());
    setRelatedTask('');
    setMedicalReportUrl('');
    setDaysOff(0);
    setStatus('Ativo');
    setPcmsoLink('');
    setEditingRecord(null);
  };

  const handleOpenForm = (record: OccupationalDiseaseRecord | null = null) => {
    if (record) {
      setEditingRecord(record);
      setEmployeeName(record.employeeName);
      setDiseaseType(record.diseaseType);
      setCid10Code(record.cid10Code);
      setDiagnosisDate(record.diagnosisDate);
      setRelatedTask(record.relatedTask || '');
      setMedicalReportUrl(record.medicalReportUrl || '');
      setDaysOff(record.daysOff);
      setStatus(record.status);
      setPcmsoLink(record.pcmsoLink || '');
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
    if (!employeeName || !diseaseType || !cid10Code || !diagnosisDate || !status) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (*).",
        variant: "destructive",
      });
      return;
    }

    const newRecord: OccupationalDiseaseRecord = {
      id: editingRecord ? editingRecord.id : `dis${Date.now()}`,
      employeeName,
      diseaseType,
      cid10Code,
      diagnosisDate,
      relatedTask: relatedTask || undefined,
      medicalReportUrl: medicalReportUrl || undefined,
      daysOff,
      status,
      pcmsoLink: pcmsoLink || undefined,
    };

    if (editingRecord) {
      setDiseases(diseases.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({ title: "Sucesso", description: "Registro de doença ocupacional atualizado." });
    } else {
      setDiseases([newRecord, ...diseases]);
      toast({ title: "Sucesso", description: "Nova doença ocupacional registrada." });
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setDiseases(diseases.filter(r => r.id !== id));
    toast({ title: "Sucesso", description: "Registro de doença ocupacional excluído.", variant: "destructive" });
  };

  const getStatusBadgeVariant = (status: OccupationalDiseaseRecord['status']): "default" | "secondary" | "outline" => {
      switch (status) {
          case 'Ativo': return 'default'; // Use primary color
          case 'Afastado': return 'secondary'; // Use secondary color (Orange/Yellowish)
          case 'Recuperado': return 'outline'; // Use outline (Grey)
          default: return 'outline';
      }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Doenças Ocupacionais</h1>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Registrado</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{filteredDiseases.length}</div>
                  <p className="text-xs text-muted-foreground">Casos no período</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Média Dias Afastamento</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{averageDaysOff.toFixed(1)}</div>
                  <p className="text-xs text-muted-foreground">Para casos com afastamento</p>
              </CardContent>
          </Card>
          <Card className={isAbsenceRateHigh ? 'border-destructive' : ''}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taxa de Afastamento Atual</CardTitle>
                  {isAbsenceRateHigh && <AlertTriangle className="h-4 w-4 text-destructive" />}
              </CardHeader>
              <CardContent>
                  <div className={`text-2xl font-bold ${isAbsenceRateHigh ? 'text-destructive' : ''}`}>{absenceRate.toFixed(1)}%</div>
                  <p className={`text-xs ${isAbsenceRateHigh ? 'text-destructive' : 'text-muted-foreground'}`}>
                      {isAbsenceRateHigh ? `Acima da média nacional (${NATIONAL_AVERAGE_ABSENCE_RATE}%)` : `Dentro da média nacional (${NATIONAL_AVERAGE_ABSENCE_RATE}%)`}
                  </p>
              </CardContent>
          </Card>
      </div>

      {/* Detailed Records */}
      <div className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-semibold">Registros Detalhados</h2>
              <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                  <DialogTrigger asChild>
                      <Button onClick={() => handleOpenForm()}>
                          <PlusCircle className="mr-2 h-4 w-4" /> Registrar Doença
                      </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                          <DialogTitle>{editingRecord ? 'Editar Registro de Doença' : 'Registrar Nova Doença Ocupacional'}</DialogTitle>
                      </DialogHeader>
                      {/* Form */}
                      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {/* Employee Name */}
                         <div className="space-y-1">
                            <Label htmlFor="employeeName">Colaborador*</Label>
                            <Input id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />
                         </div>
                <Button onClick={() => handleOpenForm()}>
                  <PlusCircle className="mr-2 h-4 w-4" /> Registrar Doença
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingRecord ? 'Editar Registro de Doença' : 'Registrar Nova Doença Ocupacional'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Employee Name */}
                      <div className="space-y-1">
                         <Label htmlFor="employeeName">Colaborador*</Label>
                         <Input id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required />
                      </div>
                      {/* Disease Type */}
                      <div className="space-y-1">
                         <Label htmlFor="diseaseType">Tipo da Doença*</Label>
                         <Input id="diseaseType" value={diseaseType} onChange={(e) => setDiseaseType(e.target.value)} placeholder="Ex: LER/DORT, PAIR" required />
                      </div>
                       {/* CID-10 */}
                      <div className="space-y-1">
                         <Label htmlFor="cid10Code">CID-10*</Label>
                         <Input id="cid10Code" value={cid10Code} onChange={(e) => setCid10Code(e.target.value)} required />
                      </div>
                       {/* Diagnosis Date */}
                       <div className="space-y-1">
                          <Label htmlFor="diagnosisDate">Data Diagnóstico*</Label>
                          <DatePicker date={diagnosisDate} setDate={setDiagnosisDate} required />
                       </div>
                      {/* Related Task */}
                      <div className="space-y-1">
                         <Label htmlFor="relatedTask">Tarefa Relacionada (Opcional)</Label>
                         <Input id="relatedTask" value={relatedTask} onChange={(e) => setRelatedTask(e.target.value)} />
                      </div>
                       {/* Days Off */}
                      <div className="space-y-1">
                         <Label htmlFor="daysOff">Dias de Afastamento*</Label>
                         <Input id="daysOff" type="number" min="0" value={daysOff} onChange={(e) => setDaysOff(Number(e.target.value) || 0)} required />
                      </div>
                      {/* Status */}
                      <div className="space-y-1">
                         <Label htmlFor="status">Status*</Label>
                         <Select value={status} onValueChange={(v: OccupationalDiseaseRecord['status']) => setStatus(v)} required>
                            <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Ativo">Ativo (Trabalhando)</SelectItem>
                              <SelectItem value="Afastado">Afastado</SelectItem>
                              <SelectItem value="Recuperado">Recuperado (Retornou)</SelectItem>
                            </SelectContent>
                         </Select>
                      </div>
                      {/* Medical Report URL */}
                     <div className="space-y-1">
                        <Label htmlFor="medicalReportUrl">Link Laudo Médico (Opcional)</Label>
                        <Input id="medicalReportUrl" type="url" value={medicalReportUrl} onChange={(e) => setMedicalReportUrl(e.target.value)} />
                     </div>
                      {/* PCMSO Link */}
                     <div className="space-y-1">
                        <Label htmlFor="pcmsoLink">Link/ID PCMSO (Opcional)</Label>
                        <Input id="pcmsoLink" value={pcmsoLink} onChange={(e) => setPcmsoLink(e.target.value)} placeholder="Ex: pcmso-record-123"/>
                     </div>
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
              placeholder="Buscar por colaborador, tipo de doença ou CID-10..."
              className="pl-8 w-full sm:w-1/2 md:w-1/3"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableCaption>Registros de doenças ocupacionais.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Colaborador</TableHead>
                  <TableHead>Tipo Doença</TableHead>
                  <TableHead>CID-10</TableHead>
                  <TableHead>Data Diag.</TableHead>
                  <TableHead>Dias Afast.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDiseases.length > 0 ? (
                  filteredDiseases.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.employeeName}</TableCell>
                      <TableCell>{record.diseaseType}</TableCell>
                      <TableCell>{record.cid10Code}</TableCell>
                      <TableCell>{record.diagnosisDate.toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{record.daysOff}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right space-x-1">
                        {record.medicalReportUrl ? (
                          <Button variant="ghost" size="icon" asChild title="Ver Laudo">
                            <a href={record.medicalReportUrl} target="_blank" rel="noopener noreferrer">
                              <FileText className="h-4 w-4" />
                            </a>
                          </Button>
                        ) : (
                             <Button variant="ghost" size="icon" disabled title="Sem Laudo"><FileText className="h-4 w-4 text-muted-foreground/50" /></Button>
                        )}
                        {record.pcmsoLink && (
                            <Button variant="ghost" size="icon" title={`Link PCMSO: ${record.pcmsoLink}`} onClick={() => {
                                // Ideally, this would navigate to the PCMSO record or open a related modal
                                toast({ title: "Integração PCMSO", description: `ID/Link PCMSO: ${record.pcmsoLink} (funcionalidade futura)` });
                            }}>
                                <LinkIcon className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(record)} title="Editar">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Excluir">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro de doença ({record.diseaseType}) para <span className="font-medium">{record.employeeName}</span>.
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
                    <TableCell colSpan={7} className="h-24 text-center">
                      Nenhum registro de doença ocupacional encontrado.
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

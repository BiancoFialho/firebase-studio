

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, AlertTriangle, Users, Award, Eye, Link2, Loader2 } from 'lucide-react';
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
import type { TrainingRecord as PrismaTrainingRecord, TrainingType as PrismaTrainingType } from '@prisma/client';
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { getTrainingRecords, createTrainingRecord, updateTrainingRecord, deleteTrainingRecord, getTrainingTypes, getEmployees } from './actions'; // Import server actions
import type { TrainingRecordStatus, EmployeeSelectItem } from '@/lib/types'; // Import frontend type for status

// Extend Prisma type if needed
type TrainingRecord = PrismaTrainingRecord & { employeeName?: string | null, trainingTypeName?: string | null };
type TrainingType = PrismaTrainingType; // Assuming we get the full TrainingType object
type EmployeeForSelect = EmployeeSelectItem; // Use the simplified type

// Helper function to calculate status based on dates
const getTrainingStatus = (training: PrismaTrainingRecord): TrainingRecordStatus => {
  if (!training.expiryDate) return 'Valido';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(training.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);

  if (expiry < today) return 'Vencido';
  if (expiry <= thirtyDaysFromNow) return 'Proximo_ao_Vencimento';
  return 'Valido';
};


export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingRecord[]>([]);
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]); // State for training types
  const [employees, setEmployees] = useState<EmployeeForSelect[]>([]); // State for employee dropdown
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<TrainingRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null); // Track deleting ID
  const { toast } = useToast();

  // Form state
  // const [employeeName, setEmployeeName] = useState(''); // No longer needed directly
  const [employeeId, setEmployeeId] = useState(''); // Use employeeId
  const [trainingTypeId, setTrainingTypeId] = useState(''); // Link to TrainingType model
  const [trainingDate, setTrainingDate] = useState<Date | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [attendanceListFile, setAttendanceListFile] = useState<File | null>(null);
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const [currentAttendanceListUrl, setCurrentAttendanceListUrl] = useState<string | undefined>(undefined);
  const [currentCertificateUrl, setCurrentCertificateUrl] = useState<string | undefined>(undefined);

   // --- Data Fetching ---
   const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedTrainings, fetchedTypes, fetchedEmployees] = await Promise.all([
          getTrainingRecords(),
          getTrainingTypes(),
          getEmployees() // Fetch employees
      ]);
      // Process trainings to include type name and calculate status
      const processedTrainings = fetchedTrainings.map(t => {
          const type = fetchedTypes.find(tt => tt.id === t.trainingTypeId);
          return {
              ...t,
              status: getTrainingStatus(t) as TrainingRecordStatus, // Recalculate status and cast
              trainingTypeName: type?.name ?? 'Tipo Desconhecido' // Get name from fetched types
          };
      });
      setTrainings(processedTrainings);
      setTrainingTypes(fetchedTypes);
      setEmployees(fetchedEmployees.map(e => ({ id: e.id, name: e.name }))); // Map to select item format
    } catch (error: any) {
      console.error("Error fetching data:", error);
      toast({
          title: "Erro ao Carregar Dados",
          description: error.message || "Não foi possível buscar os dados. Tente recarregar.",
          variant: "destructive",
          duration: 10000
        });
       setTrainings([]);
       setTrainingTypes([]);
       setEmployees([]);
    } finally {
      setIsLoading(false);
    }
   }, [toast]);

   useEffect(() => {
      fetchData();
   }, [fetchData]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTrainings = useMemo(() => trainings.filter((training) =>
    (training.employeeName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (training.trainingTypeName?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  ), [trainings, searchTerm]);


  const resetForm = () => {
    // setEmployeeName('');
    setEmployeeId('');
    setTrainingTypeId('');
    setTrainingDate(undefined);
    setExpiryDate(undefined);
    setAttendanceListFile(null);
    setCertificateFile(null);
    setCurrentAttendanceListUrl(undefined);
    setCurrentCertificateUrl(undefined);
    setEditingTraining(null);
  };

   const handleOpenForm = (training: TrainingRecord | null = null) => {
       if (training) {
           setEditingTraining(training);
           // setEmployeeName(training.employeeName || ''); // No longer needed directly
           setEmployeeId(training.employeeId || ''); // Make sure employeeId exists
           setTrainingTypeId(training.trainingTypeId);
           setTrainingDate(training.trainingDate ? new Date(training.trainingDate) : undefined);
           setExpiryDate(training.expiryDate ? new Date(training.expiryDate) : undefined);
           setCurrentAttendanceListUrl(training.attendanceListUrl || undefined);
           setCurrentCertificateUrl(training.certificateUrl || undefined);
           setAttendanceListFile(null);
           setCertificateFile(null);
       } else {
           resetForm();
       }
       setIsFormOpen(true);
   };

  const handleCloseForm = () => {
      setIsFormOpen(false);
      resetForm();
  };

  // Handlers for file inputs
  const handleAttendanceFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          setAttendanceListFile(event.target.files[0]);
          setCurrentAttendanceListUrl(undefined);
      } else {
          setAttendanceListFile(null);
          if (editingTraining) setCurrentAttendanceListUrl(editingTraining.attendanceListUrl || undefined);
      }
  };

  const handleCertificateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          setCertificateFile(event.target.files[0]);
          setCurrentCertificateUrl(undefined);
      } else {
          setCertificateFile(null);
          if (editingTraining) setCurrentCertificateUrl(editingTraining.certificateUrl || undefined);
      }
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Add validation for employeeId and trainingTypeId
    if (!employeeId || !trainingTypeId || !trainingDate) {
        toast({
            title: "Erro",
            description: "Colaborador, Tipo de Treinamento e Data são obrigatórios.",
            variant: "destructive",
        });
        return;
    }
    setIsSubmitting(true);


     // --- Mock File Upload Logic (Needs real implementation) ---
     let attendanceUrl = currentAttendanceListUrl;
     if (attendanceListFile) {
       attendanceUrl = `/uploads/attendance/${Date.now()}-${encodeURIComponent(attendanceListFile.name)}`;
       console.log(`Simulating upload for attendance list: ${attendanceListFile.name} to ${attendanceUrl}`);
       // In a real app: attendanceUrl = await uploadFile(attendanceListFile);
     }

     let certificateUrl = currentCertificateUrl;
     if (certificateFile) {
       certificateUrl = `/uploads/certificates/${Date.now()}-${encodeURIComponent(certificateFile.name)}`;
       console.log(`Simulating upload for certificate: ${certificateFile.name} to ${certificateUrl}`);
       // In a real app: certificateUrl = await uploadFile(certificateFile);
     }
     // --- End Mock File Upload Logic ---

    const trainingData = {
      employeeId: employeeId, // Use employeeId from state
      trainingTypeId: trainingTypeId,
      trainingDate: trainingDate,
      expiryDate: expiryDate || null, // Prisma expects null for optional dates
      attendanceListUrl: attendanceUrl || null,
      certificateUrl: certificateUrl || null,
    };

    try {
        let savedRecord;
        if (editingTraining) {
            // For update, pass only the fields that might change. Prisma needs ID in where clause.
            await updateTrainingRecord(editingTraining.id, trainingData);
            toast({ title: "Sucesso", description: "Treinamento atualizado." });
        } else {
             // For create, pass the full data payload
            await createTrainingRecord(trainingData);
            toast({ title: "Sucesso", description: "Treinamento adicionado." });
        }
        handleCloseForm();
        fetchData(); // Re-fetch data
    } catch (error: any) {
        console.error("Error saving training:", error);
        toast({ title: "Erro ao Salvar", description: error.message || "Falha ao salvar o treinamento.", variant: "destructive" });
    } finally {
        setIsSubmitting(false);
    }
  };

 const handleDelete = async (id: string) => {
     setIsDeleting(id);
     try {
         await deleteTrainingRecord(id);
         toast({ title: "Sucesso", description: "Treinamento excluído.", variant: "destructive" });
         fetchData(); // Re-fetch data after deletion
     } catch (error: any) {
         console.error("Error deleting training:", error);
         toast({ title: "Erro ao Excluir", description: error.message || "Falha ao excluir o treinamento.", variant: "destructive" });
     } finally {
         setIsDeleting(null);
     }
 };


   const getStatusBadgeVariant = (status: TrainingRecordStatus): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
       case 'Valido': return 'default';
       case 'Vencido': return 'destructive';
       case 'Proximo_ao_Vencimento': return 'secondary';
       default: return 'outline';
     }
   };

   const handleViewFile = (url: string | undefined, fileName: string) => {
        if (url) {
            // In a real app, open the actual URL or trigger download
            // window.open(url, '_blank');
            toast({
                title: "Visualização Simulada",
                description: `Abriria o arquivo: ${fileName} (${url})`,
            });
        } else {
             toast({
                 title: "Arquivo Indisponível",
                 description: `Nenhum ${fileName} anexado.`,
                 variant: "destructive"
             });
        }
   };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Registros de Treinamentos</h1>
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
             <DialogTrigger asChild>
                 <Button onClick={() => handleOpenForm()} disabled={isLoading || isSubmitting}>
                     <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Registro
                 </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()} >
                 <DialogHeader>
                     <DialogTitle>{editingTraining ? 'Editar Registro' : 'Adicionar Novo Registro'}</DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                     {/* Employee Select Dropdown */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="employeeId" className="text-right">
                             Colaborador*
                         </Label>
                          <Select value={employeeId} onValueChange={setEmployeeId} required disabled={isSubmitting || isLoading}>
                             <SelectTrigger id="employeeId" className="col-span-3">
                                 <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o colaborador"} />
                             </SelectTrigger>
                             <SelectContent>
                                {employees.map(emp => (
                                    <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                ))}
                                {employees.length === 0 && !isLoading && <SelectItem value="" disabled>Nenhum colaborador cadastrado</SelectItem>}
                             </SelectContent>
                         </Select>
                     </div>
                     {/* Training Type Dropdown */}
                      <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="trainingTypeId" className="text-right">
                             Tipo*
                         </Label>
                         <Select value={trainingTypeId} onValueChange={setTrainingTypeId} required disabled={isSubmitting || isLoading}>
                             <SelectTrigger id="trainingTypeId" className="col-span-3">
                                 <SelectValue placeholder={isLoading ? "Carregando..." : "Selecione o tipo"} />
                             </SelectTrigger>
                             <SelectContent>
                                {trainingTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                                ))}
                                {trainingTypes.length === 0 && !isLoading && <SelectItem value="" disabled>Nenhum tipo cadastrado</SelectItem>}
                             </SelectContent>
                         </Select>
                      </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="trainingDate" className="text-right">
                             Data*
                         </Label>
                         <DatePicker date={trainingDate} setDate={setTrainingDate} className="col-span-3" required disabled={isSubmitting} />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="expiryDate" className="text-right">
                             Vencimento
                         </Label>
                         <DatePicker date={expiryDate} setDate={setExpiryDate} className="col-span-3" disabled={isSubmitting}/>
                     </div>
                     {/* Attendance List Upload */}
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="attendanceFile" className="text-right">
                              Lista Presença
                          </Label>
                          <div className="col-span-3 flex items-center gap-2">
                              <Input id="attendanceFile" type="file" onChange={handleAttendanceFileChange} className="flex-1" accept=".pdf,.doc,.docx,.jpg,.png" disabled={isSubmitting}/>
                              {currentAttendanceListUrl && !attendanceListFile && (
                                  <Button
                                      type="button" variant="link" size="sm"
                                      className="h-auto p-0 text-xs text-blue-600 hover:underline truncate max-w-[100px]"
                                      onClick={() => handleViewFile(currentAttendanceListUrl, 'lista de presença atual')}
                                      title={`Ver lista atual: ${currentAttendanceListUrl.split('/').pop()}`}
                                      disabled={isSubmitting} >
                                      Ver atual
                                  </Button>
                              )}
                              {attendanceListFile && (
                                  <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={attendanceListFile.name}>
                                      {attendanceListFile.name}
                                  </span>
                              )}
                          </div>
                      </div>
                      {/* Certificate Upload */}
                       <div className="grid grid-cols-4 items-center gap-4">
                           <Label htmlFor="certificateFile" className="text-right">
                               Certificado
                           </Label>
                           <div className="col-span-3 flex items-center gap-2">
                               <Input id="certificateFile" type="file" onChange={handleCertificateFileChange} className="flex-1" accept=".pdf,.jpg,.png" disabled={isSubmitting}/>
                               {currentCertificateUrl && !certificateFile && (
                                    <Button
                                      type="button" variant="link" size="sm"
                                      className="h-auto p-0 text-xs text-blue-600 hover:underline truncate max-w-[100px]"
                                      onClick={() => handleViewFile(currentCertificateUrl, 'certificado atual')}
                                      title={`Ver certificado atual: ${currentCertificateUrl.split('/').pop()}`}
                                      disabled={isSubmitting}>
                                       Ver atual
                                   </Button>
                               )}
                               {certificateFile && (
                                   <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={certificateFile.name}>
                                       {certificateFile.name}
                                   </span>
                               )}
                           </div>
                       </div>

                     <DialogFooter>
                          <DialogClose asChild>
                              <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>Cancelar</Button>
                          </DialogClose>
                         <Button type="submit" disabled={isSubmitting}>
                             {isSubmitting ? (
                                <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...
                                </>
                             ) : editingTraining ? 'Salvar Alterações' : 'Adicionar Registro'
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
          placeholder="Buscar por colaborador ou treinamento..."
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
          value={searchTerm}
          onChange={handleSearch}
          disabled={isLoading}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Lista dos últimos treinamentos registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo de Treinamento</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
             {isLoading ? (
                 <TableRow>
                     <TableCell colSpan={6} className="h-24 text-center">
                         <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                         Carregando...
                     </TableCell>
                 </TableRow>
             ) : filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <TableRow key={training.id} className={isDeleting === training.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">{training.employeeName ?? 'N/A'}</TableCell>
                  <TableCell>{training.trainingTypeName ?? 'N/A'}</TableCell>
                  <TableCell>{format(new Date(training.trainingDate), 'dd/MM/yyyy')}</TableCell>
                  <TableCell>{training.expiryDate ? format(new Date(training.expiryDate), 'dd/MM/yyyy') : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(training.status as TrainingRecordStatus)}>
                      {(training.status === 'Proximo_ao_Vencimento' || training.status === 'Vencido') && <AlertTriangle className="inline-block h-3 w-3 mr-1" />}
                      {training.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                     {/* View Buttons */}
                    <Button variant="ghost" size="icon" title="Ver Lista de Presença" onClick={() => handleViewFile(training.attendanceListUrl || undefined, 'lista de presença')} disabled={!training.attendanceListUrl || isSubmitting || !!isDeleting}>
                         <Users className={training.attendanceListUrl ? "h-4 w-4" : "h-4 w-4 text-muted-foreground/50"} />
                       </Button>
                     <Button variant="ghost" size="icon" title="Ver Certificado" onClick={() => handleViewFile(training.certificateUrl || undefined, 'certificado')} disabled={!training.certificateUrl || isSubmitting || !!isDeleting}>
                         <Award className={training.certificateUrl ? "h-4 w-4" : "h-4 w-4 text-muted-foreground/50"} />
                       </Button>
                     {/* Edit and Delete Buttons */}
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(training)} title="Editar" disabled={isSubmitting || !!isDeleting}>
                      <Edit className="h-4 w-4" />
                    </Button>
                     <AlertDialog>
                         <AlertDialogTrigger asChild>
                             <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Excluir" disabled={isSubmitting || !!isDeleting}>
                                  {isDeleting === training.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <Trash2 className="h-4 w-4" />}
                             </Button>
                         </AlertDialogTrigger>
                         <AlertDialogContent>
                             <AlertDialogHeader>
                                 <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                     Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro de treinamento para <span className="font-medium">{training.employeeName}</span> ({training.trainingTypeName}).
                                 </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                                 <AlertDialogCancel disabled={!!isDeleting}>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={() => handleDelete(training.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={!!isDeleting}>
                                     {isDeleting === training.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : null}
                                     {isDeleting === training.id ? 'Excluindo...' : 'Excluir'}
                                 </AlertDialogAction>
                             </AlertDialogFooter>
                         </AlertDialogContent>
                     </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum treinamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

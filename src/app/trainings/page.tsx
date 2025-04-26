
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker'; // Assume this component exists
import { PlusCircle, Search, Edit, Trash2, AlertTriangle, Users, Award, Eye } from 'lucide-react'; // Added Users, Award, Eye
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
import type { TrainingRecord } from '@/lib/types'; // Import TrainingRecord type
import { Badge } from "@/components/ui/badge"; // Ensure Badge is imported if used for status

// Mock data structure - replace with actual data fetching
const mockTrainings: TrainingRecord[] = [
  { id: '1', employeeName: 'João Silva', trainingType: 'NR-35 Trabalho em Altura', trainingDate: new Date(2023, 5, 15), expiryDate: new Date(2025, 5, 14), status: 'Válido', attendanceListUrl: '/docs/lista_presenca_nr35_joao.pdf', certificateUrl: '/docs/certificado_nr35_joao.pdf' },
  { id: '2', employeeName: 'Maria Oliveira', trainingType: 'NR-33 Espaços Confinados', trainingDate: new Date(2022, 10, 20), expiryDate: new Date(2023, 10, 19), status: 'Vencido' },
  { id: '3', employeeName: 'Carlos Pereira', trainingType: 'Primeiros Socorros', trainingDate: new Date(2024, 0, 10), status: 'Válido', certificateUrl: '/docs/certificado_ps_carlos.pdf' },
  { id: '4', employeeName: 'Ana Costa', trainingType: 'NR-35 Trabalho em Altura', trainingDate: new Date(2024, 6, 25), expiryDate: new Date(2026, 6, 24), status: 'Próximo ao Vencimento' }, // Adjusted expiry for testing status
  { id: '5', employeeName: 'Pedro Santos', trainingType: 'NR-10 Eletricidade', trainingDate: new Date(2023, 8, 1), expiryDate: new Date(2025, 7, 31), status: 'Válido', attendanceListUrl: '/docs/lista_presenca_nr10_pedro.pdf' },
];

// Helper function to calculate status based on dates
const getTrainingStatus = (training: TrainingRecord): TrainingRecord['status'] => {
  if (!training.expiryDate) return 'Válido'; // Assume valid if no expiry date? Or define logic.
  const today = new Date();
  today.setHours(0,0,0,0);
  const expiry = new Date(training.expiryDate);
  expiry.setHours(0,0,0,0);
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(0,0,0,0);

  if (expiry < today) return 'Vencido';
  if (expiry <= thirtyDaysFromNow) return 'Próximo ao Vencimento';
  return 'Válido';
};

// Update mock data status dynamically
const processedTrainings = mockTrainings.map(t => ({ ...t, status: getTrainingStatus(t) }));


export default function TrainingsPage() {
  const [trainings, setTrainings] = useState<TrainingRecord[]>(processedTrainings);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTraining, setEditingTraining] = useState<TrainingRecord | null>(null);
  const { toast } = useToast();

  // Form state
  const [employeeName, setEmployeeName] = useState('');
  const [trainingType, setTrainingType] = useState('');
  const [trainingDate, setTrainingDate] = useState<Date | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [attendanceListFile, setAttendanceListFile] = useState<File | null>(null); // Added
  const [certificateFile, setCertificateFile] = useState<File | null>(null); // Added
  const [currentAttendanceListUrl, setCurrentAttendanceListUrl] = useState<string | undefined>(undefined); // Added
  const [currentCertificateUrl, setCurrentCertificateUrl] = useState<string | undefined>(undefined); // Added

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTrainings = trainings.filter((training) =>
    training.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    training.trainingType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setEmployeeName('');
    setTrainingType('');
    setTrainingDate(undefined);
    setExpiryDate(undefined);
    setAttendanceListFile(null); // Added
    setCertificateFile(null); // Added
    setCurrentAttendanceListUrl(undefined); // Added
    setCurrentCertificateUrl(undefined); // Added
    setEditingTraining(null);
  };

   const handleOpenForm = (training: TrainingRecord | null = null) => {
       if (training) {
           setEditingTraining(training);
           setEmployeeName(training.employeeName);
           setTrainingType(training.trainingType);
           setTrainingDate(training.trainingDate);
           setExpiryDate(training.expiryDate);
           setCurrentAttendanceListUrl(training.attendanceListUrl); // Added
           setCurrentCertificateUrl(training.certificateUrl); // Added
           setAttendanceListFile(null); // Clear file inputs on edit
           setCertificateFile(null); // Clear file inputs on edit
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
          setCurrentAttendanceListUrl(undefined); // Clear existing URL if new file selected
      } else {
          setAttendanceListFile(null);
      }
  };

  const handleCertificateFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files && event.target.files[0]) {
          setCertificateFile(event.target.files[0]);
          setCurrentCertificateUrl(undefined); // Clear existing URL if new file selected
      } else {
          setCertificateFile(null);
      }
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!employeeName || !trainingType || !trainingDate) {
        toast({
            title: "Erro",
            description: "Por favor, preencha todos os campos obrigatórios.",
            variant: "destructive",
        });
        return;
    }

     // --- Mock File Upload Logic ---
     let attendanceUrl = currentAttendanceListUrl; // Keep existing URL if editing and no new file
     if (attendanceListFile) {
       attendanceUrl = `/uploads/attendance/${Date.now()}-${attendanceListFile.name}`;
       console.log(`Simulating upload for attendance list: ${attendanceListFile.name} to ${attendanceUrl}`);
       // In a real app: await uploadFile(attendanceListFile);
     }

     let certificateUrl = currentCertificateUrl; // Keep existing URL if editing and no new file
     if (certificateFile) {
       certificateUrl = `/uploads/certificates/${Date.now()}-${certificateFile.name}`;
       console.log(`Simulating upload for certificate: ${certificateFile.name} to ${certificateUrl}`);
       // In a real app: await uploadFile(certificateFile);
     }
     // --- End Mock File Upload Logic ---


    const newTraining: TrainingRecord = {
      id: editingTraining ? editingTraining.id : Date.now().toString(), // Simple ID generation
      employeeName,
      trainingType,
      trainingDate,
      expiryDate,
      status: 'Válido', // Initial status, will be recalculated
      attendanceListUrl: attendanceUrl, // Added
      certificateUrl: certificateUrl, // Added
    };
    newTraining.status = getTrainingStatus(newTraining); // Recalculate status

    if (editingTraining) {
        // Update existing training
        setTrainings(trainings.map(t => t.id === editingTraining.id ? newTraining : t));
        toast({
            title: "Sucesso",
            description: "Treinamento atualizado com sucesso.",
        });
    } else {
        // Add new training
        setTrainings([newTraining, ...trainings]);
         toast({
             title: "Sucesso",
             description: "Treinamento adicionado com sucesso.",
         });
    }


    handleCloseForm();
  };

  const handleDelete = (id: string) => {
      setTrainings(trainings.filter(t => t.id !== id));
      toast({
          title: "Sucesso",
          description: "Treinamento excluído com sucesso.",
          variant: "destructive" // Use destructive variant for delete confirmation
      });
  };


   const getStatusBadgeVariant = (status: TrainingRecord['status']): "default" | "secondary" | "destructive" | "outline" => {
     switch (status) {
       case 'Válido':
         return 'default'; // Primary/Green
       case 'Vencido':
         return 'destructive'; // Red
       case 'Próximo ao Vencimento':
         return 'secondary'; // Orange/Yellow
       default:
         return 'outline'; // Grey/Neutral
     }
   };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Treinamentos</h1>
         <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
             <DialogTrigger asChild>
                 <Button onClick={() => handleOpenForm()}>
                     <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Treinamento
                 </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()} > {/* Adjusted width */}
                 <DialogHeader>
                     <DialogTitle>{editingTraining ? 'Editar Treinamento' : 'Adicionar Novo Treinamento'}</DialogTitle>
                 </DialogHeader>
                 <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="employeeName" className="text-right">
                             Colaborador
                         </Label>
                         <Input id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="col-span-3" required />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="trainingType" className="text-right">
                             Tipo
                         </Label>
                          <Select value={trainingType} onValueChange={setTrainingType} required>
                             <SelectTrigger id="trainingType" className="col-span-3">
                                 <SelectValue placeholder="Selecione o tipo" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="NR-35 Trabalho em Altura">NR-35 Trabalho em Altura</SelectItem>
                                 <SelectItem value="NR-33 Espaços Confinados">NR-33 Espaços Confinados</SelectItem>
                                 <SelectItem value="Primeiros Socorros">Primeiros Socorros</SelectItem>
                                 <SelectItem value="NR-10 Eletricidade">NR-10 Eletricidade</SelectItem>
                                 <SelectItem value="Outro">Outro (especificar)</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                      {/* Add input for 'Other' training type if needed */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="trainingDate" className="text-right">
                             Data
                         </Label>
                         <DatePicker date={trainingDate} setDate={setTrainingDate} className="col-span-3" required />
                     </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="expiryDate" className="text-right">
                             Vencimento
                         </Label>
                         <DatePicker date={expiryDate} setDate={setExpiryDate} className="col-span-3" />
                     </div>
                     {/* Attendance List Upload */}
                      <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor="attendanceFile" className="text-right">
                              Lista Presença
                          </Label>
                          <div className="col-span-3 flex items-center gap-2">
                              <Input id="attendanceFile" type="file" onChange={handleAttendanceFileChange} className="flex-1" accept=".pdf,.doc,.docx,.jpg,.png" />
                              {currentAttendanceListUrl && !attendanceListFile && (
                                  <a href={currentAttendanceListUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[100px]" title={`Ver lista atual: ${currentAttendanceListUrl.split('/').pop()}`}>
                                      Ver atual
                                  </a>
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
                               <Input id="certificateFile" type="file" onChange={handleCertificateFileChange} className="flex-1" accept=".pdf,.jpg,.png" />
                               {currentCertificateUrl && !certificateFile && (
                                   <a href={currentCertificateUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[100px]" title={`Ver certificado atual: ${currentCertificateUrl.split('/').pop()}`}>
                                       Ver atual
                                   </a>
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
                              <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                          </DialogClose>
                         <Button type="submit">{editingTraining ? 'Salvar Alterações' : 'Adicionar Treinamento'}</Button>
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
            {filteredTrainings.length > 0 ? (
              filteredTrainings.map((training) => (
                <TableRow key={training.id}>
                  <TableCell className="font-medium">{training.employeeName}</TableCell>
                  <TableCell>{training.trainingType}</TableCell>
                  <TableCell>{training.trainingDate.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{training.expiryDate ? training.expiryDate.toLocaleDateString('pt-BR') : 'N/A'}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(training.status)}>
                      {training.status === 'Próximo ao Vencimento' || training.status === 'Vencido' ? <AlertTriangle className="inline-block h-3 w-3 mr-1" /> : null}
                      {training.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                     {/* View Buttons */}
                    {training.attendanceListUrl ? (
                       <Button variant="ghost" size="icon" asChild title="Ver Lista de Presença">
                         <a href={training.attendanceListUrl} target="_blank" rel="noopener noreferrer">
                           <Users className="h-4 w-4" />
                         </a>
                       </Button>
                     ) : (
                       <Button variant="ghost" size="icon" disabled title="Lista de Presença Indisponível">
                         <Users className="h-4 w-4 text-muted-foreground/50" />
                       </Button>
                     )}
                     {training.certificateUrl ? (
                       <Button variant="ghost" size="icon" asChild title="Ver Certificado">
                         <a href={training.certificateUrl} target="_blank" rel="noopener noreferrer">
                           <Award className="h-4 w-4" />
                         </a>
                       </Button>
                     ) : (
                       <Button variant="ghost" size="icon" disabled title="Certificado Indisponível">
                         <Award className="h-4 w-4 text-muted-foreground/50" />
                       </Button>
                     )}
                     {/* Edit and Delete Buttons */}
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(training)} title="Editar">
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
                                     Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro de treinamento para <span className="font-medium">{training.employeeName}</span>.
                                 </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                                 <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                 <AlertDialogAction onClick={() => handleDelete(training.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
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

    
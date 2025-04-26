'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, AlertTriangle, Upload, Download, Eye } from 'lucide-react'; // Added Eye icon
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

// Mock data structure
interface AsoRecord {
  id: string;
  employeeName: string;
  examType: 'Admissional' | 'Periódico' | 'Demissional' | 'Mudança de Risco' | 'Retorno ao Trabalho';
  examDate: Date;
  expiryDate: Date; // ASOs typically have an expiry date
  result: 'Apto' | 'Inapto' | 'Apto com Restrições';
  status: 'Válido' | 'Vencido' | 'Próximo ao Vencimento';
  attachmentUrl?: string; // Optional URL for the scanned ASO
}

// Helper function to calculate status based on expiry date
const getAsoStatus = (aso: AsoRecord): AsoRecord['status'] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  const expiry = new Date(aso.expiryDate);
   expiry.setHours(0, 0, 0, 0); // Normalize expiry date

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);


  if (expiry < today) return 'Vencido';
  if (expiry <= thirtyDaysFromNow) return 'Próximo ao Vencimento';
  return 'Válido';
};


const mockAsoRecords: AsoRecord[] = [
  { id: 'aso1', employeeName: 'João Silva', examType: 'Periódico', examDate: new Date(2023, 10, 1), expiryDate: new Date(2024, 10, 1), result: 'Apto', status: 'Válido' },
  { id: 'aso2', employeeName: 'Maria Oliveira', examType: 'Admissional', examDate: new Date(2023, 5, 20), expiryDate: new Date(2024, 5, 20), result: 'Apto', status: 'Válido' },
  { id: 'aso3', employeeName: 'Carlos Pereira', examType: 'Periódico', examDate: new Date(2022, 8, 15), expiryDate: new Date(2023, 8, 15), result: 'Apto', status: 'Vencido' },
  { id: 'aso4', employeeName: 'Ana Costa', examType: 'Periódico', examDate: new Date(2024, 6, 10), expiryDate: new Date(2025, 6, 10), result: 'Apto com Restrições', status: 'Próximo ao Vencimento' }, // Example: Expires within 30 days from ~July 15th, 2024
  { id: 'aso5', employeeName: 'Pedro Santos', examType: 'Demissional', examDate: new Date(2024, 4, 30), expiryDate: new Date(2024, 5, 30), result: 'Apto', status: 'Válido' }, // Demissionals might have shorter validity? Adjust expiry logic if needed.
];

// Process mock data to set correct status
const processedAsoRecords = mockAsoRecords.map(aso => ({ ...aso, status: getAsoStatus(aso) }));

export default function AsosPage() {
  const [asoRecords, setAsoRecords] = useState<AsoRecord[]>(processedAsoRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<AsoRecord | null>(null);
  const { toast } = useToast();

  // Form state
  const [employeeName, setEmployeeName] = useState('');
  const [examType, setExamType] = useState<AsoRecord['examType'] | ''>('');
  const [examDate, setExamDate] = useState<Date | undefined>(undefined);
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [result, setResult] = useState<AsoRecord['result'] | ''>('');
  const [attachment, setAttachment] = useState<File | null>(null); // State for file upload


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredAsoRecords = asoRecords.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.examType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.result.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setEmployeeName('');
    setExamType('');
    setExamDate(undefined);
    setExpiryDate(undefined);
    setResult('');
    setAttachment(null);
    setEditingRecord(null);
  };

  const handleOpenForm = (record: AsoRecord | null = null) => {
      if (record) {
          setEditingRecord(record);
          setEmployeeName(record.employeeName);
          setExamType(record.examType);
          setExamDate(record.examDate);
          setExpiryDate(record.expiryDate);
          setResult(record.result);
          // Don't reset attachment on edit, maybe show current attachment name?
      } else {
          resetForm();
      }
      setIsFormOpen(true);
  };

  const handleCloseForm = () => {
      setIsFormOpen(false);
      resetForm();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setAttachment(event.target.files[0]);
    } else {
      setAttachment(null);
    }
  };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!employeeName || !examType || !examDate || !expiryDate || !result) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

     // --- Mock File Upload Logic ---
     let attachmentUrl = editingRecord?.attachmentUrl; // Keep existing URL if editing and no new file
     if (attachment) {
       // In a real app, you would upload the file here and get back a URL
       // For now, we'll just simulate a URL based on the filename
       attachmentUrl = `/uploads/asos/${Date.now()}-${attachment.name}`; // Example simulated URL
       console.log(`Simulating upload for: ${attachment.name} to ${attachmentUrl}`);
       // In a real app: await uploadFile(attachment);
     }
     // --- End Mock File Upload Logic ---


    const newRecord: AsoRecord = {
      id: editingRecord ? editingRecord.id : `aso${Date.now()}`,
      employeeName,
      examType,
      examDate,
      expiryDate,
      result,
      status: 'Válido', // Recalculate status before saving
      attachmentUrl: attachmentUrl, // Add the URL
    };
    newRecord.status = getAsoStatus(newRecord); // Recalculate status


    if (editingRecord) {
      setAsoRecords(asoRecords.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({
          title: "Sucesso",
          description: "ASO atualizado com sucesso.",
      });
    } else {
      setAsoRecords([newRecord, ...asoRecords]);
      toast({
          title: "Sucesso",
          description: "ASO adicionado com sucesso.",
      });
    }

    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setAsoRecords(asoRecords.filter(r => r.id !== id));
     toast({
         title: "Sucesso",
         description: "ASO excluído com sucesso.",
         variant: "destructive"
     });
  };

    const getStatusBadgeVariant = (status: AsoRecord['status']): "default" | "secondary" | "destructive" | "outline" => {
      switch (status) {
        case 'Válido':
          return 'default'; // Green (using primary color via default)
        case 'Vencido':
          return 'destructive'; // Red
        case 'Próximo ao Vencimento':
          return 'secondary'; // Orange (using secondary for now, could customize)
        default:
          return 'outline';
      }
    };

     const getResultBadgeVariant = (result: AsoRecord['result']): "default" | "secondary" | "destructive" | "outline" => {
       switch (result) {
         case 'Apto':
           return 'default'; // Green
         case 'Inapto':
           return 'destructive'; // Red
         case 'Apto com Restrições':
           return 'secondary'; // Orange/Yellow
         default:
           return 'outline';
       }
     };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de ASOs</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar ASO
                </Button>
            </DialogTrigger>
             <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{editingRecord ? 'Editar ASO' : 'Adicionar Novo ASO'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Employee Name */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="employeeName" className="text-right">
                             Colaborador
                         </Label>
                         <Input id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="col-span-3" required />
                     </div>
                    {/* Exam Type */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="examType" className="text-right">
                             Tipo Exame
                         </Label>
                          <Select value={examType} onValueChange={(value: AsoRecord['examType']) => setExamType(value)} required>
                             <SelectTrigger id="examType" className="col-span-3">
                                 <SelectValue placeholder="Selecione o tipo" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="Admissional">Admissional</SelectItem>
                                 <SelectItem value="Periódico">Periódico</SelectItem>
                                 <SelectItem value="Demissional">Demissional</SelectItem>
                                 <SelectItem value="Mudança de Risco">Mudança de Risco</SelectItem>
                                 <SelectItem value="Retorno ao Trabalho">Retorno ao Trabalho</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                    {/* Exam Date */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="examDate" className="text-right">
                             Data Exame
                         </Label>
                         <DatePicker date={examDate} setDate={setExamDate} className="col-span-3" required />
                     </div>
                    {/* Expiry Date */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="expiryDate" className="text-right">
                             Vencimento
                         </Label>
                         <DatePicker date={expiryDate} setDate={setExpiryDate} className="col-span-3" required />
                     </div>
                    {/* Result */}
                      <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="result" className="text-right">
                             Resultado
                         </Label>
                          <Select value={result} onValueChange={(value: AsoRecord['result']) => setResult(value)} required>
                             <SelectTrigger id="result" className="col-span-3">
                                 <SelectValue placeholder="Selecione o resultado" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="Apto">Apto</SelectItem>
                                 <SelectItem value="Inapto">Inapto</SelectItem>
                                 <SelectItem value="Apto com Restrições">Apto com Restrições</SelectItem>
                             </SelectContent>
                         </Select>
                     </div>
                     {/* Attachment Upload */}
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="attachment" className="text-right">
                             Anexo
                         </Label>
                         <div className="col-span-3 flex items-center gap-2">
                             <Input id="attachment" type="file" onChange={handleFileChange} className="flex-1" accept=".pdf,.jpg,.jpeg,.png" />
                             {/* Optionally show the name of the currently selected/uploaded file */}
                             {editingRecord?.attachmentUrl && !attachment && (
                                 <a href={editingRecord.attachmentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline truncate max-w-[100px]" title={editingRecord.attachmentUrl.split('/').pop()}>
                                     Ver atual
                                 </a>
                             )}
                              {attachment && (
                                 <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={attachment.name}>
                                     {attachment.name}
                                 </span>
                              )}
                         </div>
                     </div>

                    <DialogFooter>
                         <DialogClose asChild>
                             <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                         </DialogClose>
                        <Button type="submit">{editingRecord ? 'Salvar Alterações' : 'Adicionar ASO'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por colaborador, tipo ou resultado..."
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Registros de Atestados de Saúde Ocupacional.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo Exame</TableHead>
              <TableHead>Data Exame</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAsoRecords.length > 0 ? (
              filteredAsoRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>{record.examType}</TableCell>
                  <TableCell>{record.examDate.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{record.expiryDate.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                      <Badge variant={getResultBadgeVariant(record.result)}>{record.result}</Badge>
                  </TableCell>
                  <TableCell>
                       <Badge variant={getStatusBadgeVariant(record.status)}>
                         {record.status === 'Próximo ao Vencimento' || record.status === 'Vencido' ? <AlertTriangle className="inline-block h-3 w-3 mr-1" /> : null}
                         {record.status}
                       </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                      {record.attachmentUrl ? (
                         <Button variant="ghost" size="icon" asChild>
                              <a href={record.attachmentUrl} target="_blank" rel="noopener noreferrer" title="Visualizar Anexo">
                                 <Eye className="h-4 w-4" />
                                 <span className="sr-only">Visualizar Anexo</span>
                              </a>
                         </Button>
                      ) : (
                           <Button variant="ghost" size="icon" disabled title="Sem anexo">
                               <Eye className="h-4 w-4 text-muted-foreground/50" />
                               <span className="sr-only">Sem anexo</span>
                           </Button>
                      )}
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
                                     Essa ação não pode ser desfeita. Isso excluirá permanentemente o ASO de <span className="font-medium">{record.employeeName}</span> ({record.examType} - {record.examDate.toLocaleDateString('pt-BR')}).
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
                  Nenhum ASO encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

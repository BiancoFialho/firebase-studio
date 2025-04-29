
// src/app/jsa/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, FileText, Eye, AlertTriangle, CheckCircle, Link2 } from 'lucide-react'; // Added Link2
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
import { Textarea } from "@/components/ui/textarea"; // Import Textarea

// Data structure for JSA (Job Safety Analysis) / Risk Analysis
interface JsaRecord {
  id: string;
  taskName: string; // Name of the task/activity being analyzed
  department: string; // Department responsible
  analysisDate: Date;
  reviewDate?: Date; // Date for next review
  status: 'Ativo' | 'Em Revisão' | 'Arquivado'; // Status of the JSA
  attachmentUrl?: string; // Link to the JSA document (PDF, Word, etc.)
  risks: { id: string; description: string; controls: string }[]; // List of identified risks and controls
}

// Mock data for JSA records
const mockJsaRecords: JsaRecord[] = [
  {
    id: 'jsa1',
    taskName: 'Manutenção Preventiva em Painel Elétrico',
    department: 'Manutenção Elétrica',
    analysisDate: new Date(2023, 8, 10),
    reviewDate: new Date(2024, 8, 10),
    status: 'Ativo',
    attachmentUrl: '/uploads/jsa/jsa-painel-eletrico.pdf',
    risks: [     
      { id: 'r1', description: 'Choque Elétrico', controls: 'Desenergizar painel, usar EPIs (luvas isolantes, capacete com viseira), bloqueio e etiquetagem (LOTO).' },
      { id: 'r2', description: 'Arco Elétrico', controls: 'Vestimenta FR, manter distância segura.' },
    ]
  },
  {
    id: 'jsa2',
    taskName: 'Trabalho em Altura - Limpeza de Fachada',
    department: 'Serviços Gerais',
    analysisDate: new Date(2024, 1, 15),
    status: 'Em Revisão',
    risks: [
      { id: 'r3', description: 'Queda de Altura', controls: 'Uso de cinto de segurança tipo paraquedista, linha de vida, andaime inspecionado, treinamento NR-35.' },
      { id: 'r4', description: 'Queda de Materiais', controls: 'Isolamento da área abaixo, amarração de ferramentas.' },
    ]
  },
  {
    id: 'jsa3',
    taskName: 'Operação de Empilhadeira',
    department: 'Logística',
    analysisDate: new Date(2022, 11, 1),
    reviewDate: new Date(2023, 11, 1),
    status: 'Arquivado',
    attachmentUrl: '/uploads/jsa/jsa-empilhadeira-old.pdf',
    risks: [
      { id: 'r5', description: 'Atropelamento', controls: 'Sinalização sonora e visual, velocidade reduzida, check-list pré-uso.' },
      { id: 'r6', description: 'Tombamento de Carga', controls: 'Respeitar capacidade máxima, centro de gravidade baixo.' },
    ]
  },
];

export default function JsaPage() {
  const [jsaRecords, setJsaRecords] = useState<JsaRecord[]>(mockJsaRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<JsaRecord | null>(null);
  const { toast } = useToast();

  // Form state
  const [taskName, setTaskName] = useState('');
  const [department, setDepartment] = useState('');
  const [analysisDate, setAnalysisDate] = useState<Date | undefined>(new Date());
  const [reviewDate, setReviewDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<JsaRecord['status']>('Ativo');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [currentAttachmentUrl, setCurrentAttachmentUrl] = useState<string | undefined>(undefined);
  // Risks state (simple for now, could be more complex)
  const [risksDescription, setRisksDescription] = useState(''); // Combined text area for now
  const [controlsDescription, setControlsDescription] = useState(''); // Combined text area


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredJsaRecords = jsaRecords.filter((record) =>
    record.taskName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setTaskName('');
    setDepartment('');
    setAnalysisDate(new Date());
    setReviewDate(undefined);
    setStatus('Ativo');
    setAttachment(null);
    setCurrentAttachmentUrl(undefined);
    setRisksDescription('');
    setControlsDescription('');
    setEditingRecord(null);
  };

   const handleOpenForm = (record: JsaRecord | null = null) => {
       if (record) {
           setEditingRecord(record);
           setTaskName(record.taskName);
           setDepartment(record.department);
           setAnalysisDate(record.analysisDate);
           setReviewDate(record.reviewDate);
           setStatus(record.status);
           setCurrentAttachmentUrl(record.attachmentUrl);
           // Simple joining for text area - refine later if needed
           setRisksDescription(record.risks.map(r => r.description).join('\n'));
           setControlsDescription(record.risks.map(r => r.controls).join('\n'));
           setAttachment(null); // Clear file input on edit
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
       setCurrentAttachmentUrl(undefined); // Clear existing URL if new file is selected
     } else {
       setAttachment(null);
       // Maybe restore currentAttachmentUrl if file is deselected? Depends on UX.
        if (editingRecord) {
           setCurrentAttachmentUrl(editingRecord.attachmentUrl);
        }
     }
   };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!taskName || !department || !analysisDate || !status) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Tarefa, Departamento, Data Análise e Status.",
        variant: "destructive",
      });
      return;
    }

     // --- Mock File Upload Logic ---
     let attachmentUrl = currentAttachmentUrl; 
     if (attachment) {
       // In a real app, you would upload the file here and get back a URL
       attachmentUrl = `/uploads/jsa/${Date.now()}-${encodeURIComponent(attachment.name)}`; // Example simulated URL
       console.log(`Simulating upload for: ${attachment.name} to ${attachmentUrl}`);
       toast({ title: "Simulação de Upload", description: `JSA "${attachment.name}" salva em ${attachmentUrl}`});
       // In a real app: attachmentUrl = await uploadFile(attachment);
     }
     // --- End Mock File Upload Logic ---

    // Very basic risk parsing - split by newline. Improve this logic.
    const risksArray = risksDescription.split('\n').map((desc, index) => ({
        id: `r${editingRecord?.id || 'new'}-${index}`,
        description: desc.trim(),
        controls: controlsDescription.split('\n')[index]?.trim() || 'Controles não definidos' // Match controls by line
    })).filter(r => r.description); // Filter out empty lines


    const newRecord: JsaRecord = {
      id: editingRecord ? editingRecord.id : `jsa${Date.now()}`,
      taskName,
      department,
      analysisDate,
      reviewDate,
      status,
      attachmentUrl: attachmentUrl,
      risks: risksArray, // Assign parsed risks
    };

    if (editingRecord) {
      setJsaRecords(jsaRecords.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({
        title: "Sucesso",
        description: "Análise de Risco atualizada.",
      });
    } else {
      setJsaRecords([newRecord, ...jsaRecords]);
      toast({
        title: "Sucesso",
        description: "Nova Análise de Risco adicionada.",
      });
    }

    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setJsaRecords(jsaRecords.filter(r => r.id !== id));
    toast({
      title: "Sucesso",
      description: "Análise de Risco excluída.",
      variant: "destructive"
    });
  };

   const getStatusBadgeVariant = (status: JsaRecord['status']): "default" | "secondary" | "outline" => {
     switch (status) {
       case 'Ativo':
         return 'default'; // Greenish/Primary
       case 'Em Revisão':
         return 'secondary'; // Yellowish/Orange
       case 'Arquivado':
         return 'outline'; // Grey/Neutral
       default:
         return 'outline';
     }
   };

   const getReviewStatusIcon = (record: JsaRecord) => {
       if (!record.reviewDate) return null; // No review date set
       const today = new Date();
       today.setHours(0,0,0,0);
       const review = new Date(record.reviewDate);
       review.setHours(0,0,0,0);
       const thirtyDaysFromNow = new Date();
       thirtyDaysFromNow.setDate(today.getDate() + 30);
        thirtyDaysFromNow.setHours(0,0,0,0);

       if (review < today) {
           return <AlertTriangle className="inline-block h-4 w-4 text-destructive mr-1" title="Revisão Atrasada" />;
       }
       if (review <= thirtyDaysFromNow) {
            return <AlertTriangle className="inline-block h-4 w-4 text-orange-500 mr-1" title="Revisão Próxima" />;
       }
       return <CheckCircle className="inline-block h-4 w-4 text-green-600 mr-1" title="Revisão OK" />;
   }

    const handleViewFile = (url: string | undefined, fileName: string) => {
        if (url) {
            // In a real app, you might open the actual URL
            // window.open(url, '_blank');
            // For simulation, show a toast message
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
    <div className="container p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Análises de Risco (JSA)</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen} >
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenForm()} className="flex items-center">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Análise
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}> 
                <DialogHeader>

                    <DialogTitle>{editingRecord ? 'Editar Análise de Risco' : 'Adicionar Nova Análise de Risco'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <Label htmlFor="taskName">Nome da Tarefa/Atividade*</Label>
                             <Input id="taskName" value={taskName} onChange={(e) => setTaskName(e.target.value)} required />
                         </div>
                        <div>
                             <Label htmlFor="department">Departamento*</Label>
                             <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} required />
                         </div>
                         <div>
                              <Label htmlFor="analysisDate">Data da Análise*</Label>
                              <DatePicker date={analysisDate} setDate={setAnalysisDate} required />
                          </div>
                          <div>
                              <Label htmlFor="reviewDate">Próxima Revisão</Label>
                              <DatePicker date={reviewDate} setDate={setReviewDate} />
                          </div>
                         <div>
                              <Label htmlFor="status">Status*</Label>
                              <Select value={status} onValueChange={(value: JsaRecord['status']) => setStatus(value)} required>
                                  <SelectTrigger id="status">
                                      <SelectValue placeholder="Selecione o status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                      <SelectItem value="Ativo">Ativo</SelectItem>
                                  <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                                      <SelectItem value="Arquivado">Arquivado</SelectItem>
                                  </SelectContent>
                              </Select>
                          </div>
                          <div className="flex items-end">
                             <div className="w-full">
                                <Label htmlFor="attachment">Anexo (Documento JSA)</Label>
                                 <div className="flex items-center gap-2">
                                    <Input id="attachment" type="file" onChange={handleFileChange} className="flex-1" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt" />
                                    {currentAttachmentUrl && !attachment && (                                         
                                         <Button
                                            type="button"
                                            variant="link"
                                            size="sm"
                                            className="h-auto p-0 text-xs text-blue-600 hover:underline truncate max-w-[100px]"
                                            onClick={() => handleViewFile(currentAttachmentUrl, 'anexo atual')}
                                            title={`Ver anexo atual: ${currentAttachmentUrl.split('/').pop()}`}
                                         >
                                             Ver atual
                                         </Button>
                                     )}
                                    {attachment && (
                                         <span className="text-xs text-muted-foreground truncate max-w-[100px]" title={attachment.name}>
                                             {attachment.name}
                                         </span>
                                      )}
                                 </div>
                             </div>
                          </div>
                    </div>

                    {/* Risks and Controls - Simplified */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label htmlFor="risksDescription">Riscos Identificados (um por linha)</Label>
                            <Textarea
                                id="risksDescription"
                                value={risksDescription}
                                onChange={(e) => setRisksDescription(e.target.value)}
                                rows={6}
                                placeholder="Ex: Queda de altura&#10;Ex: Choque elétrico"
                            />
                        </div>
                        <div>
                            <Label htmlFor="controlsDescription">Medidas de Controle (correspondente a cada risco)</Label>
                            <Textarea
                                id="controlsDescription"
                                value={controlsDescription}
                                onChange={(e) => setControlsDescription(e.target.value)}
                                rows={6}
                                placeholder="Ex: Uso de cinto, linha de vida&#10;Ex: Desenergizar, LOTO, EPIs"
                             />
                        </div>
                    </div>


                    <DialogFooter className="mt-4">
                         <DialogClose asChild>
                             <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                         </DialogClose>
                        <Button type="submit">{editingRecord ? 'Salvar Alterações' : 'Adicionar Análise'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
      </div>
      <div className="relative max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
              type="search"
              placeholder="Buscar por tarefa, departamento ou status..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={handleSearch}
          />
      </div>

      <div className="rounded-lg overflow-hidden border">
        <Table>
          <TableCaption>Registros de Análise de Segurança da Tarefa (JSA).</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tarefa/Atividade</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Análise</TableHead>
              <TableHead>Próx. Revisão</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredJsaRecords.length > 0 ? (
              filteredJsaRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.taskName}</TableCell>
                  <TableCell>{record.department}</TableCell>
                  <TableCell>{record.analysisDate.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>
                     {getReviewStatusIcon(record)}
                     {record.reviewDate ? record.reviewDate.toLocaleDateString('pt-BR') : '-'}
                  </TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                     <Button variant="ghost" size="icon" onClick={() => handleViewFile(record.attachmentUrl, 'JSA anexada')} disabled={!record.attachmentUrl} title="Visualizar Anexo">
                           <Link2 className={record.attachmentUrl ? "h-4 w-4" : "h-4 w-4 text-muted-foreground/50"} />
                           <span className="sr-only">Visualizar Anexo</span>
                      </Button>
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
                                     Essa ação não pode ser desfeita. Isso excluirá permanentemente a análise de risco para <span className="font-medium">{record.taskName}</span>.
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
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma Análise de Risco encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

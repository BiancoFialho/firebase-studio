
// src/app/documents/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, Folder, FileText, AlertTriangle, CheckCircle, Link2 } from 'lucide-react';
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
import type { DocumentRecord, DocumentType, DocumentStatus } from '@/lib/types';

// Helper function to calculate status based on expiry date
const getDocumentStatus = (doc: DocumentRecord): DocumentStatus => {
  if (doc.status === 'Em Revisão') return 'Em Revisão'; // Preserve "Em Revisão" status

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date
  const expiry = new Date(doc.expiryDate);
   expiry.setHours(0, 0, 0, 0); // Normalize expiry date

  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(today.getDate() + 30);
  thirtyDaysFromNow.setHours(0, 0, 0, 0);

  if (expiry < today) return 'Vencido';
  if (expiry <= thirtyDaysFromNow) return 'Próximo ao Vencimento';
  return 'Válido';
};


// Mock Data
const mockDocuments: DocumentRecord[] = [
  {
    id: 'doc1',
    documentType: 'PGR',
    title: 'PGR Nery Mecatrônica 2024',
    issueDate: new Date(2024, 0, 15),
    expiryDate: new Date(2025, 0, 14),
    responsible: 'SESMT',
    status: 'Válido',
    attachmentUrl: '/uploads/docs/pgr-2024.pdf',
    relatedActions: [
        { id: 'actPGR1', description: 'Revisar inventário de riscos da área de pintura.', responsible: 'Eng. Segurança', deadline: new Date(2024, 8, 30), status: 'Em Andamento' },
        { id: 'actPGR2', description: 'Implementar proteção acústica na máquina X.', responsible: 'Manutenção', deadline: new Date(2024, 9, 15), status: 'Pendente' },
    ],
  },
  {
    id: 'doc2',
    documentType: 'PCMSO',
    title: 'PCMSO Nery Mecatrônica 2023-2024',
    issueDate: new Date(2023, 10, 1),
    expiryDate: new Date(2024, 9, 30), // Expiring soon
    responsible: 'Médico do Trabalho',
    status: 'Válido',
    relatedActions: [],
  },
   {
    id: 'doc3',
    documentType: 'Laudo Ergonômico',
    title: 'AET Linha de Montagem',
    issueDate: new Date(2022, 5, 20),
    expiryDate: new Date(2024, 5, 19), // Expired
    responsible: 'Ergonomista Contratado',
    status: 'Vencido',
     attachmentUrl: '/uploads/docs/aet-montagem.pdf',
    relatedActions: [ { id: 'actAET1', description: 'Adquirir cadeiras ergonômicas novas.', responsible: 'Compras', deadline: new Date(2024, 7, 31), status: 'Pendente' },]
  },
  {
    id: 'doc4',
    documentType: 'PCA',
    title: 'Programa de Conservação Auditiva 2024',
    issueDate: new Date(2024, 2, 10),
    expiryDate: new Date(2025, 2, 9),
    responsible: 'Fonoaudiólogo',
    status: 'Válido',
    relatedActions: [],
  },
];

// Update statuses based on dates
const processedDocuments = mockDocuments.map(doc => ({ ...doc, status: getDocumentStatus(doc) }));


export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentRecord[]>(processedDocuments);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DocumentRecord | null>(null);
  const { toast } = useToast();

  // Form State
  const [documentType, setDocumentType] = useState<DocumentType | ''>('');
  const [title, setTitle] = useState('');
  const [issueDate, setIssueDate] = useState<Date | undefined>(new Date());
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined);
  const [responsible, setResponsible] = useState('');
  const [status, setStatus] = useState<DocumentStatus>('Válido');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [currentAttachmentUrl, setCurrentAttachmentUrl] = useState<string | undefined>(undefined);
  const [actionsText, setActionsText] = useState(''); // Simple text area for actions


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredDocuments = documents.filter((record) =>
    record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.responsible.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setDocumentType('');
    setTitle('');
    setIssueDate(new Date());
    setExpiryDate(undefined);
    setResponsible('');
    setStatus('Válido');
    setAttachment(null);
    setCurrentAttachmentUrl(undefined);
    setActionsText('');
    setEditingRecord(null);
  };

  const handleOpenForm = (record: DocumentRecord | null = null) => {
    if (record) {
      setEditingRecord(record);
      setDocumentType(record.documentType);
      setTitle(record.title);
      setIssueDate(record.issueDate);
      setExpiryDate(record.expiryDate);
      setResponsible(record.responsible);
      setStatus(record.status);
      setCurrentAttachmentUrl(record.attachmentUrl);
      setAttachment(null);
      setActionsText(record.relatedActions.map(a => `${a.description} (Resp: ${a.responsible}, Prazo: ${a.deadline?.toLocaleDateString('pt-BR') || 'N/A'}, Status: ${a.status})`).join('\n'));
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
    if (!documentType || !title || !issueDate || !expiryDate || !responsible || !status) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios (*).",
        variant: "destructive",
      });
      return;
    }

     // --- Mock File Upload Logic ---
     let attachmentUrl = currentAttachmentUrl; // Keep existing URL if editing and no new file
     if (attachment) {
       // In a real app, you would upload the file here and get back a URL
       attachmentUrl = `/uploads/docs/${Date.now()}-${encodeURIComponent(attachment.name)}`; // Example simulated URL
       console.log(`Simulating upload for: ${attachment.name} to ${attachmentUrl}`);
       toast({ title: "Simulação de Upload", description: `Documento "${attachment.name}" salvo em ${attachmentUrl}`});
       // In a real app: attachmentUrl = await uploadFile(attachment);
     }
     // --- End Mock File Upload Logic ---

     // Basic parsing of actions - similar to CIPA page, refine if needed
      const actionsArray = actionsText.split('\n').map((line, index) => {
          const match = line.match(/(.+)\s\(Resp:\s*(.+),\s*Prazo:\s*(.+),\s*Status:\s*(.+)\)/);
          if (match) {
              let deadline: Date | undefined = undefined;
              const dateParts = match[3]?.trim().split('/');
              if (dateParts?.length === 3) {
                 const day = parseInt(dateParts[0], 10);
                 const month = parseInt(dateParts[1], 10) - 1;
                 const year = parseInt(dateParts[2], 10);
                 if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
                    deadline = new Date(year, month, day);
                 }
              }
              return {
                  id: `actDoc${editingRecord?.id || 'new'}-${index}`,
                  description: match[1]?.trim() || 'Descrição não informada',
                  responsible: match[2]?.trim() || 'Responsável não informado',
                  deadline: deadline,
                  status: (match[4]?.trim() as any) || 'Pendente'
              };
          }
          return null;
      }).filter(a => a !== null) as DocumentRecord['relatedActions'];


    const newRecord: DocumentRecord = {
      id: editingRecord ? editingRecord.id : `doc${Date.now()}`,
      documentType,
      title,
      issueDate,
      expiryDate,
      responsible,
      status: status, // Keep the status set in the form for now
      attachmentUrl,
      relatedActions: actionsArray,
    };
    // Recalculate status based on dates *unless* it's manually set to "Em Revisão"
    newRecord.status = getDocumentStatus(newRecord);


    if (editingRecord) {
      setDocuments(documents.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({ title: "Sucesso", description: "Documento atualizado." });
    } else {
      setDocuments([newRecord, ...documents]);
      toast({ title: "Sucesso", description: "Novo documento registrado." });
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setDocuments(documents.filter(r => r.id !== id));
    toast({ title: "Sucesso", description: "Documento excluído.", variant: "destructive" });
  };

  const getStatusBadgeVariant = (status: DocumentStatus): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'Válido': return 'default'; // Primary/Green
      case 'Próximo ao Vencimento': return 'secondary'; // Orange/Yellow
      case 'Vencido': return 'destructive'; // Red
      case 'Em Revisão': return 'outline'; // Grey/Neutral
      default: return 'outline';
    }
  };

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
             <Folder className="w-8 h-8 text-primary" />
             <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Documentos</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Registrar Documento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'Editar Documento' : 'Registrar Novo Documento'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Document Type */}
                  <div className="space-y-1">
                    <Label htmlFor="documentType">Tipo de Documento*</Label>
                    <Select value={documentType} onValueChange={(v: DocumentType | '') => setDocumentType(v)} required>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PGR">PGR (Programa de Gerenciamento de Riscos)</SelectItem>
                        <SelectItem value="PCMSO">PCMSO (Prog. Controle Médico de Saúde Ocupacional)</SelectItem>
                        <SelectItem value="PCA">PCA (Programa de Conservação Auditiva)</SelectItem>
                        <SelectItem value="Laudo Ergonômico">Laudo Ergonômico (AET)</SelectItem>
                        <SelectItem value="Laudo Insalubridade">Laudo de Insalubridade</SelectItem>
                        <SelectItem value="Laudo Periculosidade">Laudo de Periculosidade</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Title */}
                   <div className="space-y-1">
                       <Label htmlFor="title">Título/Nome do Arquivo*</Label>
                       <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                   </div>
                   {/* Issue Date */}
                   <div className="space-y-1">
                       <Label htmlFor="issueDate">Data de Emissão*</Label>
                       <DatePicker date={issueDate} setDate={setIssueDate} required />
                   </div>
                   {/* Expiry Date */}
                   <div className="space-y-1">
                       <Label htmlFor="expiryDate">Data de Vencimento/Revisão*</Label>
                       <DatePicker date={expiryDate} setDate={setExpiryDate} required />
                   </div>
                   {/* Responsible */}
                   <div className="space-y-1">
                       <Label htmlFor="responsible">Responsável pela Elaboração/Revisão*</Label>
                       <Input id="responsible" value={responsible} onChange={(e) => setResponsible(e.target.value)} required />
                   </div>
                   {/* Status */}
                   <div className="space-y-1">
                      <Label htmlFor="status">Status Atual*</Label>
                       <Select value={status} onValueChange={(v: DocumentStatus) => setStatus(v)} required>
                         <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                         <SelectContent>
                           <SelectItem value="Válido">Válido</SelectItem>
                           <SelectItem value="Próximo ao Vencimento">Próximo ao Vencimento</SelectItem>
                           <SelectItem value="Vencido">Vencido</SelectItem>
                           <SelectItem value="Em Revisão">Em Revisão</SelectItem>
                         </SelectContent>
                       </Select>
                   </div>
                   {/* Attachment */}
                   <div className="space-y-1 md:col-span-2">
                         <Label htmlFor="attachment">Anexo (PDF, DOCX, etc.)</Label>
                         <div className="flex items-center gap-2">
                              <Input id="attachment" type="file" onChange={handleFileChange} className="flex-1" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.zip" />
                              {currentAttachmentUrl && !attachment && (
                                   <Button
                                       type="button"
                                       variant="link"
                                       size="sm"
                                       className="h-auto p-0 text-xs text-blue-600 hover:underline truncate max-w-[150px]"
                                       onClick={() => handleViewFile(currentAttachmentUrl, 'anexo atual')}
                                       title={currentAttachmentUrl.split('/').pop()}
                                   >
                                       Ver anexo atual
                                   </Button>
                              )}
                               {attachment && (
                                  <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={attachment.name}>
                                      {attachment.name}
                                  </span>
                               )}
                         </div>
                   </div>
               </div>

                {/* Related Actions */}
                <div className="space-y-1 mt-4">
                    <Label htmlFor="actionsText">Plano de Ação Vinculado (um item por linha)</Label>
                    <Textarea
                        id="actionsText"
                        value={actionsText}
                        onChange={(e) => setActionsText(e.target.value)}
                        rows={4}
                        placeholder="Formato: Descrição da Ação (Resp: Nome, Prazo: DD/MM/YYYY, Status: Pendente/Em Andamento/Concluída)"
                    />
                    <p className="text-xs text-muted-foreground">Ex: Realizar medição de ruído (Resp: SESMT, Prazo: 30/09/2024, Status: Pendente)</p>
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
          placeholder="Buscar por título, tipo ou responsável..."
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Documentos de SSMA registrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Tipo</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Emissão</TableHead>
              <TableHead>Vencimento</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ações Pend.</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((record) => {
                 const pendingActionsCount = record.relatedActions.filter(a => a.status === 'Pendente' || a.status === 'Em Andamento').length;
                 return (
                    <TableRow key={record.id} className={record.status === 'Vencido' ? 'bg-destructive/10' : ''}>
                      <TableCell className="font-medium">{record.documentType}</TableCell>
                      <TableCell className="max-w-xs truncate" title={record.title}>{record.title}</TableCell>
                      <TableCell>{record.issueDate.toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{record.expiryDate.toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>{record.responsible}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(record.status)}>
                          {(record.status === 'Vencido' || record.status === 'Próximo ao Vencimento') && <AlertTriangle className="inline-block h-3 w-3 mr-1" />}
                          {record.status}
                        </Badge>
                      </TableCell>
                       <TableCell>
                           {pendingActionsCount > 0 ? (
                              <Badge variant="secondary">{pendingActionsCount}</Badge>
                           ) : (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                           )}
                       </TableCell>
                      <TableCell className="text-right space-x-1">
                         <Button variant="ghost" size="icon" onClick={() => handleViewFile(record.attachmentUrl, 'documento anexado')} disabled={!record.attachmentUrl} title="Ver Anexo">
                           <Link2 className={record.attachmentUrl ? "h-4 w-4" : "h-4 w-4 text-muted-foreground/50"} />
                           <span className="sr-only">Ver Anexo</span>
                         </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleOpenForm(record)} title="Editar / Ver Ações">
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
                                Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro do documento <span className="font-medium">{record.title}</span> ({record.documentType}).
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
                 );
                })
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum documento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

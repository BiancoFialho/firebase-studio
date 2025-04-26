// src/app/compliance/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, Scale, FileCheck2 } from 'lucide-react';
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
import type { LawsuitRecord } from '@/lib/types';

// Mock Data
const mockLawsuits: LawsuitRecord[] = [
  { id: 'law1', processNumber: '0012345-67.2024.5.15.0001', plaintiff: 'João Silva', subject: 'Insalubridade - Ruído', status: 'Em Andamento', filingDate: new Date(2024, 1, 10), hearingDate: new Date(2024, 8, 15), estimatedCost: 15000, details: 'Reclama adicional de insalubridade por exposição a ruído acima dos limites na linha de produção X.', relatedNRs: ['NR-15'] },
  { id: 'law2', processNumber: '0098765-43.2023.5.15.0002', plaintiff: 'Maria Oliveira', subject: 'Acidente de Trabalho - Falta de EPI', status: 'Acordo', filingDate: new Date(2023, 5, 20), finalCost: 8000, details: 'Acordo realizado referente a acidente ocorrido por suposta falta de luvas adequadas.', relatedNRs: ['NR-6'] },
  { id: 'law3', processNumber: '0011223-34.2024.5.15.0003', plaintiff: 'Empresa Terceirizada ABC', subject: 'Condições Inseguras', status: 'Finalizado - Favorável', filingDate: new Date(2024, 3, 1), finalCost: 0, details: 'Ação julgada improcedente. Condições de segurança comprovadas.', relatedNRs: ['NR-18'] }, // Example
];

// Mock Compliance Data (Simplified)
const complianceStatus = [
    { nr: 'NR-6 (EPI)', status: 'Conforme', details: 'Fichas de EPI atualizadas, CA válidos.' },
    { nr: 'NR-7 (PCMSO)', status: 'Conforme', details: 'ASOs em dia, programa implementado.' },
    { nr: 'NR-9 (PGR)', status: 'Requer Atenção', details: 'Revisão anual pendente.' },
    { nr: 'NR-15 (Insalubridade)', status: 'Conforme', details: 'Laudos atualizados.' },
    { nr: 'NR-35 (Altura)', status: 'Conforme', details: 'Treinamentos e procedimentos OK.' },
];


export default function CompliancePage() {
  const [lawsuits, setLawsuits] = useState<LawsuitRecord[]>(mockLawsuits);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<LawsuitRecord | null>(null);
  const { toast } = useToast();

  // Form State
  const [processNumber, setProcessNumber] = useState('');
  const [plaintiff, setPlaintiff] = useState('');
  const [subject, setSubject] = useState('');
  const [status, setStatus] = useState<LawsuitRecord['status']>('Em Andamento');
  const [filingDate, setFilingDate] = useState<Date | undefined>(new Date());
  const [hearingDate, setHearingDate] = useState<Date | undefined>(undefined);
  const [estimatedCost, setEstimatedCost] = useState<number | undefined>(undefined);
  const [finalCost, setFinalCost] = useState<number | undefined>(undefined);
  const [lawyer, setLawyer] = useState('');
  const [details, setDetails] = useState('');
  const [relatedNRs, setRelatedNRs] = useState(''); // Simple string input for now

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredLawsuits = lawsuits.filter((record) =>
    record.processNumber.includes(searchTerm) ||
    record.plaintiff.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setProcessNumber('');
    setPlaintiff('');
    setSubject('');
    setStatus('Em Andamento');
    setFilingDate(new Date());
    setHearingDate(undefined);
    setEstimatedCost(undefined);
    setFinalCost(undefined);
    setLawyer('');
    setDetails('');
    setRelatedNRs('');
    setEditingRecord(null);
  };

  const handleOpenForm = (record: LawsuitRecord | null = null) => {
    if (record) {
      setEditingRecord(record);
      setProcessNumber(record.processNumber);
      setPlaintiff(record.plaintiff);
      setSubject(record.subject);
      setStatus(record.status);
      setFilingDate(record.filingDate);
      setHearingDate(record.hearingDate);
      setEstimatedCost(record.estimatedCost);
      setFinalCost(record.finalCost);
      setLawyer(record.lawyer || '');
      setDetails(record.details);
      setRelatedNRs(record.relatedNRs?.join(', ') || '');
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
    if (!processNumber || !plaintiff || !subject || !filingDate || !status || !details) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios (*).",
        variant: "destructive",
      });
      return;
    }

    const nrsArray = relatedNRs.split(',').map(nr => nr.trim()).filter(nr => nr !== '');

    const newRecord: LawsuitRecord = {
      id: editingRecord ? editingRecord.id : `law${Date.now()}`,
      processNumber,
      plaintiff,
      subject,
      status,
      filingDate,
      hearingDate,
      estimatedCost,
      finalCost,
      lawyer: lawyer || undefined,
      details,
      relatedNRs: nrsArray.length > 0 ? nrsArray : undefined,
    };

    if (editingRecord) {
      setLawsuits(lawsuits.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({ title: "Sucesso", description: "Ação trabalhista atualizada." });
    } else {
      setLawsuits([newRecord, ...lawsuits]);
      toast({ title: "Sucesso", description: "Nova ação trabalhista registrada." });
    }
    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setLawsuits(lawsuits.filter(r => r.id !== id));
    toast({ title: "Sucesso", description: "Ação trabalhista excluída.", variant: "destructive" });
  };

  const getStatusBadgeVariant = (status: LawsuitRecord['status']): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'Em Andamento': return 'secondary';
      case 'Acordo': return 'default';
      case 'Finalizado - Favorável': return 'outline'; // Consider success variant if added
      case 'Finalizado - Desfavorável': return 'destructive';
      default: return 'outline';
    }
  };

   const getComplianceBadgeVariant = (status: string): "default" | "secondary" | "destructive" => {
       if (status === 'Conforme') return 'default';
       if (status === 'Requer Atenção') return 'secondary';
       // Add more variants if needed
       return 'destructive'; // Default for non-compliant/error?
   };


  return (
    <div className="space-y-8">
      {/* Lawsuits Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><Scale className="w-7 h-7"/> Ações Trabalhistas</h1>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenForm()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Ação
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingRecord ? 'Editar Ação Trabalhista' : 'Registrar Nova Ação Trabalhista'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Process Number */}
                  <div className="space-y-1">
                    <Label htmlFor="processNumber">Nº Processo*</Label>
                    <Input id="processNumber" value={processNumber} onChange={(e) => setProcessNumber(e.target.value)} required />
                  </div>
                  {/* Plaintiff */}
                  <div className="space-y-1">
                    <Label htmlFor="plaintiff">Reclamante*</Label>
                    <Input id="plaintiff" value={plaintiff} onChange={(e) => setPlaintiff(e.target.value)} required />
                  </div>
                  {/* Subject */}
                  <div className="space-y-1">
                    <Label htmlFor="subject">Assunto*</Label>
                    <Input id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Ex: Insalubridade, Falta EPI" required />
                  </div>
                  {/* Status */}
                  <div className="space-y-1">
                    <Label htmlFor="status">Status*</Label>
                    <Select value={status} onValueChange={(v: LawsuitRecord['status']) => setStatus(v)} required>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                        <SelectItem value="Acordo">Acordo</SelectItem>
                        <SelectItem value="Finalizado - Favorável">Finalizado - Favorável</SelectItem>
                        <SelectItem value="Finalizado - Desfavorável">Finalizado - Desfavorável</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Filing Date */}
                  <div className="space-y-1">
                    <Label htmlFor="filingDate">Data Abertura*</Label>
                    <DatePicker date={filingDate} setDate={setFilingDate} required />
                  </div>
                  {/* Hearing Date */}
                  <div className="space-y-1">
                    <Label htmlFor="hearingDate">Próx. Audiência (Opcional)</Label>
                    <DatePicker date={hearingDate} setDate={setHearingDate} />
                  </div>
                  {/* Estimated Cost */}
                  <div className="space-y-1">
                    <Label htmlFor="estimatedCost">Custo Estimado (Opcional)</Label>
                    <Input id="estimatedCost" type="number" min="0" step="0.01" value={estimatedCost ?? ''} onChange={(e) => setEstimatedCost(e.target.value ? Number(e.target.value) : undefined)} placeholder="R$" />
                  </div>
                   {/* Final Cost */}
                  <div className="space-y-1">
                    <Label htmlFor="finalCost">Custo Final (Opcional)</Label>
                    <Input id="finalCost" type="number" min="0" step="0.01" value={finalCost ?? ''} onChange={(e) => setFinalCost(e.target.value ? Number(e.target.value) : undefined)} placeholder="R$" />
                  </div>
                   {/* Lawyer */}
                  <div className="space-y-1">
                    <Label htmlFor="lawyer">Advogado (Opcional)</Label>
                    <Input id="lawyer" value={lawyer} onChange={(e) => setLawyer(e.target.value)} />
                  </div>
                   {/* Related NRs */}
                   <div className="space-y-1 lg:col-span-2">
                     <Label htmlFor="relatedNRs">NRs Relacionadas (Opcional)</Label>
                     <Input id="relatedNRs" value={relatedNRs} onChange={(e) => setRelatedNRs(e.target.value)} placeholder="Ex: NR-6, NR-15" />
                   </div>
                </div>
                 {/* Details */}
                <div className="space-y-1 mt-4">
                   <Label htmlFor="details">Detalhes/Observações*</Label>
                   <Textarea id="details" value={details} onChange={(e) => setDetails(e.target.value)} rows={4} required />
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
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por nº processo, reclamante ou assunto..."
            className="pl-8 w-full sm:w-1/2 md:w-1/3"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Registros de ações trabalhistas relacionadas a SSMA.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Nº Processo</TableHead>
                <TableHead>Reclamante</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead>Data Abertura</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>NRs</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLawsuits.length > 0 ? (
                filteredLawsuits.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.processNumber}</TableCell>
                    <TableCell>{record.plaintiff}</TableCell>
                    <TableCell>{record.subject}</TableCell>
                    <TableCell>{record.filingDate.toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                    </TableCell>
                     <TableCell>{record.relatedNRs?.join(', ') || '-'}</TableCell>
                    <TableCell className="text-right space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleOpenForm(record)} title="Editar/Ver Detalhes">
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
                              Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro da ação trabalhista nº <span className="font-medium">{record.processNumber}</span>.
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
                    Nenhuma ação trabalhista encontrada.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Compliance Section */}
       <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2"><FileCheck2 className="w-6 h-6"/> Conformidade com NRs (Exemplo)</h2>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableCaption>Status de conformidade com Normas Regulamentadoras selecionadas.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Norma Regulamentadora</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Detalhes/Observações</TableHead>
                            {/* <TableHead className="text-right">Ações</TableHead> */}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {complianceStatus.map((item) => (
                            <TableRow key={item.nr}>
                                <TableCell className="font-medium">{item.nr}</TableCell>
                                <TableCell>
                                    <Badge variant={getComplianceBadgeVariant(item.status)}>{item.status}</Badge>
                                </TableCell>
                                <TableCell>{item.details}</TableCell>
                                {/* <TableCell className="text-right">
                                     <Button variant="outline" size="sm" disabled>Verificar</Button>
                                </TableCell> */}
                            </TableRow>
                        ))}
                         <TableRow>
                             <TableCell colSpan={3} className="text-center text-sm text-muted-foreground py-4">
                                 (Funcionalidade de relatório detalhado de conformidade em desenvolvimento)
                             </TableCell>
                         </TableRow>
                    </TableBody>
                </Table>
            </div>
        </section>
    </div>
  );
}

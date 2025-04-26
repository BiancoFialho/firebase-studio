// src/app/prevention/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, Users, ListChecks, CalendarCheck2, FileUp } from 'lucide-react';
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
import type { CipaMeetingRecord, PreventiveAction } from '@/lib/types';

// Mock Data - CIPA Meetings
const mockCipaMeetings: CipaMeetingRecord[] = [
  { id: 'cipa1', date: new Date(2024, 6, 10), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira'], agenda: 'Discussão sobre EPIs, análise de incidente leve.', status: 'Realizada', actionsDefined: [{ description: 'Verificar validade dos protetores auriculares', responsible: 'Almoxarifado', deadline: new Date(2024, 6, 17), status: 'Concluída' }] },
  { id: 'cipa2', date: new Date(2024, 5, 12), participants: ['João Silva', 'Maria Oliveira', 'Ana Costa'], agenda: 'Planejamento SIPAT, riscos ergonômicos.', status: 'Realizada', minutesUrl: 'https://example.com/cipa/ata-junho', actionsDefined: [{ description: 'Contratar palestra sobre ergonomia', responsible: 'RH', deadline: new Date(2024, 7, 1), status: 'Em Andamento' }] },
  { id: 'cipa3', date: new Date(2024, 7, 14), participants: [], agenda: 'Próxima reunião ordinária.', status: 'Agendada', actionsDefined: [] },
];

// Mock Data - Preventive Actions (Checklist)
const mockPreventiveActions: PreventiveAction[] = [
  { id: 'pa1', description: 'Inspeção mensal em extintores', category: 'Inspeção', responsible: 'Brigada', frequency: 'Mensal', lastCompletedDate: new Date(2024, 6, 5), status: 'Concluída' },
  { id: 'pa2', description: 'Treinamento NR-33 (reciclagem)', category: 'Treinamento', responsible: 'SESMT', dueDate: new Date(2024, 8, 30), status: 'Pendente' },
  { id: 'pa3', description: 'Verificação de validade dos capacetes', category: 'EPI', responsible: 'Almoxarifado', frequency: 'Semestral', lastCompletedDate: new Date(2024, 2, 15), status: 'Concluída' },
  { id: 'pa4', description: 'Manutenção preventiva prensa H', category: 'Manutenção', responsible: 'Manutenção Mec.', frequency: 'Trimestral', lastCompletedDate: new Date(2024, 5, 20), status: 'Atrasada', dueDate: new Date(2024, 7, 1) }, // Example: Due in July, last done in May
];

export default function PreventionPage() {
  // CIPA State
  const [cipaMeetings, setCipaMeetings] = useState<CipaMeetingRecord[]>(mockCipaMeetings);
  const [cipaSearchTerm, setCipaSearchTerm] = useState('');
  const [isCipaFormOpen, setIsCipaFormOpen] = useState(false);
  const [editingCipaRecord, setEditingCipaRecord] = useState<CipaMeetingRecord | null>(null);

  // Preventive Actions State
  const [preventiveActions, setPreventiveActions] = useState<PreventiveAction[]>(mockPreventiveActions);
  const [preventiveSearchTerm, setPreventiveSearchTerm] = useState('');
  const [isPreventiveFormOpen, setIsPreventiveFormOpen] = useState(false);
  const [editingPreventiveRecord, setEditingPreventiveRecord] = useState<PreventiveAction | null>(null);

  const { toast } = useToast();

  // --- CIPA Handlers ---
  const handleCipaSearch = (event: React.ChangeEvent<HTMLInputElement>) => setCipaSearchTerm(event.target.value);
  const filteredCipaMeetings = cipaMeetings.filter(m => m.agenda.toLowerCase().includes(cipaSearchTerm.toLowerCase()) || m.status.toLowerCase().includes(cipaSearchTerm.toLowerCase()));
  const resetCipaForm = () => { /* ... CIPA form reset logic ... */ setEditingCipaRecord(null); };
  const handleOpenCipaForm = (record: CipaMeetingRecord | null = null) => { /* ... CIPA form populate logic ... */ setEditingCipaRecord(record); setIsCipaFormOpen(true); };
  const handleCloseCipaForm = () => { setIsCipaFormOpen(false); resetCipaForm(); };
  const handleCipaSubmit = (event: React.FormEvent) => { event.preventDefault(); /* ... CIPA submit logic ... */ toast({ title: "Sucesso", description: "Reunião CIPA salva." }); handleCloseCipaForm(); };
  const handleCipaDelete = (id: string) => { setCipaMeetings(cipaMeetings.filter(m => m.id !== id)); toast({ title: "Sucesso", description: "Reunião CIPA excluída.", variant: "destructive" }); };

  // --- Preventive Actions Handlers ---
  const handlePreventiveSearch = (event: React.ChangeEvent<HTMLInputElement>) => setPreventiveSearchTerm(event.target.value);
  const filteredPreventiveActions = preventiveActions.filter(a => a.description.toLowerCase().includes(preventiveSearchTerm.toLowerCase()) || a.category.toLowerCase().includes(preventiveSearchTerm.toLowerCase()) || a.status.toLowerCase().includes(preventiveSearchTerm.toLowerCase()));
  const resetPreventiveForm = () => { /* ... Preventive form reset logic ... */ setEditingPreventiveRecord(null); };
  const handleOpenPreventiveForm = (record: PreventiveAction | null = null) => { /* ... Preventive form populate logic ... */ setEditingPreventiveRecord(record); setIsPreventiveFormOpen(true); };
  const handleClosePreventiveForm = () => { setIsPreventiveFormOpen(false); resetPreventiveForm(); };
  const handlePreventiveSubmit = (event: React.FormEvent) => { event.preventDefault(); /* ... Preventive submit logic ... */ toast({ title: "Sucesso", description: "Ação preventiva salva." }); handleClosePreventiveForm(); };
  const handlePreventiveDelete = (id: string) => { setPreventiveActions(preventiveActions.filter(a => a.id !== id)); toast({ title: "Sucesso", description: "Ação preventiva excluída.", variant: "destructive" }); };

  // --- Badge Variants ---
  const getCipaStatusBadgeVariant = (status: CipaMeetingRecord['status']): "default" | "secondary" | "outline" => {
      if (status === 'Realizada') return 'default';
      if (status === 'Agendada') return 'secondary';
      return 'outline';
  };
 const getPreventiveStatusBadgeVariant = (status: PreventiveAction['status']): "default" | "secondary" | "destructive" | "outline" => {
     if (status === 'Concluída') return 'default';
     if (status === 'Em Andamento') return 'secondary';
     if (status === 'Pendente') return 'outline';
     if (status === 'Atrasada') return 'destructive';
     return 'outline';
 };

  return (
    <div className="space-y-8">
      {/* CIPA Meetings Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><Users className="w-6 h-6"/> Reuniões da CIPA</h2>
          <Dialog open={isCipaFormOpen} onOpenChange={setIsCipaFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenCipaForm()}>
                <PlusCircle className="mr-2 h-4 w-4" /> Registrar Reunião
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingCipaRecord ? 'Editar Reunião CIPA' : 'Registrar Nova Reunião CIPA'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCipaSubmit} className="grid gap-4 py-4">
                {/* Simplified CIPA Form - Expand later */}
                 <div className="space-y-1">
                    <Label htmlFor="cipaDate">Data*</Label>
                    {/* Use DatePicker component */}
                 </div>
                 <div className="space-y-1">
                    <Label htmlFor="cipaAgenda">Pauta/Agenda*</Label>
                    <Textarea id="cipaAgenda" rows={3} required />
                 </div>
                 <div className="space-y-1">
                     <Label htmlFor="cipaStatus">Status*</Label>
                      <Select /* value={...} onValueChange={...} */ required>
                         <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                         <SelectContent>
                             <SelectItem value="Agendada">Agendada</SelectItem>
                             <SelectItem value="Realizada">Realizada</SelectItem>
                             <SelectItem value="Cancelada">Cancelada</SelectItem>
                         </SelectContent>
                      </Select>
                  </div>
                   <div className="space-y-1">
                       <Label htmlFor="cipaMinutes">Link Ata (Opcional)</Label>
                       <Input id="cipaMinutes" type="url" />
                   </div>
                    {/* Add fields for participants and actions defined */}
                <DialogFooter className="mt-4">
                  <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                  <Button type="submit">{editingCipaRecord ? 'Salvar' : 'Registrar'}</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar por pauta ou status..." className="pl-8 w-full sm:w-1/2 md:w-1/3" value={cipaSearchTerm} onChange={handleCipaSearch} />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Registros das reuniões da CIPA.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Pauta Resumida</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações Definidas</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCipaMeetings.length > 0 ? filteredCipaMeetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell>{meeting.date.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="max-w-xs truncate">{meeting.agenda}</TableCell>
                  <TableCell><Badge variant={getCipaStatusBadgeVariant(meeting.status)}>{meeting.status}</Badge></TableCell>
                  <TableCell>{meeting.actionsDefined.length}</TableCell>
                  <TableCell className="text-right space-x-1">
                      {meeting.minutesUrl && <Button variant="ghost" size="icon" title="Ver Ata" asChild><a href={meeting.minutesUrl} target="_blank" rel="noopener noreferrer"><FileUp className="h-4 w-4"/></a></Button>}
                    <Button variant="ghost" size="icon" onClick={() => handleOpenCipaForm(meeting)} title="Editar"><Edit className="h-4 w-4" /></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent> {/* ... Delete confirmation ... */} </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={5} className="h-24 text-center">Nenhuma reunião encontrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Preventive Actions Section */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-2xl font-semibold flex items-center gap-2"><ListChecks className="w-6 h-6"/> Ações Preventivas (Checklist)</h2>
           <Dialog open={isPreventiveFormOpen} onOpenChange={setIsPreventiveFormOpen}>
             <DialogTrigger asChild>
               <Button onClick={() => handleOpenPreventiveForm()}>
                 <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Ação
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-lg">
                 <DialogHeader>
                    <DialogTitle>{editingPreventiveRecord ? 'Editar Ação Preventiva' : 'Adicionar Nova Ação Preventiva'}</DialogTitle>
                 </DialogHeader>
                  <form onSubmit={handlePreventiveSubmit} className="grid gap-4 py-4">
                     {/* Simplified Preventive Action Form - Expand later */}
                      <div className="space-y-1">
                         <Label htmlFor="paDescription">Descrição*</Label>
                         <Textarea id="paDescription" rows={3} required />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label htmlFor="paCategory">Categoria*</Label>
                                <Select /* value={...} onValueChange={...} */ required>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Inspeção">Inspeção</SelectItem>
                                        <SelectItem value="Treinamento">Treinamento</SelectItem>
                                        <SelectItem value="Manutenção">Manutenção</SelectItem>
                                        <SelectItem value="EPI">EPI</SelectItem>
                                        <SelectItem value="Procedimento">Procedimento</SelectItem>
                                        <SelectItem value="Outro">Outro</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1">
                               <Label htmlFor="paResponsible">Responsável*</Label>
                               <Input id="paResponsible" required />
                           </div>
                             <div className="space-y-1">
                                <Label htmlFor="paFrequency">Frequência</Label>
                                <Select /* value={...} onValueChange={...} */>
                                    <SelectTrigger><SelectValue placeholder="Selecione (Opcional)" /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Diária">Diária</SelectItem>
                                        <SelectItem value="Semanal">Semanal</SelectItem>
                                        <SelectItem value="Mensal">Mensal</SelectItem>
                                        <SelectItem value="Trimestral">Trimestral</SelectItem>
                                        <SelectItem value="Semestral">Semestral</SelectItem>
                                        <SelectItem value="Anual">Anual</SelectItem>
                                        <SelectItem value="Única">Única</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="paDueDate">Prazo (se única/atrasada)</Label>
                                {/* Use DatePicker component */}
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="paStatus">Status*</Label>
                                <Select /* value={...} onValueChange={...} */ required>
                                    <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Pendente">Pendente</SelectItem>
                                        <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                                        <SelectItem value="Concluída">Concluída</SelectItem>
                                         <SelectItem value="Atrasada">Atrasada</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="paLastCompleted">Última Realização</Label>
                                {/* Use DatePicker component */}
                            </div>
                       </div>

                     <DialogFooter className="mt-4">
                       <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                       <Button type="submit">{editingPreventiveRecord ? 'Salvar' : 'Adicionar'}</Button>
                     </DialogFooter>
                   </form>
             </DialogContent>
           </Dialog>
        </div>
         <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar por descrição, categoria ou status..." className="pl-8 w-full sm:w-1/2 md:w-1/3" value={preventiveSearchTerm} onChange={handlePreventiveSearch} />
        </div>
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableCaption>Checklist de ações preventivas de SSMA.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead>Frequência/Prazo</TableHead>
                <TableHead>Última Realização</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPreventiveActions.length > 0 ? filteredPreventiveActions.map((action) => (
                <TableRow key={action.id}>
                  <TableCell className="font-medium max-w-sm truncate">{action.description}</TableCell>
                  <TableCell>{action.category}</TableCell>
                  <TableCell>{action.responsible}</TableCell>
                  <TableCell>{action.frequency || action.dueDate?.toLocaleDateString('pt-BR') || '-'}</TableCell>
                  <TableCell>{action.lastCompletedDate?.toLocaleDateString('pt-BR') || '-'}</TableCell>
                  <TableCell><Badge variant={getPreventiveStatusBadgeVariant(action.status)}>{action.status}</Badge></TableCell>
                  <TableCell className="text-right space-x-1">
                    {/* Add button to mark as complete? */}
                     <Button variant="ghost" size="icon" title="Marcar como Concluída" onClick={() => {/* Logic to update status */ toast({title: "Status Atualizado"})}}>
                        <CalendarCheck2 className="h-4 w-4"/>
                     </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleOpenPreventiveForm(action)} title="Editar"><Edit className="h-4 w-4" /></Button>
                     <AlertDialog>
                      <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Excluir"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent> {/* ... Delete confirmation ... */} </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow><TableCell colSpan={7} className="h-24 text-center">Nenhuma ação preventiva encontrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}

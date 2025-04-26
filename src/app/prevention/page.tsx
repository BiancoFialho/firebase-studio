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
import { PlusCircle, Search, Edit, Trash2, Users, ListChecks, CalendarCheck2, FileUp, Link2, AlertTriangle, CheckCircle } from 'lucide-react'; // Added Link2, AlertTriangle, CheckCircle
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card components

// Mock Data - CIPA Meetings
const mockCipaMeetings: CipaMeetingRecord[] = [
  { id: 'cipa1', date: new Date(2024, 6, 10), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira'], agenda: 'Discussão sobre EPIs, análise de incidente leve.', status: 'Realizada', actionsDefined: [{ id: 'act1', description: 'Verificar validade dos protetores auriculares', responsible: 'Almoxarifado', deadline: new Date(2024, 6, 17), status: 'Concluída' }] },
  { id: 'cipa2', date: new Date(2024, 5, 12), participants: ['João Silva', 'Maria Oliveira', 'Ana Costa'], agenda: 'Planejamento SIPAT, riscos ergonômicos.', status: 'Realizada', minutesUrl: 'https://example.com/cipa/ata-junho', actionsDefined: [{ id: 'act2', description: 'Contratar palestra sobre ergonomia', responsible: 'RH', deadline: new Date(2024, 7, 1), status: 'Em Andamento' }] },
  { id: 'cipa3', date: new Date(2024, 7, 14), participants: ['João Silva', 'Maria Oliveira', 'Carlos Pereira', 'Ana Costa', 'Pedro Santos'], agenda: 'Próxima reunião ordinária: Análise Preliminar de Risco (APR) nova máquina.', status: 'Agendada', actionsDefined: [] },
];

// Mock Data - Preventive Actions (Checklist)
const mockPreventiveActions: PreventiveAction[] = [
  { id: 'pa1', description: 'Inspeção mensal em extintores de incêndio', category: 'Inspeção', responsible: 'Brigada', frequency: 'Mensal', lastCompletedDate: new Date(2024, 6, 5), status: 'Concluída', evidenceUrl: '/docs/extintores-jul.pdf' },
  { id: 'pa2', description: 'Treinamento NR-33 (Espaços Confinados) - Reciclagem', category: 'Treinamento', responsible: 'SESMT', dueDate: new Date(2024, 8, 30), status: 'Pendente' },
  { id: 'pa3', description: 'Verificação de validade e condições dos capacetes', category: 'EPI', responsible: 'Almoxarifado', frequency: 'Semestral', lastCompletedDate: new Date(2024, 2, 15), status: 'Concluída' },
  { id: 'pa4', description: 'Manutenção preventiva prensa hidráulica H-100', category: 'Manutenção', responsible: 'Manutenção Mecânica', frequency: 'Trimestral', lastCompletedDate: new Date(2024, 5, 20), status: 'Atrasada', dueDate: new Date(2024, 7, 1) }, // Example: Due in July, last done in May
  { id: 'pa5', description: 'Revisão do procedimento de bloqueio e etiquetagem (LOTO)', category: 'Procedimento', responsible: 'Engenharia Seg.', dueDate: new Date(2024, 9, 15), status: 'Em Andamento' },
];

export default function PreventionPage() {
  // CIPA State
  const [cipaMeetings, setCipaMeetings] = useState<CipaMeetingRecord[]>(mockCipaMeetings);
  const [cipaSearchTerm, setCipaSearchTerm] = useState('');
  const [isCipaFormOpen, setIsCipaFormOpen] = useState(false);
  const [editingCipaRecord, setEditingCipaRecord] = useState<CipaMeetingRecord | null>(null);
   // CIPA Form Fields State
   const [cipaDate, setCipaDate] = useState<Date | undefined>(new Date());
   const [cipaAgenda, setCipaAgenda] = useState('');
   const [cipaStatus, setCipaStatus] = useState<CipaMeetingRecord['status']>('Agendada');
   const [cipaMinutesUrl, setCipaMinutesUrl] = useState('');
   const [cipaParticipants, setCipaParticipants] = useState(''); // Simple text area for now
   const [cipaActionsText, setCipaActionsText] = useState(''); // Simple text area for now

  // Preventive Actions State
  const [preventiveActions, setPreventiveActions] = useState<PreventiveAction[]>(mockPreventiveActions);
  const [preventiveSearchTerm, setPreventiveSearchTerm] = useState('');
  const [isPreventiveFormOpen, setIsPreventiveFormOpen] = useState(false);
  const [editingPreventiveRecord, setEditingPreventiveRecord] = useState<PreventiveAction | null>(null);
  // Preventive Form Fields State
  const [paDescription, setPaDescription] = useState('');
  const [paCategory, setPaCategory] = useState<PreventiveAction['category'] | ''>('');
  const [paResponsible, setPaResponsible] = useState('');
  const [paFrequency, setPaFrequency] = useState<PreventiveAction['frequency'] | ''>('');
  const [paDueDate, setPaDueDate] = useState<Date | undefined>(undefined);
  const [paLastCompletedDate, setPaLastCompletedDate] = useState<Date | undefined>(undefined);
  const [paStatus, setPaStatus] = useState<PreventiveAction['status']>('Pendente');
  const [paEvidenceUrl, setPaEvidenceUrl] = useState('');


  const { toast } = useToast();

  // --- CIPA Handlers ---
  const handleCipaSearch = (event: React.ChangeEvent<HTMLInputElement>) => setCipaSearchTerm(event.target.value);
  const filteredCipaMeetings = cipaMeetings.filter(m => m.agenda.toLowerCase().includes(cipaSearchTerm.toLowerCase()) || m.status.toLowerCase().includes(cipaSearchTerm.toLowerCase()));

  const resetCipaForm = () => {
    setEditingCipaRecord(null);
    setCipaDate(new Date());
    setCipaAgenda('');
    setCipaStatus('Agendada');
    setCipaMinutesUrl('');
    setCipaParticipants('');
    setCipaActionsText('');
  };

  const handleOpenCipaForm = (record: CipaMeetingRecord | null = null) => {
    if (record) {
        setEditingCipaRecord(record);
        setCipaDate(record.date);
        setCipaAgenda(record.agenda);
        setCipaStatus(record.status);
        setCipaMinutesUrl(record.minutesUrl || '');
        setCipaParticipants(record.participants.join(', '));
        // Simple text representation of actions for the form
        setCipaActionsText(record.actionsDefined.map(a => `${a.description} (Resp: ${a.responsible}, Prazo: ${a.deadline?.toLocaleDateString('pt-BR') || 'N/A'}, Status: ${a.status})`).join('\n'));
    } else {
        resetCipaForm();
    }
    setIsCipaFormOpen(true);
   };

  const handleCloseCipaForm = () => { setIsCipaFormOpen(false); resetCipaForm(); };

  const handleCipaSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (!cipaDate || !cipaAgenda || !cipaStatus) {
          toast({ title: "Erro", description: "Preencha Data, Pauta e Status da reunião.", variant: "destructive" });
          return;
      }
      // Basic parsing of participants and actions - improve later
      const participantsArray = cipaParticipants.split(',').map(p => p.trim()).filter(p => p);
      const actionsArray = cipaActionsText.split('\n').map((line, index) => {
          // Very basic parsing, assumes format: Description (Resp: Name, Prazo: Date, Status: Status)
          const match = line.match(/(.+)\s\(Resp:\s*(.+),\s*Prazo:\s*(.+),\s*Status:\s*(.+)\)/);
          if (match) {
              return {
                  id: `act${editingCipaRecord?.id || 'new'}-${index}`,
                  description: match[1]?.trim() || 'Descrição não informada',
                  responsible: match[2]?.trim() || 'Responsável não informado',
                  deadline: match[3] !== 'N/A' ? new Date(match[3].split('/').reverse().join('-')) : undefined, // Handle 'N/A' and parse date
                  status: (match[4]?.trim() as any) || 'Pendente' // Cast status, default to Pendente
              };
          }
          return null; // Ignore lines that don't match
      }).filter(a => a !== null) as CipaMeetingRecord['actionsDefined'];


      const newRecord: CipaMeetingRecord = {
          id: editingCipaRecord ? editingCipaRecord.id : `cipa${Date.now()}`,
          date: cipaDate,
          participants: participantsArray,
          agenda: cipaAgenda,
          status: cipaStatus,
          minutesUrl: cipaMinutesUrl || undefined,
          actionsDefined: actionsArray,
      };

      if (editingCipaRecord) {
          setCipaMeetings(cipaMeetings.map(m => m.id === editingCipaRecord.id ? newRecord : m));
          toast({ title: "Sucesso", description: "Reunião CIPA atualizada." });
      } else {
          setCipaMeetings([newRecord, ...cipaMeetings]);
          toast({ title: "Sucesso", description: "Nova reunião CIPA registrada." });
      }
      handleCloseCipaForm();
  };

  const handleCipaDelete = (id: string) => {
      setCipaMeetings(cipaMeetings.filter(m => m.id !== id));
      toast({ title: "Sucesso", description: "Reunião CIPA excluída.", variant: "destructive" });
   };

  // --- Preventive Actions Handlers ---
  const handlePreventiveSearch = (event: React.ChangeEvent<HTMLInputElement>) => setPreventiveSearchTerm(event.target.value);
  const filteredPreventiveActions = preventiveActions.filter(a => a.description.toLowerCase().includes(preventiveSearchTerm.toLowerCase()) || a.category.toLowerCase().includes(preventiveSearchTerm.toLowerCase()) || a.status.toLowerCase().includes(preventiveSearchTerm.toLowerCase()));

  const resetPreventiveForm = () => {
      setEditingPreventiveRecord(null);
      setPaDescription('');
      setPaCategory('');
      setPaResponsible('');
      setPaFrequency('');
      setPaDueDate(undefined);
      setPaLastCompletedDate(undefined);
      setPaStatus('Pendente');
      setPaEvidenceUrl('');
  };

  const handleOpenPreventiveForm = (record: PreventiveAction | null = null) => {
      if (record) {
          setEditingPreventiveRecord(record);
          setPaDescription(record.description);
          setPaCategory(record.category);
          setPaResponsible(record.responsible);
          setPaFrequency(record.frequency || '');
          setPaDueDate(record.dueDate);
          setPaLastCompletedDate(record.lastCompletedDate);
          setPaStatus(record.status);
          setPaEvidenceUrl(record.evidenceUrl || '');
      } else {
          resetPreventiveForm();
      }
      setIsPreventiveFormOpen(true);
  };

  const handleClosePreventiveForm = () => { setIsPreventiveFormOpen(false); resetPreventiveForm(); };

  const handlePreventiveSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!paDescription || !paCategory || !paResponsible || !paStatus) {
        toast({ title: "Erro", description: "Preencha Descrição, Categoria, Responsável e Status.", variant: "destructive" });
        return;
    }

    const newRecord: PreventiveAction = {
        id: editingPreventiveRecord ? editingPreventiveRecord.id : `pa${Date.now()}`,
        description: paDescription,
        category: paCategory,
        responsible: paResponsible,
        frequency: paFrequency || undefined,
        dueDate: paDueDate,
        lastCompletedDate: paLastCompletedDate,
        status: paStatus,
        evidenceUrl: paEvidenceUrl || undefined,
    };

     // Update status if marking as completed now
    if (paStatus === 'Concluída' && !paLastCompletedDate) {
        newRecord.lastCompletedDate = new Date(); // Set completion date to now
    }

    if (editingPreventiveRecord) {
        setPreventiveActions(preventiveActions.map(a => a.id === editingPreventiveRecord.id ? newRecord : a));
        toast({ title: "Sucesso", description: "Ação preventiva atualizada." });
    } else {
        setPreventiveActions([newRecord, ...preventiveActions]);
        toast({ title: "Sucesso", description: "Nova ação preventiva adicionada." });
    }
    handleClosePreventiveForm();
   };

   const handlePreventiveDelete = (id: string) => {
       setPreventiveActions(preventiveActions.filter(a => a.id !== id));
       toast({ title: "Sucesso", description: "Ação preventiva excluída.", variant: "destructive" });
   };

   const handleMarkAsComplete = (id: string) => {
       setPreventiveActions(preventiveActions.map(a => {
           if (a.id === id) {
               return { ...a, status: 'Concluída', lastCompletedDate: new Date() };
           }
           return a;
       }));
       toast({ title: "Sucesso", description: "Ação marcada como concluída." });
   };

   // Determine overall CIPA meeting status (e.g., if meetings are happening as planned)
   const cipaMeetingCompliance = () => {
       const currentYear = new Date().getFullYear();
       const meetingsThisYear = cipaMeetings.filter(m => m.date.getFullYear() === currentYear && m.status === 'Realizada').length;
       // Simple check: assume monthly meetings required (12 per year)
       const expectedMeetings = new Date().getMonth() + 1; // Expected meetings up to current month
       if (meetingsThisYear >= expectedMeetings) return { status: '✅ Em dia', color: 'text-green-600' };
       if (meetingsThisYear < expectedMeetings -1) return { status: '⚠️ Atrasadas', color: 'text-destructive' };
       return { status: '🟡 Próximo', color: 'text-orange-500' };
   };

   const pendingPreventiveActions = filteredPreventiveActions.filter(a => a.status === 'Pendente' || a.status === 'Em Andamento' || a.status === 'Atrasada').length;
   const overduePreventiveActions = filteredPreventiveActions.filter(a => a.status === 'Atrasada').length;


  // --- Badge Variants ---
  const getCipaStatusBadgeVariant = (status: CipaMeetingRecord['status']): "default" | "secondary" | "outline" => {
      if (status === 'Realizada') return 'default'; // Green/Primary
      if (status === 'Agendada') return 'secondary'; // Yellow/Orange
      return 'outline'; // Grey for Cancelled
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
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-2">
                         <Users className="w-6 h-6"/>
                         <CardTitle className="text-2xl">Reuniões da CIPA</CardTitle>
                    </div>
                    <Dialog open={isCipaFormOpen} onOpenChange={setIsCipaFormOpen}>
                        <DialogTrigger asChild>
                        <Button onClick={() => handleOpenCipaForm()}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Registrar Reunião
                        </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingCipaRecord ? 'Editar Reunião CIPA' : 'Registrar Nova Reunião CIPA'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleCipaSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <Label htmlFor="cipaDate">Data*</Label>
                                    <DatePicker date={cipaDate} setDate={setCipaDate} required />
                                </div>
                                <div className="space-y-1">
                                    <Label htmlFor="cipaStatus">Status*</Label>
                                    <Select value={cipaStatus} onValueChange={(v: CipaMeetingRecord['status']) => setCipaStatus(v)} required>
                                        <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Agendada">Agendada</SelectItem>
                                            <SelectItem value="Realizada">Realizada</SelectItem>
                                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-1">
                                <Label htmlFor="cipaAgenda">Pauta/Agenda*</Label>
                                <Textarea id="cipaAgenda" value={cipaAgenda} onChange={(e) => setCipaAgenda(e.target.value)} rows={3} required />
                             </div>
                             <div className="space-y-1">
                                 <Label htmlFor="cipaParticipants">Participantes (separados por vírgula)</Label>
                                 <Input id="cipaParticipants" value={cipaParticipants} onChange={(e) => setCipaParticipants(e.target.value)} />
                              </div>
                              <div className="space-y-1">
                                   <Label htmlFor="cipaMinutesUrl">Link Ata (Opcional)</Label>
                                   <Input id="cipaMinutesUrl" value={cipaMinutesUrl} onChange={(e) => setCipaMinutesUrl(e.target.value)} type="url" placeholder="http://..." />
                              </div>
                               <div className="space-y-1">
                                   <Label htmlFor="cipaActionsText">Ações Definidas (uma por linha)</Label>
                                   <Textarea
                                        id="cipaActionsText"
                                        value={cipaActionsText}
                                        onChange={(e) => setCipaActionsText(e.target.value)}
                                        rows={4}
                                        placeholder="Formato: Descrição (Resp: Nome, Prazo: DD/MM/YYYY, Status: Pendente/Em Andamento/Concluída)"
                                    />
                                   <p className="text-xs text-muted-foreground">Ex: Verificar extintores (Resp: Brigada, Prazo: 15/08/2024, Status: Pendente)</p>
                               </div>

                            <DialogFooter className="mt-4">
                            <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                            <Button type="submit">{editingCipaRecord ? 'Salvar Alterações' : 'Registrar'}</Button>
                            </DialogFooter>
                        </form>
                        </DialogContent>
                    </Dialog>
                </div>
                 <CardDescription>
                     Registros e acompanhamento das reuniões da Comissão Interna de Prevenção de Acidentes.
                     Status Geral: <span className={`font-medium ${cipaMeetingCompliance().color}`}>{cipaMeetingCompliance().status}</span>
                 </CardDescription>
            </CardHeader>
             <CardContent>
                 <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar por pauta ou status..." className="pl-8 w-full sm:w-1/2 md:w-1/3" value={cipaSearchTerm} onChange={handleCipaSearch} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Data</TableHead>
                        <TableHead>Pauta Resumida</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações Def.</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCipaMeetings.length > 0 ? filteredCipaMeetings.map((meeting) => (
                        <TableRow key={meeting.id}>
                          <TableCell>{meeting.date.toLocaleDateString('pt-BR')}</TableCell>
                          <TableCell className="max-w-xs truncate" title={meeting.agenda}>{meeting.agenda}</TableCell>
                          <TableCell><Badge variant={getCipaStatusBadgeVariant(meeting.status)}>{meeting.status}</Badge></TableCell>
                          <TableCell>{meeting.actionsDefined.length}</TableCell>
                          <TableCell className="text-right space-x-1">
                              {meeting.minutesUrl && <Button variant="ghost" size="icon" title="Ver Ata" asChild><a href={meeting.minutesUrl} target="_blank" rel="noopener noreferrer"><FileUp className="h-4 w-4"/></a></Button>}
                            <Button variant="ghost" size="icon" onClick={() => handleOpenCipaForm(meeting)} title="Editar/Ver Detalhes"><Edit className="h-4 w-4" /></Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Excluir"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                       <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                       <AlertDialogDescription>
                                           Excluir a reunião da CIPA de {meeting.date.toLocaleDateString('pt-BR')}? As ações definidas também serão removidas.
                                       </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                       <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                       <AlertDialogAction onClick={() => handleCipaDelete(meeting.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={5} className="h-24 text-center">Nenhuma reunião encontrada.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
             </CardContent>
        </Card>
      </section>

      {/* Preventive Actions Section */}
      <section>
         <Card>
             <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-2">
                           <ListChecks className="w-6 h-6"/>
                           <CardTitle className="text-2xl">Ações Preventivas (Checklist)</CardTitle>
                      </div>
                       <Dialog open={isPreventiveFormOpen} onOpenChange={setIsPreventiveFormOpen}>
                         <DialogTrigger asChild>
                           <Button onClick={() => handleOpenPreventiveForm()}>
                             <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Ação
                           </Button>
                         </DialogTrigger>
                         <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                             <DialogHeader>
                                <DialogTitle>{editingPreventiveRecord ? 'Editar Ação Preventiva' : 'Adicionar Nova Ação Preventiva'}</DialogTitle>
                             </DialogHeader>
                              <form onSubmit={handlePreventiveSubmit} className="grid gap-4 py-4">
                                   <div className="space-y-1">
                                     <Label htmlFor="paDescription">Descrição*</Label>
                                     <Textarea id="paDescription" value={paDescription} onChange={e => setPaDescription(e.target.value)} rows={3} required />
                                  </div>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label htmlFor="paCategory">Categoria*</Label>
                                            <Select value={paCategory} onValueChange={(v: PreventiveAction['category'] | '') => setPaCategory(v)} required>
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
                                           <Input id="paResponsible" value={paResponsible} onChange={e => setPaResponsible(e.target.value)} required />
                                       </div>
                                         <div className="space-y-1">
                                            <Label htmlFor="paFrequency">Frequência</Label>
                                            <Select value={paFrequency} onValueChange={(v: PreventiveAction['frequency'] | '') => setPaFrequency(v)}>
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
                                            <DatePicker date={paDueDate} setDate={setPaDueDate} />
                                        </div>
                                        <div className="space-y-1">
                                            <Label htmlFor="paStatus">Status*</Label>
                                            <Select value={paStatus} onValueChange={(v: PreventiveAction['status']) => setPaStatus(v)} required>
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
                                            <DatePicker date={paLastCompletedDate} setDate={setPaLastCompletedDate} />
                                        </div>
                                        <div className="space-y-1 md:col-span-2">
                                           <Label htmlFor="paEvidenceUrl">Link Evidência (Opcional)</Label>
                                           <Input id="paEvidenceUrl" value={paEvidenceUrl} onChange={e => setPaEvidenceUrl(e.target.value)} type="url" placeholder="http://..." />
                                       </div>
                                   </div>

                                 <DialogFooter className="mt-4">
                                   <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                                   <Button type="submit">{editingPreventiveRecord ? 'Salvar Alterações' : 'Adicionar'}</Button>
                                 </DialogFooter>
                               </form>
                         </DialogContent>
                       </Dialog>
                  </div>
                  <CardDescription>
                      Controle de ações e inspeções preventivas de SSMA.
                      {pendingPreventiveActions > 0 && (
                          <span className={`ml-2 font-medium ${overduePreventiveActions > 0 ? 'text-destructive' : 'text-orange-500'}`}>
                              ({pendingPreventiveActions} pendentes, {overduePreventiveActions} atrasadas)
                          </span>
                      )}
                      {pendingPreventiveActions === 0 && (
                            <span className="ml-2 font-medium text-green-600">(Todas as ações em dia ✅)</span>
                      )}
                  </CardDescription>
             </CardHeader>
            <CardContent>
                 <div className="relative mb-4">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar por descrição, categoria ou status..." className="pl-8 w-full sm:w-1/2 md:w-1/3" value={preventiveSearchTerm} onChange={handlePreventiveSearch} />
                </div>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    {/* <TableCaption>Checklist de ações preventivas de SSMA.</TableCaption> */}
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
                        <TableRow key={action.id} className={action.status === 'Atrasada' ? 'bg-destructive/10' : ''}>
                          <TableCell className="font-medium max-w-sm truncate" title={action.description}>{action.description}</TableCell>
                          <TableCell>{action.category}</TableCell>
                          <TableCell>{action.responsible}</TableCell>
                          <TableCell>{action.frequency || action.dueDate?.toLocaleDateString('pt-BR') || '-'}</TableCell>
                          <TableCell>{action.lastCompletedDate?.toLocaleDateString('pt-BR') || '-'}</TableCell>
                          <TableCell>
                             <Badge variant={getPreventiveStatusBadgeVariant(action.status)}>
                                {action.status === 'Atrasada' && <AlertTriangle className="inline-block h-3 w-3 mr-1" />}
                                {action.status}
                             </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-1">
                              {action.evidenceUrl && <Button variant="ghost" size="icon" title="Ver Evidência" asChild><a href={action.evidenceUrl} target="_blank" rel="noopener noreferrer"><Link2 className="h-4 w-4"/></a></Button>}
                             {action.status !== 'Concluída' && (
                                 <Button variant="ghost" size="icon" title="Marcar como Concluída" onClick={() => handleMarkAsComplete(action.id)}>
                                    <CheckCircle className="h-4 w-4 text-green-600"/>
                                 </Button>
                             )}
                            <Button variant="ghost" size="icon" onClick={() => handleOpenPreventiveForm(action)} title="Editar"><Edit className="h-4 w-4" /></Button>
                             <AlertDialog>
                              <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" title="Excluir"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                   <AlertDialogHeader>
                                       <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                                       <AlertDialogDescription>
                                           Excluir a ação preventiva: "{action.description}"?
                                       </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                       <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                       <AlertDialogAction onClick={() => handlePreventiveDelete(action.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Excluir</AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      )) : (
                        <TableRow><TableCell colSpan={7} className="h-24 text-center">Nenhuma ação preventiva encontrada.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
            </CardContent>
         </Card>
      </section>
    </div>
  );
}

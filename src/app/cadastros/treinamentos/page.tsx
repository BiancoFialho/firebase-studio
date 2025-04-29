// src/app/cadastros/treinamentos/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Edit, Trash2, Loader2, GraduationCap } from 'lucide-react'; // Added GraduationCap
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
import { TrainingType as PrismaTrainingType } from '@prisma/client';
import { getTrainingTypes, createTrainingType, updateTrainingType, deleteTrainingType } from '@/app/trainings/actions';
import { cn } from '@/lib/utils';

type TrainingType = PrismaTrainingType;

export default function TrainingTypesPage() {
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingType, setEditingType] = useState<TrainingType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [defaultDuration, setDefaultDuration] = useState<number | undefined>(undefined);
  const [defaultLocation, setDefaultLocation] = useState('');
  const [defaultCost, setDefaultCost] = useState<number | undefined>(undefined);
  const [instructorsJson, setInstructorsJson] = useState(''); // Store as string
  const [requiredNrsJson, setRequiredNrsJson] = useState(''); // Added state for NRs
  const [validityMonths, setValidityMonths] = useState<number | undefined>(undefined); // Added state for validity

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedTypes = await getTrainingTypes();
      setTrainingTypes(fetchedTypes);
    } catch (error) {
      console.error("Error fetching training types:", error);
      toast({ title: "Erro", description: "Não foi possível buscar os tipos de treinamento.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [getTrainingTypes, toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTrainingTypes = useMemo(() => trainingTypes.filter((type) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return type.name.toLowerCase().includes(lowerSearchTerm) || (type.description?.toLowerCase() ?? '').includes(lowerSearchTerm);
  }), [trainingTypes, searchTerm]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setDefaultDuration(undefined);
    setDefaultLocation('');
    setDefaultCost(undefined);
    setInstructorsJson('');
    setRequiredNrsJson(''); // Reset NRs
    setValidityMonths(undefined); // Reset validity
    setEditingType(null);
  };

  const handleOpenForm = (type: TrainingType | null = null) => {
    if (type) {
      setEditingType(type);
      setName(type.name);
      setDescription(type.description || '');
      setDefaultDuration(type.defaultDuration || undefined);
      setDefaultLocation(type.defaultLocation || '');
      setDefaultCost(type.defaultCost || undefined);
      setValidityMonths(type.validityMonths || undefined);
      // Safely parse and format JSON strings for display
      try {
        const instructors = type.instructorsJson ? JSON.parse(type.instructorsJson) : [];
        setInstructorsJson(instructors.join(', '));
      } catch { setInstructorsJson(''); }
      try {
        const nrs = type.requiredNrsJson ? JSON.parse(type.requiredNrsJson) : [];
        setRequiredNrsJson(nrs.join(', '));
      } catch { setRequiredNrsJson(''); }

    } else {
      resetForm();
    } 
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  // Helper to convert comma-separated string to JSON array string
  const convertToJsonArrayString = (inputString: string): string | null => {
    if (!inputString.trim()) return null;
    try {
      const array = inputString.split(',').map(s => s.trim()).filter(s => s);
      return JSON.stringify(array);
    } catch (e) {
      return null; // Indicate error if conversion fails
    }
  };


  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!name) {
      toast({ title: "Erro", description: "O nome do treinamento é obrigatório.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);
  
    const instructorsData = convertToJsonArrayString(instructorsJson);
    const nrsData = convertToJsonArrayString(requiredNrsJson);

    if (instructorsJson.trim() && instructorsData === null) {
      toast({ title: "Erro de Formato", description: "Formato inválido para instrutores (use vírgula para separar).", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (requiredNrsJson.trim() && nrsData === null) {
      toast({ title: "Erro de Formato", description: "Formato inválido para NRs (use vírgula para separar).", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const typeData = {
      name,
      description: description || null,
      validityMonths: validityMonths || null,
      requiredNrsJson: nrsData,
      defaultDuration: defaultDuration || null,
      defaultLocation: defaultLocation || null,
      defaultCost: defaultCost || null,
      instructorsJson: instructorsData, // Use converted JSON string
    };

    try {
      if (editingType) {
        await updateTrainingType(editingType.id, typeData);
        toast({ title: "Sucesso", description: "Tipo de treinamento atualizado." });
      } else {

        await createTrainingType(typeData as PrismaTrainingType); // Cast might be needed if optional fields aren't handled perfectly by Prisma types
        toast({ title: "Sucesso", description: "Novo tipo de treinamento criado." });
      }
      handleCloseForm();
      fetchData(); // Re-fetch data
    } catch (error: any) {
      console.error("Error saving training type:", error);
      toast({ title: "Erro", description: error.message || "Falha ao salvar o tipo de treinamento.", variant: "destructive" })
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteTrainingType(id);
      toast({ title: "Sucesso", description: "Tipo de treinamento excluído.", variant: "destructive" });
      fetchData(); // Re-fetch data after deletion
    } catch (error: any) {
      toast({ title: "Erro", description: error.message || "Falha ao excluir o tipo de treinamento.", variant: "destructive" })
    } finally {
      setIsDeleting(null);
    }
  };

  // Helper to display JSON array string safely
  const displayJsonArray = (jsonString: string | null | undefined): string => {        
    if (!jsonString) return '-';
    try {
      const array = JSON.parse(jsonString);
      return Array.isArray(array) ? array.join(', ') : '-';
    } catch {
      return 'Erro no formato';
    }
  };


  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div className="flex items-center gap-2">
           <GraduationCap className="w-8 h-8 text-primary" />
           <h1 className="text-3xl font-bold tracking-tight">Cadastro de Tipos de Treinamento</h1>
         </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} disabled={isLoading || isSubmitting} className="gap-2">
              <PlusCircle className="h-4 w-4" /> Adicionar Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>{editingType ? 'Editar Tipo de Treinamento' : 'Adicionar Novo Tipo de Treinamento'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="name">Nome*</Label>
                    <Input id="name" value={name} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} required disabled={isSubmitting} />
                  </div>
                  {/* Description */}
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="description">Descrição</Label>
                    <Textarea id="description" value={description} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} rows={3} disabled={isSubmitting} />
                  </div>
                  {/* Validity Months */}
                  <div className="space-y-1">
                    <Label htmlFor="validityMonths">Validade (meses)</Label>
                    <Input id="validityMonths" type="number" min="0" value={validityMonths ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setValidityMonths(e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional (ex: 12)" disabled={isSubmitting} />
                  </div>
                  {/* Default Duration */}
                  <div className="space-y-1">
                    <Label htmlFor="defaultDuration">Carga Horária Padrão (h)</Label>
                    <Input id="defaultDuration" type="number" min="0" value={defaultDuration ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setDefaultDuration(e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional (ex: 8)" disabled={isSubmitting} />
                  </div>
                  {/* Required NRs */}
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="requiredNrsJson">NRs Obrigatórias (separadas por vírgula)</Label>
                    <Input id="requiredNrsJson" value={requiredNrsJson} onChange={(e: ChangeEvent<HTMLInputElement>) => setRequiredNrsJson(e.target.value)} placeholder="Ex: NR-35, NR-10" disabled={isSubmitting} />
                  </div>
                  {/* Default Location */}
                  <div className="space-y-1">
                    <Label htmlFor="defaultLocation">Local Padrão</Label>
                    <Input id="defaultLocation" value={defaultLocation} onChange={(e: ChangeEvent<HTMLInputElement>) => setDefaultLocation(e.target.value)} placeholder="Opcional (ex: Online)" disabled={isSubmitting} />
                  </div>
                  {/* Default Cost */}
                  <div className="space-y-1">
                    <Label htmlFor="defaultCost">Custo Padrão (R$)</Label>
                    <Input id="defaultCost" type="number" min="0" step="0.01" value={defaultCost ?? ''} onChange={(e: ChangeEvent<HTMLInputElement>) => setDefaultCost(e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional (ex: 150.00)" disabled={isSubmitting} />
                  </div>
                  {/* Instructors */}
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="instructorsJson">Instrutores Padrão (separados por vírgula)</Label>
                    <Input id="instructorsJson" value={instructorsJson} onChange={(e: ChangeEvent<HTMLInputElement>) => setInstructorsJson(e.target.value)} placeholder="Ex: João Silva, Empresa XYZ" disabled={isSubmitting} />
                  </div>
                </div>
              <DialogFooter className="mt-4">
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>) : editingType ? 'Salvar Alterações' : 'Adicionar Tipo'}
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
          placeholder="Buscar por nome ou descrição..."
          className="pl-8 w-full sm:w-1/2 md:w-1/3 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          value={searchTerm}
          onChange={handleSearch}
          disabled={isLoading}          
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Tipos de treinamento cadastrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Validade (meses)</TableHead>
              <TableHead>Carga Horária (h)</TableHead>
              <TableHead>NRs Obrigatórias</TableHead>
              <TableHead>Instrutores Padrão</TableHead>
              {/* <TableHead>Descrição</TableHead> */}
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
            ) : filteredTrainingTypes.length > 0 ? (
              filteredTrainingTypes.map((type) => (
                <TableRow key={type.id} className={isDeleting === type.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium max-w-[150px] truncate">{type.name}</TableCell>
                  <TableCell>{type.validityMonths ?? '-'}</TableCell>
                  <TableCell>{type.defaultDuration ?? '-'}</TableCell>
                  <TableCell className="max-w-[150px] truncate" title={displayJsonArray(type.requiredNrsJson)}>                    
                    {displayJsonArray(type.requiredNrsJson)}                    
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate" title={displayJsonArray(type.instructorsJson)}>                    
                    {displayJsonArray(type.instructorsJson)}
                  </TableCell>                  
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(type)} disabled={isSubmitting || !!isDeleting} aria-label="Editar">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className={cn("text-destructive hover:text-destructive hover:bg-destructive/10", isDeleting === type.id ? "cursor-wait" : "")} disabled={isSubmitting || !!isDeleting} aria-label="Excluir">
                          {isDeleting === type.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}                          
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o tipo de treinamento <span className="font-medium">{type.name}</span>. Certifique-se que nenhum registro de treinamento está usando este tipo.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={!!isDeleting}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(type.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={!!isDeleting}>
                            {isDeleting === type.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isDeleting === type.id ? 'Excluindo...' : 'Excluir'}
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
                  Nenhum tipo de treinamento encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

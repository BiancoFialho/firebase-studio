// src/app/trainings/types/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { PlusCircle, Search, Edit, Trash2, Loader2 } from 'lucide-react';
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
import type { TrainingType as PrismaTrainingType } from '@prisma/client';
import { getTrainingTypes, createTrainingType, updateTrainingType, deleteTrainingType } from '../actions'; // Use actions from parent folder

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
  }, [toast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredTrainingTypes = useMemo(() => trainingTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (type.description?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  ), [trainingTypes, searchTerm]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setDefaultDuration(undefined);
    setDefaultLocation('');
    setDefaultCost(undefined);
    setInstructorsJson('');
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
      // Safely parse and format instructors JSON for display
      try {
        const instructors = type.instructorsJson ? JSON.parse(type.instructorsJson) : [];
        setInstructorsJson(instructors.join(', ')); // Display as comma-separated string
      } catch {
        setInstructorsJson(''); // Handle potential JSON parse error
      }
    } else {
      resetForm();
    }
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    resetForm();
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name) {
      toast({ title: "Erro", description: "O nome do treinamento é obrigatório.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    let instructorsData: string | undefined;
    if (instructorsJson.trim()) {
        try {
            // Convert comma-separated string back to JSON array
            const instructorsArray = instructorsJson.split(',').map(s => s.trim()).filter(s => s);
            instructorsData = JSON.stringify(instructorsArray);
        } catch (e) {
            toast({ title: "Erro", description: "Formato inválido para instrutores (use vírgula para separar).", variant: "destructive" });
            setIsSubmitting(false);
            return;
        }
    }


    const typeData = {
      name,
      description: description || null,
      defaultDuration: defaultDuration || null,
      defaultLocation: defaultLocation || null,
      defaultCost: defaultCost || null,
      instructorsJson: instructorsData || null,
    };

    try {
      if (editingType) {
        await updateTrainingType(editingType.id, typeData);
        toast({ title: "Sucesso", description: "Tipo de treinamento atualizado." });
      } else {
        await createTrainingType(typeData);
        toast({ title: "Sucesso", description: "Novo tipo de treinamento criado." });
      }
      handleCloseForm();
      fetchData(); // Re-fetch data
    } catch (error: any) {
      console.error("Error saving training type:", error);
      toast({ title: "Erro", description: error.message || "Falha ao salvar o tipo de treinamento.", variant: "destructive" });
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
      console.error("Error deleting training type:", error);
      toast({ title: "Erro", description: error.message || "Falha ao excluir o tipo de treinamento.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  // Helper to display instructors safely
  const displayInstructors = (jsonString: string | null | undefined): string => {
        if (!jsonString) return '-';
        try {
            const instructors = JSON.parse(jsonString);
            return Array.isArray(instructors) ? instructors.join(', ') : '-';
        } catch {
            return 'Erro no formato';
        }
    };


  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciar Tipos de Treinamento</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} disabled={isLoading || isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Tipo
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-2xl" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>{editingType ? 'Editar Tipo de Treinamento' : 'Adicionar Novo Tipo de Treinamento'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome*</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required disabled={isSubmitting} />
              </div>
              {/* Description */}
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="description" className="text-right pt-2">Descrição</Label>
                <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" rows={3} disabled={isSubmitting} />
              </div>
               {/* Default Duration */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="defaultDuration" className="text-right">Carga Horária (h)</Label>
                <Input id="defaultDuration" type="number" min="0" value={defaultDuration ?? ''} onChange={(e) => setDefaultDuration(e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional" className="col-span-3" disabled={isSubmitting} />
              </div>
               {/* Default Location */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="defaultLocation" className="text-right">Local Padrão</Label>
                <Input id="defaultLocation" value={defaultLocation} onChange={(e) => setDefaultLocation(e.target.value)} placeholder="Opcional" className="col-span-3" disabled={isSubmitting} />
              </div>
              {/* Default Cost */}
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="defaultCost" className="text-right">Custo Padrão (R$)</Label>
                 <Input id="defaultCost" type="number" min="0" step="0.01" value={defaultCost ?? ''} onChange={(e) => setDefaultCost(e.target.value ? Number(e.target.value) : undefined)} placeholder="Opcional" className="col-span-3" disabled={isSubmitting} />
               </div>
               {/* Instructors */}
               <div className="grid grid-cols-4 items-center gap-4">
                 <Label htmlFor="instructorsJson" className="text-right">Instrutores</Label>
                 <Input id="instructorsJson" value={instructorsJson} onChange={(e) => setInstructorsJson(e.target.value)} placeholder="Nome A, Nome B (separado por vírgula)" className="col-span-3" disabled={isSubmitting} />
               </div>

              <DialogFooter>
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
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
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
              <TableHead>Carga Horária (h)</TableHead>
              <TableHead>Instrutores</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                  Carregando...
                </TableCell>
              </TableRow>
            ) : filteredTrainingTypes.length > 0 ? (
              filteredTrainingTypes.map((type) => (
                <TableRow key={type.id} className={isDeleting === type.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>{type.defaultDuration ?? '-'}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={displayInstructors(type.instructorsJson)}>
                      {displayInstructors(type.instructorsJson)}
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={type.description ?? ''}>{type.description ?? '-'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(type)} disabled={isSubmitting || !!isDeleting}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isSubmitting || !!isDeleting}>
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
                <TableCell colSpan={5} className="h-24 text-center">
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

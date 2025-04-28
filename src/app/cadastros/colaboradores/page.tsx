// src/app/cadastros/colaboradores/page.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, Loader2, Users } from 'lucide-react';
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
import { Prisma, Employee as PrismaEmployee } from '@prisma/client';
import { format } from 'date-fns';
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from './actions'; // Import server actions

type Employee = PrismaEmployee;

export default function ColaboradoresPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  // Form state
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [position, setPosition] = useState('');
  const [hireDate, setHireDate] = useState<Date | undefined>(undefined);

  // --- Data Fetching ---
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedEmployees = await getEmployees();
      setEmployees(fetchedEmployees);
    } catch (error) {
      console.error("Error fetching employees:", error);
      toast({ title: "Erro", description: "Não foi possível buscar os colaboradores.", variant: "destructive" });
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

  const filteredEmployees = useMemo(() => employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (employee.department?.toLowerCase() ?? '').includes(searchTerm.toLowerCase()) ||
    (employee.position?.toLowerCase() ?? '').includes(searchTerm.toLowerCase())
  ), [employees, searchTerm]);

  const resetForm = () => {
    setName('');
    setDepartment('');
    setPosition('');
    setHireDate(undefined);
    setEditingEmployee(null);
  };

  const handleOpenForm = (employee: Employee | null = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setName(employee.name);
      setDepartment(employee.department || '');
      setPosition(employee.position || '');
      setHireDate(employee.hireDate ? new Date(employee.hireDate) : undefined);
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
      toast({ title: "Erro", description: "O nome do colaborador é obrigatório.", variant: "destructive" });
      return;
    }
    setIsSubmitting(true);

    const employeeData = {
      name,
      department: department || null,
      position: position || null,
      hireDate: hireDate || null,
    };

    try {
      if (editingEmployee) {
        await updateEmployee(editingEmployee.id, employeeData);
        toast({ title: "Sucesso", description: "Colaborador atualizado." });
      } else {
        await createEmployee(employeeData);
        toast({ title: "Sucesso", description: "Novo colaborador adicionado." });
      }
      handleCloseForm();
      fetchData(); // Re-fetch data
    } catch (error: any) {
      console.error("Error saving employee:", error);
      toast({ title: "Erro", description: error.message || "Falha ao salvar o colaborador.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(id);
    try {
      await deleteEmployee(id);
      toast({ title: "Sucesso", description: "Colaborador excluído.", variant: "destructive" });
      fetchData(); // Re-fetch data after deletion
    } catch (error: any) {
      console.error("Error deleting employee:", error);
      toast({ title: "Erro", description: error.message || "Falha ao excluir o colaborador. Verifique se ele possui registros vinculados.", variant: "destructive" });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Cadastro de Colaboradores</h1>
        </div>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()} disabled={isLoading || isSubmitting}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Colaborador
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>{editingEmployee ? 'Editar Colaborador' : 'Adicionar Novo Colaborador'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nome*</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required disabled={isSubmitting} />
              </div>
              {/* Department */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="department" className="text-right">Departamento</Label>
                <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} className="col-span-3" disabled={isSubmitting} />
              </div>
              {/* Position */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="position" className="text-right">Cargo</Label>
                <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} className="col-span-3" disabled={isSubmitting} />
              </div>
              {/* Hire Date */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="hireDate" className="text-right">Data Admissão</Label>
                <DatePicker date={hireDate} setDate={setHireDate} className="col-span-3" disabled={isSubmitting} />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isSubmitting}>Cancelar</Button>
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Salvando...</>) : editingEmployee ? 'Salvar Alterações' : 'Adicionar'}
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
          placeholder="Buscar por nome, departamento ou cargo..."
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
          value={searchTerm}
          onChange={handleSearch}
          disabled={isLoading}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Lista de colaboradores cadastrados.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead>Data Admissão</TableHead>
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
            ) : filteredEmployees.length > 0 ? (
              filteredEmployees.map((employee) => (
                <TableRow key={employee.id} className={isDeleting === employee.id ? 'opacity-50' : ''}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.department ?? '-'}</TableCell>
                  <TableCell>{employee.position ?? '-'}</TableCell>
                  <TableCell>{employee.hireDate ? format(new Date(employee.hireDate), 'dd/MM/yyyy') : '-'}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon" onClick={() => handleOpenForm(employee)} disabled={isSubmitting || !!isDeleting}>
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" disabled={isSubmitting || !!isDeleting}>
                          {isDeleting === employee.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o colaborador <span className="font-medium">{employee.name}</span>. Certifique-se que ele não possui registros vinculados (treinamentos, EPIs, etc.).
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={!!isDeleting}>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(employee.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90" disabled={!!isDeleting}>
                            {isDeleting === employee.id ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isDeleting === employee.id ? 'Excluindo...' : 'Excluir'}
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
                  Nenhum colaborador encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

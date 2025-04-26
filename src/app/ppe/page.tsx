'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, History } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge"; // Import Badge component

// Mock data structure
interface PpeRecord {
  id: string;
  employeeName: string;
  ppeType: string;
  deliveryDate: Date;
  caNumber?: string; // Certificado de Aprovação
  quantity: number;
  returnDate?: Date;
  status: 'Em uso' | 'Devolvido' | 'Descartado'; // Add status
}

const mockPpeRecords: PpeRecord[] = [
  { id: 'ppe1', employeeName: 'João Silva', ppeType: 'Capacete de Segurança', deliveryDate: new Date(2023, 4, 10), caNumber: '12345', quantity: 1, status: 'Em uso' },
  { id: 'ppe2', employeeName: 'Maria Oliveira', ppeType: 'Luvas de Proteção', deliveryDate: new Date(2023, 6, 22), caNumber: '67890', quantity: 2, status: 'Em uso' },
  { id: 'ppe3', employeeName: 'Carlos Pereira', ppeType: 'Óculos de Proteção', deliveryDate: new Date(2023, 1, 5), caNumber: '11223', quantity: 1, returnDate: new Date(2024, 1, 5), status: 'Devolvido' },
  { id: 'ppe4', employeeName: 'João Silva', ppeType: 'Protetor Auricular', deliveryDate: new Date(2024, 0, 15), caNumber: '33445', quantity: 1, status: 'Em uso' },
  { id: 'ppe5', employeeName: 'Ana Costa', ppeType: 'Botas de Segurança', deliveryDate: new Date(2023, 11, 1), caNumber: '55667', quantity: 1, status: 'Em uso' },
];

export default function PpePage() {
  const [ppeRecords, setPpeRecords] = useState<PpeRecord[]>(mockPpeRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PpeRecord | null>(null);
  const { toast } = useToast();

  // Form state
  const [employeeName, setEmployeeName] = useState('');
  const [ppeType, setPpeType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<Date | undefined>(undefined);
  const [caNumber, setCaNumber] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [returnDate, setReturnDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<PpeRecord['status']>('Em uso');

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredPpeRecords = ppeRecords.filter((record) =>
    record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.ppeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.caNumber && record.caNumber.includes(searchTerm))
  );

  const resetForm = () => {
    setEmployeeName('');
    setPpeType('');
    setDeliveryDate(undefined);
    setCaNumber('');
    setQuantity(1);
    setReturnDate(undefined);
    setStatus('Em uso');
    setEditingRecord(null);
  };

   const handleOpenForm = (record: PpeRecord | null = null) => {
       if (record) {
           setEditingRecord(record);
           setEmployeeName(record.employeeName);
           setPpeType(record.ppeType);
           setDeliveryDate(record.deliveryDate);
           setCaNumber(record.caNumber || '');
           setQuantity(record.quantity);
           setReturnDate(record.returnDate);
           setStatus(record.status);
       } else {
           resetForm();
           setDeliveryDate(new Date()); // Default delivery date to today for new records
       }
       setIsFormOpen(true);
   };

   const handleCloseForm = () => {
       setIsFormOpen(false);
       resetForm();
   };


  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!employeeName || !ppeType || !deliveryDate || quantity <= 0) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios e verifique a quantidade.",
        variant: "destructive",
      });
      return;
    }

    const newRecord: PpeRecord = {
      id: editingRecord ? editingRecord.id : `ppe${Date.now()}`, // Simple ID generation
      employeeName,
      ppeType,
      deliveryDate,
      caNumber: caNumber || undefined,
      quantity,
      returnDate,
      status,
    };

    if (editingRecord) {
      setPpeRecords(ppeRecords.map(r => r.id === editingRecord.id ? newRecord : r));
       toast({
           title: "Sucesso",
           description: "Registro de EPI atualizado com sucesso.",
       });
    } else {
      setPpeRecords([newRecord, ...ppeRecords]);
       toast({
           title: "Sucesso",
           description: "Registro de EPI adicionado com sucesso.",
       });
    }

    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setPpeRecords(ppeRecords.filter(r => r.id !== id));
    toast({
        title: "Sucesso",
        description: "Registro de EPI excluído com sucesso.",
        variant: "destructive"
    });
  };

   const getStatusBadgeVariant = (status: PpeRecord['status']): "default" | "secondary" | "outline" | "destructive" => {
     switch (status) {
       case 'Em uso':
         return 'default'; // Use primary color for active
       case 'Devolvido':
         return 'secondary'; // Use secondary color
       case 'Descartado':
         return 'outline'; // Use outline or maybe destructive if it's a warning
       default:
         return 'secondary';
     }
   };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de EPIs</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button onClick={() => handleOpenForm()}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Registrar Entrega/Devolução
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>{editingRecord ? 'Editar Registro de EPI' : 'Registrar EPI'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="employeeName" className="text-right">
                            Colaborador
                        </Label>
                        <Input id="employeeName" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className="col-span-3" required />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="ppeType" className="text-right">
                            Tipo de EPI
                        </Label>
                        <Select value={ppeType} onValueChange={setPpeType}>
                             <SelectTrigger id="ppeType" className="col-span-3">
                                 <SelectValue placeholder="Selecione o EPI" />
                             </SelectTrigger>
                             <SelectContent>
                                 <SelectItem value="Capacete de Segurança">Capacete de Segurança</SelectItem>
                                 <SelectItem value="Luvas de Proteção">Luvas de Proteção</SelectItem>
                                 <SelectItem value="Óculos de Proteção">Óculos de Proteção</SelectItem>
                                 <SelectItem value="Protetor Auricular">Protetor Auricular</SelectItem>
                                 <SelectItem value="Botas de Segurança">Botas de Segurança</SelectItem>
                                 <SelectItem value="Máscara Respiratória">Máscara Respiratória</SelectItem>
                                 <SelectItem value="Cinto de Segurança (NR-35)">Cinto de Segurança (NR-35)</SelectItem>
                                 <SelectItem value="Outro">Outro</SelectItem>
                             </SelectContent>
                         </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="caNumber" className="text-right">
                            C.A.
                        </Label>
                        <Input id="caNumber" value={caNumber} onChange={(e) => setCaNumber(e.target.value)} className="col-span-3" placeholder="Opcional" />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="quantity" className="text-right">
                             Quantidade
                         </Label>
                         <Input id="quantity" type="number" min="1" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value, 10) || 1)} className="col-span-3" required />
                     </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="deliveryDate" className="text-right">
                            Data Entrega
                        </Label>
                        <DatePicker date={deliveryDate} setDate={setDeliveryDate} className="col-span-3" required />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="returnDate" className="text-right">
                             Data Devolução
                         </Label>
                         <DatePicker date={returnDate} setDate={setReturnDate} className="col-span-3" />
                     </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                         <Label htmlFor="status" className="text-right">
                             Status
                         </Label>
                         <Select value={status} onValueChange={(value: PpeRecord['status']) => setStatus(value)}>
                              <SelectTrigger id="status" className="col-span-3">
                                  <SelectValue placeholder="Selecione o status" />
                              </SelectTrigger>
                              <SelectContent>
                                  <SelectItem value="Em uso">Em uso</SelectItem>
                                  <SelectItem value="Devolvido">Devolvido</SelectItem>
                                  <SelectItem value="Descartado">Descartado</SelectItem>
                              </SelectContent>
                          </Select>
                      </div>
                    <DialogFooter>
                         <DialogClose asChild>
                             <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
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
          placeholder="Buscar por colaborador, EPI ou C.A...."
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Registros de entrega e devolução de EPIs.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Colaborador</TableHead>
              <TableHead>Tipo de EPI</TableHead>
              <TableHead>C.A.</TableHead>
              <TableHead>Qtd.</TableHead>
              <TableHead>Data Entrega</TableHead>
              <TableHead>Data Devolução</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPpeRecords.length > 0 ? (
              filteredPpeRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.employeeName}</TableCell>
                  <TableCell>{record.ppeType}</TableCell>
                  <TableCell>{record.caNumber || 'N/A'}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.deliveryDate.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell>{record.returnDate ? record.returnDate.toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell>
                     <Badge variant={getStatusBadgeVariant(record.status)}>{record.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                     {/* Add History Button if needed */}
                     {/* <Button variant="ghost" size="icon" title="Ver Histórico (Em breve)">
                         <History className="h-4 w-4 text-muted-foreground" />
                         <span className="sr-only">Histórico</span>
                     </Button> */}
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
                                    Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro de EPI para <span className="font-medium">{record.employeeName}</span> ({record.ppeType}).
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
                <TableCell colSpan={8} className="h-24 text-center">
                  Nenhum registro de EPI encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

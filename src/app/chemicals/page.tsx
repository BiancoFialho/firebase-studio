// src/app/chemicals/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/date-picker';
import { PlusCircle, Search, Edit, Trash2, FileText, Eye } from 'lucide-react';
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
import { Badge } from "@/components/ui/badge"; // Optional for status/tags

// Data structure for Chemical Inventory
interface ChemicalRecord {
  id: string;
  productName: string;
  casNumber?: string; // Chemical Abstracts Service number
  location: string; // Storage location
  quantity: number;
  unit: 'kg' | 'L' | 'g' | 'mL' | 'unid.'; // Example units
  sdsUrl?: string; // Safety Data Sheet URL
  lastUpdated: Date;
}

// Mock data for Chemical Inventory
const mockChemicalRecords: ChemicalRecord[] = [
  { id: 'chem1', productName: 'Álcool Isopropílico', casNumber: '67-63-0', location: 'Almoxarifado A', quantity: 5, unit: 'L', sdsUrl: 'https://example.com/sds/alcool-isopropilico', lastUpdated: new Date(2024, 6, 1) },
  { id: 'chem2', productName: 'Tinta Spray Branca', location: 'Oficina B', quantity: 12, unit: 'unid.', lastUpdated: new Date(2024, 5, 20) },
  { id: 'chem3', productName: 'Óleo Lubrificante WD-40', location: 'Manutenção', quantity: 3, unit: 'unid.', sdsUrl: 'https://example.com/sds/wd40', lastUpdated: new Date(2024, 6, 10) },
  { id: 'chem4', productName: 'Acetona Pura', casNumber: '67-64-1', location: 'Laboratório', quantity: 1, unit: 'L', lastUpdated: new Date(2024, 4, 15) },
];

export default function ChemicalsPage() {
  const [chemicalRecords, setChemicalRecords] = useState<ChemicalRecord[]>(mockChemicalRecords);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ChemicalRecord | null>(null);
  const { toast } = useToast();

  // Form state
  const [productName, setProductName] = useState('');
  const [casNumber, setCasNumber] = useState('');
  const [location, setLocation] = useState('');
  const [quantity, setQuantity] = useState<number>(0);
  const [unit, setUnit] = useState<ChemicalRecord['unit'] | ''>('');
  const [sdsUrl, setSdsUrl] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | undefined>(new Date()); // Default to today

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredChemicalRecords = chemicalRecords.filter((record) =>
    record.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (record.casNumber && record.casNumber.includes(searchTerm)) ||
    record.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setProductName('');
    setCasNumber('');
    setLocation('');
    setQuantity(0);
    setUnit('');
    setSdsUrl('');
    setLastUpdated(new Date());
    setEditingRecord(null);
  };

  const handleOpenForm = (record: ChemicalRecord | null = null) => {
    if (record) {
      setEditingRecord(record);
      setProductName(record.productName);
      setCasNumber(record.casNumber || '');
      setLocation(record.location);
      setQuantity(record.quantity);
      setUnit(record.unit);
      setSdsUrl(record.sdsUrl || '');
      setLastUpdated(record.lastUpdated);
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
    if (!productName || !location || quantity <= 0 || !unit || !lastUpdated) {
      toast({
        title: "Erro",
        description: "Preencha os campos obrigatórios: Produto, Localização, Quantidade (>0), Unidade e Data.",
        variant: "destructive",
      });
      return;
    }

    const newRecord: ChemicalRecord = {
      id: editingRecord ? editingRecord.id : `chem${Date.now()}`,
      productName,
      casNumber: casNumber || undefined,
      location,
      quantity,
      unit,
      sdsUrl: sdsUrl || undefined,
      lastUpdated,
    };

    if (editingRecord) {
      setChemicalRecords(chemicalRecords.map(r => r.id === editingRecord.id ? newRecord : r));
      toast({
        title: "Sucesso",
        description: "Registro químico atualizado.",
      });
    } else {
      setChemicalRecords([newRecord, ...chemicalRecords]);
      toast({
        title: "Sucesso",
        description: "Novo produto químico adicionado.",
      });
    }

    handleCloseForm();
  };

  const handleDelete = (id: string) => {
    setChemicalRecords(chemicalRecords.filter(r => r.id !== id));
    toast({
      title: "Sucesso",
      description: "Registro químico excluído.",
      variant: "destructive"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Inventário Químico</h1>
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpenForm()}>
              <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg" onInteractOutside={(e) => e.preventDefault()}>
            <DialogHeader>
              <DialogTitle>{editingRecord ? 'Editar Produto Químico' : 'Adicionar Novo Produto Químico'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              {/* Product Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="productName" className="text-right">
                  Produto*
                </Label>
                <Input id="productName" value={productName} onChange={(e) => setProductName(e.target.value)} className="col-span-3" required />
              </div>
              {/* CAS Number */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="casNumber" className="text-right">
                  CAS nº
                </Label>
                <Input id="casNumber" value={casNumber} onChange={(e) => setCasNumber(e.target.value)} className="col-span-3" placeholder="Opcional" />
              </div>
              {/* Location */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="location" className="text-right">
                  Localização*
                </Label>
                <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="col-span-3" required />
              </div>
              {/* Quantity */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="quantity" className="text-right">
                  Quantidade*
                </Label>
                <Input id="quantity" type="number" min="0" step="any" value={quantity} onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)} className="col-span-3" required />
              </div>
              {/* Unit */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="unit" className="text-right">
                  Unidade*
                </Label>
                <select id="unit" value={unit} onChange={(e) => setUnit(e.target.value as ChemicalRecord['unit'])} className="col-span-3 flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" required>
                  <option value="" disabled>Selecione</option>
                  <option value="kg">kg</option>
                  <option value="L">L</option>
                  <option value="g">g</option>
                  <option value="mL">mL</option>
                  <option value="unid.">unid.</option>
                </select>
              </div>
              {/* SDS URL */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="sdsUrl" className="text-right">
                  Link FISPQ
                </Label>
                <Input id="sdsUrl" type="url" value={sdsUrl} onChange={(e) => setSdsUrl(e.target.value)} className="col-span-3" placeholder="http://example.com/sds" />
              </div>
              {/* Last Updated */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="lastUpdated" className="text-right">
                  Últ. Atualização*
                </Label>
                <DatePicker date={lastUpdated} setDate={setLastUpdated} className="col-span-3" required />
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline" onClick={handleCloseForm}>Cancelar</Button>
                </DialogClose>
                <Button type="submit">{editingRecord ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Buscar por produto, CAS ou localização..."
          className="pl-8 w-full sm:w-1/2 md:w-1/3"
          value={searchTerm}
          onChange={handleSearch}
        />
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableCaption>Inventário de produtos químicos.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Produto Químico</TableHead>
              <TableHead>Nº CAS</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Unidade</TableHead>
              <TableHead>Últ. Atualização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChemicalRecords.length > 0 ? (
              filteredChemicalRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.productName}</TableCell>
                  <TableCell>{record.casNumber || '-'}</TableCell>
                  <TableCell>{record.location}</TableCell>
                  <TableCell>{record.quantity}</TableCell>
                  <TableCell>{record.unit}</TableCell>
                  <TableCell>{record.lastUpdated.toLocaleDateString('pt-BR')}</TableCell>
                  <TableCell className="text-right space-x-1">
                    {record.sdsUrl ? (
                      <Button variant="ghost" size="icon" asChild>
                        <a href={record.sdsUrl} target="_blank" rel="noopener noreferrer" title="Ver FISPQ">
                          <FileText className="h-4 w-4" />
                          <span className="sr-only">Ver FISPQ</span>
                        </a>
                      </Button>
                    ) : (
                       <Button variant="ghost" size="icon" disabled title="FISPQ não disponível">
                           <FileText className="h-4 w-4 text-muted-foreground/50" />
                           <span className="sr-only">FISPQ não disponível</span>
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
                            Essa ação não pode ser desfeita. Isso excluirá permanentemente o registro do produto químico <span className="font-medium">{record.productName}</span>.
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
                  Nenhum produto químico encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

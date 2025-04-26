// src/app/action-plan/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileCheck2 } from 'lucide-react'; // Use appropriate icon

// Mock Compliance Data (moved from old compliance page)
interface ComplianceItem {
    nr: string;
    description: string;
    status: 'Conforme' | 'Requer Atenção' | 'Não Conforme' | 'Não Aplicável';
    details: string;
    lastCheck?: Date;
    evidenceUrl?: string;
}

const complianceStatus: ComplianceItem[] = [
    { nr: 'NR-6', description: 'Equipamento de Proteção Individual - EPI', status: 'Conforme', details: 'Fichas de EPI atualizadas, CA válidos para EPIs em uso.', lastCheck: new Date(2024, 6, 1), evidenceUrl: '/docs/epi-check.pdf' },
    { nr: 'NR-7', description: 'Programa de Controle Médico de Saúde Ocupacional - PCMSO', status: 'Conforme', details: 'ASOs em dia, programa implementado e coordenado por médico responsável.', lastCheck: new Date(2024, 5, 20)},
    { nr: 'NR-9', description: 'Avaliação e Controle das Exposições Ocupacionais a Agentes Físicos, Químicos e Biológicos (PGR)', status: 'Requer Atenção', details: 'Revisão anual do PGR pendente (prazo: 30/08/2024). Inventário de Riscos atualizado.', lastCheck: new Date(2023, 8, 15) },
    { nr: 'NR-15', description: 'Atividades e Operações Insalubres', status: 'Conforme', details: 'Laudos de insalubridade (ruído, químicos) atualizados. Medidas de controle implementadas.', lastCheck: new Date(2024, 4, 10), evidenceUrl: '/docs/laudo-insalubridade.pdf' },
    { nr: 'NR-17', description: 'Ergonomia', status: 'Requer Atenção', details: 'Análise Ergonômica do Trabalho (AET) da linha de montagem desatualizada.', lastCheck: new Date(2023, 1, 5) },
    { nr: 'NR-35', description: 'Trabalho em Altura', status: 'Conforme', details: 'Treinamentos válidos, procedimentos de permissão de trabalho (PT) em uso, equipamentos inspecionados.', lastCheck: new Date(2024, 6, 5) },
];


export default function ActionPlanPage() {
   const getComplianceBadgeVariant = (status: ComplianceItem['status']): "default" | "secondary" | "destructive" | "outline" => {
       if (status === 'Conforme') return 'default'; // Green/Primary
       if (status === 'Requer Atenção') return 'secondary'; // Orange/Yellow
       if (status === 'Não Conforme') return 'destructive'; // Red
       return 'outline'; // Grey for Not Applicable
   };


  return (
    <div className="space-y-8">
      {/* Future: Add CIPA Actions or other Action Plan components here */}

      {/* NR Compliance Section */}
       <section>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <FileCheck2 className="w-6 h-6"/>
                        <CardTitle className="text-2xl">Conformidade com NRs</CardTitle>
                    </div>
                    <CardDescription>Status de conformidade com Normas Regulamentadoras selecionadas.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="border rounded-lg overflow-hidden">
                         <Table>
                             <TableHeader>
                                 <TableRow>
                                     <TableHead>NR</TableHead>
                                     <TableHead>Descrição</TableHead>
                                     <TableHead>Status</TableHead>
                                     <TableHead>Detalhes/Observações</TableHead>
                                     <TableHead>Última Verificação</TableHead>
                                     {/* <TableHead className="text-right">Ações</TableHead> */}
                                 </TableRow>
                             </TableHeader>
                             <TableBody>
                                 {complianceStatus.map((item) => (
                                     <TableRow key={item.nr}>
                                         <TableCell className="font-medium">{item.nr}</TableCell>
                                         <TableCell>{item.description}</TableCell>
                                         <TableCell>
                                             <Badge variant={getComplianceBadgeVariant(item.status)}>{item.status}</Badge>
                                         </TableCell>
                                         <TableCell className="max-w-xs truncate">{item.details}</TableCell>
                                         <TableCell>{item.lastCheck?.toLocaleDateString('pt-BR') || '-'}</TableCell>
                                         {/* <TableCell className="text-right">
                                            {item.evidenceUrl && <Button variant="outline" size="sm" asChild><a href={item.evidenceUrl} target="_blank">Ver Evidência</a></Button> }
                                             <Button variant="outline" size="sm" className="ml-2">Atualizar</Button> // Future functionality
                                         </TableCell> */}
                                     </TableRow>
                                 ))}
                                  <TableRow>
                                      <TableCell colSpan={5} className="text-center text-sm text-muted-foreground py-4">
                                          (Funcionalidade de gerenciamento detalhado de conformidade em desenvolvimento)
                                      </TableCell>
                                  </TableRow>
                             </TableBody>
                         </Table>
                     </div>
                </CardContent>
             </Card>
        </section>
    </div>
  );
}

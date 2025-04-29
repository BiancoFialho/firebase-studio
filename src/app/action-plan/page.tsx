// src/app/action-plan/page.tsx
'use client';

import React from 'react';
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
   const getComplianceBadgeVariant = (status: ComplianceItem['status']): "default" | "secondary" | "destructive" | "outline" | "success" => {
       if (status === 'Conforme') return 'default'; // Green/Primary
       if (status === 'Requer Atenção') return 'secondary'; // Orange/Yellow
       if (status === 'Não Conforme') return 'destructive'; // Red
       return 'outline'; // Grey for Not Applicable
   };


    return (
        <div className="container mx-auto p-6">
            <section className="mb-8">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-col space-y-2 items-start">
                        <div className="flex items-center gap-2">
                            <FileCheck2 className="w-6 h-6 text-primary" />
                            <CardTitle className="text-2xl font-semibold">Conformidade com NRs</CardTitle>
                        </div>
                        <CardDescription className="text-gray-500">
                            Status de conformidade com Normas Regulamentadoras selecionadas.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto w-full">
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow className="bg-gray-100">
                                        <TableHead className="text-left">NR</TableHead>
                                        <TableHead className="text-left">Descrição</TableHead>
                                        <TableHead className="text-left">Status</TableHead>
                                        <TableHead className="text-left">Detalhes/Observações</TableHead>
                                        <TableHead className="text-left">Última Verificação</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {complianceStatus.map((item) => (
                                        <TableRow key={item.nr} className="hover:bg-gray-50 transition-colors">
                                            <TableCell className="font-medium">{item.nr}</TableCell>
                                            <TableCell>{item.description}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getComplianceBadgeVariant(item.status)}
                                                    className="font-medium"
                                                >
                                                    {item.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">{item.details}</TableCell>
                                            <TableCell>
                                                {item.lastCheck?.toLocaleDateString('pt-BR') || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-4">
                                            <span className="text-sm text-gray-500">
                                                (Funcionalidade de gerenciamento detalhado de conformidade em desenvolvimento)
                                            </span>
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

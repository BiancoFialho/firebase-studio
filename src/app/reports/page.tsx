
// src/app/reports/page.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FileText, Download, Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const handleGenerateReport = async (reportType: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(
        `Gerando relatório: ${reportType} (Funcionalidade em desenvolvimento)`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center space-x-4 mb-6">
        <FileText className="w-10 h-10 text-primary" />
        <h1 className="text-3xl font-bold">Relatórios de SSMA</h1>
      </div>
      <p className="text-muted-foreground">
        Gere relatórios consolidados sobre os dados de Segurança, Saúde e Meio Ambiente.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Acidentes</CardTitle>
            <CardDescription>
              Resumo anual/mensal de acidentes, taxas e principais causas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleGenerateReport('Resumo de Acidentes')} disabled={isLoading} >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isLoading && <Download className="mr-2 h-4 w-4" />}
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Treinamentos</CardTitle>
            <CardDescription>Visão geral da conformidade de treinamentos por colaborador e status.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add filter options (e.g., training type, status) */}
            <Button onClick={() => handleGenerateReport('Conformidade de Treinamentos')} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isLoading && <Download className="mr-2 h-4 w-4" />}
               Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Relatório de EPIs</CardTitle>
            <CardDescription>
              Controle de EPIs entregues, devolvidos e em uso por colaborador.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => handleGenerateReport('Uso de EPIs')} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isLoading && <Download className="mr-2 h-4 w-4" />} Gerar Relatório
             </Button>
          </CardContent>
        </Card>

         {/* Report Card: ASO Status */}
         <Card>
           <CardHeader>
             <CardTitle>Relatório de ASOs</CardTitle>
             <CardDescription>Status dos Atestados de Saúde Ocupacional (válidos, vencidos, etc.).</CardDescription>
           </CardHeader>
           <CardContent>
              <Button onClick={() => handleGenerateReport('Status dos ASOs')} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {!isLoading && <Download className="mr-2 h-4 w-4" />} Gerar Relatório
              </Button>
           </CardContent>
         </Card>

        <Card className="md:col-span-2 lg:col-span-3 border-dashed border-muted-foreground/50">
          <CardHeader>
            <CardTitle className="text-muted-foreground">
              Mais Relatórios em Breve
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Funcionalidades de geração de relatórios customizados e
              exportação estão em desenvolvimento.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Planejamos incluir relatórios de conformidade NR, inventário
              JSA, resumo de ações preventivas, etc.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

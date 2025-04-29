
// src/app/reports/page.tsx
'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react'; // Or other relevant icons like BarChart3

export default function ReportsPage() {

  // Placeholder function for generating reports (replace with actual logic)
  const handleGenerateReport = (reportType: string) => {
    alert(`Gerando relatório: ${reportType} (Funcionalidade em desenvolvimento)`);
    // In a real app, this would trigger data fetching, processing, and possibly file download
    // Example: fetchReportData(reportType).then(data => generatePdf(data));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <FileText className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Relatórios de SSMA</h1>
      </div>
      <p className="text-muted-foreground">
        Gere relatórios consolidados sobre os dados de Segurança, Saúde e Meio Ambiente.
      </p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Report Card: Accident Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Acidentes</CardTitle>
            <CardDescription>Resumo anual/mensal de acidentes, taxas e principais causas.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add filter options here if needed (e.g., date range, department) */}
            <Button onClick={() => handleGenerateReport('Resumo de Acidentes')}>
              <Download className="mr-2 h-4 w-4" /> Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Report Card: Training Compliance */}
        <Card>
          <CardHeader>
            <CardTitle>Relatório de Treinamentos</CardTitle>
            <CardDescription>Visão geral da conformidade de treinamentos por colaborador e status.</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Add filter options (e.g., training type, status) */}
             <Button onClick={() => handleGenerateReport('Conformidade de Treinamentos')}>
              <Download className="mr-2 h-4 w-4" /> Gerar Relatório
            </Button>
          </CardContent>
        </Card>

        {/* Report Card: PPE Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Relatório de EPIs</CardTitle>
            <CardDescription>Controle de EPIs entregues, devolvidos e em uso por colaborador.</CardDescription>
          </CardHeader>
          <CardContent>
             {/* Add filter options */}
             <Button onClick={() => handleGenerateReport('Uso de EPIs')}>
               <Download className="mr-2 h-4 w-4" /> Gerar Relatório
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
              <Button onClick={() => handleGenerateReport('Status dos ASOs')}>
                <Download className="mr-2 h-4 w-4" /> Gerar Relatório
              </Button>
           </CardContent>
         </Card>

        {/* Add more report cards as needed */}
        {/* - Document Status Report */}
        {/* - Chemical Inventory Report */}
        {/* - JSA Summary Report */}
        {/* - CIPA Meeting/Action Report */}

         <Card className="md:col-span-2 lg:col-span-3 border-dashed border-muted-foreground/50">
           <CardHeader>
             <CardTitle className="text-muted-foreground">Mais Relatórios em Breve</CardTitle>
             <CardDescription className="text-muted-foreground">
               Funcionalidades de geração de relatórios customizados e exportação estão em desenvolvimento.
             </CardDescription>
           </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">Planejamos incluir relatórios de conformidade NR, inventário JSA, resumo de ações preventivas, etc.</p>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}

// src/app/cadastros/responsaveis/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Wrench } from "lucide-react"; // Or another suitable icon

export default function ResponsaveisPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wrench className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">Cadastro de Responsáveis Técnicos</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Responsáveis Técnicos</CardTitle>
          <CardDescription>
            Cadastre e gerencie os responsáveis técnicos por documentos e laudos. (Funcionalidade em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
             Esta seção permitirá adicionar, editar e remover responsáveis técnicos (engenheiros, médicos, etc.) que elaboram documentos como PGR, PCMSO, Laudos.
          </p>
          {/* Placeholder for future form and table */}
        </CardContent>
      </Card>
    </div>
  );
}

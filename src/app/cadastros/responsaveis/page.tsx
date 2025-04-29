// src/app/cadastros/responsaveis/page.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench } from "lucide-react";

export default function ResponsaveisPage() {
  return (
    <div className="container mx-auto p-6">
      <section className="mb-8">
        <div className="flex items-center space-x-4">
          <Wrench className="w-10 h-10 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Cadastro de Responsáveis Técnicos
          </h1>
        </div>
      </section>

      <section>
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Gerenciamento de Responsáveis Técnicos
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground">
              Cadastre e gerencie os responsáveis técnicos por documentos e
              laudos. (Funcionalidade em desenvolvimento)
            </CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            <p className="text-muted-foreground">
              Esta seção permitirá adicionar, editar e remover responsáveis
              técnicos (engenheiros, médicos, etc.) que elaboram documentos como
              PGR, PCMSO, Laudos.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

// src/app/cadastros/instrutores/page.tsx
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export default function InstrutoresPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <section className="mb-6">
        <div className="flex items-center gap-2">
          <UserPlus className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">
            Cadastro de Instrutores
          </h1>
        </div>
      </section>
      <section>
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-lg font-semibold">Gerenciamento de Instrutores</CardTitle>
            <CardDescription className="text-sm text-muted-foreground">Cadastre e gerencie os instrutores dos treinamentos. (Funcionalidade em desenvolvimento)</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Esta seção permitirá adicionar, editar e remover instrutores, associando-os aos tipos de treinamento.</CardContent>
        </Card>
      </section>
    </div>
  );
}

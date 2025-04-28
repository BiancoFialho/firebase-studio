// src/app/cadastros/instrutores/page.tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { UserPlus } from "lucide-react"; // Or another suitable icon

export default function InstrutoresPage() {
  return (
    <div className="space-y-6">
       <div className="flex items-center gap-2">
           <UserPlus className="w-8 h-8 text-primary" />
           <h1 className="text-3xl font-bold tracking-tight">Cadastro de Instrutores</h1>
       </div>
      <Card>
        <CardHeader>
          <CardTitle>Gerenciamento de Instrutores</CardTitle>
          <CardDescription>
            Cadastre e gerencie os instrutores dos treinamentos. (Funcionalidade em desenvolvimento)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
             Esta seção permitirá adicionar, editar e remover instrutores, associando-os aos tipos de treinamento.
          </p>
          {/* Placeholder for future form and table */}
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
      <p className="text-muted-foreground">
        Gerencie as configurações gerais da aplicação.
      </p>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Informações da Empresa</CardTitle>
          <CardDescription>Detalhes da Nery Mecatrônica.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="company-name">Nome da Empresa</Label>
            <Input id="company-name" defaultValue="Nery Mecatrônica" disabled />
          </div>
          {/* Add more company details if needed */}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>Configure alertas e lembretes.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="grid gap-2">
               <Label htmlFor="notification-email">Email para Notificações</Label>
               <Input id="notification-email" type="email" placeholder="seuemail@nerymecatronica.com.br" />
           </div>
           {/* Add toggles for specific notifications (e.g., ASO expiry, Training expiry) */}
           <p className="text-sm text-muted-foreground">Configurações detalhadas de notificação em breve.</p>
           <Button disabled>Salvar Configurações de Notificação</Button>
        </CardContent>
      </Card>

       <Card>
         <CardHeader>
           <CardTitle>Tipos de Treinamento/EPI</CardTitle>
           <CardDescription>Gerencie as opções disponíveis nos formulários.</CardDescription>
         </CardHeader>
         <CardContent>
           <p className="text-sm text-muted-foreground">Gerenciamento de listas personalizadas em breve.</p>
           {/* Add functionality to add/edit/remove training types and PPE types */}
           <Button disabled>Gerenciar Listas</Button>
         </CardContent>
       </Card>

        {/* Add sections for Data Export/Import, User Management (if applicable), etc. */}

    </div>
  );
}

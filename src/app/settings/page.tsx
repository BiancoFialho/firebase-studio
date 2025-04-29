import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações gerais da aplicação.
        </p>
      </div>

      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Informações da Empresa</CardTitle>
            <CardDescription>Detalhes da Nery Mecatrônica.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Nome da Empresa</Label>
              <Input
                id="company-name"
                defaultValue="Nery Mecatrônica"
                disabled
              />
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
            <div className="space-y-2">
              <Label htmlFor="notification-email">
                Email para Notificações
              </Label>
              <Input
                id="notification-email"
                type="email"
                placeholder="seuemail@nerymecatronica.com.br"
              />
            </div>
            {/* Add toggles for specific notifications (e.g., ASO expiry, Training expiry) */}
            <p className="text-sm text-muted-foreground">
              Configurações detalhadas de notificação em breve.
            </p>
            <Button disabled>Salvar Configurações de Notificação</Button>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Tipos de Treinamento/EPI</CardTitle>
            <CardDescription>
              Gerencie as opções disponíveis nos formulários.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Gerenciamento de listas personalizadas em breve.
            </p>
            {/* Add functionality to add/edit/remove training types and PPE types */}
            <Button disabled>Gerenciar Listas</Button>
          </CardContent>
        </Card>
        {/* Add sections for Data Export/Import, User Management (if applicable), etc. */}

          </div>
    </div>
  );
}

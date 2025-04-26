import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, HardHat, ShieldCheck, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Visão Geral - SSMA Control</h1>
      <p className="text-muted-foreground">
        Bem-vindo ao painel de controle de Segurança, Saúde e Meio Ambiente da Nery Mecatrônica.
        Use o menu lateral para navegar pelas funcionalidades.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Treinamentos
            </CardTitle>
            <HardHat className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {/* Replace with dynamic data later */}
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">
              +5 em relação ao mês passado (mock)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              EPIs Gerenciados
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {/* Replace with dynamic data later */}
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +2 novas entregas esta semana (mock)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              ASOs Válidos
            </CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {/* Replace with dynamic data later */}
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              3 ASOs próximos do vencimento (mock)
            </p>
          </CardContent>
        </Card>
         {/* Add more cards for other key metrics later */}
      </div>

      {/* Placeholder for future important alerts or summary */}
       {/* <Card>
          <CardHeader>
            <CardTitle>Alertas Importantes</CardTitle>
             <CardDescription>Notificações e pendências urgentes.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-40 bg-secondary rounded-md">
            <p className="text-muted-foreground">Nenhum alerta no momento.</p>
          </CardContent>
       </Card> */}
    </div>
  );
}

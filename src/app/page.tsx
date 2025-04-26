import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { BarChart3, HardHat, ShieldCheck, Stethoscope } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Visão Geral - SSMA Control</h1>
      <p className="text-muted-foreground">
        Bem-vindo ao painel de controle de Segurança, Saúde e Meio Ambiente da Nery Mecatrônica.
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
            <div className="text-2xl font-bold">150</div>
            <p className="text-xs text-muted-foreground">
              +5 em relação ao mês passado
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
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">
              +2 novas entregas esta semana
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
            <div className="text-2xl font-bold">98%</div>
            <p className="text-xs text-muted-foreground">
              3 ASOs próximos do vencimento
            </p>
          </CardContent>
        </Card>
         {/* Add more cards for other sections later */}
         <Card className="md:col-span-2 lg:col-span-1">
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">
               Estatísticas Gerais
             </CardTitle>
             <BarChart3 className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">Em breve</div>
             <p className="text-xs text-muted-foreground">
               Gráficos e indicadores chave
             </p>
           </CardContent>
         </Card>
      </div>

       {/* Placeholder for future BI/Charts */}
       <Card>
          <CardHeader>
            <CardTitle>Indicadores de Segurança (BI)</CardTitle>
             <CardDescription>Visualização dos principais dados de SSMA.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-64 bg-secondary rounded-md">
            <p className="text-muted-foreground">Gráficos interativos serão exibidos aqui.</p>
          </CardContent>
       </Card>
    </div>
  );
}

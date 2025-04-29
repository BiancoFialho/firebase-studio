import type { Metadata } from 'next';
// Use Geist Sans & Mono directly from the geist package
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';
import { cn } from '@/lib/utils';
import {
    SidebarProvider,
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarTrigger,
    SidebarInset,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarSubmenu,
    SidebarSubmenuItem,
    SidebarSubmenuTrigger,
    SidebarSubmenuContent,
} from '@/components/ui/sidebar'; // Ensure all necessary sidebar components are imported
import Link from 'next/link';
import {
    HardHat, ShieldCheck, Stethoscope, FlaskConical, ClipboardList,
    Users, GraduationCap, ListPlus, UserPlus, Wrench, FileCheck2, Folder,
    Bug, Activity, Landmark, Settings, LayoutDashboard, BarChart3, Scale // Added BarChart3 for Reports
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import React from 'react'; // Import React

// Initialize the fonts correctly
const geistSans = GeistSans; // Use the imported object directly
const geistMono = GeistMono; // Use the imported object directly


export const metadata: Metadata = {
  title: 'EHS Control', // Updated Title
  description: 'Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica', // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
       <head>
           {/* Metadata is handled by Next.js Metadata API */}
           <link rel="icon" href="/favicon.ico" sizes="any" />
           <meta name="description" content="Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica" />
       </head>
       {/* Use the font variables correctly */}
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')} suppressHydrationWarning={true}>
         <SidebarProvider>
           <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r border-sidebar-border">
             <SidebarHeader className="flex items-center justify-between p-3 border-b border-sidebar-border">
               <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                 <HardHat className="h-6 w-6 text-primary" />
                 <span className="font-semibold text-lg text-primary">EHS Control</span>
               </Link>
                <SidebarTrigger className="md:hidden" /> {/* Trigger for mobile */}
             </SidebarHeader>

             <SidebarContent className="flex-1 overflow-y-auto overflow-x-hidden p-1 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:gap-2"> {/* Sidebar Content adjustments */}
               <SidebarMenu>
                 {/* Dashboard Link */}
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard BI">
                      <Link href="/">
                        <LayoutDashboard />
                        <span className="group-data-[collapsible=icon]:hidden">Dashboard BI</span>
                      </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>

                  {/* --- Cadastros Section --- */}
                  <SidebarSubmenu value="cadastros">
                    <SidebarSubmenuItem value="cadastros-trigger">
                        <SidebarSubmenuTrigger tooltip="Cadastros">
                            <ListPlus />
                            <span className="group-data-[collapsible=icon]:hidden">Cadastros</span>
                        </SidebarSubmenuTrigger>
                        <SidebarSubmenuContent>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Colaboradores">
                                    <Link href="/cadastros/colaboradores">
                                        <Users className="text-sidebar-foreground/80" />
                                        Colaboradores
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Tipos de Treinamento">
                                    <Link href="/cadastros/treinamentos">
                                        <GraduationCap className="text-sidebar-foreground/80" />
                                        Tipos Treinamento
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Instrutores">
                                    <Link href="/cadastros/instrutores">
                                        <UserPlus className="text-sidebar-foreground/80" />
                                        Instrutores
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Responsáveis Técnicos">
                                    <Link href="/cadastros/responsaveis">
                                        <Wrench className="text-sidebar-foreground/80" />
                                        Responsáveis Téc.
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarSubmenuContent>
                    </SidebarSubmenuItem>
                  </SidebarSubmenu>

                 {/* --- Separator --- */}
                 <div className="my-2 border-t border-sidebar-border mx-2 group-data-[collapsible=icon]:mx-0"></div>

                 {/* --- Módulos Principais --- */}
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Registros de Treinamentos">
                      <Link href="/trainings">
                         <GraduationCap />
                         <span className="group-data-[collapsible=icon]:hidden">Treinamentos</span>
                       </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="EPIs">
                      <Link href="/ppe">
                         <ShieldCheck />
                         <span className="group-data-[collapsible=icon]:hidden">EPIs</span>
                       </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="ASOs">
                     <Link href="/asos">
                       <Stethoscope />
                       <span className="group-data-[collapsible=icon]:hidden">ASOs</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Inventário Químico">
                     <Link href="/chemicals">
                       <FlaskConical />
                       <span className="group-data-[collapsible=icon]:hidden">Inventário Químico</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Documentos (PGR, PCMSO)">
                     <Link href="/documents">
                       <Folder />
                       <span className="group-data-[collapsible=icon]:hidden">Documentos</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

                  {/* --- Separator --- */}
                  <div className="my-2 border-t border-sidebar-border mx-2 group-data-[collapsible=icon]:mx-0"></div>

                 {/* --- Análise e Planejamento --- */}
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Análise de Riscos (JSA)">
                     <Link href="/jsa">
                       <ClipboardList />
                       <span className="group-data-[collapsible=icon]:hidden">Análise de Riscos</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                  <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Plano de Ação & NRs">
                     <Link href="/action-plan">
                       <FileCheck2 /> {/* Updated Icon */}
                       <span className="group-data-[collapsible=icon]:hidden">Plano de Ação</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

                 {/* --- Separator --- */}
                 <div className="my-2 border-t border-sidebar-border mx-2 group-data-[collapsible=icon]:mx-0"></div>

                  {/* --- Prevenção e Saúde --- */}
                  <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Prevenção (CIPA)">
                     <Link href="/prevention">
                       <Users />
                       <span className="group-data-[collapsible=icon]:hidden">Prevenção (CIPA)</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Doenças Ocupacionais">
                     <Link href="/diseases">
                       <Bug />
                       <span className="group-data-[collapsible=icon]:hidden">Doenças Ocup.</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

                 {/* --- Separator --- */}
                 <div className="my-2 border-t border-sidebar-border mx-2 group-data-[collapsible=icon]:mx-0"></div>

                 {/* --- Estatísticas, Relatórios e Compliance --- */}
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Estatísticas Acidentes">
                     <Link href="/statistics">
                       <Activity />
                       <span className="group-data-[collapsible=icon]:hidden">Estatísticas</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Relatórios">
                     <Link href="/reports">
                       <BarChart3 />
                       <span className="group-data-[collapsible=icon]:hidden">Relatórios</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Ações Trabalhistas">
                     <Link href="/lawsuits">
                       <Landmark />
                       <span className="group-data-[collapsible=icon]:hidden">Ações Trab.</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

               </SidebarMenu>
             </SidebarContent>

             <SidebarFooter className="p-2 mt-auto border-t border-sidebar-border">
               <SidebarMenu>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Configurações">
                     <Link href="/settings">
                       <Settings />
                       <span className="group-data-[collapsible=icon]:hidden">Configurações</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               </SidebarMenu>
             </SidebarFooter>
           </Sidebar>

           {/* Main Content Area */}
           <SidebarInset>
             <header className="flex items-center justify-between p-4 border-b sticky top-0 bg-background/80 backdrop-blur-sm z-10 md:justify-end">
                {/* Trigger for desktop moved to the right */}
                <SidebarTrigger className="hidden md:flex"/>
               {/* Placeholder for potential header content like user profile */}
               <div className="flex items-center gap-4 md:hidden"> {/* Only show company name on mobile header */}
                   <span className="text-sm text-muted-foreground">EHS Control</span>
               </div>
             </header>
             <main className="flex-1 p-4 md:p-6 overflow-auto">
               {children}
             </main>
           </SidebarInset>
         </SidebarProvider>
          <Toaster />
      </body>
    </html>
  );
}



import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
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
  SidebarMenuSub,          // <-- Import Submenu component
  SidebarMenuSubButton,    // <-- Import Submenu button
  SidebarMenuSubItem,      // <-- Import Submenu item
} from '@/components/ui/sidebar';
import Link from 'next/link';
import {
    HardHat, ShieldCheck, Stethoscope, FileText, FlaskConical, ClipboardList,
    BarChart3, Settings, Activity, Bug, Scale, Users, ListChecks, LayoutDashboard,
    Target, Landmark, Folder, GraduationCap, ListPlus, ChevronDown, Building, UserPlus, Wrench // Added Icons
} from 'lucide-react';
import { Toaster } from '@/components/ui/toaster';
import React from 'react'; // Import React

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'SSMA Control',
  description: 'Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
       <head>
           {/* Metadata can be placed here if static */}
           <title>SSMA Control</title>
           <meta name="description" content="Gerenciamento de Segurança, Saúde e Meio Ambiente para Nery Mecatrônica" />
       </head>
       {/* Added suppressHydrationWarning={true} to body tag */}
      <body className={cn(geistSans.variable, geistMono.variable, 'antialiased')} suppressHydrationWarning={true}>
         <SidebarProvider>
           {/* Sidebar component itself */}
           <Sidebar collapsible="icon" variant="sidebar" side="left">
             <SidebarHeader className="flex items-center justify-between p-4">
               <Link href="/" className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                 <HardHat className="h-6 w-6 text-primary" />
                 <span className="font-semibold text-lg text-primary">SSMA Control</span>
               </Link>
                {/* Ensure trigger is inside header */}
                <SidebarTrigger className="md:hidden" />
             </SidebarHeader>
             <SidebarContent className="p-2">
               <SidebarMenu>
                 {/* Dashboard Link */}
                 <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Dashboard BI">
                      <Link href="/">
                        <LayoutDashboard />
                        <span>Dashboard BI</span>
                      </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>

                 {/* Cadastro Section with Submenu */}
                 <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Cadastros" isSubmenuTrigger={true}> {/* Mark as submenu trigger */}
                      <UserPlus />
                      <span>Cadastros</span>
                       {/* Chevron is handled internally by isSubmenuTrigger */}
                    </SidebarMenuButton>
                    <SidebarMenuSub> {/* Submenu container */}
                       <SidebarMenuSubItem>
                           <SidebarMenuSubButton asChild>
                               <Link href="/cadastros/colaboradores">
                                   <Users />
                                   <span>Colaboradores</span>
                               </Link>
                           </SidebarMenuSubButton>
                       </SidebarMenuSubItem>
                       <SidebarMenuSubItem>
                            <SidebarMenuSubButton asChild>
                               <Link href="/cadastros/treinamentos">
                                   <GraduationCap />
                                   <span>Tipos de Treinamento</span>
                               </Link>
                           </SidebarMenuSubButton>
                       </SidebarMenuSubItem>
                        <SidebarMenuSubItem>
                           <SidebarMenuSubButton asChild>
                               <Link href="/cadastros/instrutores">
                                   <UserPlus /> {/* Placeholder icon */}
                                   <span>Instrutores</span>
                               </Link>
                           </SidebarMenuSubButton>
                       </SidebarMenuSubItem>
                       <SidebarMenuSubItem>
                           <SidebarMenuSubButton asChild>
                               <Link href="/cadastros/responsaveis">
                                   <Wrench /> {/* Placeholder icon */}
                                   <span>Responsáveis Técnicos</span>
                               </Link>
                           </SidebarMenuSubButton>
                       </SidebarMenuSubItem>
                   </SidebarMenuSub>
                 </SidebarMenuItem>

                 {/* Core Management Modules */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Registros de Treinamentos">
                      <Link href="/trainings">
                         <GraduationCap /> {/* Changed Icon */}
                         <span>Treinamentos</span>
                       </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="EPIs">
                      <Link href="/ppe">
                         <ShieldCheck />
                         <span>EPIs</span>
                       </Link>
                    </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="ASOs">
                     <Link href="/asos">
                       <Stethoscope />
                       <span>ASOs</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Inventário Químico">
                     <Link href="/chemicals">
                       <FlaskConical />
                       <span>Inventário Químico</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

                 {/* Analysis & Planning */}
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Análise de Riscos (JSA)">
                     <Link href="/jsa">
                       <ClipboardList />
                       <span>Análise de Riscos</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Documentos (PGR, PCMSO)">
                     <Link href="/documents">
                       <Folder /> {/* Icon for Documents */}
                       <span>Documentos</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                  <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Plano de Ação & NRs">
                     <Link href="/action-plan">
                       <ListChecks />
                       <span>Plano de Ação</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

                  {/* Prevention & Health */}
                  <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Prevenção (CIPA)">
                     <Link href="/prevention">
                       <Users />
                       <span>Prevenção (CIPA)</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Doenças Ocupacionais">
                     <Link href="/diseases">
                       <Bug />
                       <span>Doenças Ocup.</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>

                 {/* Statistics & Compliance */}
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Estatísticas Acidentes">
                     <Link href="/statistics">
                       <Activity />
                       <span>Estatísticas</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Ações Trabalhistas">
                     <Link href="/lawsuits">
                       <Landmark />
                       <span>Ações Trab.</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>


                 {/* Future placeholders */}
                 {/* ... other future links ... */}
               </SidebarMenu>
             </SidebarContent>
             <SidebarFooter className="p-2 mt-auto">
               <SidebarMenu>
                 <SidebarMenuItem>
                   <SidebarMenuButton asChild tooltip="Configurações">
                     <Link href="/settings">
                       <Settings />
                       <span>Configurações</span>
                     </Link>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               </SidebarMenu>
             </SidebarFooter>
           </Sidebar>
           {/* SidebarInset should contain the main content area */}
           <SidebarInset>
             <header className="flex items-center justify-between p-4 border-b md:border-none sticky top-0 bg-background/80 backdrop-blur-sm z-10">
                {/* Trigger for desktop */}
                <SidebarTrigger className="hidden md:flex"/>
               {/* Placeholder for potential header content like user profile */}
               <div className="flex items-center gap-4">
                   <span className="text-sm text-muted-foreground hidden sm:inline">Nery Mecatrônica</span>
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
